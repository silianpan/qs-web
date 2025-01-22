<!-- 销售主管 -->
<template>
  <div class="wrp">
    <!-- 头部展示  -->
    <HeadTitle :headShowStyle="{ width: '310px', height: '140px', display: 'flex', alignItems: 'center' }" :dataList="titleTop" />
    <div class="todoStyle">
      <Todo />
    </div>
    <div class="itemStyle">
      <div style="width: 33%; height: 300px">
        <!-- 商机跟进饼图  -->
        <BusinessOpportunities title="商机统计" />
      </div>
      <div style="width: 33%; height: 300px">
        <ProjectStatusPieChart title="项目状态统计" />
      </div>
      <div style="width: 33%; height: 300px">
        <FunnelPlot title="收入合同汇总" />
      </div>
    </div>
    <!-- 项目收款进度表 -->
    <div class="schedule">
      <ProjectPaymentTab title="项目收款汇总" :data="loadData" :columns="columnsList" :handleDetail="handleDetail" />
    </div>
  </div>
</template>

<script>
// import HeadShow from '../components/salesExecutiveModule/HeadShow.vue'
import Todo from '../components/todo/index.vue'
import BusinessOpportunities from '/src/views/dashboard/components/salesExecutiveModule/BusinessOpportunities.vue'
import ProjectStatusPieChart from '../components/salesExecutiveModule/ProjectStatusPieChart.vue'
import FunnelPlot from '../components/salesExecutiveModule/FunnelPlot.vue'
// import ProjectTab from '../components/salesExecutiveModule/ProjectTab.vue'
import ProjectPaymentTab from '../components/salesExecutiveModule/ProjectPaymentTab.vue'
import { infoRmation, projectPayment } from '/src/api/dashboard/SalesExecutive.js'
import HeadTitle from '/src/views/dashboard/components/salesExecutiveModule/HeadTitle.vue'
import { getProject } from '/src/api/eos/project/project.js'
import detailAll from '/src/views/eos/project/detailAll.vue'
export default {
  name: 'SalesExecutive',
  components: {
    // HeadShow,
    HeadTitle,
    Todo,
    BusinessOpportunities,
    ProjectStatusPieChart,
    FunnelPlot,
    ProjectPaymentTab
    // ProjectTab
  },
  props: {},
  data() {
    return {
      titleTop: [],

      // 传入数据
      loadData: param => {
        return projectPayment(Object.assign({}, param, this.queryParam, { projectId: this.projectId })).then(res => {
          this.noData = res.total === 0
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      // // 传入的数据
      // dataList: [
      //   // {
      //   //   key: '1',
      //   //   name: '渠县项目',
      //   //   money: '主任务',
      //   //   address: '业务收款',
      //   //   startTime: '2020-06-05',
      //   //   Time: '2020-16-50',
      //   //   DidNotReceive: '181200'
      //   // },
      // ],
      // 配置项
      columnsList: [
        {
          title: '项目名称',
          align: 'left',
          dataIndex: 'projectName'
        },

        {
          title: '收入合同总金额',
          align: 'left',
          dataIndex: 'incontactTotal',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '开票金额',
          align: 'left',
          dataIndex: 'invoicesum',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '收款金额',
          align: 'left',
          dataIndex: 'inTotal',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '开票收款金额',
          align: 'left',
          dataIndex: 'unInTotal',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    infoRmation().then(res => {
      // console.log(res, '请求头信息')
      // this.titleTop = res.data
      res.data.forEach(item => {
        const splitMoney = String(item.money).split('.')
        item.money = this.formateMoney(Number(splitMoney[0]))
        item.decimalMoney = '.' + splitMoney[1] || '00'
      })

      this.titleTop = res.data
    })
    // 项目收款记录表
    // projectPayment().then(res => {
    //   // console.log('项目收款记录', res)
    //   res.rows.forEach(item => {
    //     this.dataList.push({
    //       key: item.projectId,
    //       name: item.projectName,
    //       money: item.inContactTotal,
    //       address: item.invoiceSum,
    //       startTime: item.inTotal,
    //       Time: item.unInTotal
    //       // DidNotReceive: item.unInTotal
    //     })
    //   })
    // })
  },
  methods: {
    /** 详情 */
    handleDetail(row) {
      return getProject(row).then(res => {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '项目详情',
            width: '80%',
            maskClosable: true
          },
          content: {
            template: detailAll,
            props: {
              row: res.data
            }
          }
        })
      })
    },
    formateMoney(value) {
      if (Number(value)) {
        value = Number(value).toFixed(2)
        const intPart = Math.trunc(value) // 获取整数部分
        const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
        return intPartFormat
      } else {
        return 0
      }
    }
  }
}
</script>

<style scoped lang="less">
.wrp {
  width: 100%;
  overflow: hidden;
}
.todoStyle {
  width: 100%;
  margin-top: 15px;
}
.itemStyle {
  margin-top: 15px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
// 进度表
.schedule {
  width: 100%;
  // height: 200px;
  margin-top: 15px;
  margin-bottom: 30px;
  background: #ffffff;
}
</style>
