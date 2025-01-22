<!-- 分配菜单权限 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <div class="tab-container">
      <a-tabs default-active-key="1" class="menu-in-component">
        <a-tab-pane key="1" tab="角色">
          <RolePerms />
        </a-tab-pane>
        <a-tab-pane key="2" tab="部门">
          <DeptPerms />
        </a-tab-pane>
        <a-tab-pane key="3" tab="成员">
          <UserPerms />
        </a-tab-pane>
      </a-tabs>
    </div>
  </page-header-wrapper>
</template>

<script>
import RolePerms from './modules/rolePerms.vue'
import UserPerms from './modules/userPerms.vue'
import DeptPerms from './modules/deptPerms.vue'

export default {
  components: {
    RolePerms,
    UserPerms,
    DeptPerms
  }
}
</script>

<style lang="less">
.tab-container {
  background: #fff;
  margin-top: 0%;
}

</style>
