<!-- 商机详情 -->
<template>
  <div>
    <!-- <a-button-group>
      <a-button ghost type="primary" @click="handleUpdate(text, record, index)">编辑</a-button>
      <a-button ghost type="danger" @click="handleDelete(text, record, index)">删除</a-button>
    </a-button-group> -->
    <s-descriptions title="基本信息" :formItems="formItems" :formData="formData" />
    <a-card :bordered="false" size="small">
      <a-collapse expand-icon-position="right" :activeKey="['重要干系人','跟踪阶段']">
        <a-collapse-panel key="重要干系人" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">重要干系人</span>
          <s-table ref="tableLinkMan" size="default" rowKey="id" :columns="linkManColumns" :data="loadDataLinkMan" :show-pagination="false" />
        </a-collapse-panel>
        <a-collapse-panel key="跟踪阶段" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">跟踪阶段</span>
          <!-- <s-table ref="tableStage" size="default" rowKey="id" :columns="stageColumns" :data="loadDataStage" :show-pagination="false" /> -->
          <!-- 时间轴 -->
          <BusinessStage :stageList="stageList" />
        </a-collapse-panel>
      </a-collapse>
    </a-card>
  </div>
</template>

<script lang="jsx">
import { getBusiness } from '/src/api/eos/business/business.js'

import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'
import STable from '/src/components/Table/index.jsx'
import SDescriptions from '/src/components/Descriptions/index.jsx'
import BusinessStage from './BusinessStage.vue'

export default {
  name: 'BusinessDetail',
  components: {
    SDescriptions,
    STable,
    BusinessStage
  },
  props: {
    formId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      formData: {},
      linkManList: [],
      stageList: [],
      loadDataLinkMan: () => {
        return new Promise(resolve => resolve({ data: this.linkManList }))
      },
      // loadDataStage: () => {
      //   return new Promise(resolve => resolve({ data: this.stageList }))
      // },
      formItems: [
        {
          label: '商机名称',
          prop: 'name'
        },
        {
          label: '编号',
          prop: 'code'
        },
        {
          label: '商机描述',
          prop: 'remark'
        },
        {
          label: '跟踪状态',
          prop: 'businessState',
          customRender: text => {
            return <a-tag color="blue">{text}</a-tag>
          }
        },
        {
          label: '业主单位',
          prop: 'ownerUnit'
        },
        {
          label: '预估金额(元)',
          prop: 'amount',
          customRender: (text, record) => (text ? this.toThousandFilter(text) : text)
        },
        {
          label: '是否招投标',
          prop: 'bid'
        },
        {
          label: '资金来源',
          prop: 'fundSource'
        },
        {
          label: '预期利润率',
          prop: 'profitRate'
        },
        {
          label: '垫资金额(元)',
          prop: 'loaningScale',
          customRender: (text, record) => (text ? this.toThousandFilter(text) : text)
        },
        {
          label: '垫资时长',
          prop: 'loaningTime'
        },
        {
          label: '附件',
          prop: 'attachment',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        }
      ],
      // 重点干系人
      linkManColumns: [
        {
          title: '姓名',
          dataIndex: 'name',
          align: 'center'
        },
        {
          title: '联系方式',
          dataIndex: 'link',
          align: 'center'
        },
        {
          title: '角色',
          dataIndex: 'role',
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center'
        }
      ]
      // 跟踪阶段
      // stageColumns: [
      //   {
      //     title: '阶段名称',
      //     dataIndex: 'name',
      //     align: 'center'
      //   },
      //   {
      //     title: '记录时间',
      //     dataIndex: 'recordTime',
      //     align: 'center',
      //     customRender: text => moment(text).format('YYYY-MM-DD')
      //   },
      //   {
      //     title: '状态',
      //     dataIndex: 'state',
      //     align: 'center'
      //   },
      //   {
      //     title: '备注',
      //     dataIndex: 'remark',
      //     align: 'center'
      //   }
      // ]
    }
  },
  mounted() {
    // 查询明细
    getBusiness(this.formId).then(res => {
      this.formData = { ...res.data }
      this.linkManList = res.data.sealBusinessUsers || []
      this.stageList = res.data.sealBusinessStages || []
      this.$refs.tableLinkMan.refresh(true)
      // this.$refs.tableStage.refresh(true)
    })
  }
}
</script>
