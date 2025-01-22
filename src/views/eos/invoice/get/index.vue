<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <InvoiceGetIndexOp />
  </page-header-wrapper>
</template>

<script>
import InvoiceGetIndexOp from './indexOp.vue'

export default {
  name: 'InvoiceGetIndex',
  components: {
    InvoiceGetIndexOp
  }
}
</script>
