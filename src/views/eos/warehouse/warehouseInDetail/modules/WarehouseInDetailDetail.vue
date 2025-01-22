<!-- 入库申请单明细详细 -->
<template>
  <s-descriptions :title="title" :formItems="formItems" :formData="row" />
</template>

<script>
import { SDescriptions } from '/src/components/index.js'
import { previewDoc } from '/src/components/Office/office.js'

export default {
  name: 'WarehouseInDetailDetail',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    SDescriptions
  },
  data() {
    return {
      title: '入库申请单明细详情',
      formItems: [
        {
          label: '版本',
          prop: 'version'
        },
        {
          label: '租户ID',
          prop: 'tenantId'
        },
        {
          label: '入库申请单id',
          prop: 'warehouseInApplyId'
        },
        {
          label: '名称',
          prop: 'name'
        },
        {
          label: '描述',
          prop: 'description'
        },
        {
          label: '所属合同id',
          prop: 'contractId'
        },
        {
          label: '单位',
          prop: 'unit'
        },
        {
          label: '数量',
          prop: 'amount'
        },
        {
          label: '单价(预估)',
          prop: 'price'
        },
        {
          label: '总价(预估)',
          prop: 'totalPrice'
        },
        {
          label: '规格型号',
          prop: 'spec'
        },
        {
          label: '计划到货日期',
          prop: 'planDate'
        },
        {
          label: '供货商',
          prop: 'supplier'
        },
        {
          label: '实际品牌(询价)',
          prop: 'actualBrand'
        },
        {
          label: '实际价格(询价)',
          prop: 'actualPrice'
        },
        {
          label: '实际总价(询价)',
          prop: 'actualPriceTotal'
        },
        {
          label: '价格对比(询价)',
          prop: 'priceDiff'
        }
      ]
    }
  },
  methods: {
    handlePreviewDoc(doc) {
      previewDoc(doc.name, doc.url)
    }
  }
}
</script>
