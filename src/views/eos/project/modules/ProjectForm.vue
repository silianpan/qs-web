<!-- 立项表单 -->
<template>
  <s-form ref="formTable" hasApplyBtn @apply="handleApply" single ok okText="保存草稿" :queryDictKeys="dictKeys" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel">
  </s-form>
</template>

<script lang="jsx">
import moment from 'moment'
import defaultSettings from '/src/config/defaultSettings.js'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { handleMerchantEdit } from '/src/views/eos/config/busUtil.js'
import { listMerchant } from '/src/api/eos/merchant/merchant.js'
import { addProject, updateProject, submitApply } from '/src/api/eos/project/project.js'
import { allTree } from '/src/api/system/dept.js'
import { getModuleByPath } from '/src/api/enterprise/index.js'

import SForm from '/src/components/Form/index.jsx'
import { getByUsername } from '../../../../api/system/user'

export default {
  name: 'ProjectForm',
  components: {
    SForm
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
      dictKeys: [dictConfig.PROJECT_TYPE],
      // 项目类型字典
      projectTypeOptionList: [],
      // 所属部门
      belongDeptList: [],
      // 个人商机列表
      personalBusinessList: [],
      merchantList: [],
      coverFileList: [],
      formData: {
        createBy: this.$store.getters.userName,
        nickName: this.$store.getters.nickname,
        code: defaultSettings.codePrefix + moment().format('YYYYMM-DDHHmmss'),
        status: '在建'
      },
      // 立项表单
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
            prop: 'nickName',
            label: '立项人',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            prop: 'name',
            label: '项目名称',
            colspan: 4
          },
          {}
        ],
        [
          {
            type: 'treeSelect',
            prop: 'deptId',
            label: '所属部门',
            colspan: 4,
            valueAlias: 'id',
            labelAlias: 'label',
            options: () => this.belongDeptList
          },
          {
            type: 'select',
            prop: 'type',
            label: '项目类型',
            colspan: 4,
            options: () => this.projectTypeOptionList
          }
        ],
        [
          {
            type: 'select',
            prop: 'ownerUnit',
            label: '甲方',
            options: () => this.merchantList,
            valueAlias: 'name',
            labelAlias: 'name',
            colspan: 4,
            allowClear: true,
            renderSuffix: text => {
              return (
                <a-button
                  style="height:auto;border:none"
                  type="link"
                  onClick={() =>
                    handleMerchantEdit(text, this.merchantList, () => {
                      this.getMerchantList()
                    })
                  }
                >
                  添加
                </a-button>
              )
            }
          },
          {}
        ],
        [
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
            }
          },
          {}
        ]
      ],
      formRules: {
        name: { required: true, message: '请输入', trigger: 'blur' },
        type: { required: true, message: '请选择', trigger: 'change' },
        deptId: { required: true, message: '请选择', trigger: 'change' },
        // ownerUnit: { required: true, message: '请选择', trigger: 'change' },
        // consUnit: { required: true, message: '请选择', trigger: 'change' },
        // consUnit2: { required: true, message: '请选择', trigger: 'blur' },
        sketch: { required: true, message: '请输入', trigger: 'blur' },
        status: { required: true, message: '请选择', trigger: 'change' }
      }
    }
  },
  created() {
    getByUsername({ userName: this.$store.getters.userName }).then(res => {
      this.$set(this.formData, 'deptId', res.data.dept.deptId)
    })
    // 获取moduleId，用于提交流程
    getModuleByPath({ component: 'eos/project/index' }).then(res => {
      this.moduleId = res.data.tenantModuleId
    })
    if (!this.isUpdate) {
      if (!this.isEmpty(this.updateRow)) {
        this.formData = { ...this.updateRow, createBy: this.$store.getters.userName, nickName: this.$store.getters.nickname, code: defaultSettings.codePrefix + moment().format('YYYYMM-DDHHmmss'), status: '在建' }
      }
    } else {
      this.formData = this.updateRow
      this.formData.nickName = this.$store.getters.nickname
    }
    // 查询客商
    this.getMerchantList()
    // 查询所属部门列表
    this.getListDept()
    // 获取项目类型字典
    this.getDicts(dictConfig.PROJECT_TYPE).then(res => {
      this.projectTypeOptionList = res.data
    })
  },
  methods: {
    getMerchantList() {
      listMerchant().then(res => {
        this.merchantList = res.rows
      })
    },
    getListDept() {
      allTree().then(res => {
        this.belongDeptList = res.data
      })
    },
    // 保存
    async handleSubmit(callbackFunc) {
      const fd = { ...this.formData }
      // 更新或添加
      let res = null
      if (this.isUpdate && !this.isEmpty(fd.id)) {
        res = await updateProject(fd)
      } else {
        res = await addProject(fd)
      }
      if (callbackFunc instanceof Function) {
        // 点击直接提交
        callbackFunc(res)
      } else {
        // 点击保存
        this.$message.success(res.msg, 3)
        this.$emit('ok')
        this.$emit('close')
      }
    },
    handleCancel() {
      this.$emit('close')
    },
    // 直接提交
    async handleApply() {
      await this.handleSubmit(async res => {
        // 直接提交流程
        await submitApply({
          tenantAppId: this.$store.getters.tenantAppId,
          menuId: this.moduleId,
          dataId: res.data
        })
        this.$message.success(res.msg, 3)
        this.$emit('ok')
        this.$emit('close')
      })
    }
  }
}
</script>
