<template>
  <div>
    <slot name="header" />
    <a v-if="canTodo" @click.stop="_handleView"> <a-icon v-if="false" class="s-mr-3" type="check" />办理</a>
    <a v-if="canReApply" @click.stop="_handleReApply"> <a-icon v-if="false" class="s-mr-3" type="check" />调整申请</a>
    <template v-if="!simple">
      <a-divider type="vertical" />
      <a-dropdown v-if="canTodo || isTodoItem">
        <a-menu slot="overlay">
          <!-- 可以转办 -->
          <a-menu-item v-if="canTodo">
            <a @click="handleViewUserList"> <a-icon class="s-mr-3" type="user" />转办</a>
          </a-menu-item>
          <!-- 是待办 -->
          <template v-if="isTodoItem">
            <a-menu-item>
              <a @click="handleViewHistoryList"> <a-icon class="s-mr-3" type="clock-circle" />审批历史</a>
            </a-menu-item>
            <a-menu-item v-if="isTodoItem">
              <a @click="handleMarkUnread"> <a-icon class="s-mr-3" type="read" />标记未读</a>
            </a-menu-item>
          </template>
          <!-- 更多插槽 -->
          <slot name="more-menu-item" />
        </a-menu>
        <a @click.stop>更多<a-icon type="down" /></a>
      </a-dropdown>
    </template>
  </div>
</template>

<script>
import { handleProcessHistory } from '/src/views/eos/config/busUtil.js'
import { busFlowState } from './flow.js'
import ViewVerify from './ViewVerify/index.vue'
import UserSelect from './UserSelect.vue'
import MemSelect from '/src/views/eos/project/mem/modules/MemSelect.vue'
import request from '/src/utils/axios/request.js'

export default {
  name: 'ActivitiApply',
  props: {
    // 待办项
    todoItem: {
      type: Object,
      default: () => {}
    },
    // 是否展示简单列
    simple: {
      type: Boolean,
      default: false
    },
    // 上一个审批意见
    preAudit: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    // 没有流程
    noProcess() {
      return this.isEmpty(this.todoItem.instanceId)
    },
    // 是否可以调整申请（有流程，且任务类型为todo，且任务为驳回状态）
    canReApply() {
      return !this.noProcess && this.todoItem.type === 'todo' && this.todoItem.form && this.todoItem.form.state === busFlowState.reject
    },
    // 是否可以办理（有流程，且任务类型为todo，而不是驳回状态）
    canTodo() {
      return !this.noProcess && this.todoItem.type === 'todo' && this.todoItem.form && this.todoItem.form.state !== busFlowState.reject
    },
    // 是待办事项，可以查看历史，标记未读
    isTodoItem() {
      return this.todoItem.type === 'todo'
    }
  },
  methods: {
    // 办理
    _handleView() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '审批',
          width: '50%',
          maskClosable: true
        },
        content: {
          template: ViewVerify,
          props: {
            todoItem: this.todoItem,
            preAudit: this.preAudit,
            isCloseDrawer: true
          },
          on: {
            getList: () => {
              this.$emit('getList')
              this.$emit('ok')
              this.$emit('close')
            },
            delegateTask: () => {
              this.handleViewUserList()
            }
          }
        }
      })
    },
    // 重新提交
    _handleReApply() {
      this.$emit('handleReApply', this.todoItem)
    },
    handleMarkUnread() {
      this.$emit('markUnread')
    },
    handleViewUserList(callBackFunc) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '选择转办的人员',
          width: '50%',
          maskClosable: true
        },
        content: {
          template: MemSelect,
          props: {
            selectType: 'radio'
          },
          on: {
            // 注意，这里的close事件内部组件传递不出来
            // close: () => {}
            ok: async Rows => {
              const { taskId, formId, businessType } = this.todoItem
              request({
                url: '/project/activity/delegate',
                method: 'post',
                data: { taskId: taskId, delegateToUser: Rows[0].userName, dataId: formId, type: businessType }
              }).then(res => {
                this.$emit('getList')
                this.$emit('close')
                if (callBackFunc !== undefined && callBackFunc instanceof Function) {
                  callBackFunc()
                }
              })
            }
          }
        }
      })
    },
    // 查看审批历史
    handleViewHistoryList() {
      handleProcessHistory(this.todoItem.instanceId)
    }
  }
}
</script>
