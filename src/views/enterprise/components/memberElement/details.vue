<template>
  <div>
    <s-form ok okText="修改" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel" />
  </div>
</template>

<script>
import { SForm } from '/src/components/index.js'
import { editUser } from '/src/api/system/user.js'
export default {
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    SForm
  },
  data() {
    return {
      formData: {},
      formItems: [
        [
          {
            type: 'input',
            label: '姓名',
            prop: 'nickName'
          }
        ],
        [
          {
            type: 'input',
            label: '手机',
            prop: 'phonenumber',
            compProps: {
              props: {
                disabled: true
              }
            }
          }
        ],
        [
          {
            type: 'input',
            label: '邮箱',
            prop: 'email'
          }
        ]
      ],
      formRules: {
        nickName: { required: true, message: '请输入', trigger: 'blur' },
        phonenumber: { required: true, message: '请输入', trigger: 'blur' }
        // email: { required: true, message: '请输入', trigger: 'blur' }
      }
    }
  },
  methods: {
    handleSubmit(data) {
      editUser(data).then(res => {
        this.$message.success('修改成功!')
        this.$emit('ok')
        this.$emit('close')
      })
    },
    handleCancel() {
      this.$emit('close')
    }
  },
  mounted() {
    this.formData = { ...this.row }
  }
}
</script>
