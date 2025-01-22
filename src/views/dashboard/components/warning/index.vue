<template>
  <a-card class="card-container" :bordered="false" :headStyle="{ border: 'none' }" :bodyStyle="{ padding: 0, overflow: 'hidden' }">
    <h1 slot="title" class="card-title">预警提示</h1>
    <div class="warnRight">
      <warn-index ref="warnIndexRef" />
    </div>
  </a-card>
</template>

<script>
import warnIndex from '/src/views/eos/warn/index.vue'

export default {
  components: {
    warnIndex
  },
  methods: {
    handleTabProcessStartRefresh() {
      // 预警提醒的刷新
      this.$refs.warnIndexRef.refresh()
    }
  }
}
</script>
