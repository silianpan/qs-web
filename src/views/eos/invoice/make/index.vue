<!-- 开票申请 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="handleAdd">新增</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索项目名称、合同名称、开票单位/金额" @onSearch="onSearch" />
      </div>
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :rowSelection="rowSelection">
        <span slot="action" slot-scope="text, record">
          <BusCommit :busCommitActions="busCommitActions" :handleUpdate="handleUpdate" :handleDelete="handleDelete" :requestMapping="'/project/make'" :busForm="record" @getList="refresh" />
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import moment from 'moment'
import { listMake, delMake, exportMake } from '/src/api/eos/invoice/make.js'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import MakeForm from './modules/MakeForm'
import MakeFormDetail from './details.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import BusCommit from '/src/components/Activiti/BusCommit.vue'

export default {
  name: 'Make',
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
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        const QueryParams = { ...this.queryParam }
        if (!this.isEmpty(QueryParams.makeTime)) {
          QueryParams.makeTime = moment(QueryParams.makeTime).format('YYYY-MM-DD')
        }
        return listMake(Object.assign({}, param, QueryParams)).then(res => {
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
          label: '申请单号',
          prop: 'code'
        },
        {
          type: 'input',
          label: '项目名称',
          prop: 'projectName'
        },
        {
          type: 'input',
          label: '开票单位',
          prop: 'makeUnit'
        },
        {
          type: 'input',
          label: '本次开票金额',
          prop: 'thisMoney',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          type: 'datePicker',
          label: '开票时间',
          prop: 'makeTime'
        },
        {
          type: 'input',
          label: '合同名称',
          prop: 'contractName'
        },
        {
          type: 'input',
          label: '开票类型',
          prop: 'type'
        }
      ],
      columns: [
        // {
        //   title: '申请单号',
        //   dataIndex: 'code',
        //   align: 'left'
        // },
        {
          title: '申请人',
          dataIndex: 'sysUser.nickName',
          align: 'left'
        },
        {
          title: '开票时间',
          dataIndex: 'makeTime',
          align: 'left',
          customRender: text => {
            return text ? moment(text).format('YYYY-MM-DD') : ''
          }
        },
        {
          title: '开票单位',
          dataIndex: 'makeUnit',
          align: 'left',
          customRender: text => {
            return (
              <Ellipsis length={12} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '本次开票金额(元)',
          dataIndex: 'thisMoney',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '实际收款进度',
          dataIndex: 'ratio',
          align: 'left',
          customRender: (text, record) => {
            if (!this.isEmpty(text)) {
              return <a-progress width={80} type="circle" percent={text} status="active" stroke-color={{ '0%': '#108ee9', '100%': '#87d068' }} />
            }
          }
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          align: 'left',
          customRender: text => {
            return (
              <Ellipsis length={20} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '合同名称',
          dataIndex: 'contractName',
          align: 'left',
          customRender: text => {
            return (
              <Ellipsis length={20} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          align: 'left',
          customRender: (text, record) => {
            return <AuditStatusTag state={text} />
          }
        },
        // {
        //   title: '开票类型',
        //   dataIndex: 'type',
        //   align: 'left'
        // },
        {
          title: '当前税率(%)',
          dataIndex: 'taxRate',
          align: 'left'
        },
        {
          title: '操作',
          width: 160,
          align: 'left',
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
          title: '新增开票',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: MakeForm,
          on: {
            ok: () => {
              this.refresh()
            },
            off: () => {
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
          title: '修改开票',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: MakeForm,
          props: {
            isUpdate: true,
            updateRow: row
          },
          on: {
            ok: () => {
              this.refresh()
            }
          }
        }
      })
    },
    /** 导出按钮操作 */
    handleExport(row) {
      this.$antdconfirm({
        title: '导出',
        content: '是否确认导出所有开票管理数据项?',
        onOk: () => {
          return exportMake(row.id).then(res => {
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
          title: '开票详情',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: MakeFormDetail,
          props: {
            title: '开票详情',
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
        content: '是否确认删除编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delMake(ids).then(() => {
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
  },
  activated() {
    this.refresh()
  }
}
</script>
