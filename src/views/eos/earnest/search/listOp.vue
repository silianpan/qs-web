<!-- 保证金申请单号对应的退还列表(无操作列) -->
<template>
  <a-card :bordered="false" size="small">
    <a-collapse expand-icon-position="right" :defaultActiveKey="title">
      <a-collapse-panel :key="title" class="custom-collapse-panel">
        <span slot="header" class="custom-collapse-panel-header">{{ title }}</span>
        <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" />
      </a-collapse-panel>
    </a-collapse>
  </a-card>
</template>

<script lang="jsx">
import { listReturn } from '/src/api/eos/earnest/earnestReturn.js'
import { STable, Ellipsis } from '/src/components/index.js'
import ReturnDetail from '/src/views/eos/earnest/return/modules/ReturnDetail.vue'

export default {
  name: 'Return',
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
      searchFormItems: [],
      /* 查询列表 */
      queryList: [
        { text: '按时间', query: 'create_time' },
        { text: '按类型', query: 'depositType' }
      ],
      columns: [
        {
          title: '退还单号',
          dataIndex: 'code',
          align: 'center',
          customRender: (text, record) => {
            return (
              <span style="color:#348EE4;cursor:pointer" onClick={() => this.handleDetail(record, record.id)}>
                {text}
              </span>
            )
          }
        },
        // {
        //   title: '保证金申请单',
        //   dataIndex: 'sealDepositApply.code',
        //   align: 'center'
        // },
        // {
        //   title: '项目名称',
        //   dataIndex: 'sealProject.name',
        //   align: 'center',
        //   customRender: text => {
        //     return (
        //       <Ellipsis length={15} tooltip>
        //         {text}
        //       </Ellipsis>
        //     )
        //   }
        // },
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
          title: '备注',
          dataIndex: 'remark',
          align: 'center',
          customRender: text => {
            return (
              <Ellipsis length={15} tooltip>
                {text}
              </Ellipsis>
            )
          }
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
          width: '60%',
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
    /* 查询按钮 */
    clickquery(param) {
      this.queryParam = { ...this.queryParam, orderByColumn: param }
      this.refresh()
    },
    /* 查询按钮 */
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    }
  }
}
</script>
