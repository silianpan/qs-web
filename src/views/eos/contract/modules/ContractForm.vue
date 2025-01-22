<!-- 合同管理表单 -->
<template>
  <div>
    <a-steps class="contract-step" :current="current">
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>
    <s-form v-show="current === 0" ref="ruleForm" single :queryDictKeys="dictKeys" :formTitle="'合同申请单'" :formItems="formItems" :formData="formData" :rules="formRules">
      <!-- 合同付款阶段 -->
    </s-form>
    <div v-show="current === 1" class="s-mt-2 s-mb-2">
      <a-button type="primary" ghost icon="plus" @click="addLine" style="margin: 10px 0">{{ '新增' + stageTypeName + '阶段' }}</a-button>
      <div class="border">
        <s-table ref="table" size="default" rowKey="name" :columns="columns" :data="loadData" :showPagination="false">
          <span slot="action" slot-scope="text, record">
            <a-popconfirm title="确认删除该行吗?" @confirm="handleDelete(record)" ok-text="确认" cancel-text="取消">
              <a href="javascript:;" style="color: red">删除</a>
            </a-popconfirm>
          </span>
        </s-table>
      </div>
    </div>
    <div v-show="current === 2" style="margin-bottom: 40px">
      <a-radio-group class="template-switch" v-model="templateType" default-value="1">
        <a-radio-button :value="1"> 合同物料采购清单 </a-radio-button>
        <a-radio-button :value="2"> 合同工程量清单 </a-radio-button>
      </a-radio-group>

      <div v-show="templateType === 1">
        <h2 class="title">合同物料采购清单</h2>
        <!-- <a-button ghost type="primary" icon="plus" @click="addLine" style="margin-right:20px">新增项</a-button> -->
        <!-- 导入 -->
        <ImportExcel :uploadData="contract_importExcelData" style="margin-right: 20px" />
        <a-button type="primary" ghost icon="download" @click="download_contractDetailsTable">下载模板</a-button>

        <a-spin :spinning="spinning1" style="margin-top: 10px">
          <s-table ref="fundsTable" size="default" :rowKey="record => (record.id ? record.id : record.oid)" :columns="contractDetailsColumns" :data="contractDetailsLoadData" :showPagination="false">
            <span slot="action" slot-scope="text, record">
              <a-popconfirm v-if="materialProcurement.length" title="确认删除该行吗?" @confirm="() => handleDeleteMaterialProcurement(record.oid, record.id)" ok-text="确认" cancel-text="取消">
                <a href="javascript:;" style="color: red">删除</a>
              </a-popconfirm>
            </span>
          </s-table>
        </a-spin>
      </div>
      <div v-show="templateType === 2">
        <h2 class="title">合同工程量清单</h2>
        <!-- <a-button ghost type="primary" icon="plus" @click="addLine" style="margin-right:20px">新增项</a-button> -->
        <!-- 导入 -->
        <ImportExcel :uploadData="contract_importExcelData2" style="margin-right: 20px" />
        <a-button type="primary" ghost icon="download" @click="download_contractDetailsTable2">下载模板</a-button>

        <a-spin :spinning="spinning2" style="margin-top: 10px">
          <s-table ref="fundsTable2" size="default" :rowKey="record => (record.id ? record.id : record.oid)" :columns="contractDetailsColumns2" :data="contractDetailsLoadData2" :showPagination="false">
            <span slot="action" slot-scope="text, record">
              <a-popconfirm v-if="billQuantities.length" title="确认删除该行吗?" @confirm="() => handleDeleteBillQuantities(record.oid, record.id)" ok-text="确认" cancel-text="取消">
                <a href="javascript:;" style="color: red">删除</a>
              </a-popconfirm>
            </span>
          </s-table>
        </a-spin>
      </div>
    </div>
    <div class="steps-action">
      <a-button v-if="current > 0" style="margin-left: 8px" @click="current--"> 上一步 </a-button>
      <a-button v-if="current < steps.length - 1" type="primary" @click="current++"> 下一步 </a-button>
      <a-button v-if="!isReApplay && current === steps.length - 1" type="primary" @click="handleSubmit"> 保存草稿 </a-button>
      <a-button v-if="!isReApplay && current === steps.length - 1" ghost type="primary" @click="handleApply"> 提交申请 </a-button>
    </div>
  </div>
</template>

<script lang="jsx">
import moment from 'moment'
import downloadUtil from '/src/utils/common/download.js'
import defaultSettings from '/src/config/defaultSettings.js'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { listMerchant } from '/src/api/eos/merchant/merchant.js'
import { treePlanProject, treeSelect } from '/src/api/eos/project/project.js'
import { addContract, updateContract, getContract, delContractDetailList, submitApply } from '/src/api/eos/contract/contract.js'
import { delStage } from '/src/api/eos/contract/stage.js'
import { STable, SForm, ImportExcel, Ellipsis } from '/src/components/index.js'
import { handleMerchantEdit } from '/src/views/eos/config/busUtil.js'
import { uuidv4 } from '/src/utils/common/util.js'
import { importfile } from '/src/utils/common/excel.js'
import { allTree } from '../../../../api/system/dept'
import { getByUsername } from '../../../../api/system/user'

export default {
  name: 'Contract',
  components: {
    STable,
    SForm,
    ImportExcel
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
    isReApplay: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 阶段收/付款名称
    stageTypeName() {
      if (this.formData.type === undefined || this.formData.type === null) {
        return '收/付款'
      }
      return this.formData.type === '收入合同' ? '收款' : '付款'
    },
    steps() {
      return this.formData.type === '收入合同'
        ? [
            {
              title: '合同基本信息'
            },
            {
              title: '收款阶段'
            },
            {
              title: '合同清单'
            }
          ]
        : [
            {
              title: '合同基本信息'
            },
            {
              title: '付款阶段'
            },
            {
              title: '合同清单'
            }
          ]
    }
  },
  data() {
    return {
      current: 0,
      templateType: 1,
      // 合同阶段列
      columns: [
        {
          title: '#',
          dataIndex: 'sn',
          align: 'center',
          customRender: (text, record) => {
            return <a-input-number v-model={record.sn} placeholder="请输入" min={0} precision={0} />
          }
        },
        {
          title: '阶段名称',
          dataIndex: 'name',
          align: 'center',
          width: 160,
          customRender: (text, record) => {
            return (
              <a-input v-model={record.name} placeholder="请输入">
                <a-icon slot="suffix" type="edit" />
              </a-input>
            )
          }
        },
        {
          title: '阶段描述',
          dataIndex: 'content',
          align: 'center',
          customRender: (text, record) => {
            return (
              <a-textarea v-model={record.content} autoSize={{ minRows: 3 }} placeholder="请输入">
                <a-icon slot="suffix" type="edit" />
              </a-textarea>
            )
          }
        },
        {
          title: '收付款金额(元)',
          dataIndex: 'money',
          align: 'left',
          customRender: (text, record, index) => {
            return (
              <a-input-number
                onBlur={() => {
                  if (this._.isNil(this.formData.sum) || this.formData.sum === 0) {
                    this.$message.error('请填写合同金额')
                    return
                  }
                  this.contractStages[index].percent = (record.money / this.formData.sum) * 100
                }}
                v-model={record.money}
                placeholder="请输入"
                min={0}
                precision={2}
              />
            )
          }
        },
        {
          title: '收付款比例(%)',
          dataIndex: 'percent',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <a-input-number
                onBlur={() => {
                  if (this._.isNil(this.formData.sum) || this.formData.sum === 0) {
                    this.$message.error('请填写合同金额')
                    return
                  }
                  this.contractStages[index].money = (record.percent / 100) * this.formData.sum
                }}
                v-model={record.percent}
                placeholder="请输入"
                min={0}
                precision={2}
              />
            )
          }
        },
        {
          title: '截止日期',
          dataIndex: 'endDate',
          align: 'center',
          width: 260,
          customRender: (text, record, index) => {
            return text ? (
              <a-date-picker value={moment(text)} onChange={date => (record.endDate = date.format('YYYY-MM-DD HH:mm:ss'))} placeholder="截止日期" />
            ) : (
              <a-date-picker onChange={date => (record.endDate = date.format('YYYY-MM-DD HH:mm:ss'))} placeholder="截止日期" />
            )
          }
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 合同阶段
      contractStages: [],
      loadData: param => {
        if (this.isUpdate) {
          return getContract(this.updateRow?.id).then(res => {
            this.contractStages = res.data.sealContractStageList
            this.materialProcurement = res.data.sealAmountLists.filter(item => item.type === '物料')
            this.billQuantities = res.data.sealAmountLists.filter(item => item.type === '工程量')
            this.$refs.fundsTable.refresh(true)
            this.$refs.fundsTable2.refresh(true)
            return {
              data: this.contractStages,
              totalCount: this.contractStages.length
            }
          })
        } else {
          return new Promise(resolve => resolve(param)).then(_ => {
            return {
              data: this.contractStages,
              totalCount: this.contractStages.length
            }
          })
        }
      },
      dictKeys: [dictConfig.CONTRACT_TYPE],
      merchantList: [],
      projectList: [],
      formData: {
        createBy: this.$store.getters.userName,
        nickname: this.$store.getters.nickname,
        code: defaultSettings.codePrefix + '-HT-' + moment().format('YYYYMM-DDHHmmss'),
        type: '收入合同',
        contractProp: '项目建设'
      },
      // 接收合同性质来判断
      tempProp: '',
      chooseDeptObj: {
        type: 'treeSelect',
        prop: 'deptId',
        label: '所属部门',
        colspan: 4,
        valueAlias: 'id',
        labelAlias: 'label',
        options: () => this.belongDeptList
      },
      formItems: [
        [
          {
            type: 'text',
            prop: 'code',
            label: '合同编号',
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
            prop: 'contractProp',
            label: '合同性质',
            options: () => [
              { label: '项目建设', value: '项目建设' },
              { label: '公司运营', value: '公司运营' }
            ],
            valueAlias: 'value',
            labelAlias: 'label',
            compProps: {
              on: {
                change: e => {
                  this.formData = {
                    createBy: this.$store.getters.userName,
                    nickname: this.$store.getters.nickname,
                    code: this.formData.code,
                    type: '收入合同',
                    contractProp: e.target.value
                  }
                  if (e.target.value === '公司运营') {
                    this.formItems[3][0] = this.formItems[3][1]
                    this.formItems[3][1] = this.chooseDeptObj
                    getByUsername({ userName: this.$store.getters.userName }).then(res => {
                      this.$set(this.formData, 'deptId', res.data.dept.deptId)
                    })
                  } else {
                    this.formItems[3][1] = this.formItems[3][0]
                    this.formItems[3][0] = {
                      type: 'treeSelect',
                      label: '所属项目',
                      prop: 'projectId',
                      options: () => this.projectList,
                      keyAlias: 'id',
                      titleAlias: 'label',
                      valueAlias: 'id',
                      colspan: 4
                    }
                  }
                }
              }
            }
          },
          {}
        ],
        [
          {
            type: 'input',
            label: '合同名称',
            prop: 'name',
            colspan: 4
          },
          {
            type: 'radio',
            label: '合同类型',
            prop: 'type',
            options: () => [
              { label: '收入合同', value: '收入合同' },
              { label: '支出合同', value: '支出合同' }
            ],
            valueAlias: 'value',
            labelAlias: 'label',
            defaultValue: () => this.formData.type,
            colspan: 4
          }
        ],
        [
          {
            type: 'treeSelect',
            label: '所属项目',
            prop: 'projectId',
            options: () => this.projectList,
            keyAlias: 'id',
            titleAlias: 'label',
            valueAlias: 'id',
            colspan: 4
          },
          {
            type: 'inputNumber',
            label: '合同金额(元)',
            prop: 'sum',
            colspan: 4,
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
            type: 'select',
            prop: 'firstParty',
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
          {
            type: 'select',
            prop: 'secondParty',
            label: '乙方',
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
          }
        ],
        [
          {
            type: 'datePicker',
            prop: 'signingDate',
            label: '签订日期',
            colspan: 4
          },
          {
            type: 'upload',
            prop: 'attachment',
            label: '附件',
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
          }
        ],
        [
          {
            type: 'inputTextArea',
            prop: 'remark',
            label: '合同描述',
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
        code: { required: true, message: '请输入合同编号', trigger: 'blur' },
        createBy: { required: true, message: '请输入申请人', trigger: 'blur' },
        name: { required: true, message: '请输入', trigger: 'blur' },
        type: { required: true, message: '请选择合同类型', trigger: 'change' },
        projectId: { required: true, message: '请选择所属项目', trigger: 'change' },
        deptId: { required: true, message: '请选择', trigger: 'change' },
        // sum: { validator: VALIDATE_NE_INT, trigger: 'blur' },
        sum: { required: true, message: '请输入', trigger: 'blur' },
        firstParty: { required: true, message: '请选择', trigger: 'change' },
        secondParty: { required: true, message: '请选择', trigger: 'change' },
        contractProp: { required: true, message: '请选择', trigger: 'change' }
      },
      contract_importExcelData: {
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
                this.materialProcurement = []
                this.spinning1 = false
                importfile(file.file, outdata => {
                  const da = [...outdata]
                  const arr = []
                  da.map(v => {
                    const obj = {}
                    obj.oid = uuidv4()
                    obj.type = '物料'
                    obj.name = v['材料名称']
                    obj.description = v['备注']
                    obj.unit = v['单位']
                    obj.amount = v['数量']
                    obj.price = v['参考价格']
                    obj.totalPrice = v['小计']
                    obj.spec = v['材料规格']
                    arr.push(obj)
                  })
                  this.fund_import_excel = arr // excel数据
                  for (let i = 0; i < this.fund_import_excel.length; i++) {
                    if (
                      this.isEmpty(this.fund_import_excel[i].type) ||
                      this.isEmpty(this.fund_import_excel[i].name) ||
                      this.isEmpty(this.fund_import_excel[i].unit) ||
                      this.isEmpty(this.fund_import_excel[i].amount) ||
                      this.isEmpty(this.fund_import_excel[i].price)
                    ) {
                      return this.$message.error('导入的项目必须完整填写类型、名称、单位、数量和单价!')
                    }
                  }
                  this.materialProcurement = this.materialProcurement.concat(this.fund_import_excel)
                  this.$refs.fundsTable.refresh(true)
                })
              }
            }
          }
        }
      },
      contract_importExcelData2: {
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
                this.billQuantities = []
                this.spinning2 = false
                importfile(file.file, outdata => {
                  const da = [...outdata]
                  const arr = []
                  da.map(v => {
                    const obj = {}
                    obj.oid = uuidv4()
                    obj.type = '工程量'
                    obj.name = v['工程量科目']
                    obj.description = v['备注']
                    obj.unit = v['单位']
                    obj.amount = v['合同数量']
                    obj.price = v['执行单价']
                    obj.totalPrice = v['总价']
                    arr.push(obj)
                  })
                  this.fund_import_excel = arr // excel数据
                  for (let i = 0; i < this.fund_import_excel.length; i++) {
                    if (
                      this.isEmpty(this.fund_import_excel[i].type) ||
                      this.isEmpty(this.fund_import_excel[i].name) ||
                      this.isEmpty(this.fund_import_excel[i].unit) ||
                      this.isEmpty(this.fund_import_excel[i].amount) ||
                      this.isEmpty(this.fund_import_excel[i].price)
                    ) {
                      return this.$message.error('导入的项目必须完整填写类型、名称、单位、数量和单价!')
                    }
                  }
                  this.billQuantities = this.billQuantities.concat(this.fund_import_excel)
                  this.$refs.fundsTable2.refresh(true)
                })
              }
            }
          }
        }
      },
      spinning1: false,
      spinning2: false,
      contractDetailsColumns: [
        {
          title: '#',
          dataIndex: 'oid',
          align: 'center',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '清单类型',
          dataIndex: 'type',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={16} tooltip>
                {record.type}
              </Ellipsis>
            )
          }
        },
        {
          title: '名字',
          dataIndex: 'name',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={10} tooltip>
                {record.name}
              </Ellipsis>
            )
          }
        },
        {
          title: '描述',
          dataIndex: 'description',
          align: 'center',
          width: 150,
          customRender: (text, record) => {
            return (
              <Ellipsis length={16} tooltip>
                {record.description}
              </Ellipsis>
            )
          }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={16} tooltip>
                {record.unit}
              </Ellipsis>
            )
          }
        },
        {
          title: '数量',
          dataIndex: 'amount',
          align: 'center',
          customRender: (text, record) => {
            return (
              <Ellipsis length={10} tooltip>
                {record.amount}
              </Ellipsis>
            )
          }
        },
        {
          title: '单价',
          dataIndex: 'price',
          align: 'center',
          customRender: (text, record) => {
            return (
              <Ellipsis length={10} tooltip>
                {record.price}
              </Ellipsis>
            )
          }
        },
        {
          title: '总价',
          dataIndex: 'totalPrice',
          align: 'center'
        },
        {
          title: '规格',
          dataIndex: 'spec',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={10} tooltip>
                {record.spec}
              </Ellipsis>
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
      contractDetailsColumns2: [
        {
          title: '#',
          dataIndex: 'oid',
          align: 'center',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '清单类型',
          dataIndex: 'type',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={16} tooltip>
                {record.type}
              </Ellipsis>
            )
          }
        },
        {
          title: '名字',
          dataIndex: 'name',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={16} tooltip>
                {record.name}
              </Ellipsis>
            )
          }
        },
        {
          title: '描述',
          dataIndex: 'description',
          align: 'center',
          width: 150,
          customRender: (text, record) => {
            return (
              <Ellipsis length={16} tooltip>
                {record.description}
              </Ellipsis>
            )
          }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <Ellipsis length={16} tooltip>
                {record.unit}
              </Ellipsis>
            )
          }
        },
        {
          title: '数量',
          dataIndex: 'amount',
          align: 'center',
          customRender: (text, record) => {
            return (
              <Ellipsis length={10} tooltip>
                {record.amount}
              </Ellipsis>
            )
          }
        },
        {
          title: '单价',
          dataIndex: 'price',
          align: 'center',
          customRender: (text, record) => {
            return (
              <Ellipsis length={10} tooltip>
                {record.price}
              </Ellipsis>
            )
          }
        },
        {
          title: '总价',
          dataIndex: 'totalPrice',
          align: 'center'
        },
        {
          title: '操作',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      materialProcurement: [],
      billQuantities: [],
      contractDetailsLoadData: param => {
        return new Promise(resolve => {
          resolve(param)
        }).then(param => {
          return {
            data: this.materialProcurement
          }
        })
      },
      contractDetailsLoadData2: param => {
        return new Promise(resolve => {
          resolve(param)
        }).then(param => {
          return {
            data: this.billQuantities
          }
        })
      }
    }
  },
  created() {
    this.getMerchantList()
    this.getListDept()

    treePlanProject({ state: '0' }).then(res => {
      this.projectList = res.data
    })
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formData = {
        ...this.updateRow,
        signingDate: this.updateRow.signingDate ? moment(this.updateRow.signingDate) : null,
        startDate: this.updateRow.startDate ? moment(this.updateRow.startDate) : null,
        endDate: this.updateRow.endDate ? moment(this.updateRow.endDate) : null,
        // projectId: this.updateRow.sealProject ? this.updateRow.sealProject.id : null,
        projectId: this.updateRow.projectId,
        nickname: this.updateRow.sysUser ? this.updateRow.sysUser.nickName : this.$store.getters.nickname
      }
      if (this.updateRow.contractProp === '公司运营') {
        this.formItems[3][0] = this.formItems[3][1]
        this.formItems[3][1] = this.chooseDeptObj
      }
      // if (this.updateRow.sealContractStageList) {
      //   const css = [...this.updateRow.sealContractStageList]
      //   css.forEach(item => {
      //     item.endDate = item.endDate ? item.endDate.format('YYYY-MM-DD HH:mm:ss') : null
      //   })
      //   this.contractStages = css
      // }
    }
    getByUsername({ userName: this.$store.getters.userName }).then(res => {
      this.$set(this.formData, 'deptId', res.data.dept.deptId)
    })
  },
  methods: {
    getDate() {
      this.$refs.table.refresh()
    },
    getMerchantList() {
      listMerchant().then(res => {
        this.merchantList = res.rows
      })
    },
    // 新增明细行
    addLine() {
      const len = this.contractStages.length + 1
      this.contractStages.push({
        sn: len,
        name: '阶段' + len,
        content: '',
        money: 0,
        percent: 0
      })
    },
    // 删除明细行
    handleDelete(row) {
      if (row.id) {
        delStage(row.id).then(res => {
          this.$message.success(res.msg)
          this.filterAndRefresh(row.sn)
        })
      } else {
        this.filterAndRefresh(row.sn)
      }
    },
    handleDeleteMaterialProcurement(oid, id) {
      if (id) {
        this.materialProcurement = this.materialProcurement.filter(item => {
          return item.id !== id
        })
        delContractDetailList(id).then(res => {
          this.$refs.fundsTable.refresh(true)
        })
      }
      if (oid) {
        this.materialProcurement = this.materialProcurement.filter(item => {
          return item.oid !== oid
        })
        this.$refs.fundsTable.refresh(true)
      }
    },
    handleDeleteBillQuantities(oid, id) {
      if (id) {
        this.billQuantities = this.billQuantities.filter(item => {
          return item.id !== id
        })
        delContractDetailList(id).then(res => {
          this.$refs.fundsTable.refresh(true)
        })
      }
      if (oid) {
        this.billQuantities = this.billQuantities.filter(item => {
          return item.oid !== oid
        })
        this.$refs.fundsTable.refresh(true)
      }
    },
    // 过滤sn和刷新
    filterAndRefresh(sn) {
      this.contractStages = this.$refs.table.localDataSource.filter(item => {
        return item.sn !== sn
      })
      this.$refs.table.refresh(true)
    },
    async handleSubmit(callbackFunc) {
      this.$refs.ruleForm.$refs.ruleForm.validate(async valid => {
        if (valid) {
          const fd = { ...this.formData }
          fd.signingDate && (fd.signingDate = fd.signingDate.format('YYYY-MM-DD HH:mm:ss'))
          fd.startDate && (fd.startDate = fd.startDate.format('YYYY-MM-DD HH:mm:ss'))
          fd.endDate && (fd.endDate = fd.endDate.format('YYYY-MM-DD HH:mm:ss'))
          const csList = [...this.contractStages]
          fd.sealContractStageList = csList
          fd.sealAmountLists = this.materialProcurement.concat(this.billQuantities)
          // 更新或添加
          let res = null
          try {
            if (this.isUpdate && !this.isEmpty(fd.id)) {
              res = await updateContract(fd)
            } else {
              res = await addContract(fd)
            }
            if (callbackFunc instanceof Function) {
              callbackFunc(res)
            } else {
              this.$message.success(res.msg, 3)
              this.$emit('ok')
              this.$emit('close')
            }
          } catch {
            this.$refs.ruleForm.loading = false
            this.$refs.ruleForm.saveBtnLoading = false
          }
        } else {
          this.$message.error('请填写完整')
        }
      })
    },
    // 直接提交申请
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
        this.$refs.ruleForm.loading = false
        this.$refs.ruleForm.saveBtnLoading = false
      }
    },
    handleCancel() {
      this.$emit('close')
    },
    download_contractDetailsTable() {
      downloadUtil.resource('/profile/template/合同物料采购清单模板.xlsx')
    },
    download_contractDetailsTable2() {
      downloadUtil.resource('/profile/template/合同工程量清单模板.xlsx')
    },
    getListDept() {
      allTree().then(res => {
        this.belongDeptList = res.data
      })
    }
  }
}
</script>
<style lang="less" scoped>
.contract-step {
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
