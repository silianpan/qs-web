<!-- 项目人工，差旅成本 -->
<template>
  <a-tabs default-active-key="1">
    <a-tab-pane key="1">
      <span slot="tab"> 人工成本 </span>
      <labor-use :projectCode="projectCode" :deptId="deptId" :deptTime="deptTime" />
    </a-tab-pane>
    <a-tab-pane key="2">
      <span slot="tab"> 差旅成本 </span>
      <onbus-use :projectCode="projectCode" :deptId="deptId" :deptTime="deptTime" />
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import LaborUse from '/src/views/eos/cost/labor/modules/LaborUse.vue'
import OnbusUse from '/src/views/eos/cost/onbus/modules/OnbusUse.vue'

export default {
  components: {
    LaborUse,
    OnbusUse
  },
  props: {
    projectCode: {
      type: String,
      default: null
    },
    deptId: {
      type: Number,
      default: null
    },
    deptTime: {
      type: String,
      default: null
    }
    // 预算类型：生产预算、销售预算、管理预算
    // budgetType: {
    //   type: String,
    //   required: true
    // },
    // 费用类型
    // expenseType: {
    //   type: String,
    //   required: true
    // }
  }
}
</script>
