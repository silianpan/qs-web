<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <SummaryOp />
  </page-header-wrapper>
</template>

<script>
import SummaryOp from './summaryOp.vue'
export default {
  name: 'Fund',
  components: {
    SummaryOp
  }
}
</script>
