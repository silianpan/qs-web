<template>
  <a-layout class="container">
    <a-layout-header class="header">
      <Header />
    </a-layout-header>
    <a-layout-content class="content">
      <router-view />
    </a-layout-content>
  </a-layout>
</template>
<script>
import Header from './components/header/index.vue'

export default {
  components: { Header }
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>
