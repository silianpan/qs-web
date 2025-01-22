<!-- 公司人工饼状图 -->
<template>
  <a-card title="人工区域汇总占比" :bordered="false" :headStyle="{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }">
    <div id="containerCompanyLaborBie"></div>
  </a-card>
</template>

<script>
import moment from 'moment'
import { Pie } from '@antv/g2plot'
import { companyLaborPie } from '/src/api/eos/analysis/analyst.js'

export default {
  name: 'CompanyLaborPie',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.queryData(false)
  },
  methods: {
    queryData(isUpdate) {
      const QueryParams = { ...this.row }
      if (!this.isEmpty(QueryParams.startTime)) {
        QueryParams.startTime = moment(QueryParams.startTime).format('YYYY-MM') + '-01 00:00:00'
      }
      if (!this.isEmpty(QueryParams.endTime)) {
        QueryParams.endTime = moment(QueryParams.endTime).format('YYYY-MM') + '-31 23:59:59'
      }
      companyLaborPie(Object.assign({}, QueryParams)).then(res => {
        if (isUpdate) {
          this.chart.changeData(res.data)
        } else {
          this.initData(res.data)
        }
      })
    },
    initData(data) {
      this.chart = new Pie('containerCompanyLaborBie', {
        data: data,
        appendPadding: 10,
        angleField: 'money',
        colorField: 'name',
        radius: 0.9,
        tooltip: {
          formatter: datum => {
            return { name: datum.kind, value: datum.money + '元' }
          },
          showTitle: false
        },
        label: {
          type: 'inner',
          offset: '-30%',
          content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
          style: {
            fontSize: 14,
            textAlign: 'center'
          }
        },
        interactions: [{ type: 'element-active' }]
      })

      this.chart.render()
    }
  }
}
</script>
