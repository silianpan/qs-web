<!-- 项目类型条形图统计 -->
<template>
  <div class="chartContainer">
    <h2 class="chartTitle">{{ title }}</h2>
    <div id="containerBarProject"></div>
  </div>
</template>

<script>
import { Bar } from '@antv/g2plot'
import { ProjectType } from '/src/api/eos/analysis/analyst.js'

export default {
  name: 'ProjectTypeBar',
  props: {
    title: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      chartProjectType: null
    }
  },
  mounted() {
    this.queryData(false)
  },
  methods: {
    queryData(isUpdate) {
      ProjectType().then(res => {
        if (isUpdate) {
          this.chartProjectType.changeData(res.data)
        } else {
          this.initData(res.data)
        }
      })
    },
    initData(data) {
      this.chartProjectType = new Bar('containerBarProject', {
        data: data,
        isGroup: true,
        xField: 'number',
        yField: 'name',
        height: 300,
        /** 自定义颜色 */
        // color: ['#1383ab', '#c52125'],
        seriesField: 'name',
        marginRatio: 0,
        tooltip: {
          formatter: datum => {
            return { name: datum.name, value: datum.number }
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
      this.chartProjectType.render()
    }
  }
}
</script>
