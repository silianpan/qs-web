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
import { listIncome } from '/src/api/eos/fundPlan/income.js'

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
        return listIncome(Object.assign({}, param, this.queryParam)).then(res => {
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
          title: '项目名称',
          dataIndex: 'projectName',
          customRender: (text, record) => record.projectName
        },

        {
          title: '合同名称',
          dataIndex: 'contractName',
          customRender: (text, record) => record.contractName
        },
        {
          title: '本月开票金额(元)',
          align: 'left',
          dataIndex: 'thisMoney',
          customRender: (text, record) => record.thisMoney
        },
        {
          title: '所属公司',
          dataIndex: 'company',
          customRender: (text, record) => record.company
        },
        {
          title: '收款金额(元)',
          align: 'left',
          dataIndex: 'inMoney',
          customRender: (text, record) => record.inMoney
        },
        {
          title: '收款比例',
          dataIndex: 'inPercent',
          customRender: (text, record) => record.inPercent
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
          label: '合同金额',
          prop: 'contractMoney',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
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
