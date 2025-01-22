<template>
  <!-- 预算表单 -->
  <s-form
    ref="formTable"
    ok
    okText="保存草稿"
    single
    hasApplyBtn
    @apply="handleApply"
    :queryDictKeys="dictKeys"
    :formTitle="'预算申请'"
    :formItems="formItems"
    :formData="formData"
    :rules="formRules"
    @submit="handleSubmit"
    @cancel="handleCancel"
  >
    <!-- 数据表格 -->
    <template v-slot:footer>
      <div v-show="sumtotalListShow" class="s-mt-2 s-mb-2" style="margin-top: 10px">
        <p>
          <span style="font-size: 18px; font-weight: bold" v-for="item in ProjectMoneyList" :key="item.type"
            >当前<i style="color: DodgerBlue">{{ item.type }}</i
            >总金额：<i style="color: red">{{ toThousandFilter(item.sum) }}</i
            >(元)</span
          >
        </p>
        <p style="color: red; font-size: 18px">
          <span style="color: DodgerBlue; font-size: 18px; font-weight: bold">预算总金额：{{ toThousandFilter(sumtotal) }}</span>
        </p>
        <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :showPagination="false"> </s-table>
      </div>
    </template>
  </s-form>
</template>

<script lang="jsx">
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { SForm, STable } from '/src/components/index.js'
import { addApply, applyEdit, submitApply } from '/src/api/eos/budget/apply.js'
import { getOneApply } from '/src/api/eos/budget/budget.js'
import { BigType } from '/src/api/eos/budget/type.js'
import { listType } from '/src/api/eos/budget/type.js'
import { treeSelect } from '/src/api/eos/project/project.js'
import {allTree} from '../../../../api/system/dept'
import {getByUsername} from '../../../../api/system/user'

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
  name: 'BudgetForm',
  components: {
    STable,
    SForm
  },
  data() {
    return {
      dictKeys: [dictConfig.PROJECT_BUDGET_TYPE],
      sumtotalListShow: true,
      // 表单数据
      formData: {
        createBy: this.$store.getters.userName,
        nickname: this.$store.getters.nickname,
        code: 'YSSQ' + moment().format('YYYYMM-DDHHmmss'),
        BudgetType: '项目'
      },
      // 年份选择
      yearSelect: [],
      formItems: [],
      formRules: {},
      // 预算大类
      budgetTypeOptions: [],
      /* 实时计算金额明细总额 */
      sumtotal: 0,
      /* 项目其他已做预算总金额 */
      ProjectMoneyList: [],
      // 项目列表
      projectList: [],
      departmentList: [],
      // 部门选择obj
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
      // 管理项目立项表单
      manageFormItems: [
        [
          {
            type: 'text',
            prop: 'code',
            label: '预算编号',
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
            prop: 'BudgetType',
            label: '预算类型',
            options: () => [
              { label: '项目', value: '项目' },
              { label: '部门', value: '部门' }
            ],
            labelAlias: 'label',
            valueAlias: 'value',
            compProps: {
              props: {
                disabled: !this.isEmpty(this.updateRow)
              },
              on: {
                change: e => {
                  const BudgetType = e.target.value
                  // 清除表格
                  this.mainTypeList = []
                  this.$refs.table.refresh()
                  // 清空项目信息
                  this.formData = {
                    createBy: this.$store.getters.userName,
                    nickname: this.$store.getters.nickname,
                    code: 'YSSQ' + moment().format('YYYYMM-DDHHmmss'),
                    BudgetType: BudgetType
                  }
                  if (BudgetType === '部门') {
                    this.manageFormItems[1][1] = this.selectDept
                    this.formItems = this.manageFormItems.slice(0, 2).concat(this.deptColumns, [this.manageFormItems[this.manageFormItems.length - 1]])
                    getByUsername({ userName: this.$store.getters.userName }).then(res => {
                      this.$set(this.formData, 'orgId', res.data.dept.deptId)
                    })
                    this.sumtotalListShow = true
                  } else {
                    this.manageFormItems[1][1] = {}
                    this.formItems = this.manageFormItems
                  }
                }
              }
            },
          },
          {}
        ],
        [
          {
            type: 'treeSelect',
            prop: 'projectId',
            label: '所属项目',
            colspan: 12,
            options: () => this.projectList,
            keyAlias: 'id',
            titleAlias: 'label',
            valueAlias: 'id',
            compProps: {
              props: {
                disabled: !this.isEmpty(this.updateRow)
              }
            }
          },
          {
            type: 'radio',
            prop: 'isBudget',
            label: '是否预算管控',
            options: () => [
              { label: '是', value: '是' },
              { label: '否', value: '否' }
            ],
            labelAlias: 'label',
            valueAlias: 'value',
            compProps: {
              props: {
                disabled: !this.isEmpty(this.updateRow)
              },
              on: {
                change: e => {
                  const isBudget = e.target.value
                  if (isBudget === '否') {
                    this.sumtotalListShow = false
                    this.formItems = this.manageFormItems.slice(0, 6)
                  } else {
                    this.sumtotalListShow = true
                    this.formItems = this.manageFormItems
                  }
                  this.formData.isBudget = isBudget
                }
              }
            }
          }
        ],
        [
          {
            type: 'select',
            prop: 'type',
            label: '预算大类',
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
                  listType({ type: e }).then(res => {
                    this.mainTypeList = res.rows
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
            type: 'upload',
            prop: 'attachment',
            label: '附件',
            colspan: 24,
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
            prop: 'remark',
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
      deptColumns: [
        [
          {
            type: 'select',
            prop: 'type',
            label: '预算大类',
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
                  listType({ type: e }).then(res => {
                    this.mainTypeList = res.rows
                    this.$refs.table.refresh()
                  })
                }
              }
            }
          },
          {
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
          }
        ],
        [
          {
            type: 'upload',
            prop: 'attachment',
            label: '附件',
            colspan: 24,
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
      manageFormRules: {
        projectId: { required: true, message: '请输入', trigger: 'change' },
        isBudget: { required: true, message: '请选择', trigger: 'change' },
        type: { required: true, message: '请选择', trigger: 'change' },
        deptTime: { required: true, message: '请选择', trigger: 'change' }
      },
      // 查询参数
      queryParam: {
        /*  isAsc: 'desc',
         orderByColumn: 'create_time' */
      },
      selectedRowKeys: [],
      selectedRows: [],
      columns: [
        {
          title: '#',
          dataIndex: 'id',
          align: 'center',
          customRender: (text, record, index) => {
            return this.isUpdate ? record.id : record.typeId
          }
        },
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
            return <a-input-number v-model={record.sum} min={0} precision={2} on-change={this.onChange_number} style="width:130px"></a-input-number>
          }
        },
        {
          title: '备注',
          dataIndex: 'Iremark',
          align: 'center',
          customRender: (text, record, index) => {
            return this.isUpdate ? (
              <a-input v-model={record.remark} on-change={this.onChange_POSGNOTE}>
                <a-icon slot="suffix" type="edit" />
              </a-input>
            ) : (
              <a-input v-model={record.Iremark} on-change={this.onChange_POSGNOTE}>
                <a-icon slot="suffix" type="edit" />
              </a-input>
            )
          }
        }
      ],
      mainTypeList: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return new Promise(resolve => resolve({ data: this.mainTypeList }))
      },
      // 请求参数
      params: {}
      // 预算类型OPs
    }
  },
  methods: {
    // 提交申请
    async handleSubmit(callbackFunc) {
      const TableList = this.$refs.table.localDataSource
      const res = TableList.map(({ name, id, Iremark, type, sum, remark, typeId }) => {
        return {
          id,
          name,
          sum,
          remark,
          Iremark
        }
      })
      this.params.id = this.formData.id
      this.params.type = this.formData.type
      this.params.orgId = this.formData.orgId
      this.params.projectId = this.formData.projectId
      this.params.createBy = this.formData.createBy
      this.params.code = this.formData.code
      this.params.isBudget = this.formData.isBudget
      this.params.attachment = this.formData.attachment
      this.params.deptTime = this.formData.deptTime
      this.params.remark = this.formData.remark
      this.params.sealBudgets = res
      this.params.sealBudgets.forEach(item => {
        item.remark = this.isUpdate ? item.remark : item.Iremark
        item.typeId = this.isUpdate ? item.typeId : item.id
      })
      let resSave = null
      try{
        if (this.isUpdate && this.updateRow.id) {
          if (this.formData.BudgetType === '部门') {
            delete this.params.projectId
          }
          // 修改
          resSave = await applyEdit(this.params)
        } else {
          // 新增
          resSave = await addApply(this.params)
        }
        if (callbackFunc instanceof Function) {
          callbackFunc(resSave)
        } else {
          this.$message.success(resSave.msg)
          this.$emit('ok')
          this.$emit('close')
        }
      }catch{
        this.$refs.formTable.loading = false
        this.$refs.formTable.saveBtnLoading = false
      }
    },
    // 直接提交申请
    handleApply() {
      try{
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
      }catch{
        this.$refs.formTable.loading = false
        this.$refs.formTable.saveBtnLoading = false
      }
    },
    handleCancel() {
      this.$emit('close')
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 数字输入框回调
    onChange_number(val) {},
    // 备注回调
    onChange_POSGNOTE(val) {}
  },
  created() {
    allTree().then(res => {
      this.departmentList = res.data
    })
    // 初始化日期选着 前后五年
    for (let index = -4; index < 5; index++) {
      this.yearSelect.push({ time: moment().subtract(index, 'year').format('yyyy') })
    }
    // 查询预算类型
    BigType().then(res => {
      this.budgetTypeOptions = res.data
    })
    this.formItems = this.manageFormItems
    this.formRules = this.manageFormRules
    if (this.isEmpty(this.updateRow)) {
      /* 查询项目 */
      // 首先获取项目的额树形数据
      treeSelect({ state: '0' }).then(res => {
        this.projectList = res.data
      })
    } else {
      this.projectList = [
        {
          id: parseInt(this.updateRow.projectId),
          label: this.updateRow.sealProject?.name
        }
      ]
      if (this.updateRow.projectId === null) {
        this.formItems = this.manageFormItems.slice(0, 2).concat(this.deptColumns, [this.manageFormItems[this.manageFormItems.length - 1]])
        this.sumtotalListShow = true
      } else {
        this.formItems = this.manageFormItems
      }
    }
  },
  beforeMount() {
    // 修改
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formData = {
        ...this.updateRow,
        projectId: parseInt(this.updateRow.projectId),
        BudgetType: this.updateRow.projectId ? '项目' : '部门',
        nickname: this.updateRow.sysUser ? this.updateRow.sysUser.nickName : this.$store.getters.nickname
      }
      getOneApply(this.updateRow.id).then(({ data: { budgetTypeVos } }) => {
        this.mainTypeList = budgetTypeVos
        this.$refs.table.refresh(true)
      })
    }
  },
  computed: {}
}
</script>
<style lang="less" scoped>
.s-border-zero {
  font-size: 14px;
  font-weight: bold;
  color: rgb(0, 55, 235);
}
</style>
