<!-- 项目详细 -->
<template>
  <div>
    <s-descriptions title="基本信息" :formItems="formItems" :formData="row" />
    <!-- 数据表格 -->
    <a-card :bordered="false">
      <a-table :defaultExpandAllRows="true" :pagination="false" ref="table" rowKey="id" :columns="columns" :data-source="row.sealProjectProcesses"> </a-table>
    </a-card>
  </div>
</template>

<script>
import { SDescriptions } from '/src/components/index.js'

export default {
  name: 'ProcessDetail',
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
    SDescriptions
  },
  data() {
    return {
      formItems: [
        {
          label: '汇报编号',
          prop: 'code'
        },
        {
          label: '汇报人',
          prop: 'sysUser.nickName'
        },
        {
          label: '汇报时间',
          prop: 'createTime'
        },
        {
          label: '汇报周期(开始)',
          prop: 'startDate'
        },
        {
          label: '汇报周期(结束)',
          prop: 'endDate'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ],
      columns: [
        {
          title: '开始日期',
          dataIndex: 'beginDate',
          align: 'center'
        },
        {
          title: '完成日期',
          dataIndex: 'endDate',
          align: 'center'
        },
        {
          title: '项目',
          dataIndex: 'projectName',
          align: 'center'
        },
        {
          title: '所属阶段',
          dataIndex: 'stageName',
          align: 'center'
        },
        {
          title: '实际工作量(人/天)',
          dataIndex: 'workload',
          align: 'center'
        },
        {
          title: '工作描述',
          dataIndex: 'note'
        }
      ]
    }
  }
}
</script>
