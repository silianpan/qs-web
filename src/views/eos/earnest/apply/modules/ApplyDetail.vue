<!-- 保证金申请详细 -->
<template>
  <s-descriptions :title="title" :formItems="formItems" :formData="row" />
</template>

<script lang="jsx">
import { SDescriptions } from '/src/components/index.js'
import { previewDoc } from '/src/components/Office/office.js'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  name: 'EarnestDetail',
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
      title: '保证金申请详情',
      formItems: [
        {
          label: '审批状态',
          prop: 'state',
          customRender: text => {
            return <AuditStatusTag state={text} />
          }
        },
        {
          label: '申请单号',
          prop: 'code'
        },
        {
          label: '申请人',
          prop: 'sysUser.nickName'
        },
        {
          label: '保证金类型',
          prop: 'depositType'
        },
        {
          label: '所属招投标',
          prop: 'sealBid.name'
        },
        {
          label: '保证金金额(元)',
          prop: 'depositMoney',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '预计退还时间',
          prop: 'returnTime'
        },
        {
          label: '附件',
          prop: 'attachment',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        },
        {
          label: '备注',
          prop: 'remark'
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
