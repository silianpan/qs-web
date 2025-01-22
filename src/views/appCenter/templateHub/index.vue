<template>
  <div class="container template-hub">
    <a-tabs default-active-key="1" @change="changeTab">
      <a-tab-pane key="1" tab="快速上手">
        <FastElement :changeSearch="changeSearch" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="精选推荐"> <Selected :changeSearch="changeSearch" /> </a-tab-pane>
      <a-tab-pane key="3" tab="用途">
        <a-tabs default-active-key="人力行政" @change="changeUsemask">
          <a-tab-pane key="人力行政" tab="人力行政" />
          <a-tab-pane key="财务报销" tab="财务报销" />
          <a-tab-pane key="办公协作" tab="办公协作" />
          <a-tab-pane key="进销存" tab="进销存" />
          <a-tab-pane key="门店管理" tab="门店管理" />
          <a-tab-pane key="客户关系" tab="客户关系" />
          <a-tab-pane key="销售" tab="销售" />
          <a-tab-pane key="项目任务" tab="项目任务" />
          <a-tab-pane key="生产管理" tab="生产管理" />
          <a-tab-pane key="资产设备" tab="资产设备" />
        </a-tabs>
        <Usemask :changeSearch="changeSearch" />
      </a-tab-pane>
      <a-tab-pane key="4" tab="行业">
        <a-tabs default-active-key="IT互联网" @change="changeIndustry">
          <a-tab-pane key="IT互联网" tab="IT互联网" />
          <a-tab-pane key="制造业" tab="制造业" />
          <a-tab-pane key="贸易零售" tab="贸易零售" />
          <a-tab-pane key="服务业" tab="服务业" />
          <a-tab-pane key="教育培训" tab="教育培训" />
          <a-tab-pane key="建筑房产" tab="建筑房产" />
          <a-tab-pane key="金融" tab="金融" />
          <a-tab-pane key="医疗医药" tab="医疗医药" />
          <a-tab-pane key="政府单位" tab="政府单位" />
          <a-tab-pane key="物流运输" tab="物流运输" />
          <a-tab-pane key="商业服务" tab="商业服务" />
        </a-tabs>
        <Industry :changeSearch="changeSearch" />
      </a-tab-pane>
      <a-tab-pane key="5" tab="功能">
        <a-tabs default-active-key="产品更新" @change="changeFunctions">
          <a-tab-pane key="产品更新" tab="产品更新" />
          <a-tab-pane key="表单" tab="表单" />
          <a-tab-pane key="流程" tab="流程" />
          <a-tab-pane key="仪表盘" tab="仪表盘" />
          <a-tab-pane key="聚合物" tab="聚合物" />
          <a-tab-pane key="自定义打印" tab="自定义打印" />
          <a-tab-pane key="智能助手" tab="智能助手" />
          <a-tab-pane key="数据工厂" tab="数据工厂" />
        </a-tabs>
        <Functions :changeSearch="changeSearch" />
      </a-tab-pane>
      <a-input-search slot="tabBarExtraContent" placeholder="输入名称来搜索" @search="search" v-model="inputvalue" />
    </a-tabs>
  </div>
</template>

<script>
import FastElement from '../components/fastElement/index.vue'
import Selected from '../components/selected/index.vue'
import Usemask from '../components/usemask/index.vue'
import Industry from '../components/industry/index.vue'
import Functions from '../components/functions/index.vue'

export default {
  data() {
    return {
      val: '',
      inputvalue: ''
    }
  },
  methods: {
    changeUsemask(key) {
      this.$bus.$emit('changeUsemask', key)
    },
    changeIndustry(key) {
      this.$bus.$emit('changeIndustry', key)
    },
    changeFunctions(key) {
      this.$bus.$emit('changeFunctions', key)
    },
    /* 搜索 */
    search(val) {
      this.val = val
    },
    changeTab() {
      this.val = ''
      this.inputvalue = ''
    }
  },
  computed: {
    changeSearch() {
      return this.val
    }
  },
  components: { FastElement, Selected, Usemask, Industry, Functions }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
