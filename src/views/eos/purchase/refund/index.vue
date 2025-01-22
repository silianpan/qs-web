<!-- 退款管理 -->
<template>
  <a-card :bordered="false">
    <div class="table-header-btns">
      <a-button ghost type="primary" @click="handleAdd">新增</a-button>
      <!-- 查询表单，若无数据，不展示 -->
      <s-search placeholder="搜索此列表..." clickTips="搜索日期" @onSearch="onSearch" />
    </div>
    <!-- 数据表格 -->
    <no-data v-show="noData" />
    <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
      <span slot="action" slot-scope="text, record">
        <a-button type="link" @click.stop="_handleDelete(text, record)" style="color: red">
          <a-icon type="close-circle" />
          删除
        </a-button>
      </span>
    </s-table>
  </a-card>
</template>

<script lang="jsx">
import moment from 'moment'
import { reFundList, deleteRefund } from '/src/api/eos/purchase/refund.js'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import refundForm from './modules/refundForm'
import paymentDetail from '/src/views/eos/purchase/payment/detail.vue'

export default {
  name: 'ReFund',
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
        orderByColumn: 'createTime'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return reFundList(Object.assign({}, param, this.queryParam)).then(res => {
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
          title: '退款编号',
          dataIndex: 'code',
          align: 'left'
        },
        {
          title: '退款金额(元)',
          dataIndex: 'payMoney',
          align: 'left'
        },
        {
          title: '合同名称',
          dataIndex: 'contractName',
          align: 'left',
          customRender: (text, record) => {
            return (
              <Ellipsis length={18} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '退款时间',
          dataIndex: 'createTime',
          align: 'left',
          customRender: text => moment(text).format('MM-DD HH:mm')
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          align: 'left',
          customRender: (text, record) => {
            return (
              <Ellipsis length={15} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '退款类型',
          dataIndex: 'refundState',
          align: 'left'
        },
        {
          title: '操作',
          width: 160,
          align: 'left',
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
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '新增退款',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: refundForm,
          on: {
            ok: () => {
              this.refresh()
            },
            close: () => {
              this.refresh()
            }
          }
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const updateRow = { ...row }
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '修改退款',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: refundForm,
          props: {
            isUpdate: true,
            updateRow
          },
          on: {
            ok: () => {
              this.$refs.table.refresh(true)
            }
          }
        }
      })
    },
    /** 详情 */
    handleDetail(row, formId) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '退款详情',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: paymentDetail,
          props: {
            row,
            formId,
            isRefund: true
          }
        }
      })
    },
    /* 删除 */
    _handleDelete(row) {
      const ids = row.code
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除借款编号为"' + ids + '"的数据项?',
        onOk: () => {
          return deleteRefund(ids).then(() => {
            this.$refs.table.refresh(true)
            this.$message.success('删除成功', 3)
          })
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
  },
  mounted() {}
}
</script>
