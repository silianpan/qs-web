<template>
  <div>
    <!--审批历史表格-->
    <div>
      <div class="table-operations">
        <a-button type="dashed" shape="circle" :loading="loading" :style="{ float: 'right' }" icon="reload" @click="getHistoryList" />
      </div>
      <a-table rowKey="id" :loading="loading" :data-source="historyList" :columns="columnsHistory">
        <!-- <a-table-column v-if="false" label="活动ID" align="center" prop="activityId" width="60" /> -->
      </a-table>
    </div>
    <!-- 进度图片 -->
    <img @error="handleImgError" :src="src" />
    <div class="bottom-control">
      <a-space>
        <a-button @click="$emit('close')">关闭</a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import request from '/src/utils/axios/request.js'
import { format, formatTotalDateSub } from './myUtil.js'

export default {
  props: {
    // 流程实例ID
    instanceId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      src: '',
      historyList: [],
      loading: false,
      // 查询参数
      queryParam: {
        pageNum: 1,
        pageSize: 999,
        processInstanceId: null,
        activityName: null,
        assignee: null
      },
      columnsHistory: [
        {
          title: '活动名称',
          dataIndex: 'activityName',
          align: 'center'
        },
        {
          title: '办理人ID',
          dataIndex: 'assignee',
          align: 'center'
        },
        {
          title: '办理人',
          dataIndex: 'assigneeName',
          align: 'center'
        },
        {
          title: '审批意见',
          dataIndex: 'comment',
          align: 'center'
        },
        {
          title: '开始时间',
          dataIndex: 'startTime',
          // scopedSlots: { customRender: 'createTime' },
          align: 'center'
        },
        {
          title: '结束时间',
          dataIndex: 'endTime',
          // scopedSlots: { customRender: 'createTime' },
          align: 'center'
        },
        {
          title: '耗时',
          dataIndex: 'durationInMillis',
          align: 'center'
        }
      ]
    }
  },
  mounted() {
    this.handleViewHistoryList()
  },
  methods: {
    handleViewHistoryList() {
      // 进度图片
      const baseURL = import.meta.env.VITE_APP_BASE_API
      this.src = baseURL + '/activiti/process/read-resource?pProcessInstanceId=' + this.instanceId + '&_=' + new Date().getTime()
      // 审批历史
      this.queryParam.processInstanceId = this.instanceId
      this.getHistoryList()
    },
    getHistoryList() {
      this.loading = true
      return request({
        url: '/activiti/process/listHistory',
        method: 'post',
        data: this.queryParam
      }).then(response => {
        this.historyList = response.rows
        this.historyList.forEach(row => {
          row.startTime = format(row.startTime, 'yyyy-MM-dd HH:mm:ss')
          row.endTime = format(row.endTime, 'yyyy-MM-dd HH:mm:ss')
          row.durationInMillis = formatTotalDateSub(row.durationInMillis / 1000)
        })
        this.loading = false
      })
    },
    // 图片加载失败处理
    handleImgError() {}
  }
}
</script>
