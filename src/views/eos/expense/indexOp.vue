<!-- 个人报销申请 -->
<template>
  <a-card :bordered="false">
    <div class="table-header-btns">
      <a-button ghost type="primary" @click="handleAdd">新增</a-button>
      <!-- 查询表单，若无数据，不展示 -->
      <s-search placeholder="搜索此列表..." clickTips="搜索项目名称、报销人/单号/金额/内容" @onSearch="onSearch" />
    </div>

    <no-data v-show="noData" />
    <!-- 数据表格 -->
    <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
      <span slot="action" slot-scope="record">
        <BusCommit :handleUpdate="handleUpdate" :handleDelete="_handleDelete" :requestMapping="'/project/expense'" :busForm="record" @getList="refresh" />
      </span>
    </s-table>
  </a-card>
</template>

<script lang="jsx">
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { listExpensePersonal, delExpense, exportExpense } from '/src/api/eos/expense/expense.js'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import ExpenseForm from './modules/ExpenseForm.vue'
import expenseDetail from './details.vue'
import BusCommit from '/src/components/Activiti/BusCommit.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  name: 'ExpenseOp',
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
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'createTime',
        tenantAppId: this.$store.getters.tenantAppId,
        menuId: this.$route.meta.moduleId
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listExpensePersonal(Object.assign({}, param, this.queryParam)).then(res => {
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
          title: '报销人',
          align: 'left',
          dataIndex: 'sysUser.nickName'
        },
        {
          title: '报销单号',
          align: 'left',
          dataIndex: 'code',
          width: 180
        },
        {
          title: '报销日期',
          dataIndex: 'createTime',
          align: 'left',
          customRender: text => moment(text).format('MM-DD HH:mm')
        },
        {
          title: '所属项目/部门',
          align: 'left',
          dataIndex: 'sealProject.name',
          customRender: (text, record) => {
            return (
              <Ellipsis length={18} tooltip>
                {(text = record.sealProject ? record.sealProject.name : record.sysDept.deptName)}
              </Ellipsis>
            )
          }
        },
        {
          title: '报销总金额(元)',
          dataIndex: 'sum',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        // {
        //   title: '报销事由',
        //   dataIndex: 'content',
        //   align: 'center',
        //   customRender: text => {
        //     return text ? (
        //       <Ellipsis length={16} tooltip>
        //         {text}
        //       </Ellipsis>
        //     ) : (
        //       text
        //     )
        //   }
        // },
        {
          title: '是否冲抵贷款',
          align: 'left',
          dataIndex: 'repay'
        },
        {
          title: '审批状态',
          align: 'left',
          dataIndex: 'state',
          customRender: (text, record) => {
            return <AuditStatusTag state={text} instanceId={record.sealWorkflow.instanceId} />
          }
        },
        // {
        //   title: '附件',
        //   dataIndex: 'attachment'
        // },

        // {
        //   title: '审批状态',
        //   dataIndex: 'state',
        //   align: 'center',
        //   customRender: (text, record) => {
        //     return <AuditStatusTag state={text} instanceId={record.busFlow.instanceId} />
        //   }
        // },
        // {
        //   title: '当前任务',
        //   dataIndex: 'busFlow.taskName',
        //   align: 'center',
        //   customRender: (text, record) => {
        //     return <a-tag color="orange">{record.busFlow.taskName}</a-tag>
        //   }
        // },

        // {
        //   title: '实报金额(元)',
        //   dataIndex: 'finalSum',
        //   align: 'left',
        //   customRender: (text, record) => {
        //     if (this.isEmpty(record.finalSum)) {
        //       return <span style="color:red">{this.toThousandFilter(record.sum)}</span>
        //     } else {
        //       return <span style="color:red">{this.toThousandFilter(record.finalSum)}</span>
        //     }
        //   }
        // },
        // {
        //   title: '预算类型',
        //   dataIndex: 'budgetType',
        //   align: 'center',
        //   customRender: text => {
        //     const ret = this.selectDictItem(this.dictMap[dictConfig.PROJECT_BUDGET_TYPE], text)
        //     return <a-tag color={ret.listClass}>{ret.dictLabel}</a-tag>
        //   }
        // },
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
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '新增报销单',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: ExpenseForm,
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
          title: '修改报销单',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: ExpenseForm,
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
      const ids = this.selectedRowKeys.join(',')
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除报销申请单编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delExpense(ids).then(() => {
            this.$refs.table.refresh(true)
            this.$message.success('删除成功', 3)
          })
        }
      })
    },
    /* 单独删除 */
    _handleDelete(row) {
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除报销申请单编号为"' + row.code + '"的数据项?',
        onOk: () => {
          return delExpense(row.id).then(() => {
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
        content: '是否确认导出所有报销申请单数据项?',
        onOk: () => {
          return exportExpense(queryParam).then(res => {
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
          title: '报销单详情',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: expenseDetail,
          props: {
            row,
            formId
          }
        }
      })
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
    }
  }
}
</script>
