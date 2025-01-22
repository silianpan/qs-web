<!-- 项目成员管理 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="handleAdd">添加项目成员</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索项目名称" @onSearch="onSearch" />
      </div>
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record">
          <a @click.stop="handleUpdate(record)"> <icon-font class="s-mr-3" type="iconfont-bianji" />修改</a>
          <a @click.stop="handleDelete(record)"> <icon-font class="s-mr-3" type="iconfont-shanchu" />删除</a>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import { listMemApply, delMemApply, exportMemApply } from '/src/api/eos/project/memApply.js'
import { SSearch, STable } from '/src/components/index.js'
import MemForm from './modules/MemForm.vue'
import ProjectMemDetail from './detail.vue'
import ProjectMemReApply from './modules/MemReApply.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  name: 'Mem',
  components: {
    SSearch,
    STable,
  },
  data() {
    return {
      rowClick: record => ({
        on: {
          click: () => {
            this.handleDetail(record)
          }
        },
        style: {
          cursor: 'pointer'
        }
      }),
      /* 是否有数据 */
      noData: false,
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time',
        tenantAppId: this.$store.getters.tenantAppId,
        menuId: this.$route.meta.moduleId
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listMemApply(Object.assign({}, param, this.queryParam)).then(res => {
          this.noData = res.total === 0
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      searchFormItems: [
        {
          type: 'input',
          label: '项目名称',
          prop: 'projectName'
        }
      ],
      columns: [
        {
          title: '申请单号',
          dataIndex: 'code',
          align: 'left'
        },
        {
          title: '姓名',
          align: 'left',
          dataIndex: 'sysUser.nickName'
          // customRender: (text, record) => record.busFlow.applyUserName
        },
        {
          title: '角色',
          dataIndex: 'type',
          align: 'left'
        },
        {
          title: '项目名称',
          align: 'left',
          dataIndex: 'sealProject.name'
        },
        {
          title: '项目编号',
          align: 'left',
          dataIndex: 'sealProject.code'
        },
        {
          title: '操作',
          width: 160,
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    // 重置查询参数
    reset() {
      this.queryParam = {}
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '添加项目成员',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: MemForm,
          on: {
            ok: () => {
              this.$refs.table.refresh(true)
            }
          }
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '修改项目成员',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: MemForm,
          props: {
            isUpdate: true,
            updateRow: row
          },
          on: {
            ok: () => {
              this.$refs.table.refresh(true)
            }
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除申请单号为"' + row.code + '"的数据项?',
        onOk: () => {
          return delMemApply(row.id).then(() => {
            this.$refs.table.refresh(true)
            this.$message.success('删除成功', 3)
          })
        }
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParam = this.queryParam
      this.$antdconfirm({
        title: '导出',
        content: '是否确认导出所有项目成员数据项?',
        onOk: () => {
          return exportMemApply(queryParam).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /** 详情 */
    handleDetail(row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '项目成员详情',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: ProjectMemDetail,
          props: {
            projectId: row.projectId,
            applyId: row.id
          }
        }
      })
    },
    handleReApply(busFlow) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '调整申请',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: ProjectMemReApply,
          props: {
            busFlow
          },
          on: {
            ok: () => {
              this.$refs.table.refresh(true)
            }
          }
        }
      })
    },

    /* 查询按钮 */
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam, projectName: data }
      this.refresh()
    },
    // 刷新页面
    refresh() {
      this.$refs.table.refresh(true)
    }
  }
}
</script>
