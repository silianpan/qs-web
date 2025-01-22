<!-- 发票管理表单 -->
<template>
  <s-form-table ok :okText="'保存'" :queryDictKeys="dictKeys" :formTitle="'发票管理表单'" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel">
    <template v-slot:theader>
      <div class="s-mt-2 s-mb-2">
        <span>编号：</span>
        <div style="display: inline-block">
          <a-input class="s-border-zero" v-model="formData.code" />
        </div>
        <span>创建人：</span>
        <div style="display: inline-block">
          <a-input class="s-border-zero" v-model="formData.createBy" />
        </div>
      </div>
    </template>
  </s-form-table>
</template>

<script>
import dictConfig from '/src/views/eos/config/dict.config.js'
import { SFormTable } from '/src/components/index.js'

export default {
  name: 'Invoice',
  components: {
    SFormTable
  },
  data() {
    return {
      dictKeys: [],
      formData: {},
      formItems: [
        [
          {
            type: 'input',
            label: '版本',
            prop: 'version',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '发票号码',
            prop: 'no',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '发票单位',
            prop: 'unit',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '发票金额',
            prop: 'money',
            colspan: 4
          }
        ],
        [
          {
            type: 'select',
            label: '业务类型',
            prop: 'busType',
            options: dictConfig.xxx,
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '业务编号',
            prop: 'busCode',
            colspan: 4
          }
        ],
        [
          {
            type: 'textarea',
            label: '附件',
            prop: 'attachment',
            colspan: 4
          }
        ]
      ],
      formRules: {
        version: { required: true, message: '请输入', trigger: 'blur' },
        no: { required: true, message: '请输入', trigger: 'blur' },
        unit: { required: true, message: '请输入', trigger: 'blur' },
        money: { required: true, message: '请输入', trigger: 'blur' },
        busType: { required: true, message: '请选择', trigger: 'change' },
        busCode: { required: true, message: '请输入', trigger: 'blur' },
        attachment: { required: true, message: '请输入', trigger: 'blur' }
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('ok')
      this.$emit('close')
    },
    handleCancel() {
      this.$emit('close')
    }
  }
}
</script>
