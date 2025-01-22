<!-- 待办事项 -->
<template>
  <div>
    <s-search v-if="!simple" placeholder="搜索此列表..." clickTips="搜索姓名、流程名称、审批" @onSearch="onSearch" />
    <!-- 数据表格 -->
    <no-data index v-show="noData" />
    <s-table :customRow="rowClick" :class="{ 'dashboard-table': simple }" v-show="!noData" :data="loadData" ref="table" size="default" rowKey="taskId" :columns="columns">
      <span slot="action" slot-scope="text, item">
        <activiti-apply
          :preAudit="{ comment: item.lastHistoricActivity.comment, assigneeName: item.lastHistoricActivity.assigneeName }"
          :simple="simple"
          style="margin-right: 10px; margin-left: auto"
          slot="actions"
          v-if="item && item.taskId"
          :todoItem="item"
          @handleReApply="handleReApply"
          @getList="refresh"
          @markUnread="handleMarkUnread(item)"
        />
      </span>
    </s-table>
  </div>
</template>

<script lang="jsx">
import { listTodo } from '/src/api/activiti/process.js'
import { busFlowMap, handleProcessHistory } from '/src/views/eos/config/busUtil.js'
import { updateReadUsers } from '/src/api/activiti/workflow.js'

import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'
import STable from '/src/components/Table/index.jsx'
import SSearch from '/src/components/Form/Search.vue'
import ActivitiApply from '/src/components/Activiti/index.vue'
import BusReApply from './busReApply.vue'
import BusDetail from './busDetail.vue'
import storage from 'store'

export default {
  name: 'Todo',
  props: {
    // 是否展示简单列
    simple: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ActivitiApply,
    SSearch,
    STable
  },
  data() {
    return {
      /* 是否有数据 */
      noData: false,
      loading: false,
      rowClick: record => ({
        on: {
          click: () => {
            this.handleReadClick(record)
            const { busDetailCompName } = busFlowMap[record.businessType]
            this.handleDetail(record, busDetailCompName)
          }
        },
        style: {
          cursor: 'pointer'
        }
      }),
      busFlowMap,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        if (this.simple) {
          param.pageNum = 1
          param.pageSize = 4
        }
        return listTodo(Object.assign({}, param, this.queryParam)).then(res => {
          this.noData = res.total === 0
          this.$store.commit('SET_TODOTOTAL', res.total)
          return {
            data: res.rows,
            totalCount: this.simple ? 0 : res.total,
            pageNum:  param.pageNum ,
            pageSize: param.pageSize 
          }
        })
      },
      columns: [
        {
          title: '姓名',
          dataIndex: 'applyUserName',
          align: 'center',
          width: 150,
          customRender: (text, record) => {
            return <span class={this.isReadTask(record)}>{text}</span>
          }
        },
        {
          title: '流程名称',
          dataIndex: 'processName',
          align: 'center',
          customRender: (text, record) => {
            const { processName } = busFlowMap[record.businessType]
            return <span class={this.isReadTask(record)}>{processName}</span>
          },
          width: 110
        },
        {
          title: '审批',
          dataIndex: 'taskName',
          align: 'center',
          width: 170,
          customRender: (text, record) => {
            return <span class={this.isReadTask(record)}>{text}</span>
          }
        },
        {
          title: '项目名称',
          dataIndex: 'name',
          align: 'center',
          customRender: (text, record) => {
            let templateProp = null
            const { busFieldProp, busFieldProp2 } = busFlowMap[record.businessType]
            templateProp = this._.get(record.form, busFieldProp, '') ? busFieldProp : busFieldProp2
            return (
              <div class={this.isReadTask(record)} style="cursor: pointer">
                <Ellipsis length={30} tooltip>
                  {this._.get(record.form, templateProp, '')}
                </Ellipsis>
              </div>
            )
          }
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          width: 170
        }
      ]
    }
  },
  methods: {
    handleDetail(row, detailCompName) {
      if (this.isEmpty(detailCompName)) {
        return this.$message.error('请传递详情组件')
      }
      const fd = {
        row: row.form,
        formId: row.formId,
        formKey: row.formKey
      }
      if (!this.isEmpty(row.form.sealProject) && !this.isEmpty(row.form.sealProject.id)) {
        fd.projectId = row.form.sealProject.id
      }
      // 标记已读
      this.$emit('read')
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '待办详情',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: BusDetail,
          props: {
            ...fd,
            detailCompName: detailCompName,
            todoItem: row,
            isOnlyShowProcess: false
          },
          on: {
            getList: () => {
              this.refresh()
              this.$emit('refresh')
              this.$emit('close')
            }
          }
        }
      })
    },
    // 查看审批历史
    handleProcessHistory,
    handleReApply(todoItem) {
      const busItem = busFlowMap[todoItem.businessType]
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: todoItem.taskName,
          width: '85%',
          maskClosable: true
        },
        content: {
          template: BusReApply,
          props: {
            todoItem,
            busReApplyCompName: busItem.busReApplyCompName
          },
          on: {
            ok: () => {
              this.refresh()
            }
          }
        }
      })
    },
    // 已读事件
    handleReadClick(item) {
      updateReadUsers(item.workflowId, item.taskId, 1).then(res => {
        // 设置本地缓存
        this.$set(item, 'isRead', true)
      })
    },
    // 未读事件
    handleMarkUnread(item) {
      updateReadUsers(item.workflowId, item.taskId, 0).then(res => {
        // 设置本地缓存
        this.$set(item, 'isRead', false)
      })
    },
    // 判断是否已读
    isReadTask(item) {
      if (item.isRead !== undefined && item.isRead !== null) {
        return item.isRead ? '' : 'info-unread'
      }
      if (!this.isEmpty(item.readUsers)) {
        const readUsers = item.readUsers
        const userObj = JSON.parse(readUsers)
        if (!this.isEmpty(userObj[item.taskId])) {
          if (userObj[item.taskId].indexOf(this.$store.getters.userName) !== -1) {
            return ''
          }
        }
      }
      return 'info-unread'
    },
    /* 查询按钮 */
    onSearch(data, event) {
      // 映射businessType为英文做条件查询
      let queryAllBusType = null
      for (const key in busFlowMap) {
        const value = busFlowMap[key]
        if (!this.isEmpty(value) && !this.isEmpty(value.processName) && value.processName.indexOf(data) !== -1) {
          queryAllBusType = key
          break
        }
      }
      this.queryParam = { ...this.queryParam, queryAll: data, queryAllBusType }
      this.refresh()
    },
    // 刷新页面
    refresh() {
      this.$refs.table.refresh()
    }
  }
}
</script>
<style lang="less">
.dashboard-table {
  .s-table {
    .ant-table-tbody {
      tr > td {
        border: none;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #333;
      }
    }
    .ant-table-thead {
      tr {
        > th {
          background-color: transparent !important;
          color: black;
          border: none;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #333333;
        }
      }
    }
  }
}
</style>
