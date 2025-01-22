<template>
  <div class="top-list">
    <div class="top-container" v-for="(item, index) in topItems" :key="index">
      <div class="img-container">
        <img :src="item.src" alt="明细图片" />
      </div>
      <div class="inner-msg">
        <h4>{{ item.name }}</h4>
        <div>
          本年:<i>￥</i
          ><span
            >{{ item.year }}<i>{{ item.decimalYear }}</i></span
          >
        </div>
        <div>
          本月:<i>￥</i
          ><span
            >{{ item.month }}<i>{{ item.decimalMonth }}</i></span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="jsx">
import collection from '/src/assets/img/dashboard/collection.png'
import expenditure from '/src/assets/img/dashboard/expenditure.png'
import expenditureContract from '/src/assets/img/dashboard/expenditureContract.png'
import revenueContract from '/src/assets/img/dashboard/revenueContract.png'
import gaoguanlirun from '/src/assets/img/dashboard/gaoguanlirun.png'

import { statistics } from '/src/api/eos/analysis/analyst.js'

export default {
  name: 'Statistics',
  data() {
    return {
      topItems: [],
      topIconsMap: {
        利润: gaoguanlirun,
        收入合同总金额: revenueContract,
        支出合同总金额: expenditureContract,
        收款总金额: collection,
        支出总金额: expenditure
      }
    }
  },
  mounted() {
    this.getStatistics()
  },
  methods: {
    getStatistics() {
      statistics().then(res => {
        res.data.forEach((item, index) => {
          item.src = this.topIconsMap[item.name]
          const splitYear = String(item.year).split('.')
          item.year = this.formateMoney(Number(splitYear[0]))

          item.decimalYear = splitYear[1] || '00'
          item.decimalYear = '.' + item.decimalYear

          const splitMonth = String(item.month).split('.')
          item.month = this.formateMoney(Number(splitMonth[0]))
          item.decimalMonth = splitMonth[1] || '00'
          item.decimalMonth = '.' + item.decimalMonth
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

  .img-container {
    width: 40px;
    height: 40px;
    margin-left: 14px;

    img {
      width: 100%;
    }
  }

  .inner-msg {
    margin-left: 10px;

    h4 {
      margin-bottom: 10px;
      font-weight: normal;
      font-size: 15px;
      font-family: Adobe Heiti Std;
      color: #54667a;
    }

    div {
      height: 30px;
      font-family: MicrosoftYaHei;
      line-height: 30px;
      font-size: 14px;
      font-weight: 400;
      color: #7c8b99;

      i {
        vertical-align: bottom;
        font-style: normal;
        font-size: 14px;
      }

      span {
        display: inline-block;
        font-size: 16px;
        vertical-align: top;

        i {
          font-size: 12px;
          vertical-align: middle;
        }
      }

      &:first-of-type {
        span,
        i {
          color: rgba(52, 142, 228, 1);
        }
      }

      &:last-of-type {
        span {
          color: rgba(82, 92, 101, 1);
        }
      }
    }
  }
}
</style>
