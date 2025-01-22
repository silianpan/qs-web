<!-- 采购综合查询 -->
<template>
  <page-header-wrapper v-if="!projectId" :breadcrumb="false">
    <a-card :bordered="false">
      <!-- 查询表单，若无数据，不展示 -->
      <s-search
        placeholder="搜索此列表..."
        clickTips="搜索项目名称、申请单号、采购事由"
        @onSearch="onSearch"
        @clickquery="clickquery"
        @reset="() => (this.queryParam = { isAsc: 'desc', orderByColumn: 'create_time' })"
        :formItems="searchFormItems"
        :formData="queryParam"
      />
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
        <!-- <span slot="action" slot-scope="text, record">
          {{ text }}
        </span> -->
      </s-table>
    </a-card>
  </page-header-wrapper>
  <a-card v-else :bordered="false">
    <!-- 查询表单，若无数据，不展示 -->
    <s-search
      placeholder="搜索此列表..."
      clickTips="搜索项目名称、申请单号、采购事由"
      @onSearch="onSearch"
      @clickquery="clickquery"
      @reset="() => (this.queryParam = { isAsc: 'desc', orderByColumn: 'create_time' })"
      :formItems="searchFormItems"
      :formData="queryParam"
    />
    <!-- 数据表格 -->
    <no-data v-show="noData" />
    <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
      <!-- <span slot="action" slot-scope="text, record">
          {{ text }}
        </span> -->
    </s-table>
  </a-card>
</template>

<script lang="jsx">
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { listAll, purchaseList } from '/src/api/eos/purchase/purchase.js'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import detail from './detail.vue'

export default {
  name: 'Payment',
  components: {
    SSearch,
    STable
  },
  props: {
    projectId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      rowClick: record => ({
        on: {
          click: () => {
            this.handleDetail(record, record.id)
          }
        },
        style: {
          cursor: 'pointer'
        }
      }),
      /* 是否有数据 */
      noData: false,
      dictKeys: [dictConfig.PROJECT_UNIT, dictConfig.PROJECT_INVOICE_TYPE],
      dictMap: {},
      merchantList: [],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listAll(Object.assign({}, param, this.queryParam, { projectId: this.projectId })).then(res => {
          this.noData = res.total === 0
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
          label: '申请人',
          prop: 'nickName'
        },
        {
          type: 'input',
          label: '项目名称',
          prop: 'projectName'
        }
      ],
      columns: [
        // {
        //   title: '申请单号',
        //   align: 'left',
        //   dataIndex: 'code'
        // },
        {
          title: '项目/部门',
          align: 'left',
          dataIndex: 'sealProject.name',
          customRender: (text, record) => {
            return record.sealProject ? (
              <Ellipsis length={64} tooltip>
                {record.sealProject.name}
              </Ellipsis>
            ) : (
              <Ellipsis length={64} tooltip>
                {record.dept.deptName}
              </Ellipsis>
            )
          }
        },
        {
          title: '合同名称',
          align: 'left',
          dataIndex: 'sealContract.name'
        },
        {
          title: '附件',
          dataIndex: 'attachment',
          align: 'left',
          customRender: (text, record) => {
            return <s-doc-list text={text} />
          }
        },
        {
          title: '采购事由',
          align: 'left',
          dataIndex: 'remark',
          // width: 80,
          customRender: text => {
            return text ? (
              <Ellipsis length={20} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          align: 'left',
          customRender: (text, record) => {
            return <AuditStatusTag clickable state={text} instanceId={record.sealWorkflow.instanceId} />
          }
        },
        {
          title: '申请人',
          align: 'left',
          dataIndex: 'sealWorkflow.applyUserName'
        },
        {
          title: '申请时间',
          align: 'left',
          dataIndex: 'sealWorkflow.applyTime',
          customRender: text => {
            if (text) {
              return moment(text).format('MM-DD HH:mm')
            } else {
              return ''
            }
          }
        },
        {
          title: '当前任务',
          align: 'left',
          dataIndex: 'sealWorkflow.taskName'
        }
      ]
    }
  },
  created() {
    // 查询字典
    this.dictKeys.forEach(key => {
      this.getDicts(key).then(res => {
        this.$set(this.dictMap, key, res.data)
      })
    })
  },
  methods: {
    /* 查询按钮 */
    clickquery(param) {
      this.queryParam = { ...this.queryParam, orderByColumn: param }
      this.refresh()
    },
    /* 查询按钮 */
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    },
    // 刷新页面
    refresh() {
      this.$refs.table.refresh(true)
    },
    /** 详情 */
    handleDetail(row, formId) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '采购申请详情',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: detail,
          props: {
            row,
            formId
          }
        }
      })
    }
  }
}
</script>
