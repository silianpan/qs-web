<!-- 变更历史 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <!-- 查询表单，若无数据，不展示 -->
      <s-search placeholder="搜索此列表..." clickTips="搜索项目名称、变更单号、变更类型" @onSearch="onSearch" />
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :rowSelection="rowSelection">
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import { listHistory, delHistory, exportHistory } from '/src/api/eos/change/history.js'
import { SSearch, STable } from '/src/components/index.js'
import HistoryForm from './modules/HistoryForm.vue'
import BudgetModifyDetail from '/src/views/eos/budget/modify/details.vue'
import projectModifyDetail from '/src/views/eos/project/modify/details.vue'
import contractModifyDetail from '/src/views/eos/contract/modify/details.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import moment from 'moment'

export default {
  name: 'History',
  components: {
    SSearch,
    STable
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
        orderByColumn: 'create_time'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listHistory(Object.assign({}, param, this.queryParam)).then(res => {
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
          title: '变更项目编号',
          dataIndex: 'code',
          align: 'left'
        },
        {
          title: '变更日期',
          dataIndex: 'createTime',
          align: 'left',
          customRender: text => moment(text).format('YYYY-MM-DD')
        },
        {
          title: '变更类型',
          dataIndex: 'type',
          align: 'left'
        },
        {
          title: '变更人',
          dataIndex: 'sysUser.nickName',
          align: 'left'
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          align: 'left',
          customRender: (text, record) => {
            return <AuditStatusTag clickable state={text} instanceId={record.sealWorkflow.instanceId} />
          }
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
          title: '变更历史',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: HistoryForm,
          on: {
            ok: () => {
              this.$refs.table.refresh(true)
            }
          }
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {},
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除变更历史编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delHistory(ids).then(() => {
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
        content: '是否确认导出所有变更历史数据项?',
        onOk: () => {
          return exportHistory(queryParam).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /** 详情 */
    handleDetail(row, formId) {
      if (row.type === '项目') {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '变更历史',
            width: '60%',
            maskClosable: true
          },
          content: {
            template: projectModifyDetail,
            props: {
              title: '变更历史详情',
              row,
              formId
            }
          }
        })
      }
      if (row.type === '预算') {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '变更历史',
            width: '60%',
            maskClosable: true
          },
          content: {
            template: BudgetModifyDetail,
            props: {
              title: '变更历史详情',
              row,
              formId
            }
          }
        })
      }
      if (row.type === '合同') {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '变更历史',
            width: '60%',
            maskClosable: true
          },
          content: {
            template: contractModifyDetail,
            props: {
              title: '变更历史详情',
              row,
              formId
            }
          }
        })
      }
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
