<!-- 付款综合查询 -->
<template>
  <a-card :bordered="false">
    <!-- 查询表单 -->

    <!-- 查询表单，若无数据，不展示 -->
    <s-search
      placeholder="搜索此列表..."
      clickTips="搜索项目名称、申请单号、付款事由、收款单位"
      @onSearch="onSearch"
      @clickquery="clickquery"
      @reset="() => (this.queryParam = { isAsc: 'desc', zh: 'zh', orderByColumn: 'createTime' })"
      :queryList="queryList"
      :formItems="searchFormItems"
      :formData="queryParam"
    >
      <a-button v-if="!noData" ghost type="primary" icon="export" @click="handleExportExcel">导出采购付款详情</a-button>
      <a-button v-if="!noData" ghost type="primary" icon="export" @click="handleExportListExcel" style="margin-left: 10px">导出采购付款列表</a-button>
    </s-search>
    <no-data v-show="noData" />
    <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
      <!-- <span slot="action" slot-scope="text, record">
        <a-button ghost type="primary" icon="export" @click="handleExport(record)">导出</a-button>
      </span> -->
      <span slot="action" slot-scope="text, record">
        <s-action-columns :actions="getTableActions(record)" :record="record" />
      </span>
    </s-table>
  </a-card>
</template>

<script lang="jsx">
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { listPayment, exportPayment, exportPaymentExcel, exportPaymentListExcel } from '/src/api/eos/purchase/payment.js'
import { listMerchant } from '/src/api/eos/merchant/merchant.js'
import { STable, Ellipsis, SSearch, SActionColumns } from '/src/components/index.js'
import PaymentDetail from './detail.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  name: 'PaymentLOp',
  components: {
    STable,
    SSearch,
    SActionColumns
  },
  data() {
    return {
      rowClick: record => ({
        on: {
          click: () => {
            this.handleDetail(record)
          }
        },
        style: {
          cursor: 'pointer'
        }
      }),
      actions: [
        {
          label: '导出',
          icon: 'export',
          action: this.handleExport
        }
      ],
      /* 是否有数据 */
      noData: false,
      dictKeys: [dictConfig.PROJECT_UNIT, dictConfig.PROJECT_INVOICE_TYPE],
      dictMap: {},
      merchantList: [],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time'
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
        // 时间范围
        if (!this.isEmpty(this.queryParam.dateRange)) {
          this.queryParam.paymentStart = moment(this.queryParam.dateRange[0]).format('YYYY-MM-DD') + ' 00:00:00'
          this.queryParam.paymentEnd = moment(this.queryParam.dateRange[1]).format('YYYY-MM-DD') + ' 23:59:59'
          delete this.queryParam.dateRange
        }
        // // 是否排序按结束日期
        // if (this.queryParam.orderByColumn === 'update_time') {
        //   this.queryParam.state = 0
        // }
        const QueryParams = { ...this.queryParam }
        return listPayment(Object.assign({}, param, QueryParams)).then(res => {
          this.noData = res.total === 0
          // const dataList = []
          // res.rows.forEach(item => {
          //   if (item.busForm) {
          //     dataList.push({ ...item.busForm, busFlow: item.busFlow })
          //   }
          // })
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      searchFormItems: [
        {
          type: 'input',
          label: '申请人',
          prop: 'nickName'
        },
        {
          type: 'input',
          label: '付款金额(元)',
          prop: 'payMoney'
        },
        {
          type: 'input',
          label: '采购事由',
          prop: 'reason'
        },
        {
          type: 'select',
          label: '付款单位',
          prop: 'company',
          options: () => this.dictMap[dictConfig.PROJECT_UNIT]
        },
        {
          type: 'select',
          label: '收款单位',
          prop: 'payeeId',
          valueAlias: 'id',
          labelAlias: 'name',
          options: () => this.merchantList
        },
        {
          type: 'input',
          label: '项目名称',
          prop: 'projectName'
        },
        {
          type: 'input',
          label: '合同名称',
          prop: 'contractName'
        },
        {
          type: 'select',
          label: '审批状态',
          prop: 'state',
          valueAlias: 'value',
          labelAlias: 'label',
          options: () => [
            { label: '通过', value: '0' },
            { label: '未提交', value: '1' },
            { label: '流程中', value: '2' },
            { label: '驳回', value: '3' },
            { label: '结束', value: '4' }
          ]
        },
        {
          type: 'datePickerRange',
          label: '付款时间',
          prop: 'dateRange'
        }
      ],
      columns: [
        {
          title: '申请人',
          align: 'left',
          dataIndex: 'sysUser.nickName'
        },
        {
          title: '申请时间',
          align: 'left',
          dataIndex: 'createTime',
          customRender: text => {
            if (text) {
              return moment(text).format('YYYY-MM-DD')
            } else {
              return ''
            }
          }
        },
        {
          title: '当前任务',
          align: 'left',
          dataIndex: 'sealWorkflow.taskName'
        },
        {
          title: '收款单位',
          dataIndex: 'sealMerchant.name',
          align: 'left',
          customRender: text => {
            return text ? (
              <Ellipsis length={12} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        // {
        //   title: '发票类型',
        //   dataIndex: 'invoiceType',
        //   align: 'left',
        //   customRender: text => {
        //     const ret = this.selectDictItem(this.dictMap[dictConfig.PROJECT_INVOICE_TYPE], text)
        //     return <a-tag color={ret.listClass}>{ret.dictLabel}</a-tag>
        //   }
        // },
        // {
        //   title: '是否已经开具发票',
        //   dataIndex: 'invoiceHas',
        //   align: 'left',
        //   customRender: text => {
        //     return <a-tag color={text === '已开' ? 'green' : 'orange'}>{text}</a-tag>
        //   }
        // },
        {
          title: '付款事由说明',
          dataIndex: 'reason',
          align: 'left',
          customRender: text => {
            return (
              <Ellipsis length={16} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        // {
        //   title: '项目编号',
        //   dataIndex: 'sealProject.code',
        //   align: 'left'
        // },
        {
          title: '项目/部门',
          dataIndex: 'sealProject.name',
          align: 'left',
          customRender: (text, record) => {
            return record.sealProject ? (
              <Ellipsis length={32} tooltip>
                {record.sealProject.name}
              </Ellipsis>
            ) : record.dept ? (
              <Ellipsis length={32} tooltip>
                {record.deptTime + '年' + record.dept.deptName}
              </Ellipsis>
            ) : null
          }
        },
        {
          title: '本次付款金额(元)',
          dataIndex: 'payMoney',
          align: 'left',
          customRender: text => this.toThousandFilter(text)
        },
        // {
        //   title: '附件',
        //   dataIndex: 'attachment',
        //   customRender: text => {
        //     return <s-doc-list text={text} />
        //   }
        // },
        {
          title: '审批状态',
          align: 'center',
          dataIndex: 'state',
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
        },
        {
          title: '操作',
          width: 160,
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  created() {
    // 查询字典
    this.dictKeys.forEach(key => {
      this.getDicts(key).then(res => {
        this.$set(this.dictMap, key, res.data)
      })
    })
    listMerchant().then(res => {
      this.merchantList = res.rows
    })
  },
  methods: {
    // 刷新页面
    refresh() {
      this.$refs.table.refresh(true)
    },
    reset() {
      this.queryParam = { isAsc: 'desc', orderByColumn: 'create_time' }
    },
    /** 导出按钮操作 */
    handleExport(row) {
      this.$antdconfirm({
        title: '导出',
        content: '是否确认导出该付款申请数据项?',
        onOk: () => {
          return exportPayment(row.id).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /** 详情 */
    handleDetail(row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '付款申请详情',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: PaymentDetail,
          props: {
            row
          }
        }
      })
    },
    /** 导出EXCEL */
    handleExportExcel(text, record) {
      this.$antdconfirm({
        title: '导出',
        content: '是否导出采购付款详情?',
        onOk: () => {
          const QueryParams = { ...this.queryParam }
          if (!this.isEmpty(QueryParams.paymentEnd)) {
            QueryParams.paymentEnd = moment(QueryParams.paymentEnd).format('YYYY-MM')
          }
          return exportPaymentExcel(Object.assign({}, QueryParams)).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    handleExportListExcel() {
      this.$antdconfirm({
        title: '导出',
        content: '是否导出采购付款列表?',
        onOk: () => {
          const QueryParams = { ...this.queryParam }
          if (!this.isEmpty(QueryParams.paymentEnd)) {
            QueryParams.paymentEnd = moment(QueryParams.paymentEnd).format('YYYY-MM')
          }
          return exportPaymentListExcel(Object.assign({}, QueryParams)).then(res => {
            this.download(res.msg)
          })
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
    },
    getTableActions(record) {
      return this.actions
    }
  }
}
</script>
<style lang="less" scoped>
.search {
  display: flex;
}
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
