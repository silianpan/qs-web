<!-- 资金计综合查询 -->
<template>
  <a-card :bordered="false">
    <!-- 查询表单 -->
    <div class="search">
      <!-- <s-form search layout="inline" @search="refresh" @reset="reset" :formItems="searchFormItems" :formData="queryParam"></s-form> -->
      <ul class="queryList">
        <li :class="index === current ? 'current' : ''" v-for="(item, index) in queryList" :key="item.text" @click="clickquery(item.query, index)">{{ item.text }}<a-icon type="caret-down" /></li>
      </ul>
      <div class="inputquery"><a-input-search ref="searchBar" placeholder="编号/时间" enter-button @search="onSearch" allowClear /></div>
      <div><a-month-picker placeholder="选择时间" @change="onChangeMonth" style="margin-right: 10px" /></div>
      <div style="margin-right: 10px"><a-button type="primary" ghost icon="download" @click="handleExportAll">导出汇总</a-button></div>
      <div style="margin-right: 10px"><a-button type="primary" ghost icon="download" @click="handleExportAllBy">导出汇总(审批通过)</a-button></div>
      <!-- <a-button type="dashed" shape="circle" :style="{ float: 'right' }" icon="reload" @click="$refs.table.refresh(true)" /> -->
      <div class="table-operator">
        <a-button type="dashed" shape="circle" :style="{ float: 'right' }" icon="reload" @click.stop="refresh" />
      </div>
    </div>

    <!-- 业务操作按钮 -->
    <div class="table-operations">
      <!-- <a-button ghost type="primary" plain icon="a-icon-plus" size="small" @click="handleAdd" v-hasPermi="['project:fund:add']">新增</a-button> -->
      <!-- <a-button type="success" plain icon="a-icon-edit" size="small" @click="handleUpdate" v-hasPermi="['project:fund:edit']">修改</a-button>
        <a-button type="danger" plain icon="a-icon-delete" size="small" @click="handleDelete" v-hasPermi="['project:fund:remove']">删除</a-button> -->
      <!-- <a-month-picker placeholder="选择时间" @change="onChangeMonth" style="margin-right: 10px" />
      <a-button type="primary" ghost icon="download" @click="handleExportAll">导出汇总</a-button>
      <a-button type="primary" ghost icon="download" @click="handleExportAllBy">导出汇总(审批通过)</a-button>
      <a-button type="dashed" shape="circle" :style="{ float: 'right' }" icon="reload" @click="$refs.table.refresh(true)" /> -->
    </div>
    <no-data v-show="noData" />
    <!-- 数据表格 -->
    <s-table v-show="!noData" ref="table" :customRow="rowClick" size="default" rowKey="id" :columns="columns" :data="loadData" :rowSelection="rowSelection">
      <span slot="action" slot-scope="text, record">
        <s-action-columns :actions="getActions(record)" :record="record" />
      </span>
    </s-table>
  </a-card>
</template>

<script lang="jsx">
import moment from 'moment'
import { listFund, delFund, exportFund } from '/src/api/eos/fundPlan/fund.js'
import { fundApproval } from '/src/api/eos/fundPlan/summary.js'
import { STable, SActionColumns } from '/src/components/index.js'
import SummaryDetails from './summary_details.vue'

export default {
  name: 'FundOp',
  components: {
    STable,
    SActionColumns
  },
  data() {
    return {
      noData: false,
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
      dictKeys: [],
      dictMap: {},
      selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: {
        collect: 'collect',
        isAsc: 'desc',
        orderByColumn: 'planTime'
      },
      /* 查询列表 */
      queryList: [
        { text: '按部门', query: 'planDept' },
        { text: '按时间', query: 'create_time' }
      ],
      /* 当前查询的按钮 */
      current: '',
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
          label: '编制人',
          prop: 'nickName'
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
          title: '负责区域或部门',
          dataIndex: 'planDept',
          align: 'left'
        },
        {
          title: '编制人',
          dataIndex: 'sysUser.nickName',
          align: 'left'
        },
        {
          title: '审批状态',
          dataIndex: 'status',
          align: 'left'
        },
        /*   {
          title: '审批意见',
          dataIndex: 'idea',
          align: 'left'
        }, */
        {
          title: '操作',
          width: 160,
          align: 'left',
          scopedSlots: { customRender: 'action' }
        }
      ],
      /* 导出选择的日期 */
      month: ''
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
    getActions(row) {
      const listArr = []
      if (row.status === '等待审批') {
        listArr.push({
          label: '审批',
          icon: 'check-circle',
          action: this.antdconfirm,
          cancelAction: this.cancel,
          popconfirm: true,
          confirmTitle: '是否通过审批？',
          confirmOkText: '通过',
          confirmCancelText: '不通过',
          confirmIcon: 'question-circle-o'
        })
      }
      listArr.push({
        label: '导出',
        icon: 'vertical-align-bottom',
        action: this.handleExport
      })
      return listArr
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /** 修改按钮操作 */
    handleUpdate(row) {},
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id
      this.$antdconfirm({
        title: '删除',
        icon: 'question-circle',
        content: '是否确认删除资金计划编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delFund(ids).then(() => {
            this.$refs.table.refresh(true)
            this.$message.success('删除成功', 3)
          })
        }
      })
    },
    /** 单个导出按钮操作 */
    handleExport(record) {
      // const queryParam = this.queryParam
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
    /* 导出所有 */
    handleExportAll(text, record) {
      if (this.isEmpty(this.month)) return this.$message.error('先选择日期之后在导出!')
      this.$antdconfirm({
        title: '导出',
        content: '是否导出' + `${this.month ? `时间为：${moment(this.month).format('YYYY-MM')}` :''}  `+ 
                  `${this.selectedRowKeys ?  '选中' : ''}` + '的所有资金计划数据项?',
        onOk: () => {
          return exportFund({ planTime: moment(this.month).format('YYYY-MM'), planIds: this.selectedRowKeys }).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /* 导出所有审批通过项 */
    handleExportAllBy(text, record) {
      if (this.isEmpty(this.month)) return this.$message.error('先选择日期之后在导出!')
      this.$antdconfirm({
        title: '导出',
        content: `是否导出时间为：${moment(this.month).format('YYYY-MM')} 所有已通过的资金计划数据项?`,
        onOk: () => {
          return exportFund({ planTime: moment(this.month).format('YYYY-MM'), status: '审批通过' }).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /* 导出选择时间 */
    onChangeMonth(date) {
      this.month = { ...date }
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
          template: SummaryDetails,
          props: {
            title: '资金计划详情',
            row,
            formId
          }
        }
      })
    },
    // 审批通过
    antdconfirm(record) {
      const { code } = record
      fundApproval({ code: code, idea: '通过' }).then(res => {
        this.$refs.table.refresh(true)
      })
    },
    // 不通过
    cancel(record) {
      const { code } = record
      fundApproval({ code: code, idea: '不通过' }).then(res => {
        this.$refs.table.refresh(true)
      })
    },
    /* 查询按钮 */
    clickquery(param, index) {
      this.current = index
      this.queryParam = { ...this.queryParam, orderByColumn: param }
      this.refresh()
    },
    /* 查询按钮 */
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    }
  },
  activated() {
    this.$refs.table.refresh(true)
  }
}
</script>
<style lang="less" scoped>
.search {
  display: flex;
}
.inputquery {
  margin-right: 20px;
  width: 500px;
}
.queryList {
  display: flex;
  padding: 0;
  margin-right: 30px;
  li {
    text-align: center;
    padding: 4px;
    width: 80px;
    height: 31px;
    border: 1px solid #ccc;
    cursor: pointer;
    &:not(.current):hover {
      color: #13c2c2;
      border: 1px solid #13c2c2;
    }
  }
}
.current {
  color: white;
  background-color: #13c2c2;
  border: 1px solid #13c2c2;
}
</style>
