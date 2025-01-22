<!-- 入库申请单表单 -->
<template>
  <s-form ref="formTable" ok okText="保存草稿" hasApplyBtn @apply="handleApply" single :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel">
    <template v-slot:footer>
      <div class="border">
        <a-button type="primary" ghost icon="plus" @click="addLine" style="margin-right: 10px">新增明细</a-button>
        <a-button type="primary" ghost icon="download" @click="downloadTemp" style="margin-right: 10px">下载模板</a-button>
        <SUpload :uploadData="uploadData" btn="导入模板" style="margin: 5px 0px 5px 5px" />

        <a-spin :spinning="spinning" style="margin-top: 10px">
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
</template>

<script lang="jsx">
import moment from 'moment'
import downloadUtil from '/src/utils/common/download.js'
import { SForm, STable, SUpload } from '/src/components/index.js'
import { addWarehouseInApply, updateWarehouseInApply, getWarehouseInApply, submitApply } from '/src/api/eos/warehouse/warehouseInApply'
import { delWarehouseInDetail } from '/src/api/eos/warehouse/warehouseInDetail.js'
import { queryWarehouse } from '/src/api/eos/warehouse/warehouse'
import { treeSelect } from '/src/api/eos/project/project.js'
import { getPayment } from '/src/api/eos/purchase/payment.js'
import { importfile } from '/src/utils/common/excel.js'
import SelectPayment from '/src/views/eos/warehouse/warehouseInApply/modules/SelectPayment.vue'

export default {
  name: 'WarehouseInApplyForm',
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
  data() {
    return {
      spinning: false,
      // 入库明细
      tableData: [],
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
      columns: [
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
            return <a-input-number v-model={record.amount} placeholder="请填写数量" min={0} precision={2} style="width:130px"></a-input-number>
          }
        },
        {
          title: '单价',
          dataIndex: 'price',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input-number v-model={record.price} placeholder="请填写单价" min={0} precision={2} style="width:130px"></a-input-number>
          }
        },
        {
          title: '总价',
          dataIndex: 'totalPrice',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input-number v-model={record.totalPrice} placeholder="请填写总价" min={0} precision={2} style="width:130px"></a-input-number>
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
          title: '入库数量',
          dataIndex: 'inNum',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input v-model={record.inNum} style="width:120px" placeholder="请填写采购数量"></a-input>
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
      // 付款list
      paymentList: [],
      // 库房列表
      warehouseList: [],
      // 项目列表
      projectList: [],
      formData: {
        createBy: this.$store.getters.userName,
        nickname: this.$store.getters.nickname,
        code: 'QS' + moment().format('YYYYMM-DDHHmmss'),
        warehouseInType: 0
      },
      formItems1: [
        [
          {
            type: 'text',
            label: '申请单编号',
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
            type: 'radio',
            prop: 'warehouseInType',
            label: '入库类型',
            options: () => [
              { label: '项目采购入库', value: 0 },
              { label: '非项目采购入库', value: 1 }
            ],
            labelAlias: 'label',
            valueAlias: 'value',
            compProps: {
              props: {
                disabled: !this.isEmpty(this.updateRow)
              },
              on: {
                change: e => {
                  delete this.formData.projectId
                  delete this.formData.paymentCode
                  delete this.formData.paymentId
                  delete this.formData.warehouseId
                  this.tableData = []
                  this.$refs.table.refresh(true)
                  // 项目入库
                  if (e.target.value === 0) {
                    this.formRules = {
                      projectId: { required: true, message: '请选择项目', trigger: 'change' }
                    }
                  } else {
                    this.formRules = {
                      projectId: { required: true, message: '请选择项目', trigger: 'change' },
                      warehouseId: { required: true, message: '请选择库房', trigger: 'change' }
                    }
                  }
                }
              }
            }
          },
          {}
        ]
      ],
      formItems2: [
        [
          {
            type: 'treeSelect',
            prop: 'projectId',
            label: '选择项目',
            options: () => this.projectList,
            keyAlias: 'id',
            titleAlias: 'label',
            valueAlias: 'id',
            compProps: {
              on: {
                select: val => {
                  delete this.formData.paymentCode
                  delete this.formData.paymentId
                  delete this.formData.warehouseId
                  this.tableData = []
                  this.$refs.table.refresh()
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
            type: 'select',
            label: '采购付款编号',
            prop: 'paymentCode',
            allowClear: true,
            options: () => this.paymentList,
            compProps: {
              on: {
                focus: e => {
                  this.handleAssociated()
                }
              }
            }
          },
          {}
        ],
        [
          {
            type: 'select',
            label: '库房',
            prop: 'warehouseId',
            valueAlias: 'id',
            labelAlias: 'name',
            options: () => this.warehouseList,
            allowClear: true
            // compProps: {
            //   on: {
            //     select: value => {
            //     }
            //   }
            // }
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
      formRules: {
        // paymentCode: { required: true, message: '请输入', trigger: 'change' },
        projectId: { required: true, message: '请选择项目', trigger: 'change' }
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
                    obj.name = item['名称']
                    obj.description = item['描述']
                    obj.unit = item['单位']
                    obj.amount = item['数量']
                    obj.price = item['单价']
                    obj.totalPrice = item['总价']
                    obj.spec = item['型号规格']
                    obj.inNum = item['入库数量']
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
    // 查询所有库房
    queryWarehouse().then(res => (this.warehouseList = res.data))
    // 查询项目
    treeSelect({ state: 0 }).then(res => {
      this.projectList = res.data
    })
    // 更新回显操作
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formData = { ...this.updateRow }
      this.formData.nickname = this.updateRow.sysUser ? this.updateRow.sysUser.nickName : this.$store.getters.nickname
      if (this.updateRow.payment) {
        this.$set(this.formData, 'paymentCode', this.updateRow.payment.code)
      }
      getWarehouseInApply(this.updateRow.id).then(res => {
        this.tableData = res.data.warehouseInDetailList
        this.$refs.table.refresh(true)
      })
    }
  },
  methods: {
    async handleSubmit(callbackFunc) {
      const fd = { ...this.formData }
      fd.warehouseInDetailList = this.tableData
      // 更新或添加
      let res = null
      if (this.isUpdate && !this.isEmpty(fd.id)) {
        res = await updateWarehouseInApply(fd)
      } else {
        res = await addWarehouseInApply(fd)
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
    // 弹出付款选择框
    handleAssociated() {
      const isProject = this.formData.warehouseInType === 0
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '付款申请列表',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: SelectPayment,
          props: {
            selectType: 'radio',
            isProject: isProject,
            projectId: this.formData.projectId
          },
          on: {
            ok: (Rows, Keys) => {
              const payment = Rows[0]
              // 查询对应的付款明细
              getPayment(payment.id).then(res => {
                const ret = res.data.paymentDetailList.map(item => {
                  delete item.id
                  return item
                })
                this.tableData = ret
                this.$refs.table.refresh(true)
              })

              this.$set(this.formData, 'paymentCode', payment.code)
              this.$set(this.formData, 'paymentId', Keys[0])
            }
          }
        }
      })
    },
    addLine() {
      let status = true
      if (this.tableData.length > 0) {
        // 提取出必填项目
        const value = this.tableData.map(({ name, unit, amount, spec, inNum }) => ({ name, unit, amount, spec, inNum }))
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
      downloadUtil.resource('/profile/template/入库清单模板.xlsx')
    },
    // 明细删除
    handleDelete(data, index) {
      // 修改的时候 查出来的数据调接口 新增直接删
      if (data.id) {
        // 调删除明细的接口
        delWarehouseInDetail(data.id).then(res => {
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
    }
  },
  computed: {
    formItems() {
      const { formItems1, formItems2, formItems3 } = this
      // 项目采购
      if (this.formData.warehouseInType === 0) {
        return [...formItems1, ...formItems2, ...formItems3]
      } else {
        return [...formItems1, ...formItems3]
      }
    }
  },
  watch: {
    'formData.paymentCode': {
      handler(newV, oldV) {
        // ...
        if (this.isEmpty(newV)) {
          delete this.formData.paymentId
          this.tableData = []
          this.$nextTick(() => {
            this.$refs.table.refresh(true)
          })
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
