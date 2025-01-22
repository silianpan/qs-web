<!-- 添加成员：待办重新提交 -->
<template>
  <div>
    <component ref="WarehouseTransferApply" :is="busComp" :updateRow="updateRow" :isUpdate="true" />
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
import WarehouseTransferApplyForm from './WarehouseTransferApplyForm'
import { getWarehouseTransferApply, reApply } from '/src/api/eos/warehouse/warehouseTransferApply.js'
import { finishTask } from '/src/api/activiti/process'

export default {
  name: 'WarehouseOutReApply',
  components: {
    ViewVerify,
    WarehouseTransferApplyForm
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
        getWarehouseTransferApply(this.todoItem.formId).then(({ data }) => {
          this.updateRow = data
          this.busComp = WarehouseTransferApplyForm
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
      this.$refs.WarehouseTransferApply.$refs.formTable.$refs.ruleForm.validate(valid => {
        if (valid) {
          const fd = { ...this.todoItem }
          fd.form = { ...this.$refs.WarehouseTransferApply.formData }
          fd.form.transferDetailList = [...this.$refs.WarehouseTransferApply.tableData]
          const data = {
            busForm: fd.form,
            taskId: fd.taskId,
            instanceId: fd.instanceId,
            variables: JSON.stringify({
              comment,
              pass: this.$refs.verify.pass,
              formData: fd.form
            }),
            dataId: fd.formId,
            type: fd.businessType
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
