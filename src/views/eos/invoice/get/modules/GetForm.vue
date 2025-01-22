<!-- 票据登记表单 -->
<template>
  <s-form ok single :okText="'保存'" :queryDictKeys="dictKeys" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel"> </s-form>
</template>

<script lang="jsx">
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { SForm } from '/src/components/index.js'
import { listMerchant } from '/src/api/eos/merchant/merchant.js' // 开票单位
import { treeSelect } from '/src/api/eos/project/project.js' // 查项目
import { listByProject, queryContract } from '/src/api/eos/contract/contract.js' // 查合同
import { handleMerchantEdit } from '/src/views/eos/config/busUtil.js'
import { addGet, updateGet } from '/src/api/eos/invoice/get.js'

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
  name: 'Get',
  components: {
    SForm
  },
  data() {
    return {
      dictKeys: [dictConfig.PROJECT_UNIT],
      // 表单数据
      formData: {
        createBy: this.$store.getters.userName,
        nickname: this.$store.getters.nickname,
        code: 'SPDJ' + moment().format('YYYYMM-DDHHmmss'),
        getType: '收票'
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
            type: 'select',
            label: '票据类型',
            prop: 'getType',
            options: [
              { dictLabel: '收票', dictValue: '收票' },
              { dictLabel: '开票', dictValue: '开票' }
            ],
            compProps: {
              on: {
                select: value => {
                  if (value === '开票') {
                    this.formItems.push([
                      {
                        type: 'input',
                        label: '收入类型',
                        prop: 'inType',
                        colspan: 4
                      },
                      {}
                    ])
                  } else {
                    /* splice删除原数组最后一个 */
                    const mItems = this.formItems
                    mItems.splice(mItems.length - 1, 1)
                  }
                }
              }
            }
          },
          {}
        ],
        [
          {
            type: 'datePicker',
            label: '收票/开票时间',
            prop: 'getTime',
            colspan: 4
          },
          {
            type: 'datePicker',
            label: '开具时间',
            prop: 'makeTime',
            colspan: 4
          }
        ],
        [
          {
            type: 'treeSelect',
            label: '项目名称',
            prop: 'projectId',
            options: () => this.projectList,
            colspan: 4,
            valueAlias: 'id',
            labelAlias: 'label',
            compProps: {
              on: {
                select: value => {
                  // 项目选择后清除运营类的合同信息 需要从新调用接口从新赋值
                  this.contractId = []
                  delete this.formData.contractId
                  delete this.formData.contractName
                  delete this.formData.contractCode
                  delete this.formData.contractMoney
                  delete this.formData.firstParty
                  delete this.formData.secondParty
                  // 项目选择

                  for (let i = 0; i < this.projectList.length; i++) {
                    if (this.projectList[i].id === value) {
                      this.projectObj = this.projectList[i]
                      break
                    }
                    if (this.projectList[i].children) {
                      for (let j = 0; j < this.projectList[i].children.length; j++) {
                        if (this.projectList[i].children[j].id === value) {
                          this.projectObj = this.projectList[i].children[j]
                          break
                        }
                      }
                    }
                  }

                  // this.projectObj = this.projectList.filter(item => value === item.id)[0]
                  this.formData.projectCode = this.projectObj.code
                  this.formData.projectName = this.projectObj.label
                  delete this.formData.contractId
                  delete this.formData.firstParty
                  delete this.formData.secondParty
                  /* 查询合同 */
                  // 重置查询条件
                  this.queryParamsContract = {}
                  this.listContracts({ projectId: value, type: this.formData.getType === '收票' ? '支出合同' : '收入合同' })
                }
              }
            }
          },
          {
            type: 'select',
            label: '合同名称',
            prop: 'contractId',
            colspan: 4,
            options: () => this.contractId,
            valueAlias: 'id',
            labelAlias: 'name',
            compProps: {
              on: {
                select: value => {
                  const data = this.contractId.filter(item => value === item.id)[0]

                  this.formData.contractName = data.name
                  this.formData.contractCode = data.code
                  this.formData.contractMoney = data.sum
                  this.formData.firstParty = data.firstParty
                  this.formData.secondParty = data.secondParty
                }
              }
            }
          }
        ],
        [
          {
            type: 'select',
            label: '甲方',
            prop: 'firstParty',
            colspan: 4,
            options: () => this.merchantList,
            valueAlias: 'name',
            labelAlias: 'name',
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
            },
            compProps: {
              props: {
                allowClear: true
              },
              on: {
                select: value => {
                  delete this.formData.firstParty
                  this.$set(this.formData, 'firstParty', value)
                  // 查询甲方的合同
                  if (!this.isEmpty(value) && !this.isEmpty(this.formData.projectId)) {
                    delete this.formData.contractId
                    this.listContracts({ firstParty: value })
                  }
                }
              }
            }
          },
          {
            type: 'select',
            label: '乙方',
            prop: 'secondParty',
            colspan: 4,
            options: () => this.merchantList,
            valueAlias: 'name',
            labelAlias: 'name',
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
            },
            compProps: {
              props: {
                allowClear: true
              },
              on: {
                select: value => {
                  delete this.formData.secondParty
                  this.$set(this.formData, 'secondParty', value)
                  // 查询乙方的合同
                  if (!this.isEmpty(value) && !this.isEmpty(this.formData.projectId)) {
                    delete this.formData.contractId
                    this.listContracts({ secondParty: value })
                  }
                }
              }
            }
          }
        ],
        [
          {
            type: 'text',
            label: '合同金额',
            prop: 'contractMoney'
          },
          {}
        ],
        [
          {
            type: 'input',
            label: '票号',
            prop: 'invoiceNum'
          },
          {
            type: 'input',
            label: '联次',
            prop: 'lianTimes'
          }
        ],
        [
          {
            type: 'radio',
            label: '发票类型',
            prop: 'type',
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
            label: '金额',
            prop: 'money',
            compProps: {
              props: {
                min: 0,
                precision: 2
              },
              on: {
                blur: e => {
                  if (!this.isEmpty(e.target.value) && !this.isEmpty(this.formData.taxRate)) {
                    // 计算税额
                    const taxRet = (parseFloat(e.target.value) * 0.01 * parseFloat(this.formData.taxRate)).toFixed(2)
                    this.$set(this.formData, 'taxAmount', taxRet)
                    this.$set(this.formData, 'moneyAndTax', (parseFloat(e.target.value) + parseFloat(taxRet)).toFixed(2))
                  }
                }
              }
            }
          }
        ],
        [
          {
            type: 'inputNumber',
            label: '税率(%)',
            prop: 'taxRate',
            compProps: {
              props: {
                min: 0,
                precision: 2
              },
              on: {
                blur: e => {
                  if (!this.isEmpty(e.target.value) && !this.isEmpty(this.formData.money)) {
                    // 计算税额
                    const taxRet = (parseFloat(e.target.value) * 0.01 * parseFloat(this.formData.money)).toFixed(2)
                    this.$set(this.formData, 'taxAmount', taxRet)
                    this.$set(this.formData, 'moneyAndTax', (parseFloat(this.formData.money) + parseFloat(taxRet)).toFixed(2))
                  }
                }
              }
            }
          },
          {
            type: 'inputNumber',
            label: '税额',
            prop: 'taxAmount',
            compProps: {
              props: {
                min: 0,
                precision: 2
              }
            }
          }
        ],
        [
          {
            type: 'inputNumber',
            label: '税价合计',
            prop: 'moneyAndTax',
            compProps: {
              props: {
                min: 0,
                precision: 2
              }
            }
          },
          {
            type: 'inputTextArea',
            label: '备注',
            prop: 'remark'
          }
        ]
      ],
      formRules: {
        getTime: { required: true, message: '请输入', trigger: 'change' },
        makeTime: { required: true, message: '请输入', trigger: 'change' },
        projectName: { required: true, message: '请输入', trigger: 'change' },
        contractName: { required: true, message: '请输入', trigger: 'change' },
        firstParty: { required: true, message: '请输入', trigger: 'change' },
        secondParty: { required: true, message: '请输入', trigger: 'change' },
        type: { required: true, message: '请输入', trigger: 'change' },
        money: { required: true, message: '请输入', trigger: 'blur' },
        taxRate: { required: true, message: '请输入', trigger: 'blur' },
        taxAmount: { required: true, message: '请输入', trigger: 'blur' },
        moneyAndTax: { required: true, message: '请输入', trigger: 'blur' }
      },
      merchantList: [], // 开票单位
      projectList: [], // 项目
      contractId: [] // 所属合同
    }
  },
  methods: {
    listContracts(params) {
      /* 查询合同 */
      this.queryParamsContract = { ...this.queryParamsContract, ...params }
      listByProject(this.queryParamsContract).then(res => {
        this.contractList = res.data
        // 从新给选择项目赋值
        this.contractId = res.data
      })
    },
    handleSubmit() {
      const data = { ...this.formData }
      data.getTime = data.getTime.format('YYYY-MM-DD HH:mm:ss')
      data.makeTime = data.makeTime.format('YYYY-MM-DD HH:mm:ss')
      /* 新增 */
      if (!this.isUpdate && this.isEmpty(this.updateRow)) {
        addGet(data).then(res => {
          this.$message.success('保存成功!')
          this.$emit('ok')
          this.$emit('close')
        })
      } else {
        /* 修改 */
        updateGet(data).then(res => {
          this.$message.success('修改成功!')
          this.$emit('ok')
          this.$emit('close')
        })
      }
    },
    /* 关闭 */
    handleCancel() {
      this.$emit('close')
    },
    /* 单位 */
    getMerchantList(callBackFunc) {
      listMerchant().then(res => {
        this.merchantList = res.rows
        if (callBackFunc instanceof Function) {
          callBackFunc()
        }
      })
    }
  },
  created() {
    /* 查询项目 */
    treeSelect({ state: '0' }).then(res => {
      this.projectList = res.data
    })
    // 查询运营类项目
    queryContract({ contractProp: '公司运营' }).then(res => {
      this.contractId = res.data
    })
    // 客户单位
    this.getMerchantList()
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formData = { ...this.updateRow, makeTime: moment(this.updateRow.makeTime), getTime: moment(this.updateRow.getTime) }
      this.formData.nickname = this.updateRow.sysUser ? this.updateRow.sysUser.nickName : this.$store.getters.nickname
      /* 查询合同 */
      this.listContracts({ projectId: this.updateRow.projectId, type: this.formData.getType === '收票' ? '支出合同' : '收入合同' })
    }
  }
}
</script>
<style lang="less" scoped>
.s-border-zero {
  font-size: 14px;
  font-weight: bold;
  color: rgb(0, 55, 235);
}
</style>
