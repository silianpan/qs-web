<!-- 差旅成本上报表单 -->
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
              >票价合计:<a-tag color="pink">
                {{ travelPrice }}
              </a-tag></a-col
            >
            <a-col :span="6"
              >民航发展基金合计:<a-tag color="red">
                {{ travelFund }}
              </a-tag></a-col
            >
            <a-col :span="6"
              >代理服务费合计:<a-tag color="orange">
                {{ travelService }}
              </a-tag></a-col
            >
            <a-col :span="6"
              >总计:<a-tag color="blue">
                {{ travelTotalMoney }}
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
import { uuidv4, ExcelDateToJSDate } from '/src/utils/common/util.js'
import { addOnbus, updateOnbus, delOnbusDetail } from '/src/api/eos/cost/onbus.js'
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
  name: 'OnbusForm',
  components: {
    SForm,
    STable,
    ImportExcel
  },
  data() {
    return {
      // 总计
      travelPrice: 0,
      travelFund: 0,
      travelService: 0,
      travelTotalMoney: 0,
      //
      dictKeys: [],
      formData: {
        createBy: this.$store.getters.userName,
        nickname: this.$store.getters.nickname,
        orderCode: 'CLCBSB' + moment().format('YYYYMM-DDHHmmss'),
        orderType: '差旅成本上报'
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
        orderTime: { required: true, message: '请选择', trigger: 'change' },
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
          title: '组织名称',
          dataIndex: 'org',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.org} />
          }
        },
        {
          title: '订票时间',
          dataIndex: 'bookTime',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.bookTime} />
          }
        },
        {
          title: '姓名',
          dataIndex: 'userName',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.userName} />
          }
        },
        {
          title: '航班时间',
          dataIndex: 'travelTime',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.travelTime} />
          }
        },
        {
          title: '航班信息',
          dataIndex: 'travelInfo',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.travelInfo} />
          }
        },
        {
          title: '票价(元)',
          dataIndex: 'travelPrice',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.travelPrice} />
          }
        },
        {
          title: '民航发展基金(元)',
          dataIndex: 'travelFund',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.travelFund} />
          }
        },
        {
          title: '代理服务费(元)',
          dataIndex: 'travelService',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.travelService} />
          }
        },
        {
          title: '合计(元)',
          dataIndex: 'travelTotalMoney',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.travelTotalMoney} />
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
                    obj.org = v['组织名称']
                    obj.bookTime = ExcelDateToJSDate(v['订票时间'])
                    obj.userName = v['姓名']
                    obj.travelTime = ExcelDateToJSDate(v['航班时间'])
                    obj.travelInfo = v['航班信息']
                    obj.travelPrice = v['票价']
                    obj.travelFund = v['民航发展基金']
                    obj.travelService = v['代理服务费']
                    obj.travelTotalMoney = v['合计']
                    obj.projectCode = v['项目编号']
                    obj.projectName = v['项目/部门名称']
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
    // 计算总和
    cptTotal(arr) {
      // 清空数据
      this.travelPrice = 0
      this.travelFund = 0
      this.travelService = 0
      this.travelTotalMoney = 0
      // 总和计算
      arr.forEach(e => {
        this.travelPrice = this.travelPrice + e.travelPrice
        this.travelFund = this.travelFund + e.travelFund
        this.travelService = this.travelService + e.travelService
        this.travelTotalMoney = this.travelTotalMoney + e.travelTotalMoney
      })
    },
    handleSubmit() {
      const costVo = { ...this.formData }
      costVo.orderTime = this.formData.orderTime.format('YYYY-MM')
      costVo.sealCostOnbuses = [...this.$refs.table.localDataSource]
      try {
        if (this.isUpdate && !this.isEmpty(this.updateRow)) {
          updateOnbus(costVo).then(res => {
            this.$message.success('修改成功!')
            this.$emit('ok')
            this.$emit('close')
          })
        } else {
          addOnbus(costVo).then(res => {
            this.$message.success('保存成功！')
            this.$emit('ok')
            this.$emit('close')
          })
        }
      } catch (error) {
        this.$message.error('出错了!')
      }
    },
    handleCancel() {
      this.$emit('ok')
      this.$emit('close')
    },
    // 下载模板
    download() {
      downloadUtil.resource('/profile/template/差旅成本上报模板.xlsx')
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
        org: '',
        bookTime: '',
        userName: '',
        travelTime: '',
        travelInfo: '',
        travelPrice: '',
        travelFund: '',
        travelService: '',
        travelTotalMoney: '',
        projectCode: '',
        projectName: '',
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
      this.TableDatas = [...this.updateRow.sealCostOnbuses]
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
@import '/src/assets/style/scroll.less';
</style>
