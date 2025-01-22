<!-- 采购申请表单 -->
<template>
  <s-form ref="purchaseApplyForm" ok okText="保存草稿" hasApplyBtn @apply="handleApply" single :queryDictKeys="dictKeys" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel">
    <template v-slot:footer>
      <a-button type="primary" ghost icon="plus" @click="inAddLine" style="margin: 5px 0">新增明细</a-button>
      <SUpload :uploadData="uploadData" btn="导入" style="margin: 5px 0px 5px 5px" />
      <a-button type="primary" ghost icon="download" @click="downloadTemp" style="margin-left: 5px">下载模板</a-button>

      <div class="border">
        <a-spin :spinning="spinning" style="margin-top: 10px">
          <s-table ref="inTable" size="default" :rowKey="(_, index) => index" :columns="columns" :data="loadData" :showPagination="false" :scroll="{ x: true }">
            <span slot="action" slot-scope="text, record, index">
              <a-popconfirm v-if="inTableData.length" title="确认删除该行吗?" @confirm="() => handleDelete(record, index)" ok-text="确认" cancel-text="取消">
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
import { SForm, STable, SUpload } from '/src/components/index.js'
import { addPurchase, editPurchase, delDetail, submitApply, getDetail } from '/src/api/eos/purchase/purchase.js'
import { treePlanProject } from '/src/api/eos/project/project.js'
import { listByProject } from '/src/api/eos/contract/contract.js'
import { getAmountListByContract } from '/src/api/eos/contract/list.js'
import { BigType } from '/src/api/eos/budget/type.js'
import { allTree } from '/src/api/system/dept.js'
import { getByUsername } from '/src/api/system/user.js'
import downloadUtil from '../../../../../utils/common/download'
import { importfile } from '../../../../../utils/common/excel'

export default {
  name: 'Apply',
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
      // 部门列表
      deptList: [],
      // 预算大类
      budgetTypeOptions: [],
      dictKeys: [],
      // 表单数据
      formData: {
        createBy: this.$store.getters.userName,
        nickname: this.$store.getters.nickname,
        code: 'QS' + moment().format('YYYYMM-DDHHmmss'),
        purchaseType: 0
      },
      projectList: [],
      contractList: [],
      // 选中的合同
      chooseContract: null,
      // 选中的项目
      chooseProject: {},
      /* 采购明细 */
      inTableData: [],
      // 加载明细数据
      loadData: param => {
        return new Promise(resolve => {
          resolve(param)
        }).then(param => {
          return {
            data: this.inTableData
          }
        })
      },
      formItems1: [
        [
          {
            type: 'text',
            label: '申请编号',
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
            label: '采购类型',
            colspan: 8,
            prop: 'purchaseType',
            options: [
              { dictValue: 0, dictLabel: '项目采购' },
              { dictValue: 1, dictLabel: '非项目采购' }
            ],
            compProps: {
              style: {
                width: '100%'
              },
              class: 's-ml-8',
              on: {
                change: e => {
                  if (e.target.value === 0) {
                    // 查询预算大类
                    BigType().then(res => {
                      this.budgetTypeOptions = res.data
                    })
                  } else {
                    // 默认选中个人所在部门
                    getByUsername({ userName: this.$store.getters.userName }).then(res => {
                      this.$set(this.formData, 'deptId', res.data.dept.deptId)
                    })
                  }
                  this.inTableData = []
                  delete this.formData.projectId
                  delete this.formData.contractId
                  this.$refs.inTable.refresh(true)
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
            type: 'select',
            prop: 'budgetType',
            label: '预算大类',
            valueAlias: 'type',
            labelAlias: 'type',
            options: () => this.budgetTypeOptions
          },
          {}
        ]
      ],
      formItems4: [
        [
          {
            type: 'treeSelect',
            label: '项目名称',
            prop: 'projectId',
            keyAlias: 'id',
            titleAlias: 'label',
            valueAlias: 'id',
            options: () => this.projectList,
            compProps: {
              props: {
                allowClear: false
              },
              on: {
                select: value => {
                  this.chooseProject = this.projectList.filter(item => value === item.id)[0]
                  // 这里不能置空，删除contractId字段，否则无法响应式
                  delete this.formData.contractId
                  this.inTableData = []
                  this.$refs.inTable.refresh(true)
                  /* 查询收入合同 */
                  listByProject({ projectId: value, type: '收入合同' }).then(res => {
                    this.contractList = res.data
                    // 只有一个收入合同的时候 就直接显示并将清单带出
                    if (this.contractList.length === 1) {
                      this.$set(this.formData, 'contractId', this.contractList[0].id)
                      getAmountListByContract({ contractId: this.formData.contractId, type: '物料' }).then(res => {
                        const temp = res.rows.map(item => {
                          return {
                            id: item.id,
                            name: item.name,
                            description: item.description,
                            unit: item.unit,
                            amount: item.amount,
                            price: item.price,
                            totalPrice: item.totalPrice,
                            spec: item.spec
                          }
                        })
                        this.inTableData = temp
                        this.$refs.inTable.refresh(true)
                      })
                    }
                  })
                }
              }
            }
          },
          {
            type: 'select',
            label: '合同名称',
            prop: 'contractId',
            colspan: 4,
            valueAlias: 'id',
            labelAlias: 'name',
            options: () => this.contractList,
            compProps: {
              on: {
                select: value => {
                  this.chooseContract = this.contractList.filter(item => value === item.id)[0]
                  getAmountListByContract({ contractId: this.formData.contractId, type: '物料' }).then(res => {
                    const temp = res.rows.map(item => {
                      return {
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        unit: item.unit,
                        amount: item.amount,
                        price: item.price,
                        totalPrice: item.totalPrice,
                        spec: item.spec
                      }
                    })
                    this.inTableData = temp
                    this.$refs.inTable.refresh(true)
                  })
                }
              }
            }
          }
        ]
      ],
      formItems3: [
        [
          {
            type: 'inputTextArea',
            label: '采购事由',
            prop: 'remark',
            colspan: 4
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
        ]
      ],
      formItems5: [
        [
          {
            type: 'treeSelect',
            prop: 'deptId',
            label: '所属部门',
            options: () => this.deptList,
            keyAlias: 'id',
            titleAlias: 'label',
            valueAlias: 'id'
          },
          {}
        ]
      ],
      formRules: {
        projectId: { required: true, message: '请选择项目', trigger: 'change' },
        budgetType: { required: true, message: '请选择预算大类', trigger: 'change' },
        // contractId: { required: true, message: '请选择合同', trigger: 'change' }
        deptId: { required: true, message: '请选择部门', trigger: 'change' }
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
          title: '名称',
          dataIndex: 'name',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input v-model={record.name} style="width:100px" placeholder="请填写名称"></a-input>
          }
        },
        {
          title: '采购数量',
          dataIndex: 'purchaseNum',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <a-input-number
                v-model={record.purchaseNum}
                placeholder="请填写采购数量"
                min={0}
                precision={2}
                style="width:130px"
                on-change={() => {
                  if (record.purchaseNum && record.price) {
                    record.totalPrice = record.amount * record.price
                  }
                }}
              ></a-input-number>
            )
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
            return (
              <a-input-number
                on-change={() => {
                  if (record.purchaseNum && record.price) {
                    record.totalPrice = record.amount * record.price
                  }
                }}
                v-model={record.price}
                placeholder="请填写单价"
                min={0}
                precision={2}
                style="width:130px"
              ></a-input-number>
            )
          }
        },
        {
          title: '总价',
          dataIndex: 'totalPrice',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <a-input-number
                on-change={() => {
                  if (record.purchaseNum) {
                    record.price = record.totalPrice / record.purchaseNum
                  }
                }}
                v-model={record.totalPrice}
                placeholder="请填写总价"
                min={0}
                precision={2}
                style="width:130px"
              ></a-input-number>
            )
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
          title: '描述',
          dataIndex: 'description',
          align: 'center',
          customRender: (text, record, index) => {
            return <a-input v-model={record.description} style="width:150px" placeholder="请填写描述"></a-input>
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
                    obj.name = item['设备名称']
                    obj.purchaseNum = item['数量']
                    obj.unit = item['单位']
                    obj.amount = item['数量']
                    obj.price = item['设备单价']
                    obj.totalPrice = item['金额小计']
                    obj.spec = item['规格/参数']
                    obj.description = item['备注']
                    this.inTableData.push(obj)
                  })
                })
              }
            }
          }
        }
      }
    }
  },
  computed: {
    formItems() {
      const { formItems1, formItems2, formItems3, formItems4, formItems5 } = this
      const { purchaseType } = this.formData
      if (purchaseType === 0) {
        return [...formItems1, ...formItems4, ...formItems2, ...formItems3]
      } else if (purchaseType === 1) {
        return [...formItems1, ...formItems5, ...formItems3]
      } else {
        return null
      }
    }
  },
  methods: {
    handleDelete(data, index) {
      // 修改的时候 查出来的数据调接口 新增直接删
      if (data.purchaseApplyId) {
        // 调删除明细的接口
        delDetail([data.id]).then(res => {
          const tableData = [...this.inTableData]
          this.inTableData = tableData.filter(item => {
            return item.id !== data.id
          })
          this.$refs.inTable.refresh(true)
        })
      } else {
        // 找到当前数据的index
        // const index = this.inTableData.findIndex(t => t.id === data.id)
        this.inTableData.splice(index, 1)
        this.$refs.inTable.refresh(true)
      }
    },
    onOk() {
      return new Promise(resolve => {
        resolve(true)
      })
    },
    onCancel() {
      return new Promise(resolve => {
        resolve(true)
      })
    },
    // 模板下载
    downloadTemp() {
      downloadUtil.resource('/profile/template/物料采购申请清单模板.xlsx')
    },
    async handleSubmit(callbackFunc) {
      for (const index in this.inTableData) {
        const item = this.inTableData[index]
        for (const key in item) {
          if (item[key] === null && item[key] === undefined && item[key] === '') {
            return this.$message.error('请将每行填写完整')
          }
        }
      }
      this.formData.purchaseApplyDetail = this.inTableData
      // 新增或修改
      let res = null
      try {
        if (this.isUpdate && this.updateRow.id) {
          res = await editPurchase(this.formData)
        } else {
          res = await addPurchase(this.formData)
        }
        if (callbackFunc instanceof Function) {
          callbackFunc(res)
        } else {
          this.$message.success(res.msg)
          this.$emit('ok')
          this.$emit('close')
        }
      } catch {
        this.$refs.purchaseApplyForm.loading = false
        this.$refs.purchaseApplyForm.saveBtnLoading = false
      }
    },
    // 直接提交
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
        this.$refs.purchaseApplyForm.loading = false
        this.$refs.purchaseApplyForm.saveBtnLoading = false
      }
    },
    handleCancel() {
      this.$emit('ok')
      this.$emit('close')
    },
    /** 计划内新增明细 **/
    inAddLine() {
      if (this.formData.purchaseType === 0 && this.isEmpty(this.formData.projectId)) return this.$message.warning('先选择项目,再添加明细!')
      let status = true
      if (this.inTableData.length > 0) {
        // 提取出必填项目
        const value = this.inTableData.map(({ name, unit, amount, price, totalPrice, spec }) => ({ name, unit, amount, price, totalPrice, spec }))
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
          this.inTableData.push(newValue)
          this.$refs.inTable.refresh(true)
        }
      } else {
        const newValue = {}
        this.inTableData.push(newValue)
        this.$refs.inTable.refresh(true)
      }
    }
  },
  created() {
    // 获取部门下拉树
    allTree().then(res => {
      this.deptList = res.data
    })
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      const { purchaseApplyDetail, ...data } = { ...this.updateRow }
      this.formData = data
      getDetail(this.formData.id).then(res => {
        this.inTableData = res.data.purchaseApplyDetail
        this.$refs.inTable.refresh()
      })
      this.formData.nickname = this.updateRow.sysUser ? this.updateRow.sysUser.nickName : this.$store.getters.nickname
      if (this.updateRow.purchaseType === 0) {
        listByProject({ projectId: data.projectId, type: '收入合同' }).then(res => {
          this.contractList = res.data
        })
      }
    }
    // 首先获取项目的额树形数据
    treePlanProject({ state: '0' }).then(res => {
      this.projectList = res.data
    })
    // 只有项目采购才查询预算大类
    if (this.formData.purchaseType === 0) {
      // 查询预算大类
      BigType().then(res => {
        this.budgetTypeOptions = res.data
      })
    }
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
