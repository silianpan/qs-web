<template>
  <div>
    <a-row>
      <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <project-in-out-come :projectId="this.projectId" />
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <project-in-come :projectId="this.projectId" />
      </a-col>
    </a-row>
    <a-row>
      <a-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <line-inout :projectId="this.projectId" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import LineInout from '/src/views/dashboard/components/finance/LineInout.vue'
// import BarInout from './bar-inout.vue'
import ProjectInOutCome from './modules/ProjectInOutCome.vue'
import ProjectInCome from './modules/ProjectInCome.vue'

export default {
  name: 'AnalysisProject',
  props: {
    projectId: {
      type: Number,
      default: null
    }
  },
  components: {
    LineInout,
    ProjectInOutCome,
    ProjectInCome
  }
}
</script>
