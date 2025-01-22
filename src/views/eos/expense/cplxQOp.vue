<!-- 报销综合查询 -->
<template>
  <a-card :bordered="false">
    <!-- 查询表单 -->
    <s-search
      @onSearch="onSearch"
      @clickquery="clickquery"
      @reset="() => (this.queryParam = { isAsc: 'desc', zh: 'zh', orderByColumn: 'createTime' })"
      placeholder="搜索词列表"
      clickTips="搜索报销名称"
      :queryList="queryList"
      :formItems="searchFormItems"
      :formData="queryParam"
    >
      <div style="display: flex">
        <div style="margin-left: 10px"><a-button ghost type="primary" icon="download" @click="handleExport(record)">导出报销明细</a-button></div>
        <div style="margin-left: 10px"><a-button ghost type="primary" icon="download" @click="handleExportCode(record)">导出报销单</a-button></div>
      </div>
    </s-search>
    <no-data v-show="noData" />
    <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData"> </s-table>
  </a-card>
</template>

<script lang="jsx">
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { STable, Ellipsis, SSearch } from '/src/components/index.js'
import { listExpense, exportDetail, exportExpense } from '/src/api/eos/expense/expense.js'
import expenseDetail from './details.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import { BigType } from '/src/api/eos/budget/type.js'

export default {
  name: 'CplxQOp',
  components: {
    STable,
    SSearch
  },
  data() {
    return {
      rowClick: record => ({
        on: {
          click: () => {
            this.handleDetail(record, record.id)
          }
        },
        style: {
          cursor: 'pointer'
        }
      }),
      budgetTypeList: [],
      noData: false,
      dictKeys: [dictConfig.PROJECT_BUDGET_TYPE, dictConfig.SEAL_FLOW_STAGE],
      dictMap: {},
      selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        zh: 'zh',
        orderByColumn: 'createTime'
      },
      /* 查询列表 */
      queryList: [
        { text: '按金额', query: 'sum' },
        { text: '按结束日期', query: 'update_time' }
      ],
      /* 当前查询的按钮 */
      current: '',
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        if (!this.isEmpty(this.queryParam.applyDateRange)) {
          this.queryParam.startTime = moment(this.queryParam.applyDateRange[0]).format('YYYY-MM-DD') + ' 00:00:00'
          this.queryParam.endTime = moment(this.queryParam.applyDateRange[1]).format('YYYY-MM-DD') + ' 23:59:59'
          delete this.queryParam.applyDateRange
        }
        // 时间范围
        if (!this.isEmpty(this.queryParam.endDateRange)) {
          this.queryParam.paymentStart = moment(this.queryParam.endDateRange[0]).format('YYYY-MM-DD') + ' 00:00:00'
          this.queryParam.paymentEnd = moment(this.queryParam.endDateRange[1]).format('YYYY-MM-DD') + ' 23:59:59'
          delete this.queryParam.endDateRange
        }
        return listExpense(Object.assign({}, param, this.queryParam)).then(res => {
          const dataList = res.rows
          this.noData = res.total === 0
          return {
            data: dataList,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      columns: [
        {
          title: '报销人',
          align: 'left',
          dataIndex: 'sysUser.nickName'
        },
        // {
        //   title: '报销单号',
        //   align: 'left',
        //   dataIndex: 'code',
        //   width: 180
        // },
        {
          title: '当前任务',
          align: 'left',
          dataIndex: 'sealWorkflow.taskName'
        },
        {
          title: '报销日期',
          dataIndex: 'createTime',
          align: 'left',
          customRender: text => moment(text).format('YYYY-MM-DD')
        },
        {
          title: '所属项目/部门',
          align: 'left',
          dataIndex: 'sealProject.name',
          customRender: (text, record) => {
            return (
              <Ellipsis length={32} tooltip>
                {(text = record.sealProject ? record.sealProject.name : record.sysDept.deptName)}
              </Ellipsis>
            )
          }
        },
        {
          title: '报销总金额(元)',
          dataIndex: 'sum',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '报销事由',
          dataIndex: 'content',
          align: 'left',
          customRender: text => {
            return text ? (
              <Ellipsis length={32} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          align: 'left',
          customRender: (text, record) => {
            return <AuditStatusTag clickable state={text} instanceId={record.sealWorkflow.instanceId} />
          }
        },
        {
          title: '结束日期',
          dataIndex: 'updateTime',
          align: 'left',
          customRender: (text, record) => {
            return record.state !== 0 ? '' : text === null ? '' : moment(text).format('YYYY-MM-DD')
          }
        }
      ],
      searchFormItems: [
        {
          type: 'input',
          label: '报销人',
          prop: 'nickName'
        },
        {
          type: 'input',
          label: '报销金额(元)',
          prop: 'sum'
        },
        {
          type: 'input',
          label: '报销单号',
          prop: 'code'
        },
        {
          type: 'input',
          label: '报销内容',
          prop: 'content'
        },
        {
          type: 'input',
          label: '所属项目',
          prop: 'projectName'
        },
        {
          type: 'select',
          label: '预算类型',
          valueAlias: 'type',
          labelAlias: 'type',
          options: item => this.budgetTypeList,
          prop: 'type'
        },
        {
          type: 'autoComplete',
          label: '审批阶段',
          prop: 'stage',
          options: () => this.dictMap[dictConfig.SEAL_FLOW_STAGE].map(item => item.dictValue)
        },
        {
          type: 'datePickerRange',
          label: '申请日期',
          prop: 'applyDateRange'
        },
        {
          type: 'datePickerRange',
          label: '结束日期',
          prop: 'endDateRange'
        }
      ]
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  created() {
    // 查询字典
    this.dictKeys.forEach(key => {
      this.getDicts(key).then(res => {
        this.$set(this.dictMap, key, res.data)
      })
    })
    BigType().then(res => {
      this.budgetTypeList = res.data
    })
  },
  methods: {
    // 刷新页面
    refresh() {
      this.$refs.table.refresh(true)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /** 导出报销明细操作 */
    handleExport() {
      this.$antdconfirm({
        title: '导出报销明细',
        content: '是否确认导出所有报销明细数据项?',
        onOk: () => {
          exportDetail(this.queryParam).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /** 导出报销单操作 */
    handleExportCode() {
      this.$antdconfirm({
        title: '导出报销单',
        content: '是否确认导出所有报销单数据项?',
        onOk: () => {
          exportExpense(this.queryParam).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /** 详情 */
    handleDetail(row, formId) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '报销详情',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: expenseDetail,
          props: {
            row,
            formId
          }
        }
      })
    },
    /* 查询按钮 */
    clickquery(param, index) {
      this.current = index
      this.queryParam = { ...this.queryParam, orderByColumn: param }
      this.refresh()
    },
    /* 查询按钮 */
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    }
  }
}
</script>
<style lang="less" scoped>
.inputquery {
  margin-right: 20px;
  width: 500px;
}
.queryList {
  display: flex;
  padding: 0;
  margin-right: 30px;
  li {
    text-align: center;
    padding: 4px;
    width: 80px;
    height: 31px;
    border: 1px solid #ccc;
    cursor: pointer;
    &:not(.current):hover {
      color: #13c2c2;
      border: 1px solid #13c2c2;
    }
  }
}
.current {
  color: white;
  background-color: #13c2c2;
  border: 1px solid #13c2c2;
}
</style>
