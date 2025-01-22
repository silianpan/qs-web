<!-- 成本分析 -->
<template>
  <a-card class="card-container card-container-height" :bordered="false" :headStyle="{ border: 'none' }" :bodyStyle="{ padding: 0, overflow: 'hidden' }">
    <h1 slot="title" class="card-title">{{ title }}</h1>
    <div id="containerBarCost"></div>
  </a-card>
</template>

<script>
import { Bar } from '@antv/g2plot'

export default {
  name: 'BarCost',
  props: {
    title: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      chartObj: null,
      chartData: [
        {
          name: '采购',
          sum: 65784.7
        },
        {
          name: '劳务',
          sum: 23432.33
        },
        {
          name: '分包',
          sum: 73245.55
        },
        {
          name: '报销',
          sum: 12343.1
        }
      ]
    }
  },
  mounted() {
    this.queryData(false)
  },
  methods: {
    queryData(isUpdate) {
      // ProjectType().then(res => {
      //   if (isUpdate) {
      //     this.chartObj.changeData(res.data)
      //   } else {
      //     this.initData(res.data)
      //   }
      // })
      // todo api请求
      this.initData(this.chartData)
    },
    initData(data) {
      this.chartObj = new Bar('containerBarCost', {
        data,
        height: 250,
        padding: [45, 60, 60, 60],
        xField: 'sum',
        yField: 'name',
        seriesField: 'name',
        color: ['#FFCD2A', '#26E6A2', '#8BBFF2', '#C836E7'],
        coordinate: [{ type: 'reflectX' }, { type: 'reflectY' }],
        meta: {
          sum: {
            alias: '总金额(元)'
          }
        },
        legend: false,
        tooltip: {
          showTitle: false
        },
        label: {
          layout: [
            // 柱形图数据标签位置自动调整
            { type: 'interval-adjust-position' },
            // 数据标签防遮挡
            { type: 'interval-hide-overlap' },
            // 数据标签文颜色自动调整
            { type: 'adjust-color' }
          ]
        },
        xAxis: {
          title: {
            text: '元',
            position: 'end',
            autoRotate: false
          }
        }
      })
      this.chartObj.render()
    }
  }
}
</script>
