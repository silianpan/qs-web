<!-- 待办重新提交 -->
<template>
  <div>
    <component ref="payment" :isReApply="true" :is="busComp" :updateRow="updateRow" :isUpdate="true" />
    <a-divider>添加批注</a-divider>
    <view-verify ref="verify" :todoItem="todoItem" @getPass="getPass" />
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
import PaymentForm from './PaymentForm.vue'
import { getPayment, reApply } from '/src/api/eos/purchase/payment.js'
import { finishTask } from '/src/api/activiti/process'

export default {
  name: 'PaymentReApply',
  components: {
    ViewVerify,
    PaymentForm
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
    this.getPaymentInfo()
  },
  methods: {
    getPaymentInfo() {
      if (this.todoItem && this.todoItem.formId) {
        getPayment(this.todoItem.formId).then(res => {
          this.updateRow = res.data
          this.busComp = PaymentForm
        })
      }
    },
    close() {
      this.$emit('close')
    },
    getPass(passValue) {
      this.pass = passValue
    },
    handleReApply() {
      const comment = this.$refs.verify.comment
      if (this.isEmpty(comment)) {
        this.$message.error('请填写批注')
        return
      }
      this.$refs.payment.$refs.formTable.$refs.ruleForm.validate(valid => {
        if (valid) {
          const fd = { ...this.todoItem }
          fd.form = { ...this.$refs.payment.formData }
          fd.form.paymentDetailList = [...this.$refs.payment.tableData]
          fd.form.applyDate && (fd.form.applyDate = fd.form.applyDate.format('YYYY-MM-DD HH:mm:ss'))
          const data = {
            busForm: fd.form,
            taskId: fd.taskId,
            instanceId: fd.instanceId,
            variables: JSON.stringify({
              comment,
              pass: this.$refs.verify.pass,
              formData: fd.form
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
