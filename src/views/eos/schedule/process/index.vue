<!-- 工作量填报 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="handleAdd">新增</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索填报人、填报时间、备注" @onSearch="onSearch" />
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
import { listProcess, delProcessWrite, exportProcess } from '/src/api/eos/schedule/process.js'
import { SSearch, STable, SActionColumns } from '/src/components/index.js'
import ProcessForm from './modules/ProcessForm.vue'
import detail from './detail.vue'

export default {
  name: 'Process',
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
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listProcess(Object.assign({}, param, this.queryParam)).then(res => {
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
          title: '汇报编号',
          dataIndex: 'code',
          align: 'left'
        },
        {
          title: '汇报人',
          dataIndex: 'sysUser.nickName',
          align: 'left'
        },
        {
          title: '汇报时间',
          dataIndex: 'createTime',
          align: 'left',
          customRender: (text, record) => {
            return moment(text).format('YYYY-MM-DD HH:mm')
          }
        },
        {
          title: '汇报周期(开始)',
          dataIndex: 'startDate',
          align: 'left'
        },
        {
          title: '汇报周期(结束)',
          dataIndex: 'endDate',
          align: 'left'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'left'
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
          title: '新增工作量填报',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: ProcessForm,
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
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '修改工作量填报',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: ProcessForm,
          props: {
            isUpdate: true,
            updateRow: row
          },
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除进度执行编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delProcessWrite(ids).then(() => {
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
        content: '是否确认导出所有进度执行数据项?',
        onOk: () => {
          return exportProcess(queryParam).then(res => {
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
          title: '工作量填报详情',
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
      this.$refs.table.refresh(true)
    }
  }
}
</script>
