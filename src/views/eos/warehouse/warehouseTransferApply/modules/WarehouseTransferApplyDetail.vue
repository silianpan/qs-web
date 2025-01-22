<!-- 划拨申请单(只能项目划项目)详细 -->
<template>
  <div>
    <s-descriptions title="基本信息" :formItems="formItems" :formData="formData" />
    <!-- 数据表格 -->
    <a-card :bordered="false" size="small">
      <a-collapse expand-icon-position="right" defaultActiveKey="划拨明细">
        <a-collapse-panel key="划拨明细" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">划拨明细</span>
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
import WarehouseDetail from '/src/views/eos/warehouse/warehouse/modules/WarehouseDetail.vue'
import { getProject } from '/src/api/eos/project/project.js'
import { getWarehouse } from '/src/api/eos/warehouse/warehouse'
import { getWarehouseTransferApply } from '/src/api/eos/warehouse/warehouseTransferApply'
import moment from 'moment'

export default {
  name: 'WarehouseTransferApplyDetail',
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
  data() {
    return {
      tableData: [],
      formData: {},
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
          label: '划拨编号',
          prop: 'code'
        },
        {
          label: '原项目编号',
          prop: 'sourceProject.code'
          // customRender: (text, record) => {
          //   return (
          //     <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleProjectDetail(record.sourceProject.id)}>
          //       {text}
          //     </span>
          //   )
          // }
        },
        {
          label: '原项目名称',
          prop: 'sourceProject.name'
        },
        {
          label: '目的项目编号',
          prop: 'targetProject.code'
          // customRender: (text, record) => {
          //   return (
          //     <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleProjectDetail(record.targetProject.id)}>
          //       {text}
          //     </span>
          //   )
          // }
        },
        {
          label: '目的项目名称',
          prop: 'targetProject.name'
        },

        {
          label: '原库房编号',
          prop: 'sourceWarehouse.code'
          // customRender: (text, record) => {
          //   return (
          //     <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleWarehouseDetail(record.sourceWarehouse.id)}>
          //       {text}
          //     </span>
          //   )
          // }
        },
        {
          label: '原库房名称',
          prop: 'sourceWarehouse.name'
        },
        {
          label: '目的库房编号',
          prop: 'targetWarehouse.code'
          // customRender: (text, record) => {
          //   return (
          //     <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleWarehouseDetail(record.targetWarehouse.id)}>
          //       {text}
          //     </span>
          //   )
          // }
        },
        {
          label: '目的库房名称',
          prop: 'targetWarehouse.name'
        },
        {
          label: '备注',
          prop: 'remark'
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
      },
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          align: 'center',
          width: '80px'
        },
        {
          title: '描述',
          dataIndex: 'description',
          align: 'center',
          width: '80px'
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center',
          width: '80px'
        },
        {
          title: '数量',
          dataIndex: 'amount',
          align: 'center',
          width: '80px'
        },
        {
          title: '单价',
          dataIndex: 'price',
          align: 'center',
          width: '80px'
        },
        {
          title: '总价',
          dataIndex: 'totalPrice',
          align: 'center',
          width: '80px'
        },
        {
          title: '型号规格',
          dataIndex: 'spec',
          align: 'center',
          width: '80px'
        },
        // 询价字段暂去
        // {
        //   title: '采购数量',
        //   dataIndex: 'purchaseNum',
        //   align: 'center',
        //   width: '80px'
        // },
        // {
        //   title: '计划到货日期',
        //   dataIndex: 'planDate',
        //   align: 'center',
        //   customRender: val => {
        //     if (val) {
        //       return moment(val).format('YYYY/MM/DD')
        //     }
        //   },
        //   width: '80px'
        // },
        // {
        //   title: '供货商',
        //   dataIndex: 'supplier',
        //   align: 'center',
        //   width: '80px'
        // },
        // {
        //   title: '收货人',
        //   dataIndex: 'consignee',
        //   align: 'center',
        //   width: '80px'
        // },
        // {
        //   title: '收货地址',
        //   dataIndex: 'consigneeAddress',
        //   align: 'center',
        //   width: '80px'
        // },
        // {
        //   title: '实际品牌',
        //   dataIndex: 'actualBrand',
        //   align: 'center',
        //   width: '80px'
        // },
        // {
        //   title: '实际价格',
        //   dataIndex: 'actualPrice',
        //   align: 'center',
        //   width: '80px'
        // },
        // {
        //   title: '实际总价',
        //   dataIndex: 'actualPriceTotal',
        //   align: 'center',
        //   width: '80px'
        // },
        // {
        //   title: '价格对比',
        //   dataIndex: 'priceDiff',
        //   align: 'center',
        //   width: '80px'
        // },
        // {
        //   title: '总价对比',
        //   dataIndex: 'priceDiffTotal',
        //   align: 'center',
        //   width: '80px'
        // },
        {
          title: '划拨数量',
          dataIndex: 'transferNum',
          align: 'center',
          width: '80px'
        }
      ]
    }
  },
  methods: {
    handlePreviewDoc(doc) {
      previewDoc(doc.name, doc.url)
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
    /* 查看库房详情 */
    async handleWarehouseDetail(id) {
      const row = await getWarehouse(id)
      if (!this.isEmpty(row)) {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '库房详情',
            width: '50%',
            maskClosable: true
          },
          content: {
            template: WarehouseDetail,
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
  mounted() {
    this.formData = { ...this.row }
    getWarehouseTransferApply(this.row.id).then(res => {
      this.tableData = res.data.transferDetailList
      this.$refs.table.refresh()
    })
  }
}
</script>
