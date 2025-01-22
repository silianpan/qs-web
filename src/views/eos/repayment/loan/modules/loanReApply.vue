<!-- 借款重新提交 -->
<template>
  <div>
    <component ref="loanApply" :is="busComp" :updateRow="updateRow" :isUpdate="true" :disType="true" />
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
import LoanForm from './LoanForm.vue'
import { getLoan, reApply } from '/src/api/eos/repayment/loan.js'
import { finishTask } from '/src/api/activiti/process'

export default {
  name: 'LoanReApply',
  components: {
    ViewVerify,
    LoanForm
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
        getLoan(this.todoItem.formId).then(({ data }) => {
          this.updateRow = data
          this.busComp = LoanForm
        })
      }
    },
    close() {
      this.$emit('close')
    },
    getPass(passValue) {
      this.pass = passValue
    },
    /* 确认 */
    handleReApply() {
      const comment = this.$refs.verify.comment
      if (this.isEmpty(comment)) {
        this.$message.error('请填写批注')
        return
      }
      this.$refs.loanApply.$refs.formTable.$refs.ruleForm.validate(valid => {
        if (valid) {
          let loanVo = {}
          loanVo = { ...this.$refs.loanApply.formData }
          loanVo.sealLoanDetails.forEach(item => {
            if (typeof item.id === 'string') {
              delete item.id
            }
          })
          loanVo.date = loanVo.createTime
          const data = {
            busForm: loanVo,
            taskId: this.todoItem.taskId,
            instanceId: this.todoItem.instanceId,
            variables: JSON.stringify({
              comment,
              pass: this.$refs.verify.pass,
              formData: loanVo
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
        } else {
          return false
        }
      })
    }
  }
}
</script>
