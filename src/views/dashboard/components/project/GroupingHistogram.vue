<!-- 分组柱状图  -->
<template>
  <div>
    <a-card class="group-histogram" :bordered="false" :headStyle="{ fontSize: '20px', fontWeight: 'bold', textAlign: 'left' }">
      <h1 slot="title" class="card-title">{{ title }}</h1>
      <div id="columnContainer"></div>
    </a-card>
  </div>
</template>

<script>
import { Column } from '@antv/g2plot'

export default {
  name: 'GroupingHistogram',
  props: {
    title: {
      type: String,
      default: '分类统计'
    },
  },
  data() {
    return {
      chart: null,
    }
  },
  mounted() {
  },
  methods: {
    initData(data) {
      this.chart = new Column('columnContainer', {
        data,
        isGroup: true,
        xField: 'type',
        yField: 'money',
        seriesField: 'name',
        /** 设置颜色 */
        //color: ['#1ca9e6', '#f88c24'],
        /** 设置间距 */
        // marginRatio: 0.1,
        label: {
          // 可手动配置 label 数据标签位置
          position: 'middle', // 'top', 'middle', 'bottom'
          // 可配置附加的布局方法
          layout: [
            // 柱形图数据标签位置自动调整
            { type: 'interval-adjust-position' },
            // 数据标签防遮挡
            { type: 'interval-hide-overlap' },
            // 数据标签文颜色自动调整
            { type: 'adjust-color' }
          ]
        },
        padding: [40, 120, 40, 60],
        legend: {
          offsetX: 15,
          position: 'right-bottom',
          marker: {
            symbol: 'circle'
          }
        }
      })
      this.chart.render()
    }
  }
}
</script>

<style lang="less">
.group-histogram{
  .ant-card-head{
    border: none !important;
  }
}
</style>
