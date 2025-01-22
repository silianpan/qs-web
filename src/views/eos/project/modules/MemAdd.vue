<!-- 项目成员添加，这里用于审批，不能用于其他业务 -->
<template>
  <div>
    <a-button class="s-mb-8" type="primary" ghost icon="a-icon-plus" @click="handleAdd" v-hasPermi="['project:mem:add']">添加项目成员</a-button>
    <s-table ref="table" size="default" rowKey="userId" :columns="columns" :data="loadData" :showPagination="false" />
    <a-divider>添加批注</a-divider>
    <view-verify ref="verify" :busFlow="busFlow" />
    <div class="bottom-control">
      <a-space>
        <a-button type="primary" @click="handleSubmit">确 定</a-button>
        <a-button @click="handleCancel">关 闭</a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import ViewVerify from '/src/components/Activiti/ViewVerify/index.vue'
import { STable } from '/src/components/index.js'
import { addMem } from '/src/api/eos/project/mem.js'
import MemSelect from '/src/views/eos/project/mem/modules/MemSelect.vue'

export default {
  name: 'MemAdd',
  components: {
    STable,
    ViewVerify
  },
  props: {
    busFlow: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      selectedUsers: [],
      columns: [
        {
          title: '姓名',
          dataIndex: 'nickName',
          align: 'center'
        },
        {
          title: '部门',
          dataIndex: 'deptName',
          align: 'center'
        },
        {
          title: '电话',
          dataIndex: 'phonenumber',
          align: 'center'
        },
        {
          title: '角色',
          dataIndex: 'role',
          align: 'center'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return new Promise(resolve => resolve(param)).then(param => {
          return {
            data: this.selectedUsers,
            totalCount: this.selectedUsers.length
          }
        })
      }
    }
  },
  methods: {
    onOk() {
      return new Promise(resolve => {
        resolve(true)
      })
    },
    onCancel() {
      return new Promise(resolve => {
        resolve(true)
      })
    },
    handleCancel() {
      this.$emit('close')
    },
    handleAdd() {
      if (this.isEmpty(this.busFlow.formId)) {
        this.$message.error('请先选择项目！')
        return
      }
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '选择项目成员',
          width: '50%',
          maskClosable: true
        },
        content: {
          template: MemSelect,
          props: {
            selectType: 'checkbox'
          },
          on: {
            ok: selectedRows => {
              if (!this.isEmpty(selectedRows)) {
                this.selectedUsers = selectedRows.map(({ userId, userName, nickName, deptName, phonenumber }) => ({ userId, userName, nickName, deptName, phonenumber }))
                this.$refs.table.refresh(true)
              }
            }
          }
        }
      })
    },
    handleSubmit() {
      const comment = this.$refs.verify.comment
      if (this.isEmpty(comment)) {
        return this.$message.error('请填写批注')
      }
      const sealProjectMemList = []
      this.$refs.table.localDataSource.forEach(item => {
        const mem = {}
        mem.projectId = this.busFlow.formId
        mem.role = '普通成员'
        // 默认审批通过
        mem.state = '0'
        mem.userId = item.userId
        sealProjectMemList.push(mem)
      })
      const fd = {
        busForm: { sealProjectMemList },
        taskId: this.busFlow.taskId,
        instanceId: this.busFlow.instanceId,
        variables: JSON.stringify({
          comment,
          pass: this.$refs.verify.pass,
          formData: this.busFlow
        })
      }
      // 注意：addMem只能用于审批
      addMem(fd).then(res => {
        this.$message.success(res.msg)
        this.$emit('ok')
        this.$emit('close')
      })
    }
  }
}
</script>
