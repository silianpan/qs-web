<!-- 保证金申请单号对应的退还列表个人 -->
<template>
  <a-card :bordered="false" size="small">
    <a-collapse expand-icon-position="right" :defaultActiveKey="title">
      <a-collapse-panel :key="title" class="custom-collapse-panel">
        <span slot="header" class="custom-collapse-panel-header">{{ title }}</span>
        <s-table ref="table" :customRow="rowClick" size="default" rowKey="id" :columns="columns" :data="loadData">
          <span slot="action" slot-scope="text, record">
            <a-button-group>
              <a-button type="link" @click="handleDelete(record)" style="color: #ff0000">
                <a-icon type="delete" />
                删除
              </a-button>
            </a-button-group>
          </span>
        </s-table>
      </a-collapse-panel>
    </a-collapse>
  </a-card>
</template>

<script lang="jsx">
import { listReturn, delReturn } from '/src/api/eos/earnest/earnestReturn.js'
import { STable } from '/src/components/index.js'
import ReturnDetail from '/src/views/eos/earnest/return/modules/ReturnDetail.vue'

export default {
  name: 'returnList',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  components: {
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
      title: '保证金退还列表',
      dictKeys: [],
      dictMap: {},
      selectedRowKeys: [],
      selectedRows: [],
      // applyCode: '',
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'createTime',
        createBy: this.$store.getters.userName,
        applyCode: this.row.code
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listReturn(Object.assign({}, param, this.queryParam)).then(res => {
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
          title: '退还单号',
          dataIndex: 'code',
          align: 'center'
        },
        {
          title: '保证金类型',
          dataIndex: 'sealDepositApply.depositType',
          align: 'center'
        },
        {
          title: '保证金金额(元)',
          dataIndex: 'sealDepositApply.depositMoney',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '退还金额(元)',
          dataIndex: 'returnMoney',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '未退还金额(元)',
          dataIndex: 'payMoney',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '操作',
          align: 'center',
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
    // 刷新页面
    refresh() {
      this.$refs.table.refresh(true)
    },
    reset() {
      this.queryParam = {}
    },
    /** 详情 */
    handleDetail(row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '保证金退还详情',
          width: '50%',
          maskClosable: true
        },
        content: {
          template: ReturnDetail,
          props: {
            row
          }
        }
      })
    },
    /** 删除退还 */
    handleDelete(record) {
      this.$antdconfirm({
        title: '删除退还',
        content: '是否删除金额为：' + record.returnMoney + ' 的退还单',
        onOk: () => {
          delReturn(record.id).then(res => {
            this.$message.success('删除成功')
            this.refresh()
          })
        }
      })
    }
  }
}
</script>
