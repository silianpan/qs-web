<!-- 指标卡 -->
<template>
  <li>
    <img :src="icon" alt="" />
    <div class="content-box">
      <div class="text">{{ title }}</div>
      <div class="number">
        <icon-font :type="iconfontSum" class="icon"></icon-font>
        <count-to :start-val="0" :end-val="contractData.sum" :duration="4000" :decimals="2" :separator="','" :prefix="'¥ '" :suffix="' 元'" />
      </div>
      <div class="number">
        <icon-font :type="iconfontNum" class="icon"></icon-font>
        <count-to :startVal="0" :endVal="contractData.num" :duration="4000" :suffix="' 个'" />
      </div>
    </div>
  </li>
</template>

<script>
import countTo from 'vue-count-to'
export default {
  props: {
    // 金额图标
    iconfontSum: {
      type: String,
      default: 'iconfont-zijin2'
    },
    // 数量图标
    iconfontNum: {
      type: String,
      default: 'iconfont-shuliangtongji'
    },
    // 分类图标
    icon: {
      type: String,
      default: ''
    },
    // 标题
    title: {
      type: String,
      required: true
    },
    // 合同数据
    contractData: {
      type: Object,
      default: () => ({
        num: 0,
        sum: 0
      })
    }
  },
  components: {
    countTo
  }
}
</script>
