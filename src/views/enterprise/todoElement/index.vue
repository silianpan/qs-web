<template>
  <a-layout class="todo-element">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible :collapsedWidth="0" width="270">
      <div class="toggleCollapsed" :class="collapsed ? 'isCollapsed' : ''" @click="toggleCollapsed">
        <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
      </div>
      <a-menu class="member-all" :selectedKeys="selectedKeys" mode="inline" theme="light" :inline-collapsed="collapsed" @click="hanlderMenu">
        <a-menu-item class="app-menu" :key="item.id" v-for="item in entryList">
          <div class="MenuStyle">
            <img :src="initIcon(item.id)" class="menuIcon" />
            <span> {{ item.name }}</span>
          </div>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content>
        <TodoDetaile :currentId="selectedKeys[0]"></TodoDetaile>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import TodoDetaile from '../todoDetaile/index.vue'

const req = import.meta.globEager('/src/assets/img/lowCode/todo/*.png')
const iconList = Object.keys(req).map((t, idx) => ({ src: req[t].default, id: idx }))

export default {
  name: 'TodoElement',
  components: { TodoDetaile },
  data() {
    return {
      selectedKeys: [0],
      collapsed: false,
      entryList: [
        {
          id: 0,
          name: '我的待办'
        },
        {
          id: 1,
          name: '我发起的'
        },
        {
          id: 2,
          name: '我处理的'
        },
        {
          id: 3,
          name: '抄送我的'
        },
        {
          id: 4,
          name: '发起新流程'
        }
      ],
      iconList
    }
  },
  methods: {
    /* 菜单回调 */
    hanlderMenu(item) {
      this.selectedKeys = item.keyPath ? item.keyPath : item
    },
    toggleCollapsed() {
      this.collapsed = !this.collapsed
    },
    initIcon(icon) {
      const i = this.iconList.find(t => t.id === icon)
      return i.src
    }
  },
  created() {
    this.selectedKeys[0] = this.$route.params.id * 1
  },
  mounted() {},
  watch: {}
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
