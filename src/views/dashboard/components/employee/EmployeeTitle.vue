<!-- 头部展示组件 -->
<template>
  <a-card style="headShowStyle" :bordered="false">
    <div class="topStyle">
      <div v-for="(item, index) in dataList" :key="index" class="topStyle">
        <div class="item-box" v-if="item.name === '参与项目'">
          <div class="item-left">
            <img :src="imgXiangmu" alt="" />
          </div>
          <div class="item-right">
            <h4>{{ item.name }}</h4>
            <p>{{ item.num }} &nbsp;<span>个</span></p>
            <p><span></span>&nbsp;</p>
          </div>
        </div>

        <!-- 借款总额 -->
        <div class="item-box" v-if="item.name === '借款总额'">
          <div class="item-left">
            <img :src="imgJiekuan" alt="" />
          </div>
          <div class="item-right">
            <h4>{{ item.name }}</h4>
            <p>
              {{ item.money }}<i>{{ item.decimalMoney }}</i>
              <span>&nbsp;元</span>
            </p>
            <p><span>&nbsp;</span></p>
          </div>
        </div>
        <!-- 代还款 -->
        <div class="item-box" v-if="item.name === '待还总额'">
          <div class="item-left">
            <img :src="imgHuankuan" alt="" />
          </div>
          <div class="item-right">
            <h4>待还款总额</h4>
            <p>
              {{ item.money }}<i>{{ item.decimalMoney }}</i>
              <span>&nbsp;元</span>
            </p>
            <p>&nbsp;<span>&nbsp;</span></p>
          </div>
        </div>
      </div>
    </div>
  </a-card>
</template>
<script>
import imgXiangmu from '/src/assets/img/EmployeeImg/xiangmu.png'
import imgJiekuan from '/src/assets/img/EmployeeImg/jiekuan.png'
import imgHuankuan from '/src/assets/img/EmployeeImg/huankuan.png'

export default {
  name: 'EmployeeTitle',
  components: {},
  props: {
    dataList: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      imgXiangmu,
      imgJiekuan,
      imgHuankuan
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
.item-box {
  width: 100%;
  margin-left: 45px;
  display: flex;
  border-right: 1px solid rgb(242, 243, 245);
  .item-left {
    background: rgb(242, 243, 245);
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
      color: #4e5969;
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
