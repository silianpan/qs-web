<!-- 代办重新提交 -->
<template>
  <div>
    <component ref="deposit" :is="busComp" :updateRow="updateRow" :isUpdate="true" />
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
import { getApply, reApply } from '/src/api/eos/earnest/earnestMoney.js'
import ViewVerify from '/src/components/Activiti/ViewVerify/index.vue'
import ApplyForm from './ApplyForm.vue'
import { finishTask } from '/src/api/activiti/process'

export default {
  name: 'EarnestReApply',
  components: {
    ViewVerify,
    ApplyForm
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
      busComp: null
    }
  },
  mounted() {
    this.getProjectInfo()
  },
  methods: {
    getProjectInfo() {
      if (this.todoItem && this.todoItem.formId) {
        getApply(this.todoItem.formId).then(res => {
          this.updateRow = res.data
          this.busComp = ApplyForm
        })
      }
    },
    close() {
      this.$emit('close')
    },
    handleReApply() {
      const comment = this.$refs.verify.comment
      if (this.isEmpty(comment)) {
        this.$message.error('请填写批注')
        return
      }
      this.$refs.deposit.$refs.formTable.$refs.ruleForm.validate(valid => {
        if (valid) {
          const fd = { ...this.$refs.deposit.formData }
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
        } else {
          return false
        }
      })
    }
  }
}
</script>
