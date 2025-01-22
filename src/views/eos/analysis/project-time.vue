<template>
  <a-card :bordered="false">
    <a-month-picker placeholder="选择时间" @change="onChangeMonth" style="margin-right: 10px" />
    <a-button type="primary" ghost icon="download" @click="exportPorject(queryParam)" style="margin-bottom: 20px">导出</a-button>

    <!-- 查询表单 -->
    <div class="table-page-search-wrapper">
      <s-form search layout="inline" @search="refresh" @reset="reset" :formItems="searchFormItems" :formData="queryParam"> </s-form>
    </div>

    <!-- 数据表格 -->
    <s-table v-if="!isShowCardList" ref="table" size="default" rowKey="projectCode" :columns="columns" :data="loadData">
      <!-- <p slot="expandedRowRender" slot-scope="record">
          <s-descriptions title="基本信息" :formItems="DescItems" :formData="record" />
        </p> -->
    </s-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import { analystList, projectAnalyst } from '/src/api/eos/analysis/analyst.js'
import { SForm, STable } from '/src/components/index.js'

export default {
  name: 'ProjectTime',
  components: {
    STable,
    SForm
  },
  data() {
    return {
      // 是否展示卡片列表
      isShowCardList: false,
      // 查询参数
      queryParam: {
        project: 'project'
      },
      // 加载数据方法
      loadData: param => {
        const QueryParams = { ...this.queryParam }
        if (!this.isEmpty(QueryParams.startTime)) {
          QueryParams.startTime = moment(QueryParams.startTime).format('YYYY-MM') + '-01 00:00:00'
        }
        if (!this.isEmpty(QueryParams.endTime)) {
          QueryParams.endTime = moment(QueryParams.endTime).format('YYYY-MM') + '-31 23:59:59'
        }
        return analystList(Object.assign({}, param, QueryParams)).then(res => {
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
          type: 'monthPicker',
          prop: 'startTime',
          label: '开始年月'
        },
        {
          type: 'monthPicker',
          prop: 'endTime',
          label: '结束年月'
        },
        {
          type: 'input',
          prop: 'projectName',
          label: '项目名称'
        }
      ],
      columns: [
        {
          title: '项目编号',
          dataIndex: 'projectCode'
        },
        {
          title: '项目名称',
          dataIndex: 'projectName'
        },
        {
          title: '现金收入合计(元)',
          dataIndex: 'fundInSum'
        },
        {
          title: '现金支出合计(元)',
          dataIndex: 'fundOutSum'
        },
        {
          title: '实际回款(元)',
          dataIndex: 'paymentRealSum'
        },
        {
          title: '实际支出(元)',
          dataIndex: 'totalExpense'
        },
        {
          title: '预算收支(元)',
          dataIndex: 'resMoney'
        }
        // {
        //   title: '操作',
        //   width: 170,
        //   scopedSlots: { customRender: 'action' }
        // }
      ]
      //   DescItems: [
      //     {
      //       title: '现金收入合计(元)',
      //       dataIndex: 'incomeSum'
      //     },
      //     {
      //       title: '现金支出合计(元)',
      //       dataIndex: 'outcomeSum'
      //     },
      //     {
      //       title: '实际回款(元)',
      //       dataIndex: 'paymentRealSum'
      //     },
      //     {
      //       title: '实际支出(元)',
      //       dataIndex: 'totalExpense'
      //     },
      //     {
      //       title: '预算收支(元)',
      //       dataIndex: 'resMoney'
      //     }
      //   ]
    }
  },
  methods: {
    // 刷新页面
    refresh() {
      this.isShowCardList ? this.$refs.list.refresh(true) : this.$refs.table.refresh(true)
    },
    // 重置查询参数
    reset() {
      this.queryParam = { project: 'project' }
    },
    /* 导出选择时间 */
    onChangeMonth(date) {
      this.month = { ...date }
    },
    /* 导出项目分析 */
    exportPorject(text, record) {
      if (this.isEmpty(this.month)) return this.$message.error('先选择日期之后在导出!')
      this.$antdconfirm({
        title: '导出',
        content: `是否导出在：${moment(this.month).format('YYYY-MM')}期间的项目收支情况 ?`,
        onOk: () => {
          return projectAnalyst({ planTime: moment(this.month).format('YYYY-MM'), project: 'project' }).then(res => {
            this.download(res.msg)
          })
        }
      })
    }
  }
}
</script>
