<!-- 报销使用情况：根据项目ID获取报销信息 -->
<template>
  <div>
    <!-- 查询表单 -->
    <div class="table-page-search-wrapper">
      <s-form search layout="inline" @search="$refs.table.refresh(true)" @reset="reset" :formItems="searchFormItems" :formData="queryParam" />
    </div>

    <!-- 业务操作按钮 -->
    <div class="table-operations">
      <a-button ghost type="primary" icon="export" @click="handleExport">导出</a-button>
      <a-button type="dashed" shape="circle" :style="{ float: 'right' }" icon="reload" @click="$refs.table.refresh(true)" />
    </div>

    <!-- 数据表格 -->
    <s-table ref="table" rowKey="id" :columns="columns" :data="loadData">
      <p slot="expandedRowRender" slot-scope="record">
        <s-descriptions title="基本信息" :formItems="descItems" :formData="record" />
      </p>
    </s-table>
  </div>
</template>

<script lang="jsx">
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { exportProjectDetail } from '/src/api/eos/expense/detail.js'
import { listExpenseDetail } from '/src/api/eos/expense/expense.js'

import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'
import SForm from '/src/components/Form/index.jsx'
import STable from '/src/components/Table/index.jsx'
import SDescriptions from '/src/components/Descriptions/index.jsx'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  name: 'ExpenseUse',
  components: {
    SForm,
    STable,
    SDescriptions
  },
  props: {
    projectId: {
      type: Number,
      default: null
    },
    // 预算类型：生产预算、销售预算、管理预算
    budgetType: {
      type: String,
      default: null
    },
    // 费用类型
    expenseType: {
      type: String,
      default: null
    },
    // 创建时间
    createTime: {
      type: String,
      default: null
    },
    projectCode: {
      type: String,
      default: null
    },
    startTime: {
      type: Date,
      default: null
    },
    endTime: {
      type: Date,
      default: null
    },
    region: {
      type: String,
      default: null
    },
    deptId: {
      type: Number,
      default: null
    },
    deptTime: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dictKeys: [dictConfig.PROJECT_UNIT, dictConfig.PROJECT_INVOICE_TYPE],
      dictMap: {},
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time',
        tenantAppId: this.$store.getters.tenantAppId,
        menuId: this.$route.meta.moduleId
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        param.projectId = this.projectId
        param.budgetType = this.budgetType
        param.expenseType = this.expenseType
        param.createTime = this.createTime
        param.projectCode = this.projectCode
        param.deptId = this.deptId
        param.deptTime = this.deptTime
        if (!this.isEmpty(this.startTime)) {
          param.startTime = moment(this.startTime).format('YYYY-MM') + '-01 00:00:00'
        }
        if (!this.isEmpty(this.endTime)) {
          param.endTime = moment(this.endTime).format('YYYY-MM') + '-31 23:59:59'
        }
        param.region = this.region
        return listExpenseDetail(Object.assign({}, param, this.queryParam)).then(res => {
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
          label: '报销人',
          prop: 'nickName'
        },
        {
          type: 'input',
          label: '报销内容',
          prop: 'content'
        },
        {
          type: 'input',
          label: '费用详情',
          prop: 'detail'
        }
      ],
      columns: [
        {
          title: '报销人',
          dataIndex: 'sysUser.nickName'
        },
        {
          title: '审批状态',
          dataIndex: 'sealExpense.state',
          customRender: text => {
            return <AuditStatusTag state={text} />
          }
        },
        {
          title: '报销单号',
          dataIndex: 'sealExpense.code',
          align: 'center'
        },
        {
          title: '报销内容',
          dataIndex: 'sealExpense.content',
          customRender: text => {
            return text ? (
              <Ellipsis length={20} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          title: '报销金额(元)',
          dataIndex: 'sum',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '费用详情',
          dataIndex: 'detail',
          align: 'center',
          customRender: text => {
            return text ? (
              <Ellipsis length={20} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        }
      ],
      descItems: [
        {
          label: '报销单号',
          prop: 'sealExpense.code'
        },
        {
          label: '报销内容',
          prop: 'sealExpense.content',
          customRender: text => {
            return text ? (
              <Ellipsis length={20} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          label: '报销附件',
          prop: 'sealExpense.attachment',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        },
        {
          label: '是否冲抵借款',
          prop: 'sealExpense.repay'
        },
        {
          label: '所属合同编号',
          prop: 'sealContract.code'
        },
        {
          label: '合同名称',
          prop: 'sealContract.name'
        },
        {
          label: '合同金额',
          prop: 'sealContract.sum',
          customRender: text => this.toThousandFilter(text)
        },
        {
          label: '合同附件',
          prop: 'sealContract.attachment',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        },
        {
          label: '是否代票',
          prop: 'replaced'
        },
        {
          label: '代票详情',
          prop: 'remark'
        }
      ]
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
    reset() {
      this.queryParam = { isAsc: 'desc', orderByColumn: 'create_time', tenantAppId: this.$store.getters.tenantAppId, menuId: this.$route.meta.moduleId }
    },
    /** 导出按钮操作 */
    handleExport(text, record) {
      this.$antdconfirm({
        title: '导出',
        content: '是否导出项目下的报销明细?',
        onOk: () => {
          const QueryParams = { ...this.queryParam }
          QueryParams.projectId = this.projectId
          QueryParams.budgetType = this.budgetType
          QueryParams.expenseType = this.expenseType
          QueryParams.createTime = this.createTime
          return exportProjectDetail(Object.assign({}, QueryParams)).then(res => {
            this.download(res.msg)
          })
        }
      })
    }
  }
}
</script>
