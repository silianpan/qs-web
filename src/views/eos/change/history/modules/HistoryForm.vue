<!-- 变更历史表单 -->
<template>
  <s-form-table ok :okText="'保存'" :queryDictKeys="dictKeys" :formTitle="'变更历史表单'" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel">
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
  name: 'History',
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
            type: 'select',
            label: '变更类型',
            prop: 'changeType',
            options: dictConfig.xxx,
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '变更原因',
            prop: 'reason',
            colspan: 4
          }
        ],
        [
          {
            type: 'editor',
            label: '变更内容',
            prop: 'content',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '业务ID',
            prop: 'busId',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '项目ID',
            prop: 'projectId',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '项目编号',
            prop: 'projectCode',
            colspan: 4
          }
        ]
      ],
      formRules: {
        version: { required: true, message: '请输入', trigger: 'blur' },
        changeType: { required: true, message: '请选择', trigger: 'change' },
        reason: { required: true, message: '请输入', trigger: 'blur' },
        content: { required: true, message: '请输入', trigger: 'blur' },
        busId: { required: true, message: '请输入', trigger: 'blur' },
        projectId: { required: true, message: '请输入', trigger: 'blur' },
        projectCode: { required: true, message: '请输入', trigger: 'blur' }
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
