<!-- 资金计划列表 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="handleAdd">新增</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索计划编号、部门名称" @onSearch="onSearch" />
      </div>
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record">
          <s-action-columns :actions="getActions(record)" :record="record" />
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import moment from 'moment'
import { listFund, delFund, exportFund, submitAudit } from '/src/api/eos/fundPlan/fund.js'
import { SSearch, STable, SActionColumns } from '/src/components/index.js'
import FundForm from './modules/FundForm.vue'
import FundDetails from './FundDetails.vue'

export default {
  name: 'Fund',
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
      /* 是否有数据 */
      noData: false,
      dictKeys: [],
      dictMap: {},
      selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'planTime'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listFund(Object.assign({}, param, this.queryParam)).then(res => {
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
          label: '资金计划编号',
          prop: 'code'
        },
        {
          type: 'input',
          label: '负责区域或部门',
          prop: 'planDept'
        },
        {
          type: 'select',
          label: '审批状态',
          options: [
            {
              dictLabel: '审批通过',
              dictValue: '审批通过'
            },
            {
              dictValue: '等待审批',
              dictLabel: '等待审批'
            }
          ],
          prop: 'status'
        },
        {
          type: 'input',
          label: '审批意见',
          prop: 'idea'
        }
      ],
      columns: [
        {
          title: '资金计划编号',
          dataIndex: 'code',
          align: 'left'
        },
        {
          title: '资金计划年月',
          dataIndex: 'planTime',
          align: 'left',
          customRender: text => {
            const str = moment(text).format('YYYY-MM')
            return <span>{str}</span>
          }
        },
        {
          title: '编制人',
          dataIndex: 'sysUser.nickName',
          align: 'left'
        },
        {
          title: '负责区域或部门',
          dataIndex: 'planDept',
          align: 'left'
        },
        {
          title: '审批状态',
          dataIndex: 'status',
          align: 'left'
        },
        {
          title: '审批意见',
          dataIndex: 'idea',
          align: 'left'
        },
        {
          title: '操作',
          width: 200,
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
    getActions(row) {
      let listArr = []
      if (!row.status) {
        listArr.push({
          label: '提交',
          icon: 'check-circle',
          action: this.handlerconfirm,
          popconfirm: true,
          confirmTitle: '是否发送审批申请?',
          confirmOkText: '发送',
          confirmCancelText: '取消',
          confirmIcon: 'question-circle-o'
        })
      }
      if (row.status !== '等待审批' && row.status !== '审批通过') {
        listArr = [
          ...listArr,

          // {
          //   label: '修改',
          //   icon: 'edit',
          //   action: this.handleModify
          // },
          {
            label: '删除',
            icon: 'close-circle',
            action: this.handleDelete
          }
        ]
      }
      listArr.push({
        label: '导出',
        icon: 'vertical-align-bottom',
        action: this.handleExport
      })
      // if (row.status && row.status === '审批未通过') {
      //   listArr.push({
      //     label: '重新提交',
      //     icon: 'check-circle',
      //     action: this.handlerconfirm,
      //     popconfirm: true,
      //     confirmTitle: '是否发送审批申请?',
      //     confirmOkText: '发送',
      //     confirmCancelText: '取消',
      //     confirmIcon: 'question-circle-o'
      //   })
      // }
      return listArr
    },
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '制定资金计划',
          width: '95%',
          maskClosable: true
        },
        content: {
          template: FundForm,
          on: {
            ok: () => {
              this.$refs.table.refresh(true)
            },
            cancel: () => {
              this.$refs.table.refresh(true)
            }
          }
        }
      })
    },
    /** 修改按钮操作 */
    handleModify(row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '修改资金计划',
          width: '95%',
          maskClosable: true
        },
        content: {
          template: FundForm,
          props: {
            isUpdate: true,
            updateRow: row
          },
          on: {
            ok: () => {
              this.$refs.table.refresh(true)
            },
            cancel: () => {
              this.$refs.table.refresh(true)
            }
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除资金计划编号为"' + row.id + '"的数据项?',
        onOk: () => {
          return delFund(row.id).then(() => {
            this.$refs.table.refresh(true)
            this.$message.success('删除成功', 3)
          })
        }
      })
    },
    /** 导出按钮操作 */
    handleExport(record) {
      this.$antdconfirm({
        title: '导出',
        content: '是否确认导出资金计划数据项?',
        onOk: () => {
          return exportFund({ code: record.code }).then(res => {
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
          title: '资金计划详情',
          width: '95%',
          maskClosable: true
        },
        content: {
          template: FundDetails,
          props: {
            title: '资金计划详情',
            row,
            formId
          }
        }
      })
    },
    // 提交申请
    handlerconfirm(record) {
      submitAudit(record.id).then(res => {
        this.$message.success('提交成功!')
        this.$refs.table.refresh(true)
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
  },
  activated() {
    this.$refs.table.refresh(true)
  }
}
</script>
