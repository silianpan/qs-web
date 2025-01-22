<!-- 报表分析 -->
<template>
  <a-card title="收支汇总（单位：元）" :bordered="false" :headStyle="{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }">
    <div id="containerBarTotal"></div>
  </a-card>
</template>

<script>
import { Bar } from '@antv/g2plot'
import { getBarTotalAnasylt } from '/src/api/eos/analysis/analyst.js'

export default {
  name: 'BarTotal',
  data() {
    return {
      chart: null
    }
  },
  // mounted() {
  //   this.queryData(false)
  // },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy()
      this.chart = null
    }
  },
  methods: {
    queryData(isUpdate, startTime, endTime, region) {
      getBarTotalAnasylt({ startTime, endTime, region }).then(res => {
        if (isUpdate) {
          this.chart.changeData(res.data)
        } else {
          this.initData(res.data)
        }
      })
    },
    initData(data) {
      this.chart = new Bar('containerBarTotal', {
        data: data,
        isGroup: true,
        xField: 'money',
        yField: 'name',
        /** 自定义颜色 */
        // color: ['#1383ab', '#c52125'],
        seriesField: 'kind',
        marginRatio: 0,
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
        label: {
          // 可手动配置 label 数据标签位置
          position: 'right', // 'left', 'middle', 'right'
          // 可配置附加的布局方法
          layout: [
            // 柱形图数据标签位置自动调整
            // { type: 'interval-adjust-position' },
            // 数据标签防遮挡
            { type: 'interval-hide-overlap' },
            // 数据标签文颜色自动调整
            { type: 'adjust-color' }
          ]
        }
      })
      this.chart.render()
    }
  }
}
</script>
