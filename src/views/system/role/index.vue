<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <!-- 条件搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="角色名">
                <a-input v-model="queryParam.roleName" placeholder="请输入" allow-clear @keyup.enter.native="handleQuery" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="权限字符">
                <a-input v-model="queryParam.roleKey" placeholder="请输入" allow-clear @keyup.enter.native="handleQuery" />
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="状态">
                  <a-select placeholder="请选择" v-model="queryParam.status" style="width: 100%" allow-clear>
                    <a-select-option v-for="(d, index) in statusOptions" :key="index" :value="d.dictValue">{{ d.dictLabel }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="创建时间">
                  <a-range-picker style="width: 100%" v-model="dateRange" valueFormat="YYYY-MM-DD" format="YYYY-MM-DD" allow-clear />
                </a-form-item>
              </a-col>
            </template>
            <a-col :md="(!advanced && 8) || 24" :sm="24">
              <span class="table-page-search-submitButtons" :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}">
                <a-button type="primary" @click="handleQuery"><a-icon type="search" />查询</a-button>
                <a-button style="margin-left: 8px" @click="resetQuery"><a-icon type="redo" />重置</a-button>
                <a @click="toggleAdvanced" style="margin-left: 8px">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 操作 -->
      <div class="table-operations">
        <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPermi="['system:role:add']"> <a-icon type="plus" />新增 </a-button>
        <a-button type="primary" :disabled="single" @click="$refs.createForm.handleUpdate(undefined, ids)" v-hasPermi="['system:role:edit']"> <a-icon type="edit" />修改 </a-button>
        <a-button type="danger" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:role:remove']"> <a-icon type="delete" />删除 </a-button>
        <a-button type="primary" @click="handleExport" v-hasPermi="['system:role:export']"> <a-icon type="download" />导出 </a-button>
        <a-button type="dashed" shape="circle" :loading="loading" :style="{ float: 'right' }" icon="reload" @click="getList" />
      </div>
      <!-- 增加修改 -->
      <create-form ref="createForm" :statusOptions="statusOptions" @ok="getList" />

      <!-- 分配角色数据权限对话框 -->
      <create-data-scope-form ref="createDataScopeForm" @ok="getList" />
      <!-- 数据展示 -->
      <a-table :loading="loading" :size="tableSize" rowKey="roleId" :columns="columns" :data-source="list" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :pagination="false">
        <span slot="status" slot-scope="text, record">
          <a-popconfirm ok-text="是" cancel-text="否" @confirm="confirmHandleStatus(record)" @cancel="cancelHandleStatus(record)">
            <span slot="title"
              >确认<b>{{ record.status === '1' ? '启用' : '关闭' }}</b
              >{{ record.jobName }}的任务吗?</span
            >
            <a-switch checked-children="开" un-checked-children="关" :checked="record.status == 0" />
          </a-popconfirm>
        </span>
        <span slot="createTime" slot-scope="text, record">
          {{ parseTime(record.createTime) }}
        </span>
        <span slot="operation" slot-scope="text, record">
          <a @click="$refs.createForm.handleUpdate(record, undefined)" v-hasPermi="['system:role:edit']"> <a-icon type="edit" />修改 </a>
          <a-divider type="vertical" v-hasPermi="['system:role:edit']" />
          <a @click="$refs.createDataScopeForm.handleDataScope(record)" v-hasPermi="['system:role:edit']"> <a-icon type="lock" />数据权限 </a>
          <a-divider type="vertical" v-hasPermi="['system:role:remove']" />
          <a @click="handleDelete(record)" v-hasPermi="['system:role:remove']"> <a-icon type="delete" />删除 </a>
        </span>
      </a-table>
      <!-- 分页 -->
      <a-pagination
        class="ant-table-pagination"
        show-size-changer
        show-quick-jumper
        :current="queryParam.pageNum"
        :total="total"
        :page-size="queryParam.pageSize"
        :showTotal="total => `共 ${total} 条`"
        @showSizeChange="onShowSizeChange"
        @change="changeSize"
      />
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { listRole, delRole, exportRole, changeRoleStatus } from '/src/api/system/role.js'
import CreateForm from './modules/CreateForm.vue'
import CreateDataScopeForm from './modules/CreateDataScopeForm.vue'

export default {
  name: 'Role',
  components: {
    CreateForm,
    CreateDataScopeForm
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
      // 日期范围
      dateRange: [],
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined
      },
      columns: [
        {
          title: '角色编号',
          dataIndex: 'roleId',
          align: 'center'
        },
        {
          title: '角色名',
          dataIndex: 'roleName',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '权限标识',
          dataIndex: 'roleKey',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '排序',
          dataIndex: 'roleSort',
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' },
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: '20%',
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ]
    }
  },
  filters: {},
  created() {
    this.getList()
    this.getDicts('sys_normal_disable').then(response => {
      this.statusOptions = response.data
    })
  },
  computed: {},
  watch: {},
  methods: {
    /** 查询定时任务列表 */
    getList() {
      this.loading = true
      listRole(this.addDateRange(this.queryParam, this.dateRange)).then(response => {
        this.list = response.rows
        this.total = response.total
        this.loading = false
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
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined
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
      this.ids = this.selectedRows.map(item => item.roleId)
      this.single = selectedRowKeys.length !== 1
      this.multiple = !selectedRowKeys.length
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    /* 任务状态修改 */
    confirmHandleStatus(row) {
      const text = row.status === '1' ? '启用' : '关闭'
      row.status = row.status === '0' ? '1' : '0'
      changeRoleStatus(row.roleId, row.status)
        .then(() => {
          this.$message.success(text + '成功', 3)
        })
        .catch(function () {
          this.$message.error(text + '异常', 3)
        })
    },
    cancelHandleStatus(row) {},
    /** 删除按钮操作 */
    handleDelete(row) {
      var that = this
      const roleIds = row.roleId || this.ids
      this.$antdconfirm({
        title: '确认删除所选中数据?',
        content: '当前选中编号为' + roleIds + '的数据',
        onOk() {
          return delRole(roleIds).then(() => {
            that.onSelectChange([], [])
            that.getList()
            that.$message.success('删除成功', 3)
          })
        },
        onCancel() {}
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      var that = this
      this.$antdconfirm({
        title: '是否确认导出?',
        content: '此操作将导出当前条件下所有数据而非选中数据',
        onOk() {
          return exportRole(that.queryParam).then(response => {
            that.download(response.msg)
            that.$message.success('导出成功', 3)
          })
        },
        onCancel() {}
      })
    }
  }
}
</script>
