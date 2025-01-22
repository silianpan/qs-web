<template>
  <div>
    <a-radio-group v-model="radioValue" @change="onChange" style="margin-bottom: 20px">
      <a-radio value="按项目">按项目</a-radio>
      <a-radio value="按人员">按人员</a-radio>
    </a-radio-group>
    <!-- 数据表格 按项目 -->
    <s-table ref="ProjectTable" size="default" rowKey="num" :columns="ProjectColumns" :data="ProjectLoadData" v-if="radioValue === '按项目'">
      <span slot="action" slot-scope="text, record">
        <a-button type="link" @click="ProjectDetail(text, record)">
          <a-icon type="search" />
          详情
        </a-button>
      </span>
    </s-table>
    <!-- 数据表格 按人员 -->
    <s-table ref="PeopleTable" size="default" rowKey="num" :columns="PeopleColumns" :data="PeopleLoadData" v-else>
      <span slot="action" slot-scope="text, record">
        <a-button type="link" @click="PeopleDetail(text, record)">
          <a-icon type="search" />
          详情
        </a-button>
      </span>
    </s-table>
  </div>
</template>

<script lang="jsx">
import moment from 'moment'
import { STable } from '/src/components/index.js'
import { getProjectList, getPeopleList } from '/src/api/eos/schedule/progressSummary.js'
import { ProjectScheduleList } from '/src/api/eos/schedule/process.js'
import detail from './detail.vue'

export default {
  components: {
    STable
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      /* 切换表格 */
      radioValue: '按项目',
      /* 查询参数 */
      queryParam: {},
      /* 查询列表 */
      queryList: [],
      /* 范围日期查询 */
      rangeData: null,
      /* 按项目 */
      // 加载数据方法 必须为 Promise 对象
      ProjectLoadData: param => {
        return getProjectList(Object.assign({}, param, this.queryParam)).then(res => {
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      ProjectColumns: [
        {
          title: '项目',
          dataIndex: 'projectName',
          align: 'left'
        },
        {
          title: '计划工作量(天/人)',
          dataIndex: 'planWork',
          align: 'left'
        },
        {
          title: '实际工作量(天/人)',
          dataIndex: 'realWork',
          align: 'left'
        },
        {
          title: '进度',
          dataIndex: 'ratio',
          align: 'left',
          customRender: (text, record) => {
            if (!this.isEmpty(text)) {
              return <a-progress width={80} type="circle" percent={text} status="active" stroke-color={{ '0%': '#108ee9', '100%': '#87d068' }} />
              //   return <a-progress percent={text} />
            }
          }
        },
        {
          title: '操作',
          width: 200,
          align: 'left',
          scopedSlots: { customRender: 'action' }
        }
      ],
      /* 按人员 */
      PeopleLoadData: param => {
        return getPeopleList(Object.assign({}, param, this.queryParam)).then(res => {
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      PeopleColumns: [
        {
          title: '项目',
          dataIndex: 'projectName',
          align: 'left'
        },
        {
          title: '汇报人',
          dataIndex: 'nickname',
          align: 'left'
        },
        {
          title: '实际工作量(天/人)',
          dataIndex: 'realWork',
          align: 'left'
        },
        {
          title: '进度',
          dataIndex: 'ratio',
          align: 'left',
          customRender: (text, record) => {
            if (!this.isEmpty(text)) {
              return <a-progress width={80} type="circle" percent={text} status="active" stroke-color={{ '0%': '#108ee9', '100%': '#87d068' }} />
              //   return <a-progress percent={text} />
            }
          }
        },
        {
          title: '操作',
          width: 200,
          align: 'left',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    // 刷新页面
    refresh() {
      if (this.radioValue === '按项目') {
        this.$nextTick(() => {
          this.$refs.ProjectTable.refresh()
        })
      } else {
        this.$nextTick(() => {
          this.$refs.PeopleTable.refresh()
        })
      }
    },
    /* 切换表格重新请求 */
    onChange(e) {
      this.refresh()
    },
    /* 按项目详情 */
    ProjectDetail(text, record) {
      ProjectScheduleList({ projectId: record.projectId }).then(res => {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '项目进度汇总详情',
            width: '80%',
            maskClosable: true
          },
          content: {
            template: detail,
            props: {
              row: res.data
            }
          }
        })
      })
    },
    /* 按人员详情 */
    PeopleDetail(text, record) {
      ProjectScheduleList({ projectId: record.projectId, processUser: record.createBy }).then(res => {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '项目进度汇总详情',
            width: '80%',
            maskClosable: true
          },
          content: {
            template: detail,
            props: {
              row: res.data
            }
          }
        })
      })
    }
  },
  created() {
    if (!this.isEmpty(this.row.region)) {
      this.queryParam.region = this.row.region
      /* 日期查询参数 */
      if (!this.isEmpty(this.row.startTime) && !this.isEmpty(this.row.endTime)) {
        this.queryParam.startTime = moment(this.row.startTime).startOf('month').format('YYYY-MM-DD HH:mm:ss')
        this.queryParam.endTime = moment(this.row.endTime).endOf('month').format('YYYY-MM-DD HH:mm:ss')
      }
    } else {
      this.queryParam.isAll = true
      /* 日期查询参数 */
      if (!this.isEmpty(this.row.startTime) && !this.isEmpty(this.row.endTime)) {
        this.queryParam.startTime = moment(this.row.startTime).startOf('month').format('YYYY-MM-DD HH:mm:ss')
        this.queryParam.endTime = moment(this.row.endTime).endOf('month').format('YYYY-MM-DD HH:mm:ss')
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
