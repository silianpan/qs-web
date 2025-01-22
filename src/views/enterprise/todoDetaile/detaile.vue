<template>
  <s-descriptions title="基本信息" :formItems="formItems" :formData="formData" />
</template>

<script lang="jsx">
import { SDescriptions } from '/src/components/index.js'

export default {
  props: {
    row: {
      type: [Object],
      require: true,
      default: () => null
    }
  },
  components: { SDescriptions },
  data() {
    return {
      formItems: [
        {
          label: '创建人',
          prop: 'create_by'
        },
        {
          label: '创建时间',
          prop: 'create_time'
        },
        {
          label: '状态',
          prop: 'status',
          customRender: text => {
            if (text === 0) {
              return <a-tag color="green">通过</a-tag>
            } else if (text === 1) {
              return <a-tag color="blue">流程中</a-tag>
            } else {
              return <a-tag color="orange">手动结束</a-tag>
            }
          }
        }
      ],
      formData: {}
    }
  },
  created() {
    const findFormItem = this.row.fields.map(({ label, vModel }) => ({ label, prop: vModel }))
    this.formItems = [...this.formItems, ...findFormItem]
    this.formData = this.row.data
  }
}
</script>

<style lang="less" scoped></style>
