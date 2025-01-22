<!-- 业务的表单提交逻辑处理 -->
<template>
  <div>
    <template v-if="busCommitActionFirst">
      <a @click.stop="handleCustomAction(busCommitActionFirst.action)">
        <template v-if="!isEmpty(busCommitActionFirst.icon)">
          <icon-font v-if="busCommitActionFirst.icon.indexOf('iconfont-') !== -1" class="s-mr-3" :type="busCommitActionFirst.icon" />
          <a-icon v-else class="s-mr-3" :type="busCommitActionFirst.icon" />
        </template>
        {{ busCommitActionFirst.label }}</a
      >
      <a-divider v-if="busCommitActionsMore" type="vertical" />
    </template>
    <a-dropdown v-if="busCommitActionsMore">
      <a-menu slot="overlay">
        <a-menu-item v-for="item in busCommitActionsMore" :key="item.label">
          <a @click.stop="handleCustomAction(item.action)">
            <template v-if="!isEmpty(item.icon)">
              <icon-font v-if="item.icon.indexOf('iconfont-') !== -1" class="s-mr-3" :type="item.icon" />
              <a-icon v-else class="s-mr-3" :type="item.icon" />
            </template>
            {{ item.label }}</a
          >
        </a-menu-item>
      </a-menu>
      <a @click.stop>
        <icon-font class="s-mr-3" type="iconfont-gengduo" />更多
        <!-- <a-icon type="down" /> -->
      </a>
    </a-dropdown>
  </div>
</template>

<script>
import request from '/src/utils/axios/request.js'
import { busFlowState } from './flow.js'
import { handleProcessHistory } from '/src/views/eos/config/busUtil.js'

export default {
  name: 'BusCommit',
  props: {
    // 业务表单
    busForm: {
      type: Object,
      default: () => {}
    },
    requestMapping: {
      type: String,
      default: ''
    },
    handleUpdate: {
      type: Function,
      default: () => {}
    },
    cantUpdate: {
      type: Boolean,
      default: false
    },
    handleDelete: {
      type: Function,
      default: () => {}
    },
    busCommitActions: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    // 可以提交
    canCommit() {
      return this.busForm.state === busFlowState.unsubmitted
    },
    // 操作列计算
    busCommitActionsComp() {
      if (this.canCommit) {
        return !this.cantUpdate
          ? [
              {
                label: '提交申请',
                icon: 'iconfont-tijiao',
                action: this.handleApply
              },
              {
                label: '修改',
                icon: 'iconfont-bianji',
                action: this._handleUpdate
              },
              {
                label: '删除',
                icon: 'iconfont-shanchu',
                action: this._handleDelete
              },
              ...this.busCommitActions
            ]
          : [
              {
                label: '提交申请',
                icon: 'iconfont-tijiao',
                action: this.handleApply
              },
              {
                label: '删除',
                icon: 'iconfont-shanchu',
                action: this._handleDelete
              },
              ...this.busCommitActions
            ]
      }
      return [
        ...this.busCommitActions,
        {
          label: '审批历史',
          icon: 'clock-circle',
          action: this.handleViewHistoryList
        }
      ]
    },
    // 操作列第一个按钮，是对象
    busCommitActionFirst() {
      return !this.isEmpty(this.busCommitActionsComp) ? this.busCommitActionsComp[0] : null
    },
    // 操作列更多按钮，是数组
    busCommitActionsMore() {
      return !this.isEmpty(this.busCommitActionsComp) && this.busCommitActionsComp.length > 1 ? this.busCommitActionsComp.slice(1) : null
    }
  },
  methods: {
    /* 处理自定义action事件 */
    handleCustomAction(action) {
      if (action instanceof Function) {
        action(this.busForm)
      } else if (typeof action === 'string') {
        this.$emit(action, this.busForm)
      }
    },
    /* 提交申请 */
    handleApply() {
      const code = this.busForm.code ? this.busForm.code : this.busForm.orderCode
      this.$antdconfirm({
        title: '提交申请',
        content: '是否提交编号为"' + code + '"的申请单据?',
        onOk: () => {
          return request({
            url: this.requestMapping + '/submitApply',
            method: 'post',
            params: { tenantAppId: this.$store.getters.tenantAppId, menuId: this.$route.meta.moduleId, dataId: this.busForm.id }
          }).then(response => {
            this.$emit('getList')
            this.$message.success('申请成功', 3)
          })
        }
      })
    },
    /* 修改申请 */
    _handleUpdate() {
      this.handleUpdate(this.busForm)
    },
    /* 删除申请 */
    _handleDelete() {
      this.handleDelete(this.busForm)
    },
    // 查看审批历史
    handleViewHistoryList() {
      handleProcessHistory(this.busForm.sealWorkflow ? this.busForm.sealWorkflow.instanceId : '')
    }
  }
}
</script>
