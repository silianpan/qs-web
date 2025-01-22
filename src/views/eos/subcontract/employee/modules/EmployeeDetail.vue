<!-- 零星用工付款详细 -->
<template>
  <div>
    <s-descriptions :title="title" :formItems="formItems" :formData="row" />
    <a-card :bordered="false" size="small">
      <a-collapse expand-icon-position="right" defaultActiveKey="零星用工清单">
        <a-collapse-panel key="零星用工清单" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">零星用工清单</span>
          <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :showPagination="false" />
        </a-collapse-panel>
      </a-collapse>
    </a-card>
  </div>
</template>

<script lang="jsx">
import { SDescriptions, STable } from '/src/components/index.js'
import { previewDoc } from '/src/components/Office/office.js'
import { getEmployee } from '/src/api/eos/subcontract/employee.js'

export default {
  name: 'EmployeeDetail',
  props: {
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
      title: '零星用工付款详情',
      formItems: [
        {
          label: '申请人',
          prop: 'sysUser.nickName'
        },
        {
          label: '所属项目',
          prop: 'sealProject.name'
        },
        {
          label: '编号',
          prop: 'code'
        },
        {
          label: '结算总金额',
          prop: 'sum'
        },
        {
          label: '申请时间',
          prop: 'createTime'
        },
        {
          label: '备注',
          prop: 'remark'
        },
        {
          label: '附件',
          prop: 'attachment',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        }
      ],
      columns: [
        {
          title: '名称',
          dataIndex: 'description',
          align: 'center'
        },
        {
          title: '人数',
          dataIndex: 'personNum',
          align: 'center'
        },
        {
          title: '每日工资',
          dataIndex: 'days',
          align: 'center'
        },
        {
          title: '每日金额(元)',
          dataIndex: 'moneyDay',
          align: 'left'
        },
        {
          title: '应付',
          dataIndex: 'money',
          align: 'center'
        },
        {
          title: '实际支付',
          dataIndex: 'moneyReal',
          align: 'center'
        }
      ],
      loadData: param => {
        return getEmployee(this.row.id).then(res => {
          return {
            data: res.data.sealEmployees,
            totalCount: res.data.sealEmployees.length
          }
        })
      }
    }
  },
  methods: {
    handlePreviewDoc(doc) {
      previewDoc(doc.name, doc.url)
    }
  }
}
</script>
