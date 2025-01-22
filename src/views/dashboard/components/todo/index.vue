<template>
  <div>
    <a-card
      class="card-container dashboard-todo"
      :bordered="false"
      :headStyle="{ border: 'none' }"
      :bodyStyle="{ padding: '10px 0', overflow: 'hidden' }"
      :tab-list="tabListNoTitle"
      :active-tab-key="noTitleKey"
      @tabChange="key => onTabChange(key, 'noTitleKey')"
    >
      <h1 slot="title" class="my-todo-title">我的待办</h1>
      <div v-if="noTitleKey === 'todo'">
        <todo ref="todo" :search="false" :reload="false" simple />
      </div>
      <div v-else-if="noTitleKey === 'done'">
        <done ref="done" :search="false" :reload="false" simple />
      </div>
      <div v-else-if="noTitleKey === 'myProcess'">
        <process-started simple ref="processStart" />
      </div>
      <div v-else-if="noTitleKey === 'myCopy'">
        <copy simple ref="copy" />
      </div>
      <a-icon slot="tabBarExtraContent" type="reload" @click="handleTabTodoRefresh" />
      <a class="s-ml-10" slot="tabBarExtraContent" @click="handleTabTodoMore">更多</a>
    </a-card>
  </div>
</template>

<script>
import Todo from '/src/views/eos/todoItem/todo/todo.vue'
import Done from '/src/views/eos/todoItem/done/done.vue'
import ProcessStarted from '/src/views/eos/todoItem/todo/processStarted.vue'
import Copy from '/src/views/eos/todoItem/copy/copy.vue'

export default {
  components: {
    Todo,
    Done,
    ProcessStarted,
    Copy
  },
  data() {
    return {
      tabListNoTitle: [
        {
          key: 'todo',
          tab: '待办'
        },
        {
          key: 'done',
          tab: '已办'
        },
        {
          key: 'myProcess',
          tab: '我的发起'
        },
        {
          key: 'myCopy',
          tab: '抄送我的'
        }
      ],
      noTitleKey: 'todo'
    }
  },
  methods: {
    onTabChange(key, type) {
      this[type] = key
    },
    handleTabTodoRefresh() {
      if (this.noTitleKey === 'todo') {
        this.$refs.todo.refresh()
      }
      if (this.noTitleKey === 'done') {
        this.$refs.done.$refs.table.refresh(true)
      }
      if (this.noTitleKey === 'myProcess') {
        this.$refs.processStart.$refs.table.refresh(true)
      }
      if (this.noTitleKey === 'myCopy') {
        this.$refs.copy.$refs.table.refresh(true)
      }
    },
    handleTabTodoMore() {
      if (this.noTitleKey === 'todo') {
        this.$router.push('/todoItem/todo')
      }
      if (this.noTitleKey === 'done') {
        this.$router.push('/todoItem/done')
      }
      if (this.noTitleKey === 'myProcess') {
        this.$router.push('/todoItem/my-process-start')
      }
      if (this.noTitleKey === 'myCopy') {
        this.$router.push('/todoItem/copy')
      }
    }
  }
}
</script>

<style lang="less">
.dashboard-todo {
  height: 304px !important;
  .ant-tabs-bar {
    border: none;
    margin-left: 10px;
  }
  .ant-tabs-nav .ant-tabs-tab {
    margin-right: 40px;
  }
}
.ant-tabs-bar {
  margin-bottom: 0;
}
.ant-tabs .ant-tabs-large-bar .ant-tabs-tab {
  padding: 3px;
}
.my-todo-title {
  padding: 0 18px;
  margin-bottom: 11px;
  font-size: 18px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333333;
}
.my-todo-title:before {
  content: '';
  position: absolute;
  left: 20px;
  top: 20px;
  width: 8px;
  height: 20px;
  background: #348ee4;
  border-radius: 4px;
}
.ant-card-head-title {
  padding-top: 17px;
  padding-bottom: 8px;
}
.ant-card-head .ant-tabs {
  margin-bottom: 0;
}
.ant-card-head {
  padding: 0 20px;
}
.ant-tabs.ant-tabs-large .ant-tabs-extra-content {
  line-height: 14px;
}
.ant-tabs-nav-container {
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #666;
}
</style>
