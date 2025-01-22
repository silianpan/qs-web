<!-- 主体收支明细 -->
<template>
  <div class="tab-container">
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" tab="合同">
        <SubjectContract :company="this.company" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="项目">
        <SubjectProject :queryUint="this.company" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import SubjectContract from './subjectContract'
import SubjectProject from './subjectProject'

export default {
  props: {
    company: {
      type: String,
      require: true,
      default: ''
    }
  },
  components: {
    SubjectContract,
    SubjectProject
  }
}
</script>

<style>
.tab-container {
  background: #fff;
  margin-top: 0%;
}
</style>
