<!-- 待办事项页面 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <Todo />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import Todo from './todo'
export default {
  name: 'TodoIndex',
  components: {
    Todo
  }
}
</script>
