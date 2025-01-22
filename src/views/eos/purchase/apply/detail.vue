<!-- 项目详细 -->
<template>
  <div>
    <s-descriptions :title="title" :formItems="formItems" :formData="formData" />
    <!-- 数据表格 -->
    <a-card :bordered="false" size="small">
      <a-collapse expand-icon-position="right" defaultActiveKey="采购明细">
        <a-collapse-panel key="采购明细" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">采购明细</span>
          <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :showPagination="false" :scroll="{ x: true }" />
        </a-collapse-panel>
      </a-collapse>
    </a-card>
  </div>
</template>

<script lang="jsx">
import moment from 'moment'
import STable from '/src/components/Table/index.jsx'
import SDescriptions from '/src/components/Descriptions/index.jsx'
import { getProject } from '/src/api/eos/project/project.js'
import { getContract } from '/src/api/eos/contract/contract.js'
import { getDetail } from '/src/api/eos/purchase/purchase.js'

import ProjectDetail from '/src/views/eos/project/detail.vue'
import ContractDetail from '/src/views/eos/contract/detail.vue'

export default {
  name: 'PurchaseApplyDetail',
  props: {
    formId: {
      type: Number,
      required: true
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    SDescriptions,
    STable
  },
  data() {
    return {
      tableData: [],
      dictKeys: [],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      dictMap: {},
      title: '采购详情',
      formData: {},
      formItems: [
        {
          label: '采购单号',
          prop: 'code'
        },
        {
          label: '申请人',
          prop: 'sysUser.nickName'
        },
        {
          label: '所属部门',
          prop: 'dept.deptName'
        },
        {
          label: '项目名称',
          prop: 'sealProject.name'
        },
        {
          label: '项目编号',
          prop: 'sealProject.code'
          // customRender: (text, record) => {
          //   return (
          //     <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleProjectDetail(record.sealProject.id)}>
          //       {text}
          //     </span>
          //   )
          // }
        },
        {
          label: '合同名称',
          prop: 'sealContract.name'
        },
        {
          label: '合同编号',
          prop: 'sealContract.code'
          // customRender: (text, record) => {
          //   return (
          //     <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleContractDetail(record.sealContract.id)}>
          //       {text}
          //     </span>
          //   )
          // }
        },
        {
          label: '采购类型',
          prop: 'purchaseType',
          customRender: (text, record) => (text === 0 ? '项目采购' : '非项目采购')
        },
        {
          label: '预算大类',
          prop: 'budgetType'
        },
        {
          label: '采购事由',
          prop: 'remark'
        },
        // {
        //   label: '审批状态',
        //   prop: 'state',
        //   customRender: (text, record) => {
        //     return <AuditStatusTag state={text} />
        //   }
        // },
        {
          label: '附件',
          prop: 'attachment',
          customRender: text => {
            return <s-doc-list text={text} />
          }
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
        {
          title: '采购数量',
          dataIndex: 'purchaseNum',
          align: 'center'
        }
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
        // }
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
    refresh() {
      this.$refs.table.refresh(true)
    },
    /* 查看项目详情 */
    async handleProjectDetail(id) {
      const row = await getProject(id)
      if (!this.isEmpty(row)) {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '项目详情',
            width: '60%',
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
  },
  created() {
    this.formData = { ...this.row }
    getDetail(this.formData.id).then(res => {
      this.tableData = res.data.purchaseApplyDetail
      this.refresh()
    })
  }
}
</script>
