<!-- 划拨申请单(只能项目划项目)列表 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="handleAdd">新增</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索项目名称、库房名称、申请人、申请编号" @onSearch="onSearch" />
      </div>
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record">
          <BusCommit :handleUpdate="handleUpdate" :handleDelete="handleDelete" :requestMapping="'/project/warehouseTransferApply'" :busForm="record" @getList="refresh" />
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import { listWarehouseTransferApply, delWarehouseTransferApply, exportWarehouseTransferApply } from '/src/api/eos/warehouse/warehouseTransferApply'
import { SSearch, STable } from '/src/components/index.js'
import WarehouseTransferApplyForm from './modules/WarehouseTransferApplyForm'
import WarehouseTransferApplyDetail from './modules/WarehouseTransferApplyDetail'
import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'
import BusCommit from '/src/components/Activiti/BusCommit.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  name: 'WarehouseTransferApply',
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
        orderByColumn: 'wta_create_time'
      },
      /* 查询列表 */
      queryList: [{ text: '按时间', query: 'wta_create_time' }],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listWarehouseTransferApply(Object.assign({}, param, this.queryParam)).then(res => {
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
          label: '版本',
          prop: 'version'
        },
        {
          type: 'input',
          label: '租户',
          prop: 'tenantId'
        },
        {
          type: 'input',
          label: '划拨编号',
          prop: 'code'
        },
        {
          type: 'input',
          label: '原项目id',
          prop: 'sourceProjectId'
        },
        {
          type: 'input',
          label: '目的项目id',
          prop: 'targetProjectId'
        },
        {
          type: 'input',
          label: '原库房id',
          prop: 'sourceWarehouseId'
        },
        {
          type: 'input',
          label: '目的库房id',
          prop: 'targetWarehouseId'
        }
      ],
      columns: [
        {
          title: '申请人',
          align: 'left',
          dataIndex: 'sealWorkflow.applyUserName'
        },
        {
          title: '申请时间',
          align: 'left',
          dataIndex: 'sealWorkflow.applyTime'
        },
        {
          title: '原项目',
          dataIndex: 'sourceProject.name',
          align: 'left',
          customRender: text => {
            return text ? (
              <Ellipsis length={40} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          title: '目的项目',
          dataIndex: 'targetProject.name',
          align: 'left',
          customRender: text => {
            return text ? (
              <Ellipsis length={40} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          title: '原库房',
          dataIndex: 'sourceWarehouse.name',
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
          title: '目的库房',
          dataIndex: 'targetWarehouse.name',
          align: 'left',
          customRender: text => {
            return text ? (
              <Ellipsis length={8} tooltip>
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
          width: 160,
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
          title: '新增划拨申请',
          width: '90%',
          maskClosable: true
        },
        content: {
          template: WarehouseTransferApplyForm,
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
          title: '修改划拨申请',
          width: '90%',
          maskClosable: true
        },
        content: {
          template: WarehouseTransferApplyForm,
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
        content: '是否确认删除划拨申请单编号为"' + row.code + '"的数据项?',
        onOk: () => {
          return delWarehouseTransferApply(ids).then(() => {
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
        content: '是否确认导出所有划拨申请单(只能项目划项目)数据项?',
        onOk: () => {
          return exportWarehouseTransferApply(queryParam).then(res => {
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
          title: '划拨申请详情',
          width: '90%',
          maskClosable: true
        },
        content: {
          template: WarehouseTransferApplyDetail,
          props: {
            row
          }
        }
      })
    }
  }
}
</script>
