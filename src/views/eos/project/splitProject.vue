<template>
  <div>
    <a-row class="s-mt-6 s-mb-6" type="flex" justify="start" :gutter="16"> </a-row>
    <s-form ref="formTable" ok :okText="'保存'" layout="vertical" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel"> </s-form>
  </div>
</template>

<script>
import moment from 'moment'
import defaultSettings from '/src/config/defaultSettings.js'
import { SForm } from '/src/components/index.js'
import { allTree } from '/src/api/system/dept.js'
import { addChildProject, updateProject, getChildProjectById } from '/src/api/eos/project/project.js'
import dictConfig from '/src/views/eos/config/dict.config.js'

export default {
  components: {
    SForm
  },
  props: {
    record: {
      type: Object,
      default: () => {}
    },
    update: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        createBy: this.$store.getters.userName,
        nickname: this.$store.getters.nickname,
        code: defaultSettings.codePrefix + moment().format('YYYYMM-DDHHmmss'),
        pid: this.record.id
      },
      belongDeptList: [],
      projectTypeOptionList: [],
      formItems: [
        [
          {
            type: 'text',
            prop: 'code',
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
            type: 'input',
            prop: 'name',
            label: '项目命名规范：父项目名-子项目名',
            colspan: 4,
            defaultValue: this.record.name + '-'
          },
          {
            type: 'treeSelect',
            prop: 'deptId',
            label: '所属部门',
            colspan: 4,
            valueAlias: 'id',
            labelAlias: 'label',
            options: () => this.belongDeptList
          }
        ],
        [
          {
            type: 'select',
            prop: 'type',
            label: '项目类型',
            colspan: 4,
            options: () => this.projectTypeOptionList
          },
          {
            type: 'inputTextArea',
            prop: 'sketch',
            label: '项目描述',
            colspan: 8,
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
        name: { required: true, message: '请输入', trigger: 'blur' },
        deptId: { required: true, message: '请选择', trigger: 'change' },
        type: { required: true, message: '请选择类型', trigger: 'blur' }
      }
    }
  },
  mounted() {

    // this.formData.name = this.record.name + '-'

    // 默认建设承建单位 父项目
    this.formData.ownerUnit = this.record.ownerUnit
    this.formData.consUnit = this.record.consUnit
    this.formData.consUnit2 = this.record.consUnit2
    this.getListDept()
    if (this.update) {
      this.formData = { ...this.record }
      console.log('formData', this.formData.code)
    }else{
      getChildProjectById({ projectId: this.record.id }).then(res => {
        this.formData.code = this.record.code + '-' + (res.data.length + 1)
      })
    }
    this.getDicts(dictConfig.PROJECT_TYPE).then(res => {
      this.projectTypeOptionList = res.data
    })
  },
  methods: {
    getListDept() {
      allTree().then(res => {
        this.belongDeptList = res.data
      })
    },
    handleSubmit() {
      if (this.update === true) {
        updateProject(this.formData).then(res => {
          this.$message.success(res.msg, 3)
          this.$emit('saveChildProjectSuccess')
          this.$emit('close')
        })
      } else {
        addChildProject(this.formData).then(res => {
          this.$message.success(res.msg, 3)
          this.$emit('saveChildProjectSuccess')
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
