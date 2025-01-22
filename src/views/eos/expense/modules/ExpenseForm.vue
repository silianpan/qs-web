<!-- 报销申请单表单 -->
<template>
  <s-form
    ref="form"
    ok
    single
    okText="保存草稿"
    hasApplyBtn
    @apply="handleApply"
    :queryDictKeys="dictKeys"
    :formTitle="'报销申请单表单'"
    :formItems="formItems"
    :formData="formData"
    :rules="formRules"
    @submit="handleSubmit"
    @cancel="handleCancel"
  >
    <!-- 报销明细 -->
    <template v-slot:footer>
      <div class="s-mt-2 s-mb-2">
        <a-button type="primary" ghost icon="plus" @click="addInvoiceLine">手填发票</a-button>
        <div class="border" style="margin-top: 10px" v-if="invoiceData.length > 0 ? true : false">
          <s-table ref="invoiceTable" size="default" :rowKey="(_, index) => index" :columns="invoiceColumns" :data="loadInvoiceData" :showPagination="false" :scroll="{ x: true }">
            <span slot="action" slot-scope="text, record">
              <a-popconfirm v-if="invoiceData.length" title="确认删除该行吗?" @confirm="() => handleInvoiceDelete(record.id, record.oid)" ok-text="确认" cancel-text="取消">
                <a href="javascript:;" style="color: red">删除</a>
              </a-popconfirm>
            </span>
          </s-table>
        </div>
        <!-- 上传发票 -->
        <div style="margin: 5px 0">
          <component :is="invoiceUploadComp" :uploadData="uploadData"></component>
          <a-spin style="margin-top: 20px" :spinning="spinning" />
        </div>
        <p style="color: #348ee4; font-size: 18px; font-weight: bold; margin-top: 1em">报销总金额：{{ toThousandFilter(sumtotal) }}</p>
        <div class="border" v-if="tableData.length > 0 ? true : false">
          <s-table ref="table" size="default" :rowKey="(_, index) => index" :columns="columns" :data="loadData" :showPagination="false" :scroll="{ x: true }">
            <span slot="action" slot-scope="text, record">
              <a-popconfirm v-if="tableData.length" title="确认删除该行吗?" @confirm="() => handleDelete(record.id, record.oid)" ok-text="确认" cancel-text="取消">
                <a href="javascript:;" style="color: red">删除</a>
              </a-popconfirm>
            </span>
          </s-table>
        </div>
        <a-button ghost type="primary" icon="plus" @click="addLine" style="margin: 5px 0">新增明细</a-button>
      </div>
    </template>
  </s-form>
</template>

<script lang="jsx">
import moment from 'moment'
import storage from 'store'
import { previewDoc } from '/src/components/Office/office.js'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { STable, SUpload, SForm } from '/src/components/index.js'
import { getAccessToken, getVatInvoice } from '/src/api/eos/invoice/baidu_invoice.js'
import { getBase64 } from '/src/utils/common/util.js'
import { addExpense, getResidueMoney, updateExpense, deletDetail, deleteInvoice, getExpense, submitApply } from '/src/api/eos/expense/expense.js'
import { treePlanProject } from '/src/api/eos/project/project.js'
import { budgetPassOne } from '/src/api/eos/budget/apply.js'
import { Icon } from 'ant-design-vue'
import { BigType } from '/src/api/eos/budget/type.js'
import { allTree } from '/src/api/system/dept'
import { getByUsername } from '../../../../api/system/user'
import {ACCESS_TOKEN} from '/src/store/mutation-types'

export default {
  name: 'ExpenseForm',
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
    }
  },
  computed: {
    // 修改上传--发票
    getInvoiceFileList() {
      if (!this.isEmpty(this.defaultInvoiceFileList)) {
        this.defaultInvoiceFileList.forEach(item => {
          item.uid = item.id
          item.name = item.invoiceNum
          item.url = item.attachment
        })
        return this.defaultInvoiceFileList
      }
      return []
    }
  },
  data() {
    return {
      fileUploadHeader: {Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN)},
      /* 上传组件回调和参数 */
      uploadData: {
        customDefaultFileList: () => this.getInvoiceFileList,
        compProps: {
          props: {
            multiple: true,
            'list-type': 'picture',
            beforeUpload: (file, fileList) => {
              if (fileList.length > 2) {
                return new Promise((resolve, reject) => {
                  this.$message.warning('一次最多上传2张发票!')
                  return reject
                })
              }
              return new Promise((resolve, reject) => {
                this.spinning = true
                if (file) {
                  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/bmp' || file.type === 'application/pdf'
                  if (!isJpgOrPng) {
                    this.spinning = false
                    return this.$message.error('您只能上传图片或PDF文件!')
                  }
                  const isLt2M = file.size / 1024 / 1024 < 4
                  if (!isLt2M) {
                    this.spinning = false
                    return this.$message.error('图片必须小于4MB!')
                  }
                  return this.file_Base64(file).then(base => {
                    const params = { grant_type: 'client_credentials', client_id: 'GrAUQjA4ph0l68Fa2CTuEwuM', client_secret: 'GwW6EPN8yUmoM6UwCa0XErmi5H63G2Lv' }
                    return getAccessToken(params).then(res => {
                      if (!this.isEmpty(res.access_token)) {
                        let base64Data = {}
                        const params = { access_token: res.access_token }
                        if (base.split(',')[0] === 'data:application/pdf;base64') {
                          const str = base.split(',')[1]
                          base64Data = {
                            pdf_file: str
                          }
                        } else {
                          base64Data = {
                            image: base
                          }
                        }
                        return getVatInvoice(this.$qs.stringify(base64Data), params).then(val => {
                          if (!this.isEmpty(val.words_result)) {
                            file.invoiceCode = val.words_result.InvoiceCode
                            file.invoiceNum = val.words_result.InvoiceNum
                            file.invoiceDate = val.words_result.InvoiceDate
                            file.checkCode = val.words_result.CheckCode
                            file.machineCode = val.words_result.MachineCode
                            file.purchaserName = val.words_result.PurchaserName
                            file.purchaserRegisterNum = val.words_result.PurchaserRegisterNum
                            file.purchaserBank = val.words_result.SellerBank
                            file.purchaserAddress = val.words_result.SellerAddress
                            file.amountInFiguers = val.words_result.AmountInFiguers
                            /* 单独上传的时候判断是否有重复的发票 */
                            if (this.fileListData.length <= 0) {
                              return resolve(file)
                            } else {
                              this.fileListData.forEach(item => {
                                if (item.invoiceNum === file.invoiceNum) {
                                  this.spinning = false
                                  this.$message.warning('请勿上传重复的发票!')
                                  return reject
                                } else {
                                  return resolve(file)
                                }
                              })
                            }
                          } else {
                            this.spinning = false
                            this.$message.error('仅支持jpg/jpeg/png/bmp/pdf格式发票文件,大小不超过4MB!')
                            return reject
                          }
                        })
                      }
                    })
                  })
                }
              })
            },
            remove: file => {
              return new Promise((resolve, reject) => {
                if (file.id) {
                  deleteInvoice(file.id).then(res => {
                    return resolve(true)
                  })
                } else {
                  const addFilter = this.fileListData.filter(item => item.uid !== file.uid)
                  this.fileListData = addFilter
                  return resolve(true)
                }
              })
            }
          },
          on: {
            change: ({ file, fileList, event }) => {
              if (file.status === 'done' || file.status === 'removed') {
                const ret = []
                fileList.forEach((item, index) => {
                  /* 多个发票上传 重复警告 */
                  if (item.invoiceNum === file.invoiceNum && item.uid !== file.uid) {
                    this.$message.warning('发票号码为：' + item.invoiceNum + '、请勿重复上传!')
                    return true
                  }
                  if (item.response && item.response.code === 200) {
                    ret.push({ attachment: item.response.fileName, ...item })
                  }
                })
                if (ret.length > 0) {
                  // 发票上传成功之后的URL----fileList
                  this.spinning = false
                  this.fileListData = ret
                }
              }
            },
            // 点击图片预览回调
            preview: this.handlePreview
          }
        }
      },
      invoiceUploadComp: null,
      flag: true,
      /* 实时计算金额明细总额 */
      sumtotal: 0,
      dictKeys: [dictConfig.PROJECT_BUDGET_TYPE],
      // 预算类型
      budgetTypeOptions: [],
      yearSelect: [],
      // 项目
      projectList: [],
      BGTypeList: [],
      formData: {
        createBy: this.$store.getters.userName,
        nickname: this.$store.getters.nickname,
        code: 'BX-' + moment().format('YYYYMM-DDHHmmss'),
        repay: '否',
        changeRadio: '项目报销',
        deptTime: moment().format('yyyy')
      },
      // 部门集合
      departmentList: [],
      projectID: '',
      spinning: false, // 加载
      // 可报销金额
      remainingSum: '',
      // 费用类型
      selsetValue: [],
      selectDept: {
        type: 'treeSelect',
        label: '所属部门',
        prop: 'orgId',
        keyAlias: 'id',
        titleAlias: 'label',
        valueAlias: 'id',
        options: () => this.departmentList,
        compProps: {
          props: {
            allowClear: false
          }
        }
      },
      chooseProjectObj: {
        type: 'treeSelect',
        label: '所属项目',
        prop: 'projectId',
        colspan: 6,
        options: () => this.projectList,
        valueAlias: 'id',
        labelAlias: 'label',
        compProps: {
          props: {
            disabled: !this.isEmpty(this.updateRow)
          },
          on: {
            select: value => {
              // 清除明细
              this.tableData = []
              this.flag = false
              this.formData.budgetType = null
              this.projectID = value
              // const targetProject = this.projectList.filter((item, index) => {
              //   return item.id === value
              // })
              // if (targetProject[0].hasBudget !== '是') {
              //   this.flag = true
              //   getResidueMoney().then(res => {
              //     this.selsetValue = res.rows || []
              //   })
              // } else {
              //   budgetPass({ projectId: value }).then(res => {
              //     this.flag = false
              //     this.selsetValue = (res.data && res.data.budgetTypeVos) || []
              //   })
              // }
            }
          }
        }
      },
      chooseYearObj: {
        type: 'select',
        prop: 'deptTime',
        label: '申请年份',
        valueAlias: 'time',
        labelAlias: 'time',
        colspan: 12,
        options: () => this.yearSelect,
        props: {
          disabled: !this.isEmpty(this.updateRow)
        }
      },
      formItems: [
        [
          {
            type: 'text',
            prop: 'code',
            label: '报销单号',
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
            type: 'radio',
            label: '报销类型',
            prop: 'changeRadio',
            labelAlias: 'label',
            valueAlias: 'value',
            options: () => [
              { label: '项目报销', value: '项目报销' },
              { label: '部门报销', value: '部门报销' }
            ],
            compProps: {
              on: {
                change: ({ target: { value } }) => {
                  if (value === '部门报销') {
                    this.formData.deptTime = moment().format('yyyy')
                    this.formItems[1][1] = this.chooseYearObj
                    // 预算类型后移
                    this.formItems[2][1] = this.formItems[2][0]
                    this.formItems[2][0] = this.selectDept
                    // 默认选中个人所在部门
                    getByUsername({ userName: this.$store.getters.userName }).then(res => {
                      this.$set(this.formData, 'orgId', res.data.dept.deptId)
                    })
                    this.tableData = []
                    // this.flag = false
                    this.sumtotal = 0
                    delete this.formData.budgetType
                    delete this.formData.projectId
                    this.formData.content = ''
                    // this.formItems[1][1].type = 'select'
                    // this.formItems[2][1].label = '申请年份'
                  } else {
                    this.formItems[1][1] = this.chooseProjectObj
                    // 预算类型前移
                    this.formItems[2][0] = this.formItems[2][1]
                    this.formItems[2][1] = {}
                    // this.formItems[2][1].type = null
                    // this.formItems[2][1].label = ''
                    delete this.formData.deptTime
                    // 清除明细
                    this.tableData = []
                    // this.flag = false
                    this.sumtotal = 0
                    delete this.formData.budgetType
                    delete this.formData.orgId
                    this.formData.content = ''
                    // this.projectID = value
                    // const targetProject = this.projectList.filter((item, index) => {
                    //   return item.id === value
                    // })
                  }
                }
              },
              props: {
                disabled: !this.isEmpty(this.updateRow)
              }
            }
          },
          {}
        ],
        [
          {
            type: 'select',
            prop: 'budgetType',
            label: '预算类型',
            valueAlias: 'type',
            labelAlias: 'type',
            colspan: 12,
            options: () => this.budgetTypeOptions,
            compProps: {
              props: {
                disabled: !this.isEmpty(this.updateRow)
              },
              on: {
                select: e => {
                  if (this.formData.changeRadio === '项目报销') {
                    if (!this.formData.projectId) {
                      delete this.formData.budgetType
                      return this.$message.warning('请先选择项目')
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
                  this.tableData = []
                  this.flag = false
                  // 清空明细表
                  if (this.formData.projectId) {
                    let apply
                    // 查询项目预算
                    budgetPassOne({ projectId: this.formData.projectId, type: e, deptTime: this.formData.deptTime }).then(res => {
                      if (res.data === undefined) {
                        return this.$message.warning('该项目暂未制定' + e)
                      }
                      apply = res.data
                      // 判断强弱管控
                      if (apply.isBudget !== '是') {
                        this.flag = true
                        getResidueMoney({ type: e }).then(res => {
                          this.selsetValue = res.rows || []
                        })
                      } else {
                        // 强管控
                        this.flag = false
                        this.selsetValue = (apply && apply.budgetTypeVos) || []
                      }
                    })
                  } else {
                    // 强管控
                    budgetPassOne({ type: e, deptTime: this.formData.deptTime, orgId: this.formData.orgId }).then(res => {
                      this.flag = false
                      if (this.isEmpty(res.data && res.data.budgetTypeVos)) {
                        return this.$message.warning('该部门暂未制定' + e)
                      }
                      this.selsetValue = (res.data && res.data.budgetTypeVos) || []
                    })
                  }
                }
              }
            }
          },
          {}
        ],
        [
          {
            type: 'radio',
            label: '是否冲抵借款',
            prop: 'repay',
            colspan: 4,
            options: [
              { dictLabel: '是', dictValue: '是' },
              { dictLabel: '否', dictValue: '否' }
            ]
          },
          {
            type: 'upload',
            prop: 'attachment',
            label: '附件',
            colspan: 4,
            customDefaultFileList: () => this.formData && this.formData.attachment,
            handleChange: ret => {
              this.formData.attachment = JSON.stringify(ret)
            },
            compProps: {
              props: {
                multiple: true
              }
            }
            // formItemProps: {
            //   props: {
            //     labelCol: { lg: 3, md: 8, sm: 10, xs: 24 },
            //     wrapperCol: { lg: 21, md: 16, sm: 14, xs: 24 }
            //   }
            // }
          }
        ],
        [
          {
            type: 'inputTextArea',
            label: '报销事由',
            prop: 'content',
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
        content: { required: true, message: '请输入', trigger: 'blur' },
        repay: { required: true, message: '请选择', trigger: 'change' },
        budgetType: { required: true, message: '请选择', trigger: 'change' },
        deptTime: { required: true, message: '请选择', trigger: 'change' },
        changeRadio: { required: true, message: '请选择', trigger: 'change' },
        projectId: { required: true, message: '请选择', trigger: 'change' },
        orgId: { required: true, message: '请选择', trigger: 'change' }
      },
      columns: [
        {
          title: '#',
          dataIndex: 'id',
          align: 'center',
          fixed: 'left',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '费用类型',
          dataIndex: 'budgetId',
          align: 'center',
          customRender: (text, record) => {
            return (
              <a-select v-model={record.budgetId} style="width:180px" placeholder="请选择">
                {this.selsetValue.map(item => {
                  const name = item.name ? item.name : item.sealBudgetType.name
                  // const id = item.sealBudgetType ? item.sealBudgetType.id : item.id
                  // 这里无需进行判断 不管是费用类型还是预算 直接取id即可
                  const id = item.id
                  return <a-select-option key={id}>{name}</a-select-option>
                })}
              </a-select>
            )
          }
        },
        {
          title: '剩余可报销金额(元)',
          dataIndex: 'sumLeft',
          align: 'left',
          customRender: (text, record) => {
            if (record.budgetId) {
              const val = this.selsetValue.find(item => item.id === record.budgetId)
              if (!this.isEmpty(val)) {
                return val.sumLeft
              }
            }
          }
        },
        {
          title: '费用详情',
          dataIndex: 'detail',
          align: 'center',
          width: 200,
          customRender: (text, record, index) => {
            return (
              <a-textarea v-model={record.detail} placeholder="输入详情内容...." rows={2}>
                <a-icon slot="suffix" type="edit" />
              </a-textarea>
            )
          }
        },

        {
          title: '报销金额(元)',
          dataIndex: 'sum',
          align: 'left',
          customRender: (text, record, index) => {
            this.sumtotal = this.$refs.table.localDataSource.reduce(
              (acc, cur, idx, arr) => {
                return this.NumberAdd(acc, cur.sum === undefined ? 0 : cur.sum)
              },
              [0]
            )
            return <a-input-number v-model={record.sum} placeholder="请输入" min={0} precision={2} style={{ width: '100px' }} />
          }
        },
        {
          title: '是否代票',
          dataIndex: 'replaced',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <a-radio-group v-model={record.replaced}>
                <a-radio value="是">是</a-radio>
                <a-radio value="否">否</a-radio>
              </a-radio-group>
            )
          }
        },
        {
          title: '代票详情',
          dataIndex: 'remark',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.remark}></a-input>
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
      /* 报销明细 */
      tableData: [],
      invoiceData: [],
      invoiceColumns: [
        {
          title: '#',
          dataIndex: 'id',
          align: 'center',
          fixed: 'left',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '发票代码',
          dataIndex: 'invoiceCode',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.invoiceCode}></a-input>
          }
        },
        {
          title: '发票号码',
          dataIndex: 'invoiceNum',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.invoiceNum}></a-input>
          }
        },
        {
          title: '开票日期',
          dataIndex: 'invoiceDate',
          align: 'center',
          customRender: (text, record) => {
            return text ? (
                <a-date-picker value={moment(text)} onChange={(date, dateString) => (record.invoiceDate = dateString)} placeholder="选择日期" />
            ) : (
                <a-date-picker onChange={(date, dateString) => (record.invoiceDate = dateString)} placeholder="选择日期" />
            )
          }
        },
        {
          title: '检验码',
          dataIndex: 'checkCode',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.checkCode}></a-input>
          }
        },
        {
          title: '机器编码',
          dataIndex: 'machineCode',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.machineCode}></a-input>
          }
        },
        {
          title: '发票单位',
          dataIndex: 'purchaserNum',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.purchaserNum}></a-input>
          }
        },
        {
          title: '纳税人识别号',
          dataIndex: 'purchaserRegisterNum',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.purchaserRegisterNum}></a-input>
          }
        },
        {
          title: '开户行及账户',
          dataIndex: 'purchaserBank',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.purchaserBank}></a-input>
          }
        },
        {
          title: '地址电话',
          dataIndex: 'purchaserAddress',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.purchaserAddress}></a-input>
          }
        },
        {
          title: '发票金额',
          dataIndex: 'amountInFiguers',
          align: 'center',
          customRender: (text, record) => {
            return <a-input-number v-model={record.amountInFiguers} min={0} precision={2} style="width:130px"></a-input-number>
          }
        },
        {
          title: '发票附件',
          dataIndex: 'attachment',
          align: 'center',
          customRender: (text, record) => {
            return <a-upload
                name="file"
                action={import.meta.env.VITE_APP_BASE_API + '/common/upload'}
                headers={this.fileUploadHeader}
                v-model={record.attachment}
                onChange={(file) => this.handleUploadChange(file, record)}
                before-upload={this.beforeUpload}
            >
              <a-button>
                <a-icon type="upload"/>
                上传附件
              </a-button>
            </a-upload>
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
      // 所属合同
      contractId: [],
      // 是否带票
      replaced: [
        {
          value: '否',
          label: '否'
        },
        {
          value: '是',
          label: '是'
        }
      ],
      // 加载明细数据
      loadData: param => {
        return new Promise(resolve => {
          resolve(param)
        }).then(param => {
          return {
            data: this.tableData
          }
        })
      },
      loadInvoiceData: param => {
        return new Promise(resolve => {
          resolve(param)
        }).then(param => {
          return {
            data: this.invoiceData
          }
        })
      },
      previewImage: '',
      // 发票验证成功数据
      vals: [],
      // 发票List
      fileListData: [],
      // 默认发票列表
      defaultInvoiceFileList: []
    }
  },
  methods: {
    // 提交之前处理数据
    handleSubmitPreData() {
      const expenseForm = this.formData
      expenseForm.sealExpenseDetails = this.$refs.table ? this.$refs.table.localDataSource : []
      const sealInvoicesDetails = this.$refs.invoiceTable ? this.$refs.invoiceTable.localDataSource : []
      expenseForm.sealInvoices = this.fileListData.concat(sealInvoicesDetails)
      if (this.flag) {
        expenseForm.sealExpenseDetails.forEach(item => {
          item.typeId = item.budgetId
        })
      }
      return expenseForm
    },
    // 提交
    async handleSubmit(callbackFunc) {
      let passInvoiceValidate = true
      const validateObj = [ 'invoiceCode','invoiceNum','invoiceDate','checkCode','machineCode','purchaserNum','purchaserRegisterNum','purchaserBank','purchaserAddress','amountInFiguers','attachment' ]
      this.invoiceData.forEach(item=>{
        for(let i = 0; i< validateObj.length; i++) {
          if(!item[validateObj[i]]){
            passInvoiceValidate = false
          }
        }
      })
      if(!passInvoiceValidate){
        this.$message.error('手填发票必须每项填写完整！')
        return
      }
      const expenseForm = this.handleSubmitPreData()
      console.log('expenseForm', expenseForm)
      // 修改
      let res = null
      try {
        if (this.isUpdate && this.updateRow.id) {
          res = await updateExpense(expenseForm)
        } else {
          // 新增
          res = await addExpense(expenseForm)
        }
        if (callbackFunc instanceof Function) {
          callbackFunc(res)
        } else {
          this.$message.success(res.msg)
          this.$emit('ok')
          this.$emit('close')
        }
      } catch {
        this.$refs.form.saveBtnLoading = false
        this.$refs.form.loading = false
      }
    },
    // 直接提交申请
    handleApply() {
      this.handleSubmit(res => {
        // 直接提交流程
        submitApply({
          tenantAppId: this.$store.getters.tenantAppId,
          menuId: this.$route.meta.moduleId,
          dataId: res.data
        }).then(_ => {
          this.$message.success(res.msg, 3)
          this.$emit('ok')
          this.$emit('close')
        }).catch(reason=>{
          this.$refs.form.loading = false
          this.$refs.form.saveBtnLoading = false
        })
      })
    },
    handleCancel() {
      this.$emit('ok')
      this.$emit('close')
    },
    // 新增明细行
    addLine() {
      if (this.isEmpty(this.formData.budgetType)) return this.$message.warning('先选择预算，再添加明细!')
      let status = true
      if (this.tableData.length > 0) {
        const value = this.tableData.map(({ budgetId, sum }) => ({ budgetId, sum }))
        value.map(item => {
          for (const key in item) {
            if (!item[key]) {
              status = false
              this.$message.error('请填写完整,在添加新行!')
              return
            }
          }
        })
        if (!status) {
          return
        }
      }
      const newValue = {
        // id: Date.now().toString(),
        budgetId: '',
        sum: '',
        oid: Date.now().toString(),
        replaced: '否'
      }
      this.tableData.push(newValue)
      this.$nextTick(() => {
        this.$refs.table.refresh(true)
      })
    },
    // 手填发票新增明细行
    addInvoiceLine() {
      if (this.isEmpty(this.formData.budgetType)) return this.$message.warning('先选择预算，再添加明细!')
      let status = true
      if (this.invoiceData.length > 0) {
        const value = this.invoiceData.map(({ invoiceCode,invoiceNum,invoiceDate,checkCode,machineCode,purchaserNum,purchaserRegisterNum,purchaserBank,purchaserAddress,amountInFiguers,attachment }) => ({ invoiceCode,invoiceNum,invoiceDate,checkCode,machineCode,purchaserNum,purchaserRegisterNum,purchaserBank,purchaserAddress,amountInFiguers,attachment }))
        value.map(item => {
          for (const key in item) {
            if (!item[key]) {
              status = false
              this.$message.error('请填写完整,在添加新行!')
              return
            }
          }
        })
        if (!status) {
          return
        }
      }
      const newValue = {
        oid: Date.now().toString(),
        createBy: this.$store.getters.nickname,
        busCode: this.formData.code,
        busType: '报销'
      }
      this.invoiceData.push(newValue)
      this.$nextTick(() => {
        this.$refs.invoiceTable.refresh(true)
      })
    },
    // 删除明细行
    handleDelete(id, oid) {
      if (id) {
        deletDetail(id).then(res => {
          const tableData = [...this.tableData]
          this.tableData = tableData.filter(item => {
            return item.id !== id
          })
          this.$refs.table.refresh(true)
        })
      } else {
        const tableData = [...this.tableData]
        this.tableData = tableData.filter(item => {
          return item.oid !== oid
        })
        this.$refs.table.refresh(true)
      }
    },
    // 删除手填发票明细
    handleInvoiceDelete(id, oid) {
      if (id) {
        alert('接口还没调！')
        // deletDetail(id).then(res => {
        //   const tableData = [...this.tableData]
        //   this.tableData = tableData.filter(item => {
        //     return item.id !== id
        //   })
        //   this.$refs.table.refresh(true)
        // })
      } else {
        const tableData = [...this.invoiceData]
        this.invoiceData = tableData.filter(item => {
          return item.oid !== oid
        })
        this.$refs.invoiceTable.refresh(true)
      }
    },
    // 查看图片
    async handlePreview(file) {
      previewDoc(file.name, file.url)
    },
    /* 转base64 */
    async file_Base64(file) {
      const base64 = await getBase64(file)
      return base64
    },
    NumberAdd(arg1, arg2) {
      var r1, r2, m, n
      try {
        r1 = arg1.toString().split('.')[1].length
      } catch (e) {
        r1 = 0
      }
      try {
        r2 = arg2.toString().split('.')[1].length
      } catch (e) {
        r2 = 0
      }
      m = Math.pow(10, Math.max(r1, r2))
      n = r1 >= r2 ? r1 : r2
      return ((arg1 * m + arg2 * m) / m).toFixed(n)
    },
    handleUploadChange({file, fileList}, record) {
      console.log('file', file)
      if (file.status === 'done' || file.status === 'removed') {
        const ret = []
        fileList.forEach((item, index) => {
          /* 多个发票上传 重复警告 */
          if (item.invoiceNum === file.invoiceNum && item.uid !== file.uid) {
            this.$message.warning('发票号码为：' + item.invoiceNum + '、请勿重复上传!')
            return true
          }
          if (item.response && item.response.code === 200) {
            ret.push({ attachment: item.response.fileName, ...item })
          }
        })
        console.log('ret', ret)
        console.log('record', record)
        if (ret.length > 0) {
          record.attachment = ret
        }
      }
    },
    beforeUpload(file) {
      console.log('file', file)
      const isJpgOrPng = file.type === file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/bmp' || file.type === 'application/pdf'
      if (!isJpgOrPng) {
        this.$message.error('您只能上传图片或PDF文件!')
      }
      const isLt2M = file.size / 1024 / 1024 < 4
      if (!isLt2M) {
        this.$message.error('图片必须小于4MB!')
      }
      return isJpgOrPng && isLt2M
    }
  },
  created() {
    allTree().then(res => {
      this.departmentList = res.data
    })
    this.formItems[1][1] = this.chooseProjectObj
    // 初始化日期选着 前后五年
    for (let index = -4; index < 5; index++) {
      this.yearSelect.push({ time: moment().subtract(index, 'year').format('yyyy') })
    }
    // 查询预算类型
    BigType().then(res => {
      this.budgetTypeOptions = res.data
    })
    /* 查询项目 */
    treePlanProject().then(res => {
      this.projectList = res.data
    })
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formData = { ...this.updateRow }
      // 如果项目存在则为项目报销
      if (this.formData.projectId) {
        this.formData.changeRadio = '项目报销'
        this.formItems[1][1] = this.chooseProjectObj
        // 预算类型前移
        this.formItems[2][1] = {}
      } else {
        this.formData.changeRadio = '部门报销'
        this.formItems[1][1] = this.chooseYearObj
        // 预算类型后移
        this.formItems[2][1] = this.formItems[2][0]
        this.formItems[2][0] = this.selectDept
      }
      this.formData.nickname = this.updateRow.sysUser ? this.updateRow.sysUser.nickName : this.$store.getters.nickname

      getExpense(this.updateRow.id).then(res => {
        // this.fileListData = res.data.sealInvoices || []
        this.defaultInvoiceFileList = res.data.sealInvoices || []
        this.tableData = this.tableData.concat(res.data.expenseDetailVos)
        this.invoiceUploadComp = SUpload
        // this.tableData.forEach(item => {
        //   // item.budgetId = item.sealBudgetType ? item.sealBudgetType.id : item.typeId
        // })
      })
      /* 查询类型 */
      if (this.updateRow.orgId === null) {
        // 根据budgetId查询预算明细
        budgetPassOne({ projectId: this.updateRow.projectId, type: this.updateRow.budgetType }).then(res => {
          const budgetApply = res.data
          if (budgetApply.isBudget === '是') {
            this.flag = false
            this.selsetValue = budgetApply.budgetTypeVos || []
          } else {
            this.flag = true
            getResidueMoney().then(res => {
              this.selsetValue = res.rows || []
            })
          }
        })
      } else {
        budgetPassOne({ deptTime: this.updateRow.deptTime, type: this.updateRow.budgetType, orgId: this.updateRow.orgId }).then(res => {
          this.selsetValue = (res.data && res.data.budgetTypeVos) || []
        })
      }
      this.tableData = this.updateRow.expenDetailVos ? [...this.updateRow.expenDetailVos] : []
    } else {
      this.invoiceUploadComp = SUpload
    }
  },
  mounted() {
    if (!this.isEmpty(this.tableData)) {
      this.$refs.table.refresh(true)
    }
  }
}
</script>
<style scoped lang="less">
.title {
  font-weight: 700;
  text-align: center;
  display: block;
  color: #000;
  font-size: 24px;
  margin: 20px 0;
}
::v-deep .ant-upload-list-item-thumbnail {
  cursor: pointer;
}
@import '/src/assets/style/scroll.less';
</style>
