<!-- 实际收款表单 -->
<template>
  <s-form ok single :queryDictKeys="dictKeys" :formItems="formItems_" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel" />
</template>

<script>
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { addReal, updateReal, bankList } from '/src/api/eos/invoice/real.js'
// import { listMerchant } from '/src/api/eos/merchant/merchant.js'
import { treeSelect } from '/src/api/eos/project/project.js'
import { listByProject, queryContract, getContract } from '/src/api/eos/contract/contract.js'
import { SForm } from '/src/components/index.js'
import { digitUppercase } from '/src/utils/common/util.js'
import selectMake from './selectMake.vue' // 选择发票信息

export default {
  name: 'PaymentRealForm',
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
      dictKeys: [dictConfig.PROJECT_UNIT],
      merchantList: [],
      projectList: [],
      contractList: [],
      bankAndAccountList: [],
      formData: {
        createBy: this.$store.getters.userName
      },
      formItems_: [],
      formItems1: [
        [
          {
            type: 'treeSelect',
            label: '项目名称',
            prop: 'projectId',
            colspan: 4,
            keyAlias: 'id',
            titleAlias: 'label',
            valueAlias: 'id',
            options: () => this.projectList,
            compProps: {
              on: {
                select: (value, item) => {
                  // 清空运营合同信息
                  this.contractList = []
                  // 解决子节点未选中问题
                  const project = item.dataRef 
                  // const project = this.projectList.filter(item => item.id === value)[0]
                  // console.log('project', project)
                  this.formData.projectCode = project.code
                  this.formData.projectName = project.name
                  // 清空数据
                  this.formData.contractId = null
                  this.formData.contractCode = null
                  this.formData.contractName = null
                  this.formData.contractSum = null
                  this.formData.payeeId = null
                  this.formData.payeeName = null
                  this.formData.company = null
                  delete this.formData.accountId

                  // 查询合同
                  listByProject({ projectId: value, type: '收入合同' }).then(res => {
                    this.contractList = [...res.data]
                  })
                }
              }
            }
          },
          {
            type: 'text',
            label: '项目编号',
            prop: 'projectCode',
            colspan: 4
          }
        ],
        [
          {
            type: 'select',
            label: '合同',
            prop: 'contractId',
            valueAlias: 'id',
            labelAlias: 'name',
            colspan: 4,
            options: () => this.contractList,
            compProps: {
              on: {
                select: value => {
                  this.formItems_ = [...this.formItems1, ...this.formItems2, ...this.formItems3]
                  const contract = this.contractList.filter(item => item.id === value)[0]
                  this.formData.contractCode = contract.code
                  this.formData.contractName = contract.name
                  this.formData.contractSum = contract.sum
                  this.formData.payeeName = contract.firstParty
                  this.formData.company = contract.secondParty
                  if (!this.isEmpty(contract.sealMerchant)) {
                    this.formData.payeeId = contract.sealMerchant.id
                    bankList({ merchantName: contract.firstParty }).then(res => {
                      this.bankAndAccountList = res.data
                    })
                  }
                }
              }
            }
          },
          {}
        ]
      ],
      formItems2: [
        [
          {
            type: 'text',
            label: '合同编号',
            prop: 'contractCode',
            colspan: 4
          },
          {
            type: 'text',
            label: '合同总金额(元)',
            prop: 'contractSum',
            colspan: 4
          }
        ],
        [
          {
            type: 'text',
            label: '收款单位',
            prop: 'company',
            colspan: 8
          },
          {}
        ],
        [
          {
            type: 'text',
            prop: 'payeeName',
            label: '付款单位',
            colspan: 4
          },
          {
            type: 'select',
            label: '开户账号',
            prop: 'accountId',
            colspan: 4,
            labelAlias: 'accountName',
            valueAlias: 'id',
            options: () => this.bankAndAccountList
          }
        ]
      ],
      formItems3: [
        [
          {
            type: 'datePicker',
            label: '收款日期',
            prop: 'payTime',
            colspan: 8
          },
          {}
        ],
        [
          {
            type: 'inputNumber',
            label: '实际收款金额',
            prop: 'payMoney',
            colspan: 4,
            compProps: {
              props: {
                min: 0,
                precision: 2
              },
              on: {
                blur: e => {
                  this.$set(this.formData, 'payMoneyUpper', digitUppercase(e.target.value))
                }
              }
            }
          },
          {
            type: 'text',
            label: '收款金额大写',
            prop: 'payMoneyUpper',
            colspan: 4
          }
        ],
        [
          {
            type: 'input',
            label: '关联开票信息',
            prop: 'makeCode',
            colspan: 8,
            compProps: {
              on: {
                focus: e => {
                  this.handleAssociated()
                }
              }
            }
          },
          {}
        ],
        [
          {
            type: 'inputTextArea',
            label: '备注',
            prop: 'remark',
            colspan: 8
          },
          {}
        ]
      ],
      formRules: {
        // projectId: { required: true, message: '请选择', trigger: 'change' },
        // projectCode: { required: true, message: '请输入', trigger: 'blur' },
        // projectName: { required: true, message: '请输入', trigger: 'blur' },
        // company: { required: true, message: '请选择', trigger: 'change' },
        // accountId: { required: true, message: '请选择', trigger: 'change' },
        payTime: { required: true, message: '请输入', trigger: 'change' },
        payMoney: { required: true, message: '请输入', trigger: 'blur' }
        // payMoneyUpper: { required: true, message: '请输入', trigger: 'blur' }
        // makeCode: { required: true, message: '请输入', trigger: 'change' }
      }
    }
  },
  created() {
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formItems_ = [...this.formItems1, ...this.formItems2, ...this.formItems3]
    } else {
      this.formItems_ = [...this.formItems1]
    }
    if (!this.isUpdate) {
      // 查询运营类项目
      queryContract({ contractProp: '公司运营' }).then(res => {
        this.contractList = res.data
      })
    }

    // 首先获取项目的额树形数据
    treeSelect({ state: '0' }).then(res => {
      this.projectList = res.data
    })
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formData = {
        ...this.updateRow,
        payTime: this.updateRow.payTime ? moment(this.updateRow.payTime) : null
      }
      this.formData.nickname = this.updateRow.sysUser ? this.updateRow.sysUser.nickName : this.$store.getters.nickname

      bankList({ merchantName: this.updateRow.sealMerchant.name }).then(res => {
        this.bankAndAccountList = res.data
      })
      if (!this.isEmpty(this.updateRow.sealMerchantAccount)) {
        this.formData.payeeName = this.updateRow.sealMerchant.name
        this.formData.payeeId = this.updateRow.sealMerchant.id
        this.formData.accountId = this.updateRow.sealMerchantAccount.id
        this.formData.accountName = this.updateRow.sealMerchantAccount.account
      }
      // 查询合同
      if (this.updateRow.projectId) {
        listByProject({ projectId: this.updateRow.projectId, type: '收入合同' }).then(res => {
          this.contractList = [...res.data]
          if (this.updateRow.contractId) {
            this.noContract(this.updateRow.contractId)
          }
        })
      } else {
        // 查询运营类项目
        queryContract({ contractProp: '公司运营' }).then(res => {
          this.contractList = res.data
        })
      }
    }
  },
  methods: {
    handleSubmit() {
      const fd = { ...this.formData }
      fd.payTime && (fd.payTime = fd.payTime.format('YYYY-MM-DD'))
      // 更新或添加
      if (this.isUpdate && !this.isEmpty(fd.id)) {
        updateReal(fd).then(res => {
          this.$message.success(res.msg)
          this.$emit('ok')
          this.$emit('close')
        })
      } else {
        addReal(fd).then(res => {
          this.$message.success(res.msg)
          this.$emit('ok')
          this.$emit('close')
        })
      }
    },
    handleCancel() {
      this.$emit('close')
    },
    // 合同变更回显
    noContract(contractId) {
      if (contractId) {
        const contract = this.contractList.filter(item => item.id === contractId)[0]
        // 合同变更不在此项目下回显
        if (!contract) {
          getContract(contractId).then(res => {
            this.contractList.push(res.data)
          })
        }
      }
    },
    /* 关联发票信息 */
    handleAssociated() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '开票信息',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: selectMake,
          props: {
            selectType: 'radio',
            projectName: this.formData.projectName
          },
          on: {
            ok: (Rows, Keys) => {
              this.$set(this.formData, 'makeCode', Rows[0].code)
            },
            cancel: () => {}
          }
        }
      })
    }
  }
}
</script>
