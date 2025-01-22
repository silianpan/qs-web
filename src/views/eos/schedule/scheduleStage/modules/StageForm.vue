<!-- 进度计划阶段表单 -->
<template>
  <s-form-table ok :okText="'提交申请'" :queryDictKeys="dictKeys" :formTitle="'进度计划阶段表单'" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel">
    <template v-slot:theader>
      <a-row class="s-mt-6 s-mb-6" type="flex" justify="start" :gutter="16">
        <a-col>编号：{{ formData.code }}</a-col>
        <a-col>创建人：{{ $store.getters.nickname }}</a-col>
      </a-row>
    </template>
  </s-form-table>
</template>

<script>
import { SFormTable } from '/src/components/index.js'

export default {
  name: 'Stage',
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
            label: '所属项目的id',
            prop: 'projectId',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '阶段名称',
            prop: 'name',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '计划工作量',
            prop: 'workload',
            colspan: 4
          }
        ],
        [
          {
            type: 'textarea',
            label: '节点描述',
            prop: 'note',
            colspan: 4
          }
        ],
        [
          {
            type: 'datetime',
            label: '计划开始日期',
            prop: 'beginDate',
            colspan: 4
          }
        ],
        [
          {
            type: 'datetime',
            label: '计划完成日期',
            prop: 'endDate',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '父节点',
            prop: 'parentId',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '阶段所属层级',
            prop: 'level',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '本级顺序',
            prop: 'serial',
            colspan: 4
          }
        ]
      ],
      formRules: {
        version: { required: true, message: '请输入', trigger: 'blur' },
        projectId: { required: true, message: '请输入', trigger: 'blur' },
        name: { required: true, message: '请输入', trigger: 'blur' },
        workload: { required: true, message: '请输入', trigger: 'blur' },
        note: { required: true, message: '请输入', trigger: 'blur' },
        beginDate: { required: true, message: '请输入', trigger: 'blur' },
        endDate: { required: true, message: '请输入', trigger: 'blur' },
        parentId: { required: true, message: '请输入', trigger: 'blur' },
        level: { required: true, message: '请输入', trigger: 'blur' },
        serial: { required: true, message: '请输入', trigger: 'blur' }
      }
    }
  },
  methods: {
    onOk() {
      return new Promise(resolve => {
        resolve(true)
      })
    },
    onCancel() {
      return new Promise(resolve => {
        resolve(true)
      })
    },
    handleSubmit() {
      this.$emit('finish')
    },
    handleCancel() {
      this.$emit('unfinish')
    }
  }
}
</script>
