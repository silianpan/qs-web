<template>
  <div class="content-wrapper">
    <div class="select-list">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane :key="item.key" :tab="item.title" v-for="item in tabList" />
      </a-tabs>
      <div class="select-content">
        <div class="content-list" v-show="current === item.key" v-for="item in tabList" :key="item.key">
          <a-checkbox-group :options="options" @change="onChange" :value="value" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAppList } from '/src/api/enterprise/index.js'

export default {
  props: {
    defaultValue: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tabList: [
        {
          title: '应用',
          key: '1'
        }
      ],
      current: '1',
      /* 多选框 */
      options: [],
      /* 选中 */
      value: []
    }
  },
  methods: {
    callback(key) {
      this.current = key
    },
    /* 多选回调 */
    onChange(v) {
      this.value = v
      this.$emit('checkCallback', this.value)
    }
  },
  created() {
    /* 默认选中 */
    if (this.defaultValue.length !== 0) {
      this.value = this.defaultValue
    }
  },
  mounted() {
    getAppList().then(res => {
      this.options = res.data.apps.map(({ appName, id }) => ({ label: appName, value: id }))
      this.$emit('checkCallback', this.value)
    })
  },
  watch: {}
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
