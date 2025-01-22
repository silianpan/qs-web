<template>
  <a-result class="exception-container">
    <template #subTitle>
      <div style="color: #348ee4; font-size: 16px">抱歉，您没有权限访问</div>
    </template>
    <template #extra>
      <a-button type="primary" ghost @click="toHome"> 返回首页 </a-button>
    </template>
    <template #icon>
      <img :src="img403" />
    </template>
  </a-result>
</template>

<script>
import img403 from '/src/assets/img/403.png'
export default {
  name: 'Exception403',
  data() {
    return {
      img403
    }
  },
  methods: {
    toHome() {
      this.$router.push({ path: '/index' })
    }
  }
}
</script>
