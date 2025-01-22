<!-- 财务主管 -->
<template>
  <div class="dashboard">
    <TreasurerStatistics />
    <a-row :gutter="[8, 8]">
      <a-col :span="24">
        <Todo />
      </a-col>
    </a-row>
    <a-row :gutter="[8, 8]">
      <a-col :span="24">
        <LineInoutTotal />
      </a-col>
    </a-row>
    <a-row :gutter="[8, 8]">
      <a-col :span="24">
        <GroupingHistogram ref="PMProjectGroup" title="合同支出分类汇总" />
      </a-col>
    </a-row>
    <a-row :gutter="[8, 8]">
      <a-col :span="24">
        <ProjectPaymentTab ref="PMProjectTable" title="支出合同汇总" :data="loadData" :columns="columnsList" id="contractName" />
      </a-col>
    </a-row>
  </div>
</template>

<script lang="jsx">
import Todo from '../components/todo/index.vue'
import TreasurerStatistics from '../components/finance/TreasurerStatistics.vue'
import ProjectPaymentTab from '../components/salesExecutiveModule/ProjectPaymentTab'
import GroupingHistogram from '/src/views/dashboard/components/project/GroupingHistogram.vue'
import LineInoutTotal from '../components/finance/LineInoutTotal.vue'
import { PMProjectGroup, PMProjectTable } from '../../../api/dashboard/PM'
import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'
import moment from 'moment'

export default {
  components: {
    Todo,
    TreasurerStatistics,
    ProjectPaymentTab,
    GroupingHistogram,
    LineInoutTotal
  },
  data() {
    return {
      loadData: param => {
        return PMProjectTable(Object.assign({}, param, this.queryParam, { createTime: moment().format('YYYY') })).then(res => {
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      columnsList: [
        {
          title: '合同名称',
          dataIndex: 'contractName',
          align: 'center',
          customRender: (text, record) => {
            return (
              <Ellipsis length={20} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          align: 'center',
          customRender: (text, record) => {
            return (
              <Ellipsis length={20} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '供应商',
          dataIndex: 'supplier',
          align: 'center',
          customRender: (text, record) => {
            return (
              <Ellipsis length={20} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '合同总金额',
          dataIndex: 'contractSum',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '合同付款',
          dataIndex: 'contractPay',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '结算中金额',
          dataIndex: 'settlement',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '未付金额',
          dataIndex: 'unPay',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '合同付款比例',
          dataIndex: 'ratio',
          align: 'center',
          customRender: text => {
            text = Math.round(text * 10000) / 100
            text += '%'
            return <span>{{ text }}</span>
          }
        }
      ]
    }
  },
  created() {
    PMProjectGroup().then(res => {
      res.data.forEach(item => {
        item.money = item.money == null ? 0 : item.money
      })
      this.$refs.PMProjectGroup.initData(res.data || [])
    })
  }
}
</script>

<style lang="less" scoped>
.dashboard {
  overflow: hidden;
}
</style>
