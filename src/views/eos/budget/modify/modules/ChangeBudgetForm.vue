<template>
  <!-- 预算表单 -->
  <s-form ref="formTable" ok single :okText="'保存表单'" :queryDictKeys="dictKeys" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel">
    <!-- 数据表格 -->
    <template v-slot:footer>
      <div v-show="sumtotalListShow" class="s-mt-2 s-mb-2" style="margin-top: 10px">
        <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :showPagination="false"> </s-table>
      </div>
      <div v-show="sumtotalListShow2" class="s-mt-2 s-mb-2" style="margin-top: 10px">
        <p style="color: red; font-size: 18px">
          <span style="color: DodgerBlue; font-size: 18px; font-weight: bold">预算总金额：{{ toThousandFilter(sumtotal) }}</span>
        </p>
        <s-table ref="table2" size="default" rowKey="id" :columns="columns2" :data="loadData2" :showPagination="false"> </s-table>
      </div>
    </template>
  </s-form>
</template>

<script lang="jsx">
import moment from 'moment'
import { BigType } from '/src/api/eos/budget/type.js'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { SForm, STable } from '/src/components/index.js'
import { saveBudgetModify } from '/src/api/eos/budget/budgetModify.js'
import { treePlanProject } from '/src/api/eos/project/project.js'
import { budgetPass, budgetPassOne } from '/src/api/eos/budget/apply.js'

import { listType } from '/src/api/eos/budget/type.js'
import {allTree} from '../../../../../api/system/dept'
import {getByUsername} from '../../../../../api/system/user'

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
  name: 'ChangeBudgetForm',
  components: {
    SForm,
    STable
  },
  data() {
    return {
      sumtotal: 0,
      sumtotalListShow: false,
      sumtotalListShow2: false,
      dictKeys: [dictConfig.PROJECT_BUDGET_TYPE],
      dictMap: {},
      // 预算大类
      budgetTypeOptions: [],
      // 年份选择
      yearSelect: [],
      // 预算申请单
      budgetApply: {},
      // 表单数据
      formData: {
        createBy: this.$store.getters.userName,
        nickname: this.$store.getters.nickname,
        code: 'BGSQ' + moment().format('YYYYMM-DDHHmmss'),
        budgetType: '项目预算'
      },
      // 项目列表
      projectList: [],
      // 预算类型
      BudgetTypeList: [],
      yearSelectObj: {
        type: 'select',
        prop: 'deptTime',
        label: '变更年份',
        valueAlias: 'time',
        labelAlias: 'time',
        colspan: 12,
        options: () => this.yearSelect,
        compProps: {
          props: {
            disabled: !this.isEmpty(this.updateRow)
          },
          on: {
            select: value => {
              if (this.formData.budgetType === '部门预算'){
                delete this.formData.type
                delete this.formData.changeBudget
                delete this.formData.remark
                delete this.formData.changeReason
                this.sumtotalListShow = false
              }
            }
          }
        }
      },
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
          },
          on: {
            select: value => {
              if(this.formData.budgetType === '部门预算'){
                delete this.formData.deptTime
                delete this.formData.type
                delete this.formData.changeBudget
                delete this.formData.remark
                delete this.formData.changeReason
                this.sumtotalListShow = false
              }
            }
          }
        }
      },
      ysdlObj: {
        type: 'select',
        prop: 'type',
        label: '预算大类',
        valueAlias: 'type',
        labelAlias: 'type',
        colspan: 12,
        options: () => this.budgetTypeOptions,
        compProps: {
          on: {
            select: e => {
              if (this.formData.budgetType === '项目预算') {
                // if (!this.formData.type) {
                //   return this.$message.warning('请选择预算大类')
                // }
                this.mainTypeList = []
                this.budgetApply = {}
                this.$refs.table.refresh()
                this.mainTypeList2 = []
                this.sumtotalListShow = false
                this.sumtotalListShow2 = false
                this.$refs.table2.refresh()

                this.formData = {
                  createBy: this.$store.getters.userName,
                  nickname: this.$store.getters.nickname,
                  code: 'BGSQ' + moment().format('YYYYMM-DDHHmmss'),
                  budgetType: this.formData.budgetType,
                  type: this.formData.type,
                  projectId: this.formData.projectId,
                  deptTime: this.formData.deptTime,
                }
                // delete this.formData.changeBudget
                // 请求预算申请单
                budgetPassOne({ type: this.formData.type, projectId: this.formData.projectId, deptTime: this.formData.deptTime }).then(res => {
                  if (!res.data) {
                    return this.$message.warning('该项目(部门)暂无' + this.formData.type + '的预算')
                  }
                  this.budgetApply = res.data
                  // 数据处理
                  this.formData = { ...this.formData, ...res.data, changeBudget: res.data.isBudget,deptTime: this.formData.deptTime }
                  this.formItems = this.formItems.splice(0, 4).concat(this.formItems3)
                  this.sumtotalListShow = res.data.isBudget === '是' ? true : false
                  this.mainTypeList = res.data.budgetTypeVos
                  this.mainTypeList.forEach(item=>{
                    item.editSum = item.sum
                  })
                  this.$refs.table.refresh()
                })
              } else {
                delete this.formData.projectId
                this.mainTypeList = []
                this.budgetApply = {}
                this.mainTypeList2 = []
                // delete this.formData.changeBudget
                // delete this.formData.changeReason
                // delete this.formData.remark

                this.formData = {
                  createBy: this.$store.getters.userName,
                  nickname: this.$store.getters.nickname,
                  code: 'BGSQ' + moment().format('YYYYMM-DDHHmmss'),
                  budgetType: this.formData.budgetType,
                  type: e,
                  deptTime: this.formData.deptTime,
                  orgId: this.formData.orgId
                }
                this.sumtotalListShow = false
                this.sumtotalListShow2 = false
                this.$refs.table.refresh()
                this.$refs.table2.refresh()

                if (!this.formData.budgetType) {
                  return this.$message.warning('请先选择预算类型')
                } else {
                  if (this.formData.budgetType === '部门预算') {
                    budgetPassOne({ type: e, deptTime: this.formData.deptTime, orgId: this.formData.orgId }).then(res => {
                      if (!res.data) {
                        return this.$message.warning('该项目(部门)暂无' + e + '的预算')
                      }
                      this.budgetApply = res.data
                      // 数据处理
                      this.formData = { ...this.formData, ...res.data, changeBudget: res.data.isBudget, orgId: this.formData.orgId }
                      this.formItems = this.formItems.splice(0, 3).concat(this.formItems3)
                      this.sumtotalListShow = res.data.isBudget === '是' ? true : false
                      this.mainTypeList = res.data.budgetTypeVos
                      this.mainTypeList.forEach(item=>{
                        item.editSum = item.sum
                      })
                      this.$refs.table.refresh()
                    })
                  }
                }
                // this.formData.type = e
              }
            }
          }
        }
      },
      // 表单
      formItems: [
        [
          {
            type: 'text',
            prop: 'code',
            label: '申请编号',
            colspan: 4
          },
          {
            type: 'text',
            prop: 'nickname',
            label: '申请人',
            colspan: 4
          }
        ],
        [
          {
            type: 'radio',
            prop: 'budgetType',
            label: '预算类型',
            colspan: 4,
            labelAlias: 'label',
            valueAlias: 'value',
            options: () => [
              { label: '项目预算', value: '项目预算' },
              { label: '部门预算', value: '部门预算' },
            ],
            compProps: {
              on: {
                change: ({ target: { value } }) => {
                  // 清除明细 预算大类
                  delete this.formData.type
                  this.mainTypeList = []
                  this.budgetApply = {}
                  delete this.formData.changeBudget
                  if (value === '部门预算') {
                    this.$set(this.formItems, 2, this.formItems1[0])
                    this.sumtotalListShow = true
                    this.formItems = this.formItems.splice(0, 3).concat(this.formItems3)
                    this.formItems[1][1] = this.selectDept
                    this.formItems[2][0] = this.yearSelectObj
                    this.formItems[2][1] = this.ysdlObj
                    delete this.formData.projectId
                    delete this.formData.deptTime
                    delete this.formData.remark
                    getByUsername({ userName: this.$store.getters.userName }).then(res => {
                      this.$set(this.formData, 'orgId', res.data.dept.deptId)
                    })
                    this.$refs.table.refresh()
                  } else {
                    this.$set(this.formItems, 2, this.formItems2[0])
                    this.formItems = this.formItems.splice(0, 3).concat(this.formItems1)
                    this.formItems[1][1] = {}
                    this.formItems[2][1] = {}
                    this.formItems[3][0] = this.formItems[3][1]
                    this.formItems[3][1] = {}
                    this.mainTypeList = []
                    this.sumtotalListShow = false
                    treePlanProject({ state: '0' }).then(res => {
                      this.projectList = res.data
                    })
                    delete  this.formData.orgId
                    delete this.formData.deptTime
                    delete this.formData.remark
                    this.$refs.table.refresh()
                  }
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
              props: {
                allowClear: false
              },
              on: {
                select: e=>{
                  if(this.formData.budgetType === '部门预算'){
                    delete this.formData.deptTime
                    delete this.formData.type
                    delete this.formData.changeBudget
                    delete this.formData.remark
                    delete this.formData.changeReason
                    this.sumtotalListShow = false
                  }
                }
              }
            }
          },
        ]
      ],
      formItems1: [
        [
          {
            type: 'select',
            prop: 'deptTime',
            label: '变更年份',
            valueAlias: 'time',
            labelAlias: 'time',
            colspan: 12,
            options: () => this.yearSelect,
            compProps: {
              props: {
                disabled: !this.isEmpty(this.updateRow)
              },
              on: {
                select: value => {
                  if (this.formData.budgetType === '部门预算'){
                    delete this.formData.type
                    delete this.formData.changeBudget
                    delete this.formData.remark
                    delete this.formData.changeReason
                    this.sumtotalListShow = false
                  }
                }
              }
            }
          },
          {
            type: 'select',
            prop: 'type',
            label: '预算大类',
            valueAlias: 'type',
            labelAlias: 'type',
            colspan: 12,
            options: () => this.budgetTypeOptions,
            compProps: {
              on: {
                select: e => {
                  if (this.formData.budgetType === '项目预算') {
                    // if (!this.formData.type) {
                    //   return this.$message.warning('请选择预算大类')
                    // }
                    this.mainTypeList = []
                    this.budgetApply = {}
                    this.$refs.table.refresh()
                    this.mainTypeList2 = []
                    this.sumtotalListShow = false
                    this.sumtotalListShow2 = false
                    this.$refs.table2.refresh()


                    this.formData = {
                      createBy: this.$store.getters.userName,
                      nickname: this.$store.getters.nickname,
                      code: 'BGSQ' + moment().format('YYYYMM-DDHHmmss'),
                      budgetType: this.formData.budgetType,
                      type: this.formData.type,
                      projectId: this.formData.projectId,
                      deptTime: this.formData.deptTime,
                    }
                    // delete this.formData.changeBudget
                    // 请求预算申请单
                    budgetPassOne({ type: this.formData.type, projectId: this.formData.projectId, deptTime: this.formData.deptTime }).then(res => {
                      if (!res.data) {
                        return this.$message.warning('该项目(部门)暂无' + this.formData.type + '的预算')
                      }
                      this.budgetApply = res.data
                      // 数据处理
                      this.formData = { ...this.formData, ...res.data, changeBudget: res.data.isBudget,deptTime: this.formData.deptTime }
                      this.formItems = this.formItems.splice(0, 4).concat(this.formItems3)
                      this.sumtotalListShow = res.data.isBudget === '是' ? true : false
                      this.mainTypeList = res.data.budgetTypeVos
                      this.mainTypeList.forEach(item=>{
                        item.editSum = item.sum
                      })
                      this.$refs.table.refresh()
                    })
                  } else {
                    delete this.formData.projectId
                    this.mainTypeList = []
                    this.budgetApply = {}
                    this.mainTypeList2 = []
                    // delete this.formData.changeBudget
                    // delete this.formData.changeReason
                    // delete this.formData.remark
                    this.formData = {
                      createBy: this.$store.getters.userName,
                      nickname: this.$store.getters.nickname,
                      code: 'BGSQ' + moment().format('YYYYMM-DDHHmmss'),
                      budgetType: this.formData.budgetType,
                      type: e,
                      deptTime: this.formData.deptTime,
                      orgId: this.formData.orgId
                    }
                    this.sumtotalListShow = false
                    this.sumtotalListShow2 = false
                    this.$refs.table.refresh()
                    this.$refs.table2.refresh()

                    if (!this.formData.budgetType) {
                      return this.$message.warning('请先选择预算类型')
                    } else {
                      if (this.formData.budgetType === '部门预算') {
                        budgetPassOne({ type: e, deptTime: this.formData.deptTime, orgId: this.formData.orgId }).then(res => {
                          if (!res.data) {
                            return this.$message.warning('该项目(部门)暂无' + e + '的预算')
                          }
                          this.budgetApply = res.data

                          // 数据处理
                          this.formData = { ...this.formData, ...res.data, changeBudget: res.data.isBudget, orgId: this.formData.orgId }
                          this.formItems = this.formItems.splice(0, 3).concat(this.formItems3)
                          this.sumtotalListShow = res.data.isBudget === '是' ? true : false
                          this.mainTypeList = res.data.budgetTypeVos
                          this.mainTypeList.forEach(item=>{
                            item.editSum = item.sum
                          })
                          this.$refs.table.refresh()
                        })
                      }
                    }
                    // this.formData.type = e
                  }
                }
              }
            }
          },
        ]
      ],
      formItems2: [
        [
          {
            type: 'treeSelect',
            prop: 'projectId',
            label: '所属项目',
            colspan: 24,
            options: () => this.projectList,
            valueAlias: 'id',
            labelAlias: 'label',
            titleAlias: 'label',
            keyAlias: 'id',
            compProps: {
              on: {
                select: value => {
                  if(this.formData.budgetType === '项目预算'){
                    delete this.formData.type
                    delete this.formData.changeBudget
                    delete this.formData.remark
                    delete this.formData.changeReason
                    this.sumtotalListShow = false
                    this.mainTypeList = []
                  }
                }
              }
            }
          },
          {}
        ]
      ],
      formItems3: [
        [
          {
            type: 'radio',
            prop: 'changeBudget',
            label: '是否预算管控',
            colspan: 4,
            labelAlias: 'label',
            valueAlias: 'value',
            options: () => [
              { label: '是', value: '是' },
              { label: '否', value: '否' }
            ],
            compProps: {
              on: {
                change: ({ target: { value } }) => {
                  if (value === '是') {
                    if (this.formData.projectId === undefined) {
                      return this.$message.warning('请先选择项目')
                    }
                    this.sumtotalListShow = this.budgetApply.isBudget === '是' ? true : false
                    this.sumtotalListShow2 = !this.sumtotalListShow
                    if(this.formData.budgetType === '部门预算'){
                      this.formItems = this.formItems.splice(0, 3).concat(this.formItems3)
                    }else{
                      this.formItems = this.formItems.splice(0, 4).concat(this.formItems3)
                    }
                    if (this.sumtotalListShow) {
                      // budgetPass({ projectId: project.id }).then(res => {
                      //   this.formData = { ...this.formData, ...res.data, isBudget: '是' }
                      //   this.mainTypeList = res.data.budgetTypeVos
                      //   this.$refs.table.refresh()
                      // })
                    } else {
                      listType({ type: this.formData.type }).then(res => {
                        res.rows.forEach(item => {
                          item.typeId = item.id
                        })
                        this.mainTypeList2 = res.rows
                        this.$refs.table2.refresh()
                      })
                    }
                    // this.formItems = this.formItems.splice(0, 2).concat(this.formItems3)
                  } else {
                    this.mainTypeList = []
                    this.mainTypeList2 = []
                    this.formData.budgetTypeVos = []
                    this.formData.changeReason = null
                    this.formData.remark = null
                    this.formData.attachment = null
                    this.sumtotalListShow = false
                    this.sumtotalListShow2 = false
                  }
                }
              }
            }
          },
          {
            type: 'upload',
            prop: 'attachment',
            label: '附件',
            colspan: 8,
            customDefaultFileList: () => this.formData.attachment,
            handleChange: ret => {
              this.formData.attachment = JSON.stringify(ret)
            },
            compProps: {
              props: {
                multiple: true
              }
            }
          },
        ],
        [
          {
            type: 'inputTextArea',
            label: '备注',
            prop: 'remark',
            colspan: 24,
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
            label: '变更原因',
            prop: 'changeReason',
            colspan: 24,
            formItemProps: {
              props: {
                labelCol: { lg: 3, md: 8, sm: 10, xs: 24 },
                wrapperCol: { lg: 21, md: 16, sm: 14, xs: 24 }
              }
            }
          }
        ]
      ],
      // 表单验证
      formRules: {
        budgetType: { required: true, message: '请选择', trigger: 'change' },
        projectId: { required: true, message: '请输入', trigger: 'change' },
        type: { required: true, message: '请选择', trigger: 'change' },
        changeBudget: { required: true, message: '请选择', trigger: 'blur' },
        deptTime: { required: true, message: '请选择', trigger: 'change' },
        orgId: { required: true, message: '请选择', trigger: 'change' },
      },
      // 查询参数
      queryParam: {
        /*  isAsc: 'desc',
         orderByColumn: 'create_time' */
      },
      selectedRowKeys: [],
      selectedRows: [],
      columns: [
        // {
        //   title: '#',
        //   dataIndex: 'id',
        //   align: 'center',
        //   customRender: (text, record, index) => {
        //     return this.isUpdate ? record.id : record.typeId
        //   }
        // },
        {
          title: '预算科目',
          dataIndex: 'sealBudgetType.name',
          align: 'center'
        },
        {
          title: '说明',
          dataIndex: 'sealBudgetType.remark',
          align: 'center',
          width: 200
        },
        {
          title: '金额(元)',
          dataIndex: 'sum',
          align: 'left'
        },
        {
          title: '剩余金额(元)',
          dataIndex: 'sumLeft',
          align: 'left'
        },
        {
          title: '变更后金额(元)',
          dataIndex: 'editSum',
          align: 'left',
          customRender: (text, record) => {
            return <a-input-number v-model={record.editSum} min={0} precision={2} style="width:130px"></a-input-number>
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
        }
      ],
      columns2: [
        // {
        //   title: '#',
        //   dataIndex: 'id',
        //   align: 'center',
        //   customRender: (text, record, index) => {
        //     return this.isUpdate ? record.id : record.typeId
        //   }
        // },
        {
          title: '预算科目',
          dataIndex: 'sealBudgetType.name',
          align: 'center',
          customRender: (text, record, index) => {
            return this.isUpdate ? record.sealBudgetType.name : record.name
          }
        },
        {
          title: '金额(元)',
          dataIndex: 'sum',
          align: 'left',
          customRender: (text, record, index) => {
            this.sumtotal = this.$refs.table.localDataSource.reduce(
              (acc, cur, idx, arr) => {
                return parseFloat(acc) + (cur.sum === undefined ? 0 : cur.sum)
              },
              [0]
            )
            return <a-input-number v-model={record.sum} min={0} precision={2} style="width:130px"></a-input-number>
          }
        },
        {
          title: '备注',
          dataIndex: 'Iremark',
          align: 'center',
          customRender: (text, record, index) => {
            return this.isUpdate ? (
              <a-input v-model={record.remark}>
                <a-icon slot="suffix" type="edit" />
              </a-input>
            ) : (
              <a-input v-model={record.Iremark}>
                <a-icon slot="suffix" type="edit" />
              </a-input>
            )
          }
        }
      ],
      // 明细
      mainTypeList: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return new Promise(resolve => resolve({ data: this.mainTypeList }))
      },
      mainTypeList2: [],
      // 加载数据方法 必须为 Promise 对象
      loadData2: param => {
        return new Promise(resolve => resolve({ data: this.mainTypeList2 }))
      }
    }
  },
  methods: {
    // 提交申请
    handleSubmit() {
      const budgetTypeVos = this.sumtotalListShow ? [...this.$refs.table.localDataSource] : [...this.$refs.table2.localDataSource]
      const BudgetApplyVo = { ...this.formData, budgetTypeVos: budgetTypeVos }
      saveBudgetModify(BudgetApplyVo)
        .then(res => {
          this.$message.success('保存成功!')
          this.$emit('ok')
          this.$emit('close')
        })
        .catch(err => {
          this.$message.error(err.msg)
          this.$refs.formTable.loading = false
          this.$refs.formTable.saveBtnLoading = false
        })
    },
    handleCancel() {
      this.$emit('ok')
      this.$emit('close')
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    }
  },
  created() {
    // 初始化日期选着 前后五年
    for (let index = -4; index < 5; index++) {
      this.yearSelect.push({ time: moment().subtract(index, 'year').format('yyyy') })
    }
    // this.$set(this.formItems, 2, this.formItems1[0])
    //默认展示项目预算变更的items
    this.$set(this.formItems, 2, this.formItems2[0])
    this.formItems = this.formItems.splice(0, 3).concat(this.formItems1)
    this.formItems[1][1] = {}
    this.formItems[2][1] = {}
    this.formItems[3][0] = this.formItems[3][1]
    this.formItems[3][1] = {}
    this.mainTypeList = []
    this.sumtotalListShow = false
    treePlanProject({ state: '0' }).then(res => {
      this.projectList = res.data
    })


    allTree().then(res => {
      this.departmentList = res.data
    })
    // 预算大类
    BigType().then(res => {
      this.budgetTypeOptions = res.data
    })
    // 查询字典
    this.dictKeys.forEach(key => {
      this.getDicts(key).then(res => {
        this.$set(this.dictMap, key, res.data)
      })
    })
    // 更新表格
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formData = { ...this.updateRow }
    }
    // else{
    //   getByUsername({ userName: this.$store.getters.userName }).then(res => {
    //     this.$set(this.formData, 'orgId', res.data.dept.deptId)
    //     console.log('orgId, created', this.formData.orgId)
    //   })
    // }
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
