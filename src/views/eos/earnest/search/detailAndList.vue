<!--当前保证金申请的详情和保证金退还的列表-->
<template>
  <a-card :bordered="false">
    <SelectDetail :row="row" />
    <listOp :row="row" />
  </a-card>
</template>
<script>
import SelectDetail from './modules/SelectDetail.vue'
import listOp from './listOp.vue'

export default {
  name: 'DetailAndList',
  components: {
    SelectDetail,
    listOp
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
