<!-- 公司总计人工 -->
<template>
  <a-row :gutter="24">
    <a-col :xl="12" :lg="12" :md="12" :sm="12" :xs="12">
      <a-card :bordered="false">
        <company-labor-pie :row="row" />

        <!-- 数据表格 -->
        <a-card title="公司人工成本区域汇总" :bordered="false" :headStyle="{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }"> </a-card>
        <s-table ref="table" size="default" rowKey="name" :columns="pieColumns" :data="PieData" :show-pagination="false"> </s-table>
      </a-card>
    </a-col>
    <a-col :xl="12" :lg="12" :md="12" :sm="12" :xs="12">
      <a-card :bordered="false">
        <company-labor-bie :row="row" />
        <!-- 数据表格 -->
        <a-card title="公司人工成本项目类型汇总" :bordered="false" :headStyle="{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }"> </a-card>
        <s-table ref="table" size="default" rowKey="name" :columns="BieColumns" :data="BieData" :show-pagination="false"> </s-table>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import moment from 'moment'
import { companyLaborTablePie, companyLaborTableBie } from '/src/api/eos/analysis/analyst.js'
import CompanyLaborBie from './CompanyLaborBie.vue'
import CompanyLaborPie from './CompanyLaborPie.vue'
import { STable } from '/src/components/index.js'

export default {
  name: 'CompanytLabor',
  components: {
    STable,
    CompanyLaborBie,
    CompanyLaborPie
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
      BieData: param => {
        return companyLaborTableBie(Object.assign({}, this.queryParams)).then(res => {
          return {
            data: res.data
          }
        })
      },
      PieData: param => {
        return companyLaborTablePie(Object.assign({}, this.queryParams)).then(res => {
          return {
            data: res.data
          }
        })
      },
      //

      BieColumns: [
        {
          title: '所属区域',
          dataIndex: 'name'
        },
        {
          title: '人工工时（小时）',
          dataIndex: 'workTotal',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '人工金额(元)',
          align: 'left',
          dataIndex: 'totalMoney',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        }
      ],
      pieColumns: [
        {
          title: '所属部门',
          dataIndex: 'name'
        },
        {
          title: '人工工时（小时）',
          dataIndex: 'workTotal',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '人工金额(元)',
          align: 'left',
          dataIndex: 'totalMoney',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        }
      ]
    }
  }
}
</script>
