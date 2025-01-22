<template>
  <global-footer class="footer custom-render" :links="[]">
    <!-- <template v-slot:links>
      <a href="#" target="_blank">帮助</a>
      <a href="#" target="_blank">隐私</a>
      <a href="#" target="_blank">条款</a>
    </template> -->
    <template v-slot:copyright> Copyright &copy; 2022 <a href="#" target="_blank">QS</a> </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '/src/components/layouts/ProLayout/index.js'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>

<style>
.ant-pro-global-footer {
  margin: 0 !important;
}
.ant-layout-footer {
  padding: 6px 0 !important;
  background: white;
}
</style>
