<template>
  <a-card :bordered="false">
    <!-- 查询表单 -->
    <div class="table-page-search-wrapper">
      <s-form search layout="inline" @search="refresh" @reset="reset" :formItems="searchFormItems" :formData="queryParam"></s-form>
    </div>

    <!-- 数据表格 -->
    <s-table v-if="!isShowCardList" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
      <p slot="expandedRowRender" slot-scope="record">
        <s-descriptions title="基本信息" :formItems="descItems" :formData="record" />
      </p>
    </s-table>
  </a-card>
</template>

<script lang="jsx">
import { SForm, STable, SDescriptions } from '/src/components/index.js'
import { listOutcome } from '/src/api/eos/fundPlan/outcome.js'

export default {
  name: 'Analyst',
  props: {
    projectId: {
      type: Number,
      default: -1
    },
    // 创建时间
    createTime: {
      type: String,
      default: null
    }
  },
  components: {
    STable,
    SForm,
    SDescriptions
  },
  data() {
    return {
      // 是否展示卡片列表
      isShowCardList: false,
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      // 加载数据方法
      loadData: param => {
        param.projectId = this.projectId
        param.createTime = this.createTime
        return listOutcome(Object.assign({}, param, this.queryParam)).then(res => {
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
          label: '资金计划编号',
          prop: 'code'
        },
        {
          type: 'input',
          label: '项目名称',
          prop: 'projectName'
        }
      ],
      columns: [
        {
          title: '编制人',
          dataIndex: 'sysUser.nickName',
          customRender: (text, record) => record.sysUser.nickName
        },
        {
          title: '资金计划编号',
          dataIndex: 'planCode',
          customRender: (text, record) => record.planCode
        },
        {
          title: '支出类型',
          dataIndex: 'secondType',
          customRender: (text, record) => record.secondType
        },

        {
          title: '金额(元)',
          dataIndex: 'money',
          align: 'left',
          customRender: (text, record) => record.money
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          customRender: (text, record) => record.projectName
        },
        {
          title: '合同名称',
          dataIndex: 'contractName',
          customRender: (text, record) => record.contractName
        }
      ],
      descItems: [
        {
          label: '项目编号',
          prop: 'projectCode'
        },
        {
          label: '备注',
          prop: 'remark'
        },
        {
          label: '合同编号',
          prop: 'contractCode'
        },
        {
          label: '合同内容',
          prop: 'contractInfo'
        },
        {
          label: '付款单位',
          prop: 'payer'
        },
        {
          label: '收款单位',
          prop: 'payee'
        },
        {
          label: '采购方式',
          prop: 'payMethod'
        },
        {
          label: '附件',
          prop: 'attachment',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        }
      ]
    }
  },
  methods: {
    // 刷新页面
    refresh() {
      this.isShowCardList ? this.$refs.list.refresh(true) : this.$refs.table.refresh(true)
    },
    // 重置查询参数
    reset() {
      this.queryParam = { isAsc: 'desc', orderByColumn: 'create_time' }
    }
  }
}
</script>
