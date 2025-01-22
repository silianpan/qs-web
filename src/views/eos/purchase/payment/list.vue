<!-- 付款综合查询 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <ListOp />
  </page-header-wrapper>
</template>

<script>
import ListOp from './listOp.vue'

export default {
  name: 'Payment',
  components: {
    ListOp
  }
}
</script>
