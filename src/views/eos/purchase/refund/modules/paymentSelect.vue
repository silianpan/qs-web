<!-- 关联付款申请 -->
<template>
  <div>
    <a-card :bordered="false">
      <!-- 查询表单，若无数据，不展示 -->
      <s-search placeholder="搜索此列表..." clickTips="搜索项目名称、合同名称、申请单号、付款金额" @onSearch="onSearch" />
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :row-selection="{ type: selectType, selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData"> </s-table>
    </a-card>
    <div class="bottom-control">
      <a-space>
        <a-button type="primary" @click="handleOk">确定</a-button>
        <a-button @click="handleCancel">取 消</a-button>
      </a-space>
    </div>
  </div>
</template>

<script lang="jsx">
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import { contractPayment } from '/src/api/eos/purchase/payment.js'
import PaymentDetail from '/src/views/eos/purchase/payment/detail.vue'

export default {
  props: {
    selectType: {
      type: String,
      default: 'checkbox'
    },
    projectId: {
      type: Number,
      required: true
    }
  },
  name: 'PaymentSelect',
  components: {
    SSearch,
    STable
  },
  data() {
    return {
      /* 是否有数据 */
      noData: false,
      selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return contractPayment(Object.assign({}, param, this.queryParam, { projectId: this.projectId, state: '0' })).then(res => {
          this.noData = res.total === 0
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
          title: '申请单号',
          dataIndex: 'code',
          align: 'center',
          customRender: (text, record) => {
            return (
              <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleDetail(record)}>
                {text}
              </span>
            )
          }
        },
        // {
        //   title: '付款单位',
        //   dataIndex: 'company',
        //   align: 'center',
        //   customRender: text => {
        //     return (
        //       <Ellipsis length={18} tooltip>
        //         {text}
        //       </Ellipsis>
        //     )
        //   }
        // },
        {
          title: '收款单位',
          dataIndex: 'sealMerchant.name',
          align: 'center',
          customRender: text => {
            return (
              <Ellipsis length={18} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        // {
        //   title: '发票类型',
        //   dataIndex: 'invoiceType',
        //   align: 'center',
        //   customRender: text => {
        //     const ret = this.selectDictItem(this.dictMap[dictConfig.PROJECT_INVOICE_TYPE], text)
        //     return <a-tag color={ret.listClass}>{ret.dictLabel}</a-tag>
        //   }
        // },
        // {
        //   title: '是否已经开具发票',
        //   dataIndex: 'invoiceHas',
        //   align: 'center',
        //   customRender: text => {
        //     return <a-tag color={text === '已开' ? 'green' : 'orange'}>{text}</a-tag>
        //   }
        // },
        {
          title: '付款事由说明',
          dataIndex: 'reason',
          align: 'center',
          customRender: text => {
            return (
              <Ellipsis length={18} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '项目编号',
          dataIndex: 'sealProject.code',
          align: 'center'
        },
        {
          title: '项目名称',
          dataIndex: 'sealProject.name',
          align: 'center',
          customRender: text => {
            return (
              <Ellipsis length={18} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '合同编号',
          dataIndex: 'sealContract.code',
          align: 'center'
        },
        {
          title: '合同名称',
          dataIndex: 'sealContract.name',
          align: 'center',
          customRender: text => {
            return (
              <Ellipsis length={18} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '本次付款金额(元)',
          dataIndex: 'payMoney',
          align: 'left'
        }
      ]
    }
  },

  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /** 详情 */
    handleDetail(row, formId) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '付款申请详情',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: PaymentDetail,
          props: {
            title: '付款申请详情',
            row,
            formId
          }
        }
      })
    },
    handleOk() {
      this.$emit('ok', this.selectedRows, this.selectedRowKeys)
      this.$emit('close')
    },
    handleCancel() {
      this.$emit('ok')
      this.$emit('close')
    },
    /* 查询按钮 */
    clickquery(param, index) {
      this.current = index
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
    }
  },
  created() {}
}
</script>
