<!-- 保证金申请表单 -->
<template>
  <s-form-table ok :okText="'保存'" :queryDictKeys="dictKeys" :formTitle="'保证金申请表单'" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel">
    <template v-slot:theader>
      <a-row class="s-mt-6 s-mb-6" type="flex" justify="start" :gutter="16">
        <a-col>申请编号：{{ formData.code }}</a-col>
        <a-col>申请人：{{ $store.getters.nickname }}</a-col>
        <a-col>申请时间：{{ formData.createTime }}</a-col>
      </a-row>
    </template>
  </s-form-table>
</template>

<script>
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { SFormTable } from '/src/components/index.js'
import { addApply, updateApply } from '/src/api/eos/earnest/earnestMoney.js'
import { listProjectSimple } from '/src/api/eos/project/project.js'
export default {
  name: 'ApplyForm',
  components: {
    SFormTable
  },
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
  data() {
    return {
      dictKeys: [dictConfig.PROJECT_EARNESTMONEY_TYPE],
      projectList: [],
      formData: {
        createBy: this.$store.getters.userName,
        code: 'CODE' + moment().format('YYYYMM-DDHHmmss'),
        createTime: this.$store.getters.createTime
      },
      formItems: [
        [
          {
            type: 'select',
            label: '项目名称',
            prop: 'projectId',
            colspan: 4,
            valueAlias: 'id',
            labelAlias: 'name',
            options: () => this.projectList
          },
          {
            type: 'radio',
            label: '保证金类型',
            prop: 'depositType',
            options: dictConfig.PROJECT_EARNESTMONEY_TYPE,
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '保证金金额(元)',
            prop: 'depositMoney',
            colspan: 4,
            
          },
          {
            type: 'datePicker',
            label: '预计退还时间',
            prop: 'returnTime',
            colspan: 4
          }
        ],
        [
          {
            type: 'inputTextArea',
            label: '备注',
            prop: 'remark'
          }
        ]
      ],
      formRules: {
        projectId: { required: true, message: '请选择', trigger: 'change' },
        depositType: { required: true, message: '请选择', trigger: 'change' },
        depositMoney: { required: true, message: '请输入', trigger: 'blur' },
        returnTime: { required: true, message: '请选择', trigger: 'change' },
        remark: { required: false, message: '请输入', trigger: 'blur' }
      }
    }
  },
  created() {
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formData = { ...this.updateRow }
    }
    listProjectSimple({ state: '0' }).then(res => {
      this.projectList = res.data
    })
  },
  methods: {
    handleSubmit() {
      const fd = { ...this.formData }
      // 更新或添加
      if (this.isUpdate && !this.isEmpty(fd.id)) {
        updateApply(fd).then(res => {
          this.$message.success('修改成功', 3)
          this.$emit('ok')
          this.$emit('close')
        })
      } else {
        addApply(fd).then(res => {
          this.$message.success('新增成功', 3)
          this.$emit('ok')
          this.$emit('close')
        })
      }
    },
    handleCancel() {
      this.$emit('close')
    }
  }
}
</script>
