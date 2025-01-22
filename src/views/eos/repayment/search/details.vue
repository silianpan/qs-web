<!-- 项目详细 -->
<template>
  <div>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1">
        <span slot="tab">
          <a-icon type="smile" />
          借款记录
        </span>
        <!-- 查询表单 -->
        <div class="table-page-search-wrapper">
          <s-form search layout="inline" @search="$refs.tableLoan.refresh(true)" @reset="() => this.queryParam" :formItems="searchFormItems" :formData="queryParam"></s-form>
        </div>
        <!-- 借款表格 -->
        <s-table ref="tableLoan" size="default" rowKey="id" :columns="columnsLoan" :data="loadDataLoan"> </s-table>
      </a-tab-pane>
      <a-tab-pane key="2">
        <span slot="tab">
          <a-icon type="meh" />
          还款记录
        </span>
        <!-- 查询表单 -->
        <div class="table-page-search-wrapper">
          <s-form search layout="inline" @search="$refs.tableRepay.refresh(true)" @reset="() => (this.queryParam = {})" :formItems="searchFormItems" :formData="queryParam"></s-form>
        </div>
        <!-- 还款表格 -->
        <s-table ref="tableRepay" size="default" rowKey="id" :columns="columnsRepay" :data="loadDataRepay"> </s-table>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="jsx">
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { SForm, STable } from '/src/components/index.js'
import { getRepayList, getLoanList } from '/src/api/eos/repayment/search.js'
import expenseDetail from '/src/views/eos/expense/details.vue'
import LoanDetail from '/src/views/eos/repayment/loan/details.vue'
import { expensegetOne } from '/src/api/eos/expense/expense.js'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  name: 'IntegratedQuery',
  props: {
    // formId: {
    //   type: Number,
    //   required: true
    // },
    row: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    SForm,
    STable
  },
  data() {
    return {
      dictKeys: [dictConfig.PROJECT_BUDGET_TYPE],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'createTime'
      },
      dictMap: {},
      searchFormItems: [
        {
          type: 'datePicker',
          label: '日期查询',
          prop: 'createTime'
        }
      ],
      // 借
      columnsLoan: [
        {
          title: '借款人',
          dataIndex: 'sysUser.nickName',
          align: 'center',
          width: 90
        },
        {
          title: '借款金额(元)',
          dataIndex: 'sum',
          align: 'left',
          customRender: (text, record) => {
            return <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#FF4500' }}>{this.toThousandFilter(text)}</span>
          }
        },
        {
          title: '借款日期',
          dataIndex: 'createTime',
          align: 'center'
        },
        {
          title: '借款事由',
          dataIndex: 'remark',
          align: 'center'
        },
        {
          title: '电话',
          dataIndex: 'sysUser.phonenumber',
          align: 'center',
          customRender: (text, record) => {
            return <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#009ACD' }}>{text}</span>
          }
        },
        {
          title: '借款单号',
          dataIndex: 'code',
          align: 'center',
          customRender: (text, record) => {
            return (
              <span style="color:#348EE4;cursor:pointer" onClick={() => this.handleLoanDetail(record, record.id)}>
                {text}
              </span>
            )
          }
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          align: 'left',
          customRender: (text, record) => {
            return <AuditStatusTag clickable state={text} instanceId={record.sealWorkflow.instanceId} />
          }
        },
      ],
      // 借
      loadDataLoan: param => {
        const QueryParams = { ...this.queryParam }
        if (!this.isEmpty(QueryParams.createTime)) {
          QueryParams.createTime = moment(QueryParams.createTime).format('YYYY-MM-DD')
        }
        return getLoanList(Object.assign({}, param, QueryParams, { userName: this.row.sysUser.userName })).then(res => {
          // const dataList = []
          // res.rows.forEach(item => {
          //   if (item.busForm) {
          //     if (!item.busForm.cover) {
          //       item.busForm.cover = textToImg(item.busForm.name)
          //     }
          //     dataList.push({ ...item.busForm, busFlow: item.busFlow })
          //   }
          // })
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      // 还
      columnsRepay: [
        {
          title: '还款人',
          dataIndex: 'sysUser.nickName',
          align: 'center'
        },
        {
          title: '还款金额(元)',
          dataIndex: 'sum',
          align: 'left',
          customRender: (text, record) => {
            return <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#FF4500' }}>{this.toThousandFilter(text)}</span>
          }
        },
        {
          title: '还款日期',
          dataIndex: 'createTime',
          align: 'center'
        },
        {
          title: '还款事由',
          dataIndex: 'remark',
          align: 'center'
        },
        {
          title: '还款类型',
          dataIndex: 'repayType',
          align: 'center',
          customRender: (text, record) => {
            return text === '直接还款' ? <a-tag color="pink">{text}</a-tag> : <a-tag color="blue">{text}</a-tag>
          }
        },
        {
          title: '报销单号',
          dataIndex: 'expenseCode',
          align: 'center',
          customRender: (text, record) => {
            return (
              <span style="color:#348EE4;cursor:pointer" onClick={() => this.handleRepayDetail(record)}>
                {text}
              </span>
            )
          }
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          align: 'left',
          customRender: (text, record) => {
            return record.comfirmed ? '审批通过' : '未通过'
          }
        },
      ],
      // 还
      loadDataRepay: param => {
        const QueryParams = { ...this.queryParam }
        if (!this.isEmpty(QueryParams.createTime)) {
          QueryParams.createTime = moment(QueryParams.createTime).format('YYYY-MM-DD')
        }
        return getRepayList(Object.assign({}, param, QueryParams, { userName: this.row.sysUser.userName })).then(res => {
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      }
    }
  },
  methods: {
    /** 详情 */
    handleRepayDetail(row) {
      expensegetOne({ code: row.expenseCode }).then(res => {
        row.expenseForm = res.data
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '报销单详情',
            width: '60%',
            maskClosable: true
          },
          content: {
            template: expenseDetail,
            props: {
              row: row.expenseForm,
              formId: row.expenseForm.id
            }
          }
        })
      })
    },
    /** 详情 */
    handleLoanDetail(row, formId) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '借款详情',
          width: '50%',
          maskClosable: true
        },
        content: {
          template: LoanDetail,
          props: {
            row,
            formId
          }
        }
      })
    }
  },
  created() {
    // 查询字典
    this.dictKeys.forEach(key => {
      this.getDicts(key).then(res => {
        this.$set(this.dictMap, key, res.data)
      })
    })
  }
}
</script>
