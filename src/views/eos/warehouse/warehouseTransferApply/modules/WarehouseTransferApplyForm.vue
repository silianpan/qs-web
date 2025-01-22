<!-- 划拨申请单表单 -->
<template>
  <s-form ref="formTable" single ok okText="保存草稿" hasApplyBtn @apply="handleApply" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel">
    <template v-slot:footer>
      <div class="border">
        <s-table ref="table" size="default" :rowKey="(_, index) => index" :columns="columns" :data="loadData" :showPagination="false" :scroll="{ x: true }">
          <span slot="action" slot-scope="text, record">
            <a-popconfirm v-if="tableData.length" title="确认删除该行吗?" @confirm="() => handleDelete(record)" ok-text="确认" cancel-text="取消">
              <a href="javascript:;" style="color: red">删除</a>
            </a-popconfirm>
          </span>
        </s-table>
      </div>
    </template>
  </s-form>
</template>

<script lang="jsx">
import moment from 'moment'
import { SForm, STable } from '/src/components/index.js'
import { addWarehouseTransferApply, updateWarehouseTransferApply, getWarehouseTransferApply, submitApply } from '/src/api/eos/warehouse/warehouseTransferApply'
import { warehouseByProject, getStore } from '/src/api/eos/warehouse/warehouse'
import { getByProjectAndWarehouse } from '/src/api/eos/warehouse/warehouseInApply'
import { treeSelect } from '/src/api/eos/project/project.js'

export default {
  name: 'WarehouseTransferApplyForm',
  components: {
    SForm,
    STable
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
      // 原项目
      sourceProjectList: [],
      // 目的项目
      targetProjectList: [],
      // 原库房
      sourceWarehouseList: [],
      // 目的库房
      targetWarehouseList: [],
      // 划拨明细
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
          width: '80px'
        },
        {
          title: '描述',
          dataIndex: 'description',
          align: 'center',
          width: '80px'
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center',
          width: '80px'
        },
        {
          title: '数量',
          dataIndex: 'amount',
          align: 'center',
          width: '80px'
        },
        {
          title: '单价',
          dataIndex: 'price',
          align: 'center',
          width: '80px'
        },
        {
          title: '总价',
          dataIndex: 'totalPrice',
          align: 'center',
          width: '80px'
        },
        {
          title: '型号规格',
          dataIndex: 'spec',
          align: 'center',
          width: '80px'
        },
        // 询价字段暂去
        // {
        //   title: '采购数量',
        //   dataIndex: 'purchaseNum',
        //   align: 'center',
        //   width: '80px'
        // },
        // {
        //   title: '计划到货日期',
        //   dataIndex: 'planDate',
        //   align: 'center',
        //   customRender: val => {
        //     if (val) {
        //       return moment(val).format('YYYY/MM/DD')
        //     }
        //   },
        //   width: '80px'
        // },
        // {
        //   title: '供货商',
        //   dataIndex: 'supplier',
        //   align: 'center',
        //   width: '80px'
        // },
        // {
        //   title: '收货人',
        //   dataIndex: 'consignee',
        //   align: 'center',
        //   width: '80px'
        // },
        // {
        //   title: '收货地址',
        //   dataIndex: 'consigneeAddress',
        //   align: 'center',
        //   width: '80px'
        // },
        // {
        //   title: '实际品牌',
        //   dataIndex: 'actualBrand',
        //   align: 'center',
        //   width: '80px'
        // },
        // {
        //   title: '实际价格',
        //   dataIndex: 'actualPrice',
        //   align: 'center',
        //   width: '80px'
        // },
        // {
        //   title: '实际总价',
        //   dataIndex: 'actualPriceTotal',
        //   align: 'center',
        //   width: '80px'
        // },
        // {
        //   title: '价格对比',
        //   dataIndex: 'priceDiff',
        //   align: 'center',
        //   width: '80px'
        // },
        // {
        //   title: '总价对比',
        //   dataIndex: 'priceDiffTotal',
        //   align: 'center',
        //   width: '80px'
        // },
        {
          title: '库存',
          dataIndex: 'leftN',
          align: 'center',
          width: '120px'
        },
        {
          title: '划拨数量',
          dataIndex: 'transferNum',
          align: 'center',
          customRender: (text, record) => {
            return (
              <a-input-number
                v-model={record.transferNum}
                placeholder="请填写数量"
                min={0}
                precision={2}
                style="width:130px"
                onBlur={e => {
                  if (e.target.value > record.leftN) {
                    delete record.transferNum
                    this.$refs.table.refresh()
                    return this.$message.warning('划拨数量大于了库存！')
                  }
                }}
              ></a-input-number>
            )
          },
          width: '80px'
        },
        {
          title: '操作',
          align: 'center',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      formData: {
        createBy: this.$store.getters.nickname,
        nickname: this.$store.getters.nickname,
        code: 'QS' + moment().format('YYYYMM-DDHHmmss')
      },
      formItems: [
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
            type: 'treeSelect',
            label: '原项目',
            prop: 'sourceProjectId',
            options: () => this.sourceProjectList,
            keyAlias: 'id',
            titleAlias: 'label',
            valueAlias: 'id',
            compProps: {
              props: { allowClear: false },
              on: {
                select: val => {
                  // 先清空
                  delete this.formData.sourceWarehouseId
                  this.sourceWarehouseList = []
                  this.tableData = []
                  this.$refs.table.refresh(true)
                  // 选择项目后都默认去调一遍只查项目下的入库
                  getByProjectAndWarehouse({ projectId: val }).then(res => {
                    this.tableData = res.data
                    this.tableData.forEach(item => {
                      // 调查库存
                      getStore({ projectId: this.formData.sourceProjectId, name: item.name }).then(res => {
                        item.leftN = res.data.leftNum
                        this.$refs.table.refresh()
                      })
                    })
                    this.$refs.table.refresh(true)
                  })
                  // 查询该项目下的库房
                  warehouseByProject({ projectId: val }).then(res => {
                    this.sourceWarehouseList = res.data
                  })
                }
              }
            }
          },
          {
            type: 'select',
            label: '原库房',
            prop: 'sourceWarehouseId',
            labelAlias: 'name',
            valueAlias: 'id',
            options: () => this.sourceWarehouseList,
            compProps: {
              props: { allowClear: false },
              on: {
                select: val => {
                  this.tableData = []
                  this.$refs.table.refresh(true)
                  getByProjectAndWarehouse({ projectId: this.formData.sourceProjectId, warehouseId: val }).then(res => {
                    this.tableData = res.data
                    this.tableData.forEach(item => {
                      // 调查库存
                      getStore({ warehouseId: this.formData.sourceWarehouseId, projectId: this.formData.sourceProjectId, name: item.name }).then(res => {
                        item.leftN = res.data.leftNum
                        this.$refs.table.refresh()
                      })
                    })
                    this.$refs.table.refresh(true)
                  })
                }
              }
            }
          }
        ],
        [
          {
            type: 'treeSelect',
            label: '目的项目',
            prop: 'targetProjectId',
            options: () => this.targetProjectList,
            keyAlias: 'id',
            titleAlias: 'label',
            valueAlias: 'id',
            compProps: {
              props: { allowClear: false },
              on: {
                select: val => {
                  // 先清空
                  delete this.formData.targetWarehouseId
                  this.targetWarehouseList = []
                  // 查询该项目下的库房
                  warehouseByProject({ projectId: val }).then(res => {
                    this.targetWarehouseList = res.data
                  })
                }
              }
            }
          },
          {
            type: 'select',
            label: '目的库房',
            prop: 'targetWarehouseId',
            labelAlias: 'name',
            valueAlias: 'id',
            options: () => this.targetWarehouseList,
            compProps: {
              props: { allowClear: false }
            }
          }
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
        sourceProjectId: { required: true, message: '请输入', trigger: 'change' },
        targetProjectId: { required: true, message: '请输入', trigger: 'change' }
        // sourceWarehouseId: { required: true, message: '请输入', trigger: 'change' },
        // targetWarehouseId: { required: true, message: '请输入', trigger: 'change' }
      }
    }
  },
  created() {
    // 先查询项目
    treeSelect({ state: '0' }).then(res => {
      this.sourceProjectList = res.data
      this.targetProjectList = res.data
    })
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formData = { ...this.updateRow }
      this.formData.nickname = this.updateRow.sysUser ? this.updateRow.sysUser.nickName : this.$store.getters.nickname
      // 查询该项目下的库房
      warehouseByProject({ projectId: this.updateRow.sourceProjectId }).then(res => {
        this.sourceWarehouseList = res.data
      })
      // 查询该项目下的库房
      warehouseByProject({ projectId: this.updateRow.targetProjectId }).then(res => {
        this.targetWarehouseList = res.data
      })
      getWarehouseTransferApply(this.updateRow.id).then(res => {
        this.tableData = res.data.transferDetailList
        this.tableData.forEach(item => {
          // 调查库存
          getStore({ warehouseId: this.updateRow.sourceWarehouseId, projectId: this.updateRow.sourceProjectId, name: item.name }).then(res => {
            item.leftN = res.data.leftNum
            this.$refs.table.refresh()
          })
        })
        this.$refs.table.refresh()
      })
    }
  },
  methods: {
    async handleSubmit(callbackFunc) {
      const fd = { ...this.formData }
      fd.transferDetailList = this.tableData
      // 更新或添加
      let res = null
      if (this.isUpdate && !this.isEmpty(fd.id)) {
        res = await updateWarehouseTransferApply(fd)
      } else {
        res = await addWarehouseTransferApply(fd)
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
    // 删除表格中的每行
    handleDelete(data) {
      // 在这里不去调删除明细的接口是因为取消操作会导致删除不可复原
      // 修改中的删除都由后台先删后加
      const index = this.tableData.findIndex(t => t.id === data.id)
      this.tableData.splice(index, 1)
      this.$refs.table.refresh(true)
    }
  }
}
</script>
