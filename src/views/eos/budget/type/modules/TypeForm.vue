<!-- 预算类型表单 -->
<template>
  <s-form ok single :queryDictKeys="dictKeys" :formTitle="'预算类型'" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel"> </s-form>
</template>

<script lang="jsx">
import dictConfig from '/src/views/eos/config/dict.config.js'
import { SForm } from '/src/components/index.js'
import { addType, updateType } from '/src/api/eos/budget/type.js'

export default {
  name: 'Type',
  props: {
    record: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    SForm
  },
  data() {
    return {
      dictKeys: [dictConfig.PROJECT_BUDGET_TYPE],
      formData: {},
      formItems: [
        [
          {
            type: 'input',
            label: '预算名称',
            prop: 'name',
            colspan: 24
          }
        ],
        [
          {
            type: 'input',
            label: '预算类型',
            prop: 'type',
            colspan: 24
          }
        ],
        // [
        //   {
        //     type: 'radio',
        //     label: '成本或者费用',
        //     prop: 'corE',
        //     colspan: 12,
        //     options: [
        //       { dictLabel: '成本', dictValue: '成本' },
        //       { dictLabel: '费用', dictValue: '费用' }
        //     ]
        //   },
        //   {
        //     type: 'radio',
        //     label: '是否对应合同',
        //     prop: 'hasContract',
        //     colspan: 12,
        //     options: [
        //       { dictLabel: '是', dictValue: '是' },
        //       { dictLabel: '否', dictValue: '否' }
        //     ]
        //   }
        [
          {
            type: 'inputTextArea',
            label: '备注',
            prop: 'remark',
            colspan: 24
          }
        ]
      ],
      formRules: {
        /* remarke: { required: true, message: '请输入', trigger: 'blur' }, */
        name: { required: true, message: '请输入', trigger: 'blur' },
        type: { required: true, message: '请选择', trigger: 'blur' }
        // corE: { required: true, message: '请输入', trigger: 'blur' },
        // hasContract: { required: true, message: '请输入', trigger: 'blur' }
      }
    }
  },
  methods: {
    // 提交
    handleSubmit() {
      // 新增
      if (!this.formData.id) {
        addType(this.formData).then(res => {
          this.$message.success(res.msg, 3)
          this.$emit('saveSuccess')
          this.$emit('ok')
          this.$emit('close')
        })
      } else {
        updateType(this.formData).then(res => {
          this.$message.success(res.msg, 3)
          this.$emit('saveSuccess')
          this.$emit('ok')
          this.$emit('close')
        })
      }
    },
    handleCancel() {
      this.$emit('restore')
      this.$emit('close')
    }
  },
  created() {
    if (!this._.isEmpty(this.record)) {
      this.formData = this.record
    }
  }
}
</script>
