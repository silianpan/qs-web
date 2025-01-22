<!-- 预算制定 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="handleAdd">新增</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索项目名称、申请单号" @onSearch="onSearch" />
      </div>
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table :customRow="rowClick" v-show="!noData" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record">
          <BusCommit :handleUpdate="handleUpdate" :handleDelete="handleDelete" :requestMapping="'/project/apply'" :busForm="record" @getList="refresh" />
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import dictConfig from '/src/views/eos/config/dict.config.js'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import details from './details.vue'
import BudgetForm from './modules/BudgetForm.vue'
import { delBudget, exportBudget, listSelf } from '/src/api/eos/budget/apply.js'
import BusCommit from '/src/components/Activiti/BusCommit.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  name: 'Budget',
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
      dictKeys: [dictConfig.PROJECT_BUDGET_TYPE],
      dictMap: {},
      selectedRowKeys: [],
      selectedRows: [],
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'createTime',
        tenantAppId: this.$store.getters.tenantAppId,
        menuId: this.$route.meta.moduleId
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listSelf(Object.assign({}, param, this.queryParam)).then(res => {
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
          label: '项目名称',
          prop: 'projectName'
        },
        {
          type: 'select',
          label: '预算类型',
          options: _ => this.dictMap[dictConfig.PROJECT_BUDGET_TYPE],
          prop: 'type'
        }
      ],
      columns: [
        {
          title: '所属项目/部门',
          dataIndex: 'sealProject.name',
          align: 'left',
          customRender: (text, record) => {
            return record.sealProject ? (
              <Ellipsis length={64} tooltip>
                {record.sealProject.name}
              </Ellipsis>
            ) : (
              <Ellipsis length={64} tooltip>
                {record.deptTime.slice(0, 4) + '年' + record.sysDept.deptName}
              </Ellipsis>
            )
          }
        },
        {
          title: '预算编号',
          dataIndex: 'code',
          align: 'left'
        },
        {
          title: '预算总金额(元)',
          dataIndex: 'sum',
          align: 'left',
          customRender: text => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '预算类型',
          dataIndex: 'type',
          align: 'left'
          // customRender: text => {
          //   return text ? (
          //     <Ellipsis length={8} tooltip>
          //       {text}
          //     </Ellipsis>
          //   ) : (
          //     text
          //   )
          // }
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
    // 刷新页面
    refresh() {
      this.$refs.table.refresh(true)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '预算制订',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: BudgetForm,
          on: {
            ok: () => {
              this.$refs.table.refresh(true)
            }
          }
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '修改预算',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: BudgetForm,
          props: {
            isUpdate: true,
            updateRow: row
          },
          on: {
            ok: () => {
              this.$refs.table.refresh(true)
            }
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      // const ids = this.selectedRowKeys.join(',')
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除预算编号为"' + row.id + '"的数据项?',
        onOk: () => {
          return delBudget(row.id).then(() => {
            this.$refs.table.refresh(true)
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
        content: '是否确认导出所有预算数据项?',
        onOk: () => {
          return exportBudget(queryParam).then(res => {
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
          title: '预算详情',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: details,
          props: {
            row,
            formId,
            isIndex:true
          }
        }
      })
    },
    // 删除
    _handleDelete(row) {
      const ids = row.id
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除预算编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delBudget(ids).then(() => {
            this.$refs.table.refresh(true)
            this.$message.success('删除成功', 3)
          })
        }
      })
    },
    /* 排序按钮 */
    clickquery(param) {
      this.queryParam = { ...this.queryParam, orderByColumn: param }
      this.refresh()
    },
    /* 查询按钮 */
    onSearch(data) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    }
  }
}
</script>
