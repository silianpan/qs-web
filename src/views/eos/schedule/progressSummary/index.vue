<!-- 进度汇总 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-radio-group v-model="radioValue" @change="onChange">
          <a-radio value="按项目">按项目</a-radio>
          <a-radio value="按人员">按人员</a-radio>
        </a-radio-group>

        <!-- 时间范围查询 -->
        <a-range-picker slot="left" :placeholder="['汇报开始日期', '汇报结束日期']" v-model="rangeData" @change="changeRangeData" style="margin-right: 10px" />

        <a-button v-if="radioValue === '按项目'" ghost type="primary" icon="vertical-align-bottom" @click="ProjectExport">导出汇总</a-button>
        <a-button v-else ghost type="primary" icon="vertical-align-bottom" @click="PeopleExport">导出汇总</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search v-if="(radioValue === '按项目' && !noDataProject) || (radioValue === '按人员' && !noDataPerson)" placeholder="搜索此列表..." clickTips="搜索汇报人" @onSearch="onSearch" />
      </div>
      <!-- 数据表格 按项目 -->
      <no-data v-if="(radioValue === '按项目' && noDataProject) || (radioValue === '按人员' && noDataPerson)" />
      <s-table ref="ProjectTable" size="default" rowKey="num" :columns="ProjectColumns" :data="ProjectLoadData" v-show="radioValue === '按项目' && !noDataProject">
        <span slot="action" slot-scope="text, record">
          <a-button type="link" @click="ProjectDetail(text, record)">
            <a-icon type="search" />
            详情
          </a-button>
        </span>
      </s-table>
      <!-- 数据表格 按人员 -->
      <s-table ref="PeopleTable" size="default" rowKey="num" :columns="PeopleColumns" :data="PeopleLoadData" v-show="radioValue === '按人员' && !noDataPerson">
        <span slot="action" slot-scope="text, record">
          <a-button type="link" @click="PeopleDetail(text, record)">
            <a-icon type="search" />
            详情
          </a-button>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import moment from 'moment'
import { SSearch, STable } from '/src/components/index.js'
import { getProjectList, getPeopleList, ExportFile } from '/src/api/eos/schedule/progressSummary.js'
import { ProjectScheduleList } from '/src/api/eos/schedule/process.js'
import detail from './detail.vue'

export default {
  components: {
    SSearch,
    STable
  },
  props: [],
  data() {
    return {
      /* 没有数据 */
      noDataProject: false,
      noDataPerson: false,
      /* 切换表格 */
      radioValue: '按项目',
      /* 查询参数 */
      queryParam: {},
      /* 范围日期查询 */
      rangeData: null,
      /* 按项目 */
      // 加载数据方法 必须为 Promise 对象
      ProjectLoadData: param => {
        return getProjectList(Object.assign({}, param, this.queryParam)).then(res => {
          this.noDataProject = res.total === 0
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
          align: 'center'
        },
        {
          title: '计划工作量(天/人)',
          dataIndex: 'planWork',
          align: 'center'
        },
        {
          title: '实际工作量(天/人)',
          dataIndex: 'realWork',
          align: 'center'
        },
        {
          title: '进度',
          dataIndex: 'ratio',
          align: 'center',
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
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      /* 按人员 */
      PeopleLoadData: param => {
        return getPeopleList(Object.assign({}, param, this.queryParam)).then(res => {
          this.noDataPerson = res.total === 0
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
          align: 'center'
        },
        {
          title: '汇报人',
          dataIndex: 'nickname',
          align: 'center'
        },
        {
          title: '实际工作量(天/人)',
          dataIndex: 'realWork',
          align: 'center'
        },
        {
          title: '进度',
          dataIndex: 'ratio',
          align: 'center',
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
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    /* 查询按钮 */
    clickquery(param) {
      this.queryParam = { ...this.queryParam, orderByColumn: param }
      this.refresh()
    },
    /* 查询按钮 */
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    },
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
    },
    /* 按项目导出 */
    ProjectExport() {
      this.$antdconfirm({
        title: '导出',
        content: '是否导出项目汇总结果?',
        onOk: () => {
          return ExportFile({ type: '项目' }).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /* 按人员导出 */
    PeopleExport() {
      this.$antdconfirm({
        title: '导出',
        content: '是否导出人员汇总结果?',
        onOk: () => {
          return ExportFile({ type: '人员' }).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /* 范围选择日期回调 */
    changeRangeData(dates) {
      this.queryParam.startDate = moment(dates[0]).format('YYYY-MM-DD')
      this.queryParam.endDate = moment(dates[1]).format('YYYY-MM-DD')
      this.onSearch()
    }
  },
  created() {}
}
</script>
<style lang="less" scoped></style>
