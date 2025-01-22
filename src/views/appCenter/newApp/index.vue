<template>
  <div class="new-app-container">
    <div class="item block" @click="createBlock">
      <img src="./img/1.png" alt="" />
      <div class="create-app-description">
        <div class="title">创建空白应用</div>
        <div class="msg">从零开始创建全新应用</div>
      </div>
    </div>
    <div class="item template" @click="createTemplate">
      <img src="./img/2.png" alt="" />
      <div class="create-app-description">
        <div class="title">模板中心创建</div>
        <div class="msg">安装模板，快速开展您的业务</div>
      </div>
    </div>
    <div class="item service" @click="createService">
      <img src="./img/3.png" alt="" />
      <div class="create-app-description">
        <div class="title">定制应用</div>
        <div class="msg">官方团队为您个性化定制</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    /* 空白应用 */
    createBlock() {
      this.$emit('createBlock')
    },
    /* 创建模板 */
    createTemplate() {
      this.$emit('createTemplate')
    },
    /* 定制应用 */
    createService() {
      this.$emit('createService')
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
