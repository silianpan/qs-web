<!-- 指标卡 -->
<template>
  <li>
    <img :src="icon" alt="" />
    <div class="content-box">
      <div class="text">{{ title }}</div>
      <div class="number">
        <icon-font :type="iconfontSum" class="icon"></icon-font>
        <count-to :start-val="0" :end-val="financeData.sum" :duration="4000" :decimals="2" :separator="','" :prefix="'¥ '" :suffix="' 元'" />
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
    // 金融数据
    financeData: {
      type: Object,
      default: () => ({
        sum: 0
      })
    }
  },
  components: {
    countTo
  }
}
</script>
