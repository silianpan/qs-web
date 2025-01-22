<!-- 综合明细 -->
<template>
  <a-tabs default-active-key="1" tabPosition="left">
    <a-tab-pane key="1">
      <span slot="tab">
        <icon-font :style="{ fontSize: '18px' }" type="iconfont--" />
        基本信息
      </span>
      <budget-detail :row="row" :formId="row.id"/>
    </a-tab-pane>
    <a-tab-pane key="2">
      <span slot="tab">
        <icon-font :style="{ fontSize: '18px' }" type="iconfont-shangji3" />
        合同
      </span>
      <contract-list-op :deptId="row.orgId" :deptTime="row.deptTime"/>
    </a-tab-pane>
    <a-tab-pane key="3">
      <span slot="tab">
        <icon-font :style="{ fontSize: '18px' }" type="iconfont-hetongguanli" />
        预算及执行情况
      </span>
      <project-budget-use :orgId="row.orgId" :deptTime="row.deptTime" />
    </a-tab-pane>
    <a-tab-pane key="4">
      <span slot="tab">
        <icon-font :style="{ fontSize: '18px' }" type="iconfont-shixushujuku" />
        成本上报
      </span>
      <ProjectCost :deptId="row.orgId" :deptTime="row.deptTime"></ProjectCost>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import BudgetDetail from './details.vue'
import ContractListOp from '../contract/listOp.vue'
import ProjectBudgetUse from '../project/modules/ProjectBudgetUse.vue'
import ProjectCost from  '../project/modules/projectCost.vue'

export default {
  name: 'ProjectDetailAll',
  components: {
    BudgetDetail,
    ContractListOp,
    ProjectBudgetUse,
    ProjectCost
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
