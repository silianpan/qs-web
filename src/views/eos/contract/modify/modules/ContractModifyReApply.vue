<!-- 添加成员：待办重新提交 -->
<template>
  <div>
    <component ref="ChangeApply" :is="busComp" :updateRow="updateRow" :isUpdate="true" />
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

export default {
  name: 'ContractModifyReApply',
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
        // getContract(this.busFlow.formId).then(({ data }) => {
        //   this.updateRow = data
        //   this.busComp = contractModifyForm
        // })
      }
    },
    close() {
      this.$emit('close')
    },
    /* 确认 */
    handleReApply() {
      const comment = this.$refs.verify.comment
      if (this.isEmpty(comment)) {
        return this.$message.error('请填写批注')
      }
      // const data = {
      //   busForm: this.params,
      //   taskId: this.busFlow.taskId,
      //   instanceId: this.busFlow.instanceId,
      //   variables: JSON.stringify({
      //     comment,
      //     pass: this.$refs.verify.pass,
      //     formData: this.busFlow
      //   })
      // }
      /* 提交 */
      // reApply(data).then(res => {
      //   this.$message.success(res.msg)
      //   this.$emit('ok')
      //   this.$emit('close')
      // })
    }
  }
}
</script>
