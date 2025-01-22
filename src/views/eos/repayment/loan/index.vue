<!-- 借款申请 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card style="margin-bottom: 20px">
      <ul class="UserMoney">
        <li>
          当前尚未结清借款：<span style="color: #ff6a6a">￥{{ this.toThousandFilter(unRepay) }} </span>
        </li>
        <li>
          个人借款总额：<span style="color: #ff1493"> ￥{{ this.toThousandFilter(borrowTotal) }} </span>
        </li>
        <li>
          已还金额：<span style="color: #ff7f24"> ￥{{ this.toThousandFilter(repayTotal) }} </span>
        </li>
      </ul>
    </a-card>
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="handleAdd">新增</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索借款事由、借款类型、借款日期" @onSearch="onSearch" />
      </div>
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :rowSelection="rowSelection">
        <span slot="action" slot-scope="text, record">
          <BusCommit :handleUpdate="handleUpdate" :handleDelete="_handleDelete" :requestMapping="'/project/loan'" :busForm="record" @getList="refresh" />
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import moment from 'moment'
import { listLoan, delLoan, exportLoan, getUserMoney } from '/src/api/eos/repayment/loan.js'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import LoanForm from './modules/LoanForm.vue'
import details from './details.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import BusCommit from '/src/components/Activiti/BusCommit.vue'

export default {
  name: 'Loan',
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
        orderByColumn: 'createTime',
        tenantAppId: this.$store.getters.tenantAppId,
        menuId: this.$route.meta.moduleId
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        const QueryParams = { ...this.queryParam }
        if (!this.isEmpty(QueryParams.createTime)) {
          QueryParams.createTime = moment(QueryParams.createTime).format('YYYY-MM-DD')
        }
        return listLoan(Object.assign({}, param, QueryParams)).then(res => {
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
        },
        {
          type: 'datePicker',
          label: '借款日期',
          prop: 'createTime'
        },
        {
          type: 'input',
          label: '借款事由',
          prop: 'remark'
        }
      ],
      columns: [
        {
          title: '借款人',
          dataIndex: 'sysUser.nickName',
          align: 'left'
        },
        {
          title: '借款单号',
          dataIndex: 'code',
          align: 'left'
        },
        {
          title: '借款金额(元)',
          dataIndex: 'sum',
          align: 'left',
          customRender: (text, record) => {
            return <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{text}</span>
          }
        },
        {
          title: '借款日期',
          dataIndex: 'createTime',
          align: 'left',
          customRender: text => moment(text).format('MM-DD HH:mm')
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          align: 'left',
          customRender: (text, record) => {
            console.log('record.instanceId', record.instanceId)
            return <AuditStatusTag clickable state={text} instanceId={record.sealWorkflow.instanceId} />
          }
        },
        {
          title: '借款事由',
          dataIndex: 'remark',
          align: 'left',
          customRender: text => {
            return text ? (
              <Ellipsis length={16} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          title: '附件',
          dataIndex: 'attachment',
          align: 'left',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        },
        {
          title: '操作',
          width: 160,
          align: 'left',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 当前尚未结清借款
      unRepay: 0,
      // 个人借款总额
      borrowTotal: 0,
      // 已还金额
      repayTotal: 0
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
          title: '新增借款',
          width: '50%',
          maskClosable: true
        },
        content: {
          template: LoanForm,
          on: {
            ok: () => {
              this.getUserMoney()
              this.$refs.table.refresh(true)
            },
            close: () => {
              this.getUserMoney()
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
          title: '修改借款',
          width: '50%',
          maskClosable: true
        },
        content: {
          template: LoanForm,
          props: {
            isUpdate: true,
            updateRow: row
          },
          on: {
            ok: () => {
              this.getUserMoney()
              this.$refs.table.refresh(true)
            },
            close: () => {
              this.getUserMoney()
              this.$refs.table.refresh(true)
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
        content: '是否确认删除借款编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delLoan(ids).then(() => {
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
        content: '是否确认导出所有借款数据项?',
        onOk: () => {
          return exportLoan(queryParam).then(res => {
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
          title: '借款详情',
          width: '50%',
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
    /* 删除 */
    _handleDelete(row) {
      const ids = row.id
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除借款编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delLoan(ids).then(() => {
            this.$refs.table.refresh(true)
            this.$message.success('删除成功', 3)
          })
        }
      })
    },
    getUserMoney() {
      // 查询借款总额
      getUserMoney().then(res => {
        this.unRepay = res.data.unRepay
        this.borrowTotal = res.data.borrowTotal
        this.repayTotal = res.data.repayTotal
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
      this.getUserMoney()
      this.$refs.table.refresh(true)
    }
  },
  mounted() {
    this.getUserMoney()
  }
}
</script>
<style lang="less" scoped>
.UserMoney {
  display: flex;
  justify-content: space-around;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 0;
  span {
    font-size: 20px;
  }
}
</style>
