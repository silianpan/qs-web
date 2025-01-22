<!-- 项目详细 -->
<template>
  <div>
    <s-descriptions title="项目详情" :formItems="formItems" :formData="formData" />
    <s-descriptions title="变更前" :formItems="formItemsBefore" :formData="formDataBefore" />
    <s-descriptions title="变更后" :formItems="formItemsAfter" :formData="formDataAfter" />
  </div>
</template>

<script lang="jsx">
import { SDescriptions, Ellipsis } from '/src/components/index.js'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import moment from 'moment'

export default {
  name: 'ProjectModifyDetail',
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
          label: '项目编号',
          prop: 'code'
        },
        {
          label: '立项人',
          prop: 'sysUser.nickName'
        },
        {
          label: '项目名称',
          prop: 'name'
        },
        {
          label: '项目类型',
          prop: 'type',
          customRender: text => {
            return <a-tag color="blue">{text}</a-tag>
          }
        },
        {
          label: '所属部门',
          prop: 'deptName'
        },
        {
          label: '甲方',
          prop: 'ownerUnit'
        },
        {
          label: '项目状态',
          prop: 'status',
          customRender: text => {
            return <a-tag color="blue">{text}</a-tag>
          }
        },
        {
          label: '项目描述',
          prop: 'sketch'
        },
        {
          label: '变更日期',
          prop: 'changeTime',
          customRender: text => moment(text).format('YYYY-MM-DD')
        }
      ],
      formData: {},
      formItemsBefore: [],
      formDataBefore: {},
      formItemsAfter: [],
      formDataAfter: {}
    }
  },
  created() {
    this.formData = { ...this.row.orangeProject, changeReason: this.row.changeReason, sysUser: this.row.sysUser, changeTime: this.row.createTime }
    this.formItems.push({
      label: '变更原因',
      prop: 'changeReason'
    })
  },
  mounted() {
    const { tsealProject, fliedSealProject } = this.row
    this.formDataBefore = tsealProject
    this.formItemsBefore = this.formItems.filter(item => tsealProject[item.prop] !== null).filter(item => item.label !== '变更原因').filter(item => item.label !== '变更日期')

    this.formDataAfter = fliedSealProject
    this.formItemsAfter = this.formItems.filter(item => fliedSealProject[item.prop] !== null).filter(item => item.label !== '变更原因').filter(item => item.label !== '变更日期')
  }
}
</script>
