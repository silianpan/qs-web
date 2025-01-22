<!-- 合同阶段提醒 -->
<template>
  <a-card :bordered="false">
    <!-- 数据表格 -->
    <s-table ref="table" size="default" rowKey="contractCode" :columns="columns" :data="loadData"> </s-table>
  </a-card>
</template>

<script lang="jsx">
import { contractStage } from '/src/api/eos/warn/warn.js'
import { STable } from '/src/components'

export default {
  name: 'WarnContractStage',
  components: {
    STable
  },
  data() {
    return {
      loadData: param => {
        return contractStage().then(res => {
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
          title: '合同阶段名称',
          dataIndex: 'contractStage',
          align: 'center'
        },
        {
          title: '合同阶段金额(元)',
          dataIndex: 'contractStageMoney',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '收款/支出(元)',
          dataIndex: 'realMoney',
          align: 'center',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '未收/未付(元)',
          dataIndex: 'resMoney',
          align: 'center',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '剩余到期天数',
          dataIndex: 'resDay',
          align: 'center'
        },
        {
          title: '阶段截止日期',
          dataIndex: 'endTime',
          align: 'center'
        }
      ]
    }
  }
}
</script>
