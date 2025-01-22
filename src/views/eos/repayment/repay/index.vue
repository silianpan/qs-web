<!-- 还款 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card style="margin-bottom: 20px">
      <ul class="UserMoney">
        <li>
          当前尚未结清借款：<span style="color: #ff6a6a"> {{ this.toThousandFilter(unRepay) }}￥ </span>
        </li>
        <li>
          个人借款总额：<span style="color: #ff1493"> {{ this.toThousandFilter(borrowTotal) }}￥ </span>
        </li>
        <li>
          已还金额：<span style="color: #ff7f24"> {{ this.toThousandFilter(repayTotal) }}￥ </span>
        </li>
      </ul>
    </a-card>
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="handleAdd">新增</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索还款单号、还款金额、还款日期" @onSearch="onSearch" />
      </div>
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record">
          <a v-if="!record.comfirmed" @click="handleDelete(record)"> <a-icon type='delete' /> 删除</a>
          <a v-if="!record.comfirmed" @click="handleUpdate(record)"><a-icon type='edit' /> 修改</a>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import moment from 'moment'
import { listRepay, delRepay, exportRepay, getUserMoney, getRepay } from '/src/api/eos/repayment/repay.js'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import RepayForm from './modules/RepayForm.vue'
import expenseDetail from '/src/views/eos/expense/details.vue'

export default {
  name: 'Repay',
  components: {
    SSearch,
    STable
  },
  data() {
    return {
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
        return listRepay(Object.assign({}, param, QueryParams)).then(res => {
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
          type: 'select',
          label: '还款状态',
          prop: 'comfirmed',
          options: [
            { dictLabel: '已还款', dictValue: '已还款' },
            { dictLabel: '未还款', dictValue: '未还款' }
          ]
        },
        {
          type: 'datePicker',
          label: '还款日期',
          prop: 'createTime'
        },
        {
          type: 'input',
          label: '还款金额',
          prop: 'sum'
        },
        {
          type: 'input',
          label: '还款单号',
          prop: 'code'
        }
      ],
      columns: [
        {
          title: '还款/报销单号',
          dataIndex: 'expenseCode',
          align: 'left'
        },
        {
          title: '还款人',
          dataIndex: 'sysUser.nickName',
          align: 'left'
        },
        {
          title: '还款金额(元)',
          dataIndex: 'sum',
          align: 'left',
          customRender: (text, record) => {
            return <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{this.toThousandFilter(text)}</span>
          }
        },
        {
          title: '还款日期',
          dataIndex: 'createTime',
          align: 'left',
          customRender: text => moment(text).format('MM-DD HH:mm')
        },
        {
          title: '还款状态',
          dataIndex: 'comfirmed',
          align: 'left',
          customRender: (text, record) => {
            return text === '确认' ? <span>已还款</span> : <span>未还款</span>
          }
        },
        {
          title: '还款类型',
          dataIndex: 'repayType',
          align: 'left'
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
    // 查询借款总额
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
          title: '新增直接还款',
          width: '50%',
          maskClosable: true
        },
        content: {
          template: RepayForm,
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
          title: '修改直接还款',
          width: '50%',
          maskClosable: true
        },
        content: {
          template: RepayForm,
          props:{
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
        content: '是否确认删除还款编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delRepay(ids).then(() => {
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
        content: '是否确认导出所有还款数据项?',
        onOk: () => {
          return exportRepay(queryParam).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /** 详情 */
    // handleDetail(row) {
    //   getRepay(row.id).then(res => {
    //     row.expenseForm = res.data
    //     this.$createAntdDrawer({
    //       stopPropagation: true,
    //       drawerProps: {
    //         title: '报销单详情',
    //         width: '60%',
    //         maskClosable: true
    //       },
    //       content: {
    //         template: expenseDetail,
    //         props: {
    //           row: row.expenseForm,
    //           formId: row.expenseForm.id
    //         }
    //       }
    //     })
    //   })
    // },
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
