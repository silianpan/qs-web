<!-- 经营分析明细 -->
<template>
  <a-tabs default-active-key="1">
    <a-tab-pane key="1">
      <span slot="tab">
        <a-icon :style="{ fontSize: '18px' }" type="team" />
        人员投入情况
      </span>
      <company-labor :row="row" />
    </a-tab-pane>
    <a-tab-pane key="2">
      <span slot="tab">
        <icon-font :style="{ fontSize: '18px' }" type="iconfont-yusuan4" />
        进度及执行情况
      </span>
      <AnalyzeElement :row="row" />
    </a-tab-pane>
    <a-tab-pane key="3">
      <span slot="tab">
        <icon-font :style="{ fontSize: '18px' }" type="iconfont-hetongguanli" />
        资金计划情况
      </span>
      <!-- <contract-list-op :projectId="row.id" /> -->
      <company-fund :row="row" />
    </a-tab-pane>
    <a-tab-pane key="4">
      <span slot="tab">
        <icon-font :style="{ fontSize: '18px' }" type="iconfont-yusuan4" />
        实际收支情况
      </span>
      <!-- <project-budget-use :projectId="row.id" /> -->
      <company-real :row="row" />
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import CompanyLabor from './modules/CompanyLabor.vue'
import CompanyFund from './modules/CompanyFund.vue'
import CompanyReal from './modules/CompanyReal.vue'
import AnalyzeElement from '/src/views/eos/schedule/progressSummary/analyzeElement.vue'

export default {
  name: 'CompanyDetailAll',
  components: {
    CompanyLabor,
    CompanyFund,
    CompanyReal,
    AnalyzeElement
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
