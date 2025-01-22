<!-- 采购管理 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <payment-op />
  </page-header-wrapper>
</template>

<script>
import paymentOp from './indexOp.vue'

export default {
  name: 'Payment',
  components: {
    paymentOp
  }
}
</script>
