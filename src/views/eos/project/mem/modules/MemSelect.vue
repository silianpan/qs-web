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
                  <a-input v-model="queryParam.nickName" placeholder="请输入" allow-clear @keyup.enter.native="handleQuery" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="手机号">
                  <a-input v-model="queryParam.phonenumber" placeholder="请输入" allow-clear @keyup.enter.native="handleQuery" />
                </a-form-item>
              </a-col>
              <a-col :md="(!advanced && 8) || 24" :sm="24">
                <span class="table-page-search-submitButtons" :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}">
                  <a-button type="primary" @click="handleQuery"> <a-icon type="search" />查询 </a-button>
                  <!-- <a-button style="margin-left: 8px" @click="resetQuery"> <a-icon type="redo" />重置 </a-button>
                  <a @click="toggleAdvanced" style="margin-left: 8px">
                    {{ advanced ? '收起' : '展开' }}
                    <a-icon :type="advanced ? 'up' : 'down'" />
                  </a> -->
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <!-- 操作 -->
        <div class="table-operations">
          <a-button type="dashed" shape="circle" :loading="loading" :style="{ float: 'right' }" icon="reload" @click="getList" />
        </div>
        <!-- 数据展示 -->
        <a-table
          :loading="loading"
          :size="tableSize"
          :rowKey="rowKey"
          :columns="columns"
          :data-source="list"
          :row-selection="{ type: selectType, selectedRowKeys: selectedRowKeys, onChange: onSelectChange, columnTitle: ' ' }"
          :pagination="true"
        >
        </a-table>
        <!-- 分页 -->
        <!-- <a-pagination
          class="ant-table-pagination"
          :pageSizeOptions="['10', '20', '50', '100']"
          show-size-changer
          show-quick-jumper
          :current="queryParam.pageNum"
          :total="total"
          :page-size="queryParam.pageSize"
          :showTotal="total => `共 ${total} 条`"
          @showSizeChange="onShowSizeChange"
          @change="changeSize"
        /> -->
      </a-col>
    </a-row>
    <!-- 确定取消 -->
    <div class="bottom-control">
      <a-space>
        <a-button type="primary" @click="handleOk">确定</a-button>
        <a-button @click="handleCancel">取 消</a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import { queryAll, listUser } from '/src/api/system/user.js'
import { allTree } from '/src/api/system/dept.js'
import DeptTree from '/src/views/system/user/modules/DeptTree.vue'

export default {
  name: 'MemSelect',
  components: {
    DeptTree
  },
  props: {
    selectType: {
      type: String,
      default: 'checkbox'
    },
    rowKey: {
      type: String,
      default: 'userId'
    }
  },
  data() {
    return {
      list: [],
      selectedRowKeys: [],
      selectedRows: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      ids: [],
      loading: false,
      total: 0,
      // 状态数据字典
      statusOptions: [],
      sexOptions: [],
      // 部门树选项
      deptOptions: [
        {
          id: 0,
          label: '',
          children: []
        }
      ],
      // 日期范围
      dateRange: [],
      queryParam: {
        status: '0',
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        deptId: undefined
      },
      columns: [
        // {
        //   title: '用户编号',
        //   dataIndex: 'userId',
        //   align: 'center'
        // },
        // {
        //   title: '用户名',
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
        //   scopedSlots: { customRender: 'dept.deptName' },
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
      ]
    }
  },
  created() {
    this.getList()
    this.getTreeselect()
    this.getDicts('sys_normal_disable').then(response => {
      this.statusOptions = response.data
    })
    this.getDicts('sys_user_sex').then(response => {
      this.sexOptions = response.data
    })
  },
  methods: {
    /** 查询定时任务列表 */
    getList() {
      this.loading = true
      queryAll(this.addDateRange(this.queryParam, this.dateRange)).then(response => {
        this.list = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      allTree().then(response => {
        this.deptOptions = response.data
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParam.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.queryParam = {
        status: '0',
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        deptId: undefined
      }
      this.handleQuery()
    },
    onShowSizeChange(current, pageSize) {
      this.queryParam.pageSize = pageSize
      this.getList()
    },
    changeSize(current, pageSize) {
      this.queryParam.pageNum = current
      this.queryParam.pageSize = pageSize
      this.getList()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.ids = this.selectedRows.map(item => item.userId)
      this.single = selectedRowKeys.length !== 1
      this.multiple = !selectedRowKeys.length
      this.$emit('rows', selectedRowKeys, selectedRows)
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    clickDeptNode(deptId) {
      this.queryParam.deptId = deptId
      this.getList()
    },
    handleOk() {
      if (this.isEmpty(this.selectedRows)) {
        return this.$message.warning('请至少选择一个成员')
      }
      this.$emit('ok', this.selectedRows, this.selectedRowKeys)
      this.$emit('close')
    },
    handleCancel() {
      this.$emit('cancel')
      this.$emit('close')
    }
  }
}
</script>
