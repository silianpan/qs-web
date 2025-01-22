<!-- 零星用工付款表单 -->
<template>
  <s-form
    ok
    single
    ref="formTable"
    okText="保存草稿"
    hasApplyBtn
    @apply="handleApply"
    :queryDictKeys="dictKeys"
    :formTitle="'零星用工付款表单'"
    :formItems="formItems"
    :formData="formData"
    :rules="formRules"
    @submit="handleSubmit"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <h2 class="title">零星用工清单</h2>
      <p style="color: #348ee4; font-size: 18px; font-weight: bold; margin-top: 1em">明细总金额：{{ toThousandFilter(totalSum) }}</p>

      <a-button ghost type="primary" icon="plus" @click="addLine" style="margin-right: 10px">新增明细</a-button>
      <ImportExcel :uploadData="contract_importExcelData" style="margin-right: 10px" />
      <a-button ghost type="primary" icon="download" @click="download_contractDetailsTable">下载模板</a-button>

      <a-spin :spinning="spinning" style="margin-top: 10px">
        <s-table ref="employeeTable" size="default" :rowKey="(record, index) => (record.id ? record.id : index)" :columns="contractDetailsColumns" :data="contractDetailsLoadData" :showPagination="false">
          <span slot="action" slot-scope="text, record, index">
            <a-popconfirm v-if="materialProcurement.length" title="确认删除该行吗?" @confirm="() => handleDeleteMaterialProcurement(record, index)" ok-text="确认" cancel-text="取消">
              <a href="javascript:;" style="color: red">删除</a>
            </a-popconfirm>
          </span>
        </s-table>
        <!-- <a-row style="text-align: right">
          <a-col :span="18"
            >总计:
            <a-tag color="blue">
              {{ totalSum }}
            </a-tag></a-col
          >
        </a-row> -->
      </a-spin>
    </template>
  </s-form>
</template>

<script lang="jsx">
import moment from 'moment'
import downloadUtil from '/src/utils/common/download.js'
import { STable, SForm, ImportExcel } from '/src/components/index.js'
import { addEmployee, updateEmployee, getEmployee, delEmployeeDetail, submitApply } from '/src/api/eos/subcontract/employee.js'
import { treePlanProject } from '../../../../../api/eos/project/project.js'
import { importfile } from '/src/utils/common/excel.js'
import { uuidv4 } from '/src/utils/common/util.js'

export default {
  name: 'EmployeeForm',
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
    }
  },
  data() {
    return {
      // 合计
      totalSum: 0,
      spinning: false,
      materialProcurement: [],
      dictKeys: [],
      formData: {
        createBy: this.$store.getters.userName,
        nickname: this.$store.getters.nickname,
        code: 'CODE' + moment().format('YYYYMM-DDHHmmss')
      },
      projectList: [],
      contractDetailsLoadData: param => {
        return new Promise(resolve => {
          resolve(param)
        }).then(param => {
          return {
            data: this.materialProcurement
          }
        })
      },
      contractDetailsColumns: [
        {
          title: '#',
          dataIndex: 'index',
          align: 'center',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '工种',
          dataIndex: 'description',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input v-model={record.description} placeholder="请输入" style={{ width: '100px' }} />
          }
        },
        {
          title: '人数',
          dataIndex: 'personNum',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input-number v-model={record.personNum} placeholder="请输入" min={0} precision={2} style={{ width: '100px' }} />
          }
        },
        {
          title: '出勤天数',
          dataIndex: 'days',
          align: 'center',
          width: 150,
          customRender: (text, record) => {
            return <a-input-number v-model={record.days} placeholder="请输入" min={0} precision={2} style={{ width: '100px' }} />
          }
        },
        {
          title: '每日工资',
          dataIndex: 'moneyDay',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input-number v-model={record.moneyDay} placeholder="请输入" min={0} precision={2} style={{ width: '100px' }} />
          }
        },
        {
          title: '应发工资',
          dataIndex: 'money',
          align: 'center',
          customRender: (text, record) => {
            return <a-input-number v-model={record.money} placeholder="请输入" min={0} precision={2} style={{ width: '100px' }} />
          }
        },
        {
          title: '实发工资',
          dataIndex: 'moneyReal',
          align: 'center',
          customRender: (text, record) => {
            return <a-input-number v-model={record.moneyReal} placeholder="请输入" min={0} precision={2} style={{ width: '100px' }} />
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.remark} placeholder="请输入" min={0} precision={2} style={{ width: '100px' }} />
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      formItems: [
        [
          {
            type: 'text',
            prop: 'code',
            label: '项目编号',
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
            type: 'treeSelect',
            label: '项目',
            prop: 'projectId',
            colspan: 4,
            labelAlias: 'label',
            valueAlias: 'id',
            options: () => this.projectList,
            compProps: {
              props: {
                disabled: !this.isEmpty(this.updateRow)
              }
            }
          },
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
          }
        ],
        [
          {
            type: 'inputTextArea',
            label: '备注',
            prop: 'remark',
            colspan: 4,
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
        version: { required: true, message: '请输入', trigger: 'blur' },
        tenantId: { required: true, message: '请输入', trigger: 'blur' },
        projectId: { required: true, message: '请输入', trigger: 'change' },
        description: { required: true, message: '请输入', trigger: 'blur' },
        personNum: { required: true, message: '请输入', trigger: 'blur' },
        days: { required: true, message: '请输入', trigger: 'blur' },
        moneyDay: { required: true, message: '请输入', trigger: 'blur' },
        money: { required: true, message: '请输入', trigger: 'blur' },
        moneyReal: { required: true, message: '请输入', trigger: 'blur' }
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
                const ids = this.materialProcurement.filter(e => e.id).map(e => e.id)
                if (ids.length > 0) {
                  delEmployeeDetail(ids)
                }
                this.spinning = false
                importfile(file.file, outdata => {
                  const da = [...outdata]
                  const arr = []
                  da.map(v => {
                    const obj = {}
                    obj.oid = uuidv4()
                    obj.description = v['工种']
                    obj.personNum = v['人数']
                    obj.days = v['出勤天数']
                    obj.moneyDay = v['日工资']
                    obj.money = v['应发工资']
                    obj.moneyReal = v['实发工资']
                    obj.remark = v['备注']
                    arr.push(obj)
                  })
                  this.fund_import_excel = arr // excel数据
                  for (let i = 0; i < this.fund_import_excel.length; i++) {
                    if (
                      this.isEmpty(this.fund_import_excel[i].description) ||
                      this.isEmpty(this.fund_import_excel[i].personNum) ||
                      this.isEmpty(this.fund_import_excel[i].days) ||
                      this.isEmpty(this.fund_import_excel[i].moneyDay) ||
                      this.isEmpty(this.fund_import_excel[i].money) ||
                      this.isEmpty(this.fund_import_excel[i].moneyReal)
                    ) {
                      return this.$message.error('导入的项目必须完整填写完整!')
                    }
                  }
                  this.materialProcurement = [...this.fund_import_excel]
                  this.$refs.employeeTable.refresh(true)
                })
              }
            }
          }
        }
      }
    }
  },
  created() {
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formData = { ...this.updateRow }
      this.formData.nickname = this.updateRow.sysUser ? this.updateRow.sysUser.nickName : this.$store.getters.nickname
      getEmployee(this.updateRow.id).then(res => {
        this.materialProcurement = res.data.sealEmployees
        this.$refs.employeeTable.refresh()
      })
    } else {
      treePlanProject().then(res => {
        this.projectList = res.data
      })
    }
  },
  methods: {
    async handleSubmit(callbackFunc) {
      const fd = { ...this.formData }
      fd.type = '零星用工'
      fd.sealEmployees = this.materialProcurement
      // 更新或添加
      let res = null
      if (this.isUpdate && !this.isEmpty(fd.id)) {
        res = await updateEmployee(fd)
      } else {
        res = await addEmployee(fd)
      }
      if (callbackFunc instanceof Function) {
        callbackFunc(res)
      } else {
        this.$message.success(res.msg)
        this.$emit('ok')
        this.$emit('close')
      }
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
    download_contractDetailsTable() {
      downloadUtil.resource('/profile/template/零星用工清单模板.xlsx')
    },
    handleDeleteMaterialProcurement(record, index) {
      if (record.id) {
        this.materialProcurement = this.materialProcurement.filter(item => {
          return item.id !== record.id
        })
        delEmployeeDetail(record.id).then(res => {
          this.$refs.employeeTable.refresh(true)
        })
      } else {
        this.materialProcurement.splice(index, 1)
        this.$refs.employeeTable.refresh(true)
      }
    },
    // 新增明细行
    addLine() {
      let status = true
      if (this.materialProcurement.length > 0) {
        const value = this.materialProcurement.map(({ description, personNum, days, moneyDay, money, moneyReal }) => ({ description, personNum, days, moneyDay, money, moneyReal }))
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
      this.materialProcurement.push({})
      this.$nextTick(() => {
        this.$refs.employeeTable.refresh(true)
      })
    }
  },
  watch: {
    materialProcurement: {
      handler(newValue, oldValue) {
        this.totalSum = 0
        if (newValue.length > 0) {
          newValue.forEach(e => {
            if (!this.isEmpty(e.moneyReal)) {
              this.totalSum = this.totalSum + e.moneyReal
            }
          })
        }
      },
      deep: true
    }
  }
}
</script>
<style scoped>
.title {
  font-weight: 700;
  text-align: center;
  display: block;
  color: #000;
  font-size: 20px;
}
</style>
