<!-- 资金计划汇总详情 -->
<template>
  <div>
    <s-descriptions :title="title" :formItems="formItems" :formData="this.row" />
    <!-- （一）、项目本金现金流情况表 -->
    <h1>（一）、项目本金现金流情况表</h1>
    <s-table ref="fundstable" size="default" rowKey="id" :columns="fundscolumns" :data="fundsloadData" :show-pagination="false" :scroll="{ x: true }"> </s-table>
    <!-- （二）、项目收款情况表 -->
    <h1>（二）、项目收款情况表</h1>
    <s-table ref="CollectMoneytable" size="default" rowKey="id" :columns="CollectMoneycolumns" :data="CollectMoneyloadData" :show-pagination="false" :scroll="{ x: true }"> </s-table>
  </div>
</template>

<script lang="jsx">
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { SDescriptions, STable } from '/src/components/index.js'

export default {
  name: 'SummaryDetails',
  props: {
    formId: {
      type: Number,
      required: true
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    SDescriptions,
    STable
  },
  data() {
    return {
      dictKeys: [dictConfig.PROJECT_BUDGET_TYPE],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      dictMap: {},
      merchantList: [],
      title: '项目详情',
      formData: {},
      sealFundOutcomes: [],
      sealFundIncomes: [],
      formItems: [
        {
          label: '项目编号',
          prop: 'code',
          customRender: (text, record) => {
            return <a-tag color="cyan">{text}</a-tag>
          }
        },
        {
          label: '资金计划年月',
          prop: 'planTime',
          customRender: (text, record) => {
            const str = moment(text).format('YYYY-MM')
            return <a-tag color="red">{str}</a-tag>
          }
        },
        {
          label: '编制人',
          prop: 'sysUser',
          customRender: (text, record) => {
            return <a-tag color="purple">{text.nickName}</a-tag>
          }
        },
        {
          label: '负责区域或部门',
          prop: 'planDept',
          customRender: (text, record) => {
            return <a-tag color="orange">{text}</a-tag>
          }
        },
        {
          label: '审批状态',
          prop: 'status',
          customRender: (text, record) => {
            return <a-tag color="blue">{text}</a-tag>
          }
        },
        {
          label: '附件',
          prop: 'attachment',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        }
      ],
      fundscolumns: [
        {
          title: '#',
          dataIndex: 'id',
          width: 100,
          align: 'center',
          fixed: 'left',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '项目',
          dataIndex: 'projectName',
          align: 'center'
        },
        {
          title: '项目编号',
          dataIndex: 'projectCode',
          align: 'center'
        },
        {
          title: '支出类型',
          dataIndex: 'secondType',
          align: 'center'
        },
        {
          title: '金额(元)',
          dataIndex: 'money',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '付款单位',
          dataIndex: 'payer',
          align: 'center'
        },
        {
          title: '采购方式',
          dataIndex: 'payMethod',
          align: 'center'
        },
        {
          title: '收款单位',
          dataIndex: 'payee',
          align: 'center'
        },
        {
          title: '合同名称',
          dataIndex: 'contractName',
          align: 'center'
        },
        {
          title: '合同编号',
          dataIndex: 'contractCode',
          align: 'center'
        },
        {
          title: '合同内容',
          dataIndex: 'contractInfo',
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center'
        }
      ],
      fundsloadData: param => {
        return new Promise(resolve => {
          resolve({
            data: this.sealFundOutcomes
          })
        })
      },
      CollectMoneycolumns: [
        {
          title: '#',
          dataIndex: 'id',
          width: 100,
          align: 'center',
          fixed: 'left',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '项目',
          dataIndex: 'projectName',
          align: 'center'
        },
        {
          title: '项目编号',
          dataIndex: 'projectCode',
          align: 'center'
        },
        {
          title: '本月开票金额(元)',
          dataIndex: 'thisMoney',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '所属公司',
          dataIndex: 'company',
          align: 'center'
        },
        {
          title: '合同名称',
          dataIndex: 'contractName',
          align: 'center'
        },
        {
          title: '合同编号',
          dataIndex: 'contractCode',
          align: 'center'
        },
        {
          title: '合同金额(元)',
          dataIndex: 'contractMoney',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '计划收款比例(%)',
          dataIndex: 'inPercent',
          align: 'center'
        },
        {
          title: '计划收款金额(元)',
          dataIndex: 'inMoney',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center'
        }
      ],
      CollectMoneyloadData: param => {
        return new Promise(resolve => {
          resolve({
            data: this.sealFundIncomes
          })
        })
      }
    }
  },
  created() {
    this.sealFundOutcomes = this.row.sealFundOutcomes || []
    this.sealFundIncomes = this.row.sealFundIncomes || []
    // 查询字典
    this.dictKeys.forEach(key => {
      this.getDicts(key).then(res => {
        this.$set(this.dictMap, key, res.data)
      })
    })
  }
}
</script>
<style lang="less" scoped>
h1 {
  text-align: center;
  font-size: 18px;
  font-weight: 700;
}
@import '/src/assets/style/scroll.less';
</style>
