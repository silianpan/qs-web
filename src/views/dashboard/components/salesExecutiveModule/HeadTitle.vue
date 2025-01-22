<!-- 头部展示组件 -->
<template>
  <a-card style="headShowStyle" :bordered="false">
    <!-- <div class="xianT"> 上下线条 -->
    <div class="topStyle">
      <div v-for="(item, index) in dataList" :key="index" class="topStyle">
        <div class="item-box" v-if="item.name === '收入合同'">
          <div class="item-left">
            <img :src="imgHetong" alt="" />
          </div>
          <div class="item-right">
            <h4>{{ item.name }}</h4>
            <p>
              {{ item.money }}<i>{{ item.decimalMoney }}</i>
              <span>&nbsp;元</span>
            </p>
            <p>{{ item.num }} &nbsp;<span>个</span></p>
          </div>
        </div>
        <!-- 收款总额 -->
        <div class="item-box" v-if="item.name === '收款总额'">
          <div class="item-left">
            <div class="left-img"><img :src="imgShoukuan" alt="" /></div>
          </div>
          <div class="item-right">
            <h4>{{ item.name }}</h4>
            <p>
              {{ item.money }}<i>{{ item.decimalMoney }}</i
              ><span>&nbsp;元 </span>
            </p>
            <p>{{ item.num }} &nbsp;<span>个</span></p>
          </div>
        </div>
        <div class="item-box" v-if="item.name === '正在跟进商机'">
          <div class="item-left">
            <img :src="imgShangji" alt="" />
          </div>
          <div class="item-right">
            <h4>{{ item.name }}</h4>
            <p>{{ item.num }} &nbsp;<span>个</span></p>
            <p><span> &nbsp; </span> &nbsp;</p>
          </div>
        </div>
        <div class="item-box" v-if="item.name === '正在招投标项目'">
          <div class="item-left">
            <img :src="imgToubiao" alt="" />
          </div>
          <div class="item-right">
            <h4>{{ item.name }}</h4>
            <p>{{ item.num }} &nbsp;<span>个</span></p>
            <p><span> &nbsp;</span> &nbsp;</p>
          </div>
        </div>
        <!-- </a-card> -->
      </div>
    </div>
    <!-- </div> -->
  </a-card>
</template>
<script>
import imgHetong from '/src/assets/img/saleExecuImg/hetong.png'
import imgShoukuan from '/src/assets/img/saleExecuImg/shoukuan.png'
import imgShangji from '/src/assets/img/saleExecuImg/shangji.png'
import imgToubiao from '/src/assets/img/saleExecuImg/toubiao.png'

export default {
  name: 'HeadTitle',
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
    return {
      imgHetong,
      imgShoukuan,
      imgShangji,
      imgToubiao
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style scoped lang="less">
span {
  font-size: 16px;
  color: #666666;
}
.topStyle {
  width: 100%;
  height: 75px;
  background: #ffffff;
  display: flex;
  margin-top: 5px;
  align-items: center;
  :nth-child(4) .item-box {
    border-right: none;
  }
}
.headShowStyle {
  width: 100%;
  height: 125px;
  background: #ffffff;
}
// 线条
// .xianT {
//   width: 100%;
//   height: 127px;
//   border: 1px solid rgb(242, 243, 245);
//   border-left: none;
//   border-right: none;
// }

.item-box {
  width: 100%;
  margin-left: 45px;
  display: flex;
  border-right: 1px solid rgb(242, 243, 245);
  .item-left {
    background-color: rgba(201, 205, 212, 0.35);
    margin: auto;
    border-radius: 50%;
    width: 54px;
    height: 54px;
    text-align: center;
    line-height: 50px;

    img {
      width: 50%;
    }
  }
  .item-right {
    width: 80%;
    height: 67%;
    margin: auto;
    display: flex;
    margin-left: 10px;
    flex-direction: column;
    align-items: flex-start;
    text-align: center;
    line-height: 40px;

    h4 {
      font-size: 16px;
    }
    p {
      font-weight: 500;
      font-size: 20px;
      line-height: 6px;
      font-family: Inter, -apple-system, BlinkMacSystemFont, PingFang SC, Hiragino Sans GB, noto sans, Microsoft YaHei, Helvetica Neue, Helvetica, Arial, sans-serif;
      i {
        font-style: normal;
        font-size: 14px;
      }
    }
  }
}
</style>
