<!-- 经营分析 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <!-- 项目表格 -->
    <!-- <project-time /> -->
    <a-card :bordered="false">
      <!-- 查询表单 -->
      <div class="table-page-search-wrapper">
        <s-form search layout="inline" @search="refresh" @reset="reset" :formItems="searchFormItems" :formData="queryParam"> </s-form>
      </div>

      <!-- 数据表格 -->
      <s-table ref="table" size="default" :rowKey="(_, index) => index" :columns="columns" :data="loadData">
        <p slot="expandedRowRender" slot-scope="record">
          <s-descriptions title="基本信息" :formItems="DescItems" :formData="record" />
        </p>
        <span slot="action" slot-scope="record">
          <a-button type="link" @click="isTotal(record.region, queryParam)"> <a-icon type="bar-chart" />分析 </a-button>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import moment from 'moment'
import { areaList } from '/src/api/eos/analysis/analyst.js'
import { SForm, STable, SDescriptions } from '/src/components/index.js'
// import ProjectTime from './project-time.vue'
import AnalystDetailAll from './detailAll.vue'
import CompanyDetailAll from './companyDetail.vue'

export default {
  name: 'Area',
  components: {
    STable,
    SForm,
    SDescriptions
  },
  data() {
    return {
      // 查询参数
      queryParam: {},
      // 加载数据方法
      loadData: param => {
        const QueryParams = { ...this.queryParam }
        if (!this.isEmpty(QueryParams.startTime)) {
          const startTime = moment(QueryParams.startTime).startOf('month').valueOf()
          QueryParams.startTime = moment(startTime).format('YYYY-MM') + '-01 00:00:00'
          const endtime = moment(QueryParams.startTime).endOf('month').valueOf()
          QueryParams.endTime = moment(endtime).format('YYYY-MM') + '-31 23:59:59'
        }
        return areaList(Object.assign({}, param, QueryParams)).then(res => {
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
          label: '年月'
        }
        // {
        //   type: 'monthPicker',
        //   prop: 'endTime',
        //   label: '结束年月'
        // },
        // {
        //   type: 'input',
        //   prop: 'region',
        //   label: '所在区域'
        // }
      ],
      columns: [
        {
          title: '所在区域',
          align: 'left',
          dataIndex: 'region'
        },
        {
          title: '收入合同(元)',
          dataIndex: 'incomeSum',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '支出合同(元)',
          dataIndex: 'outcomeSum',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '报销(元)',
          align: 'left',
          dataIndex: 'expenseSum',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '采购(元)',
          align: 'left',
          dataIndex: 'paymentSum',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '支付总计(元)',
          align: 'left',
          dataIndex: 'expendTotal',
          customRender: (text, record) => {
            return <span style="color:#1d953f">{this.toThousandFilter(text)}</span>
          }
        },
        {
          title: '开票(元)',
          dataIndex: 'invoiceSum',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '实际收款(元)',
          align: 'left',
          dataIndex: 'paymentRealSum',
          customRender: (text, record) => {
            return <span style="color:#1d953f">{this.toThousandFilter(text)}</span>
          }
        },
        {
          title: '操作',
          align: 'left',
          width: 170,
          scopedSlots: { customRender: 'action' }
        }
      ],
      DescItems: [
        {
          label: '管理预算(总金额，元)',
          prop: 'budgetMageSum',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '管理预算(剩余，元)',
          prop: 'budgetMageSumLeft',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '生产预算(总金额，元)',
          prop: 'budgetProdSum',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '生产预算(剩余，元)',
          prop: 'budgetProdSumLeft',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '销售预算（总金额，元）',
          prop: 'budgetSaleSum',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '销售预算(剩余，元)',
          prop: 'budgetSaleSumLeft',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '报销(总金额，元)',
          prop: 'expenseSum',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '报销(生产，元)',
          prop: 'expenseSumProd',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '报销(销售，元)',
          prop: 'expenseSumSale',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '报销(管理，元)',
          prop: 'expenseSumMage',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '采购(总金额，元)',
          prop: 'paymentSum',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '采购付款(生产，元)',
          prop: 'paymentSumProd',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '采购付款(销售，元)',
          prop: 'paymentSumSale',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '实际收款(总金额，元)',
          prop: 'paymentRealSum',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '开票(总金额，元)',
          prop: 'invoiceSum',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        // {
        //   label: '资金计划(支出，元)',
        //   prop: 'fundOutSum',
        //   customRender: (text, record) => {
        //     return this.toThousandFilter(text)
        //   }
        // },
        // {
        //   label: '资金计划(收入，元)',
        //   prop: 'fundInSum',
        //   customRender: (text, record) => {
        //     return this.toThousandFilter(text)
        //   }
        // },
        {
          label: '人工成本(总金额，元)',
          prop: 'laborSum',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '人工成本(生产，元)',
          prop: 'laborSumProd',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '人工成本(销售，元)',
          prop: 'laborSumSale',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '人工成本(管理，元)',
          prop: 'laborSumMage',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '差旅成本(总金额，元)',
          prop: 'onBusSum',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '差旅成本(生产，元)',
          prop: 'onBusSumProd',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '差旅成本(销售，元)',
          prop: 'onBusSumSale',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '差旅成本(管理，元)',
          prop: 'onBusSumMage',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        }
        // {
        //   label: '机票(管理)',
        //   prop: 'planeSumMage'
        // },
        // {
        //   label: '机票(总金额)',
        //   prop: 'planeSum'
        // },
        // {
        //   label: '机票(生产)',
        //   prop: 'planeSumProd'
        // },
        // {
        //   label: '机票(销售)',
        //   prop: 'planeSumSale'
        // }
      ]
    }
  },
  methods: {
    // 刷新页面
    refresh() {
      this.$refs.table.refresh(true)
    },
    // 重置查询参数
    reset() {
      this.queryParam = {}
    },
    isTotal(record, queryParam) {
      if (record === '公司总计') {
        this.charTotal(queryParam)
      } else {
        this.chartAnalyst(record, queryParam)
      }
    },

    /** 区域分析 */
    chartAnalyst(record, queryParam) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '区域数据分析',
          width: '90%',
          maskClosable: true
        },
        content: {
          template: AnalystDetailAll,
          props: {
            row: {
              region: record,
              startTime: queryParam.startTime,
              endTime: queryParam.startTime
            }
          }
        }
      })
    },
    /** 公司总计 */
    charTotal(queryParam) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '公司总计数据分析',
          width: '90%',
          maskClosable: true
        },
        content: {
          template: CompanyDetailAll,
          props: {
            row: {
              startTime: queryParam.startTime,
              endTime: queryParam.startTime
            }
          }
        }
      })
    }
  }
}
</script>
