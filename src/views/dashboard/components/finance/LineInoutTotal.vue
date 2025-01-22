<!-- 报表分析 -->
<template>
  <div class="line-inout-total-card">
    <a-card class="inout-card" :bordered="false" :headStyle="{ fontSize: '20px', fontWeight: 'bold', textAlign: 'left' }">
      <h1 slot="title" class="card-title">{{ title }}</h1>
      <div id="lineInoutTotalContainer"></div>
    </a-card>
  </div>
</template>

<script>
import { Line } from '@antv/g2plot'
import { firstInOut } from '/src/api/eos/analysis/analyst.js'

export default {
  name: 'LineInoutTotal',
  props: {
    projectId: {
      type: Number,
      default: null
    },
    title: {
      type: String,
      default: '收支统计'
    }
  },
  data() {
    return {
      chart: null,
      currentYear: new Date().getFullYear(),
      lineChartData: [
        {
          type: '收入',
          time: '-01',
          sum: 0
        },
        {
          type: '收入',
          time: '-02',
          sum: 0
        },
        {
          type: '收入',
          time: '-03',
          sum: 0
        },
        {
          type: '收入',
          time: '-04',
          sum: 0
        },
        {
          type: '收入',
          time: '-05',
          sum: 0
        },
        {
          type: '收入',
          time: '-06',
          sum: 0
        },
        {
          type: '收入',
          time: '-07',
          sum: 0
        },
        {
          type: '收入',
          time: '-08',
          sum: 0
        },
        {
          type: '收入',
          time: '-09',
          sum: 0
        },
        {
          type: '收入',
          time: '-10',
          sum: 0
        },
        {
          type: '收入',
          time: '-11',
          sum: 0
        },
        {
          type: '收入',
          time: '-12',
          sum: 0
        },
        {
          type: '支出',
          time: '-01',
          sum: 0
        },
        {
          type: '支出',
          time: '-02',
          sum: 0
        },
        {
          type: '支出',
          time: '-03',
          sum: 0
        },
        {
          type: '支出',
          time: '-04',
          sum: 0
        },
        {
          type: '支出',
          time: '-05',
          sum: 0
        },
        {
          type: '支出',
          time: '-06',
          sum: 0
        },
        {
          type: '支出',
          time: '-07',
          sum: 0
        },
        {
          type: '支出',
          time: '-08',
          sum: 0
        },
        {
          type: '支出',
          time: '-09',
          sum: 0
        },
        {
          type: '支出',
          time: '-10',
          sum: 0
        },
        {
          type: '支出',
          time: '-11',
          sum: 0
        },
        {
          type: '支出',
          time: '-12',
          sum: 0
        }
      ]
    }
  },
  mounted() {
    this.lineChartData.forEach((item, index) => {
      item.time = this.currentYear + item.time
    })
    this.queryData()
  },
  methods: {
    queryData() {
      firstInOut().then(res => {
        res.data.forEach((item, index) => {
          item.type = item.out === null ? '收入' : '支出'
          item.sum = item.out === null ? item.in : item.out
          item.time = this.currentYear + '-' + item.name
        })
        this.lineChartData.forEach((item, index) => {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].time === item.time && res.data[i].type === item.type) {
              item.sum = res.data[i].sum
            }
          }
        })
        this.initData(this.lineChartData)
      })
    },
    initData(data) {
      this.chart = new Line('lineInoutTotalContainer', {
        data,
        height: 320,
        xField: 'time',
        yField: 'sum',
        seriesField: 'type',
        padding: [60, 40, 50, 90],
        color: ['#1BC8B4', '#6A8ED8', '#348EE4', '#4B42E8', '#8BBFF2', '#C836E7', '#115494'],
        meta: {
          type: 'time',
          tickInterval: 1
        },
        xAxis: {
          mask: 'YYYY-MM',
        },
        yAxis: {
          label: {
            // 数值格式化为千分位
            formatter: v => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, s => `${s},`)
          }
        },
        legend: {
          offsetX: 243,
          marker: {
            symbol: 'circle'
          }
        },
        tooltip: {
          formatter: datum => {
            return { name: datum.type, value: datum.sum + '元' }
          },
          showMarkers: false,
          howCrosshairs: true,
          shared: true
        },
        smooth: true,
        // 配置折线趋势填充
        area: {
          style: {
            fillOpacity: 0.15
          }
        },
        animation: {
          appear: {
            animation: 'wave-in',
            duration: 3000
          }
        }
      })
      this.chart.render()
    }
  }
}
</script>

<style lang="less" scoped>
#lineInoutTotal {
  margin-top: -20px;
}
.inout-card {
  .ant-card-head {
    border: none;
  }
  .ant-card-head-title {
    padding-bottom: 0;
  }
  .ant-card-body {
    padding: 0;
  }
}
</style>
