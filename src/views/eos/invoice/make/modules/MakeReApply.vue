<!-- 开票重新提交 -->
<template>
  <div>
    <component ref="makeApply" :is="busComp" :updateRow="updateRow" :isUpdate="true" />
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
import { getMake, reApply } from '/src/api/eos/invoice/make.js'
import ViewVerify from '/src/components/Activiti/ViewVerify/index.vue'
import MakeForm from './MakeForm.vue'
import { finishTask } from '/src/api/activiti/process'

export default {
  name: 'MakeReApply',
  components: {
    ViewVerify,
    MakeForm
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
        getMake(this.todoItem.formId).then(({ data }) => {
          this.updateRow = data
          this.busComp = MakeForm
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
      const reApplyVo = this.$refs.makeApply.formData
      this.$refs.makeApply.$refs.formTable.$refs.ruleForm.validate(valid => {
        if(valid){
          reApplyVo.makeTime = reApplyVo.makeTime && reApplyVo.makeTime.format('YYYY-MM-DD HH:mm:ss')
          reApplyVo.returnDate = reApplyVo.returnDate && reApplyVo.returnDate.format('YYYY-MM-DD HH:mm:ss')
          const data = {
            busForm: reApplyVo,
            taskId: this.todoItem.taskId,
            instanceId: this.todoItem.instanceId,
            variables: JSON.stringify({
              comment,
              pass: this.$refs.verify.pass,
              formData: reApplyVo
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
