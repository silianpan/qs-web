/* 通讯录 */
<template>
  <a-layout class="container">
    <a-layout-header class="header">
      <Header />
    </a-layout-header>
    <a-layout-content class="content">
      <ContactsOp />
    </a-layout-content>
  </a-layout>
</template>

<script>
import Header from '../components/header/index.vue'
import ContactsOp from './contactsOp.vue'

export default {
  name: 'Contacts',
  components: {
    Header,
    ContactsOp
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
.role-line,
.dept-line {
  width: 60px;
  display: flex;
  justify-content: space-between;
  i {
    line-height: 27px;
  }
}
</style>
