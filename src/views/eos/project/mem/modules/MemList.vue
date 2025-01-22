<!-- 审批通过的项目成员列表 -->
<template>
  <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :showPagination="false" />
</template>

<script lang="jsx">
import { listMem } from '/src/api/eos/project/mem.js'
import { STable } from '/src/components/index.js'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  components: {
    STable
  },
  props: {
    // 项目ID
    projectId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listMem({
          projectId: this.projectId,
          applyId: this.applyId
        }).then(res => {
          return {
            data: res.data
          }
        })
      },
      columns: [
        {
          title: '审批状态',
          dataIndex: 'state',
          customRender: text => {
            return <AuditStatusTag state={text} />
          }
        },
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
