<!-- 保证金提醒 -->
<template>
  <a-card :bordered="false">
    <!-- 数据表格 -->
    <s-table ref="table" size="default" rowKey="code" :columns="columns" :data="loadData"> </s-table>
  </a-card>
</template>

<script lang="jsx">
import { earnestList } from '/src/api/eos/warn/warn.js'
import { STable } from '/src/components'

export default {
  name: 'WarnEarnest',
  components: {
    STable
  },
  data() {
    return {
      loadData: param => {
        return earnestList().then(res => {
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
          title: '所属招投标',
          dataIndex: 'name',
          align: 'center'
        },
        {
          title: '申请单编号',
          dataIndex: 'code',
          align: 'center'
        },
        {
          title: '保证金类型',
          dataIndex: 'type',
          align: 'center'
        },
        {
          title: '归还金额(元)',
          dataIndex: 'money',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '归还时间',
          dataIndex: 'reTime',
          align: 'center'
        },
        {
          title: '剩余归还天数',
          dataIndex: 'resDay',
          align: 'center'
        }
      ]
    }
  }
}
</script>
