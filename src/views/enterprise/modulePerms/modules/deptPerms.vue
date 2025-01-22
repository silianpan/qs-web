<!-- 部门分配菜单权限 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <!-- 条件搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="部门名称">
                <a-input v-model="queryParam.deptName" placeholder="请输入" allow-clear @keyup.enter.native="handleQuery" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleQuery"><a-icon type="search" />查询</a-button>
                <a-button style="margin-left: 8px" @click="resetQuery"><a-icon type="redo" />重置</a-button>
                <a-button type="dashed" shape="circle" :loading="loading" style="margin-left: 16px" icon="reload" @click="getList" />
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 增加修改 -->
      <menu-tree ref="MenuTree" @ok="getList" />

      <!-- 数据展示 -->
      <a-table :loading="loading" :size="tableSize" rowKey="deptId" :columns="columns" :data-source="list" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :pagination="false">
        <span slot="createTime" slot-scope="text, record">
          {{ parseTime(record.createTime) }}
        </span>
        <span slot="operation" slot-scope="text, record">
          <a @click="$refs.MenuTree.handleUpdate(record, '部门')"> <a-icon type="edit" />添加模块 </a>
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
import { listDeptPage } from '/src/api/system/dept.js'
import MenuTree from './menuTree.vue'

export default {
  name: 'DeptPerms',
  components: {
    MenuTree
  },
  data() {
    return {
      list: [],
      selectedRowKeys: [],
      selectedRows: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      ids: [],
      loading: false,
      total: 0,
      // 日期范围
      dateRange: [],
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        deptName: undefined
      },
      columns: [
        {
          title: '部门编号',
          dataIndex: 'deptId',
          align: 'center'
        },
        {
          title: '部门标识符',
          dataIndex: 'deptKey',
          align: 'center'
        },
        {
          title: '部门名称',
          dataIndex: 'deptName',
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
  },
  computed: {},
  watch: {},
  methods: {
    /** 查询定时任务列表 */
    getList() {
      this.loading = true
      listDeptPage(this.addDateRange(this.queryParam, this.dateRange)).then(response => {
        response.rows.forEach(element => {
          delete element.children
        })
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
        deptName: undefined,
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
      this.ids = this.selectedRows.map(item => item.deptId)
      this.single = selectedRowKeys.length !== 1
      this.multiple = !selectedRowKeys.length
    }
  }
}
</script>
