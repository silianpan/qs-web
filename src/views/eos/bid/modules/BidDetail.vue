<!-- 招投标管理详细 -->
<template>
  <div>
    <s-descriptions title="基本信息" :formItems="formItems" :formData="row" />
    <a-card v-if="row.businessId" :bordered="false" size="small">
      <a-collapse expand-icon-position="right" defaultActiveKey="商机信息">
        <a-collapse-panel key="商机信息" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">商机信息</span>
          <BusinessDetail :formId="row.businessId" />
        </a-collapse-panel>
      </a-collapse>
    </a-card>
  </div>
</template>

<script lang="jsx">
import moment from 'moment'
import { SDescriptions } from '/src/components/index.js'
import { previewDoc } from '/src/components/Office/office.js'
import BusinessDetail from '/src/views/eos/business/modules/BusinessDetail.vue'

export default {
  name: 'BidDetail',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    SDescriptions,
    BusinessDetail
  },
  data() {
    return {
      formItemsBusiness: [
        {
          label: '标（包）名称',
          prop: 'name'
        }
      ],
      formItems: [
        {
          label: '标（包）名称',
          prop: 'name'
        },
        {
          label: '标（包）编号',
          prop: 'code'
        },
        {
          label: '描述',
          prop: 'description'
        },
        {
          label: '开标日期',
          prop: 'openDate',
          customRender: text => (text ? moment(text).format('YYYY-MM-DD') : text)
        },
        {
          label: '代理机构',
          prop: 'agency'
        },
        {
          label: '附件',
          prop: 'attachment',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        },
        {
          label: '创建人',
          prop: 'user.nickName'
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
