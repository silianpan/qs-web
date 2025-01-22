<!-- 还款确认 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <!-- 查询表单，若无数据，不展示 -->
      <s-search placeholder="搜索此列表..." clickTips="搜索还款单号、还款金额、还款人" @onSearch="onSearch" />
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record, index">
          <a-button type="link" @click="confirmRepay(text, record, index)" v-if="!record.comfirmed">
            <a-icon type="check" />
            确认还款
          </a-button>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import moment from 'moment'
import { SSearch, STable } from '/src/components/index.js'
import { unPayMoney, confirmRepay } from '/src/api/eos/repayment/payBackConfirm.js'

export default {
  name: 'PayBackConfirm',
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
        orderByColumn: 'createTime'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        const QueryParams = { ...this.queryParam }
        if (!this.isEmpty(QueryParams.createTime)) {
          QueryParams.createTime = moment(QueryParams.createTime).format('YYYY-MM-DD')
        }
        return unPayMoney(Object.assign({}, param, QueryParams)).then(res => {
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
          type: 'input',
          label: '还款人',
          prop: 'nickName'
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
        }
      ],
      columns: [
        {
          title: '还款人',
          dataIndex: 'sysUser.nickName',
          align: 'left'
        },
        {
          title: '还款单号',
          dataIndex: 'expenseCode',
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
          title: '还款类型',
          dataIndex: 'repayType',
          align: 'left'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'left'
        },
        {
          title: '还款状态',
          dataIndex: 'comfirmed',
          align: 'left',
          customRender: (text, record) => {
            return text === '确认' ? <span>已还款</span> : <span color="red">未还款</span>
          }
        },
        {
          title: '操作',
          align: 'left',
          width: 170,
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
    confirmRepay(text, record, index) {
      this.$antdconfirm({
        title: '还款确认',
        content: `是否确认还款？单号为: ${record.expenseCode} 金额为：${record.sum} 元的单据。`,
        onOk: () => {
          return confirmRepay(record.id).then(() => {
            this.$refs.table.refresh(true)
            this.$message.success('还款成功')
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
