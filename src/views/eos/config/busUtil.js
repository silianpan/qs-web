import Vue from 'vue'
import ProcessHistory from '/src/components/Activiti/HistoryG6Pro.vue'
import MerchantForm from '/src/views/eos/merchant/modules/MerchantForm.vue'

/**
 * 是否是管理项目（运营项目）
 * @param {String} projectType 项目类型
 * @returns
 */
export const isManageProject = projectType => {
  return projectType !== undefined && projectType !== null && projectType.indexOf('运营') !== -1
}

export const handleProcessHistory = instanceId => {
  if (Vue.prototype.isEmpty(instanceId)) {
    console.log('审批历史InstanceId为：', instanceId)
    return
  }
  Vue.prototype.$createAntdDrawer({
    stopPropagation: true,
    drawerProps: {
      title: '审批历史',
      width: '50%',
      maskClosable: true
    },
    content: {
      template: ProcessHistory,
      props: {
        instanceId
      }
    }
  })
}

// 新增、编辑客商
export const handleMerchantEdit = (name, merchantList, callBackFunc) => {
  let updateRow = null
  if (!Vue.prototype.isEmpty(name)) {
    const tmpArr = merchantList.filter(item => item.name === name)
    if (!Vue.prototype.isEmpty(tmpArr)) {
      updateRow = tmpArr[0]
    }
  }
  // 客商单位
  Vue.prototype.$createAntdDrawer({
    stopPropagation: true,
    drawerProps: {
      title: '添加/完善单位信息',
      width: '50%',
      maskClosable: true
    },
    content: {
      template: MerchantForm,
      props: {
        isUpdate: !Vue.prototype.isEmpty(updateRow),
        updateRow
      },
      on: {
        ok: () => {
          if (callBackFunc instanceof Function) {
            callBackFunc(name)
          }
        }
      }
    }
  })
}

/**
 * 业务流程-业务表单映射关系
 */
export const busFlowMap = {
  // 项目立项
  project: {
    processName: '项目立项',
    processColor: 'blue',
    busFieldProp: 'name',
    busDetailCompName: 'ProjectDetail',
    busReApplyCompName: 'ProjectReApply'
  },
  // 项目成员划分
  projectMen: {
    processName: '项目成员划分',
    processColor: 'blue',
    busFieldProp: 'sealProject.name',
    busDetailCompName: 'ProjectMemDetail',
    busReApplyCompName: 'MemReApply'
  },
  // 合同审批
  contract: {
    processName: '合同审批',
    processColor: 'green',
    busFieldProp: 'name',
    busDetailCompName: 'ContractDetail',
    busReApplyCompName: 'ContractReApply'
  },
  // 预算审批
  budget: {
    processName: '预算审批',
    processColor: 'orange',
    busFieldProp: 'sealProject.name',
    busFieldProp2: 'sysDept.deptName',
    busDetailCompName: 'BudgetDetail',
    busReApplyCompName: 'BudgetReApply'
  },
  // 报销审批
  expense: {
    processName: '报销审批',
    processColor: 'purple',
    busFieldProp: 'sealProject.name',
    busFieldProp2: 'sysDept.deptName',
    busDetailCompName: 'ExpenseDetail',
    busReApplyCompName: 'ExpenseReApply'
  },
  // 付款申请
  payment: {
    processName: '付款申请',
    processColor: 'pink',
    busFieldProp: 'sealProject.name',
    busFieldProp2: 'dept.deptName',
    busDetailCompName: 'PaymentDetail',
    busReApplyCompName: 'PaymentReApply'
  },
  // 借款审批
  loan: {
    processName: '借款审批',
    processColor: 'cyan',
    busFieldProp: 'type',
    busDetailCompName: 'LoanDetail',
    busReApplyCompName: 'LoanReApply'
  },
  // 开票申请
  invoiceMake: {
    processName: '开票申请',
    processColor: 'blue',
    busFieldProp: 'projectName',
    busFieldProp2: 'makeUnit',
    busDetailCompName: 'MakeFormDetail',
    busReApplyCompName: 'MakeReApply'
  },
  // 预算变更
  budgetChange: {
    processName: '预算变更',
    processColor: 'orange',
    busFieldProp: 'orangeProject.name',
    busFieldProp2: 'budgetApplyVo.sysDept.deptName',
    busDetailCompName: 'BudgetModifyDetail'
    // busReApplyCompName: 'ChangeBudgetReApply'
  },
  // 项目变更
  projectChange: {
    processName: '项目变更',
    processColor: 'blue',
    busFieldProp: 'orangeProject.name',
    busDetailCompName: 'ProjectModifyDetail'
    // busReApplyCompName: 'ChangeProjectReApply'
  },
  // 合同变更
  contractChange: {
    processName: '合同变更',
    processColor: 'green',
    busFieldProp: 'baseContract.name',
    busDetailCompName: 'ContractModifyDetail',
    busReApplyCompName: 'ContractModifyReApply'
  },
  // 采购申请
  purchaseApply: {
    processName: '采购申请',
    processColor: 'pink',
    busFieldProp: 'sealProject.name',
    busFieldProp2: 'dept.deptName',
    busDetailCompName: 'PurchaseApplyDetail',
    busReApplyCompName: 'PurchaseReApply'
  },
  // 物资入库
  warehouseIn: {
    processName: '物资入库',
    processColor: 'purple',
    busFieldProp: 'project.name',
    busDetailCompName: 'WarehouseInApplyDetail',
    busReApplyCompName: 'WarehouseInReApply'
  },
  // 保证金审批
  deposit: {
    processName: '保证金审批',
    processColor: 'cyan',
    busFieldProp: 'sealBid.name',
    busDetailCompName: 'EarnestDetail',
    busReApplyCompName: 'EarnestReApply'
  },
  // 工程量结算
  exec: {
    processName: '工程量结算',
    processColor: 'pink',
    busFieldProp: 'sealProject.name',
    busDetailCompName: 'ExecDetail',
    busReApplyCompName: 'ExecReApply'
  },
  // 零星用工
  employee: {
    processName: '零星用工',
    processColor: 'orange',
    busFieldProp: 'sealProject.name',
    busDetailCompName: 'EmployeeDetail',
    busReApplyCompName: 'EmployeeReApply'
  },
  // 物资出库
  warehouseOut: {
    processName: '物资出库',
    processColor: 'purple',
    busFieldProp: 'toProject.name',
    busDetailCompName: 'WarehouseOutapplyDetail',
    busReApplyCompName: 'WarehouseOutReApply'
  },
  // 物资划拨
  warehouseTransfer: {
    processName: '物资划拨',
    processColor: 'purple',
    busFieldProp: 'project.name',
    busDetailCompName: 'WarehouseTransferApplyDetail',
    busReApplyCompName: 'WarehouseTransferReApply'
  },
  labor: {
    processName: '人工成本上报',
    processColor: 'purple',
    busFieldProp: 'orderType',
    busDetailCompName: 'LaborDetail',
    busReApplyCompName: 'LaborReApply'
  },
  onBus: {
    processName: '差旅成本上报',
    processColor: 'purple',
    busFieldProp: 'orderType',
    busDetailCompName: 'OnbusDetail',
    busReApplyCompName: 'onbusApply'
  }
}
