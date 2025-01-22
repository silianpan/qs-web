<!-- 抄送我的 -->
<template>
  <div>
    <s-search v-if="!simple" placeholder="搜索此列表..." clickTips="搜索姓名、流程名称、审批" @onSearch="onSearch" />
    <no-data index v-show="noData" />
    <s-table v-show="!noData" :customRow="rowClick" :class="{ 'copy-table': simple }" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData"> </s-table>
  </div>
</template>

<script lang="jsx">
import { findTaskCopyList } from '/src/api/activiti/process.js'
import { updateReadUsers } from '/src/api/activiti/workflow.js'
import { busFlowMap, handleProcessHistory } from '/src/views/eos/config/busUtil.js'

import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'
import STable from '/src/components/Table/index.jsx'
import SSearch from '/src/components/Form/Search.vue'

import BusReApply from '../todo/busReApply.vue'
import BusDetail from '../todo/busDetail.vue'

export default {
  name: 'Copy',
  props: {
    simple: {
      type: Boolean,
      default: false
    }
  },
  components: {
    SSearch,
    STable
  },
  data() {
    return {
      /* 是否有数据 */
      noData: false,
      rowClick: record => ({
        on: {
          click: () => {
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
      loadData: param => {
        if (this.simple) {
          param.pageNum = 1
          param.pageSize = 4
        }
        return findTaskCopyList(Object.assign({}, param, this.queryParam)).then(res => {
          this.noData = res.total === 0
          return {
            data: res.rows,
            totalCount: this.simple ? 0 : res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      searchFormItems: [
        {
          type: 'input',
          prop: 'taskName',
          label: '阶段'
        }
      ],
      columns: [
        {
          title: '申请人',
          dataIndex: 'applyUserName',
          align: 'center',
          width: 150
        },
        {
          title: '抄送人',
          dataIndex: 'assigneeNickName',
          align: 'center',
          width: 150
        },
        {
          title: '流程名称',
          dataIndex: 'processName',
          align: 'center',
          customRender: (text, record) => {
            const { processName } = busFlowMap[record.businessType]
            return processName
          },
          width: 150
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
        formId: Number(row.dataId),
        formKey: row.businessType
      }
      if (!this.isEmpty(row.form.sealProject) && !this.isEmpty(row.form.sealProject.id)) {
        fd.projectId = row.form.sealProject.id
      }
      // 标记已读
      this.$emit('read')
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '抄送详情',
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
              this.$refs.table.refresh(true)
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
.copy-table {
  .s-table {
    .ant-table-tbody {
      tr > td {
        border: none;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #666;
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
