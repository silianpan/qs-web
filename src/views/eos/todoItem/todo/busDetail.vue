<template>
  <div>
    <component :is="detailCompName" :row="row" :formId="formId" :formKey="formKey" />
    <a-divider>审批意见</a-divider>
    <view-verify :isOnlyShowProcess="isOnlyShowProcess" :isShowReApply="false" :todoItem="todoItem" @getList="handleGetList" @delegateTask="handleDelegateTask" @close="handleClose" />
  </div>
</template>

<script>
import ProjectDetail from '/src/views/eos/project/detail.vue'
import ProjectMemDetail from '/src/views/eos/project/mem/detail.vue'
import ContractDetail from '/src/views/eos/contract/detail.vue'
import BudgetDetail from '/src/views/eos/budget/details.vue'
import ExpenseDetail from '/src/views/eos/expense/details.vue'
import PaymentDetail from '/src/views/eos/purchase/payment/detail.vue'
import LoanDetail from '/src/views/eos/repayment/loan/details.vue'
import MakeFormDetail from '/src/views/eos/invoice/make/details.vue'
import ExecDetail from '/src/views/eos/subcontract/exec/modules/ExecDetail.vue'
import EmployeeDetail from '/src/views/eos/subcontract/employee/modules/EmployeeDetail.vue'
import BudgetModifyDetail from '/src/views/eos/budget/modify/details.vue'
import ProjectModifyDetail from '/src/views/eos/project/modify/details.vue'
import PurchaseApplyDetail from '/src/views/eos/purchase/apply/detail.vue'
import ContractModifyDetail from '/src/views/eos/contract/modify/details.vue'
// import FreightInDetail from '/src/views/project/freightIn/detail'
import EarnestDetail from '/src/views/eos/earnest/apply/modules/ApplyDetail.vue'

import ViewVerify from '/src/components/Activiti/ViewVerify/index.vue'
import UserSelect from '/src/components/Activiti/UserSelect'
import LaborDetail from '/src/views/eos/cost/labor/details.vue'
import OnbusDetail from '/src/views/eos/cost/onbus/details.vue'
import WarehouseInApplyDetail from '/src/views/eos/warehouse/warehouseInApply/modules/WarehouseInApplyDetail.vue'
import WarehouseOutapplyDetail from '/src/views/eos/warehouse/warehouseOutapply/modules/WarehouseOutapplyDetail.vue'
import WarehouseTransferApplyDetail from '/src/views/eos/warehouse/warehouseTransferApply/modules/WarehouseTransferApplyDetail'

export default {
  props: {
    // 待办项
    todoItem: {
      type: Object,
      default: () => {}
    },
    // 是否只展示流程
    isOnlyShowProcess: {
      type: Boolean,
      default: false
    },
    detailCompName: {
      type: String,
      required: true
    },
    row: {
      type: Object,
      default: () => {}
    },
    formId: {
      type: Number,
      default: null
    },
    formKey: {
      type: String,
      default: null
    }
  },
  components: {
    ViewVerify,
    ProjectDetail,
    ContractDetail,
    ProjectMemDetail,
    BudgetDetail,
    ExpenseDetail,
    PaymentDetail,
    LoanDetail,
    MakeFormDetail,
    ExecDetail,
    EmployeeDetail,
    LaborDetail,
    OnbusDetail,
    BudgetModifyDetail,
    ProjectModifyDetail,
    PurchaseApplyDetail,
    EarnestDetail,
    // ViewVerify,
    ContractModifyDetail,
    WarehouseInApplyDetail,
    WarehouseOutapplyDetail,
    WarehouseTransferApplyDetail
  },
  methods: {
    handleGetList() {
      this.$emit('getList')
    },
    handleDelegateTask() {
      this.handleViewUserList()
    },
    handleClose() {
      this.$emit('close')
    },
    handleViewUserList() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '选择转办的人员',
          width: '50%',
          maskClosable: true
        },
        content: {
          template: UserSelect,
          props: {
            taskId: this.todoItem.taskId,
            dataId: this.todoItem.formId,
            businessType: this.todoItem.businessType
          },
          on: {
            getList: () => {
              this.$emit('getList')
              this.$emit('close')
              this.$emit('ok')
            }
            // 注意，这里的close事件内部组件传递不出来
            // close: () => {}
          }
        }
      })
    }
  }
}
</script>
