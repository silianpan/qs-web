<!-- 预警提示首页 -->
<template>
  <div>
    <ul class="warn-ul">
      <li v-for="(item, index) in loadData" :key="index">
        <div class="label">{{ item.label }}</div>
        <div class="value" @click="labelValue(item.label)">{{ item.value }} 个</div>
      </li>
    </ul>
  </div>
</template>

<script>
import { warnTotal } from '/src/api/eos/warn/warn.js'
import WarnContractStage from './modules/contractStage.vue'
import WarnPlanIn from './modules/planIn.vue'
import WarnPlanOut from './modules/planOut.vue'
import WarnEarnest from './modules/earnest.vue'

export default {
  name: 'WarnIndex',
  data() {
    return {
      loadData: null
    }
  },
  methods: {
    labelValue(name) {
      if (name === '合同履约到期提醒') {
        this.contract()
      }
      if (name === '保证金退还到期提醒') {
        this.earnest()
      }
      if (name === '本月计划收款到期提醒') {
        this.paymentReal()
      }
      if (name === '本月计划付款到期提醒') {
        this.payment()
      }
    },
    /** 合同阶段提醒详情 */
    contract() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '合同履约到期提醒',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: WarnContractStage
        }
      })
    },
    /** 保证金提醒详情 */
    earnest() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '保证金退还到期提醒',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: WarnEarnest
        }
      })
    },
    /** 本月计划收款提醒详情 */
    paymentReal() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '本月计划收款到期提醒',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: WarnPlanIn
        }
      })
    },
    /** 本月计划付款提醒详情 */
    payment() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '本月计划付款到期提醒',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: WarnPlanOut
        }
      })
    },
    /** 刷新页面 */
    refresh() {
      this.$refs.list.refresh()
    },
    /* 请求数据 */
    getData() {
      warnTotal().then(res => {
        this.loadData = [
          {
            label: '合同履约到期提醒',
            value: res.data.contract
          },
          {
            label: '保证金退还到期提醒',
            value: res.data.earnest
          },
          {
            label: '本月计划收款到期提醒',
            value: res.data.planIn
          },
          {
            label: '本月计划付款到期提醒',
            value: res.data.planOut
          }
        ]
      })
    }
  },
  created() {
    this.getData()
  }
}
</script>
<style lang="less" scoped>
.warn-ul {
  display: flex;
  height: 90%;
  justify-content: space-between;
  flex-wrap: wrap;
  text-align: center;
  padding: 0;
  margin: 0;
  li {
    height: 126px;
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }
}
.label {
  font-size: 14px;
  color: #333;
  transition: all 0.5s ease-in-out;
}
.value {
  color: #348ee4;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
}
.label,
.value {
  @media screen and (max-width: 1700px) {
    margin: 0;
  }
  @media screen and (max-width: 1600px) {
    margin: 0;
  }
  @media screen and (max-width: 1400px) {
    margin-bottom: 18px;
  }
}
</style>
