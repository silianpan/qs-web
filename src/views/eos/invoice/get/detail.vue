<!-- 票据登记详情 -->
<template>
  <div>
    <s-descriptions :title="title" :formItems="formItems" :formData="this.row" />
    <!-- 数据表格 -->
    <a-card :bordered="false" size="small">
      <a-collapse expand-icon-position="right" defaultActiveKey="付款详情">
        <a-collapse-panel key="付款详情" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">付款详情</span>
          <s-table ref="table" size="default" :customRow="rowClick" rowKey="id" :columns="columns" :data="loadData" :show-pagination="false"> </s-table>
        </a-collapse-panel>
      </a-collapse>
    </a-card>
  </div>
</template>

<script lang="jsx">
import { SDescriptions, STable, Ellipsis } from '/src/components/index.js'
import PaymentDetail from '/src/views/eos/purchase/payment/detail.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  name: 'GetDetail',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    SDescriptions,
    STable
  },
  computed: {
    title() {
      return `${this.row.getType || ''}详情`
    },
    formItems() {
      return [
        {
          label: '票据类型',
          prop: 'getType'
        },
        {
          label: '收票单号',
          prop: 'code'
        },
        {
          label: '申请人',
          prop: 'code',
          customRender: (text, record) => {
            return record.sysUser.nickName
          }
        },
        {
          label: '收票时间',
          prop: 'getTime'
        },
        {
          label: '开具时间',
          prop: 'makeTime'
        },
        {
          label: '项目名称',
          prop: 'projectName'
        },
        {
          label: '合同名称',
          prop: 'contractName'
        },
        {
          label: '合同金额(元)',
          prop: 'contractMoney'
        },
        {
          label: '甲方',
          prop: 'firstParty'
        },
        {
          label: '乙方',
          prop: 'secondParty'
        },
        {
          label: '发票类型',
          prop: 'type'
        },
        {
          label: '发票号码',
          prop: 'invoiceNum'
        },
        {
          label: '联次',
          prop: 'lianTimes'
        },
        {
          label: '收入类型(针对开票)',
          prop: 'inType'
        },
        {
          label: '金额',
          prop: 'money'
        },
        {
          label: '税率(%)',
          prop: 'taxRate'
        },
        {
          label: '税额',
          prop: 'taxAmount'
        },
        {
          label: '税价合计',
          prop: 'moneyAndTax'
        },
        {
          label: `合同${this.row.getType || ''}比例合计(%)`,
          prop: 'rate'
        },
        {
          label: `合同${this.row.getType || ''}金额合计(元)`,
          prop: 'payed'
        }
      ]
    }
  },
  data() {
    return {
      rowClick: record => ({
        on: {
          click: () => {
            this.paymentHandleDetail(record)
          }
        },
        style: {
          cursor: 'pointer'
        }
      }),
      columns: [
        {
          title: '申请单号',
          dataIndex: 'code',
          align: 'center',
          customRender: (text, record) => {
            return (
              <Ellipsis length={16} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '项目名称',
          dataIndex: 'sealProject.name',
          align: 'center'
        },
        {
          title: '合同名称',
          dataIndex: 'sealContract.name',
          align: 'center'
        },
        {
          title: '付款单位',
          dataIndex: 'company',
          align: 'center'
        },
        {
          title: '收款单位',
          dataIndex: 'sealMerchant.name',
          align: 'center'
        },
        {
          title: '本次付款金额(元)',
          dataIndex: 'payMoney',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '剩余付款金额(元)',
          dataIndex: 'resMoney',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '比例(%)',
          dataIndex: 'ratio',
          align: 'center'
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          align: 'center',
          customRender: text => {
            return <AuditStatusTag state={text} />
          }
        }
      ],
      loadData: param => {
        return new Promise(resolve => {
          resolve({
            data: this.row.sealPayment
          })
        })
      }
    }
  },
  methods: {
    paymentHandleDetail(row) {
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
    }
  }
}
</script>
