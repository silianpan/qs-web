<template>
  <!-- 数据表格 -->
  <a-card :bordered="false" size="small">
    <a-collapse expand-icon-position="right" defaultActiveKey="出库明细">
      <a-collapse-panel key="出库明细" class="custom-collapse-panel">
        <span slot="header" class="custom-collapse-panel-header">出库明细</span>
        <s-table ref="table" size="default" :rowKey="(_, index) => index" :columns="columns" :data="loadData" :scroll="{ x: true }" />
      </a-collapse-panel>
    </a-collapse>
  </a-card>
</template>
<script>
import { STable } from '/src/components/index.js'
import moment from 'moment'
export default {
  name: 'OutDetail',
  components: {
    STable
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.tableData = this.row.rows
    this.$refs.table.refresh()
  },
  data() {
    return {
      tableData: [],
      loadData: param => {
        return new Promise(resolve => {
          resolve(param)
        }).then(param => {
          return {
            data: this.tableData,
            totalCount: this.row.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
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
          // 询价暂去
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
          title: '出库数量',
          dataIndex: 'outNum',
          align: 'center',
          width: '80px'
        }
      ]
    }
  }
}
</script>
