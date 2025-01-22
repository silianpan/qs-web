<!-- 公司总计资金计划 -->
<template>
  <a-card :bordered="false">
    <!-- 数据表格 -->
    <a-card title="公司资金计划汇总" :bordered="false" :headStyle="{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }"> </a-card>
    <s-table ref="table" size="default" rowKey="region" :columns="columns" :data="loadData" :show-pagination="false">
      <!-- <p slot="expandedRowRender" slot-scope="record">
          <s-descriptions title="基本信息" :formItems="DescItems" :formData="record" />
        </p> -->
    </s-table>
    <company-fund-pie :row="row" />
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable } from '/src/components/index.js'
import { companyPlanTable } from '/src/api/eos/analysis/analyst.js'
import CompanyFundPie from './CompanyFundPie.vue'

export default {
  name: 'CompanytFund',
  components: {
    STable,
    CompanyFundPie
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    queryParam() {
      const ret = {}
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
      inData: null,

      columns: [
        {
          title: '所属区域',
          dataIndex: 'region'
        },
        {
          title: '计划收款(元)',
          dataIndex: 'planIn',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '计划付款(元)',
          dataIndex: 'planOut',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        }
      ],
      loadData: param => {
        return companyPlanTable(Object.assign({}, this.queryParam)).then(res => {
          return {
            data: res.data
          }
        })
      }
    }
  }
}
</script>
