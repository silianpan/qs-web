<!-- 报销管理 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <expense-op />
  </page-header-wrapper>
</template>

<script>
import ExpenseOp from './indexOp.vue'

export default {
  name: 'Expense',
  components: {
    ExpenseOp
  }
}
</script>
