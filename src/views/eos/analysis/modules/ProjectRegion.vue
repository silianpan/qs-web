<!-- 项目区域饼状图统计 -->
<template>
  <div class="chartContainer">
    <h2 class="chartTitle">{{ title }}</h2>
    <div id="containerPieRegion"></div>
  </div>
</template>

<script>
import { Pie } from '@antv/g2plot'
import { ProjectRegion } from '/src/api/eos/analysis/analyst.js'

export default {
  name: 'ProjectRegionPie',
  props: {
    title: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      chartProjectRegion: null
    }
  },
  mounted() {
    this.queryData(false)
  },
  methods: {
    queryData(isUpdate) {
      ProjectRegion().then(res => {
        if (isUpdate) {
          this.chartProjectRegion.changeData(res.data)
        } else {
          this.initData(res.data)
        }
      })
    },
    initData(data) {
      this.chartProjectRegion = new Pie('containerPieRegion', {
        data: data,
        appendPadding: 10,
        angleField: 'number',
        colorField: 'name',
        radius: 0.9,
        height: 300,
        color: ['#FF6F2A', '#26E6A2', '#FFCD2A', '#348EE4'],
        // tooltip: {
        //   formatter: datum => {
        //     return { name: datum.kind, value: datum.money + '元' }
        //   },
        //   showTitle: false
        // },
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
      this.chartProjectRegion.render()
    }
  }
}
</script>
