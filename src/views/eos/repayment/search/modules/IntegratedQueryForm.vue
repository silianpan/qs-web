<!-- 综合查询 -->
<template>
  <s-form-table ok :okText="'确认'" :queryDictKeys="dictKeys" :formTitle="'借还款综合查询'" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel">
    <template v-slot:theader>
      <div class="s-mt-2 s-mb-2">
        <span>申请编号：</span>
        <div style="display: inline-block">
          <span class="s-border-zero" style="margin-right: 20px">{{ formData.code }}</span>
        </div>
        <span>申请人：</span>
        <div style="display: inline-block">
          <span class="s-border-zero">{{ formData.createUser }}</span>
        </div>
      </div>
    </template>
  </s-form-table>
</template>

<script>
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { SFormTable } from '/src/components/index.js'

export default {
  name: 'IntegratedQuery',
  components: {
    SFormTable
  },
  data() {
    return {
      dictKeys: [],
      formData: {
        createUser: this.$store.getters.userName,
        code: 'HKSQ' + moment().format('YYYYMM-DDHHmmss')
      },
      formItems: [
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
            prop: 'date',
            colspan: 4
          }
        ],
        [
          {
            type: 'select',
            label: '还款方式',
            prop: 'repayType',
            options: dictConfig.xxx,
            colspan: 8
          }
        ],
        [
          {
            type: 'inputTextArea',
            label: '备注',
            prop: 'reason',
            colspan: 8
          }
        ]
      ],
      formRules: {
        sum: { required: true, message: '请输入', trigger: 'blur' },
        datePicker: { required: true, message: '请输入', trigger: 'blur' },
        repayType: { required: true, message: '请选择', trigger: 'change' }
      }
    }
  },
  methods: {
    handleSubmit() {},
    handleCancel() {
      this.$emit('close')
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
