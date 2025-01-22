<!-- 资金计划表单 -->
<template>
  <s-form ok single :okText="'保存申请'" :queryDictKeys="dictKeys" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel">
    <template v-slot:footer>
      <!-- 项目本金现金流情况表 -->
      <div style="margin-bottom: 40px">
        <div class="prompt">
          <p><a-icon type="alert" style="font-size: 30px; vertical-align: sub" /><span style="color: #000; margin-left: 10px">注意事项：</span>导入的模板第一行"标题"不能修改、项目编号和合同编号要填写正确!</p>
        </div>
        <h2 class="title">（一）、项目本金现金流情况表</h2>
        <!-- <a-button ghost type="primary" icon="plus" @click="addLine" style="margin-right:20px">新增项</a-button> -->
        <!-- 导入 -->
        <ImportExcel :uploadData="fund_importExcelData" style="margin-right: 10px" />
        <a-button ghost type="primary" icon="download" @click="download_fundsTable">下载模板</a-button>

        <a-spin :spinning="spinning1" style="margin-top: 10px">
          <s-table ref="fundsTable" size="default" :rowKey="record => (record.id ? record.id : record.oid)" :columns="fundsColumns" :data="fundsLoadData" :showPagination="false">
            <span slot="action" slot-scope="text, record">
              <a-popconfirm v-if="fundstableData.length" title="确认删除该行吗?" @confirm="() => handleDelete(record.oid, record.id)" ok-text="确认" cancel-text="取消">
                <a href="javascript:;" style="color: red">删除</a>
              </a-popconfirm>
            </span>
          </s-table>
        </a-spin>
      </div>
      <!-- 项目收款情况表 -->
      <div>
        <h2 class="title">（二）、项目收款情况表</h2>
        <!-- <a-button ghost type="primary" icon="plus" @click="CollectMoneyAddLine" style="margin-right:20px">新增项</a-button> -->
        <!-- 导入 -->
        <ImportExcel :uploadData="Collect_importExcelData" style="margin-right: 10px" />
        <a-button ghost type="primary" icon="download" @click="download_Collect">下载模板</a-button>

        <a-spin :spinning="spinning2" style="margin-top: 10px">
          <s-table ref="Collect_MoneyTable" size="default" :rowKey="record => (record.id ? record.id : record.oid)" :columns="CollectMoneyColumns" :data="CollectMoneyLoadData" :showPagination="false">
            <span slot="action" slot-scope="text, record">
              <a-popconfirm v-if="CollectMoneyTableData.length" title="确认删除该行吗?" @confirm="() => CollectMoneyhandleDelete(record.oid, record.id)" ok-text="确认" cancel-text="取消">
                <a href="javascript:;" style="color: red">删除</a>
              </a-popconfirm>
            </span>
          </s-table>
        </a-spin>
      </div>
    </template>
  </s-form>
</template>

<script lang="jsx">
import moment from 'moment'
import downloadUtil from '/src/utils/common/download.js'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { SForm, STable, ImportExcel, Ellipsis } from '/src/components/index.js'
import { listMerchant } from '/src/api/eos/merchant/merchant.js' // 客户单位
import { allTree } from '/src/api/system/dept.js'
import { fundProjectOut, fundProjectIn, addFund, updateFund } from '/src/api/eos/fundPlan/fund.js'
import { listByProject } from '/src/api/eos/contract/contract.js'
import { uuidv4 } from '/src/utils/common/util.js'
import { importfile } from '/src/utils/common/excel.js'

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
  name: 'Fund',
  components: {
    SForm,
    STable,
    ImportExcel
  },
  data() {
    return {
      dictKeys: [dictConfig.PROJECT_UNIT, dictConfig.PROJECT_PURCHASING_METHOD, dictConfig.PROJECT_TYPE_OF_DIRECT_OLD, dictConfig.PROJECT_TYPE_OF_INDIRECT_OLD],
      dictMap: {}, // 字典集合
      formData: {
        createBy: this.$store.getters.userName,
        nickname: this.$store.getters.nickname,
        code: 'ZJJH' + moment().format('YYYYMM-DDHHmmss')
      },
      spinning1: false,
      spinning2: false,
      formItems: [
        [
          {
            type: 'text',
            label: '报销单号',
            prop: 'code'
          },
          {
            type: 'text',
            label: '创建人',
            prop: 'nickname'
          }
        ],
        [
          {
            type: 'monthPicker',
            label: '资金计划年月',
            prop: 'planTime',
            colspan: 4
          },
          {
            type: 'treeSelect',
            label: '编制资金计划部门',
            prop: 'planDept',
            valueAlias: 'label',
            labelAlias: 'label',
            colspan: 4,
            options: () => this.department
          }
        ],
        [
          {
            type: 'upload',
            label: '附件',
            prop: 'attachment',
            colspan: 8,
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
        planTime: { required: true, message: '请输入', trigger: 'change' },
        planDept: { required: true, message: '请输入', trigger: 'change' }
      },
      fundstableData: [], // 现金流情况表
      department: [], // 部门列表
      merchantList: [], // 客户单位
      fundProjectOut: [], // 支出项目
      fundProjectIn: [], // 收入项目
      contracts: [], // 合同列表
      contracts_Collect: [], // 收款合同列表
      // （一）、项目本金现金流情况表
      fundsColumns: [
        {
          title: '#',
          dataIndex: 'oid',
          align: 'center',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '项目/部门名称',
          dataIndex: 'projectName',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={16} tooltip>
                {record.projectName}
              </Ellipsis>
            )
          }
        },
        {
          title: '项目编号',
          dataIndex: 'projectCode',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={12} tooltip>
                {record.projectCode}
              </Ellipsis>
            )
          }
        },
        {
          title: '支出类型',
          dataIndex: 'secondType',
          align: 'center',
          width: 150,
          customRender: (text, record, index) => {
            if (!this.isEmpty(this.dictMap.seal_project_type_of_direct) && !this.isEmpty(this.dictMap.seal_project_type_of_indirect)) {
              return (
                <a-select
                  v-model={record.secondType}
                  show-search
                  allowClear
                  placeholder="请选择"
                  onChange={value => {
                    const val = this.dictMap.seal_project_type_of_direct.filter(item => item.dictLabel === value)
                    if (this.isEmpty(val)) {
                      record.firstType = '间接费用支出'
                    } else {
                      record.firstType = '直接成本支出'
                    }
                  }}
                >
                  {
                    <a-select-opt-group>
                      <span slot="label" style={{ color: '#FF6A6A' }}>
                        <a-icon type="compass" spin style={{ marginRight: '5px' }} />
                        直接成本支出
                      </span>
                      {this.dictMap.seal_project_type_of_direct.map(item => {
                        return <a-select-option key={item.dictLabel}>{item.dictLabel}</a-select-option>
                      })}
                    </a-select-opt-group>
                  }
                  {
                    <a-select-opt-group>
                      <span slot="label" style={{ color: '#FF6A6A' }}>
                        <a-icon type="compass" spin style={{ marginRight: '5px' }} />
                        间接费用支出
                      </span>
                      {this.dictMap.seal_project_type_of_indirect.map(item => {
                        return <a-select-option key={item.dictLabel}>{item.dictLabel}</a-select-option>
                      })}
                    </a-select-opt-group>
                  }
                </a-select>
              )
            }
          }
        },
        {
          title: '金额(元)',
          dataIndex: 'money',
          align: 'left',
          customRender: (text, record, index) => {
            return <a-input-number v-model={record.money} placeholder="请输入" min={0} precision={2} style={{ width: '150px' }} />
            // return (
            //   <Ellipsis length={8} tooltip>
            //     {record.money}
            //   </Ellipsis>
            // )
          }
        },
        {
          title: '付款单位',
          dataIndex: 'payer',
          align: 'center',
          width: 120,
          customRender: (text, record, index) => {
            if (!this.isEmpty(this.dictMap.seal_project_unit)) {
              return (
                <a-select search style="width:100%" v-model={record.payer} show-search allowClear placeholder="请选择">
                  {this.dictMap.seal_project_unit.map(item => {
                    return <a-select-option key={item.dictLabel}>{item.dictLabel}</a-select-option>
                  })}
                </a-select>
              )
            }
            // return (
            //   <Ellipsis length={10} tooltip>
            //     {record.payer}
            //   </Ellipsis>
            // )
          }
        },
        {
          title: '采购方式',
          dataIndex: 'payMethod',
          align: 'center',
          width: 100,
          customRender: (text, record, index) => {
            if (!this.isEmpty(this.dictMap.seal_project_purchasing_method)) {
              return (
                <a-select style="width:100%" v-model={record.payMethod} show-search allowClear placeholder="请选择">
                  {this.dictMap.seal_project_purchasing_method.map(item => {
                    return <a-select-option key={item.dictLabel}>{item.dictLabel}</a-select-option>
                  })}
                </a-select>
              )
            }
            // return (
            //   <Ellipsis length={10} tooltip>
            //     {record.payMethod}
            //   </Ellipsis>
            // )
          }
        },
        {
          title: '收款单位',
          dataIndex: 'payee',
          align: 'center',
          width: 120,
          customRender: (text, record, index) => {
            return (
              <a-select search style="width:100%" v-model={record.payee} show-search allowClear placeholder="请选择">
                {this.merchantList.map(item => {
                  return <a-select-option key={item.name}>{item.name}</a-select-option>
                })}
              </a-select>
            )
            // return (
            //   <Ellipsis length={10} tooltip>
            //     {record.payee}
            //   </Ellipsis>
            // )
          }
        },
        {
          title: '合同名称',
          dataIndex: 'contractName',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={16} tooltip>
                {record.contractName}
              </Ellipsis>
            )
          }
        },
        {
          title: '合同编号',
          dataIndex: 'contractCode',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={16} tooltip>
                {record.contractCode}
              </Ellipsis>
            )
          }
        },
        {
          title: '合同内容',
          dataIndex: 'contractInfo',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <a-textarea v-model={record.contractInfo} autoSize={{ minRows: 3 }} placeholder="请输入">
                <a-icon slot="suffix" type="edit" />
              </a-textarea>
            )
            // return (
            //   <Ellipsis length={10} tooltip>
            //     {record.contractInfo}
            //   </Ellipsis>
            // )
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <a-textarea v-model={record.remark} autoSize={{ minRows: 3 }} placeholder="请输入">
                <a-icon slot="suffix" type="edit" />
              </a-textarea>
            )
            // return (
            //   <Ellipsis length={10} tooltip>
            //     {record.remark}
            //   </Ellipsis>
            // )
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      fundsLoadData: param => {
        return new Promise(resolve => {
          resolve(param)
        }).then(param => {
          return {
            data: this.fundstableData
          }
        })
      },
      // 二）、项目收款情况表
      CollectMoneyTableData: [],
      CollectMoneyColumns: [
        {
          title: '#',
          dataIndex: 'oid',
          align: 'center',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '项目/部门',
          dataIndex: 'projectName',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={16} tooltip>
                {record.projectName}
              </Ellipsis>
            )
          }
        },
        {
          title: '项目编号',
          dataIndex: 'projectCode',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={12} tooltip>
                {record.projectCode}
              </Ellipsis>
            )
          }
        },
        {
          title: '本月开票金额(元)',
          dataIndex: 'thisMoney',
          align: 'left',
          customRender: (text, record, index) => {
            return <a-input-number v-model={record.thisMoney} placeholder="请输入" min={0} precision={2} style={{ width: '150px' }} />
            // return (
            //   <Ellipsis length={8} tooltip>
            //     {record.thisMoney}
            //   </Ellipsis>
            // )
          }
        },
        {
          title: '所属公司',
          dataIndex: 'company',
          align: 'center',
          customRender: (text, record, index) => {
            if (!this.isEmpty(this.dictMap.seal_project_unit)) {
              return (
                <a-select v-model={record.company} show-search allowClear placeholder="请选择">
                  {this.dictMap.seal_project_unit.map(item => {
                    return <a-select-option key={item.dictLabel}>{item.dictLabel}</a-select-option>
                  })}
                </a-select>
              )
            }
            // return (
            //   <Ellipsis length={10} tooltip>
            //     {record.company}
            //   </Ellipsis>
            // )
          }
        },
        {
          title: '合同名称',
          dataIndex: 'contractName',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={16} tooltip>
                {record.contractName}
              </Ellipsis>
            )
          }
        },
        {
          title: '合同编号',
          dataIndex: 'contractCode',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={16} tooltip>
                {record.contractCode}
              </Ellipsis>
            )
          }
        },
        {
          title: '合同金额(元)',
          dataIndex: 'contractMoney',
          align: 'left',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={10} tooltip>
                {record.contractMoney}
              </Ellipsis>
            )
          }
        },
        {
          title: '计划收款比例(%)',
          dataIndex: 'inPercent',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input-number v-model={record.inPercent} placeholder="请输入" min={0} precision={2} style={{ width: '150px' }} />
          }
        },
        {
          title: '计划收款金额(元)',
          dataIndex: 'inMoney',
          align: 'left',
          customRender: (text, record, index) => {
            return <a-input-number v-model={record.inMoney} placeholder="请输入" min={0} precision={2} style={{ width: '150px' }} />
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <a-textarea v-model={record.remark} autoSize={{ minRows: 3 }} placeholder="请输入">
                <a-icon slot="suffix" type="edit" />
              </a-textarea>
            )
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      CollectMoneyLoadData: param => {
        return new Promise(resolve => {
          resolve(param)
        }).then(param => {
          return {
            data: this.CollectMoneyTableData
          }
        })
      },
      // 导入fund_Excel
      fund_importExcelData: {
        compProps: {
          props: {
            name: 'Excelfile',
            multiple: false,
            showUploadList: false,
            accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
            // 上传之前回调，判断上传类型
            beforeUpload: file => {
              this.spinning1 = true
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
                this.fundstableData = []
                this.spinning1 = false
                importfile(file.file, outdata => {
                  const da = [...outdata]
                  const arr = []
                  da.map(v => {
                    const obj = {}
                    obj.oid = uuidv4()
                    obj.projectCode = v['项目编号']
                    obj.projectName = v['项目/部门名称']
                    obj.secondType = v['支出类型']
                    obj.money = v['金额(元)']
                    obj.payer = v['付款单位']
                    obj.payMethod = v['采购方式']
                    obj.payee = v['收款单位']
                    obj.contractCode = v['合同编号']
                    obj.contractName = v['合同名称']
                    obj.contractInfo = v['合同内容']
                    obj.remark = v['备注']
                    arr.push(obj)
                  })
                  this.fund_import_excel = arr // excel数据
                  this.fundstableData = this.fund_import_excel
                  this.$refs.fundsTable.refresh(true)
                })
              }
            }
          }
        }
      },
      fund_import_excel: [],
      // 导入 Collect_importExcel
      Collect_importExcelData: {
        compProps: {
          props: {
            name: 'Excelfile',
            multiple: false,
            showUploadList: false,
            accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel',
            // 上传之前回调，判断上传类型
            beforeUpload: file => {
              this.spinning2 = true
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
                this.spinning2 = false
                // 核心函数
                importfile(file.file, outdata => {
                  /* （一） */
                  const da = [...outdata]
                  const arr = []
                  da.map(v => {
                    const obj = {}
                    obj.oid = uuidv4()
                    obj.projectCode = v['项目编号']
                    obj.projectName = v['项目/部门名称']
                    obj.thisMoney = v['本月开票金额(元)']
                    obj.company = v['所属公司']
                    obj.contractCode = v['合同编号']
                    obj.contractName = v['合同名称']
                    obj.contractMoney = v['合同金额']
                    obj.inPercent = v['计划收款比例(%)']
                    obj.inMoney = v['计划收款金额(元)']
                    obj.remark = v['备注']
                    arr.push(obj)
                  })
                  this.Collect_import_excel = arr
                  this.CollectMoneyTableData = this.Collect_import_excel
                  this.$refs.Collect_MoneyTable.refresh(true)
                })
              }
            }
          }
        }
      },
      Collect_import_excel: [],
      // 解析之后的excel数据
      outdata: []
    }
  },
  methods: {
    // 提交
    handleSubmit() {
      let FundVo = {}
      FundVo = { ...this.formData }
      FundVo.sealFundOutcomes = this.$refs.fundsTable.localDataSource
      FundVo.sealFundIncomes = this.$refs.Collect_MoneyTable.localDataSource
      FundVo.planTime = FundVo.planTime.format('yyyy-MM-DD HH:mm:ss')

      if (this.isUpdate && !this.isEmpty(this.updateRow)) {
        updateFund(FundVo).then(res => {
          this.$message.success('修改成功！')
          this.$emit('ok')
          this.$emit('close')
        })
      } else {
        addFund(FundVo).then(res => {
          this.$message.success('保存成功!')
          this.$emit('ok')
          this.$emit('close')
        })
      }
    },
    handleCancel() {
      this.$emit('cancel')
      this.$emit('close')
    },
    // 资金新增明细行
    addLine() {
      let status = true
      if (this.fundstableData.length > 0) {
        const value = this.fundstableData.map(({ projectName, secondType, money }) => ({ projectName, secondType, money }))
        value.map(item => {
          for (const key in item) {
            if (!item[key]) {
              status = false
              this.$message.error('请填写完整,在添加新行!')
              return
            }
          }
        })
        if (status) {
          const newValue = {
            projectName: '',
            secondType: '',
            money: '',
            oid: uuidv4()
          }
          this.fundstableData.push(newValue)
          this.$nextTick(() => {
            this.$refs.fundsTable.refresh(true)
          })
        }
      } else {
        const newValue = {
          projectName: '',
          secondType: '',
          money: '',
          oid: uuidv4()
        }
        this.fundstableData.push(newValue)
        this.$nextTick(() => {
          this.$refs.fundsTable.refresh(true)
        })
      }
    },
    // 资金删除明细行
    handleDelete(oid, id) {
      if (id) {
        this.fundstableData = this.fundstableData.filter(item => {
          return item.id !== id
        })
        this.$refs.fundsTable.refresh(true)
      }
      if (oid) {
        this.fundstableData = this.fundstableData.filter(item => {
          return item.oid !== oid
        })
        this.$refs.fundsTable.refresh(true)
      }
    },
    // 收款新增明细
    CollectMoneyAddLine() {
      let status = true
      if (this.CollectMoneyTableData.length > 0) {
        const value = this.CollectMoneyTableData.map(({ projectName, thisMoney }) => ({ projectName, thisMoney }))
        value.map(item => {
          for (const key in item) {
            if (!item[key]) {
              status = false
              this.$message.error('请填写完整,在添加新行!')
              return
            }
          }
        })
        if (status) {
          const newValue = {
            projectName: '',
            thisMoney: '',
            oid: uuidv4()
          }
          this.CollectMoneyTableData.push(newValue)
          this.$nextTick(() => {
            this.$refs.Collect_MoneyTable.refresh(true)
          })
        }
      } else {
        const newValue = {
          projectName: '',
          thisMoney: '',
          oid: uuidv4()
        }
        this.CollectMoneyTableData.push(newValue)
        this.$nextTick(() => {
          this.$refs.Collect_MoneyTable.refresh(true)
        })
      }
    },
    // 收款删除明细行
    CollectMoneyhandleDelete(oid, id) {
      if (id) {
        this.CollectMoneyTableData = this.CollectMoneyTableData.filter(item => {
          return item.id !== id
        })
        this.$refs.Collect_MoneyTable.refresh(true)
      }
      if (oid) {
        this.CollectMoneyTableData = this.CollectMoneyTableData.filter(item => {
          return item.oid !== oid
        })
        this.$refs.Collect_MoneyTable.refresh(true)
      }
    },
    // 下载项目本金excel模板
    download_fundsTable() {
      downloadUtil.resource('/profile/template/资金计划支出模板.xlsx')
    },
    // 下载收款excel模板
    download_Collect() {
      downloadUtil.resource('/profile/template/资金计划收入模块.xlsx')
    }
  },
  created() {
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formData = { ...this.updateRow, planTime: moment(this.updateRow.planTime) }
      this.fundstableData = [...this.updateRow.sealFundOutcomes]
      this.CollectMoneyTableData = [...this.updateRow.sealFundIncomes]
    }
  },
  mounted() {
    // 查询字典
    this.dictKeys.forEach(key => {
      this.getDicts(key).then(res => {
        this.$set(this.dictMap, key, res.data)
      })
    })
    // 部门列表
    allTree().then(res => {
      this.department = res.data
    })
    // 客户单位
    listMerchant().then(res => {
      this.merchantList = res.rows
    })
    // 支出项目查询
    fundProjectOut({ out: 'out' }).then(({ data }) => {
      this.fundProjectOut = data
    })
    // 收入项目查询
    fundProjectIn({ in: 'in' }).then(({ data }) => {
      this.fundProjectIn = data
    })
  }
}
</script>
<style lang="less" scoped>
.title {
  font-weight: 700;
  text-align: center;
  display: block;
  color: #000;
  font-size: 20px;
}
// @import '/src/assets/style/scroll.less';
.prompt {
  overflow: hidden;
  white-space: nowrap; /*规定文本不进行换行*/
  text-overflow: ellipsis; /*当对象内文本溢出时显示省略标记（...）*/
  margin: 5px 0;
  color: rgb(255, 30, 0);
  font-size: 18px;
  font-family: cursive;
  border-radius: 25px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}
</style>
