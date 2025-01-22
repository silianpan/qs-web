<!-- 收入合同漏斗图 -->
<!-- 收支合同-->
<template>
  <a-card class="card-container card-container-height" :bordered="false" :headStyle="{ border: 'none' }" :bodyStyle="{ padding: 0, overflow: 'hidden' }">
    <h1 slot="title" class="card-title">{{ title }}</h1>
    <div id="containerFunnelPlot"></div>
  </a-card>
</template>
<script>
import { Funnel } from '@antv/g2plot'
import { RevenueContractInvoicing } from '/src/api/dashboard/SalesExecutive.js'

export default {
  name: 'FunnelPlot',
  props: {
    title: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      chartObj: null,
      chartData: []
    }
  },
  mounted() {
    this.queryData()
    // this.initData(this.chartData)
  },
  methods: {
    queryData() {
      // 收入 api请求
      RevenueContractInvoicing().then(res => {
        res.data.forEach((item, index) => {
          item.number = Number(item.year)
          item.stage = item.name
        })
        this.chartData = res.data
        this.initData(this.chartData)
      })
    },
    initData(data) {
      this.chartObj = new Funnel('containerFunnelPlot', {
        data: data,
        xField: 'stage',
        yField: 'number',
        dynamicHeight: true,
        legend: false,
        conversionTag: false, //是否展示右边页面
        label: {
          formatter: datum => {
            // console.log(datum, 'eee')
            return `${datum.name}：${datum.year}元`
          }
        }
      })
      this.chartObj.render()
    }
  }
}
</script>

<style lang="less" scoped>
#containerFunnelPlot {
  padding-top: 15px;
  height: 228px;
  width: 100%;
  border-top: 1px solid #ebebeb;
}
.ant-card-head {
  border-bottom: 1px solid #ebebeb;
}
</style>
