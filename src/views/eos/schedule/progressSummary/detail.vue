<!-- 进度及执行情况 -->
<template>
  <a-card :bordered="false">
    <s-table ref="table" size="default" rowKey="num" :columns="columns" :data="loadData" :showPagination="false">
      <!-- <span slot="action" slot-scope="text, record">
          <a-button type="link" @click="PeopleDetail(text, record)">详情</a-button>
        </span> -->
    </s-table>
  </a-card>
</template>

<script lang="jsx">
import { STable } from '/src/components/index.js'
import { getRegionList } from '/src/api/eos/schedule/progressSummary.js'
import { ProjectScheduleList } from '/src/api/eos/schedule/process.js'
import { uuidv4 } from '/src/utils/common/util.js'

export default {
  name: 'ProgressSummaryDetail',
  props: {
    row: {
      type: Array,
      default: null
    },
    // 项目ID
    projectId: {
      type: Number,
      default: null
    },
    /* 地区 */
    region: {
      type: String,
      default: null
    }
  },
  components: {
    STable
  },
  data() {
    return {
      momentString: uuidv4(),
      /* 查询参数 */
      queryParam: {},
      /* 查询列表 */
      queryList: [],
      detailData: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return new Promise((resolve, reject) => {
          resolve({
            data: this.detailData || []
          })
        })
      },
      columns: [
        {
          title: '#',
          dataIndex: 'level'
        },
        {
          title: '阶段',
          dataIndex: 'name'
        },
        {
          title: '描述',
          dataIndex: 'note'
        },
        {
          title: '计划开始日期',
          dataIndex: 'beginDate'
        },
        {
          title: '计划结束日期',
          dataIndex: 'endDate'
        },
        {
          title: '预估工作量(人/天)',
          dataIndex: 'workload'
        },
        {
          title: '实际工作量(天/人)',
          dataIndex: 'realNum'
        },
        {
          title: '进度',
          dataIndex: 'rate',
          customRender: (text, record) => {
            if (!this.isEmpty(text)) {
              return <a-progress width={80} type="circle" percent={text} status="active" stroke-color={{ '0%': '#108ee9', '100%': '#87d068' }} />
              //   return <a-progress percent={text} />
            }
          }
        }
      ]
    }
  },
  methods: {
    // 刷新页面
    refresh() {
      this.$refs.table.refresh()
    }
  },
  mounted() {
    if (!this.isEmpty(this.row)) {
      this.detailData = [...this.row]
      this.$nextTick(() => {
        this.refresh()
      })
    }
    if (!this.isEmpty(this.projectId)) {
      ProjectScheduleList({ projectId: this.projectId }).then(res => {
        this.detailData = [...res.data]
        this.$nextTick(() => {
          this.refresh()
        })
      })
    }
    if (!this.isEmpty(this.region)) {
      getRegionList({ regionName: this.region }).then(res => {
        this.detailData = [...res.data]
        this.$nextTick(() => {
          this.refresh()
        })
      })
    }
  }
}
</script>
