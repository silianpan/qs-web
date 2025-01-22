<!-- 综合明细 -->
<template>
  <a-tabs default-active-key="1" tabPosition="left">
    <a-tab-pane key="1">
      <span slot="tab">
        <icon-font :style="{ fontSize: '18px' }" type="iconfont--" />
        项目
      </span>
      <project-detail :row="row" />
      <mem-list :projectId="row.id" />
    </a-tab-pane>
    <a-tab-pane key="2" v-if="permissions.indexOf('eos:gzt:gg')>-1 || permissions.indexOf('eos:gzt:xszg')>-1">
      <span slot="tab">
        <icon-font :style="{ fontSize: '18px' }" type="iconfont-shangji3" />
        商机信息
      </span>
      <shang-ji :row="row"></shang-ji>
    </a-tab-pane>
    <a-tab-pane key="3">
      <span slot="tab">
        <icon-font :style="{ fontSize: '18px' }" type="iconfont-hetongguanli" />
        合同
      </span>
      <contract-list-op :projectId="row.id" />
    </a-tab-pane>
    <a-tab-pane key="4">
      <span slot="tab">
        <icon-font :style="{ fontSize: '18px' }" type="iconfont-shixushujuku" />
        进度执行情况
      </span>
      <progress-summary-detail :projectId="row.id" :projectType="row.type" />
    </a-tab-pane>
    <a-tab-pane key="5">
      <span slot="tab">
        <icon-font :style="{ fontSize: '18px' }" type="iconfont-yusuan4" />
        预算及执行情况
      </span>
      <project-budget-use :projectId="row.id" />
    </a-tab-pane>
    <a-tab-pane key="6">
      <span slot="tab">
        <icon-font :style="{ fontSize: '18px' }" type="iconfont-a-guihuatubiaoyuanwenjianFarlim_huaban1fuben33" />
        项目采购
      </span>
      <PurchaseList :projectId="row.id"></PurchaseList>
    </a-tab-pane>
    <a-tab-pane key="7">
      <span slot="tab">
        <icon-font :style="{ fontSize: '18px' }" type="iconfont-bumen" />
        劳务分包
      </span>
      <SubcontractList :projectId="row.id"></SubcontractList>
    </a-tab-pane>
        <a-tab-pane key="8">
      <span slot="tab">
        <icon-font :style="{ fontSize: '18px' }" type="iconfont-bumen" />
        成本上报
      </span>
      <ProjectCost :projectCode="row.code"></ProjectCost>
    </a-tab-pane>
    <a-tab-pane key="9">
      <span slot="tab">
        <icon-font :style="{ fontSize: '18px' }" type="iconfont--tongjibiao" />
        统计分析
      </span>
      <project-analysis :projectId="row.id" :projectType="row.type" />
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import ProjectDetail from './detail.vue'
import ProjectMemList from './memList.vue'
import ContractListOp from '../contract/listOp.vue'
import ProjectBudgetUse from './modules/ProjectBudgetUse.vue'
import ProjectAnalysis from './modules/ProjectAnalysis.vue'
import Shangji from './modules/Shangji'
import ProgressSummaryDetail from '/src/views/eos/schedule/progressSummary/detail.vue'
// import inventory from '/src/views/project/inventory/detail'
import PurchaseList from '../purchase/apply/list.vue'
import SubcontractList from '../subcontract/search/index.vue'
import ProjectCost from  './modules/projectCost.vue'
import {mapGetters} from 'vuex'

export default {
  name: 'ProjectDetailAll',
  components: {
    ProjectDetail,
    memList: ProjectMemList,
    ContractListOp,
    ProjectBudgetUse,
    ProjectAnalysis,
    ProgressSummaryDetail,
    PurchaseList,
    SubcontractList,
    ProjectCost,
    ShangJi: Shangji
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  computed:{
    ...mapGetters(['permissions'])
  },
}
</script>
