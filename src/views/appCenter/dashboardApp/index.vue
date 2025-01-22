<template>
  <a-layout class="dashboard-app-container">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible class="sider">
      <div class="logo" />
      <a-menu mode="inline" :default-selected-keys="['/saas/dashboard/app/text']" @click="handlerRouter">
        <a-menu-item key="/saas/dashboard/app/text">
          <a-icon type="user" />
          <span>nav 1</span>
        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="video-camera" />
          <span>nav 2</span>
        </a-menu-item>
        <a-menu-item key="3">
          <a-icon type="upload" />
          <span>nav 3</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout class="mian">
      <a-layout-header class="mian-header">
        <a-icon class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="() => (collapsed = !collapsed)" />
      </a-layout-header>
      <a-layout-content class="mian-content">
        <div class="widget-wrapper">
          <router-view />
        </div>
        <div class="form-footer"><a-button ghost type="primary"> Primary </a-button></div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  data() {
    return {
      collapsed: false
    }
  },
  methods: {
    handlerRouter({ key }) {
      // this.$router.push({
      //   path: key
      // })
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
