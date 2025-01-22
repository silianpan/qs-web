<!-- 保证金退还详细 -->
<template>
  <s-descriptions :title="title" :formItems="formItems" :formData="row" />
</template>

<script>
import { SDescriptions } from '/src/components/index.js'
import { previewDoc } from '/src/components/Office/office.js'

export default {
  name: 'ReturnDetail',
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
      title: '保证金退还详情',
      formItems: [
        {
          label: '退还单号',
          prop: 'code'
        },
        {
          label: '保证金申请单',
          prop: 'sealDepositApply.code'
        },
        {
          label: '所属招投标',
          prop: 'sealBid.name'
        },
        {
          label: '保证金类型',
          prop: 'sealDepositApply.depositType'
        },
        {
          label: '保证金金额(元)',
          prop: 'sealDepositApply.depositMoney'
        },
        {
          label: '退还金额(元)',
          prop: 'returnMoney'
        },
        {
          label: '支付金额(元)',
          prop: 'payMoney'
        },
        {
          label: '备注',
          prop: 'remark'
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
