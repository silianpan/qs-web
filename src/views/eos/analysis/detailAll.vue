<!-- 经营分析明细 -->
<template>
  <a-tabs default-active-key="1">
    <a-tab-pane key="1">
      <span slot="tab">
        <a-icon :style="{ fontSize: '18px' }" type="team" />
        人员投入情况
      </span>
      <analyst-labor :row="row" />
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
      <analyst-fund :row="row" />
    </a-tab-pane>
    <a-tab-pane key="4">
      <span slot="tab">
        <icon-font :style="{ fontSize: '18px' }" type="iconfont-yusuan4" />
        实际收支情况
      </span>
      <!-- <project-budget-use :projectId="row.id" /> -->
      <analyst-real :row="row" />
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import AnalystFund from './modules/AnalystFund.vue'
import AnalystLabor from './modules/AnalystLabor.vue'
import AnalystReal from './modules/AnalystReal.vue'
import AnalyzeElement from '/src/views/eos/schedule/progressSummary/analyzeElement.vue'

export default {
  name: 'AnalystDetailAll',
  components: {
    AnalystLabor,
    AnalystFund,
    AnalystReal,
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
