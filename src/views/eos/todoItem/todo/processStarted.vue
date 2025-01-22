<!-- 我的发起 -->
<template>
  <div>
    <s-search v-if="!simple" placeholder="搜索此列表..." clickTips="搜索姓名、流程名称、审批" @onSearch="onSearch" />
    <!-- 数据表格 -->
    <no-data index v-show="noData" />
    <s-table v-show="!noData" :customRow="rowClick" :class="{ 'process-started-table': simple }" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" />
  </div>
</template>

<script lang="jsx">
import moment from 'moment'
import { findProcessStarted } from '/src/api/activiti/process.js'
import { busFlowMap } from '/src/views/eos/config/busUtil.js'

import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'
import STable from '/src/components/Table/index.jsx'
import SSearch from '/src/components/Form/Search.vue'
import BusDetail from './busDetail.vue'

export default {
  props: {
    // 是否展示简单列
    simple: {
      type: Boolean,
      default: false
    }
  },
  components: {
    STable,
    SSearch
  },
  data() {
    return {
      /* 是否有数据 */
      noData: false,
      rowClick: record => ({
        on: {
          click: () => {
            const { busDetailCompName } = busFlowMap[record.type]
            this.handleDetail(record, busDetailCompName)
          }
        },
        style: {
          cursor: 'pointer'
        }
      }),
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        if (this.simple) {
          param.pageNum = 1
          param.pageSize = 4
        }
        return findProcessStarted(Object.assign({}, param, this.queryParam)).then(res => {
          this.noData = res.total === 0
          return {
            data: res.rows,
            totalCount: this.simple ? 0 : res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      columns: [
        {
          title: '发起时间',
          dataIndex: 'createTime',
          align: 'center',
          width: 200,
          customRender: text => moment(text).format('MM-DD HH:mm')
        },
        {
          title: '流程名称',
          dataIndex: 'processName',
          align: 'center',
          customRender: (_, item) => {
            const { processColor, processName } = busFlowMap[item.type]
            return processName
          },
          width: 150
        },
        {
          title: '项目名称',
          dataIndex: 'name',
          align: 'center',
          customRender: (text, record) => {
            const { busFieldProp, busDetailCompName } = busFlowMap[record.type]
            return (
              <div style="cursor: pointer">
                <Ellipsis length={80} tooltip>
                  {this._.get(record.form, busFieldProp, '')}
                </Ellipsis>
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    // 点击查看业务表单详细
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
          title: '我的发起详情',
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
      this.$refs.table.refresh(true)
    }
  }
}
</script>
<style lang="less">
.process-started-table {
  .s-table {
    .ant-table-tbody {
      tr > td {
        border: none;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #333333;
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
