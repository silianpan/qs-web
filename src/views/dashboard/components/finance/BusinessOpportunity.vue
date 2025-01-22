<!-- 收支分析 -->
<template>
  <a-card class="card-container card-container-height" :bordered="false" :headStyle="{ border: 'none' }" :bodyStyle="{ padding: 0, overflow: 'hidden' }">
    <h1 slot="title" class="card-title">{{ title }}</h1>
    <div id="containerBusinessOpportunity"></div>
  </a-card>
</template>

<script>
import { Pie, measureTextWidth } from '@antv/g2plot'
import { businessSale } from '/src/api/eos/analysis/analyst.js'

export default {
  name: 'BusinessOpportunity',
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
        { name: null, num: 27 },
        { name: '跟进中', num: 25 },
        { name: '转换项目', num: 18 },
        { name: '放弃结束', num: 15 }
      ]
    }
  },
  mounted() {
    this.queryData()
  },
  methods: {
    queryData() {
      // todo api请求
      businessSale().then(res => {
        res.data.forEach((item, index) => {
          item.num = Number(item.num)
        })
        this.chartData = res.data
        this.initData(this.chartData)
      })
    },
    initData(data) {
      this.chartObj = new Pie('containerBusinessOpportunity', {
        appendPadding: 10,
        data,
        angleField: 'num',
        colorField: 'name',
        radius: 1,
        color: ['#009EFB', '#55CE63', '#745AF2', '#EDF1F5', '#8BBFF2', '#C836E7', '#115494'],
        innerRadius: 0.64,
        meta: {
          num: {
            formatter: v => `${v}`
          }
        },
        label: {
          type: 'inner',
          offset: '-50%',
          style: {
            textAlign: 'center'
          },
          autoRotate: false,
          content: '{value}'
        },
        statistic: {
          title: {
            offsetY: -4,
            customHtml: (container, view, datum) => {
              const { width, height } = container.getBoundingClientRect()
              const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2))
              const text = datum ? datum.name : '商机总数'
              return this.renderStatistic(d, text, { fontSize: 28 })
            }
          },
          content: {
            offsetY: 4,
            style: {
              fontSize: '32px'
            },
            customHtml: (container, view, datum, data) => {
              const { width } = container.getBoundingClientRect()

              const text = datum ? `${datum.num}` : `${data.reduce((r, d) => r + d.num, 0)}`
              return this.renderStatistic(width, text, { fontSize: 32 })
            }
          }
        },
        // 添加 中心统计文本 交互
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }, { type: 'pie-statistic-active' }]
      })
      this.chartObj.render()
    },
    renderStatistic(containerWidth, text, style) {
      const { width: textWidth, height: textHeight } = measureTextWidth(text, style)
      const R = containerWidth / 2
      // r^2 = (w / 2)^2 + (h - offsetY)^2
      let scale = 1
      if (containerWidth < textWidth) {
        scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))), 1)
      }
      const textStyleStr = `width:${containerWidth}px;`
      return `<div style="${textStyleStr};font-size:${scale}em;line-height:${scale < 1 ? 1 : 'inherit'};">${text}</div>`
    }
  }
}
</script>

<style lang="less" scoped>
#containerBusinessOpportunity {
  height: 248px;
  border-top: 1px solid #ebebeb;
}
.ant-card-head {
  border-bottom: 1px solid #ebebeb;
}
</style>
