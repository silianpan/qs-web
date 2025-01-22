<!-- 库房管理列表 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="handleAdd">新增</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索库房名称、库房地址" @onSearch="onSearch" />
      </div>
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record">
          <s-action-columns :actions="getTableActions(record)" :record="record" />
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
// import dictConfig from '/src/views/eos/config/dict.config.js'
import { listWarehouse, delWarehouse, exportWarehouse } from '/src/api/eos/warehouse/warehouse'
import { SSearch, STable, SActionColumns } from '/src/components/index.js'
import WarehouseForm from './modules/WarehouseForm'
import WarehouseDetail from './modules/WarehouseDetail'
import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'

export default {
  name: 'Warehouse',
  components: {
    SSearch,
    STable,
    SActionColumns
  },
  data() {
    return {
      rowClick: record => ({
        on: {
          click: () => {
            this.handleDetail(record, record.id)
          }
        },
        style: {
          cursor: 'pointer'
        }
      }),
      actions: [
        {
          label: '修改',
          icon: 'iconfont-bianji',
          action: this.handleUpdate
        },
        {
          label: '删除',
          icon: 'iconfont-shanchu',
          action: this.handleDelete
        }
      ],
      /* 是否有数据 */
      noData: false,
      dictKeys: [],
      dictMap: {},
      selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listWarehouse(Object.assign({}, param, this.queryParam)).then(res => {
          this.noData = res.total === 0
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
          label: '库房名称',
          prop: 'name'
        },
        {
          type: 'input',
          label: '库房地址',
          prop: 'address'
        },
        {
          type: 'input',
          label: '库房编号',
          prop: 'code'
        }
      ],
      columns: [
        {
          title: '库房编号',
          dataIndex: 'code',
          align: 'left'
        },
        {
          title: '库房名称',
          dataIndex: 'name',
          align: 'left'
        },
        {
          title: '库房地址',
          dataIndex: 'address',
          align: 'left',
          customRender: text => {
            return text ? (
              <Ellipsis length={16} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'left',
          customRender: text => {
            return text ? (
              <Ellipsis length={16} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          title: '操作',
          width: 160,
          align: 'left',
          scopedSlots: { customRender: 'action' }
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
    /* 查询按钮 */
    clickquery(param) {
      this.queryParam = { ...this.queryParam, orderByColumn: param }
      this.refresh()
    },
    /* 查询按钮 */
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    },
    // 刷新页面
    refresh() {
      this.$refs.table.refresh(true)
    },
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '新增库房',
          width: '45%',
          maskClosable: true
        },
        content: {
          template: WarehouseForm,
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
          title: '修改库房',
          width: '45%',
          maskClosable: true
        },
        content: {
          template: WarehouseForm,
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
        content: '是否确认删除库房管理编号为"' + row.code + '"的数据项?',
        onOk: () => {
          return delWarehouse(ids).then(() => {
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
        content: '是否确认导出所有库房管理数据项?',
        onOk: () => {
          return exportWarehouse(queryParam).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /** 详情 */
    handleDetail(row, formId) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '库房详情',
          width: '45%',
          maskClosable: true
        },
        content: {
          template: WarehouseDetail,
          props: {
            row,
            formId
          }
        }
      })
    },
    getTableActions(record) {
      return this.actions
    }
  }
}
</script>
