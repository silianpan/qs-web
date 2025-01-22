<template>
  <div class="top-back">
    <a-row>
      <a-col class="top-container" v-for="(item, index) in topItems" :key="index" :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
        <div class="img-container">
          <img :src="item.imgSrc" alt="明细图片" />
        </div>
        <div class="inner-msg">
          <h4>{{ item.name }}</h4>
          <div>
            <i>￥</i>
            <span
              >{{ item.year }}<i>{{ item.decimalYear }}</i></span
            >
          </div>
          <div v-if="item.hasNum" class="msg-num">{{ item.num }} <i>个</i></div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="jsx">
import revenueContract from '/src/assets/img/dashboard/revenueContract.png'
import expenditureContract from '/src/assets/img/dashboard/expenditureContract.png'
import collection from '/src/assets/img/dashboard/collection.png'
import expenditure from '/src/assets/img/dashboard/expenditure.png'

import { statistics } from '/src/api/eos/analysis/analyst.js'

export default {
  name: 'TreasurerStatistics',
  data() {
    return {
      topItems: [],
      imgs: [revenueContract, expenditureContract, collection, expenditure]
    }
  },
  mounted() {
    this.getStatistics()
  },
  methods: {
    getStatistics() {
      statistics().then(res => {
        res.data = res.data.slice(1.4)
        res.data[0].hasNum = true
        res.data[1].hasNum = true
        res.data.forEach((item, index) => {
          item.imgSrc = this.imgs[index]
          const splitYear = String(item.year).split('.')
          item.year = this.formateMoney(Number(splitYear[0]))
          item.decimalYear = splitYear[1] || '00'
          item.decimalYear = '.' + item.decimalYear
        })
        this.topItems = res.data
      })
    },
    formateMoney(value) {
      if (Number(value)) {
        value = Number(value).toFixed(2)
        const intPart = Math.trunc(value) // 获取整数部分
        const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
        return intPartFormat
      } else {
        return 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
.top-container {
  display: flex;
  align-items: center;
  padding-left: 40px;
  height: 128px;

  .img-container {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    background-color: rgba(201, 205, 212, .35);
    vertical-align: middle;
    text-align: center;
    line-height: 50px;
    overflow: hidden;
    margin-right: 15px;

    img {
      width: 50%;
    }
  }

  .inner-msg {
    text-align: left;
    height: 100%;

    h4 {
      height: 50px;
      line-height: 70px;
      font-weight: normal;
      font-size: 14px;
      font-family: Adobe Heiti Std;
      color: rgb(78, 89, 105);
      margin-bottom: 0;
    }

    div {
      height: 30px;
      font-family: MicrosoftYaHei;
      //line-height: 20px;
      font-size: 14px;
      font-weight: 400;
      //color: #7c8b99;

      i {
        vertical-align: bottom;
        font-style: normal;
        font-size: 14px;
      }

      span {
        display: inline-block;
        font-size: 20px;
        vertical-align: top;
        //color: #7c8b99;

        i {
          font-size: 14px;
          vertical-align: middle;
        }
      }

      &:first-of-type {
        span,
        i {
          //color: rgba(52, 142, 228, 1);
        }
      }

      &.msg-num {
        font-size: 22px;
        //line-height: 10px;
        //color: rgba(52, 142, 228, 1);

        i {
          font-size: 14px;
          vertical-align: middle;
          //color: rgba(52, 142, 228, 1);
        }
      }

    }
  }
}
</style>
