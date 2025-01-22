<!-- 立项表单 -->
<template>
  <s-form ref="formTable" ok single :okText="'保存'" :queryDictKeys="dictKeys" :formItems="beforeFormItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel"> </s-form>
</template>

<script lang="jsx">
import dictConfig from '/src/views/eos/config/dict.config.js'
import { handleMerchantEdit } from '/src/views/eos/config/busUtil.js'
import { listMerchant } from '/src/api/eos/merchant/merchant.js'
import { submitProject } from '/src/api/eos/project/projectModify.js'
import { getProject, treePlanProject } from '/src/api/eos/project/project.js'

import { SForm } from '/src/components/index.js'
import { allTree } from '/src/api/system/dept.js'

export default {
  name: 'ProjectForm',
  components: {
    SForm
  },
  props: {},
  data() {
    return {
      projectTypeOptionList: [],
      dictKeys: [dictConfig.PROJECT_TYPE],
      merchantList: [],
      formData: {
        nickname: this.$store.getters.nickname,
        createBy: this.$store.getters.userName
      },
      projectList: [],
      beforeFormItems: [],
      formItems: [
        [
          {
            label: '变更项目',
            type: 'treeSelect',
            prop: 'changeProject',
            options: () => this.projectList,
            colspan: 4,
            valueAlias: 'id',
            labelAlias: 'label',
            compProps: {
              on: {
                select: value => {
                  let targetProject = null
                  //  = this.projectList.filter((item, index) => {
                  //   return item.id === value
                  // })
                  getProject(value).then(res => {
                    targetProject = res.data
                    this.beforeFormItems = this.formItems
                    this.formData = { ...this.formData, ...targetProject, changeProject: value }
                  })
                  // for (let i = 0; i < this.projectList.length; i++) {
                  //   if (this.projectList[i].id === value) {
                  //     targetProject = this.projectList[i]
                  //     break
                  //   }
                  //   if (this.projectList[i].children) {
                  //     for (let j = 0; j < this.projectList[i].children.length; j++) {
                  //       if (this.projectList[i].children[j].id === value) {
                  //         targetProject = this.projectList[i].children[j]
                  //         break
                  //       }
                  //     }
                  //   }
                  // }
                }
              }
            }
          },
          {}
        ],
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
          //   {
          //     type: 'select',
          //     prop: 'consUnit',
          //     label: '建设单位',
          //     options: () => this.merchantList,
          //     valueAlias: 'name',
          //     labelAlias: 'name',
          //     colspan: 4,
          //     allowClear: true,
          //     renderSuffix: text => {
          //       return (
          //         <a-button
          //           style="height:auto;border:none"
          //           type="link"
          //           onClick={() =>
          //             handleMerchantEdit(text, this.merchantList, () => {
          //               this.getMerchantList()
          //             })
          //           }
          //         >
          //           添加
          //         </a-button>
          //       )
          //     },
          //     compProps: {}
          //   }
          // ],
          // [
          //   {
          //     type: 'select',
          //     prop: 'consUnit2',
          //     label: '甲方',
          //     options: () => this.merchantList,
          //     valueAlias: 'name',
          //     labelAlias: 'name',
          //     colspan: 4,
          //     allowClear: true,
          //     renderSuffix: text => {
          //       return (
          //         <a-button
          //           style="height:auto;border:none"
          //           type="link"
          //           onClick={() =>
          //             handleMerchantEdit(text, this.merchantList, () => {
          //               this.getMerchantList()
          //             })
          //           }
          //         >
          //           添加
          //         </a-button>
          //       )
          //     },
          //     compProps: {}
          //   },
          {
            type: 'select',
            prop: 'status',
            label: '状态',
            colspan: 4,
            valueAlias: 'value',
            labelAlias: 'label',
            options: () => [
              { label: '在建', value: '在建' },
              { label: '关闭', value: '关闭' }
            ]
          }
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
            type: 'inputTextArea',
            prop: 'changeReason',
            label: '变更原因',
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
        type: { required: true, message: '请选择', trigger: 'change' },
        deptId: { required: true, message: '请选择', trigger: 'change' },
        // ownerUnit: { required: true, message: '请选择', trigger: 'change' },
        // consUnit: { required: true, message: '请选择', trigger: 'change' },
        // consUnit2: { required: true, message: '请选择', trigger: 'blur' },
        sketch: { required: true, message: '请输入', trigger: 'blur' },
        status: { required: true, message: '请选择', trigger: 'change' },
        changeReason: { required: true, message: '请输入', trigger: 'change' }
      }
    }
  },
  created() {
    treePlanProject({ state: '0' }).then(res => {
      this.projectList = res.data
    })
    this.getMerchantList()
    this.getListDept()
    this.beforeFormItems = this.formItems.slice(0, 1)
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
    handleSubmit() {
      submitProject(this.formData).then(res => {
        this.$message.success('保存成功')
        this.$emit('ok')
        this.$emit('close')
      })
    },
    handleCancel() {
      this.$emit('close')
    }
  }
}
</script>
