<!-- 我的流程页面 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <process-started />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import ProcessStarted from './processStarted.vue'
export default {
  name: 'ProcessStartedPage',
  components: {
    ProcessStarted
  }
}
</script>
