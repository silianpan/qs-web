<!-- 付款申请单 -->
<template>
  <div>
    <a-steps class="payment-step" :current="current">
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>
    <s-form single ref="formTable" :queryDictKeys="dictKeys" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel">
      <template v-slot:footer>
        <div v-show="current === 1" class="border">
          <p style="color: #348ee4; font-size: 18px; font-weight: bold; margin-top: 1em">明细总金额：{{ toThousandFilter(totalSum) }}</p>
          <a-button type="primary" ghost icon="plus" @click="addLine" style="margin: 5px 0">新增明细</a-button>
          <a-button ghost type="primary" icon="download" @click="downloadTemp" style="margin: 5px 0; float: right">下载模板</a-button>
          <SUpload :uploadData="uploadData" btn="导入模板" style="margin: 5px 0px 5px 5px; float: right" />
          <a-spin :spinning="spinning">
            <s-table ref="table" size="default" :rowKey="(_, index) => index" :columns="columns" :data="loadData" :showPagination="false" :scroll="{ x: true }">
              <span slot="action" slot-scope="text, record, index">
                <a-popconfirm v-if="tableData.length" title="确认删除该行吗?" @confirm="() => handleDelete(record, index)" ok-text="确认" cancel-text="取消">
                  <a href="javascript:;" style="color: red">删除</a>
                </a-popconfirm>
              </span>
            </s-table>
          </a-spin>
        </div>
      </template>
    </s-form>
    <div class="steps-action">
      <a-button v-if="current > 0" style="margin-left: 8px" @click="current--"> 上一步 </a-button>
      <a-button v-if="current < steps.length - 1" type="primary" @click="handleNext"> 下一步 </a-button>
      <a-button v-if="current == steps.length - 1 && !isReApply" type="primary" @click="handleSubmit"> 保存草稿 </a-button>
      <a-button v-if="current == steps.length - 1 && !isReApply" ghost type="primary" @click="handleApply"> 提交申请 </a-button>
    </div>
  </div>
</template>

<script lang="jsx">
import moment from 'moment'
import downloadUtil from '/src/utils/common/download.js'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { listMerchant, getMerchant } from '/src/api/eos/merchant/merchant.js'
import { treePlanProject, getProject } from '/src/api/eos/project/project.js'
import { listByProject, queryContract } from '/src/api/eos/contract/contract.js'
import { getResidueMoney } from '/src/api/eos/expense/expense.js'
import { budgetPassOne } from '/src/api/eos/budget/apply.js'
import { addPayment, updatePayment, submitApply, getPayment } from '/src/api/eos/purchase/payment.js'
import { getDetail } from '/src/api/eos/purchase/purchase.js'
import { digitUppercase } from '/src/utils/common/util.js'
import { VALIDATE_MONEY } from '/src/utils/common/validate.js'
import { SForm, STable, SUpload } from '/src/components/index.js'
import { handleMerchantEdit } from '/src/views/eos/config/busUtil.js'
import PurchaseApplySelect from './PurchaseApplySelect.vue'
import { getAmountListByContract } from '/src/api/eos/contract/list.js'
import { importfile } from '/src/utils/common/excel.js'
import { getByUsername } from '/src/api/system/user.js'
import { delPaymentDetail } from '/src/api/eos/purchase/paymentDetail.js'
import { BigType } from '/src/api/eos/budget/type.js'
import { allTree } from '/src/api/system/dept.js'

export default {
  name: 'Payment',
  components: {
    SForm,
    STable,
    SUpload
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
    },
    // 判断是否是重新提交
    isReApply: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 表单金额
      totalSum: 0,
      // 年份选择
      yearSelect: [],
      spinning: false,
      current: 0,
      steps: [
        {
          title: '选择项目'
        },
        {
          title: '填写清单'
        },
        {
          title: '填写付款信息'
        }
      ],
      // 采购申请列表
      purchaseApplyList: [],
      // 客商的银行
      bankList: [],
      dictKeys: [dictConfig.PROJECT_UNIT, dictConfig.PROJECT_INVOICE_TYPE],
      departmentList: [],
      merchantList: [],
      projectList: [],
      contractList: [],
      // 项目的预算类型 用于渲染表单
      hasBudget: '是',
      // 预算类型列表
      budgetTypeList: [],
      // 费用类型列表
      expenseTypeList: [],
      // 明细数据
      tableData: [],
      // 加载明细数据
      loadData: param => {
        return new Promise(resolve => {
          resolve(param)
        }).then(param => {
          // 统计合同总金额
          return {
            data: this.tableData
          }
        })
      },
      formData: {
        createBy: this.$store.getters.userName,
        nickname: this.$store.getters.nickname,
        code: 'QS' + moment().format('YYYYMM-DDHHmmss'),
        applyDate: moment(),
        payT: '项目'
      },
      formItem1: [
        [
          {
            type: 'text',
            label: '申请编号',
            prop: 'code'
          },
          {
            type: 'text',
            label: '申请人',
            prop: 'nickname'
          }
        ],
        [
          {
            type: 'select',
            label: '采购申请',
            prop: 'purchaseCode',
            options: () => this.purchaseApplyList,
            compProps: {
              props: {
                allowClear: true
              },
              on: {
                focus: e => {
                  this.handleAssociated()
                }
              }
            }
          },
          {
            type: 'radio',
            prop: 'payT',
            label: '付款类型',
            options: [
              { dictLabel: '项目', dictValue: '项目' },
              { dictLabel: '部门', dictValue: '部门' }
            ],
            compProps: {
              props: {
                disabled: !this.isEmpty(this.updateRow)
              },
              on: {
                change: e => {
                  // 清空项目、合同、预算表单信息
                  this.clearFormDataField()
                  this.$refs.table.refresh(true)
                  if (e.target.value === '部门') {
                    // 默认选中个人所在部门
                    getByUsername({ userName: this.$store.getters.userName }).then(res => {
                      this.$set(this.formData, 'orgId', res.data.dept.deptId)
                      // this.$set(this.formData, 'deptName', res.data.dept.deptName)
                    })
                    // 默认当年
                    this.formData.deptTime = moment().format('yyyy')
                    // 合同的初始化操作 在没有选项目的时候就用这些数据作为合同数据
                    queryContract({ contractProp: '公司运营' }).then(res => {
                      this.contractList = res.data
                    })
                  }
                }
              }
            }
          }
        ]
      ],
      formItem1Sub1: [
        [
          {
            type: 'select',
            prop: 'budgetTypeId',
            label: '费用类型',
            valueAlias: 'id',
            labelAlias: 'name',
            options: () => {
              const ops = []
              this.expenseTypeList.forEach(item => {
                if (item.sealBudgetType) {
                  ops.push({ id: item.sealBudgetType.id, name: item.sealBudgetType.name })
                } else {
                  ops.push({ id: item.id, name: item.name })
                }
              })
              return ops
            },
            compProps: {
              on: {
                select: value => {
                  const expense = this.expenseTypeList.find(item => {
                    if (item.sealBudgetType) {
                      return item.sealBudgetType.id === value
                    } else {
                      return item.id === value
                    }
                  })
                  if (expense.sealBudgetType) {
                    this.$set(this.formData, 'laveSum', expense.sumLeft)
                  } else {
                    this.$set(this.formData, 'laveSum', '∞')
                  }
                }
              }
            }
          },
          {
            type: 'text',
            prop: 'laveSum',
            label: '剩余预算金额(元)'
          }
        ]
      ],
      formItem1Sub2: [
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
                allowClear: false,
                disabled: !this.isEmpty(this.updateRow)
              },
              on: {
                select: val => {
                  // 先清空项目合同预算的信息
                  delete this.formData.budgetTypeId
                  delete this.formData.budgetType
                  this.expenseTypeList = []
                  delete this.formData.laveSum
                  delete this.formData.contractId
                  delete this.formData.contractName
                  delete this.formData.contractCode
                  delete this.formData.contractSum
                  delete this.formData.preMoney
                  delete this.formData.projectCode
                  delete this.formData.projectName
                  this.tableData = []
                  this.$refs.table.refresh(true)
                  // 找到项目的信息
                  const projectOne = this.projectList.filter(e => e.id === val)
                  this.formData.projectCode = projectOne[0].code
                  this.formData.projectName = projectOne[0].label
                  // // 将选中项目的信息带出
                  // getProject(val).then(res => {
                  //   // 调用查询项目详情的接口
                  //   this.hasBudget = res.data.hasBudget
                  // })

                  // 查询支出合同
                  listByProject({ projectId: val, type: '支出合同' }).then(res => {
                    this.contractList = res.data
                    // 只有一个收入合同的时候 就直接显示并将清单带出
                    if (this.contractList.length === 1) {
                      this.$set(this.formData, 'contractId', this.contractList[0].id)
                      this.$set(this.formData, 'contractSum', this.contractList[0].sum)
                      this.$set(this.formData, 'contractCode', this.contractList[0].code)
                      this.$set(this.formData, 'contractName', this.contractList[0].name)
                      this.$set(this.formData, 'preMoney', this.contractList[0].contractInOutSum.realSum)
                      // 写入付款单位 支出合同甲方
                      this.$set(this.formData, 'company', this.contractList[0].firstParty)
                      // 申请部门 默认自身所在部门
                      getByUsername({ userName: this.$store.getters.userName }).then(res => {
                        const dept = res.data.dept
                        // this.$set(this.formData, 'deptName', dept.deptName)
                      })
                      // 收款单位 支出合同甲方
                      getAmountListByContract({ contractId: this.formData.contractId, type: '物料' }).then(res => {
                        this.tableData = res.rows
                        this.$refs.table.refresh(true)
                      })
                    }
                  })
                }
              }
            }
          },
          {}
        ]
      ],
      formItem1Sub3: [
        [
          {
            type: 'select',
            label: '合同名称',
            prop: 'contractId',
            valueAlias: 'id',
            labelAlias: 'name',
            options: () => this.contractList,
            compProps: {
              props: {
                allowClear: true
              },
              on: {
                select: val => {
                  // 将选中合同的信息带出
                  const chooseContract = this.contractList.find(item => item.id === val)
                  this.$set(this.formData, 'contractSum', chooseContract.sum)
                  this.$set(this.formData, 'preMoney', chooseContract.contractInOutSum.realSum)
                  this.$set(this.formData, 'contractCode', chooseContract.code)
                  this.$set(this.formData, 'contractName', chooseContract.name)
                  // 写入付款单位 支出合同甲方
                  this.$set(this.formData, 'company', chooseContract.firstParty)
                  // 申请部门 默认自身所在部门
                  getByUsername({ userName: this.$store.getters.userName }).then(res => {
                    const dept = res.data.dept
                    // this.$set(this.formData, 'deptName', dept.deptName)
                  })
                  // 收款单位 支出合同甲方
                  // this.$set(this.formData, 'company',chooseContract.secondParty)
                  getAmountListByContract({ contractId: this.formData.contractId, type: '物料' }).then(res => {
                    this.tableData = res.rows
                    this.$refs.table.refresh()
                  })
                }
              }
            }
          },
          {}
        ],
        [
          {
            type: 'text',
            label: '合同总金额(元)',
            prop: 'contractSum'
          },
          {
            type: 'text',
            label: '已付款金额',
            prop: 'preMoney'
          }
        ]
      ],
      formItem1Sub4: [
        [
          {
            type: 'select',
            prop: 'deptTime',
            label: '申请年份',
            valueAlias: 'time',
            labelAlias: 'time',
            options: () => this.yearSelect,
            compProps: {
              on: {
                select: val => {
                  delete this.formData.budgetType
                  delete this.formData.budgetTypeId
                  delete this.formData.laveSum
                  this.expenseTypeList = []
                }
              }
            }
          },
          {
            type: 'treeSelect',
            label: '所属部门',
            prop: 'orgId',
            keyAlias: 'id',
            titleAlias: 'label',
            valueAlias: 'id',
            options: () => this.departmentList,
            compProps: {
              on: {
                select: val => {
                  const dept = this.departmentList.find(item => (item.id = val))
                  // this.$set(this.formData, 'deptName', dept.deptName)
                }
              }
            }
          }
        ]
      ],
      formItem1Sub5: [
        [
          {
            type: 'select',
            prop: 'budgetType',
            label: '预算类型',
            valueAlias: 'type',
            labelAlias: 'type',
            options: () => this.budgetTypeList,
            compProps: {
              props: {
                disabled: !this.isEmpty(this.updateRow)
              },
              on: {
                select: val => {
                  delete this.formData.budgetTypeId
                  delete this.formData.laveSum
                  this.expenseTypeList = []
                  if (this.formData.payT === '项目') {
                    if (!this.formData.projectId) {
                      delete this.formData.budgetType
                      return this.$message.warning('请选择项目')
                    }
                  } else {
                    if (!this.formData.orgId) {
                      delete this.formData.budgetType
                      return this.$message.warning('请选择部门')
                    } else if (!this.formData.deptTime) {
                      delete this.formData.budgetType
                      return this.$message.warning('请选择预算年份')
                    }
                  }
                  const queryParam = {
                    projectId: this.formData.projectId,
                    type: val,
                    deptTime: this.formData.deptTime,
                    orgId: this.formData.orgId
                  }
                  budgetPassOne(queryParam).then(res => {
                    const budgetApply = res.data
                    if (!budgetApply) {
                      return this.$message.warning('该项目(部门)暂无' + val + '的预算')
                    }
                    // 预算管控
                    if (budgetApply.isBudget === '是') {
                      this.expenseTypeList = budgetApply.budgetTypeVos
                    } else {
                      getResidueMoney({ type: val }).then(res => {
                        this.expenseTypeList = res.rows
                      })
                    }
                  })
                }
              }
            }
          },
          {}
        ]
      ],
      formItem2: [
        [
          {
            type: 'inputNumber',
            label: '本次付款金额',
            prop: 'payMoney',
            compProps: {
              props: {
                min: 0,
                precision: 2
              },
              on: {
                blur: e => {
                  if (this.formData.laveSum !== '∞' && e.target.value > this.formData.laveSum) {
                    this.$message.error('金额不能大于剩余预算金额：' + this.formData.laveSum + '元')
                    return
                  }

                  this.$set(this.formData, 'payMoneyUpper', digitUppercase(e.target.value))
                }
              }
            }
          },
          {
            type: 'text',
            label: '付款金额大写',
            prop: 'payMoneyUpper'
          }
        ]
      ],
      formItem3: [
        [
          {
            type: 'select',
            label: '付款单位',
            prop: 'company',
            colspan: 4,
            options: dictConfig.PROJECT_UNIT
          },
          {}
          // {
          //   type: 'treeSelect',
          //   label: '申请部门',
          //   prop: 'deptName',
          //   keyAlias: 'id',
          //   titleAlias: 'label',
          //   valueAlias: 'label',
          //   options: () => this.departmentList
          // }
        ],
        [
          {
            type: 'select',
            prop: 'payeeId',
            label: '收款单位',
            options: () => this.merchantList,
            valueAlias: 'id',
            labelAlias: 'name',
            renderSuffix: (text, record) => {
              const filterList = this.merchantList.filter(item => text === item.id)
              let payeeObj = {}
              if (!this.isEmpty(filterList)) {
                payeeObj = filterList[0]
              }
              return (
                <a-button
                  style="height:auto;border:none"
                  type="link"
                  onClick={() =>
                    handleMerchantEdit(payeeObj.name, this.merchantList, () => {
                      this.getMerchantList(() => {
                        // 客商的银行置空
                        this.formData.payeeId = null
                        this.bankList = []
                        this.formData.payeeBank = null
                        payeeObj = this.merchantList.filter(item => item.id === text)[0]
                        // if (this.isEmpty(payeeObj.sealMerchantAccounts) || this.isEmpty(payeeObj.sealMerchantUsers)) {
                        //   this.$message.error('请点击后面按钮“添加”，完善单位信息')
                        //   return
                        // }
                        // this.formData.payeeBank = payeeObj.bank + ' ' + payeeObj.account
                      })
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
                  delete this.formData.payeeAccountId
                  this.bankList = []
                  delete this.formData.payeeAccountId
                  const payeeObj = this.merchantList.filter(item => item.id === value)[0]
                  getMerchant(payeeObj.id).then(res => {
                    this.bankList = res.data.sealMerchantAccounts
                    if (this.bankList.length === 1) {
                      this.$set(this.formData, 'payeeAccountId', this.bankList[0].id)
                    }
                  })
                }
              }
            }
          },
          {
            type: 'select',
            prop: 'payeeAccountId',
            label: '开户账号',
            options: () => this.bankList,
            valueAlias: 'id',
            labelAlias: 'account',
            compProps: {
              props: {
                allowClear: true
              },
              on: {
                select: val => {}
              }
            }
          }
        ],
        [
          {
            type: 'radio',
            prop: 'payWay',
            label: '付款方式',
            options: [
              { dictLabel: '转账', dictValue: '转账' },
              { dictLabel: '现金', dictValue: '现金' }
            ]
          },
          {
            type: 'radio',
            prop: 'payType',
            label: '付款方式',
            options: [
              { dictLabel: '商务类', dictValue: '商务类' },
              { dictLabel: '生产销售类', dictValue: '生产销售类' },
              { dictLabel: '公司运营类', dictValue: '公司运营类' }
            ]
          }
          // {
          //   type: 'radio',
          //   prop: 'fundPlan',
          //   label: '资金计划',
          //   options: [
          //     { dictLabel: '是', dictValue: '是' },
          //     { dictLabel: '否', dictValue: '否' }
          //   ]
          // }
        ],
        [
          {
            type: 'radio',
            label: '发票类型',
            prop: 'invoiceType',
            options: dictConfig.PROJECT_INVOICE_TYPE
          },
          {
            type: 'radio',
            label: '是否开具发票',
            prop: 'invoiceHas',
            options: [
              { dictLabel: '未开', dictValue: '未开' },
              { dictLabel: '已开', dictValue: '已开' }
            ]
          }
        ],
        [
          {
            type: 'inputTextArea',
            label: '付款事由说明',
            prop: 'reason'
          },
          {}
        ],
        [
          {
            type: 'upload',
            prop: 'attachmentPic',
            label: '图片附件',
            compProps: {
              props: {
                listType: 'picture-card',
                defaultFileList: this.getDefaultPicList(),
                beforeUpload: file => {
                  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
                  if (!isJpgOrPng) {
                    this.$message.error('您只能上传图片文件!')
                  }
                  const isLt2M = file.size / 1024 / 1024 < 50
                  if (!isLt2M) {
                    this.$message.error('图片必须小于50MB!')
                  }
                  return isJpgOrPng && isLt2M
                }
              },
              on: {
                change: ({ file, fileList, event }) => {
                  if (file.status === 'done') {
                    const ret = []
                    fileList.forEach(fileItem => {
                      if (fileItem.response && fileItem.response.code === 200) {
                        ret.push({ name: fileItem.name, url: fileItem.response.fileName })
                      } else if (fileItem.name && fileItem.url) {
                        ret.push({ name: fileItem.name, url: fileItem.url })
                      }
                    })
                    if (ret.length > 0) {
                      this.formData.attachmentPic = JSON.stringify(ret)
                    }
                  }
                }
              }
            },
            renderUpload: row => {
              return (
                <div>
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传图片</div>
                </div>
              )
            }
          },
          {}
        ],
        [
          {
            type: 'upload',
            prop: 'attachment',
            label: '附件',
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
        ],
        [
          {
            type: 'inputTextArea',
            label: '备注',
            prop: 'remark'
          },
          {}
        ]
      ],
      columns: [
        // {
        //   title: '#',
        //   dataIndex: 'id',
        //   align: 'center',
        //   fixed: 'left',
        //   customRender: (text, record, index) => {
        //     return index + 1
        //   }
        // },
        {
          title: '名称',
          dataIndex: 'name',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input v-model={record.name} style="width:100px" placeholder="请填写名称"></a-input>
          }
        },
        {
          title: '描述',
          dataIndex: 'description',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input v-model={record.description} style="width:150px" placeholder="请填写描述"></a-input>
          }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input v-model={record.unit} style="width:80px" placeholder="请填写单位"></a-input>
          }
        },
        {
          title: '数量',
          dataIndex: 'amount',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <a-input-number
                v-model={record.amount}
                placeholder="请填写数量"
                min={0}
                precision={2}
                style="width:130px"
                on-change={() => {
                  if (record.amount && record.price) {
                    record.totalPrice = record.amount * record.price
                  } else if (record.amount && record.totalPrice) {
                    record.price = record.totalPrice / record.amount
                  }
                }}
              ></a-input-number>
            )
          }
        },
        {
          title: '单价',
          dataIndex: 'price',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <a-input-number
                v-model={record.price}
                placeholder="请填写单价"
                min={0}
                precision={2}
                style="width:130px"
                on-change={() => {
                  if (record.amount && record.price) {
                    record.totalPrice = record.amount * record.price
                  } else if (record.price && record.totalPrice) {
                    record.amount = record.totalPrice / record.price
                  }
                }}
              ></a-input-number>
            )
          }
        },
        {
          title: '总价',
          dataIndex: 'totalPrice',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <a-input-number
                v-model={record.totalPrice}
                placeholder="请填写总价"
                min={0}
                precision={2}
                style="width:130px"
                on-change={() => {
                  if (record.amount) {
                    record.price = record.totalPrice / record.amount
                  }
                }}
              ></a-input-number>
            )
          }
        },
        {
          title: '型号规格',
          dataIndex: 'spec',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input v-model={record.spec} style="width:120px" placeholder="请填写型号"></a-input>
          }
        },
        {
          title: '操作',
          align: 'center',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      formRules: {
        payType: { required: true, message: '请选择', trigger: 'change' },
        budgetTypeId: { required: true, message: '请选择费用类型', trigger: 'change' },
        // code: { required: true, message: '请选择', trigger: 'change' },
        company: { required: true, message: '请选择', trigger: 'change' },
        // deptName: { required: true, message: '请选择', trigger: 'change' },
        applyDate: { required: true, message: '请输入', trigger: 'blur' },
        payeeId: { required: true, message: '请选择', trigger: 'change' },
        payeeBank: { required: true, message: '请输入', trigger: 'blur' },
        invoiceType: { required: true, message: '请选择', trigger: 'change' },
        invoiceHas: { required: true, message: '请选择', trigger: 'change' },
        reason: { required: true, message: '请输入', trigger: 'blur' },
        projectId: { required: true, message: '请选择项目名称', trigger: 'change' },
        // laveSum: { required: true, message: '请输入', trigger: 'blur' },
        // contractId: { required: true, message: '请选择合同名称', trigger: 'change' },
        // contractSum: { required: true, message: '请输入', trigger: 'blur' },
        payMoney: [{ validator: VALIDATE_MONEY, trigger: 'change' }],
        // preMoney: { required: true, message: '请输入', trigger: 'blur' },
        // payMoneyUpper: { required: true, message: '请输入', trigger: 'blur' },
        budgetType: { required: true, message: '请选择', trigger: 'change' },
        expenseType: { required: true, message: '请选择', trigger: 'change' },
        fundPlan: { required: true, message: '请选择', trigger: 'change' },
        payWay: { required: true, message: '请选择', trigger: 'change' },
        payeeAccount: { required: true, message: '请选择', trigger: 'change' },
        deptTime: { required: true, message: '请选择', trigger: 'change' },
        orgId: { required: true, message: '请选择', trigger: 'change' }
      },
      // 从模板导入
      uploadData: {
        compProps: {
          props: {
            name: 'file',
            multiple: false,
            showUploadList: false,
            accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
            // 上传之前回调，判断上传类型
            beforeUpload: file => {
              this.spinning = true
              return new Promise((resolve, reject) => {
                if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && file.type !== 'sheet,application/vnd.ms-excel') {
                  this.$message.warning('请选择xlsx类型文件')
                  return reject
                }
                return resolve()
              })
            }
          },
          on: {
            change: file => {
              if (file.file.status === 'done') {
                this.spinning = false
                importfile(file.file, outdata => {
                  const excelData = [...outdata]
                  excelData.map(item => {
                    const obj = {}
                    obj.type = '物料'
                    obj.name = item['材料名称']
                    obj.description = item['备注']
                    obj.unit = item['单位']
                    obj.amount = item['数量']
                    obj.price = item['参考价格']
                    obj.totalPrice = item['小计']
                    obj.spec = item['材料规格']
                    this.tableData.push(obj)
                  })
                })
              }
            }
          }
        }
      }
    }
  },
  created() {
    // 初始化日期选着 前后五年
    for (let index = -4; index < 5; index++) {
      this.yearSelect.push({ time: moment().subtract(index, 'year').format('yyyy') })
    }
    allTree().then(res => {
      this.departmentList = res.data
    })
    // 查询客商
    this.getMerchantList()
    // 查询项目树
    treePlanProject({ state: '0' }).then(res => {
      this.projectList = res.data
    })
    if (this.formData.payT === '部门') {
      // 合同的初始化操作 部门的时候就用这些数据作为合同数据
      queryContract({ contractProp: '公司运营' }).then(res => {
        this.contractList = res.data
      })
    }
    // 查询预算大类
    BigType().then(res => {
      this.budgetTypeList = res.data
    })
    // // 合同明细
    // getAmountListByContract({ contractId: this.formData.contractId, type: '物料' }).then(res => {
    //   this.tableData = res.rows
    //   this.$refs.table.refresh()
    // })
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formData = {
        ...this.updateRow,
        applyDate: this.updateRow.applyDate ? moment(this.updateRow.applyDate) : null,
        payT: this.updateRow.deptTime ? '部门' : '项目'
      }
      this.formData.nickname = this.updateRow.sysUser ? this.updateRow.sysUser.nickName : this.$store.getters.nickname
      // 根据purchaseApplyId请求
      if (this.updateRow.purchaseApplyId) {
        getDetail(this.updateRow.purchaseApplyId).then(res => {
          const purchase = res.data
          this.$set(this.formData, 'purchaseCode', purchase.code)
        })
      }
      getMerchant(this.formData.payeeId).then(res => {
        this.bankList = res.data.sealMerchantAccounts
      })
      getPayment(this.formData.id).then(res => {
        this.tableData = res.data.paymentDetailList
        this.$refs.table.refresh(true)
      })

      // 回显
      // 查询支出合同,项目下合同
      if (this.formData.projectId) {
        listByProject({ projectId: this.formData.projectId, type: '支出合同' }).then(res => {
          this.contractList = res.data
        })
      }
      // 运营合同
      if (!this.formData.projectId) {
        queryContract({ contractProp: '公司运营' }).then(res => {
          this.contractList = res.data
        })
      }
      // 查询预算申请单
      budgetPassOne({ projectId: this.formData.projectId, type: this.formData.budgetType, deptTime: this.formData.deptTime, orgId: this.formData.orgId }).then(res => {
        const budgetApply = res.data
        if (!budgetApply) {
          return this.$message.warning('该项目(部门)暂无' + budgetApply.type + '的预算')
        }
        // 预算管控
        if (budgetApply.isBudget === '是') {
          this.expenseTypeList = budgetApply.budgetTypeVos
          const budget = this.expenseTypeList.find(item => item.sealBudgetType.id === this.updateRow.budgetTypeId)
          this.$set(this.formData, 'laveSum', budget.sumLeft)
        } else {
          getResidueMoney({ type: val }).then(res => {
            this.expenseTypeList = res.rows
            this.$set(this.formData, 'laveSum', '∞')
          })
        }
      })
      // if (this.formData.sealProject.hasBudget === '是') {
      //   budgetPassOne({ projectId: this.formData.projectId, type: this.formData.budgetType }).then(res => {
      //     this.expenseTypeList = res.data.budgetTypeVos
      //     const budget = this.expenseTypeList.find(item => item.sealBudgetType.id === this.updateRow.budgetTypeId)
      //     this.$set(this.formData, 'laveSum', budget.sumLeft)
      //   })
      // } else {
      //   getResidueMoney({ type: this.formData.budgetType }).then(res => {
      //     this.expenseTypeList = res.rows
      //     this.$set(this.formData, 'laveSum', '∞')
      //   })
      // }
    }
  },
  methods: {
    // 清空项目、合同、预算表单信息
    clearFormDataField() {
      delete this.formData.projectId
      delete this.formData.budgetTypeId
      delete this.formData.budgetType
      delete this.formData.orgId
      delete this.formData.deptTime
      this.expenseTypeList = []
      delete this.formData.laveSum
      delete this.formData.contractId
      delete this.formData.contractName
      delete this.formData.contractCode
      delete this.formData.contractSum
      delete this.formData.preMoney
      this.tableData = []
    },
    getDefaultPicList() {
      let fileList = []
      if (!this.isEmpty(this.updateRow) && !this.isEmpty(this.updateRow.attachmentPic)) {
        fileList = JSON.parse(this.updateRow.attachmentPic)
        fileList.forEach(item => {
          item.uid = this.uuidv4()
        })
      }
      return fileList
    },
    async handleSubmit(callbackFunc) {
      // 做表单校验
      this.$refs.formTable.$refs.ruleForm.validate(async valid => {
        if (valid) {
          const fd = { ...this.formData }
          fd.paymentDetailList = this.tableData
          fd.applyDate && (fd.applyDate = fd.applyDate.format('YYYY-MM-DD HH:mm:ss'))
          // 更新或添加
          let res = null
          if (this.isUpdate && !this.isEmpty(fd.id)) {
            res = await updatePayment(fd)
          } else {
            res = await addPayment(fd)
          }
          if (callbackFunc instanceof Function) {
            callbackFunc(res)
          } else {
            this.$message.success(res.msg)
            this.$emit('ok')
            this.$emit('close')
          }
        }
      })
    },
    // 直接提交
    async handleApply() {
      await this.handleSubmit(async res => {
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
    },
    handleCancel() {
      this.$emit('close')
    },
    getMerchantList(callBackFunc) {
      listMerchant().then(res => {
        this.merchantList = res.rows
        if (callBackFunc instanceof Function) {
          callBackFunc()
        }
        if (this.isUpdate && !this.isEmpty(this.updateRow)) {
          const payeeObj = this.merchantList.filter(item => item.id === this.updateRow.payeeId)[0]
          this.$set(this.formData, 'payeeBank', payeeObj.bank + ' ' + payeeObj.account)
        }
      })
    },
    handleNext() {
      // 做表单校验
      this.$refs.formTable.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.current++
        }
      })
    },
    addLine() {
      let status = true
      if (this.tableData.length > 0) {
        // 提取出必填项目
        const value = this.tableData.map(({ name, amount, price, totalPrice }) => ({ name, amount, price, totalPrice }))
        value.map(item => {
          for (const key in item) {
            if (!item[key]) {
              status = false
              this.$message.error('请填写完整,再添加新行!')
              return
            }
          }
        })
        if (status) {
          const newValue = {}
          this.tableData.push(newValue)
          this.$refs.table.refresh(true)
        }
      } else {
        const newValue = {}
        this.tableData.push(newValue)
        this.$refs.table.refresh(true)
      }
    },
    // 模板下载
    downloadTemp() {
      downloadUtil.resource('/profile/template/合同物料采购清单模板.xlsx')
    },
    // 明细删除
    handleDelete(data, index) {
      // 修改的时候 查出来的数据调接口 新增直接删
      if (data.paymentId) {
        // 调删除明细的接口
        delPaymentDetail(data.id).then(res => {
          const td = [...this.tableData]
          this.tableData = td.filter(item => {
            return item.id !== data.id
          })
          this.$refs.table.refresh(true)
        })
      } else {
        // const index = this.tableData.findIndex(t => t.id === data.id)
        this.tableData.splice(index, 1)
        this.$refs.table.refresh()
      }
    },
    handleAssociated() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '采购申请列表',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: PurchaseApplySelect,
          props: {
            selectType: 'radio'
          },
          on: {
            ok: (Rows, Keys) => {
              // 先清除
              const purchase = Rows[0]
              this.purchaseType = purchase.purchaseType
              this.$set(this.formData, 'purchaseCode', purchase.code)
              this.$set(this.formData, 'purchaseApplyId', Keys[0])
              if (this.formData.payT === '项目') {
                this.$set(this.formData, 'projectId', purchase.sealProject.id)
                listByProject({ projectId: purchase.sealProject.id, type: '支出合同' }).then(res => {
                  this.contractList = res.data
                })
              } else {
              }
            }
          }
        }
      })
    }
  },
  computed: {
    formItems() {
      const { formItem1, formItem2, formItem1Sub1, formItem3, formItem1Sub2, formItem1Sub3, formItem1Sub4, formItem1Sub5 } = this
      if (this.current === 0) {
        if (this.formData.payT === '项目') {
          return [...formItem1, ...formItem1Sub2, ...formItem1Sub3, ...formItem1Sub5, ...formItem1Sub1]
        } else {
          return [...formItem1, ...formItem1Sub3, ...formItem1Sub4, ...formItem1Sub5, ...formItem1Sub1]
        }
      } else if (this.current === 1) {
        return [...formItem2]
      } else if (this.current === 2) {
        return [...formItem3]
      } else {
        return []
      }
    }
  },
  watch: {
    tableData: {
      handler(newV, oldV) {
        if (!this.isEmpty(newV)) {
          let sum = 0
          newV.forEach(item => {
            sum += item.totalPrice ? item.totalPrice : 0
          })
          // this.formData.payMoney = sum
          this.totalSum = sum
          this.$set(this.formData, 'payMoney', sum)
          this.$set(this.formData, 'payMoneyUpper', digitUppercase(sum))
        }
      },
      deep: true
    },
    'formData.purchaseCode'(newVal) {
      if (this.isEmpty(newVal)) {
        // 清空项目、合同、预算表单信息
        this.clearFormDataField()
      }
    },
    'formData.contractId'(newVal) {
      if (this.isEmpty(newVal)) {
        delete this.formData.contractName
        delete this.formData.contractCode
        delete this.formData.contractSum
        delete this.formData.preMoney
        this.tableData = []
      }
    }
  }
}
</script>
<style lang="less" scoped>
.payment-step {
  margin-bottom: 24px;
}
.title {
  font-weight: 700;
  text-align: center;
  display: block;
  color: #000;
  font-size: 20px;
}
</style>
