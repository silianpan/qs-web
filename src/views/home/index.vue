<template>
  <div>
    <!--  高管  -->
    <Work v-if="permissions.indexOf('eos:gzt:gg') > -1" />
    <!--  项目主管  -->
    <PM v-else-if="permissions.indexOf('eos:gzt:xmzg') > -1" />
    <!--  财务主管  -->
    <Treasurer v-else-if="permissions.indexOf('eos:gzt:cwzg') > -1" />
    <!-- 销售主管 -->
    <SalesExecutive v-else-if="permissions.indexOf('eos:gzt:xszg') > -1" />
    <!-- 雇员 -->
    <Employee v-else />
  </div>
</template>
<script>
  import PM from '/src/views/dashboard/pages/PM.vue'
  import Treasurer from '/src/views/dashboard/pages/Treasurer.vue'
  import Work from '/src/views/dashboard/pages/Work.vue'
  import SalesExecutive from '/src/views/dashboard/pages/SalesExecutive.vue'
  import Employee from '/src/views/dashboard/pages/Employee.vue'
  import { mapGetters } from 'vuex'

  export default {
    name: 'DashboardIndex',
    components: {
      Work,
      SalesExecutive,
      Employee,
      Treasurer,
      PM
    },
    computed: {
      ...mapGetters(['permissions'])
    }
  }
</script>

<style lang="less">
  @import './index.less';
</style>
