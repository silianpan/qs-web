<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <div class="todo-container">
      <div class="todoDetaile" v-if="currentId !== 4">
        <div class="container-header">{{ menuFind[currentId] }}</div>
        <a-spin :spinning="spinning">
          <a-list class="demo-loadmore-list" item-layout="horizontal" :data-source="listData" :split="false">
            <a-list-item slot="renderItem" slot-scope="item" @click="handlerItem(item)">
              <a-list-item-meta>
                <a slot="title" href="javascript:;">{{ item.assigneeName || item.applyUserName }}</a>
                <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              </a-list-item-meta>
              <div class="projectState">
                <div class="projectTitle">{{ item.basicSetting.flowName }}</div>
                <div class="state" v-if="menuFind[currentId] !== '抄送我的'">
                  <a-tag @click.stop="viewProcess(item)" style="cursor: pointer" :color="item.data.status === 0 ? 'green' : item.data.status === 1 ? 'blue' : 'orange'" v-if="item">
                    {{ item.data.status === 0 ? '通过' : item.data.status === 1 ? '流程中' : '手动结束' }}
                  </a-tag>
                </div>
                <div class="copy" v-if="menuFind[currentId] === '抄送我的'">
                  <span>{{ item.assigneeNickName }} 已审批</span>
                </div>
              </div>
              <div class="projectType" v-if="item">
                <div class="peojectTypeItem" v-show="index < 5 ? true : false" v-for="(fitem, index) in item.fields" :key="fitem.formId">{{ fitem.label }} ：{{ item.data[fitem['vModel']] }}</div>
              </div>
              <div class="date">流程创建时间：{{ item.createTime }}</div>
              <div class="btn" v-if="menuFind[currentId] === '我的待办'">
                <a-button type="link" @click.stop="activitiProcess(item)">同意</a-button>
              </div>
            </a-list-item>
          </a-list>
        </a-spin>
      </div>
      <div class="newProcess" v-else>发起新的流程</div>
    </div>
    <!-- 分页 -->
    <a-pagination
      class="ant-table-pagination"
      show-size-changer
      show-quick-jumper
      :current="queryParams.pageNum"
      :total="total"
      :page-size="queryParams.pageSize"
      :showTotal="total => `共 ${total} 条`"
      @showSizeChange="onShowSizeChange"
      @change="changeSize"
    />
  </page-header-wrapper>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { getTaskList, getMongoWorkflowList, getTaskDoneList, getTaskCopyList, activitiProcess } from '/src/api/processDesign/index.js'
import { handleProcessHistory } from '/src/views/eos/config/busUtil.js'
import detaile from './detaile.vue'

export default {
  props: {
    currentId: {
      type: [Number, String],
      default: 0,
      require: true
    }
  },
  compoments: { detaile },
  data() {
    return {
      menuFind: {
        0: '我的待办',
        1: '我发起的',
        2: '我处理的',
        3: '抄送我的',
        4: '发起新的流程'
      },
      listData: [],
      total: 0,
      queryParams: {
        orderByColumn: 'create_time',
        isAsc: 'desc',
        pageNum: 1,
        pageSize: 5
      },
      spinning: true
    }
  },
  methods: {
    onShowSizeChange(current, pageSize) {
      this.queryParams.pageSize = pageSize
      this.changePage(this.currentId)
    },
    changeSize(current, pageSize) {
      this.queryParams.pageNum = current
      this.queryParams.pageSize = pageSize
      this.changePage(this.currentId)
    },
    changePage(id) {
      this.spinning = true
      switch (id) {
        case 0:
          this.initTaskList()
          break
        case 1:
          this.initMongoWorkflowList()
          break
        case 2:
          this.initTaskDoneLis()
          break
        case 3:
          this.initTaskCopyLis()
          break
        default:
          console.log('新流程')
          break
      }
    },
    /* 详情 */
    handlerItem(item) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '表单详情',
          width: '50%',
          maskClosable: true
        },
        content: {
          template: detaile,
          props: {
            row: item
          }
        }
      })
    },
    /* 流程 */
    viewProcess(item) {
      handleProcessHistory(item.instanceId)
    },
    /* 同意代办 */
    activitiProcess(item) {
      const params = {
        taskId: item.taskId,
        instanceId: item.instanceId,
        variables: {
          comment: '我同意',
          pass: 'true',
          formData: { ...item.formData, taskId: item.taskId, taskName: item.taskName, type: item.type }
        }
      }
      activitiProcess(params).then(res => {
        if (res.code === 200) {
          this.initTaskList()
          return this.$message.success('处理成功')
        }
      })
    },
    /* 查询待办列表 */
    initTaskList() {
      getTaskList(this.queryParams).then(res => {
        const tmpData = res.rows
        this.listData = [...tmpData]
        this.spinning = false
        this.total = res.total
      })
    },
    /* 查询我发起的 */
    initMongoWorkflowList() {
      getMongoWorkflowList(this.queryParams).then(res => {
        const tmpData = res.rows
        this.listData = [...tmpData]
        this.spinning = false
        this.total = res.total
      })
    },
    /* 查询我处理的 */
    initTaskDoneLis() {
      getTaskDoneList(this.queryParams).then(res => {
        const tmpData = res.rows
        this.listData = [...tmpData]
        this.spinning = false
        this.total = res.total
      })
    },
    /* 查询我处理的 */
    initTaskCopyLis() {
      getTaskCopyList(this.queryParams).then(res => {
        const tmpData = res.rows
        this.listData = [...tmpData]
        this.spinning = false
        this.total = res.total
      })
    }
  },
  created() {
    this.changePage(this.currentId)
  },
  watch: {
    currentId(id) {
      this.spinning = true
      switch (id) {
        case 0:
          this.initTaskList()
          break
        case 1:
          this.initMongoWorkflowList()
          break
        case 2:
          this.initTaskDoneLis()
          break
        case 3:
          this.initTaskCopyLis()
          break
        default:
          console.log('新流程')
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
