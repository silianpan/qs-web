<!-- 合同变更 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="handleAdd">新增</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索变更单号、变更时间" @onSearch="onSearch" />
      </div>
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record">
          <BusCommit cantUpdate :handleDelete="handleDelete" :requestMapping="'/project/contract/temporary'" :busForm="record" @getList="refresh" />
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import moment from 'moment'
import { getContractModify, deleteContractModify } from '/src/api/eos/contract/contractModify.js'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import contractModifyForm from './modules/ContractModifyForm.vue'
import details from './details.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import BusCommit from '/src/components/Activiti/BusCommit.vue'

export default {
  name: 'ContractModify',
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
        return getContractModify(Object.assign({}, param, this.queryParam)).then(res => {
          this.noData = res.total === 0
          return {
            data: res.rows || [],
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      columns: [
        {
          title: '变更合同名称',
          dataIndex: 'baseContract.name',
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
          title: '变更合同编号',
          dataIndex: 'code',
          align: 'center'
        },
        {
          title: '变更时间',
          dataIndex: 'createTime',
          align: 'left',
          customRender: text => moment(text).format('YYYY-MM-DD')
        },
        {
          title: '项目名称',
          dataIndex: 'contractToP.name',
          align: 'left',
          customRender: text => {
            return (
              <Ellipsis length={15} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '变更人',
          dataIndex: 'sysUser.nickName',
          align: 'left'
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          align: 'left',
          customRender: (text, record) => {
            return <AuditStatusTag state={text} instanceId={record.sealWorkflow.instanceId} />
          }
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
  computed: {},
  created() {},
  methods: {
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '新增合同变更',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: contractModifyForm,
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
        content: '是否确认删除变更历史编号为"' + ids + '"的数据项?',
        onOk: () => {
          deleteContractModify(ids).then(() => {
            this.$message.success('删除成功!')
            this.refresh()
          })
        }
      })
    },
    /* 详情 */
    handleDetail(row, formId) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '合同变更详情',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: details,
          props: {
            row,
            formId
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
