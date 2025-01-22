<!-- 人工成本上报表单 -->
<template>
  <s-form ok single :okText="'保存申请'" :queryDictKeys="dictKeys" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel">
    <!-- 数据表格 -->
    <template v-slot:footer>
      <!-- 导入 -->
      <div style="margin: 5px 0">
        <ImportExcel :uploadData="importExcelData" style="margin-right: 10px" />
        <a-button ghost type="primary" icon="download" @click="download" style="margin-right: 10px">下载模板</a-button>
        <!-- 阶段明细 第一层级 -->
        <a-button ghost type="primary" icon="plus" @click="addPhase">新增明细</a-button>
      </div>
      <a-spin :spinning="spinning" style="margin-top: 10px">
        <div class="s-mt-2 s-mb-2">
          <s-table ref="table" size="default" :rowKey="record => (record.id ? record.id : record.key)" :columns="columns" :data="loadData" :showPagination="false">
            <span slot="action" slot-scope="text, record">
              <a-button style="color: red" type="link" icon="delete" @click="deleteProgressFill(text, record)" />
            </span>
          </s-table>
          <a-row style="text-align: center">
            <a-col :span="6"
              >工时合计:<a-tag color="pink">
                {{ toThousandFilter(workHour) }}
              </a-tag></a-col
            >
            <a-col :span="6"
              >人工金额合计:<a-tag color="red">
                {{ toThousandFilter(labMoney) }}
              </a-tag></a-col
            >
            <a-col :span="6"
              >差补金额合计:<a-tag color="orange">
                {{ toThousandFilter(diffMoney) }}
              </a-tag></a-col
            >
            <a-col :span="6"
              >总计金额:<a-tag color="blue">
                {{ toThousandFilter(totalMoney) }}
              </a-tag></a-col
            >
          </a-row>
        </div>
      </a-spin>
    </template>
  </s-form>
</template>

<script lang="jsx">
import moment from 'moment'
import downloadUtil from '/src/utils/common/download.js'
import { importfile } from '/src/utils/common/excel.js'
import { SForm, STable, ImportExcel } from '/src/components/index.js'
import { uuidv4 } from '/src/utils/common/util.js'
import { addLabor, updateLabor, delOnbusDetail } from '/src/api/eos/cost/labor.js'
import { listProjectAllAndCildren } from '/src/api/eos/project/project.js'

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
  name: 'Labor',
  components: {
    SForm,
    STable,
    ImportExcel
  },
  data() {
    return {
      // 总计
      workHour: 0,
      labMoney: 0,
      diffMoney: 0,
      totalMoney: 0,
      //
      dictKeys: [],
      formData: {
        createBy: this.$store.getters.userName,
        nickname: this.$store.getters.nickname,
        orderCode: 'RGCBSB' + moment().format('YYYYMM-DDHHmmss'),
        orderType: '人工成本上报'
      },
      formItems: [
        [
          {
            type: 'text',
            prop: 'orderCode',
            label: '上报编号'
          },
          {
            type: 'text',
            prop: 'nickname',
            label: '上报人'
          },
          {
            type: 'text',
            prop: 'orderType',
            label: '上报类型'
          }
        ],
        [
          {
            type: 'upload',
            prop: 'attachment',
            label: '附件上传',
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
          {
            type: 'monthPicker',
            label: '上报年月',
            prop: 'orderTime'
          }
        ],
        [
          {
            type: 'inputTextArea',
            label: '上报说明',
            prop: 'orderInfo',
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
        // workHour: { required: true, message: '请输入', trigger: 'change' },
        // labMoney: { required: true, message: '请输入', trigger: 'blur' },
        // diffMoney: { required: true, message: '请输入', trigger: 'blur' },
        // totalMoney: { required: true, message: '请输入', trigger: 'blur' },
        orderTime: { required: true, message: '请选择', trigger: 'change' }
        // expenseType: { required: true, message: '请选择', trigger: 'change' }
      },
      columns: [
        {
          title: '#',
          dataIndex: 'key',
          align: 'center',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '项目编号',
          dataIndex: 'projectCode',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.projectCode} />
          }
        },
        {
          title: '项目/部门名称',
          dataIndex: 'projectName',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.projectName} />
          }
        },
        {
          title: '工时(人/天)',
          dataIndex: 'workHour',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.workHour} />
          }
        },
        {
          title: '人工金额(元)',
          dataIndex: 'labMoney',
          align: 'left',
          customRender: (text, record) => {
            return <a-input v-model={record.labMoney} />
          }
        },
        {
          title: '差补金额(元)',
          dataIndex: 'diffMoney',
          align: 'left',
          customRender: (text, record) => {
            return <a-input v-model={record.diffMoney} />
          }
        },
        {
          title: '合计金额(元)',
          dataIndex: 'totalMoney',
          align: 'left',
          customRender: (text, record) => {
            return <a-input v-model={record.totalMoney} />
          }
        },
        {
          title: '费用类型',
          dataIndex: 'expenseType',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.expenseType} />
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.remark} />
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 80,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载明细数据
      TableDatas: [],
      loadData: param => {
        return new Promise(resolve => {
          resolve(param)
        }).then(param => {
          return {
            data: this.TableDatas
          }
        })
      },
      importExcels: [],
      // 导入
      importExcelData: {
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
                // 清空之前数据，进行覆盖
                const ids = this.TableDatas.filter(e => e.id).map(e => e.id)
                if (!this.isEmpty(ids)) {
                  delOnbusDetail(ids)
                }
                // 核心函数
                importfile(file.file, outdata => {
                  const da = [...outdata]
                  const arr = []
                  da.map(v => {
                    const obj = {}
                    obj.key = uuidv4()
                    obj.projectCode = v['项目编号']
                    obj.projectName = v['项目/部门名称']
                    obj.workHour = v['工时']
                    obj.labMoney = v['人工金额']
                    obj.diffMoney = v['差补金额']
                    obj.totalMoney = v['合计金额']
                    obj.expenseType = v['费用类型']
                    obj.remark = v['备注']
                    arr.push(obj)
                  })
                  this.importExcels = arr
                  this.cptTotal(this.importExcels)
                  this.TableDatas = [...this.importExcels]
                  this.spinning = false
                  this.$refs.table.refresh(true)
                })
              }
            }
          }
        }
      },
      spinning: false
    }
  },
  methods: {
    // 计算合计
    cptTotal(arr) {
      // 清空数据
      this.workHour = 0
      this.labMoney = 0
      this.diffMoney = 0
      this.totalMoney = 0
      // 总和计算
      arr.forEach(e => {
        this.workHour = this.workHour + (e.workHour ? e.workHour : 0)
        this.labMoney = this.labMoney + (e.labMoney ? e.labMoney : 0)
        this.diffMoney = this.diffMoney + (e.diffMoney ? e.diffMoney : 0)
        this.totalMoney = this.totalMoney + (e.totalMoney ? e.totalMoney : 0)
      })
      
    },
    handleSubmit() {
      const costVo = { ...this.formData }
      costVo.orderTime = this.formData.orderTime.format('YYYY-MM')
      costVo.sealCostLabors = [...this.$refs.table.localDataSource]
      try {
        if (this.isUpdate && !this.isEmpty(this.updateRow)) {
          updateLabor(costVo).then(res => {
            this.$message.success('修改成功!')
            this.$emit('ok')
            this.$emit('close')
          })
        } else {
          addLabor(costVo).then(res => {
            this.$message.success('保存成功!')
            this.$emit('ok')
            this.$emit('close')
          })
        }
      } catch (error) {
        this.$message.error('出错了!')
      }
    },
    handleCancel() {
      this.$emit('close')
    },
    // 下载模板
    download() {
      downloadUtil.resource('/profile/template/人工成本上报模板.xlsx')
    },
    // 修改--文件
    getDefaultFileList() {
      let fileList = []
      if (!this.isEmpty(this.updateRow) && !this.isEmpty(this.updateRow.attachment)) {
        fileList = JSON.parse(this.updateRow.attachment)
        fileList.forEach(item => {
          item.uid = this.uuidv4()
        })
      }
      return fileList
    },
    /* 添加阶段明细  只添加第一级 */
    addPhase() {
      this.TableDatas.push({
        key: this.TableDatas.length + 1 + '',
        projectCode: '',
        projectName: '',
        workHour: '',
        labMoney: '',
        diffMoney: '',
        totalMoney: '',
        expenseType: '',
        remark: ''
      })
    },
    /* 删除明细行 */
    deleteProgressFill(text, record) {
      if (!this.isEmpty(record.id)) {
        delOnbusDetail(record.id)
      }
      this.TableDatas = this.TableDatas.filter(item => item !== record)
      this.$refs.table.refresh()
      this.cptTotal(this.TableDatas)
    }
  },
  created() {},
  mounted() {
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formData = { ...this.updateRow }
      this.formData.nickname = this.updateRow.sysUser ? this.updateRow.sysUser.nickName : this.$store.getters.nickname
      this.formData.orderTime = moment(this.formData.orderTime)
      this.TableDatas = [...this.updateRow.sealCostLabors]
      // 总计
      this.cptTotal(this.TableDatas)
      this.$refs.table.refresh(true)
    }
  }
}
</script>
<style lang="less" scoped>
::v-deep .s-mt-2,
::v-deep .s-mb-2 {
  max-height: 520px;
  overflow: auto;
}
</style>
