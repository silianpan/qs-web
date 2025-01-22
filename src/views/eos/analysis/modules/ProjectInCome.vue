<!-- 项目收款情况：饼图 -->
<template>
  <a-card :title="title" :bordered="false" :headStyle="{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }">
    <div id="containerPieInCome"></div>
  </a-card>
</template>

<script>
import { Pie } from '@antv/g2plot'
import { analysisInComeLeft } from '/src/api/eos/analysis/analyst.js'

export default {
  name: 'ProjectInCome',
  props: {
    projectId: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      default: '当前收款情况（单位：元）'
    }
  },
  data() {
    return {
      chartProjectInCome: null
    }
  },
  mounted() {
    this.queryData(false)
  },
  methods: {
    queryData(isUpdate) {
      analysisInComeLeft({ projectId: this.projectId }).then(res => {
        if (isUpdate) {
          this.chartProjectInCome.changeData(res.data)
        } else {
          this.initData(res.data)
        }
      })
    },
    initData(data) {
      this.chartProjectInCome = new Pie('containerPieInCome', {
        data: data,
        appendPadding: 10,
        angleField: 'money',
        colorField: 'kind',
        radius: 0.9,
        height: 300,
        // tooltip: {
        //   formatter: datum => {
        //     return { name: datum.kind, value: datum.money + '元' }
        //   },
        //   showTitle: false
        // },
        label: {
          type: 'inner',
          offset: '-30%',
          content: ({ percent }) => `${(percent * 100).toFixed(2)}%`,
          style: {
            fontSize: 14,
            textAlign: 'center'
          }
        },
        interactions: [{ type: 'element-active' }]
      })
      this.chartProjectInCome.render()
    }
  }
}
</script>
