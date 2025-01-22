<template>
  <a-card :bordered="false">
    <!-- <a-month-picker placeholder="选择时间" @change="onChangeMonth" style="margin-right: 10px" />
    <a-button type="primary" ghost icon="download" @click="exportPorject(queryParam)" style="margin-bottom : 20px">导出</a-button> -->

    <!-- 查询表单 -->
    <!-- <div class="table-page-search-wrapper">
      <s-form search layout="inline" @search="refresh" @reset="reset" :formItems="searchFormItems" :formData="queryParam"> </s-form>
    </div> -->

    <!-- 数据表格 -->
    <a-card title="计划内收入" :bordered="false" :headStyle="{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }"> </a-card>
    <s-table ref="table" size="default" rowKey="projectCode" :columns="Incolumns" :data="inData">
      <!-- <p slot="expandedRowRender" slot-scope="record">
          <s-descriptions title="基本信息" :formItems="DescItems" :formData="record" />
        </p> -->
    </s-table>
    <a-card title="计划内支出" :bordered="false" :headStyle="{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }"> </a-card>
    <s-table ref="table" size="default" rowKey="projectCode" :columns="Outcolumns" :data="outData"> </s-table>

    <s-table ref="table" size="default" rowKey="outTotal" :columns="Totalcolumns" :data="totalData"> </s-table>
    <fund-pie :row="this.row" />
  </a-card>
</template>

<script>
import moment from 'moment'
import { AnalystProjectFundIn, AnalystProjectFundOut, AnalystProjectFundTotal } from '/src/api/eos/analysis/analyst.js'
import { STable } from '/src/components/index.js'
import FundPie from './AnalystPie.vue'

export default {
  name: 'AnalystFund',
  components: {
    STable,
    FundPie
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    queryParam() {
      const ret = {
        region: this.row.region
      }
      if (!this.isEmpty(this.row.startTime)) {
        ret.startTime = moment(this.row.startTime).format('YYYY-MM') + '-01 00:00:00'
      }
      if (!this.isEmpty(this.row.endTime)) {
        ret.endTime = moment(this.row.endTime).format('YYYY-MM') + '-31 :23:59:59'
      }
      return ret
    }
  },
  data() {
    return {
      // 加载数据
      inData: param => {
        return AnalystProjectFundIn(Object.assign({}, this.queryParam)).then(res => {
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      outData: param => {
        return AnalystProjectFundOut(Object.assign({}, this.queryParam)).then(res => {
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      totalData: param => {
        return AnalystProjectFundTotal(Object.assign({}, this.queryParam)).then(res => {
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
      Incolumns: [
        {
          title: '项目编号',
          dataIndex: 'projectCode'
        },
        {
          title: '项目名称',
          dataIndex: 'projectName'
        },
        {
          title: '金额(元)',
          align: 'left',
          dataIndex: 'inMoney'
        }
      ],
      Outcolumns: [
        {
          title: '项目编号',
          dataIndex: 'projectCode'
        },
        {
          title: '项目名称',
          dataIndex: 'projectName'
        },
        {
          title: '总计(元)',
          dataIndex: 'total',
          customRender: text => this.toThousandFilter(text)
        },
        {
          title: '货款(元)',
          dataIndex: 'goodsMoney',
          customRender: text => this.toThousandFilter(text)
        },
        {
          title: '运费(元)',
          dataIndex: 'travelMoney',
          customRender: text => this.toThousandFilter(text)
        },
        {
          title: '零星材料(元)',
          dataIndex: 'material',
          customRender: text => this.toThousandFilter(text)
        },
        {
          title: '汽车使用费(元)',
          dataIndex: 'busMoney',
          customRender: text => this.toThousandFilter(text)
        },
        {
          title: '劳务费(元)',
          dataIndex: 'workMoney',
          customRender: text => this.toThousandFilter(text)
        },
        {
          title: '其他直接费用(元)',
          dataIndex: 'otherMoney',
          customRender: text => this.toThousandFilter(text)
        },
        {
          title: '现场经费(元)',
          dataIndex: 'liveMoney',
          customRender: text => this.toThousandFilter(text)
        }
      ],
      Totalcolumns: [
        {
          title: '计划收入总金额(元)',
          dataIndex: 'inTotal',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '计划支出总金额(元)',
          dataIndex: 'outTotal',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '货款总金额(元)',
          dataIndex: 'goodsMoney',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '运费总金额(元)',
          align: 'left',
          dataIndex: 'travelMoney',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '零星材料总金额(元)',
          align: 'left',
          dataIndex: 'material',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '汽车使用费总金额(元)',
          align: 'left',
          dataIndex: 'busMoney',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '劳务费总金额(元)',
          align: 'left',
          dataIndex: 'workMoney',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '其他直接费用总金额(元)',
          align: 'left',
          dataIndex: 'otherMoney',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '现场经费总金额(元)',
          align: 'left',
          dataIndex: 'liveMoney',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        }
      ]
    }
  }
}
</script>
