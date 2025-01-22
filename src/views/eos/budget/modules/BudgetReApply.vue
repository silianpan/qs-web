<!-- 添加成员：待办重新提交 -->
<template>
  <div>
    <component ref="BudgetApply" :is="busComp" :updateRow="updateRow" :isUpdate="true" />
    <a-divider>添加批注</a-divider>
    <view-verify ref="verify" :todoItem="todoItem" />
    <div class="bottom-control">
      <a-space>
        <a-button type="primary" @click="handleReApply">确 定</a-button>
        <a-button @click="close">关 闭</a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import { getOneApply } from '/src/api/eos/budget/budget.js'
import { reApply } from '/src/api/eos/budget/apply.js'
import ViewVerify from '/src/components/Activiti/ViewVerify/index.vue'
import BudgetForm from './BudgetForm.vue'
import { finishTask } from '/src/api/activiti/process'

export default {
  name: 'BudgetReApply',
  components: {
    ViewVerify,
    BudgetForm
  },
  props: {
    todoItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // 业务数据
      updateRow: null,
      // 业务修改组件
      busComp: null,
      params: {}
    }
  },
  mounted() {
    this.getApplyInfo()
  },
  methods: {
    getApplyInfo() {
      if (this.todoItem && this.todoItem.formId) {
        getOneApply(this.todoItem.formId).then(({ data }) => {
          this.updateRow = data
          this.busComp = BudgetForm
        })
      }
    },
    close() {
      this.$emit('close')
    },
    /* 确认 */
    handleReApply() {
      const comment = this.$refs.verify.comment
      if (this.isEmpty(comment)) {
        this.$message.error('请填写批注')
        return
      }
      this.$refs.BudgetApply.$refs.formTable.$refs.ruleForm.validate(valid=>{
        if(valid){
          const fd = {...this.$refs.BudgetApply.formData}
          const TableList = this.$refs.BudgetApply.$refs.table.localDataSource
          const tableData = TableList.map(({ name, id, Iremark, type, sum, remark, typeId }) => {
            return {
              id,
              name,
              sum,
              remark,
              Iremark
            }
          })
          fd.sealBudgets = tableData
          if (fd.BudgetType === '部门') {
            delete fd.isBudget
            delete fd.projectId
          }
          const data = {
            busForm: fd,
            taskId: this.todoItem.taskId,
            instanceId: this.todoItem.instanceId,
            variables: JSON.stringify({
              comment,
              pass: this.$refs.verify.pass,
              formData: fd
            }),
            dataId: this.todoItem.formId,
            type: this.todoItem.businessType
          }
          /* 提交 */
          if (this.$refs.verify.pass) {
            reApply(data).then(res => {
              this.$message.success(res.msg)
              this.$emit('ok')
              this.$emit('close')
            })
          } else {
            finishTask({
              taskId: this.todoItem.taskId,
              type: this.todoItem.businessType,
              dataId: this.todoItem.formId
            }).then(res => {
              this.$message.success(res.msg)
              this.$emit('ok')
              this.$emit('close')
            })
          }
        }else{
          return false
        }
      })


    }
  }
}
</script>
