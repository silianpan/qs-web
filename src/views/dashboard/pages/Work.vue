<!-- 高管 -->
<template>
  <div class="dashboard">
    <Statistics />
    <a-row :gutter="[8, 8]">
      <a-col :xl="17" :lg="17" :md="17" :sm="24" :xs="24">
        <Todo />
      </a-col>
      <a-col :xl="7" :lg="7" :md="7" :sm="24" :xs="24">
        <a-row :gutter="[8, 8]">
          <a-col :span="24">
            <WarningBus />
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row :gutter="[8, 8]">
      <a-col :span="24">
        <LineInoutTotal />
      </a-col>
    </a-row>
    <a-row :gutter="[8, 8]">
      <a-col :xl="8" :lg="8" :md="8" :sm="24" :xs="24">
        <RecentProject title="最近项目" />
      </a-col>
      <a-col :xl="8" :lg="8" :md="8" :sm="24" :xs="24">
        <BusinessOpportunity title="商机统计" />
      </a-col>
      <a-col :xl="8" :lg="8" :md="8" :sm="24" :xs="24">
        <ColumnIncomeOutlay title="支出统计" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import Todo from '../components/todo/index.vue'
import WarningBus from '../components/warning/index.vue'
import ColumnIncomeOutlay from '../components/finance/ColumnIncomeOutlay.vue'
import BusinessOpportunity from '../components/finance/BusinessOpportunity.vue'
import RecentProject from '../components/finance/RecentProject.vue'
import LineInoutTotal from '../components/finance/LineInoutTotal.vue'
import Statistics from '../components/finance/Statistics.vue'

export default {
  name: 'Work',
  components: {
    Todo,
    WarningBus,
    ColumnIncomeOutlay,
    LineInoutTotal,
    Statistics,
    BusinessOpportunity,
    RecentProject
  }
}
</script>

<style lang="less" scoped>
.dashboard {
  overflow: hidden;
}
</style>
