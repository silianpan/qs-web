<template>
  <a-card :bordered="false">
    <!-- <a-month-picker placeholder="选择时间" @change="onChangeMonth" style="margin-right: 10px" />
    <a-button type="primary" ghost icon="download" @click="exportPorject(queryParam)" style="margin-bottom : 20px">导出</a-button> -->

    <!-- 查询表单 -->
    <!-- <div class="table-page-search-wrapper">
      <s-form search layout="inline" @search="refresh" @reset="reset" :formItems="searchFormItems" :formData="queryParam"> </s-form>
    </div> -->

    <!-- 数据表格 -->
    <a-card title="实际收入" :bordered="false" :headStyle="{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }"> </a-card>
    <s-table ref="table" size="default" rowKey="projectCode" :columns="inColumns" :data="inData">
      <!-- <p slot="expandedRowRender" slot-scope="record">
          <s-descriptions title="基本信息" :formItems="DescItems" :formData="record" />
        </p> -->
    </s-table>

    <a-card title="实际支出（直接费用）" :bordered="false" :headStyle="{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }"> </a-card>
    <s-table ref="table" size="default" rowKey="projectCode" :columns="outColumns" :data="outData">
      <!-- <p slot="expandedRowRender" slot-scope="record">
          <s-descriptions title="基本信息" :formItems="DescItems" :formData="record" />
        </p> -->
    </s-table>

    <s-table ref="table" size="default" rowKey="outTotal" :columns="totalColumns" :data="totalData"> </s-table>

    <a-card title="借款" :bordered="false" :headStyle="{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }"> </a-card>
    <!-- <s-table ref="table" size="default" rowKey="sum" :columns="loanColumns" :data="loanData"> </s-table> -->
    <s-descriptions :title="title" :formItems="loanColumns" :formData="loanData" />

    <!-- <a-card title="收支情况分析" :bordered="false" :headStyle="{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }"> </a-card> -->
    <bar-total ref="BarTotalRef" />
  </a-card>
</template>

<script lang="jsx">
import moment from 'moment'
import { AnalystProjectPaymentIn, AnalystProjectPaymentOut, AnalystProjectLoan, AnalystProjectPaymentTotal } from '/src/api/eos/analysis/analyst.js'
import { STable, SDescriptions } from '/src/components/index.js'
import PaymentUse from '/src/views/eos/purchase/payment/modules/PaymentUse.vue'
import ExpenseUse from '/src/views/eos/expense/modules/ExpenseUse.vue'
import OnbusUse from '/src/views/eos/cost/onbus/modules/OnbusUse'
import BarTotal from '../bar-total.vue'

export default {
  name: 'AnalystReal',
  components: {
    STable,
    SDescriptions,
    BarTotal
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    queryParams() {
      const ret = {
        region: this.row.region
      }
      if (!this.isEmpty(this.row.startTime)) {
        ret.startTime = moment(this.row.startTime).format('YYYY-MM') + '-01 00:00:00'
      }
      if (!this.isEmpty(this.row.endTime)) {
        ret.endTime = moment(this.row.endTime).format('YYYY-MM') + '-31 23:59:59'
      }
      return ret
    }
  },
  data() {
    return {
      title: '借款总金额（单位：元）',
      loanData: {},
      // 收入
      inData: param => {
        return AnalystProjectPaymentIn(Object.assign({}, this.queryParams)).then(res => {
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      // 支出
      outData: param => {
        return AnalystProjectPaymentOut(Object.assign({}, this.queryParams)).then(res => {
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      // 汇总
      totalData: param => {
        return AnalystProjectPaymentTotal(Object.assign({}, this.queryParams)).then(res => {
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
      inColumns: [
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
          dataIndex: 'payMoney',
          customRender: text => this.toThousandFilter(text)
        }
      ],
      outColumns: [
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
          title: '报销金额(元)',
          align: 'left',
          dataIndex: 'expenseTotal',
          customRender: (text, record) => {
            return (
              <span style="color:#348EE4;cursor:pointer" onClick={() => this.expenseDetail(record, this.row)}>
                {this.toThousandFilter(text)}
              </span>
            )
          }
        },
        {
          title: '采购金额(元)',
          align: 'left',
          dataIndex: 'paymentTotal',
          customRender: (text, record) => {
            return (
              <span style="color:#348EE4;cursor:pointer" onClick={() => this.paymentDetail(record, this.row)}>
                {this.toThousandFilter(text)}
              </span>
            )
          }
        },
        {
          title: '差旅成本(元)',
          dataIndex: 'onBusTotal',
          customRender: (text, record) => {
            return (
              <span style="color:#348EE4;cursor:pointer" onClick={() => this.onbusDetail(record, this.row)}>
                {this.toThousandFilter(text)}
              </span>
            )
          }
        }
      ],
      totalColumns: [
        {
          title: '实际收入总金额(元)',
          align: 'left',
          dataIndex: 'inTotal',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '实际直接费用支出总金额(元)',
          align: 'left',
          dataIndex: 'outTotal',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '报销总金额(元)',
          align: 'left',
          dataIndex: 'expenseTotal',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '采购总金额(元)',
          align: 'left',
          dataIndex: 'paymentTotal',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '差旅总成本(元)',
          align: 'left',
          dataIndex: 'onBusTotal',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        }
      ],
      loanColumns: [
        {
          // label: '金额（单位：元）',
          prop: 'sum'
        }
      ]
      //   DescItems: [
      //     {
      //       title: '预算收支(元)',
      //       dataIndex: 'resMoney'
      //     }
      //   ]
    }
  },
  methods: {
    /** 报销详情 */
    expenseDetail(record, row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '报销汇总详情',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: ExpenseUse,
          props: {
            projectCode: record.projectCode,
            startTime: row.startTime,
            endTime: row.endTime,
            region: row.region
          }
        }
      })
    },
    /** 采购详情 */
    paymentDetail(record, row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '采购详情',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: PaymentUse,
          props: {
            projectCode: record.projectCode,
            startTime: row.startTime,
            endTime: row.endTime,
            region: row.region
          }
        }
      })
    },
    /** 差旅详情 */
    onbusDetail(record, row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '差旅成本详情',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: OnbusUse,
          props: {
            projectCode: record.projectCode,
            startTime: row.startTime,
            endTime: row.endTime,
            region: row.region
          }
        }
      })
    },
    initData(isUpdate) {
      this.$refs.BarTotalRef.queryData(isUpdate, this.queryParams.startTime, this.queryParams.endTime, this.queryParams.region)
    }
  },
  mounted() {
    // 借款
    AnalystProjectLoan(Object.assign({}, this.queryParams)).then(res => {
      this.loanData = res.data
    })
    this.initData(false)
  },
  watch: {
    row: {
      handler(oldVal, newVal) {
        this.initData(true)
      },
      deep: true
    }
  }
}
</script>
