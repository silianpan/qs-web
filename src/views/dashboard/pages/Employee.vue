<!-- 雇员页面  -->
<template>
  <!-- 头部展示区域 -->
  <div>
    <EmployeeTitle :dataList="titleTop" />
    <!-- 流程中心 -->
    <div class="todo">
      <Todo />
    </div>
    <!-- 柱状图表区域 -->
    <div class="itemStyle">
      <div style="width: 49%; height: 320px">
        <!-- 参与项目类型 -->
        <ProjectTypeChar title="参与项目类型统计" />
      </div>
      <div style="width: 49%; height: 320px">
        <!-- 参与项目状态分析-->
        <ProjectStatusPieChart title="参与项目状态统计" />
      </div>
    </div>
    <!-- 项目收款进度表 -->
    <div class="schedule">
      <ProjectPaymentTab title="参与项目进度" :data="loadData" :columns="columnsList" :handleDetail="handleDetail" />
      <div style="height: 25px"></div>
    </div>
  </div>
</template>

<script>
import EmployeeTitle from '/src/views/dashboard/components/employee/EmployeeTitle.vue'
import Todo from '../components/todo/index.vue'
import ProjectPaymentTab from '../components/salesExecutiveModule/ProjectPaymentTab.vue'
import { employeesTitle, ProjectProgressOfEmployee } from '/src/api/dashboard/Employee.js'
import ProjectTypeChar from '/src/views/dashboard/components/employee/ProjectTypeChar.vue'
// import ProjectStatus from '/src/views/dashboard/components/employee/ProjectStatus.vue'
import ProjectStatusPieChart from '/src/views/dashboard/components/salesExecutiveModule/ProjectStatusPieChart.vue'
import { getProject } from '/src/api/eos/project/project.js'
import detailAll from '/src/views/eos/project/detailAll.vue'
export default {
  name: 'Employee',
  components: {
    EmployeeTitle,
    Todo,
    ProjectPaymentTab,
    ProjectTypeChar,
    // ProjectStatus,
    ProjectStatusPieChart
  },
  props: {},
  data() {
    return {
      titleTop: [],
      // 传入的数据
      dataList: [],
      // 配置项

      // 传入数据
      loadData: param => {
        return ProjectProgressOfEmployee(Object.assign({}, param, this.queryParam, { projectId: this.projectId })).then(res => {
          this.noData = res.total === 0
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      columnsList: [
        {
          title: '项目名称',
          align: 'left',
          dataIndex: 'projectName'
        },
        {
          title: '任务名称',
          align: 'center',
          dataIndex: 'inContactTotal,'
        },
        {
          title: '计划工作量',
          align: 'center',
          dataIndex: 'invoicesum'
        },
        {
          title: '填报工作量',
          align: 'center',
          dataIndex: 'inTotal'
        },
        {
          title: '填报时间',
          align: 'center',
          dataIndex: 'unInTotal'
        },
        {
          title: '任务进度',
          align: 'center',
          dataIndex: 'payment'
        }
        // {
        //   title: '项目名称',
        //   dataIndex: 'name',
        //   scopedSlots: { customRender: 'name' }
        // },
        // {
        //   title: '主任务',
        //   className: 'column-money',
        //   dataIndex: 'money'
        // },
        // {
        //   title: '子任务',
        //   dataIndex: 'address'
        // },
        // {
        //   title: '开始时间',
        //   dataIndex: 'startTime',
        //   scopedSlots: { customRender: 'startTime' }
        // },
        // {
        //   title: '结束时间',
        //   dataIndex: 'Time',
        //   scopedSlots: { customRender: 'Time' }
        // }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getProjectProgressOfEmployee()
    employeesTitle().then(res => {
      // this.titleTop = res.data
      res.data.forEach(item => {
        const splitMoney = String(item.money).split('.')
        item.money = this.formateMoney(Number(splitMoney[0]))
        item.decimalMoney = '.' + (splitMoney[1] == undefined ? '00' : splitMoney[1])
      })
      this.titleTop = res.data
    })
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

    // 数据处理
    formateMoney(value) {
      if (Number(value)) {
        value = Number(value).toFixed(2)
        const intPart = Math.trunc(value) // 获取整数部分
        const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
        return intPartFormat
      } else {
        return 0
      }
    },
    // 获取员工项目进度数据
    getProjectProgressOfEmployee() {
      ProjectProgressOfEmployee().then(res => {
        res.rows.forEach(item => {
          this.dataList = res.rows
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.todo {
  margin-top: 30px;
}
.itemStyle {
  margin-top: 30px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.schedule {
  width: 100%;
  height: 200px;
  margin-top: 15px;
  margin-bottom: 30px;
  background: #ffffff;
}
</style>
