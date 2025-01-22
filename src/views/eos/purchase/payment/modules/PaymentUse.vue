<!-- 付款使用情况：根据项目ID获取付款信息 -->
<template>
  <div>
    <!-- 查询表单 -->
    <div class="table-page-search-wrapper">
      <s-form search layout="inline" @search="$refs.table.refresh(true)" @reset="reset" :formItems="searchFormItems" :formData="queryParam" />
    </div>

    <!-- 业务操作按钮 -->
    <div class="table-operations">
      <a-button ghost type="primary" icon="export" @click="handleExport">导出</a-button>
      <a-button type="dashed" shape="circle" :style="{ float: 'right' }" icon="reload" @click="$refs.table.refresh(true)" />
    </div>

    <!-- 数据表格 -->
    <s-table ref="table" rowKey="id" :columns="columns" :data="loadData" />
  </div>
</template>

<script lang="jsx">
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config'
import { queryUsed, exportPaymentExcel } from '/src/api/eos/purchase/payment.js'
import { listMerchant } from '/src/api/eos/merchant/merchant.js'

import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'
import SForm from '/src/components/Form/index.jsx'
import STable from '/src/components/Table/index.jsx'
import PaymentDetail from '../detail.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  name: 'Payment',
  components: {
    SForm,
    STable
  },
  props: {
    projectId: {
      type: Number,
      default: null
    },
    // 预算类型：生产预算、销售预算、管理预算
    budgetType: {
      type: String,
      default: null
    },
    budgetTypeId: {
      type: Number,
      default: null
    },
    // 费用类型
    expenseType: {
      type: String,
      default: null
    },
    // 创建时间
    createTime: {
      type: String,
      default: null
    },
    projectCode: {
      type: String,
      default: null
    },
    startTime: {
      type: Date,
      default: null
    },
    endTime: {
      type: Date,
      default: null
    },
    region: {
      type: String,
      default: null
    },
    deptId: {
      type: Number,
      default: null
    },
    deptTime: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dictKeys: [dictConfig.PROJECT_UNIT, dictConfig.PROJECT_INVOICE_TYPE],
      dictMap: {},
      merchantList: [],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        param.projectId = this.projectId
        param.budgetType = this.budgetType
        param.expenseType = this.expenseType
        param.createTime = this.createTime
        param.projectCode = this.projectCode
        param.budgetTypeId = this.budgetTypeId
        param.deptId = this.deptId
        param.deptTime = this.deptTime
        if (!this.isEmpty(this.startTime)) {
          param.startTime = moment(this.startTime).format('YYYY-MM') + '-01 00:00:00'
        }
        if (!this.isEmpty(this.endTime)) {
          param.endTime = moment(this.endTime).format('YYYY-MM') + '-31 23:59:59'
        }
        param.region = this.region
        return queryUsed(Object.assign({}, param, this.queryParam)).then(res => {
          const dataList = []
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
        }
      ],
      columns: [
        {
          title: '申请人',
          dataIndex: 'sysUser.nickName'
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          customRender: (text, record) => {
            return <AuditStatusTag state={text} instanceId={record.instanceId} />
          }
        },
        {
          title: '申请单号',
          dataIndex: 'code',
          align: 'center',
          customRender: (text, record) => {
            return (
              <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleDetail(record)}>
                {text}
              </span>
            )
          }
        },
        {
          title: '付款单位',
          dataIndex: 'company',
          align: 'center',
          customRender: text => {
            return (
              <Ellipsis length={20} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '收款单位',
          dataIndex: 'sealMerchant.name',
          align: 'center',
          customRender: text => {
            return text ? (
              <Ellipsis length={20} tooltip>
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
        //   align: 'center',
        //   customRender: text => {
        //     const ret = this.selectDictItem(this.dictMap[dictConfig.PROJECT_INVOICE_TYPE], text)
        //     return <a-tag color={ret.listClass}>{ret.dictLabel}</a-tag>
        //   }
        // },
        // {
        //   title: '是否已经开具发票',
        //   dataIndex: 'invoiceHas',
        //   align: 'center',
        //   customRender: text => {
        //     return <a-tag color={text === '已开' ? 'green' : 'orange'}>{text}</a-tag>
        //   }
        // },
        {
          title: '付款事由说明',
          dataIndex: 'reason',
          align: 'center',
          customRender: text => {
            return (
              <Ellipsis length={20} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '合同编号',
          dataIndex: 'sealContract.code',
          align: 'center'
        },
        {
          title: '合同名称',
          dataIndex: 'sealContract.name',
          align: 'center'
        },
        {
          title: '本次付款金额(元)',
          dataIndex: 'payMoney',
          align: 'left'
        },
        {
          title: '附件',
          dataIndex: 'attachment',
          customRender: text => {
            return <s-doc-list text={text} />
          }
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
    reset() {
      this.queryParam = { isAsc: 'desc', orderByColumn: 'create_time' }
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
    /** 导出按钮操作 */
    handleExport(text, record) {
      this.$antdconfirm({
        title: '导出',
        content: '是否导出采购付款数据?',
        onOk: () => {
          const QueryParams = { ...this.queryParam }
          QueryParams.projectId = this.projectId
          QueryParams.budgetType = this.budgetType
          QueryParams.expenseType = this.expenseType
          QueryParams.createTime = this.createTime
          return exportPaymentExcel(Object.assign({}, QueryParams)).then(res => {
            this.download(res.msg)
          })
        }
      })
    }
  }
}
</script>
