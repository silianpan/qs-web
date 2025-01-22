<!-- 工程量结算表单 -->
<template>
  <s-form
    ok
    ref="formTable"
    single
    okText="保存草稿"
    hasApplyBtn
    @apply="handleApply"
    :queryDictKeys="dictKeys"
    :formTitle="'工程量结算表单'"
    :formItems="formItems"
    :formData="formData"
    :rules="formRules"
    @submit="handleSubmit"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <h2 class="title">工程量结算清单</h2>
      <p style="color: #348ee4; font-size: 18px; font-weight: bold; margin-top: 1em">明细总金额：{{ toThousandFilter(totalSum) }}</p>

      <a-button ghost type="primary" icon="plus" @click="addLine" style="margin-right: 10px">新增明细</a-button>
      <ImportExcel :uploadData="contract_importExcelData" style="margin-right: 10px" />
      <a-button ghost type="primary" icon="download" @click="download_contractDetailsTable">下载模板</a-button>

      <a-spin :spinning="spinning">
        <s-table ref="execFormTable" size="default" :rowKey="record => (record.id ? record.id : record.oid)" :columns="contractDetailsColumns" :data="contractDetailsLoadData" :showPagination="false">
          <span slot="action" slot-scope="text, record, index">
            <a-popconfirm v-if="materialProcurement.length" title="确认删除该行吗?" @confirm="() => handleDeleteMaterialProcurement(record, index)" ok-text="确认" cancel-text="取消">
              <a href="javascript:;" style="color: red">删除</a>
            </a-popconfirm>
          </span>
        </s-table>
      </a-spin>
    </template>
  </s-form>
</template>

<script lang="jsx">
import moment from 'moment'
import { STable, SForm, Ellipsis, ImportExcel } from '/src/components/index.js'
import { addExec, updateExec, getExec, submitApply, delExecDetail } from '/src/api/eos/subcontract/exec.js'
import { getAmountListByContract } from '/src/api/eos/contract/list.js'
import { treePlanProject } from '../../../../../api/eos/project/project.js'
import { listByProjectIdOnly } from '/src/api/eos/contract/contract.js'
import downloadUtil from '../../../../../utils/common/download'
import { importfile } from '../../../../../utils/common/excel'
import { ExcelDateToJSDate, uuidv4 } from '../../../../../utils/common/util'
import { delOnbusDetail } from '../../../../../api/eos/cost/labor'

export default {
  name: 'ExecForm',
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
      dateFormat: 'YYYY-MM-DD',
      spinning: false,
      materialProcurement: [],
      dictKeys: [],
      formData: {
        createBy: this.$store.getters.userName,
        nickname: this.$store.getters.nickname,
        code: 'CODE' + moment().format('YYYYMM-DDHHmmss')
      },
      projectList: [],
      contractList: [],
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
          dataIndex: 'oid',
          align: 'center',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '名称',
          dataIndex: 'name',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input v-model={record.name}></a-input>
          }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input v-model={record.unit}></a-input>
          }
        },
        {
          title: '合同数量',
          dataIndex: 'contractNum',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input v-model={record.contractNum}></a-input>
          }
        },
        {
          title: '单价',
          dataIndex: 'onePrice',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input-number v-model={record.onePrice} min={0} precision={2} />
          }
        },
        {
          title: '开发阶段',
          dataIndex: 'stageName',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input v-model={record.stageName}></a-input>
          }
        },
        {
          title: '截止日期',
          dataIndex: 'stageDate',
          align: 'center',
          customRender: (text, record, index) => {
            return text ? (
              <a-date-picker format={this.dateFormat} value={moment(text)} onChange={(date, dateString) => (record.stageDate = dateString)} placeholder="选择日期" />
            ) : (
              <a-date-picker onChange={(date, dateString) => (record.stageDate = dateString)} placeholder="选择日期" />
            )
          },
          width: 200
        },
        {
          title: '阶段描述',
          dataIndex: 'stageContent',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input v-model={record.stageContent}></a-input>
          }
        },
        {
          title: '本次填报量',
          dataIndex: 'thisAmount',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input-number v-model={record.thisAmount} min={0} precision={2}></a-input-number>
          }
        },
        {
          title: '核准量',
          dataIndex: 'checkAmount',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input-number v-model={record.checkAmount} min={0} precision={2}></a-input-number>
          }
        },
        {
          title: '本次批量',
          dataIndex: 'thisMoney',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input-number v-model={record.thisMoney} min={0} precision={2}></a-input-number>
          }
        },
        {
          title: '小计',
          dataIndex: 'checkAmountTotal',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input-number v-model={record.checkAmountTotal} min={0} precision={2}></a-input-number>
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
              },
              on: {
                select: value => {
                  listByProjectIdOnly({ projectId: value }).then(res => {
                    this.contractList = res.data
                  })
                }
              }
            }
          },
          {
            type: 'select',
            label: '合同',
            prop: 'contractId',
            labelAlias: 'name',
            valueAlias: 'id',
            colspan: 4,
            options: () => this.contractList,
            compProps: {
              props: {
                disabled: !this.isEmpty(this.updateRow)
              },
              on: {
                // select: value => {
                //   getAmountListByContract({ contractId: value, type: '工程量' }).then(res => {
                //     this.materialProcurement = res.rows.map((item, index) => {
                //       return {
                //         ...item,
                //         amoutListId: item.id,
                //         stageDate: null
                //       }
                //     })
                //     this.$refs.execFormTable.refresh()
                //   })
                // }
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
            },
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
        contractId: { required: true, message: '请输入', trigger: 'change' },
        amoutListId: { required: true, message: '请输入', trigger: 'blur' },
        name: { required: true, message: '请输入', trigger: 'blur' },
        onePrice: { required: true, message: '请输入', trigger: 'blur' },
        thisMoney: { required: true, message: '请输入', trigger: 'blur' }
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
                this.spinning = false
                // 清空之前数据，进行覆盖
                const ids = this.materialProcurement.filter(e => e.id).map(e => e.id)
                if (!this.isEmpty(ids)) {
                  delExecDetail(ids)
                }
                importfile(file.file, outdata => {
                  const da = [...outdata]
                  const arr = []
                  da.map(v => {
                    const obj = {}
                    obj.oid = uuidv4()
                    obj.name = v['名称']
                    obj.unit = v['单位']
                    obj.contractNum = v['合同数量']
                    obj.onePrice = v['单价']
                    obj.stageName = v['开发阶段']
                    obj.stageDate = ExcelDateToJSDate(v['截止日期'])
                    obj.stageContent = v['阶段描述']
                    obj.thisAmount = v['本次填报量']
                    obj.checkAmount = v['核准量']
                    obj.thisMoney = v['本次批量']
                    obj.checkAmountTotal = v['小计']
                    arr.push(obj)
                  })
                  this.fund_import_excel = arr // excel数据
                  for (let i = 0; i < this.fund_import_excel.length; i++) {
                    if (this.isEmpty(this.fund_import_excel[i].name) || this.isEmpty(this.fund_import_excel[i].onePrice) || this.isEmpty(this.fund_import_excel[i].thisMoney)) {
                      return this.$message.error('名称、单价，本次批量必须完整填写完整!')
                    }
                  }
                  this.materialProcurement = [...this.fund_import_excel]
                  this.spinning = false
                  this.$refs.execFormTable.refresh(true)
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
      getExec(this.updateRow.id).then(res => {
        this.materialProcurement = res.data.sealAmountListExecs
        this.$refs.execFormTable.refresh()
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
      fd.type = '工程量'
      // this.materialProcurement.forEach((item, index) => {
      //   item.stageDate = moment(item.stageDate).format('YYYY-MM-DD HH:mm:ss')
      // })
      fd.sealAmountListExecs = this.materialProcurement
      // return
      // 更新或添加
      let res = null
      if (this.isUpdate && !this.isEmpty(fd.id)) {
        res = await updateExec(fd)
      } else {
        res = await addExec(fd)
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
    handleDeleteMaterialProcurement(record, index) {
      if (record.id) {
        this.materialProcurement = this.materialProcurement.filter(item => {
          return item.id !== record.id
        })
        delExecDetail(record.id).then(res => {
          this.$refs.execFormTable.refresh()
        })
      } else {
        this.materialProcurement.splice(index, 1)
        this.$refs.execFormTable.refresh()
      }
    },
    download_contractDetailsTable() {
      downloadUtil.resource('/profile/template/报量结算清单模板.xlsx')
    },
    // 新增明细行
    addLine() {
      let status = true
      if (this.materialProcurement.length > 0) {
        const value = this.materialProcurement.map(({ name, onePrice, thisMoney }) => ({ name, onePrice, thisMoney }))
        value.map(item => {
          for (const key in item) {
            if (!item[key]) {
              status = false
              this.$message.error('名称、单价，本次批量必须完整填写完整!')
              return
            }
          }
        })
        if (!status) {
          return
        }
      }
      this.materialProcurement.push({ oid: uuidv4() })
      this.$nextTick(() => {
        this.$refs.execFormTable.refresh(true)
      })
    }
  },
  watch: {
    materialProcurement: {
      // 自动求和计算
      handler(newValue, oldValue) {
        this.totalSum = 0
        // 小计 = 本次批量 * 单价
        if (newValue.length > 0) {
          newValue.forEach(e => {
            if (!this.isEmpty(e.onePrice) && !this.isEmpty(e.thisMoney)) {
              const minTotal = e.onePrice * e.thisMoney
              this.totalSum = this.totalSum + minTotal
              e.checkAmountTotal = minTotal
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
