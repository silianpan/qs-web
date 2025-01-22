<!-- 入库申请单列表 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="handleAdd">新增</a-button>

        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索库房名称、申请单号" @onSearch="onSearch" />
      </div>
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record">
          <BusCommit :handleUpdate="handleUpdate" :handleDelete="handleDelete" :requestMapping="'/project/warehouseInApply'" :busForm="record" @getList="refresh" />
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import dictConfig from '/src/views/eos/config/dict.config.js'
import { listWarehouseInApply, delWarehouseInApply, exportWarehouseInApply } from '/src/api/eos/warehouse/warehouseInApply'
import { SSearch, STable } from '/src/components/index.js'
import WarehouseInApplyForm from './modules/WarehouseInApplyForm'
import WarehouseInApplyDetail from './modules/WarehouseInApplyDetail'
import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'
import BusCommit from '/src/components/Activiti/BusCommit.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  name: 'WarehouseInApply',
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
            this.handleDetail(record, record.id)
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
        orderByColumn: 'wia_create_time'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listWarehouseInApply(Object.assign({}, param, this.queryParam)).then(res => {
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
          label: '关联的采购付款id',
          prop: 'paymentId'
        },
        {
          type: 'select',
          label: '入库类型(计划内入库、计划外入库，不需要让用户选)',
          options: item => this.dictMap[dictConfig.xxx],
          prop: 'warehouseInType'
        },
        {
          type: 'input',
          label: '库房id',
          prop: 'warehouseId'
        },
        {
          type: 'input',
          label: '批次编号(自动生成)',
          prop: 'code'
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
          dataIndex: 'sealWorkflow.applyTime',
          customRender: text => {
            return text ? (
              <Ellipsis length={20} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          title: '入库批次编号',
          dataIndex: 'code',
          align: 'left'
        },
        {
          title: '库房',
          dataIndex: 'warehouse.name',
          align: 'left'
        },
        {
          title: '项目名称',
          dataIndex: 'project.name',
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
          title: '入库类型',
          dataIndex: 'warehouseInType',
          align: 'left',
          customRender: (text, record) => {
            if (record.warehouseInType === 0) {
              return '项目采购入库'
            } else {
              return '非项目采购外入库'
            }
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'left',
          width: 80,
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
          align: 'left',
          dataIndex: 'state',
          customRender: (text, record) => {
            return <AuditStatusTag state={text} instanceId={record.sealWorkflow.instanceId} />
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
          title: '新增入库申请',
          width: '90%',
          maskClosable: true
        },
        content: {
          template: WarehouseInApplyForm,
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
          title: '修改入库申请',
          width: '90%',
          maskClosable: true
        },
        content: {
          template: WarehouseInApplyForm,
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
        content: '是否确认删除入库申请单编号为"' + row.code + '"的数据项?',
        onOk: () => {
          return delWarehouseInApply(ids).then(() => {
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
        content: '是否确认导出所有入库申请单数据项?',
        onOk: () => {
          return exportWarehouseInApply(queryParam).then(res => {
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
          title: '入库申请详情',
          width: '90%',
          maskClosable: true
        },
        content: {
          template: WarehouseInApplyDetail,
          props: {
            row,
            formId
          }
        }
      })
    }
  }
}
</script>
