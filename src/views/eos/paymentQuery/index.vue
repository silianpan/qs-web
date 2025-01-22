<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <a-tabs default-active-key="1" :tab-position="mode" class="menu-in-component">
        <a-tab-pane key="1">
          <template #tab> 业务支付综合查询 </template>
          <PaymentList></PaymentList>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #tab> 报销综合查询 </template>
          <ExpenseList></ExpenseList>
        </a-tab-pane>
        <a-tab-pane key="3">
          <template #tab> 保证金综合查询 </template>
          <EarnestList></EarnestList>
        </a-tab-pane>
        <a-tab-pane key="4">
          <template #tab> 借还款综合查询 </template>
          <RePaymentList></RePaymentList>
        </a-tab-pane>
        <a-tab-pane key="5">
          <template #tab> 分包综合查询 </template>
          <Quantities></Quantities>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </page-header-wrapper>
</template>
<script lang="jsx">
import RePaymentList from '/src/views/eos/repayment/search/indexOp.vue'
import EarnestList from '/src/views/eos/earnest/search/index.vue'
import ExpenseList from '/src/views/eos/expense/search.vue'
import PaymentList from '/src/views/eos/purchase/payment/listOp.vue'
import Quantities from '/src/views/eos/subcontract/search/index.vue'
export default {
  data() {
    return {
      mode: 'top'
    }
  },
  components: {
    RePaymentList,
    EarnestList,
    ExpenseList,
    PaymentList,
    Quantities
  },
  methods: {}
}
</script>
<style lang="less" scoped></style>
