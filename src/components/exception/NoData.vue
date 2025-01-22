<!-- 无数据页面 -->
<template>
  <div :class="divClass">
    <img :class="imgClass" :src="imgNodata" />
    <div class="no-data-text">暂无数据</div>
  </div>
</template>
<script>
import imgNodata from '/src/assets/img/Nodata.png'
export default {
  props: {
    index: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imgNodata
    }
  },
  computed:{
    divClass(){
      return this.index? ['no-data-container-index'] : ['no-data-container']
    },
    imgClass(){
      return this.index? ['no-data-img-index'] : ['no-data-img']
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
}
.no-data-container-index {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 210px;
  overflow: hidden;

  .no-data-img-index {
    width: 300px;
    height: 150px;
  }
}
.no-data-text {
  color: #348ee4;
  font-size: 16px;
}
</style>
