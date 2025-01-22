<!-- 已办事项页面 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <done />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import Done from './done'
export default {
  name: 'DoneIndex',
  components: {
    Done
  }
}
</script>
