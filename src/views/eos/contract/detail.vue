<!-- 合同详细 -->
<template>
  <div class="project-search">
    <s-descriptions :title="title" :formItems="formItems" :formData="row" />
    <a-card :bordered="false" size="small">
      <a-collapse expand-icon-position="right" :defaultActiveKey="stageTypeName + '阶段'">
        <a-collapse-panel :key="stageTypeName + '阶段'" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">{{ stageTypeName + '阶段' }}</span>
          <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="contractData" :showPagination="false" />
        </a-collapse-panel>
        <a-collapse-panel key="物料采购清单" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">物料采购清单</span>
          <s-table ref="table" size="default" rowKey="id" :columns="materialColumns" :data="materialProcurementData" :showPagination="false" />
        </a-collapse-panel>
        <a-collapse-panel key="工程量清单" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">工程量清单</span>
          <s-table ref="table" size="default" rowKey="id" :columns="billQuantitiesColumns" :data="billQuantitiesData" :showPagination="false" />
        </a-collapse-panel>
        <template v-if="hasInvoiceGet">
          <a-collapse-panel :key="stageTypeName + '详情'" class="custom-collapse-panel">
            <span slot="header" class="custom-collapse-panel-header">{{ stageTypeName + '详情' }}</span>
            <s-table ref="table" size="default" rowKey="id" :columns="getColumns(this.row.type)" :data="loadData" :showPagination="false" />
          </a-collapse-panel>
          <a-collapse-panel key="收票登记" class="custom-collapse-panel">
            <span slot="header" class="custom-collapse-panel-header">收票登记</span>
            <InvoiceGetListOp :inDrawer="true" simple :contractCode="row.code" getType="收票" />
          </a-collapse-panel>
          <a-collapse-panel key="开票登记" class="custom-collapse-panel">
            <span slot="header" class="custom-collapse-panel-header">开票登记</span>
            <InvoiceGetListOp :inDrawer="true" simple :contractCode="row.code" getType="开票" />
          </a-collapse-panel>
        </template>
      </a-collapse>
    </a-card>
  </div>
</template>

<script lang="jsx">
import moment from 'moment'
import { contractReal } from '/src/api/eos/invoice/real.js'
import { contractPayment } from '/src/api/eos/purchase/payment.js'
import { getContract } from '/src/api/eos/contract/contract.js'

import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'
import STable from '/src/components/Table/index.jsx'
import SDescriptions from '/src/components/Descriptions/index.jsx'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import MakeFormDetail from '/src/views/eos/invoice/make/details.vue'
import PaymentDetail from '/src/views/eos/purchase/payment/detail.vue'
// import InvoiceGetListOp from '/src/views/eos/invoice/get/indexOp.vue'
const InvoiceGetListOp = () => import('/src/views/eos/invoice/get/indexOp.vue') //子组件又引入了父组件，倒置报错，需要懒加载
export default {
  name: 'ContractDetail',
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    // 是否能查看收票开票
    hasInvoiceGet: {
      type: Boolean,
      default: false
    },
    deptId: {
      type: Number,
      default: null
    }
  },
  components: {
    SDescriptions,
    STable,
    InvoiceGetListOp
  },
  created() {
    if (this.deptId) {
      this.$set(this.formItems, 6, {
        label: '所属项目/部门',
        prop: 'projectName',
        formatter: val => {
          return this.row.sealProject ? this.row.sealProject.name : this.row.sysDept.deptName
        }
      })
    }
  },
  computed: {
    // 阶段收/付款名称
    stageTypeName() {
      if (!this.row || this.row.type === undefined || this.row.type === null) {
        return '收/付款'
      }
      return this.row.type === '收入合同' ? '收款' : '付款'
    }
  },
  data() {
    return {
      // 收付款数据
      loadData: param => {
        if (this.row.type === '收入合同') {
          return contractReal({ contractCode: this.row.code }).then(res => {
            return {
              data: res.rows,
              totalCount: res.total,
              pageNum: param.pageNum,
              pageSize: param.pageSize
            }
          })
        }
        if (this.row.type === '支出合同') {
          return contractPayment({ contractCode: this.row.code }).then(res => {
            return {
              data: res.rows,
              totalCount: res.total,
              pageNum: param.pageNum,
              pageSize: param.pageSize
            }
          })
        }
      },
      title: '合同详情',
      formItems: [
        {
          label: '申请人',
          prop: 'sysUser.nickName'
        },
        {
          label: '合同编号',
          prop: 'code'
        },
        {
          label: '合同名称',
          prop: 'name'
        },
        {
          label: '合同类型',
          prop: 'type',
          customRender: text => {
            return <a-tag color="blue">{text}</a-tag>
          }
        },
        {
          label: '合同性质',
          prop: 'contractProp'
        },
        {
          label: '所属项目编号',
          prop: 'projectCode',
          formatter: val => {
            return this.row.sealProject ? this.row.sealProject.code : ''
          }
        },
        {
          label: '所属项目',
          prop: 'projectName',
          formatter: val => {
            return this.row.sealProject ? this.row.sealProject.name : ''
          }
        },
        {
          label: '金额(元)',
          prop: 'sum',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
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
          label: '签订日期',
          prop: 'signingDate'
        },
        {
          label: '附件',
          prop: 'attachment',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        },
        {
          label: '备注',
          prop: 'remark'
        },
        {
          label: '合同效力',
          prop: 'efficacy'
        },
        {
          label: '审批状态',
          prop: 'state',
          customRender: text => {
            return <AuditStatusTag state={text} />
          }
        }
      ],
      // 合同阶段列
      columns: [
        {
          title: '#',
          dataIndex: 'sn',
          align: 'center'
        },
        {
          title: '阶段名称',
          dataIndex: 'name',
          align: 'center',
          width: 160
        },
        {
          title: '阶段内容',
          dataIndex: 'content',
          align: 'center'
        },
        {
          title: '金额(元)',
          dataIndex: 'money',
          align: 'left',
          customRender: text => this.toThousandFilter(text)
        },
        {
          title: '比例(%)',
          dataIndex: 'percent',
          align: 'center'
        },
        {
          title: '截止日期',
          dataIndex: 'endDate',
          align: 'center',
          width: 260
        }
      ],
      materialColumns: [
        {
          title: '#',
          dataIndex: 'oid',
          align: 'center',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '清单类型',
          dataIndex: 'type',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={16} tooltip>
                {record.type}
              </Ellipsis>
            )
          }
        },
        {
          title: '名字',
          dataIndex: 'name',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={10} tooltip>
                {record.name}
              </Ellipsis>
            )
          }
        },
        {
          title: '描述',
          dataIndex: 'description',
          align: 'center',
          width: 150,
          customRender: (text, record) => {
            return (
              <Ellipsis length={16} tooltip>
                {record.description}
              </Ellipsis>
            )
          }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={16} tooltip>
                {record.unit}
              </Ellipsis>
            )
          }
        },
        {
          title: '数量',
          dataIndex: 'amount',
          align: 'center',
          customRender: (text, record) => {
            return (
              <Ellipsis length={10} tooltip>
                {record.amount}
              </Ellipsis>
            )
          }
        },
        {
          title: '单价',
          dataIndex: 'price',
          align: 'center',
          customRender: (text, record) => {
            return (
              <Ellipsis length={10} tooltip>
                {record.price}
              </Ellipsis>
            )
          }
        },
        {
          title: '总价',
          dataIndex: 'totalPrice',
          align: 'center'
        },
        {
          title: '规格',
          dataIndex: 'spec',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={10} tooltip>
                {record.spec}
              </Ellipsis>
            )
          }
        }
      ],
      billQuantitiesColumns: [
        {
          title: '#',
          dataIndex: 'oid',
          align: 'center',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '清单类型',
          dataIndex: 'type',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={16} tooltip>
                {record.type}
              </Ellipsis>
            )
          }
        },
        {
          title: '名字',
          dataIndex: 'name',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={14} tooltip>
                {record.name}
              </Ellipsis>
            )
          }
        },
        {
          title: '描述',
          dataIndex: 'description',
          align: 'center',
          width: 150,
          customRender: (text, record) => {
            return (
              <Ellipsis length={6} tooltip>
                {record.description}
              </Ellipsis>
            )
          }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={16} tooltip>
                {record.unit}
              </Ellipsis>
            )
          }
        },
        {
          title: '数量',
          dataIndex: 'amount',
          align: 'center',
          customRender: (text, record) => {
            return (
              <Ellipsis length={10} tooltip>
                {record.amount}
              </Ellipsis>
            )
          }
        },
        {
          title: '单价',
          dataIndex: 'price',
          align: 'center',
          customRender: (text, record) => {
            return (
              <Ellipsis length={10} tooltip>
                {record.price}
              </Ellipsis>
            )
          }
        },
        {
          title: '总价',
          dataIndex: 'totalPrice',
          align: 'center'
        }
      ],
      // 合同阶段
      contractData: param => {
        return getContract(this.row.id).then(res => {
          return {
            data: res.data.sealContractStageList
          }
        })
      },
      materialProcurementData: param => {
        return getContract(this.row.id).then(res => {
          const materialProcurement = res.data.sealAmountLists.filter(item => item.type === '物料')
          return {
            data: materialProcurement
          }
        })
      },
      billQuantitiesData: param => {
        return getContract(this.row.id).then(res => {
          const billQuantities = res.data.sealAmountLists.filter(item => item.type === '工程量')
          return {
            data: billQuantities
          }
        })
      }
    }
  },
  methods: {
    // 收付款字段
    getColumns(stageTypeName) {
      if (stageTypeName === '收入合同') {
        return [
          {
            title: '项目名称',
            dataIndex: 'projectName',
            align: 'center'
          },
          {
            title: '合同名称',
            dataIndex: 'contractName',
            align: 'center'
          },
          {
            title: '关联开票单号',
            dataIndex: 'makeCode',
            align: 'center',
            customRender: (text, record) => {
              return (
                <span style="color:#348EE4;cursor:pointer" onClick={() => this.handleContractDetail(record.sealInvoiceMake, record.sealInvoiceMake.id)}>
                  {text}
                </span>
              )
            }
          },
          {
            title: '收款单位',
            dataIndex: 'company',
            align: 'center'
          },
          {
            title: '收款年月',
            dataIndex: 'payTime',
            align: 'center',
            customRender: (text, record) => {
              return (
                <span style="color:#348EE4;cursor:pointer" onClick={() => this.realHandleDetail(record)}>
                  {text}
                </span>
              )
            }
          },
          {
            title: '本次收款金额(元)',
            dataIndex: 'payMoney',
            align: 'left',
            customRender: (text, record) => {
              return this.toThousandFilter(text)
            }
          },
          {
            title: '剩余收款金额(元)',
            dataIndex: 'resMoney',
            align: 'left',
            customRender: (text, record) => {
              return this.toThousandFilter(text)
            }
          },
          {
            title: '比例(%)',
            dataIndex: 'ratio',
            align: 'center',
            customRender: (text, record) => {
              return record.ratio >= 80 ? <a-tag color="green">{text}</a-tag> : <a-tag color="blue">{text}</a-tag>
            }
          }
        ]
      }
      if (stageTypeName === '支出合同') {
        return [
          {
            title: '申请单号',
            dataIndex: 'code',
            align: 'center',
            customRender: (text, record) => {
              return (
                <span
                  style="color:#348EE4;cursor:pointer"
                  onClick={() => {
                    return this.paymentHandleDetail(record)
                  }}
                >
                  <Ellipsis length={14} tooltip>
                    {text}
                  </Ellipsis>
                </span>
              )
            }
          },
          {
            title: '项目名称',
            dataIndex: 'projectName',
            align: 'center'
          },
          {
            title: '合同名称',
            dataIndex: 'contractName',
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
            align: 'center',
            customRender: (text, record) => {
              return record.ratio >= 80 ? <a-tag color="green">{text}</a-tag> : <a-tag color="blue">{text}</a-tag>
            }
          },
          {
            title: '审批状态',
            dataIndex: 'state',
            align: 'center',
            customRender: text => {
              return <AuditStatusTag state={text} />
            }
          }
        ]
      }
    },
    /** 收款详情 */
    realHandleDetail(row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '收款详情',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: SDescriptions,
          props: {
            title: '收款详情',
            formData: row,
            formItems: [
              {
                label: '项目编号',
                prop: 'sealProject.code'
              },
              {
                label: '项目名称',
                prop: 'sealProject.name'
              },
              {
                label: '收款年月',
                prop: 'payTime',
                formatter: val => {
                  return moment(val).format('YYYY/MM/DD')
                }
              },
              {
                label: '收款单位',
                prop: 'company'
              },
              {
                label: '付款单位',
                prop: 'sealMerchant.name'
              },
              {
                label: '开户银行',
                prop: 'sealMerchant.bank'
              },
              {
                label: '银行账号',
                prop: 'sealMerchant.account'
              },
              {
                label: '合同编号',
                prop: 'sealContract.code'
              },
              {
                label: '合同名称',
                prop: 'sealContract.name'
              },
              {
                label: '合同总金额',
                prop: 'sealContract.sum',
                customRender: (text, record) => {
                  return this.toThousandFilter(text)
                }
              },
              {
                label: '合同附件',
                prop: 'sealContract.attachment',
                customRender: text => {
                  return <s-doc-list text={text} />
                }
              },
              {
                label: '实际收款金额',
                prop: 'payMoney',
                customRender: (text, record) => {
                  return this.toThousandFilter(text)
                }
              },
              {
                label: '收款金额大写',
                prop: 'payMoneyUpper'
              },
              {
                label: '备注',
                prop: 'remark'
              }
            ]
          }
        }
      })
    },
    /* 发票详情 */
    handleContractDetail(row, formId) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '开票详情',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: MakeFormDetail,
          props: {
            title: '开票详情',
            row,
            formId
          }
        }
      })
    },
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
<style lang="less">
.project-search {
  .ant-card-body {
    padding: 0 !important;
  }
}
</style>
