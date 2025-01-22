<!-- 项目详细 -->
<template>
  <div>
    <s-descriptions title="基本信息" :formItems="formItems" :formData="row" />
    <!-- 数据表格 -->
    <a-card :bordered="false" size="small">
      <a-collapse expand-icon-position="right" defaultActiveKey="阶段">
        <a-collapse-panel key="阶段" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">阶段</span>
          <a-table :defaultExpandAllRows="true" :pagination="false" ref="table" rowKey="id" :columns="columns" :data-source="row.stageList"> </a-table>
        </a-collapse-panel>
      </a-collapse>
    </a-card>
  </div>
</template>

<script>
import { SDescriptions } from '/src/components/index.js'

export default {
  name: 'ScheduleDetail',
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
          label: '计划编号',
          prop: 'code'
        },
        {
          label: '创建人',
          prop: 'sysUser.nickName'
        },
        {
          label: '项目名称',
          prop: 'sealProject.name'
        },
        {
          label: '创建时间',
          prop: 'createTime'
        },
        {
          label: '预估工作总量(人/天)',
          prop: 'total'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ],
      columns: [
        {
          title: '#',
          dataIndex: 'level'
        },
        {
          title: '阶段',
          dataIndex: 'name'
        },
        {
          title: '描述',
          dataIndex: 'note'
        },
        {
          title: '计划开始日期',
          dataIndex: 'beginDate'
        },
        {
          title: '计划完成日期',
          dataIndex: 'endDate'
        },
        {
          title: '预估工作量(人/天)',
          dataIndex: 'workload',
          customRender: text => {
            if (!text) return '--'
            else return text
          }
        }
      ]
    }
  },
  created() {}
}
</script>
