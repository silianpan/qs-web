<!-- 报销综合查询 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <CplxQOp />
  </page-header-wrapper>
</template>

<script>
import CplxQOp from './cplxQOp.vue'

export default {
  name: 'ComplexQuery',
  components: {
    CplxQOp
  }
}
</script>
