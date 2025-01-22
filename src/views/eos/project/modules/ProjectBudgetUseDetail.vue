<!-- 预算执行明细 -->
<template>
  <a-tabs default-active-key="1">
    <a-tab-pane key="1">
      <span slot="tab"> 个人报销 </span>
      <expense-use :projectId="projectId" :projectCode="projectCode" :deptId="deptId" :deptTime="deptTime" :budgetType="budgetType" :expenseType="expenseType" />
    </a-tab-pane>
    <a-tab-pane key="2">
      <span slot="tab"> 采购付款 </span>
      <payment-use :projectId="projectId" :projectCode="projectCode" :deptId="deptId" :deptTime="deptTime" :budgetType="budgetType" :budgetTypeId="budgetTypeId" />
    </a-tab-pane>
    <a-tab-pane v-if="expenseType === '公司人员费用'" key="3">
      <span slot="tab"> 人工成本 </span>
      <labor-use :projectCode="projectCode" :deptId="deptId" :deptTime="deptTime" :expenseType="budgetType" />
    </a-tab-pane>
    <template v-if="expenseType === '差旅费'">
      <a-tab-pane key="4">
        <span slot="tab"> 差旅成本 </span>
        <onbus-use :projectCode="projectCode" :deptId="deptId" :deptTime="deptTime" :expenseType="budgetType" />
      </a-tab-pane>
      <!-- <a-tab-pane key="5">
        <span slot="tab">
          机票申请
        </span>
        <ticket-use :projectCode="projectCode" :expenseType="budgetType" />
      </a-tab-pane> -->
    </template>
  </a-tabs>
</template>

<script>
import PaymentUse from '/src/views/eos/purchase/payment/modules/PaymentUse.vue'
import ExpenseUse from '/src/views/eos/expense/modules/ExpenseUse.vue'
import LaborUse from '/src/views/eos/cost/labor/modules/LaborUse.vue'
import OnbusUse from '/src/views/eos/cost/onbus/modules/OnbusUse.vue'
// import TicketUse from '/src/views/project/onbus/modules/TicketUse'

export default {
  components: {
    PaymentUse,
    ExpenseUse,
    LaborUse,
    OnbusUse
  },
  props: {
    projectId: {
      type: Number,
      default: null
    },
    projectCode: {
      type: String,
      default: ''
    },
    // 预算类型：生产预算、销售预算、管理预算
    budgetType: {
      type: String,
      required: true
    },
    // 费用类型
    expenseType: {
      type: String,
      required: false,
      default: ''
    },
    budgetTypeId: {
      type: Number,
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
  }
}
</script>
