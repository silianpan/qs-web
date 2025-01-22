<!-- 开票管理表单 -->
<template>
  <s-form ref="formTable" ok single okText="保存草稿" hasApplyBtn @apply="handleApply" :queryDictKeys="dictKeys" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel">
  </s-form>
</template>

<script lang="jsx">
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { handleMerchantEdit } from '/src/views/eos/config/busUtil.js'
import { SForm } from '/src/components/index.js'
import { listMerchant, getMerchant } from '/src/api/eos/merchant/merchant.js'
import { addMake, updateMake, submitApply, makeContractSum } from '/src/api/eos/invoice/make.js'
import { listByProject, queryContract } from '/src/api/eos/contract/contract.js'
import { treeSelect } from '/src/api/eos/project/project.js' // 查项目
import MemSelect from '/src/views/eos/project/mem/modules/MemSelect.vue'

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
  name: 'Make',
  components: {
    SForm
  },
  data() {
    return {
      dictKeys: [dictConfig.PROJECT_UNIT],
      dictMap: {}, // 字典集合
      formData: {
        createBy: this.$store.getters.userName,
        nickname: this.$store.getters.nickname,
        code: 'KP' + moment().format('YYYYMM-DDHHmmss'),
        moneyUnit: '元'
      },
      merchantList: [], // 开票单位
      projectList: [], // 项目
      contractId: [], // 所属合同
      projectObj: {}, // 选中的项目,
      clientAddrList: [],
      clientBankList: [],
      formItems: [
        [
          {
            type: 'text',
            label: '申请单号',
            prop: 'code',
            colspan: 4
          },
          {
            type: 'text',
            label: '创建人',
            prop: 'nickname',
            colspan: 4
          }
        ],
        [
          {
            type: 'select',
            label: '开票单位',
            prop: 'makeUnit',
            colspan: 4,
            options: () => this.dictMap[dictConfig.PROJECT_UNIT],
            valueAlias: 'dictLabel',
            labelAlias: 'dictLabel'
          },
          {}
        ],
        [
          {
            type: 'datePicker',
            label: '开票时间',
            prop: 'makeTime',
            colspan: 4,
            compProps: {
              /*  props: {
                defaultValue: moment()
              } */
            }
          },
          {
            type: 'select',
            label: '金额单位',
            prop: 'moneyUnit',
            colspan: 4,
            options: () => {
              return [
                {
                  id: '元',
                  name: '元'
                },
                {
                  id: '万元',
                  name: '万元'
                }
              ]
            },
            valueAlias: 'id',
            labelAlias: 'name'
          }
        ],
        [
          {
            type: 'treeSelect',
            label: '项目名称',
            prop: 'projectName',
            colspan: 4,
            valueAlias: 'label',
            labelAlias: 'label',
            options: () => this.projectList,
            compProps: {
              // props: {
              //   disabled: !this.isEmpty(this.updateRow)
              // },
              on: {
                select: value => {
                  // 项目选择后清除运营类的合同信息
                  this.contractId = []
                  delete this.formData.contractCode
                  delete this.formData.contractMoney
                  delete this.formData.contractName
                  this.$set(this.formData, 'thisPercent', 0)
                  this.$set(this.formData, 'thisMoney', 0)
                  this.$set(this.formData, 'beforeMoney', 0)
                  // 项目选择
                  for (let i = 0; i < this.projectList.length; i++) {
                    if (this.projectList[i].label === value) {
                      this.projectObj = this.projectList[i]
                      break
                    }
                    if (this.projectList[i].children) {
                      for (let j = 0; j < this.projectList[i].children.length; j++) {
                        if (this.projectList[i].children[j].label === value) {
                          this.projectObj = this.projectList[i].children[j]
                          break
                        }
                      }
                    }
                  }

                  this.formData.projectCode = this.projectObj.code
                  /* 查询合同 */
                  listByProject({ projectId: this.projectObj.id, type: '收入合同' }).then(res => {
                    this.contractId = res.data
                  })
                }
              }
            }
          },
          {
            type: 'text',
            label: '项目编号',
            prop: 'projectCode',
            colspan: 4,
            compProps: {}
          }
        ],
        // [
        //   {
        //     type: 'text',
        //     label: '项目编号',
        //     prop: 'projectCode',
        //     colspan: 4,
        //     compProps: {}
        //   },
        //   {
        //     type: 'radio',
        //     label: '是否有合同',
        //     prop: 'hasContract',
        //     colspan: 4,
        //     valueAlias: 'id',
        //     labelAlias: 'name',
        //     options: res => [
        //       {
        //         id: '是',
        //         name: '是'
        //       },
        //       {
        //         id: '否',
        //         name: '否'
        //       }
        //     ]
        //   }
        // ],
        [
          {
            type: 'select',
            label: '合同名称',
            prop: 'contractName',
            colspan: 4,
            options: () => this.contractId,
            valueAlias: 'id',
            labelAlias: 'name',
            compProps: {
              on: {
                select: value => {
                  const data = this.contractId.filter(item => value === item.id)[0]
                  this.formData.contractCode = data.code
                  this.formData.contractMoney = data.sum
                  this.formData.contractName = data.name
                  // 查询合同下已开票金额
                  makeContractSum(data.code).then(res => {
                    const beforeMoney = res.data ? res.data : 0
                    this.$set(this.formData, 'beforeMoney', beforeMoney)
                  })
                  this.$set(this.formData, 'thisPercent', 0)
                  this.$set(this.formData, 'thisMoney', 0)
                }
              }
            }
          },
          {}
        ],
        [
          {
            type: 'text',
            label: '合同编号',
            prop: 'contractCode',
            colspan: 4,
            compProps: {
              props: {
                disabled: true
              }
            }
          },
          {
            type: 'text',
            label: '合同金额',
            prop: 'contractMoney',
            colspan: 4,
            compProps: {
              props: {
                disabled: true
              }
            }
          }
        ],
        [
          {
            type: 'inputNumber',
            label: '已开票金额',
            prop: 'beforeMoney',
            colspan: 4,
            compProps: {
              props: {
                min: 0,
                precision: 2
              },
              on: {}
            }
          },
          {
            type: 'inputNumber',
            label: '本次开票比例(%)',
            prop: 'thisPercent',
            colspan: 4,
            compProps: {
              props: {
                min: 0,
                precision: 2
              },
              on: {
                blur: e => {
                  if (this.formData.contractCode) {
                    const thisMoney = (e.target._value * this.formData.contractMoney) / 100
                    this.$set(this.formData, 'thisMoney', thisMoney)
                  }
                }
              }
            }
          }
        ],
        [
          {
            type: 'radio',
            label: '发票类型',
            prop: 'type',
            colspan: 4,
            valueAlias: 'id',
            labelAlias: 'name',
            options: res => [
              {
                id: '增值税专票',
                name: '增值税专票'
              },
              {
                id: '增值税普票',
                name: '增值税普票'
              }
            ]
          },
          {
            type: 'inputNumber',
            label: '本次开票金额',
            prop: 'thisMoney',
            colspan: 4,
            compProps: {
              props: {
                min: 0,
                precision: 2
              },
              on: {
                blur: e => {
                  if (this.formData.contractName) {
                    const percent = (e.target._value / this.formData.contractMoney) * 100
                    this.$set(this.formData, 'thisPercent', percent)
                  }
                }
              }
            }
          }
        ],
        [
          {
            type: 'input',
            label: '税率(%)',
            prop: 'taxRate',
            colspan: 4
            // compProps: {
            //   props: {
            //     min: 0
            //   },
            //   on: {}
            // }
          },
          {
            type: 'datePicker',
            label: '预计回款日期',
            prop: 'returnDate',
            colspan: 4
          }
        ],
        [
          {
            type: 'select',
            label: '客户单位名称',
            prop: 'clientId',
            colspan: 4,
            options: () => this.merchantList,
            valueAlias: 'id',
            labelAlias: 'name',
            compProps: {
              on: {
                select: value => {
                  this.formData.clientTaxno = null
                  this.clientAddrList = []
                  this.clientBankList = []
                  this.formData.clientAddr = null
                  this.formData.clientBank = null
                  getMerchant(value).then(res => {
                    this.formData.clientTaxno = res.data.taxNumber
                    this.formData.clientUnit = res.data.name
                    this.clientAddrList = res.data.sealMerchantUsers.map((item, index) => {
                      const id = res.data.address + ' ' + item.link
                      const name = res.data.address + ' ' + item.link
                      return {
                        ...item,
                        id,
                        name
                      }
                    })
                    if (res.data.sealMerchantUsers.length === 1) {
                      this.$set(this.formData, 'clientAddr', this.clientAddrList[0].id)
                    }
                    this.clientBankList = res.data.sealMerchantAccounts.map((item, index) => {
                      const tmpAccount = item.account
                      const account = item.bank + ' ' + tmpAccount
                      const accountName = account
                      return {
                        ...item,
                        account,
                        accountName
                      }
                    })
                    if (res.data.sealMerchantAccounts.length === 1) {
                      this.$set(this.formData, 'clientBank', this.clientBankList[0].account)
                    }
                  })
                }
              }
            },
            renderSuffix: text => {
              return (
                <a-button
                  style="height:auto;border:none"
                  type="link"
                  onClick={() =>
                    handleMerchantEdit(this.formData.clientUnit, this.merchantList, () => {
                      this.getMerchantList()
                    })
                  }
                >
                  添加
                </a-button>
              )
            }
          },
          {
            type: 'input',
            label: '客户纳税人识别号',
            prop: 'clientTaxno',
            colspan: 8
          }
        ],
        [
          {
            type: 'select',
            label: '客户地址电话',
            prop: 'clientAddr',
            valueAlias: 'id',
            labelAlias: 'name',
            colspan: 12,
            compProps: {
              props: {
                allowClear: true
              }
              // on: {
              //   deselect: value => {
              //     console.log('value', value)
              //   }
              // }
            },
            options: () => this.clientAddrList
          },
          {
            type: 'select',
            label: '客户开户行及账号',
            prop: 'clientBank',
            valueAlias: 'account',
            labelAlias: 'accountName',
            colspan: 12,
            options: () => this.clientBankList
          }
        ],
        [
          {
            type: 'upload',
            label: '附件',
            prop: 'attachment',
            colspan: 12,
            customDefaultFileList: () => this.updateRow && this.updateRow.attachment,
            handleChange: ret => {
              this.formData.attachment = JSON.stringify(ret)
            },
            compProps: {
              props: {
                multiple: true
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
            type: 'inputTextArea',
            label: '备注',
            prop: 'remark',
            colspan: 12,
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
        makeUnit: { required: true, message: '请输入', trigger: 'change' },
        moneyUnit: { required: true, message: '请输入', trigger: 'change' },
        // projectName: { required: true, message: '请输入', trigger: 'blur' },
        // projectCode: { required: true, message: '请输入', trigger: 'blur' },
        // isContract: { required: true, message: '请输入', trigger: 'change' },
        beforeMoney: { required: true, message: '请输入', trigger: 'blur' },
        thisPercent: { required: true, message: '请输入', trigger: 'blur' },
        thisMoney: { required: true, message: '请输入', trigger: 'blur' },
        type: { required: true, message: '请选择', trigger: 'change' },
        makeTime: { required: true, message: '请选择', trigger: 'change' },
        taxRate: { required: true, message: '请输入', trigger: 'blur' },
        returnDate: { required: true, message: '请输入', trigger: 'change' },
        clientId: { required: true, message: '请输入', trigger: 'change' },
        clientTaxno: { required: true, message: '请输入', trigger: 'blur' }
        // clientAddr: { required: true, message: '请输入', trigger: 'blur' },
        // clientBank: { required: true, message: '请输入', trigger: 'blur' }
      }
    }
  },
  methods: {
    // 提交
    async handleSubmit(callbackFunc) {
      const data = { ...this.formData }
      if (data.makeTime) {
        data.makeTime = data.makeTime.format('YYYY-MM-DD HH:mm:ss')
      }
      data.returnDate = data.returnDate.format('YYYY-MM-DD HH:mm:ss')
      data.hasContract = data.contractName ? '是' : '否'
      const sealInvoiceMake = data
      let res = null
      try {
        if (this.isUpdate && !this.isEmpty(this.updateRow)) {
          res = await updateMake(sealInvoiceMake)
        } else {
          res = await addMake(sealInvoiceMake)
        }
        if (callbackFunc instanceof Function) {
          callbackFunc(res)
        } else {
          this.$message.success(res.msg)
          this.$emit('ok')
          this.$emit('close')
        }
      } catch {
        this.$refs.formTable.loading = false
        this.$refs.formTable.saveBtnLoading = false
      }
    },
    // 直接提交
    handleApply() {
      try {
        this.handleSubmit(async res => {
          // 直接提交流程
          await submitApply({
            tenantAppId: this.$store.getters.tenantAppId,
            menuId: this.$route.meta.moduleId,
            dataId: res.data
          })
          this.$message.success(res.msg, 3)
          this.$emit('ok')
          this.$emit('close')
        })
      } catch {
        this.$refs.formTable.loading = false
        this.$refs.formTable.saveBtnLoading = false
      }
    },
    handleCancel() {
      this.$emit('off')
      this.$emit('close')
    },
    getMerchantList(callBackFunc) {
      listMerchant().then(res => {
        this.merchantList = res.rows
        // 更新
        if (this.formData.clientId) {
          getMerchant(this.formData.clientId).then(res => {
            this.formData.clientTaxno = res.data.taxNumber
            this.formData.clientUnit = res.data.name
            this.clientAddrList = res.data.sealMerchantUsers.map((item, index) => {
              const id = res.data.address + ' ' + item.link
              const name = res.data.address + ' ' + item.link
              return {
                ...item,
                id,
                name
              }
            })
            if (res.data.sealMerchantUsers.length === 1) {
              this.$set(this.formData, 'clientAddr', this.clientAddrList[0].id)
            }
            this.clientBankList = res.data.sealMerchantAccounts.map((item, index) => {
              const tmpAccount = item.account
              const account = item.bank + ' ' + tmpAccount
              const accountName = account
              return {
                ...item,
                account,
                accountName
              }
            })
            if (res.data.sealMerchantAccounts.length === 1) {
              this.$set(this.formData, 'clientBank', this.clientBankList[0].account)
            }
          })
        }
        if (callBackFunc instanceof Function) {
          callBackFunc()
        }
      })
    }
  },
  created() {
    // 查询字典
    this.dictKeys.forEach(key => {
      this.getDicts(key).then(res => {
        this.$set(this.dictMap, key, res.data)
      })
    })
    // 查询运营类项目
    queryContract({ contractProp: '公司运营' }).then(res => {
      this.contractId = res.data
    })
    /* 查询项目 */
    treeSelect({ state: '0' }).then(res => {
      this.projectList = res.data
    })
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      const data = { ...this.updateRow }
      data.makeTime = data.makeTime && moment(data.makeTime)
      data.returnDate = data.returnDate && moment(data.returnDate)
      data.clientUnit = parseInt(data.clientUnit)
      this.formData = data
    }
    // 客户单位
    this.getMerchantList()
  }
}
</script>
