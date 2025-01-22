<!-- 开票历史页面 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <!-- 查询表单，若无数据，不展示 -->
      <s-search placeholder="搜索此列表..." :queryList="queryList" @clickquery="clickquery" clickTips="搜索项目名称、申请单号、预算金额/时间" @onSearch="onSearch" />
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :rowSelection="rowSelection">
        <span slot="action" slot-scope="text, record">
          <a-button type="link" @click.stop="adjustment(text, record)" style="margin-right: 10px">
            <a-icon type="edit" />
            调整
          </a-button>
          <a-button type="link" @click.stop="handleExport(text, record)" style="color: #483d8b">
            <a-icon type="download" />
            导出
          </a-button>
        </span>
      </s-table>
    </a-card>
    <a-modal title="调整税率(%)" :visible="visible" :antdconfirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
      <a-input placeholder="请输入税率" v-model="taxRateValue" style="width: 100%" />
    </a-modal>
  </page-header-wrapper>
</template>

<script lang="jsx">
import moment from 'moment'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import { exportMake } from '/src/api/eos/invoice/history.js'
import { listMake } from '/src/api/eos/invoice/make.js'
import MakeFormDetail from '/src/views/eos/invoice/make/details.vue'
import { updateMake } from '/src/api/eos/invoice/make.js'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  name: 'Billinghistory',
  components: {
    STable,
    SSearch
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
      queryList: [
        { text: '未收款', query: 'ratio' },
        { text: '已收款', query: 'AllRatio' }
      ],
      /* 是否有数据 */
      noData: false,
      visible: false,
      confirmLoading: false,
      sealInvoiceMake: {}, // 调整税率对象集合
      taxRateValue: '', // 税率
      dictKeys: [],
      dictMap: {},
      selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        const QueryParams = { ...this.queryParam }
        if (!this.isEmpty(QueryParams.makeTime)) {
          QueryParams.makeTime = moment(QueryParams.makeTime).format('YYYY-MM-DD')
        }
        return listMake(Object.assign({}, param, QueryParams)).then(res => {
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
          label: '项目名称',
          prop: 'projectName'
        },
        {
          type: 'input',
          label: '申请单号',
          prop: 'code'
        },
        {
          type: 'input',
          label: '申请人',
          prop: 'nickName'
        },
        {
          type: 'input',
          label: '开票单位',
          prop: 'makeUnit'
        },
        // {
        //   type: 'input',
        //   label: '合同名称',
        //   prop: 'contractName'
        // },
        {
          type: 'datePicker',
          label: '开票时间',
          prop: 'makeTime'
        }
      ],
      columns: [
        // {
        //   title: '申请单号',
        //   dataIndex: 'code',
        //   align: 'center'
        // },
        {
          title: '申请人',
          dataIndex: 'sysUser.nickName',
          align: 'center'
        },
        {
          title: '实际收款进度',
          dataIndex: 'ratio',
          align: 'center',
          customRender: (text, record) => {
            if (!this.isEmpty(text)) {
              return <a-progress width={80} type="circle" percent={text} status="active" stroke-color={{ '0%': '#108ee9', '100%': '#87d068' }} />
              //   return <a-progress percent={text} />
            }
          }
        },
        {
          title: '开票时间',
          dataIndex: 'makeTime',
          align: 'center',
          customRender: text => moment(text).format('MM-DD HH:mm')
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          align: 'center',
          customRender: text => {
            return text ? (
              <Ellipsis length={18} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          title: '状态',
          dataIndex: 'state',
          align: 'center',
          customRender: (text, record) => {
            return <AuditStatusTag clickable state={text} />
          }
        },
        {
          title: '当前税率(%)',
          dataIndex: 'taxRate',
          align: 'center'
        },
        {
          title: '开票金额(元)',
          dataIndex: 'thisMoney',
          align: 'left'
        },
        {
          title: '操作',
          align: 'center',
          width: 160,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
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
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /** 导出按钮操作 */
    handleExport(text, record) {
      this.$antdconfirm({
        title: '导出',
        content: '是否确认导出开票数据项?',
        onOk: () => {
          return exportMake(record.id).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /** 详情 */
    handleDetail(row, formId) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '开票详情',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: MakeFormDetail,
          props: {
            title: '开票详情',
            row,
            formId
          }
        }
      })
    },
    // 调整
    adjustment(text, record) {
      this.visible = true
      this.sealInvoiceMake = text
    },
    // 税率弹框确认
    handleOk() {
      this.sealInvoiceMake.taxRate = this.taxRateValue
      updateMake(this.sealInvoiceMake).then(res => {
        this.$message.success('调整成功!')
        this.$refs.table.refresh(true)
        this.sealInvoiceMake = {}
        this.taxRateValue = null
        this.visible = false
      })
    },
    // 税率弹框关闭
    handleCancel() {
      this.visible = false
      this.$refs.table.refresh(true)
      this.sealInvoiceMake = {}
      this.taxRateValue = null
    },
    /* 查询按钮 */
    clickquery(param) {
      this.queryParam = {
        isAsc: 'desc',
        orderByColumn: 'create_time'
      }
      const arr = param.split(',')
      const ans = arr.filter(item => item === 'ratio' || item === 'AllRatio')
      if (ans.length > 1) {
        this.$message.warning('未收款和已收款只能选一个!')
        return
      }
      const obj = param === 'ratio' ? { ratio: param } : { AllRatio: param }
      this.queryParam = { ...this.queryParam, ...obj }
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
    }
  }
}
</script>
