<!-- 差旅成本上报 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="handleAdd">上报</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索上报人、上报编号/时间/说明" @onSearch="onSearch" />
      </div>
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :rowSelection="rowSelection">
        <span slot="action" slot-scope="text, record">
          <BusCommit :busCommitActions="busCommitActions" :handleUpdate="handleUpdate" :handleDelete="handleDelete" :requestMapping="'/project/cost'" :busForm="record" @getList="refresh" />
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import moment from 'moment'
import { listOnbus, delOnbus, exportOnbus } from '/src/api/eos/cost/onbus.js'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import onbusDetail from './details.vue'
import OnbusForm from './modules/OnbusForm.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import BusCommit from '/src/components/Activiti/BusCommit.vue'

export default {
  name: 'Onbus',
  components: {
    SSearch,
    STable,
    BusCommit
  },
  data() {
    return {
      rowClick: record => ({
        on: {
          click: () => {
            this.handleDetail(record, record.id)
          }
        },
        style: {
          cursor: 'pointer'
        }
      }),
      busCommitActions: [
        {
          label: '导出',
          icon: 'export',
          action: this.handleExport
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
        kind: '差旅成本上报',
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listOnbus(Object.assign({}, param, this.queryParam)).then(res => {
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
          label: '上报编号',
          prop: 'orderCode'
        },
        {
          type: 'datePicker',
          label: '上报时间',
          prop: 'createTime'
        },
        {
          type: 'input',
          label: '上报人',
          prop: 'createBy'
        },
        {
          type: 'input',
          label: '上报说明',
          prop: 'orderInfo'
        }
      ],
      columns: [
        {
          title: '上报编号',
          dataIndex: 'orderCode',
          align: 'center'
        },
        {
          title: '上报人',
          dataIndex: 'sysUser.nickName',
          align: 'center'
        },
        {
          title: '上报时间',
          dataIndex: 'createTime',
          align: 'center',
          customRender: text => moment(text).format('MM-DD HH:mm')
        },
        {
          title: '上报类型',
          dataIndex: 'orderType',
          align: 'center'
        },
        {
          title: '上报说明',
          dataIndex: 'orderInfo',
          align: 'center',
          customRender: text => {
            return text ? (
              <Ellipsis length={14} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          align: 'center',
          customRender: (text, record) => {
            return <AuditStatusTag state={text} />
          }
        },
        // {
        //   title: '原始附件',
        //   dataIndex: 'attachment',
        //   align: 'center',
        //   customRender: text => {
        //     return <s-doc-list text={text} />
        //   }
        // },
        {
          title: '操作',
          width: 160,
          align: 'center',
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
          title: '新增差旅成本上报',
          width: '85%',
          maskClosable: true
        },
        content: {
          template: OnbusForm,
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
          title: '修改差旅成本上报',
          width: '85%',
          maskClosable: true
        },
        content: {
          template: OnbusForm,
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
    /** 导出按钮操作 */
    handleExport(record) {
      this.$antdconfirm({
        title: '导出',
        content: '是否确认导出上报编号为 ' + record.orderCode + ' 的差旅成本明细?',
        onOk: () => {
          return exportOnbus(record.orderCode).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /** 详情 */
    handleDetail(row, formId) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '差旅成本上报详情',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: onbusDetail,
          props: {
            title: '差旅成本上报详情',
            row,
            formId
          }
        }
      })
    },
    /* 删除 */
    handleDelete(row) {
      const ids = row.id
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除借款编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delOnbus(ids).then(() => {
            this.refresh()
            this.$message.success('删除成功', 3)
          })
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
