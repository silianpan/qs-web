<!-- 借还综合查询 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <IndexOp />
  </page-header-wrapper>
</template>

<script>
import IndexOp from './indexOp.vue'
export default {
  name: 'IntegratedQuery',
  components: {
    IndexOp
  }
}
</script>
