<!-- 库房管理详细 -->
<template>
  <s-descriptions title="基本信息" :formItems="formItems" :formData="row" />
</template>

<script>
import { SDescriptions } from '/src/components/index.js'
import { previewDoc } from '/src/components/Office/office.js'

export default {
  name: 'WarehouseDetail',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    SDescriptions
  },
  data() {
    return {
      formItems: [
        {
          label: '库房编号',
          prop: 'code'
        },
        {
          label: '库房名称',
          prop: 'name'
        },
        {
          label: '库房地址',
          prop: 'address'
        }
      ]
    }
  },
  methods: {
    handlePreviewDoc(doc) {
      previewDoc(doc.name, doc.url)
    }
  }
}
</script>
