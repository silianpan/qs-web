<template>
  <a-result class="exception-container">
    <template #subTitle>
      <div style="color: #348ee4; font-size: 16px">您访问的页面丢失了</div>
    </template>
    <template #extra>
      <a-button type="primary" ghost @click="toHome"> 返回首页 </a-button>
    </template>
    <template #icon>
      <img :src="img404" />
    </template>
  </a-result>
</template>

<script>
import img404 from '/src/assets/img/404.png'
export default {
  name: 'Exception404',
  data() {
    return {
      img404
    }
  },
  methods: {
    toHome() {
      this.$router.push({ path: '/index' })
    }
  }
}
</script>
