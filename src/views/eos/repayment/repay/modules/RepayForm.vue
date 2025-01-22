<!-- 还款表单 -->
<template>
  <s-form ok single :okText="'保存'" :queryDictKeys="dictKeys" :formTitle="'还款申请表单'" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel"> </s-form>
</template>

<script>
import moment from 'moment'
import { SForm } from '/src/components/index.js'
import { addRepay, updateRepay } from '/src/api/eos/repayment/repay.js'

export default {
  name: 'Repay',
  props: {
    // 是否更新表单
    isUpdate: {
      type: Boolean,
      default: false
    },
    // 表单更新数据
    updateRow: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    SForm
  },
  data() {
    return {
      dictKeys: [],
      formData: {
        createBy: this.$store.getters.userName,
        nickname: this.$store.getters.nickname,
        expenseCode: 'HKSQ' + moment().format('YYYYMM-DDHHmmss'),
        repayType: '直接还款'
      },
      formItems: [
        [
          {
            type: 'text',
            prop: 'expenseCode',
            label: '项目编号',
            colspan: 4
          },
          {
            type: 'text',
            prop: 'nickname',
            label: '立项人',
            colspan: 4
          }
        ],
        [
          {
            type: 'text',
            prop: 'repayType',
            label: '还款方式',
            colspan: 4
          },
          {}
        ],
        [
          {
            type: 'input',
            label: '还款金额',
            prop: 'sum',
            colspan: 4
          },
          {
            type: 'datePicker',
            label: '还款日期',
            prop: 'createTime',
            colspan: 4
          }
        ],
        [
          {
            type: 'inputTextArea',
            label: '备注',
            prop: 'remark',
            colspan: 8,
            formItemProps: {
              props: {
                labelCol: { lg: 3, md: 8, sm: 10, xs: 24 },
                wrapperCol: { lg: 21, md: 16, sm: 14, xs: 24 }
              }
            }
          }
        ],
        [
          {
            type: 'upload',
            prop: 'attachment',
            label: '附件',
            colspan: 24,
            customDefaultFileList: () => this.updateRow && this.updateRow.attachment,
            handleChange: ret => {
              this.formData.attachment = JSON.stringify(ret)
            },
            compProps: {
              props: {
                multiple: true
              }
            },
            formItemProps: {
              props: {
                labelCol: { lg: 3, md: 8, sm: 10, xs: 24 },
                wrapperCol: { lg: 21, md: 16, sm: 14, xs: 24 }
              }
            }
          }
        ]
      ],
      formRules: {
        sum: { required: true, message: '请输入', trigger: 'blur' },
        date: { required: true, message: '请输入', trigger: 'change' }
      }
    }
  },
  methods: {
    handleSubmit() {
      const ReplayVo = { ...this.formData }
      ReplayVo.createTime = ReplayVo.createTime.format('YYYY-MM-DD HH:mm:ss')
      if (!this.isUpdate) {
        addRepay(ReplayVo).then(res => {
          this.$message.success(res.msg)
          this.$emit('ok')
          this.$emit('close')
        })
      } else {
        updateRepay(ReplayVo).then(res => {
          this.$message.success(res.msg)
          this.$emit('ok')
          this.$emit('close')
        })
      }
    },
    handleCancel() {
      this.$emit('ok')
      this.$emit('close')
    }
  },
  created() {
    if (this.isUpdate) {
      this.formData = this.updateRow
      this.formData.nickname = this.$store.getters.nickname
    }
  }
}
</script>
<style lang="less" scoped>
.s-border-zero {
  font-size: 14px;
  font-weight: bold;
  color: rgb(0, 55, 235);
}
</style>
