<!-- 用户单选 -->
<template>
  <div>
    <a-row :gutter="24">
      <a-col :span="7">
        <!-- 部门树 -->
        <dept-tree defaultExpandAll ref="deptTree" :deptOptions="deptOptions" @select="clickDeptNode" />
      </a-col>
      <a-col :span="17">
        <!-- 条件搜索 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-item label="姓名">
                  <a-input v-model="queryUserParam.nickName" placeholder="请输入" allow-clear @keyup.enter.native="handleQuery" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="手机号">
                  <a-input v-model="queryUserParam.phonenumber" placeholder="请输入" allow-clear @keyup.enter.native="handleQuery" />
                </a-form-item>
              </a-col>
              <a-col :md="(!advanced && 8) || 24" :sm="24">
                <span class="table-page-search-submitButtons" :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}">
                  <a-button type="primary" @click="handleQuery"> <a-icon type="search" />查询 </a-button>
                  <!-- <a-button style="margin-left: 8px" @click="resetQuery"> <a-icon type="redo" />重置 </a-button> -->
                  <!-- <a @click="toggleAdvanced" style="margin-left: 8px">
                    {{ advanced ? '收起' : '展开' }}
                    <a-icon :type="advanced ? 'up' : 'down'" />
                  </a> -->
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <!-- 刷新 -->
        <div class="table-operations">
          <a-button type="dashed" shape="circle" :loading="userLoading" :style="{ float: 'right' }" icon="reload" @click="getUserList" />
        </div>
        <!-- 表格 -->
        <a-table rowKey="userId" :loading="userLoading" :data-source="userList" :columns="columnsUser" :row-selection="rowSelection" :pagination="false">
          <!-- <span slot="createTime" slot-scope="text, record">
        {{ parseTime(record.createTime) }}
      </span> -->
        </a-table>
        <a-pagination
          v-show="userTotal > 0"
          class="ant-table-pagination"
          show-size-changer
          show-quick-jumper
          :current="queryUserParam.pageNum"
          :total="userTotal"
          :page-size="queryUserParam.pageSize"
          :showTotal="total => `共 ${total} 条`"
          :pageSizeOptions="['10', '20', '50', '100']"
          @showSizeChange="onShowUserSizeChange"
          @change="changeUserSize"
        />
      </a-col>
    </a-row>
    <!-- 底部操作 -->
    <div class="bottom-control">
      <a-space>
        <a-button type="primary" @click="submitForm">确 定</a-button>
        <a-button @click="$emit('close')">关闭</a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import request from '/src/utils/axios/request.js'
import { queryAll } from '/src/api/system/user.js'
import { allTree } from '/src/api/system/dept.js'
import DeptTree from '/src/views/system/user/modules/DeptTree.vue'

export default {
  components: {
    DeptTree
  },
  props: {
    taskId: {
      type: String,
      required: true
    },
    businessType: {
      type: String,
      required: true
    },
    dataId: {
      type: Number,
      required: true
    }
  },
  computed: {
    rowSelection() {
      return {
        type: 'radio',
        onChange: this.onSelectChange
      }
    }
  },
  data() {
    return {
      // 部门树选项
      deptOptions: [
        {
          id: 0,
          label: '',
          children: []
        }
      ],
      advanced: false,
      // 选中行
      selectedRow: null,
      // 查询参数
      queryUserParam: {
        status: '0',
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        deptId: undefined
      },
      userLoading: false,
      userTotal: 0,
      userList: [],
      columnsUser: [
        // {
        //   title: '用户编号',
        //   dataIndex: 'userId',
        //   align: 'center'
        // },
        // {
        //   title: '用户名称',
        //   dataIndex: 'userName',
        //   align: 'center'
        // },
        {
          title: '姓名',
          dataIndex: 'nickName'
        },
        // {
        //   title: '部门',
        //   dataIndex: 'dept.deptName',
        //   align: 'center'
        // },
        {
          title: '手机号',
          dataIndex: 'phonenumber'
        }
        // {
        //   title: 'Email',
        //   dataIndex: 'email',
        //   align: 'center'
        // }
        // {
        //   title: '创建时间',
        //   dataIndex: 'createTime',
        //   scopedSlots: { customRender: 'createTime' },
        //   align: 'center'
        // }
      ]
    }
  },
  mounted() {
    this.getUserList()
    this.getTreeselect()
  },
  methods: {
    // 单选框选中数据
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRow = selectedRows[0]
    },
    /** 查询用户列表 */
    getUserList() {
      this.userLoading = true
      queryAll(this.queryUserParam).then(response => {
        this.userList = response.rows
        this.userTotal = response.total
        this.userLoading = false
      })
    },
    onShowUserSizeChange(current, pageSize) {
      this.queryUserParam.pageSize = pageSize
      this.getUserList()
    },
    changeUserSize(current, pageSize) {
      this.queryUserParam.pageNum = current
      this.queryUserParam.pageSize = pageSize
      this.getUserList()
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    clickDeptNode(deptId) {
      this.queryUserParam.deptId = deptId
      this.getUserList()
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      allTree().then(response => {
        this.deptOptions = response.data
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryUserParam.pageNum = 1
      this.getUserList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.queryUserParam = {
        status: '0',
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        deptId: undefined
      }
      this.handleQuery()
    },
    /** 提交按钮 */
    submitForm() {
      const taskId = this.taskId
      const selectedRow = this.selectedRow
      if (!selectedRow) {
        this.$message.error('请先选择要转办的用户')
        return
      }
      if (selectedRow.userName === this.$store.getters.userName) {
        this.$message.error('不能转办给自己')
        return
      }
      this.$antdconfirm({
        title: '转办',
        content: '是否确认转办给' + selectedRow.nickName + '?',
        onOk: () => {
          return request({
            url: '/project/activity/delegate',
            method: 'post',
            data: { taskId: taskId, delegateToUser: selectedRow.userName, dataId: this.dataId, type: this.businessType }
          }).then(response => {
            this.$emit('getList')
            this.$emit('close')
            this.$message.success('操作成功', 3)
          })
        }
      })
    }
  }
}
</script>
