<!-- 借还款综合查询 -->
<template>
  <a-card :bordered="false">
    <div class="table-header-btns">
      <!-- 查询表单，若无数据，不展示 -->
      <a-radio-group v-model="value">
        <a-radio :value="1"> 按人员 </a-radio>
        <a-radio :value="2"> 按借款日期 </a-radio>
      </a-radio-group>
      <s-search
        style="flex: 1"
        placeholder="搜索此列表..."
        clickTips="搜索借款人"
        @onSearch="onSearch"
        @reset="() => (this.queryParam = { isAsc: 'desc', orderByColumn: 'createTime' })"
        :formItems="searchFormItems"
        :formData="queryParam"
      />
    </div>
    <!-- 数据表格 -->
    <div v-show="value === 1">
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="oid" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record">
          <a-button type="link" @click.stop="press(record)"> <a-icon type="bell" /> 催办</a-button>
        </span>
      </s-table>
    </div>
    <div v-show="value === 2">
      <no-data v-show="noData2 === true" />
      <s-table v-show="noData2 === false" :customRow="rowClick2" ref="table2" size="default" rowKey="oid" :columns="columns2" :data="loadData2"> </s-table>
    </div>
  </a-card>
</template>

<script lang="jsx">
import moment from 'moment'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import details from './details.vue'
import loanDetails from '/src/views/eos/repayment/loan/details.vue'
import { getIntegratedQuery, repayPress } from '/src/api/eos/repayment/search.js'
import { listLoanAll } from '/src/api/eos/repayment/loan.js'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  name: 'IntegratedQueryOp',
  components: {
    SSearch,
    STable
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
      rowClick2: record => ({
        on: {
          click: () => {
            this.handleDetail2(record, record.id)
          }
        },
        style: {
          cursor: 'pointer'
        }
      }),
      value: 1,
      noData: false,
      noData2: true,
      dictKeys: [],
      dictMap: {},
      selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: {
        // isAsc: 'desc',
        // orderByColumn: 'createTime'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return getIntegratedQuery(Object.assign({}, param, this.queryParam)).then(res => {
          this.noData = res.total === 0
          res.rows.forEach(item => {
            item.oid = Math.random()
          })
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      loadData2: param => {
        return listLoanAll(Object.assign({}, param, this.queryParam)).then(res => {
          this.noData2 = res.total === 0
          res.rows.forEach(item => {
            item.oid = Math.random()
          })
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
          label: '借款人',
          prop: 'nickName'
        },
        {
          type: 'input',
          label: '借款单号',
          prop: 'code'
        },
        {
          type: 'input',
          label: '借款金额(元)',
          prop: 'sum'
        },
        {
          type: 'input',
          label: '借款事由',
          prop: 'remark'
        }
      ],
      columns: [
        {
          title: '#',
          align: 'center',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '借款人',
          dataIndex: 'sysUser.nickName',
          align: 'left'
        },
        {
          title: '借款总额(元)',
          dataIndex: 'borrowTotal',
          align: 'left',
          customRender: (text, record) => {
            return <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#FF4500' }}>{this.toThousandFilter(text)}</span>
          }
        },
        {
          title: '已还金额(元)',
          dataIndex: 'repayTotal',
          align: 'left',
          customRender: (text, record) => {
            return <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#FF4500' }}>{this.toThousandFilter(text)}</span>
          }
        },
        {
          title: '待还金额(元)',
          dataIndex: 'unRepay',
          align: 'left',
          customRender: (text, record) => {
            return <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#FF4500' }}>{this.toThousandFilter(text)}</span>
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 160,
          scopedSlots: { customRender: 'action' }
        }
      ],
      columns2: [
        {
          title: '借款人',
          dataIndex: 'sysUser.nickName',
          align: 'left'
        },
        // {
        //   title: '借款单号',
        //   dataIndex: 'code',
        //   align: 'left'
        // },
        {
          title: '借款金额(元)',
          dataIndex: 'sum',
          align: 'left',
          customRender: (text, record) => {
            return <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#FF4500' }}>{this.toThousandFilter(text)}</span>
          }
        },
        {
          title: '借款事由',
          dataIndex: 'remark',
          align: 'left',
          customRender: text => {
            return text ? (
              <Ellipsis length={40} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
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
            return <AuditStatusTag clickable state={text} instanceId={record.sealWorkflow.instanceId} />
          }
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
    /** 详情 */
    handleDetail(row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '借还款详情',
          width: '50%',
          maskClosable: true
        },
        content: {
          template: details,
          props: {
            row
          }
        }
      })
    },
    handleDetail2(row, formId) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '借款详情',
          width: '50%',
          maskClosable: true
        },
        content: {
          template: loanDetails,
          props: {
            row,
            formId
          }
        }
      })
    },
    /** 催办 */
    press(row) {
      return repayPress(row.sysUser.userId)
        .then(res => {
          this.$message.success(res.msg)
        })
        .catch(err => {
          this.$message.error(err.message)
        })
    },
    /* 查询按钮 */
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    },
    // 刷新页面
    refresh() {
      this.value === 1 ? this.$refs.table.refresh(true) : this.$refs.table2.refresh(true)
    }
  }
}
</script>
