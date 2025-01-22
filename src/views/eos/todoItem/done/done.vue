<!-- 已办事项 -->
<template>
  <div>
    <!-- 查询表单，若无数据，不展示 -->
    <s-search v-if="!simple" placeholder="搜索此列表..." clickTips="搜索姓名、流程名称、审批" @onSearch="onSearch" />
    <!-- 数据表格 -->
    <no-data index v-show="noData" />
    <s-table :customRow="rowClick" v-show="!noData" class="todo-table" :class="{ 'done-table': simple }" ref="table" size="default" rowKey="taskId" :columns="columns" :data="loadData"> </s-table>
  </div>
</template>

<script lang="jsx">
import { listDone } from '/src/api/activiti/process.js'
import { busFlowMap } from '/src/views/eos/config/busUtil.js'

import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'
import STable from '/src/components/Table/index.jsx'
import SSearch from '/src/components/Form/Search.vue'
import BusDetail from '../todo/busDetail.vue'

export default {
  name: 'Done',
  components: {
    SSearch,
    STable
  },
  props: {
    // 是否有加载按钮
    reload: {
      type: Boolean,
      default: true
    },
    // 是否展示简单列
    simple: {
      type: Boolean,
      default: false
    }
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
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        if (this.simple) {
          param.pageNum = 1
          param.pageSize = 4
        }
        return listDone(Object.assign({}, param, this.queryParam)).then(res => {
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
          title: '姓名',
          dataIndex: 'applyUserName',
          align: 'center',
          width: 150
        },
        {
          title: '流程名称',
          dataIndex: 'processName',
          align: 'center',
          customRender: (text, record) => {
            const { processColor, processName } = busFlowMap[record.businessType]
            return processName
          },
          width: 110
        },
        {
          title: '审批',
          dataIndex: 'taskName',
          align: 'center',
          width: 120
        },
        {
          title: '办理日期',
          dataIndex: 'endTime',
          align: 'center',
          // width: 140
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
          title: '已办详情',
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
    // 刷新页面
    refresh() {
      this.$refs.table.refresh()
    },
    // 获取业务流程数据
    getBusFlow(item) {
      return { ...item.formData, taskId: item.taskId, taskName: item.taskName, type: item.type }
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
    }
  }
}
</script>
<style lang="less">
.done-table {
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
