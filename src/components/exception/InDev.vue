<!-- 无数据页面 -->
<template>
  <div class="no-data-container">
    <img class="no-data-img" :src="imgIndev" />
    <div class="no-data-text">开发中，敬请期待</div>
  </div>
</template>

<script>
import imgIndev from '/src/assets/img/indev.png'
export default {
  name: 'Indev',
  data() {
    return {
      imgIndev
    }
  }
}
</script>

<style lang="less" scoped>
.no-data-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 226px);
  overflow: hidden;

  .no-data-img {
    width: 497px;
    height: 289px;
  }

  .no-data-text {
    color: #348ee4;
    font-size: 16px;
  }
}
</style>
