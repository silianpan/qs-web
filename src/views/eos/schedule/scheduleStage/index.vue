<!-- 进度计划阶段 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <!-- 查询表单 -->
      <div class="table-page-search-wrapper">
        <s-form search layout="inline" @search="$refs.table.refresh(true)" @reset="() => (this.queryParam = {})" :formItems="searchFormItems" :formData="queryParam"></s-form>
      </div>

      <!-- 业务操作按钮 -->
      <div class="table-operations">
        <a-button type="primary" ghost icon="a-icon-plus" size="small" @click="handleAdd" v-hasPermi="['project:stage:add']">新增</a-button>
        <a-button type="success" plain icon="a-icon-edit" size="small" @click="handleUpdate" v-hasPermi="['project:stage:edit']">修改</a-button>
        <a-button type="danger" plain icon="a-icon-delete" size="small" @click="handleDelete" v-hasPermi="['project:stage:remove']">删除</a-button>
        <a-button type="warning" plain icon="a-icon-download" size="small" @click="handleExport" v-hasPermi="['project:stage:export']">导出</a-button>
        <a-button type="dashed" shape="circle" :style="{ float: 'right' }" icon="reload" @click="$refs.table.refresh(true)" />
      </div>

      <!-- 数据表格 -->
      <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :rowSelection="rowSelection">
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { listStage, delStage, exportStage } from '/src/api/eos/schedule/schedule-stage.js'
import { SForm, STable, SDescriptions } from '/src/components/index.js'
import StageForm from './modules/StageForm.vue'

export default {
  name: 'Stage',
  components: {
    SForm,
    STable
  },
  data() {
    return {
      dictKeys: [],
      dictMap: {},
      selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listStage(Object.assign({}, param, this.queryParam)).then(res => {
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
          label: '版本',
          prop: 'version'
        },
        {
          type: 'input',
          label: '所属项目的id',
          prop: 'projectId'
        },
        {
          type: 'input',
          label: '阶段名称',
          prop: 'name'
        },
        {
          type: 'input',
          label: '计划工作量',
          prop: 'workload'
        },
        {
          type: 'textarea',
          label: '节点描述',
          prop: 'note'
        },
        {
          type: 'datetime',
          label: '计划开始日期',
          prop: 'beginDate'
        },
        {
          type: 'datetime',
          label: '计划完成日期',
          prop: 'endDate'
        },
        {
          type: 'input',
          label: '父节点',
          prop: 'parentId'
        },
        {
          type: 'input',
          label: '阶段所属层级',
          prop: 'level'
        },
        {
          type: 'input',
          label: '本级顺序',
          prop: 'serial'
        }
      ],
      columns: [
        {
          title: '主键ID',
          dataIndex: 'id',
          align: 'center'
        },
        {
          title: '删除标志',
          dataIndex: 'delFlag',
          align: 'center'
        },
        {
          title: '创建者',
          dataIndex: 'createBy',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center'
        },
        {
          title: '更新者',
          dataIndex: 'updateBy',
          align: 'center'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center'
        },
        {
          title: '版本',
          dataIndex: 'version',
          align: 'center'
        },
        {
          title: '所属项目的id',
          dataIndex: 'projectId',
          align: 'center'
        },
        {
          title: '阶段名称',
          dataIndex: 'name',
          align: 'center'
        },
        {
          title: '计划工作量',
          dataIndex: 'workload',
          align: 'center'
        },
        {
          title: '节点描述',
          dataIndex: 'note',
          align: 'center'
        },
        {
          title: '计划开始日期',
          dataIndex: 'beginDate',
          align: 'center'
        },
        {
          title: '计划完成日期',
          dataIndex: 'endDate',
          align: 'center'
        },
        {
          title: '父节点',
          dataIndex: 'parentId',
          align: 'center'
        },
        {
          title: '阶段所属层级',
          dataIndex: 'level',
          align: 'center'
        },
        {
          title: '本级顺序',
          dataIndex: 'serial',
          align: 'center'
        }
      ]
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  created() {
    // 查询字典
    this.dictKeys.forEach(key => {
      this.getDicts(key).then(res => {
        this.$set(this.dictMap, key, res.data)
      })
    })
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '新增任务计划阶段',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: StageForm,
          props: {},
          on: {
            ok: () => {},
            close: () => {}
          }
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {},
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除进度计划阶段编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delStage(ids).then(() => {
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
        content: '是否确认导出所有进度计划阶段数据项?',
        onOk: () => {
          return exportStage(queryParam).then(res => {
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
          title: '任务计划阶段详情',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: SDescriptions,
          on: {
            ok: () => {},
            close: () => {}
          },
          props: {
            title: '任务计划阶段详情',
            formData: row,
            formItems: [
              {
                label: '版本',
                prop: 'version'
              },
              {
                label: '所属项目的id',
                prop: 'projectId'
              },
              {
                label: '阶段名称',
                prop: 'name'
              },
              {
                label: '计划工作量',
                prop: 'workload'
              },
              {
                label: '节点描述',
                prop: 'note'
              },
              {
                label: '计划开始日期',
                prop: 'beginDate'
              },
              {
                label: '计划完成日期',
                prop: 'endDate'
              },
              {
                label: '父节点',
                prop: 'parentId'
              },
              {
                label: '阶段所属层级',
                prop: 'level'
              },
              {
                label: '本级顺序',
                prop: 'serial'
              }
            ]
          }
        }
      })
    }
  }
}
</script>
