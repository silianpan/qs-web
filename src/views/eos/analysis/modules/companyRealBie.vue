<!--公司收支情况：柱状图 -->
<template>
  <a-card title="公司收支汇总统计" :bordered="false" :headStyle="{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }">
    <div id="containerCompanyColumn"></div>
  </a-card>
</template>

<script>
import moment from 'moment'
import { Column } from '@antv/g2plot'
import { companyPlanBie } from '/src/api/eos/analysis/analyst.js'

export default {
  name: 'CompanyRealBie',
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
      chartCompanyBie: null
    }
  },
  mounted() {
    this.queryData(false)
  },
  methods: {
    queryData(isUpdate) {
      companyPlanBie(Object.assign({}, this.queryParam)).then(res => {
        if (isUpdate) {
          this.chartCompanyBie.changeData(res.data)
        } else {
          this.initData(res.data)
        }
      })
    },
    initData(data) {
      this.chartCompanyBie = new Column('containerCompanyColumn', {
        data: data,
        xField: 'name',
        yField: 'money',
        isGroup: true,
        isStack: true,
        seriesField: 'kind',
        groupField: 'planName',
        tooltip: {
          formatter: datum => {
            return { name: datum.kind, value: datum.money + '元' }
          },
          showTitle: false
        }
      })
      this.chartCompanyBie.render()
    }
  }
}
</script>
