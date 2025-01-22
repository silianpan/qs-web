<!-- 抄送我的页面 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <Copy />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import Copy from './copy.vue'
export default {
  name: 'CopyIndex',
  components: {
    Copy
  }
}
</script>
