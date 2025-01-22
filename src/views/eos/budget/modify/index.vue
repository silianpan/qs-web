<!-- 预算变更 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="handleAdd">新增</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索变更单号、变更时间/金额" @onSearch="onSearch" />
      </div>

      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record">
          <BusCommit cantUpdate :handleDelete="handleDelete" :requestMapping="'/project/apply/change'" :busForm="record" @getList="refresh" />
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import dictConfig from '/src/views/eos/config/dict.config.js'
import { getBudgetModify, delBudgetModify } from '/src/api/eos/budget/budgetModify.js'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import ChangeBudgetForm from './modules/ChangeBudgetForm.vue'
import BudgetModifyDetail from './details.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import BusCommit from '/src/components/Activiti/BusCommit.vue'
import moment from 'moment'

export default {
  name: 'BudgetModify',
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
        orderByColumn: 'createTime'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return getBudgetModify(Object.assign({}, param, this.queryParam)).then(res => {
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
          title: '编号',
          dataIndex: 'code',
          align: 'left'
        },
        {
          title: '所属项目/部门',
          dataIndex: 'sealProject.name',
          align: 'left',
          customRender: (text, record) => {
            return record.budgetApplyVo.sealProject ? (
              <Ellipsis length={40} tooltip>
                {record.budgetApplyVo.sealProject.name}
              </Ellipsis>
            ) : (
              <Ellipsis length={40} tooltip>
                {record.budgetApplyVo.deptTime.slice(0, 4) + '年' + record.budgetApplyVo.sysDept.deptName}
              </Ellipsis>
            )
          }
        },
        {
          title: '变更人',
          dataIndex: 'sysUser.nickName',
          align: 'left'
        },
        {
          title: '变更日期',
          dataIndex: 'createTime',
          align: 'left',
          customRender: text => moment(text).format('YYYY-MM-DD')
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
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '新增预算变更',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: ChangeBudgetForm,
          on: {
            ok: () => {
              this.refresh()
            },
            close: () => {
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
        content: '是否确认删除变更历史编号为"' + ids + '"的数据项?',
        onOk: () => {
          delBudgetModify(ids).then(() => {
            this.$message.success('删除成功!')
            this.refresh()
          })
        }
      })
    },
    /* 详情 */
    handleDetail(row, formId) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '预算变更详情',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: BudgetModifyDetail,
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
