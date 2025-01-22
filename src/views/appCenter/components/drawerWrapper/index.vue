<template>
  <a-drawer :title="title" placement="bottom" :visible="isShow" @close="onclose">
    <div class="drawer-wrapper-container-header">
      {{ title }}
    </div>
    <div class="drawer-wrapper-container-body">
      <iframe frameborder="0" height="100%" width="100%" src="/saas/dashboard/app"></iframe>
    </div>
  </a-drawer>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  watch: {
    visible(v) {
      this.isShow = v
    }
  },

  methods: {
    onclose() {
      this.$emit('onclose', false)
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
