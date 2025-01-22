<template>
  <div class="top-back">
      <a-row>
        <a-col class="top-container" v-for="(item, index) in topItems" :key="index" :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
          <div class="img-container">
            <img :src="item.imgSrc" alt="明细图片" />
          </div>
          <div class="inner-msg">
            <h4>{{ item.name }}</h4>
            <div v-if="item.money">
              <i>￥</i>
              <span
              >{{ item.money }}<i>{{ item.decimalMoney }}</i></span
              >
            </div>
            <div v-if="item.num >= 0" class="msg-num" :class="{ justone: !item.money }">{{ item.num }} <i>个</i></div>
          </div>
        </a-col>
      </a-row>
  </div>
</template>

<script lang="jsx">
import expenditureContract from '/src/assets/img/dashboard/expenditureContract.png'
import buildingProject from '/src/assets/img/dashboard/buildingProject.png'
import finishedProject from '/src/assets/img/dashboard/finishedProject.png'
import materialBuy from '/src/assets/img/dashboard/materialBuy.png'


import { PMTopInfo } from '../../../../api/dashboard/PM'

export default {
  name: 'TreasurerStatistics',
  data() {
    return {
      topItems: [],
      imgs: [buildingProject, finishedProject, expenditureContract, materialBuy]
    }
  },
  mounted() {
    this.getStatistics()
  },
  methods: {
    getStatistics() {
      PMTopInfo().then(res => {
        res.data.forEach((item, index) => {
          item.imgSrc = this.imgs[index]
          const splitMoney = String(item.money).split('.')
          item.money = this.formateMoney(Number(splitMoney[0]))
          item.decimalMoney = '.' + splitMoney[1] || '00'
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
    height: 100%;
    text-align: left;

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
      font-size: 14px;
      font-weight: 400;

      i {
        vertical-align: bottom;
        font-style: normal;
        font-size: 14px;
      }

      span {
        display: inline-block;
        font-size: 20px;
        vertical-align: top;

        i {
          font-size: 14px;
          vertical-align: middle;
        }
      }

      &:first-of-type {
        span,
        i {
        }
      }

      &:last-of-type {
        span {
        }
      }
      &.msg-num {
        font-size: 22px;

        i {
          font-size: 14px;
          vertical-align: middle;
        }
      }
      &.justone {
        line-height: 40px;
      }
    }
  }
}
</style>
