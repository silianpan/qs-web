<!-- 入库申请单明细列表 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <!-- 查询表单 -->
      <div class="table-page-search-wrapper">
        <s-form search layout="inline" @search="refresh()" @reset="reset()" :formItems="searchFormItems" :formData="queryParam"></s-form>
      </div>

      <!-- 业务操作按钮 -->
      <div class="table-operations">
        <a-button type="primary" ghost icon="a-icon-plus" size="small" @click="handleAdd" v-hasPermi="['project:warehouseInDetail:add']">新增</a-button>
        <a-button type="success" plain icon="a-icon-edit" size="small" @click="handleUpdate" v-hasPermi="['project:warehouseInDetail:edit']">修改</a-button>
        <a-button type="danger" plain icon="a-icon-delete" size="small" @click="handleDelete" v-hasPermi="['project:warehouseInDetail:remove']">删除</a-button>
        <a-button type="warning" plain icon="a-icon-download" size="small" @click="handleExport" v-hasPermi="['project:warehouseInDetail:export']">导出</a-button>
        <a-button type="dashed" shape="circle" :style="{ float: 'right' }" icon="reload" @click="refresh()" />
      </div>

      <!-- 数据表格 -->
      <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :rowSelection="rowSelection">
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { listWarehouseInDetail, delWarehouseInDetail, exportWarehouseInDetail } from '/src/api/eos/warehouse/warehouseInDetail'
import { SForm, STable } from '/src/components/index.js'
import WarehouseInDetailForm from './modules/WarehouseInDetailForm'
import WarehouseInDetailDetail from './modules/WarehouseInDetailDetail'

export default {
  name: 'WarehouseInDetail',
  components: {
    SForm,
    STable
  },
  data() {
    return {
      dictKeys: [],
      dictMap: {},
      selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listWarehouseInDetail(Object.assign({}, param, this.queryParam)).then(res => {
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      searchFormItems: [
        {
          type: 'input',
          label: '版本',
          prop: 'version'
        },
        {
          type: 'input',
          label: '租户ID',
          prop: 'tenantId'
        },
        {
          type: 'input',
          label: '入库申请单id',
          prop: 'warehouseInApplyId'
        },
        {
          type: 'input',
          label: '名称',
          prop: 'name'
        },
        {
          type: 'input',
          label: '描述',
          prop: 'description'
        },
        {
          type: 'input',
          label: '所属合同id',
          prop: 'contractId'
        },
        {
          type: 'input',
          label: '单位',
          prop: 'unit'
        },
        {
          type: 'input',
          label: '数量',
          prop: 'amount'
        },
        {
          type: 'input',
          label: '单价(预估)',
          prop: 'price'
        },
        {
          type: 'input',
          label: '总价(预估)',
          prop: 'totalPrice'
        },
        {
          type: 'input',
          label: '规格型号',
          prop: 'spec'
        },
        {
          type: 'datetime',
          label: '计划到货日期',
          prop: 'planDate'
        },
        {
          type: 'input',
          label: '供货商',
          prop: 'supplier'
        },
        {
          type: 'input',
          label: '实际品牌(询价)',
          prop: 'actualBrand'
        },
        {
          type: 'input',
          label: '实际价格(询价)',
          prop: 'actualPrice'
        },
        {
          type: 'input',
          label: '实际总价(询价)',
          prop: 'actualPriceTotal'
        },
        {
          type: 'input',
          label: '价格对比(询价)',
          prop: 'priceDiff'
        }
      ],
      columns: [
        {
          title: '主键ID',
          dataIndex: 'id',
          align: 'center'
        },
        {
          title: '删除标志',
          dataIndex: 'delFlag',
          align: 'center'
        },
        {
          title: '创建者',
          dataIndex: 'createBy',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center'
        },
        {
          title: '更新者',
          dataIndex: 'updateBy',
          align: 'center'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center'
        },
        {
          title: '版本',
          dataIndex: 'version',
          align: 'center'
        },
        {
          title: '租户ID',
          dataIndex: 'tenantId',
          align: 'center'
        },
        {
          title: '入库申请单id',
          dataIndex: 'warehouseInApplyId',
          align: 'center'
        },
        {
          title: '名称',
          dataIndex: 'name',
          align: 'center'
        },
        {
          title: '描述',
          dataIndex: 'description',
          align: 'center'
        },
        {
          title: '所属合同id',
          dataIndex: 'contractId',
          align: 'center'
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center'
        },
        {
          title: '数量',
          dataIndex: 'amount',
          align: 'center'
        },
        {
          title: '单价(预估)',
          dataIndex: 'price',
          align: 'center'
        },
        {
          title: '总价(预估)',
          dataIndex: 'totalPrice',
          align: 'center'
        },
        {
          title: '规格型号',
          dataIndex: 'spec',
          align: 'center'
        },
        {
          title: '计划到货日期',
          dataIndex: 'planDate',
          align: 'center'
        },
        {
          title: '供货商',
          dataIndex: 'supplier',
          align: 'center'
        },
        {
          title: '实际品牌(询价)',
          dataIndex: 'actualBrand',
          align: 'center'
        },
        {
          title: '实际价格(询价)',
          dataIndex: 'actualPrice',
          align: 'center'
        },
        {
          title: '实际总价(询价)',
          dataIndex: 'actualPriceTotal',
          align: 'center'
        },
        {
          title: '价格对比(询价)',
          dataIndex: 'priceDiff',
          align: 'center'
        }
      ]
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  created() {
    // 查询字典
    this.dictKeys.forEach(key => {
      this.getDicts(key).then(res => {
        this.$set(this.dictMap, key, res.data)
      })
    })
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 刷新页面
    refresh() {
      this.$refs.table.refresh(true)
    },
    reset() {
      this.queryParam = {}
    },
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '新增入库明细',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: WarehouseInDetailForm,
          on: {
            ok: () => {
              this.refresh()
            }
          }
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const updateRow = { ...row }
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '修改入库明细',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: WarehouseInDetailForm,
          props: {
            isUpdate: true,
            updateRow
          },
          on: {
            ok: () => {
              this.refresh()
            }
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除入库申请单明细编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delWarehouseInDetail(ids).then(() => {
            this.refresh()
            this.$message.success('删除成功', 3)
          })
        }
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParam = this.queryParam
      this.$antdconfirm({
        title: '导出',
        content: '是否确认导出所有入库申请单明细数据项?',
        onOk: () => {
          return exportWarehouseInDetail(queryParam).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /** 详情 */
    handleDetail(row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '入库明细详情',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: WarehouseInDetailDetail,
          props: {
            row
          }
        }
      })
    }
  }
}
</script>
