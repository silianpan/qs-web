<!-- 计划收入提醒 -->

<template>
  <a-card :bordered="false">
    <!-- 数据表格 -->
    <s-table ref="table" size="default" rowKey="contractCode" :columns="columns" :data="loadData"> </s-table>
  </a-card>
</template>

<script>
import { planIn } from '/src/api/eos/warn/warn.js'
import STable from '/src/components/Table/index.jsx'

export default {
  name: 'WarnPlanIn',
  components: {
    STable
  },
  data() {
    return {
      loadData: param => {
        return planIn().then(res => {
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      columns: [
        {
          title: '项目编号',
          dataIndex: 'projectCode',
          align: 'center'
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
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
          title: '合同类型',
          dataIndex: 'contractType',
          align: 'center'
        },
        {
          title: '计划收款金额(元)',
          dataIndex: 'planMoney',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '实际收款金额(元)',
          dataIndex: 'realMoney',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '剩余未收款金额(元)',
          dataIndex: 'resMoney',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        }
      ]
    }
  }
}
</script>
