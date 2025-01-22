<template>
  <a-card :bordered="false">
    <!-- <a-month-picker placeholder="选择时间" @change="onChangeMonth" style="margin-right: 10px" />
    <a-button type="primary" ghost icon="download" @click="exportPorject(queryParam)" style="margin-bottom : 20px">导出</a-button> -->

    <!-- 查询表单 -->
    <!-- <div class="table-page-search-wrapper">
      <s-form search layout="inline" @search="refresh" @reset="reset" :formItems="searchFormItems" :formData="queryParam"> </s-form>
    </div> -->

    <!-- 数据表格 -->
    <s-table ref="table" size="default" rowKey="projectCode" :columns="columns" :data="loadData">
      <!-- <p slot="expandedRowRender" slot-scope="record">
          <s-descriptions title="基本信息" :formItems="DescItems" :formData="record" />
        </p> -->
    </s-table>
    <s-table ref="table" size="default" rowKey="labMoney" :columns="totalColumn" :data="totalData"> </s-table>
    <labor-column :row="this.row" />
  </a-card>
</template>

<script lang="jsx">
import moment from 'moment'
import { AnalystProjectLabor, AnalystProjectLaborTotal } from '/src/api/eos/analysis/analyst.js'
import LaborUse from '/src/views/eos/cost/labor/modules/LaborUse'
import LaborColumn from './AnalystColumn.vue'
import { STable } from '/src/components/index.js'

export default {
  name: 'AnalystLabor',
  components: {
    STable,
    LaborColumn
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      queryParams: {},
      // 加载数据
      totalData: param => {
        return AnalystProjectLaborTotal(Object.assign({}, this.queryParams)).then(res => {
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      loadData: param => {
        return AnalystProjectLabor(Object.assign({}, this.queryParams)).then(res => {
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      //   searchFormItems: [
      //     {
      //       type: 'monthPicker',
      //       prop: 'startTime',
      //       label: '开始年月'
      //     }
      //   ],
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
          title: '投入人工（单位：元）',
          dataIndex: 'totalMoney',
          customRender: (text, record) => {
            return (
              <span style="color:#348EE4;cursor:pointer" onClick={() => this.laborDetail(record, this.row)}>
                {this.toThousandFilter(text)}
              </span>
            )
          }
        },
        {
          title: '项目投入人工占比（单位：%）',
          dataIndex: 'workHour',
          customRender: (text, record) => {
            return record.workHour >= 80 ? <a-tag color="red">{text}</a-tag> : <a-tag color="green">{text}</a-tag>
          }
        }
      ],
      totalColumn: [
        {
          title: '投入人工总金额(元)',
          align: 'left',
          dataIndex: 'labMoney',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        }
      ]
      //   DescItems: [
      //     {
      //       title: '现金收入合计(元)',
      //       dataIndex: 'incomeSum'
      //     }
      //   ]
    }
  },
  methods: {
    /** 详情 */
    laborDetail(record, row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '人工成本详情',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: LaborUse,
          props: {
            projectCode: record.projectCode,
            startTime: row.startTime,
            endTime: row.endTime,
            region: row.region
          }
        }
      })
    }
  },
  created() {
    this.queryParams.region = this.row.region
    if (!this.isEmpty(this.row.startTime) && !this.isEmpty(this.row.endTime)) {
      if (!this.isEmpty(this.row.startTime)) {
        this.queryParams.startTime = moment(this.row.startTime).format('YYYY-MM') + '-01 00:00:00'
      }
      if (!this.isEmpty(this.row.endTime)) {
        this.queryParams.endTime = moment(this.row.endTime).format('YYYY-MM') + '-31 23:59:59'
      }
    }
  }
}
</script>
