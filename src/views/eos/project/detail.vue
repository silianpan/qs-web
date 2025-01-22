<!-- 项目详细 -->
<template>
  <div>
    <s-descriptions :title="title" :formItems="formItems" :formData="row">
      <a slot="extra" style="color: #348ee4" href="javascript:;" @click.stop="exportPorject(row)">导出立项申请单</a>
    </s-descriptions>
  </div>
</template>

<script lang="jsx">
import SDescriptions from '/src/components/Descriptions/index.jsx'
import { previewDoc } from '/src/components/Office/office.js'
import { exportProjectApply } from '/src/api/eos/project/project.js'
import defaultSettings from '/src/config/defaultSettings.js'

export default {
  name: 'ProjectDetail',
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
      title: '项目详情',
      formItems: [
        {
          label: '项目名称',
          prop: 'name'
        },
        // {
        //   label: '所属商机',
        //   prop: 'businessId'
        // },
        {
          label: '所属部门',
          prop: 'sysDept.deptName'
        },
        {
          label: '项目编号',
          prop: 'code'
        },
        {
          label: '立项人',
          prop: 'sysUser.nickName'
        },
        {
          label: '项目类型',
          prop: 'type',
          customRender: text => {
            return <a-tag color="blue">{text}</a-tag>
          }
        },
        {
          label: '甲方',
          prop: 'ownerUnit'
        },
        // {
        //   label: '是否预算管控',
        //   prop: 'hasBudget',
        //   customRender: text => {
        //     return text ? text : '未做预算'
        //   }
        // },

        {
          label: '项目描述',
          prop: 'sketch'
        },
        {
          label: '项目状态',
          prop: 'status'
        },
        {
          label: '附件',
          prop: 'attachment',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        }
      ]
    }
  },
  methods: {
    handlePreviewDoc(doc) {
      previewDoc(doc.name, doc.url)
    },
    exportPorject(row) {
      exportProjectApply(row.id, defaultSettings.companyDoc)
        .then(rsp => {
          this.download(rsp.msg)
        })
        .catch(err => {
          this.methods.error(err.msg)
        })
    }
  }
}
</script>
