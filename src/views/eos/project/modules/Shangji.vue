<template>
  <div>
    <a-card v-if="row.businessId" :bordered="false" size="small">
      <a-collapse expand-icon-position="right" defaultActiveKey="商机信息">
        <a-collapse-panel key="商机信息" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">商机信息</span>
          <BusinessDetail :formId="row.businessId" />
        </a-collapse-panel>
      </a-collapse>
    </a-card>
    <no-data v-else />
  </div>
</template>

<script lang="jsx">
import BusinessDetail from '/src/views/eos/business/modules/BusinessDetail.vue'

export default {
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    BusinessDetail
  },
  data() {
    return {

    }
  },
  methods: {
  }
}
</script>
