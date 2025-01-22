<!--公司人工情况：柱状图 -->
<template>
  <a-card title="公司人工项目类型汇总统计" :bordered="false" :headStyle="{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }">
    <div id="containerCompanyLaborColumn"></div>
  </a-card>
</template>

<script>
import moment from 'moment'
import { Column } from '@antv/g2plot'
import { companyLaborBie } from '/src/api/eos/analysis/analyst.js'

export default {
  name: 'CompanyLaborBie',
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
      companyLaborBie(Object.assign({}, this.queryParam)).then(res => {
        if (isUpdate) {
          this.chartCompanyBie.changeData(res.data)
        } else {
          this.initData(res.data)
        }
      })
    },
    initData(data) {
      this.chartCompanyBie = new Column('containerCompanyLaborColumn', {
        data: data,
        xField: 'name',
        yField: 'money',
        xAxis: {
          label: {
            autoHide: false,
            autoRotate: true
          }
        },
        // isGroup: true,
        // seriesField: 'name',
        // legend: {
        //   position: 'right',
        //   itemName: {
        //     style: {
        //       fontSize: 12
        //     }
        //   }
        // },
        // autoEllipsis: false,
        // autoAdjust: true,
        // AnnotationTextCfg: {
        //   content: String,
        //   autoRotate: true,
        //   offsetX: 50
        // },
        // isStack: true,
        label: {
          autoHide: false,
          // autoRotate: false,
          position: 'top'
        },
        tooltip: {
          formatter: datum => {
            return { name: datum.name, value: datum.money + '元' }
          },
          showTitle: false
        }
      })
      this.chartCompanyBie.render()
    }
  }
}
</script>
