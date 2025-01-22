<!-- 工作计划 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="handleAdd">新增</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索项目名称、创建人" @onSearch="onSearch" />
      </div>
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record" v-if="$store.getters.nickname === record.sysUser.nickName">
          <s-action-columns :actions="actions" :record="record" />
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import moment from 'moment'
import { listSchedule, delSchedule, exportSchedule, getSchedule } from '/src/api/eos/schedule/schedule.js'
import { SSearch, STable, Ellipsis, SActionColumns } from '/src/components/index.js'
import ScheduleForm from './modules/ScheduleForm.vue'
import detail from './detail.vue'

export default {
  name: 'Schedule',
  components: {
    SSearch,
    STable,
    SActionColumns
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
      actions: [
        {
          label: '修改',
          icon: 'iconfont-bianji',
          action: this.handleUpdate
        },
        {
          label: '删除',
          icon: 'iconfont-shanchu',
          action: this.handleDelete
        }
      ],
      /* 是否有数据 */
      noData: false,
      dictKeys: [],
      dictMap: {},
      selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listSchedule(Object.assign({}, param, this.queryParam)).then(res => {
          this.noData = res.total === 0
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      columns: [
        {
          title: '计划编号',
          dataIndex: 'code',
          align: 'left'
        },
        {
          title: '项目',
          align: 'left',
          dataIndex: 'sealProject.name',
          customRender: text=>{
            return text ? <Ellipsis length={40} tooltip>{text}</Ellipsis> : text
          }
        },
        {
          title: '备注',
          align: 'left',
          dataIndex: 'remark',
          customRender: text=>{
            return text ? <Ellipsis length={40} tooltip>{text}</Ellipsis> : text
          }
        },
        {
          title: '创建人',
          dataIndex: 'sysUser.nickName',
          align: 'left'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'left',
          customRender: (text, record) => {
            return moment(text).format('YYYY-MM-DD')
          }
        },
        {
          title: '操作',
          align: 'left',
          width: 160,
          scopedSlots: { customRender: 'action' }
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
          title: '新增任务计划',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: ScheduleForm,
          props: {},
          on: {
            ok: () => {
              this.refresh()
            },
            close: () => {
              this.refresh()
            }
          }
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      getSchedule(row.id).then(res => {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '修改任务计划',
            width: '80%',
            maskClosable: true
          },
          content: {
            template: ScheduleForm,
            props: {
              isUpdate: true,
              updateRow: res.data
            },
            on: {
              ok: () => {
                this.refresh()
              }
            }
          }
        })
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除进度计划编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delSchedule(ids).then(() => {
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
        content: '是否确认导出所有进度计划数据项?',
        onOk: () => {
          return exportSchedule(queryParam).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /** 详情 */
    handleDetail(row) {
      getSchedule(row.id).then(res => {
        row.stageList = res.data.stageList
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '任务计划详情',
            width: '60%',
            maskClosable: true
          },
          content: {
            template: detail,
            props: {
              row,
              formId: row.id
            },
            on: {
              ok: () => {},
              close: () => {}
            }
          }
        })
      })
    },
    /* 查询按钮 */
    clickquery(param) {
      this.queryParam = { ...this.queryParam, orderByColumn: param }
      this.refresh()
    },
    /* 查询按钮 */
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    },
    // 刷新页面
    refresh() {
      this.$refs.table.refresh()
    }
  }
}
</script>
