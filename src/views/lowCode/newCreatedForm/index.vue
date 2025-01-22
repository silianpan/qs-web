<template>
  <div class="empty-container">
    <div class="empty-content">
      <div class="title">
        <span class="left">创建以下对象，开始构建应用</span>
        <a class="right">了解表单和仪表盘</a>
      </div>
      <div class="template">
        <div class="t-item">
          <div class="entry-icon-flow">
            <div class="entry-create-icon flow"></div>
            <div class="entry-name">新建流程表单</div>
          </div>
          <div class="entry-description">适用于有特定流程，需要不同成员分步骤填写数据的业务。</div>
        </div>
        <div class="t-item" @click="createForm">
          <div class="entry-icon-coop">
            <div class="entry-create-icon coop"></div>
            <div class="entry-name">新建表单</div>
          </div>
          <div class="entry-description">适用于数据上报、问卷调研等业务。</div>
        </div>
        <div class="t-item">
          <div class="entry-icon-dash">
            <div class="entry-create-icon dash"></div>
            <div class="entry-name">新建仪表盘</div>
          </div>
          <div class="entry-description">可用来分析和展现流程表单、表单搜集到的数据。（建议在创建流程表单/表单后使用）</div>
        </div>
      </div>
      <div class="app-manage">后台管理</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    createForm() {
      this.$router.push('/saas/formDesign')
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
