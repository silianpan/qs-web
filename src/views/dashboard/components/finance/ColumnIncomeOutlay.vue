<!-- 收支分析 -->
<template>
  <a-card class="card-container card-container-height" :bordered="false" :headStyle="{ border: 'none' }" :bodyStyle="{ padding: 0, overflow: 'hidden' }">
    <h1 slot="title" class="card-title">{{ title }}</h1>
    <div id="containerColumnIncomeOutlay"></div>
  </a-card>
</template>

<script>
import { DualAxes, Column } from '@antv/g2plot'
import { managerCost } from '/src/api/eos/analysis/analyst.js'

export default {
  name: 'ColumnIncomeOutlay',
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
          name: '计划收入',
          money: 0
        },
        {
          name: '计划支出',
          money: 0
        },
        {
          name: '收款',
          money: 0
        },
        {
          name: '支出',
          money: 0
        }
      ]
    }
  },
  mounted() {
    this.queryData()
  },
  methods: {
    queryData() {
      // todo api请求
      managerCost().then(res => {
        this.chartData = res.data
        this.initData(this.chartData)
      })
    },
    initData2(data) {
      this.chartObj = new DualAxes('containerColumnIncomeOutlay', {
        data: [data, data],
        height: 250,
        width: 540,
        padding: [26, 50, 40, 45],
        xField: 'name',
        maxColumnWidth: 10,
        columnWidthRatio: 0.2,
        yField: ['money'],
        meta: {
          money: {
            alias: '总金额(元)'
          }
        },
        legend: {
          position: 'right'
        },
        geometryOptions: [
          {
            geometry: 'column',
            label: {
              // 可手动配置 label 数据标签位置
              position: 'middle', // 'top', 'bottom', 'middle',
              // 配置样式
              style: {
                fill: '#FFFFFF',
                opacity: 0.6
              }
            },
            seriesField: 'name',
            color: ['#4b42e8', '#ffa82a', '#ff6f2a', '#66adf2']
          },
          {
            geometry: 'line',
            lineStyle: {
              stroke: '#348ee4',
              lineWidth: 2
            }
          }
        ]
      })
      this.chartObj.render()
    },
    initData(data) {
      this.chartObj = new Column('containerColumnIncomeOutlay', {
        data,
        xField: 'name',
        yField: 'money',
        height: 250,
        width: 540,
        padding: [50, 70, 40, 100],
        columnWidthRatio: 0.2,
        xAxis: {
          label: {
            autoHide: true,
            autoRotate: false
          }
        },
        meta: {
          name: {
            alias: '类别'
          },
          money: {
            alias: '支出'
          }
        }
      })
      this.chartObj.render()
    }
  }
}
</script>

<style lang="less" scoped>
#containerColumnIncomeOutlay {
  border-top: 1px solid #ebebeb;
}
</style>
