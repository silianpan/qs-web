<template>
  <a-spin :spinning="loading" tip="加载中...">
    <div v-if="dashboardUrl" :style="'height:' + height">
      <iframe :src="dashboardUrl" frameborder="no" style="width: 100%; height: 100%" scrolling="auto" />
    </div>
    <div v-else class="home-tips">请在【系统管理->参数设置】配置首页</div>
  </a-spin>
</template>

<script>
export default {
  name: 'Dashboard',
  components: {},
  data() {
    return {
      dashboardUrl: null,
      height: document.documentElement.clientHeight + 'px',
      loading: true
    }
  },
  mounted() {
    this.getConfigKey('sys.home.url').then(res => {
      this.dashboardUrl = import.meta.env.VITE_APP_REPORT + res.msg
      setTimeout(() => {
        this.loading = false
      }, 230)
    })
    window.onresize = () => {
      this.height = document.documentElement.clientHeight + 'px'
    }
  }
}
</script>

<style scoped>
.home-tips {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
