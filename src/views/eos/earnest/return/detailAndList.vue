<!--当前保证金申请的详情和保证金退还的列表-->
<template>
  <a-card :bordered="false">
    <SelectDetail :row="row" />
    <returnList :row="row" />
  </a-card>
</template>
<script>
import SelectDetail from '/src/views/eos/earnest/search/modules/SelectDetail.vue'
import returnList from './returnList.vue'

export default {
  name: 'DetailAndReturnList',
  components: {
    SelectDetail,
    returnList
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
