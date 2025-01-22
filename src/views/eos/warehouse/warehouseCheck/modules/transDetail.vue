<template>
  <!-- 数据表格 -->
  <a-card :bordered="false" size="small">
    <a-collapse expand-icon-position="right" defaultActiveKey="划入明细">
      <a-collapse-panel key="划入明细" class="custom-collapse-panel">
        <span slot="header" class="custom-collapse-panel-header">划入明细</span>
        <s-table ref="inTable" size="default" :rowKey="(_, index) => index" :columns="inColumns" :data="inLoadData" :scroll="{ x: true }" />
      </a-collapse-panel>
      <a-collapse-panel key="划出明细" class="custom-collapse-panel">
        <span slot="header" class="custom-collapse-panel-header">划出明细</span>
        <s-table ref="outTable" size="default" :rowKey="(_, index) => index" :columns="outColumns" :data="outLoadData" :scroll="{ x: true }" />
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
    inData: {
      type: Object,
      default: () => {}
    },
    outData: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.inTableData = this.inData.rows
    // this.$refs.inTable.refresh()
    this.outTableData = this.outData.rows
    // this.$refs.outTable.refresh()
  },
  data() {
    return {
      inTableData: [],
      inLoadData: param => {
        return new Promise(resolve => {
          resolve(param)
        }).then(param => {
          return {
            data: this.inTableData,
            totalCount: this.inData.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      inColumns: [
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
          title: '划拨数量',
          dataIndex: 'transferNum',
          align: 'center',
          width: '80px'
        }
      ],
      outTableData: [],
      outLoadData: param => {
        return new Promise(resolve => {
          resolve(param)
        }).then(param => {
          return {
            data: this.outTableData,
            totalCount: this.outData.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      outColumns: [
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
        {
          title: '采购数量',
          dataIndex: 'purchaseNum',
          align: 'center',
          width: '80px'
        },
        {
          title: '计划到货日期',
          dataIndex: 'planDate',
          align: 'center',
          customRender: val => {
            if (val) {
              return moment(val).format('YYYY/MM/DD')
            }
          },
          width: '80px'
        },
        {
          title: '供货商',
          dataIndex: 'supplier',
          align: 'center',
          width: '80px'
        },
        {
          title: '收货人',
          dataIndex: 'consignee',
          align: 'center',
          width: '80px'
        },
        {
          title: '收货地址',
          dataIndex: 'consigneeAddress',
          align: 'center',
          width: '80px'
        },
        {
          title: '实际品牌',
          dataIndex: 'actualBrand',
          align: 'center',
          width: '80px'
        },
        {
          title: '实际价格',
          dataIndex: 'actualPrice',
          align: 'center',
          width: '80px'
        },
        {
          title: '实际总价',
          dataIndex: 'actualPriceTotal',
          align: 'center',
          width: '80px'
        },
        {
          title: '价格对比',
          dataIndex: 'priceDiff',
          align: 'center',
          width: '80px'
        },
        {
          title: '总价对比',
          dataIndex: 'priceDiffTotal',
          align: 'center',
          width: '80px'
        },
        {
          title: '划拨数量',
          dataIndex: 'transferNum',
          align: 'center',
          width: '80px'
        }
      ]
    }
  }
}
</script>
