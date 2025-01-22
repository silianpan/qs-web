<!-- 头部展示组件 -->
<template>
  <div class="topStyle">
    <div v-for="(item, index) in dataList" :key="index">
      <a-card :style="headShowStyle" :bordered="false">
        <div class="item-box">
          <div class="item-left">
            <img src="http://p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image" alt="" />
          </div>
          <div class="item-right">
            <h4>{{ item.name }}</h4>
            <p>{{ item.num }} &nbsp;<span>个</span></p>
            <p>
              {{ item.money == 0 ? '' : item.money }} <span style="color: #666666; font-size: 20px">{{ item.money == 0 ? '' : '￥' }}</span
              >&nbsp;
            </p>
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HeadShow',
  components: {},
  props: {
    // 大小样式文件
    headShowStyle: {
      type: Object,
      default: () => {}
    },
    dataList: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less">
.topStyle {
  background: #ffffff;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}
.item-box {
  display: flex;
  border: none;
  height: 100%;
  justify-content: center;
  align-items: center;
  .item-left {
    background: rgb(242, 242, 237);
    border-radius: 50%;
  }
  .item-right {
    margin-left: 20px;
    height: 100%;

    h4 {
      color: #656c65;
    }
    p {
      margin: 0 0;
      font-size: 22px;
      font-weight: 500;
      color: var(--color-text-1);
      font-family: Inter, -apple-system, BlinkMacSystemFont, PingFang SC, Hiragino Sans GB, noto sans, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
      span {
        font-size: 18px;
        color: #aab1aa;
        font-weight: 400;
      }
    }
  }
}
</style>
