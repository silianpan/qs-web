<!-- 添加成员：待办重新提交 -->
<template>
  <div>
    <component ref="projectMem" :is="busComp" :updateRow="updateRow" :isUpdate="true" />
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
import MemForm from './MemForm.vue'
import { getMemApply, reApply } from '/src/api/eos/project/memApply.js'
import { finishTask } from '/src/api/activiti/process'

export default {
  name: 'MemReApply',
  components: {
    ViewVerify,
    MemForm
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
    this.getMemApplyInfo()
  },
  methods: {
    getMemApplyInfo() {
      if (this.todoItem && this.todoItem.formId) {
        getMemApply(this.todoItem.formId).then(res => {
          this.updateRow = res.data
          this.busComp = MemForm
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
      this.$refs.projectMem.$refs.formTable.$refs.ruleForm.validate(valid => {
        if (valid) {
          const fd = { ...this.$refs.projectMem.formData }
          // 项目成员
          const sealProjectMemList = []
          this.$refs.projectMem.$refs.table.localDataSource.forEach(item => {
            const mem = {}
            mem.applyId = fd.id
            mem.projectId = fd.projectId
            mem.role = fd.type
            mem.userId = item.userId
            mem.id = item.memId
            sealProjectMemList.push(mem)
          })

          const busForm = { ...fd, sealProjectMemList }

          const data = {
            busForm,
            taskId: this.todoItem.taskId,
            instanceId: this.todoItem.instanceId,
            variables: JSON.stringify({
              comment,
              pass: this.$refs.verify.pass,
              formData: busForm
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
          alert('valid not pass, then return false')
          return false
        }
      })
    }
  }
}
</script>
