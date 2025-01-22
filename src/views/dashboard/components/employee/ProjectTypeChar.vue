<template>
  <a-card class="card-container card-container-height" :bordered="false" :headStyle="{ border: 'none' }" :bodyStyle="{ padding: 0, overflow: 'hidden' }">
    <h1 slot="title" class="card-title">{{ title }}</h1>
    <div id="ProjectTypeChar"></div>
  </a-card>
</template>

<script>
import { Bar } from '@antv/g2plot'
import { projectChart } from '/src/api/dashboard/Employee.js'
export default {
  name: 'ProjectTypeChar',
  components: {},
  props: {
    title: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      data: [
        {
          name: '暂无数据',
          num: 38
        },
        {
          name: '暂无数据',
          num: 38
        },
        {
          name: '暂无数据',
          num: 38
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    projectChart().then(res => {
      // console.log('项目类型', res)
      this.data = res.data
      this.initData(this.data)
    })
  },
  methods: {
    initData(data) {
      const barPlot = new Bar('ProjectTypeChar', {
        data,
        xField: 'num',
        yField: 'name',
        seriesField: 'name',
        // color: ({ type }) => {
        //   return type === '美容洗护' ? '#FAAD14' : '#5B8FF9'
        // },
        legend: false,
        meta: {
          type: {
            alias: '类别'
          },
          sales: {
            alias: '销售额'
          }
        }
      })
      barPlot.render()
    }
  }
}
</script>

<style lang="less" scoped>
#ProjectTypeChar {
  height: 220px;
  width: 90%;
  margin: 10px auto;
  // border-top: 1px solid #ebebeb;
}
.card-container {
  .ant-card-head {
    border-bottom: 1px solid #ebebeb;
  }
  ::v-deep .ant-card-head-title {
    border-bottom: 1px solid #ebebeb;
  }
  ::v-deep .ant-card-body {
    border-top: 1px solid #ebebeb;
  }
}
</style>
