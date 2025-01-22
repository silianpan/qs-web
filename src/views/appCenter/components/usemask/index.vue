/* 用途 */
<template>
  <div class="saas-home-container">
    <ul class="content">
      <li class="item" v-for="item in appMassage" :key="item.appId">
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
  </div>
</template>

<script>
import { getAppSystemList } from '/src/api/enterprise/index.js'

export default {
  props: {
    changeSearch: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      params: {
        appName: '',
        appType: '人力行政'
      },
      appMassage: [],
      changeKey: ''
    }
  },
  methods: {},
  watch: {
    async changeKey(key) {
      this.params.appType = key
      const { rows } = await getAppSystemList(this.params)
      this.appMassage = rows
    },
    async changeSearch(val) {
      this.params.appName = val
      const { rows } = await getAppSystemList(this.params)
      this.appMassage = rows
    }
  },
  async created() {
    this.$bus.$on('changeUsemask', key => {
      this.changeKey = key
    })
    const { rows } = await getAppSystemList(this.params)
    this.appMassage = rows
  }
}
</script>

<style lang="less" scoped>
@import '/src/assets/style/lowCode.less';
</style>
