<!-- 项目成员列表，包括审批未通过的 -->
<template>
  <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :showPagination="false" />
</template>

<script lang="jsx">
import { listMemAll } from '/src/api/eos/project/mem.js'
import { STable } from '/src/components/index.js'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  name: 'ProjectMemDetail',
  components: {
    STable
  },
  props: {
    // 项目ID
    projectId: {
      type: Number,
      required: true
    },
    // 申请单ID
    applyId: {
      type: Number,
      default: null
    },
    // 待办详情查看
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listMemAll({
          projectId: this.projectId || this.row.projectId,
          applyId: this.applyId || this.row.id
        }).then(res => {
          return {
            data: res.data
          }
        })
      },
      columns: [
        {
          title: '角色',
          dataIndex: 'role',
          align: 'center'
        },
        {
          title: '姓名',
          dataIndex: 'sysUser.nickName',
          align: 'center'
        },
        {
          title: '电话',
          dataIndex: 'sysUser.phonenumber',
          align: 'center'
        },
        {
          title: '邮箱',
          dataIndex: 'sysUser.email',
          align: 'center'
        }
      ]
    }
  },
  watch: {
    projectId() {
      this.$refs.table.refresh(true)
    }
  }
}
</script>
