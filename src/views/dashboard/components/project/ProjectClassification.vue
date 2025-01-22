<!-- 横向条形图  -->
<template>
  <div>
    <a-card class="project-classify" :bordered="false" :headStyle="{ fontSize: '20px', fontWeight: 'bold', textAlign: 'left' }">
      <h1 slot="title" class="card-title">{{ title }}</h1>
      <div id="barContainer"></div>
    </a-card>
  </div>
</template>

<script>
import { Bar } from '@antv/g2plot'

export default {
  name: 'ProjectClassification',
  props: {
    title: {
      type: String,
      default: '条形图'
    },
  },
  data() {
    return {
      bar: null
    }
  },
  mounted() {
  },
  methods: {
    initData(data){
      this.bar = new Bar('barContainer', {
        data,
        xField: 'num',
        yField: 'name',
        seriesField: 'name',
        padding: [0, 130, 0, 65],
        legend: {
          // offsetX: 10,
          position: 'right-bottom'
        },
        yAxis:{
          label:{
            formatter: (v) => {
              if(v.length>4){     //y轴文本换行
                return `${v.slice(0,4)}...`
              }else{
                return v
              }
            },
          },
        },
      })
      this.bar.render()
    }
  },
}
</script>

<style lang="less">
.project-classify{
  .ant-card-head{
    border: none;
  }
}
</style>
