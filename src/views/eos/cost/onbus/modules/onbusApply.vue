<!-- 差旅成本：待办重新提交 -->
<template>
  <div>
    <component ref="onbusApply" :is="busComp" :updateRow="updateRow" :isUpdate="true" />
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
import ViewVerify from '/src/components/Activiti/ViewVerify/index.vue'
import OnbusForm from './OnbusForm.vue'
import { reApply, getOnbus } from '/src/api/eos/cost/onbus.js'
import { finishTask } from '/src/api/activiti/process'

export default {
  name: 'OnbusApply',
  components: {
    ViewVerify,
    OnbusForm
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
    this.getMemApplyInfo()
  },
  methods: {
    getMemApplyInfo() {
      if (this.todoItem && this.todoItem.formId) {
        getOnbus(this.todoItem.formId).then(({ data }) => {
          this.updateRow = data
          this.busComp = OnbusForm
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
      const loanVo = { ...this.$refs.onbusApply.formData }
      loanVo.date = loanVo.createTime
      loanVo.sealLoanDetails = this.$refs.onbusApply.TableDatas
      const data = {
        busForm: loanVo,
        taskId: this.todoItem.taskId,
        instanceId: this.todoItem.instanceId,
        variables: JSON.stringify({
          comment,
          pass: this.$refs.verify.pass,
          formData: this.todoItem
        }),
        dataId: this.todoItem.formId,
        type: this.todoItem.businessType
      }

      // 提交
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
