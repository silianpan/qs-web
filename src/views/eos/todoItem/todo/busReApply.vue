<template>
  <component :is="busReApplyCompName" :todoItem="todoItem" @ok="$emit('ok')" @close="$emit('close')" />
</template>

<script>
import ProjectReApply from '/src/views/eos/project/modules/ProjectReApply.vue'
import MemReApply from '/src/views/eos/project/mem/modules/MemReApply.vue'
import ContractReApply from '/src/views/eos/contract/modules/ContractReApply.vue'
import BudgetReApply from '/src/views/eos/budget/modules/BudgetReApply.vue'
import ExpenseReApply from '/src/views/eos/expense/modules/ExpenseReApply.vue'
import PaymentReApply from '/src/views/eos/purchase/payment/modules/PaymentReApply.vue'
import LoanReApply from '/src/views/eos/repayment/loan/modules/loanReApply.vue'
import MakeReApply from '/src/views/eos/invoice/make/modules/MakeReApply.vue'
import ChangeBudgetReApply from '/src/views/eos/budget/modify/modules/ChangeBudgetReApply.vue'
import ChangeProjectReApply from '/src/views/eos/project/modify/modules/ChangeProjectReApply.vue'
import PurchaseReApply from '/src/views/eos/purchase/apply/modules/PurchaseReApply.vue'
import EarnestReApply from '/src/views/eos/earnest/apply/modules/EarnestReApply.vue'
import LaborReApply from '/src/views/eos/cost/labor/modules/LaborReApply.vue'
import onbusApply from '/src/views/eos/cost/onbus/modules/onbusApply.vue'
import WarehouseInReApply from '/src/views/eos/warehouse/warehouseInApply/modules/WarehouseInReApply.vue'
import WarehouseOutReApply from '/src/views/eos/warehouse/warehouseOutapply/modules/WarehouseOutReApply'
import WarehouseTransferReApply from '/src/views/eos/warehouse/warehouseTransferApply/modules/WarehouseTransferReApply'
import ExecReApply from '/src/views/eos/subcontract/exec/modules/ExecReApply'
import EmployeeReApply from '../../subcontract/employee/modules/EmployeeReApply'

export default {
  props: {
    todoItem: {
      // 待办项
      type: Object,
      default: () => {}
    },
    busReApplyCompName: {
      type: String,
      required: true
    }
  },
  components: {
    ProjectReApply,
    MemReApply,
    ContractReApply,
    BudgetReApply,
    ExpenseReApply,
    PaymentReApply,
    LoanReApply,
    MakeReApply,
    ChangeBudgetReApply,
    ChangeProjectReApply,
    PurchaseReApply,
    EarnestReApply,
    LaborReApply,
    onbusApply,
    WarehouseInReApply,
    WarehouseOutReApply,
    WarehouseTransferReApply,
    ExecReApply,
    EmployeeReApply
  }
}
</script>
