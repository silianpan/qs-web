<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <!-- 条件搜索 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="8" :sm="24">
              <a-form-item label="菜单名称">
                <a-input v-model="queryParam.menuName" placeholder="请输入" allow-clear @keyup.enter.native="handleQuery" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="状态">
                <a-select placeholder="请选择" v-model="queryParam.status" style="width: 100%" allow-clear>
                  <a-select-option v-for="(d, index) in statusOptions" :key="index" :value="d.dictValue">{{ d.dictLabel }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleQuery"><a-icon type="search" />查询</a-button>
                <a-button style="margin-left: 8px" @click="resetQuery"><a-icon type="redo" />重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 操作 -->
      <div class="table-operations">
        <a-button type="primary" @click="$refs.createForm.handleAdd()" v-hasPermi="['system:menu:add']"> <a-icon type="plus" />新增 </a-button>
        <a-button type="dashed" shape="circle" :loading="loading" :style="{ float: 'right' }" icon="reload" @click="getList" />
      </div>
      <!-- 增加修改 -->
      <create-form ref="createForm" :menuOptions="menuOptions" :statusOptions="statusOptions" :visibleOptions="visibleOptions" @ok="getList" @select-tree="getTreeselect" />
      <!-- 数据展示 -->
      <a-table :loading="loading" :size="tableSize" rowKey="moduleId" :columns="columns" :data-source="list" :pagination="false">
        <span slot="icon" slot-scope="text, record">
          <!-- <a-icon :component="allIcon[text + 'Icon']" v-if="allIcon[text + 'Icon']"/> -->
          <icon-font v-if="record.meta && record.meta.icon" :type="record.meta.icon" />
        </span>
        <span slot="status" slot-scope="text, record">
          {{ statusFormat(record) }}
        </span>
        <span slot="createTime" slot-scope="text, record">
          {{ parseTime(record.createTime) }}
        </span>
        <span slot="operation" slot-scope="text, record">
          <!-- todo: 修改主要添加流程条件 -->
          <!-- <a @click="$refs.createForm.handleUpdate(record)"><a-icon type="edit" />修改</a> -->
          <a-divider type="vertical" v-hasPermi="['system:menu:add']" />
          <a @click="$refs.createForm.handleAdd(record)" v-hasPermi="['system:menu:add']"> <a-icon type="plus" />新增 </a>
          <a-divider type="vertical" v-if="record.moduleId != 0" v-hasPermi="['system:menu:remove']" />
          <a @click="handleDelete(record)" v-if="record.moduleId != 0" v-hasPermi="['system:menu:remove']"> <a-icon type="delete" />删除 </a>
          <a @click="handleFlowDesign(record)" v-if="record.moduleId != 0 && record.hasFlow != 1"><icon-font style="margin-right: 4px" type="iconfont-liucheng4" />流程设计</a>
        </span>
      </a-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
// import { listMenu, delMenu } from '/src/api/system/menu.js'
import { getRouters } from '/src/api/user/module.js'
import CreateForm from './modules/CreateForm.vue'

export default {
  name: 'Menu',
  components: {
    CreateForm
  },
  data() {
    return {
      iconVisible: false,
      list: [],
      // 部门树选项
      menuOptions: [],
      loading: false,
      // 状态数据字典
      statusOptions: [],
      visibleOptions: [],
      queryParam: {
        menuName: undefined,
        visible: undefined
      },
      columns: [
        {
          title: '菜单名称',
          dataIndex: 'moduleName',
          align: 'left',
          ellipsis: true,
          width: '15%'
        },
        {
          title: '图标',
          dataIndex: 'icon',
          scopedSlots: { customRender: 'icon' },
          width: '5%',
          align: 'center'
        },
        {
          title: '排序',
          dataIndex: 'orderNum',
          width: '5%',
          align: 'center'
        },
        {
          title: '权限标识',
          dataIndex: 'perms',
          ellipsis: true,
          align: 'center'
        },
        {
          title: '组件路径',
          dataIndex: 'component',
          scopedSlots: { customRender: 'component' },
          ellipsis: true,
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
          ellipsis: true,
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
    this.getDicts('sys_show_hide').then(response => {
      this.visibleOptions = response.data
    })
  },
  methods: {
    /** 查询菜单列表 */
    getList() {
      this.loading = true
      // listMenu(this.queryParam).then(response => {
      //     this.list = this.handleTree(response.data, 'menuId')
      //     this.loading = false
      //   }
      // )
      getRouters().then(res => {
        this.list = res.data
        this.loading = false
      })
    },
    // 字典状态字典翻译
    visibleFormat(row) {
      if (row.menuType === 'F') {
        return ''
      }
      return this.selectDictLabel(this.visibleOptions, row.visible)
    },
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParam = {
        memuName: undefined,
        status: undefined
      }
      this.handleQuery()
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      getRouters().then(res => {
        this.menuOptions = res.data
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const menuId = row.menuId
      this.$antdconfirm({
        title: '确认删除所选中数据?',
        content: '当前选中编号为' + menuId + '的数据',
        onOk() {
          // return delMenu(menuId)
          //   .then(() => {
          //     that.getList()
          //     that.$message.success(
          //       '删除成功',
          //       3
          //     )
          // })
        },
        onCancel() {}
      })
    },
    /* 流程设计 */
    handleFlowDesign(record) {
      this.$router.push({
        path: '/processDesign',
        query: {
          tenantAppId: this.$store.getters.tenantAppId,
          menuId: record.moduleId,
          menuName: record.moduleName,
          conditions: record.meta.flowConditions
        }
      })
    }
  }
}
</script>
