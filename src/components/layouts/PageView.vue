<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <router-view />
  </page-header-wrapper>
</template>

<script>

export default {
  name: 'PageView'
}
</script>
