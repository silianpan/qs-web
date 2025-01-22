<!-- 合同管理 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <contract-list-op :projectId="projectId" />
  </page-header-wrapper>
</template>

<script>
import ContractListOp from './listOp.vue'

export default {
  name: 'ContractList',
  props: {
    projectId: {
      type: Number,
      default: null
    }
  },
  components: {
    ContractListOp
  }
}
</script>
