<!-- 退款管理表单 -->
<template>
  <div>
    <s-form ok single :okText="'保存'" :queryDictKeys="dictKeys" :formTitle="'退款'" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel"> </s-form>
    <s-form v-if="isReturning" single :formTitle="'退换'" :formItems="formItems2" :formData="formData2" :rules="formRules2"> </s-form>
  </div>
</template>

<script>
// import dictConfig from '/src/views/eos/config/dict.config.js'
import { SForm } from '/src/components/index.js'
import moment from 'moment'
import { treePlanProject } from '/src/api/eos/project/project.js'
import { getContractList, saveRefund } from '/src/api/eos/purchase/refund.js'
import paymentSelect from './paymentSelect.vue'

export default {
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
  name: 'Loan',
  components: {
    SForm
  },
  data() {
    return {
      dictKeys: [],
      // 项目
      projectList: [],
      /* 合同 */
      contractList: [],
      /* 是否退换 */
      isReturning: false,
      /* 退款 */
      formData: {
        createBy: this.$store.getters.userName,
        nickname: this.$store.getters.nickname,
        code: 'TKGL' + moment().format('YYYYMM-DDHHmmss'),
        refundType: '退款'
      },
      formItems: [
        [
          {
            type: 'text',
            label: '申请编号',
            prop: 'code',
            colspan: 4
          },
          {
            type: 'text',
            label: '申请人',
            prop: 'nickname',
            colspan: 4
          }
        ],
        [
          {
            type: 'radio',
            prop: 'refundType',
            label: '退款类型',
            colspan: 8,
            options: res => [
              {
                dictValue: '退款',
                dictLabel: '退款'
              },
              {
                dictValue: '退换',
                dictLabel: '退换'
              }
            ],
            compProps: {
              props: {
                defaultValue: '退款'
              },
              on: {
                change: e => {
                  if (e.target.value === '退换') {
                    this.isReturning = true
                  } else {
                    this.isReturning = false
                  }
                }
              }
            },
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
            type: 'treeSelect',
            label: '项目名称',
            prop: 'projectId',
            keyAlias: 'id',
            titleAlias: 'label',
            valueAlias: 'id',
            options: () => this.projectList,
            compProps: {
              props: {
                allowClear: false
              },
              on: {
                select: value => {
                  /* 根据项目ID查合同 */
                  getContractList({ projectId: value }).then(res => {
                    this.contractList = res.data
                  })
                }
              }
            }
          },
          {
            type: 'select',
            prop: 'contractCode',
            label: '合同名称',
            colspan: 4,
            valueAlias: 'code',
            labelAlias: 'name',
            options: () => this.contractList
          }
        ],
        [
          {
            type: 'input',
            prop: 'payCode',
            label: '关联该项目付款',
            colspan: 4,
            compProps: {
              on: {
                focus: e => {
                  this.handleAssociated(this.formData.projectId)
                }
              }
            }
          },
          {
            type: 'input',
            prop: 'payMoney',
            label: '退款金额(元)',
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
        ]
      ],
      formRules: {
        // // projectId: { required: true, message: '请输入', trigger: 'change' },
      },
      /* 退换 */
      formItems2: [
        [
          {
            type: 'select',
            prop: 'toProjectId',
            label: '项目名称',
            colspan: 4,
            valueAlias: 'id',
            labelAlias: 'name',
            options: () => this.projectList,
            compProps: {
              on: {
                select: value => {
                  /* 根据项目ID查合同 */
                  getContractList({ projectId: value }).then(res => {
                    this.contractList = res.data
                  })
                }
              }
            }
          },
          {
            type: 'select',
            prop: 'toContractId',
            label: '合同名称',
            colspan: 4,
            valueAlias: 'id',
            labelAlias: 'name',
            options: () => this.contractList
          }
        ],
        [
          {
            type: 'inputTextArea',
            label: '备注',
            prop: 'toRemark',
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
      formData2: {},
      formRules2: {
        // // projectId: { required: true, message: '请输入', trigger: 'change' },
      },
      RefundVo: {}
    }
  },
  methods: {
    // 保存
    handleSubmit() {
      if (this.formData.refundType === '退款') {
        this.RefundVo = { ...this.formData }
      } else {
        this.RefundVo = { ...this.formData, ...this.formData2 }
      }
      /* 新增 */
      saveRefund(this.RefundVo).then(res => {
        this.$message.success('保存成功')
        this.$emit('ok')
        this.$emit('close')
      })
    },
    handleCancel() {
      this.$emit('ok')
      this.$emit('close')
    },
    handleAssociated(projectId) {
      if (this.isEmpty(projectId)) return this.$message.error('请先选择合同!')
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '付款申请列表',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: paymentSelect,
          props: {
            selectType: 'radio',
            projectId: projectId
          },
          on: {
            ok: (Rows, Keys) => {
              this.$set(this.formData, 'payCode', Rows[0].code)
              this.$set(this.formData, 'payId', Keys[0])
            }
          }
        }
      })
    }
  },
  created() {
    /* 查询所有项目 */
    treePlanProject({ state: '0' }).then(res => {
      this.projectList = res.data
    })
  }
}
</script>
