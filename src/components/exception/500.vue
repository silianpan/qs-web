<template>
  <a-result class="exception-container">
    <template #subTitle>
      <div style="color: #348ee4; font-size: 16px">您访问的服务器丢了</div>
    </template>
    <template #extra>
      <a-button type="primary" ghost @click="toHome"> 返回首页 </a-button>
    </template>
    <template #icon>
      <img :src="img500" />
    </template>
  </a-result>
</template>

<script>
  import img500 from '/src/assets/img/500.png'
  export default {
    name: 'Exception500',
    data() {
      return {
        img500
      }
    },
    methods: {
      toHome () {
          this.$router.push({ path: '/index' })
      }
    }
  }
</script>
