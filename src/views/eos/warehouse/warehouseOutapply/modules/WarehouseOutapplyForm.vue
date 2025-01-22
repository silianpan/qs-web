<!-- 出库申请单表单 -->
<template>
  <s-form ref="formTable" single ok okText="保存草稿" hasApplyBtn @apply="handleApply" :queryDictKeys="dictKeys" :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel">
    <template v-slot:footer>
      <a-button type="primary" ghost icon="plus" @click="addLine" style="margin: 5px 0">新增明细</a-button>
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
import { addWarehouseOutapply, updateWarehouseOutapply, getWarehouseOutapply, submitApply } from '/src/api/eos/warehouse/warehouseOutapply'
import { getByProjectAndWarehouse } from '/src/api/eos/warehouse/warehouseInApply'
import { warehouseByProject, queryWarehouse, getStore } from '/src/api/eos/warehouse/warehouse'
import { treeSelect } from '/src/api/eos/project/project.js'
import { delWarehouseOutDetail } from '../../../../../api/eos/warehouse/warehouseOutDetail'

export default {
  name: 'WarehouseOutapplyForm',
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
      // 存放仓库
      warehouseList: [],
      // 入库明细
      inList: [],
      // 出库明细
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
          title: '库房',
          dataIndex: 'warehouseId',
          align: 'center',
          customRender: (text, record) => {
            return (
              <a-select v-model={record.warehouseId} style="width:120px" onSelect={val => this.handleWareSelect(val)}>
                {this.warehouseList.map((op, opIndex) => {
                  return (
                    <a-select-option key={opIndex} value={op['id']}>
                      {op['name']}
                    </a-select-option>
                  )
                })}
              </a-select>
            )
          },
          width: '120px'
        },
        {
          title: '名称',
          dataIndex: 'name',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <a-select v-model={record.name} style="width:120px" onSelect={val => this.handleInSelect(val, index, record)}>
                {this.inList.map((op, opIndex) => {
                  const duplicate = this.tableData.find(item => item.id === op.id)
                  // 这步是将选过的就不再展示了
                  if (!duplicate) {
                    return (
                      <a-select-option key={opIndex} value={op['id']}>
                        {op['name']}
                      </a-select-option>
                    )
                  }
                })}
              </a-select>
            )
          },
          width: '120px'
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
          title: '出库数量',
          dataIndex: 'outNum',
          align: 'center',
          customRender: (text, record) => {
            return (
              <a-input-number
                v-model={record.outNum}
                placeholder="请填写数量"
                min={0}
                precision={2}
                style="width:80px"
                onBlur={e => {
                  if (e.target.value > record.leftN) {
                    delete record.outNum
                    this.$refs.table.refresh()
                    return this.$message.warning('出库数量大于了库存！')
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
      projectList: [],
      dictKeys: [],
      formData: {
        createBy: this.$store.getters.userName,
        nickname: this.$store.getters.nickname,
        code: 'QS' + moment().format('YYYYMM-DDHHmmss'),
        warehouseOutType: 0
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
            type: 'radio',
            label: '出库类型',
            prop: 'warehouseOutType',
            options: [
              { dictValue: 0, dictLabel: '项目采购出库' },
              { dictValue: 1, dictLabel: '非项目采购出库' }
            ],
            compProps: {
              props: {
                disabled: !this.isEmpty(this.updateRow)
              },
              on: {
                change: e => {
                  // 每次切换数据都清空
                  delete this.formData.toProjectId
                  this.warehouseList = []
                  this.inList = []
                  this.tableData = []
                  this.$refs.table.refresh()
                }
              }
            }
          },
          {
            type: 'treeSelect',
            label: '出库到项目',
            prop: 'toProjectId',
            keyAlias: 'id',
            titleAlias: 'label',
            valueAlias: 'id',
            options: () => this.projectList,
            compProps: {
              on: {
                select: val => {
                  this.tableData = []
                  this.$refs.table.refresh()
                  // 计划内出库
                  if (this.formData.warehouseOutType === 0) {
                    // 选择项目后都默认去调一遍只查项目下的入库
                    getByProjectAndWarehouse({ projectId: val }).then(res => {
                      this.inList = res.data
                    })
                    warehouseByProject({ projectId: val }).then(res => {
                      this.warehouseList = res.data
                    })
                  } else {
                    queryWarehouse().then(res => {
                      this.warehouseList = res.data
                    })
                  }
                }
              }
            }
          }
        ]
      ],
      formRules: {
        warehouseOutType: { required: true, message: '请选择', trigger: 'change' },
        toProjectId: { required: true, message: '请输入', trigger: 'change' }
      }
    }
  },
  created() {
    // 首先获取项目的树形数据
    treeSelect({ state: '0' }).then(res => {
      this.projectList = res.data
    })
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      this.formData = { ...this.updateRow }
      this.formData.nickname = this.updateRow.sysUser ? this.updateRow.sysUser.nickName : this.$store.getters.nickname
      if (this.formData.warehouseOutType === 0) {
        // 选择项目后都默认去调一遍只查项目下的入库
        getByProjectAndWarehouse({ projectId: this.updateRow.toProjectId }).then(res => {
          this.inList = res.data
        })
        warehouseByProject({ projectId: this.updateRow.toProjectId }).then(res => {
          this.warehouseList = res.data
        })
      } else {
        queryWarehouse().then(res => {
          this.warehouseList = res.data
        })
      }
      getWarehouseOutapply(this.updateRow.id).then(res => {
        this.tableData = res.data.warehouseOutDetailList
        this.tableData.forEach(item => {
          // 调查库存
          getStore({ warehouseId: item.warehouseId, projectId: this.updateRow.toProjectId, name: item.name }).then(res => {
            item.leftN = res.data.leftNum
            this.$refs.table.refresh()
          })
          if (this.formData.warehouseOutType === 0) {
            if (item.warehouseId) {
              getByProjectAndWarehouse({ projectId: this.updateRow.toProjectId, warehouseId: item.warehouseId }).then(res => {
                this.inList = res.data
              })
            } else {
              getByProjectAndWarehouse({ projectId: this.updateRow.toProjectId }).then(res => {
                this.inList = res.data
              })
            }
          } else {
            // 计划外就查所有库房的 不在项目下的
            getByProjectAndWarehouse({ warehouseId: item.warehouseId }).then(res => {
              this.inList = res.data
            })
          }
        })
        this.$refs.table.refresh()
      })
    }
  },
  methods: {
    async handleSubmit(callbackFunc) {
      const fd = { ...this.formData }
      fd.warehouseOutDetailList = this.tableData
      // 更新或添加
      let res = null
      if (this.isUpdate && !this.isEmpty(fd.id)) {
        res = await updateWarehouseOutapply(fd)
      } else {
        res = await addWarehouseOutapply(fd)
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
    // 新增明细
    addLine() {
      if (this.isEmpty(this.formData.toProjectId)) return this.$message.warning('先选择项目,再添加明细!')
      let status = true
      if (this.tableData.length > 0) {
        // 提取出必填项目
        const value = this.tableData.map(({ outNum }) => ({ outNum }))
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
    handleWareSelect(warehouseId) {
      if (this.formData.warehouseOutType === 0) {
        // 计划内就要传projectId
        if (warehouseId) {
          // 选了库房再查项目和库房下的
          getByProjectAndWarehouse({ projectId: this.formData.toProjectId, warehouseId: warehouseId }).then(res => {
            this.inList = res.data
          })
        } else {
          // 没选就直接查项目下的不在库房的
          getByProjectAndWarehouse({ projectId: this.formData.toProjectId }).then(res => {
            this.inList = res.data
          })
        }
      } else {
        // 计划外就查所有库房的 不在项目下的
        getByProjectAndWarehouse({ warehouseId: warehouseId }).then(res => {
          this.inList = res.data
        })
      }
    },
    handleInSelect(id, index, record) {
      const col = this.inList.find(item => item.id === id)
      this.tableData[index] = Object.assign(this.tableData[index], col)
      this.$refs.table.refresh()
      // 调查库存
      getStore({ warehouseId: record.warehouseId, projectId: this.formData.toProjectId, name: record.name }).then(res => {
        this.tableData[index].leftN = res.data.leftNum
        this.$refs.table.refresh()
      })
    },
    // 明细删除
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
