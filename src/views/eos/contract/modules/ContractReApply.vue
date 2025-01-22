<!-- 待办重新提交 -->
<template>
  <div>
    <component ref="contract" :is="busComp" :updateRow="updateRow" :isReApplay="true" :isUpdate="true" />
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
import ContractForm from './ContractForm.vue'
import { getContract, reApply } from '/src/api/eos/contract/contract.js'
import { finishTask } from '/src/api/activiti/process'

export default {
  name: 'ContractReApply',
  components: {
    ViewVerify,
    ContractForm
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
    this.getContractInfo()
  },
  methods: {
    getContractInfo() {
      if (this.todoItem && this.todoItem.formId) {
        getContract(this.todoItem.formId).then(res => {
          this.updateRow = res.data
          this.busComp = ContractForm
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
      this.$refs.contract.$refs.ruleForm.$refs.ruleForm.validate(valid => {
        if (valid) {
          const fd = { ...this.$refs.contract.formData }
          fd.signingDate && (fd.signingDate = fd.signingDate.format('YYYY-MM-DD HH:mm:ss'))
          fd.startDate && (fd.startDate = fd.startDate.format('YYYY-MM-DD HH:mm:ss'))
          fd.endDate && (fd.endDate = fd.endDate.format('YYYY-MM-DD HH:mm:ss'))
          fd.sealAmountLists = this.$refs.contract.materialProcurement.concat(this.$refs.contract.billQuantities)
          fd.sealContractStageList = [...this.$refs.contract.contractStages]
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
