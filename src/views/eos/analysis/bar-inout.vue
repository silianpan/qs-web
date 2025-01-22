<!-- 报表分析 -->
<template>
  <div id="containerBB"></div>
</template>

<script>
import { Bar } from '@antv/g2plot'
import { getBarAnasylt } from '/src/api/eos/analysis/analyst.js'

export default {
  name: 'BarInout',
  props: {
    projectId: {
      type: Number,
      default: null
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      getBarAnasylt({ projectId: this.projectId }).then(res => {
        const stackedBarPlot = new Bar('containerBB', {
          data: res.data,
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
        stackedBarPlot.render()
      })
    }
  }
}
</script>
