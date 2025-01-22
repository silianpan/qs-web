<!-- 入库申请单详细 -->
<template>
  <div>
    <s-descriptions title="基本信息" :formItems="formItems" :formData="row" />
    <!-- 数据表格 -->
    <a-card :bordered="false" size="small">
      <a-collapse expand-icon-position="right" defaultActiveKey="入库明细">
        <a-collapse-panel key="入库明细" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">入库明细</span>
          <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :showPagination="false" :scroll="{ x: true }" />
        </a-collapse-panel>
      </a-collapse>
    </a-card>
  </div>
</template>

<script lang="jsx">
import { SDescriptions, STable } from '/src/components/index.js'
import { previewDoc } from '/src/components/Office/office.js'
import ProjectDetail from '/src/views/eos/project/detail.vue'
import ContractDetail from '/src/views/eos/contract/detail.vue'
import PaymentDetail from '/src/views/eos/purchase/payment/detail.vue'
import { getProject } from '/src/api/eos/project/project.js'
import { getContract } from '/src/api/eos/contract/contract.js'
import { getPayment } from '/src/api/eos/purchase/payment.js'
import { getWarehouseInApply } from '/src/api/eos/warehouse/warehouseInApply'
import moment from 'moment'

export default {
  name: 'WarehouseInApplyDetail',
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
  mounted() {
    const id = this.row.id
    getWarehouseInApply(id).then(res => {
      this.tableData = res.data.warehouseInDetailList
      this.$refs.table.refresh(true)
    })
  },
  data() {
    return {
      // 入库明细数据
      tableData: [],
      formItems: [
        {
          label: '申请人',
          prop: 'user.nickName'
        },
        {
          label: '申请时间',
          prop: 'createTime',
          formatter: val => {
            return moment(val).format('YYYY/MM/DD')
          }
        },
        {
          label: '入库批次编号',
          prop: 'code'
        },
        {
          label: '入库类型',
          prop: 'warehouseInType',
          customRender: (text, record) => {
            if (record.warehouseInType === 0) {
              return '项目采购入库'
            } else {
              return '非项目采购入库'
            }
          }
        },
        {
          label: '库房',
          prop: 'warehouse.name'
        },
        {
          label: '采购付款编号',
          prop: 'payment.code'
          // customRender: (text, record) => {
          //   return (
          //     <span style="color:#348ee4;cursor:pointer" onClick={() => this.handlePaymentDetail(record.payment.id)}>
          //       {text}
          //     </span>
          //   )
          // }
        },
        {
          label: '项目名称',
          prop: 'project.name'
        },
        {
          label: '项目编号',
          prop: 'project.code'
          // customRender: (text, record) => {
          //   return (
          //     <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleProjectDetail(record.project.id)}>
          //       {text}
          //     </span>
          //   )
          // }
        },
        {
          label: '合同名称',
          prop: 'contract.name'
        },
        {
          label: '合同编号',
          prop: 'contract.code'
          // customRender: (text, record) => {
          //   return (
          //     <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleContractDetail(record.contract.id)}>
          //       {text}
          //     </span>
          //   )
          // }
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ],
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          align: 'center'
        },
        {
          title: '描述',
          dataIndex: 'description',
          align: 'center'
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center'
        },
        {
          title: '数量',
          dataIndex: 'amount',
          align: 'center'
        },
        {
          title: '单价',
          dataIndex: 'price',
          align: 'center'
        },
        {
          title: '总价',
          dataIndex: 'totalPrice',
          align: 'center'
        },
        {
          title: '型号规格',
          dataIndex: 'spec',
          align: 'center'
        },
        // {
        //   title: '采购数量',
        //   dataIndex: 'purchaseNum',
        //   align: 'center'
        // },
          // 询价字段暂去
        // {
        //   title: '计划到货日期',
        //   dataIndex: 'planDate',
        //   align: 'center',
        //   customRender: val => {
        //     if (val) {
        //       return moment(val).format('YYYY/MM/DD')
        //     }
        //   }
        // },
        // {
        //   title: '供货商',
        //   dataIndex: 'supplier',
        //   align: 'center'
        // },
        // {
        //   title: '收货人',
        //   dataIndex: 'consignee',
        //   align: 'center'
        // },
        // {
        //   title: '收货地址',
        //   dataIndex: 'consigneeAddress',
        //   align: 'center'
        // },
        // {
        //   title: '实际品牌',
        //   dataIndex: 'actualBrand',
        //   align: 'center'
        // },
        // {
        //   title: '实际价格',
        //   dataIndex: 'actualPrice',
        //   align: 'center'
        // },
        // {
        //   title: '实际总价',
        //   dataIndex: 'actualPriceTotal',
        //   align: 'center'
        // },
        // {
        //   title: '价格对比',
        //   dataIndex: 'priceDiff',
        //   align: 'center'
        // },
        // {
        //   title: '总价对比',
        //   dataIndex: 'priceDiffTotal',
        //   align: 'center'
        // },
        {
          title: '入库数量',
          dataIndex: 'inNum',
          align: 'center'
        }
      ],
      loadData: param => {
        return new Promise(resolve => {
          resolve(param)
        }).then(param => {
          return {
            data: this.tableData
          }
        })
      }
    }
  },
  methods: {
    handlePreviewDoc(doc) {
      previewDoc(doc.name, doc.url)
    },
    /* 查看付款详情 */
    async handlePaymentDetail(id) {
      const row = await getPayment(id)
      if (!this.isEmpty(row)) {
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
              row: row.data
            }
          }
        })
      } else {
        this.$message.error('获取详情失败')
      }
    },
    /* 查看项目详情 */
    async handleProjectDetail(id) {
      const row = await getProject(id)
      if (!this.isEmpty(row)) {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '项目详情',
            width: '50%',
            maskClosable: true
          },
          content: {
            template: ProjectDetail,
            props: {
              row: row.data
            }
          }
        })
      } else {
        this.$message.error('获取详情失败')
      }
    },
    /* 查看合同详情 */
    async handleContractDetail(id) {
      const row = await getContract(id)
      if (!this.isEmpty(row)) {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '合同详情',
            width: '60%',
            maskClosable: true
          },
          content: {
            template: ContractDetail,
            props: {
              row: row.data
            }
          }
        })
      } else {
        this.$message.error('获取详情失败')
      }
    }
  }
}
</script>
