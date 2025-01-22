<!-- 发票查询 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <!-- 查询表单，若无数据，不展示 -->
      <s-search placeholder="搜索此列表..." clickTips="搜索报销人、报销单号、发票号码/单位/金额" @onSearch="onSearch" />
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :rowSelection="rowSelection">
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import { listInvoice, delInvoice, exportInvoice } from '/src/api/eos/invoice/invoice.js'
import { expensegetOne } from '/src/api/eos/expense/expense.js'
import { SSearch, STable } from '/src/components/index.js'
import InvoiceForm from './modules/InvoiceForm.vue'
import { previewDoc } from '/src/components/Office/office.js'
import expenseDetail from '/src/views/eos/expense/details.vue'

export default {
  name: 'Invoice',
  components: {
    SSearch,
    STable
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
        return listInvoice(Object.assign({}, param, this.queryParam)).then(res => {
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
          label: '发票代码',
          prop: 'invoiceCode'
        },
        {
          type: 'input',
          label: '发票号码',
          prop: 'invoiceNum'
        },
        {
          type: 'input',
          label: '机器号码',
          prop: 'machineCode'
        },
        {
          type: 'input',
          label: '发票单位',
          prop: 'purchaserName'
        },
        {
          type: 'input',
          label: '发票金额',
          prop: 'amountInFiguers',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        }
      ],
      columns: [
        {
          title: '报销编号',
          dataIndex: 'busCode',
          align: 'left'
        },
        {
          title: '报销人',
          dataIndex: 'sysUser.nickName',
          align: 'left'
        },
        {
          title: '发票代码',
          dataIndex: 'invoiceCode',
          align: 'left'
        },
        {
          title: '发票号码',
          dataIndex: 'invoiceNum',
          align: 'left'
        },
        {
          title: '机器号码',
          dataIndex: 'machineCode',
          align: 'left'
        },
        {
          title: '发票单位',
          dataIndex: 'purchaserName',
          align: 'left'
        },
        {
          title: '发票金额(元)',
          dataIndex: 'amountInFiguers',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '附件',
          dataIndex: 'attachment',
          align: 'left',
          customRender: (text, record) => {
            if (!text) return
            return (
              <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => previewDoc(record.invoiceNum, text)}>
                {record.invoiceNum + '.' + text.substring(text.lastIndexOf('.'))}
              </span>
            )
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'left'
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
    /** 修改按钮操作 */
    handleUpdate(row) {},
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除发票管理编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delInvoice(ids).then(() => {
            this.$refs.table.refresh(true)
            this.$message.success('删除成功', 3)
          })
        }
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParam = this.queryParam
      this.$antdconfirm({
        title: '导出',
        content: '是否确认导出所有发票管理数据项?',
        onOk: () => {
          return exportInvoice(queryParam).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /** 详情 */
    async handleDetail(_row, formId) {
      const res = await expensegetOne({ code: _row.busCode })
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '报销单详情',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: expenseDetail,
          props: {
            row: res.data,
            formId
          }
        }
      })
    },
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
    }
  }
}
</script>
