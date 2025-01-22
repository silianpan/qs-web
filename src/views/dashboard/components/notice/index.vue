<!-- 重要通知 -->
<template>
  <a-card class="card-container card-container-height" :bordered="false" :headStyle="{ border: 'none' }" :bodyStyle="{ padding: 0, overflow: 'hidden' }">
    <h1 slot="title" class="card-title">重要通知</h1>
    <a slot="extra" @click="handleNoticeMore">更多</a>
    <List :bordered="false" :data-source="noticeData">
      <ListItem slot="renderItem" slot-scope="item">
        <span style="margin: 0 30px 0 30px">{{ item }}</span>
      </ListItem>
    </List>
  </a-card>
</template>

<script>
import 'ant-design-vue/es/list/style'
import List from 'ant-design-vue/es/list'
import ListItem from 'ant-design-vue/es/list/Item.js'
export default {
  components: {
    List,
    ListItem
  },
  data() {
    return {
      noticeData: ['QS商业版本1.0正式发布', '关于2022年度员工体检通知', '2022年清明节放假通知']
    }
  },
  methods: {
    handleNoticeMore() {}
  }
}
</script>
