<!-- 高管 -->
<template>
  <div class="dashboard">
    <a-row :gutter="[8, 8]">
      <a-col :xl="18" :lg="18" :md="18" :sm="24" :xs="24">
        <a-row :gutter="[8, 8]">
          <a-col :span="24">
            <a-card class="container-box" :bordered="false" :headStyle="{ border: 'none' }" :bodyStyle="{ padding: 0, overflow: 'hidden' }">
              <ul class="text-list">
                <ContractIndexCard title="收入合同" :contractData="{ sum: 23423.23, num: 82 }" :icon="imgContractIn" />
                <ContractIndexCard
                  title="支出合同"
                  iconfontSum="iconfont-qian"
                  :contractData="{ sum: 4533.23, num: 152 }"
                  :icon="imgContractOut"
                />
                <FinanceIndexCard
                  title="收款"
                  iconfontSum="iconfont-zijin"
                  :financeData="{ sum: 123333.0 }"
                  :icon="imgIncome"
                />
                <FinanceIndexCard
                  title="支出"
                  iconfontSum="iconfont-zijinguanli"
                  :financeData="{ sum: 23234.34 }"
                  :icon="imgOutcome"
                />
              </ul>
            </a-card>
          </a-col>
          <a-col :span="24">
            <Todo />
          </a-col>
        </a-row>
      </a-col>
      <a-col :xl="6" :lg="6" :md="6" :sm="24" :xs="24">
        <a-row :gutter="[8, 8]">
          <a-col :span="24">
            <WarningBus />
          </a-col>
          <a-col :span="24">
            <Notice />
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row :gutter="[8, 8]">
      <a-col :xl="18" :lg="18" :md="18" :sm="24" :xs="24">
        <a-row :gutter="[8, 8]">
          <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <ColumnIncomeOutlay title="收支分析" />
          </a-col>
          <a-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <BarCost title="成本分析" />
          </a-col>
        </a-row>
      </a-col>
      <a-col :xl="6" :lg="6" :md="6" :sm="24" :xs="24">
        <AppCommon />
      </a-col>
    </a-row>
    <a-row :gutter="[8, 8]">
      <a-col :span="24">
        <LineInout />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import ContractIndexCard from '../components/contract/IndexCard.vue'
import FinanceIndexCard from '../components/finance/IndexCard.vue'
import Todo from '../components/todo/index.vue'
import WarningBus from '../components/warning/index.vue'
import AppCommon from '../components/app/Common.vue'
import Notice from '../components/notice/index.vue'
import ColumnIncomeOutlay from '../components/finance/ColumnIncomeOutlay.vue'
import BarCost from '../components/finance/BarCost.vue'
import LineInout from '../components/finance/LineInout.vue'
import imgContractIn from '/src/assets/img/dashboard/revenueContract.png'
import imgContractOut from '/src/assets/img/dashboard/expenditureContract.png'
import imgOutcome from '/src/assets/img/dashboard/expenditure.png'
import imgIncome from '/src/assets/img/dashboard/collection.png'

export default {
  components: {
    ContractIndexCard,
    FinanceIndexCard,
    Todo,
    WarningBus,
    AppCommon,
    Notice,
    ColumnIncomeOutlay,
    BarCost,
    LineInout
  },
  data() {
    return {
      imgContractIn,
      imgContractOut,
      imgOutcome,
      imgIncome
    }
  }
}
</script>

<style scoped>
.dashboard {
  overflow: hidden;
}
.text-list {
  display: flex;
  justify-content: space-around;
  padding: 20px;
}
</style>
