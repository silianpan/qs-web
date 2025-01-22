<!-- 预算变更重新提交 -->
<template>
  <div>
    <component ref="BudgetApply" :is="busComp" :updateRow="updateRow" :isUpdate="true" />
    <a-divider>添加批注</a-divider>
    <view-verify ref="verify" :busFlow="busFlow" />
    <div class="bottom-control">
      <a-space>
        <a-button type="primary" @click="handleReApply">确 定</a-button>
        <a-button @click="close">关 闭</a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import ViewVerify from '/src/components/Activiti/ViewVerify/index.vue'
import { getOneApply } from '/src/api/eos/budget/budget.js'
import { reApply } from '/src/api/eos/budget/apply.js'
import { finishTask } from '/src/api/activiti/process'

export default {
  name: 'ChangeBudgetReApply',
  components: {
    ViewVerify
  },
  props: {
    busFlow: {
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
      if (this.busFlow && this.busFlow.formId) {
        getOneApply(this.busFlow.formId).then(({ data }) => {
          this.updateRow = data
          // this.busComp = BudgetForm
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
      this.params.projectId = this.$refs.BudgetApply.formData.project_id
      this.params.createBy = this.$refs.BudgetApply.formData.createBy
      this.params.code = this.$refs.BudgetApply.formData.code
      this.params.type = this.$refs.BudgetApply.formData.type
      this.params.remark = this.$refs.BudgetApply.formData.remark
      this.params.attachment = this.$refs.BudgetApply.formData.attachment
      this.params.id = this.$refs.BudgetApply.formData.id
      this.params.budgetTypeVos = this.$refs.BudgetApply.mainTypeList
      this.params.budgetTypeVos.forEach(item => {
        item.projectId = this.$refs.BudgetApply.formData.project_id
      })
      const data = {
        busForm: this.params,
        taskId: this.busFlow.taskId,
        instanceId: this.busFlow.instanceId,
        variables: JSON.stringify({
          comment,
          pass: this.$refs.verify.pass,
          formData: this.busFlow
        })
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
    }
  }
}
</script>
