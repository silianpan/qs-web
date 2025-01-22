<!-- 报表分析 -->
<template>
  <a-card :bordered="false" :headStyle="{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }">
    <h1 slot="title" class="card-title">{{ title }}</h1>
    <div id="lineInout"></div>
  </a-card>
</template>

<script>
import { Line } from '@antv/g2plot'
import { getLineAnasylt } from '/src/api/eos/analysis/analyst.js'

import ExpenseUse from '/src/views/eos/expense/modules/ExpenseUse.vue'
import PaymentUse from '/src/views/eos/purchase/payment/modules/PaymentUse.vue'
import laborUse from '/src/views/eos/cost/labor/modules/LaborUse.vue'
import onbusUse from '/src/views/eos/cost/onbus/modules/OnbusUse.vue'

export default {
  name: 'LineInout',
  props: {
    projectId: {
      type: Number,
      default: null
    },
    title: {
      type: String,
      default: '每月支出情况'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.queryData(false)
  },
  methods: {
    queryData(isUpdate, startTime, endTime) {
      getLineAnasylt({ projectId: this.projectId, startTime, endTime }).then(res => {
        if (isUpdate) {
          this.chart.changeData(res.data)
        } else {
          this.initData(res.data)
        }
      })
    },
    initData(data) {
      this.chart = new Line('lineInout', {
        data,
        height: 400,
        xField: 'createTime',
        yField: 'money',
        seriesField: 'kind',
        color: ['#FFCD2A', '#FF6F2A', '#348EE4', '#4B42E8', '#8BBFF2', '#C836E7', '#115494'],
        xAxis: {
          type: 'time',
          mask: 'YYYY-MM',
          title: {
            text: '时间（年月）',
            style: {
              fontSize: 12
            }
          }
        },
        yAxis: {
          title: {
            text: '金额（元）',
            style: {
              fontSize: 12
            }
          },
          label: {
            // 数值格式化为千分位
            formatter: v => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, s => `${s},`)
          }
        },
        label: {
          // position: 'right',
          offsetY: -8,
          layout: [
            // 柱形图数据标签位置自动调整
            // { type: 'interval-adjust-position' },
            // 数据标签防遮挡
            { type: 'interval-hide-overlap' },
            // { type: 'limitInShape' },
            { type: 'overlap' }
            // 数据标签文颜色自动调整
            // { type: 'adjust-color' }
          ]
        },
        legend: {
          position: 'top'
        },
        point: {
          size: 5,
          shape: 'circle',
          style: {
            fill: 'white',
            stroke: '#348EE4',
            lineWidth: 1
          }
        },
        tooltip: {
          formatter: datum => {
            return { name: datum.kind, value: datum.money + '元' }
          },
          showMarkers: false,
          howCrosshairs: true,
          shared: true
        },
        state: {
          active: {
            style: {
              shadowBlur: 2,
              stroke: '#000',
              fill: '348EE4'
            }
          }
        },
        lineStyle: {
          lineWidth: 3
        },
        interactions: [{ type: 'marker-active' }]
      })
      this.chart.on('plot:click', ev => {
        if (ev.data != null && ev.data.data != null) {
          this.LineShowDatil(ev.data.data)
        }
      })
      this.chart.render()
    },
    LineShowDatil(rows) {
      const kindName = this.TypeName(rows)
      const titleName = this.TitleName(rows)
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          width: '80%',
          title: titleName,
          maskClosable: true
        },
        content: {
          template: kindName,
          props: {
            projectId: this.projectId,
            createTime: rows.createTime
          }
        }
      })
    },
    TypeName(rows) {
      if (rows.kind === '报销') {
        return ExpenseUse
      }
      if (rows.kind === '采购付款') {
        return PaymentUse
      }
      if (rows.kind === '人工成本') {
        return laborUse
      }
      if (rows.kind === '差旅成本') {
        return onbusUse
      }
    },
    TitleName(rows) {
      if (rows.kind === '报销') {
        return '报销详情'
      }
      if (rows.kind === '采购付款') {
        return '采购付款详情'
      }
      if (rows.kind === '人工成本') {
        return '人工成本详情'
      }
      if (rows.kind === '差旅成本') {
        return '差旅成本详情'
      }
    }
  }
}
</script>
