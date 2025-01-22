/* 快速上手 */
<template>
  <div class="saas-home-container">
    <ul class="content">
      <li class="item" v-for="item in appMassage" :key="item.appId" @click="openDrawer(item.appName, true)">
        <div class="list-warpper">
          <div class="app-icon" :style="{ background: `linear-gradient(${'#d69ef8'}, ${'#8b49ba'})` }">
            <img :src="item.icon ? item.icon : ''" alt="icon" />
          </div>
        </div>
        <div class="list-content">
          <div class="content-name">
            <span>官方</span><span>{{ item.appName ? item.appName : '' }}</span>
          </div>
          <div class="content-publisher">开发作者：{{ item.createBy ? item.createBy : '' }}</div>
          <div class="content-description">{{ item.remark ? item.remark : '' }}</div>
        </div>
      </li>
    </ul>
    <DrawerWrapper :visible="visible" @onclose="onclose" :title="title" />
  </div>
</template>

<script>
import { getAppSystemList } from '/src/api/enterprise/index.js'
import DrawerWrapper from '../drawerWrapper/index.vue'

export default {
  props: {
    changeSearch: {
      type: String,
      default: ''
    }
  },
  components: { DrawerWrapper },
  data() {
    return {
      params: {
        appName: '',
        appType: ''
      },
      appMassage: [],
      visible: false,
      title: ''
    }
  },
  methods: {
    openDrawer(...arg) {
      this.title = arg[0]
      this.visible = arg[1]
    },
    onclose(v) {
      this.visible = v
    }
  },
  watch: {
    async changeSearch(val) {
      this.params.appName = val
      const { rows } = await getAppSystemList(this.params)
      this.appMassage = rows
    }
  },
  async created() {
    const { rows } = await getAppSystemList(this.params)
    this.appMassage = rows
  }
}
</script>

<style lang="less" scoped>
@import '/src/assets/style/lowCode.less';
</style>
