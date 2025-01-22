<!-- 出库申请单列表 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="handleAdd">新增</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索项目名称、申请人、申请编号、出库类型" @onSearch="onSearch" />
      </div>
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record">
          <BusCommit :handleUpdate="handleUpdate" :handleDelete="handleDelete" :requestMapping="'/project/warehouseOutapply'" :busForm="record" @getList="refresh" />
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import { listWarehouseOutapply, delWarehouseOutapply, exportWarehouseOutapply } from '/src/api/eos/warehouse/warehouseOutapply'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import WarehouseOutapplyForm from './modules/WarehouseOutapplyForm'
import WarehouseOutapplyDetail from './modules/WarehouseOutapplyDetail'
import BusCommit from '/src/components/Activiti/BusCommit.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  name: 'WarehouseOutapply',
  components: {
    SSearch,
    STable,
    BusCommit
  },
  data() {
    return {
      rowClick: record => ({
        on: {
          click: () => {
            this.handleDetail(record)
          }
        },
        style: {
          cursor: 'pointer'
        }
      }),
      /* 是否有数据 */
      noData: false,
      dictKeys: [],
      dictMap: {},
      selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'woa_create_time'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listWarehouseOutapply(Object.assign({}, param, this.queryParam)).then(res => {
          this.noData = res.total === 0
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      columns: [
        {
          title: '申请人',
          align: 'left',
          dataIndex: 'sealWorkflow.applyUserName'
        },
        {
          title: '申请时间',
          align: 'left',
          dataIndex: 'sealWorkflow.applyTime',
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
          title: '出库编号',
          dataIndex: 'code',
          align: 'left'
        },
        {
          title: '出库到的项目名称',
          dataIndex: 'toProject.name',
          align: 'left'
        },
        {
          title: '出库类型',
          dataIndex: 'warehouseOutType',
          align: 'left',
          customRender: (text, record) => {
            if (text === 0) {
              return '项目采购出库'
            } else {
              return '非项目采购出库'
            }
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
          title: '审批状态',
          dataIndex: 'state',
          align: 'left',
          customRender: (text, record) => {
            return <AuditStatusTag state={text} instanceId={record.sealWorkflow.instanceId} />
          }
        },
        {
          title: '操作',
          align: 'left',
          width: '160px',
          scopedSlots: { customRender: 'action' }
        }
      ]
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
    /* 查询按钮 */
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    },
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '新增出库申请',
          width: '90%',
          maskClosable: true
        },
        content: {
          template: WarehouseOutapplyForm,
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
          title: '修改出库申请',
          width: '90%',
          maskClosable: true
        },
        content: {
          template: WarehouseOutapplyForm,
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
        content: '是否确认删除出库申请单编号为"' + row.code + '"的数据项?',
        onOk: () => {
          return delWarehouseOutapply(ids).then(() => {
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
        content: '是否确认导出所有出库申请单数据项?',
        onOk: () => {
          return exportWarehouseOutapply(queryParam).then(res => {
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
          title: '出库申请详情',
          width: '90%',
          maskClosable: true
        },
        content: {
          template: WarehouseOutapplyDetail,
          props: {
            row
          }
        }
      })
    }
  }
}
</script>
