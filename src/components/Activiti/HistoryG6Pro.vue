<template>
  <div>
    <div class="stepList">
      <div status="finish" v-for="(item, index) in historyList" :key="index" class="stepItem">
        <div class="left" v-if="index !== 0 && index !== historyList.length - 1">
          <icon-font slot="icon" type="iconfont-tuandui3" style="font-size: 20px" />
        </div>
        <a-badge :count="item.subTasks ? item.subTasks.length : 0">
          <div class="centerList">
            <a-popover v-if="item.subTasks">
              <template slot="content">
                <!-- 子任务 -->
                <div class="stepList">
                  <div status="finish" v-for="(subTk, subIndex) in item.subTasks" :key="subIndex" class="stepItem">
                    <div class="left">
                      <icon-font slot="icon" type="iconfont-tuandui3" style="font-size: 20px" />
                    </div>
                    <div class="centerList">
                      <a-tag class="s-mg-4" color="#519a73">{{ subTk.name }}</a-tag>
                      <template v-if="subTk.assigneeName">
                        <div class="s-mg-4" style="font-size: 14px; color: #f9906f">{{ `${subTk.assigneeName} ${timeFrom(new Date(subTk.endTime).getTime())}` }}</div>
                        <div class="s-mg-4 columnStyle" style="font-size: 16px; color: #9890e3">
                          <Ellipsis :length="20" tooltip>{{ subTk.comment }}</Ellipsis>
                        </div>
                      </template>
                    </div>
                    <div class="line-box" v-if="item.subTasks.length !== subIndex + 1">
                      <div class="line"></div>
                    </div>
                  </div>
                </div>
              </template>
              <a-tag class="s-mg-4" color="#7F7FD5">{{ item.name }}</a-tag>
            </a-popover>
            <a-tag v-else-if="index !== 0 && index !== historyList.length - 1" class="s-mg-4" :color="item.current ? '#f2660f' : item.pass ? '#519a73' : '#118aed'">{{ item.name }}</a-tag>
            <span v-else :class="index === 0 ? 'start-node' : index === historyList.length - 1 ? 'end-node' : ''" class="startOrEnd">
              {{ index === 0 ? '开始' : index === historyList.length - 1 ? '结束' : '' }}
            </span>
            <template v-if="item.assigneeName && index !== 0 && index !== historyList.length - 1">
              <div class="s-mg-4" style="font-size: 14px; color: #f9906f">{{ `${item.assigneeName} ${timeFrom(new Date(item.endTime).getTime())}` }}</div>
              <div class="s-mg-4 columnStyle" style="font-size: 16px; color: #9890e3">
                <Ellipsis :length="20" tooltip>{{ item.comment }}</Ellipsis>
              </div>
            </template>
          </div>
        </a-badge>
        <div class="line-box" v-if="historyList.length !== index + 1">
          <div class="line"></div>
        </div>
      </div>
    </div>
    <process-history v-if="isShowProcessPic && notProd" :instanceId="instanceId" />
    <div v-if="isShowCloseBtn" class="bottom-control">
      <a-space>
        <a-button @click="$emit('close')">关闭</a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import { listFlowElementsValid, listHistory } from '/src/api/activiti/process.js'
import { format, formatTotalDateSub } from './myUtil.js'
import { timeFrom } from '/src/utils/common/seal.js'
import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'
import ProcessHistory from './History.vue'

export default {
  components: {
    Ellipsis,
    ProcessHistory
  },
  props: {
    // 流程实例ID
    instanceId: {
      type: String,
      required: true
    },
    // 是否展示流程进度
    isShowProcessPic: {
      type: Boolean,
      default: true
    },
    // 是否展示底部关闭
    isShowCloseBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      notProd: import.meta.env.MODE !== 'production',
      historyList: [],
      // 查询参数
      queryParam: {
        pageNum: 1,
        pageSize: 999,
        processInstanceId: null,
        activityName: null,
        assignee: null
      }
    }
  },
  mounted() {
    this.handleViewHistoryList()
  },
  methods: {
    timeFrom,
    handleViewHistoryList() {
      // 审批历史
      this.queryParam.processInstanceId = this.instanceId
      this.getHistoryList()
    },
    async getHistoryList() {
      const resHistory = await listHistory(this.queryParam)
      let retFlows = []
      // 查找最后历史节点
      let lastHistoryActivityId = null
      let lastHistoryNode = null
      for (let i = 0; i < resHistory.rows.length; ++i) {
        const hi = resHistory.rows[i]
        lastHistoryNode = hi
        // 比较此节点是否和上一节点相同（id，审批人，审批意见），相同则跳过
        if (i >= 1 && i - 1 < resHistory.rows.length && hi.activityId === resHistory.rows[i - 1].activityId && hi.assignee === resHistory.rows[i - 1].assignee && hi.comment === resHistory.rows[i - 1].comment) {
          continue
        }
        retFlows.push({
          id: hi.activityId,
          type: 'node',
          name: hi.activityName,
          pass: true,
          startTime: format(hi.startTime, 'yyyy-MM-dd HH:mm:ss'),
          endTime: format(hi.endTime, 'yyyy-MM-dd HH:mm:ss'),
          durationInMillis: formatTotalDateSub(hi.durationInMillis / 1000),
          activityName: hi.activityName,
          assigneeName: hi.assigneeName,
          comment: hi.comment
        })
        // 如果遇到最后一个是调整申请，下面validFlowEles中无法找到调整申请，flagCur=-1
        // if (hi.activityId !== 'transferTask' && hi.activityName !== '调整申请') {
        //   lastHistoryActivityId = hi.activityId
        // }
        // 转办任务不是task任务，
        if (hi.activityType !== 'transferTask') {
          lastHistoryActivityId = hi.activityId
        }
      }
      if (lastHistoryNode.activityType !== 'endEvent') {
        const resFlowEleValid = await listFlowElementsValid(this.instanceId)
        const validFlowEles = resFlowEleValid.data
        let flagCur = -1
        for (let j = 0; j < validFlowEles.length; ++j) {
          const fev = validFlowEles[j]
          if (fev.id === lastHistoryActivityId) {
            flagCur = j
            break
          }
        }
        // for (let k = flagCur + 1; k < validFlowEles.length; ++k) {
        //   retFlows.push(validFlowEles[k])
        // }
        retFlows = [...retFlows, ...validFlowEles.slice(flagCur + 1)]
      }
      this.historyList = retFlows
    }
  }
}
</script>
<style lang="less" scoped>
.columnStyle {
  display: flex;
  flex-wrap: wrap;
}
.stepList {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.stepItem {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
  margin-right: 15px;
}
.left {
  margin-top: 4px;
}
.centerList {
  display: flex;
  flex-direction: column;
}
.line-box {
  padding-top: 13px;
  margin-right: 10x;
}
.line {
  width: 60px;
  height: 2px;
  background-color: rgb(28, 165, 228);
  position: relative;
  &::after {
    position: absolute;
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    top: -4px;
    right: -8px;
    border-top: 5px solid transparent;
    border-left: 8px solid rgb(28, 165, 228);
    border-bottom: 5px solid transparent;
  }
}
.startOrEnd {
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: relative;
  top: -6px;
  left: -4px;
  text-align: center;
  line-height: 36px;
  font-size: 10px;
  font-weight: bold;
}
.start-node {
  border: 3px solid green;
}
.end-node {
  border: 3px solid red;
}
</style>
