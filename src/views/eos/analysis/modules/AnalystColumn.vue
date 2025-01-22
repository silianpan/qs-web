<!-- 人工柱状图 -->
<template>
  <a-card title="项目人工统计分析" :bordered="false" :headStyle="{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }">
    <div id="containeColumn"></div>
  </a-card>
</template>

<script>
import moment from 'moment'
import { Column } from '@antv/g2plot'
import { AnalystProjectLaborPie } from '/src/api/eos/analysis/analyst.js'

export default {
  name: 'LaborColumn',
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
      AnalystProjectLaborPie(Object.assign({}, QueryParams)).then(res => {
        if (isUpdate) {
          this.chart.changeData(res.data)
        } else {
          this.initData(res.data)
        }
      })
    },
    initData(data) {
      this.chart = new Column('containeColumn', {
        data,
        xField: 'name',
        yField: 'money',
        isGroup: true,
        seriesField: 'name',
        columnWidthRatio: 0.5,
        height: 600,
        label: {
          // 可手动配置 label 数据标签位置
          position: 'top', // 'top', 'bottom', 'middle',
          // 配置样式
          style: {
            fill: '#FFFFFF',
            opacity: 0.6
          }
        },
        tooltip: {
          formatter: datum => {
            return { name: datum.name, value: datum.money + '元' }
          },
          showTitle: false
        },
        legend: {
          position: 'right',
          itemName: {
            style: {
              fontSize: 16
            }
          }
        },
        xAxis: {
          label: {
            autoHide: true,
            autoRotate: false
          }
        },
        meta: {
          name: {
            alias: '项目名称'
          },
          money: {
            alias: '金额'
          }
        }
      })

      this.chart.render()
    }
  }
}
</script>
