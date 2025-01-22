<!-- 开票历史 -->
<template>
  <div>
    <a-card :bordered="false">
      <!-- 查询表单，若无数据，不展示 -->
      <s-search placeholder="搜索此列表..." clickTips="搜索项目名称" @onSearch="onSearch" />
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
import moment from 'moment'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import { listMake } from '/src/api/eos/invoice/make.js'
import MakeFormDetail from '/src/views/eos/invoice/make/details.vue'

export default {
  props: {
    selectType: {
      type: String,
      default: 'checkbox'
    },
    projectName: {
      type: String,
      default: null
    }
  },
  name: 'SelectMake',
  components: {
    SSearch,
    STable
  },
  data() {
    return {
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
        {
          type: 'input',
          label: '合同名称',
          prop: 'contractName'
        },
        {
          type: 'datePicker',
          label: '开票时间',
          prop: 'makeTime'
        }
      ],
      columns: [
        {
          title: '申请单号',
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
        {
          title: '申请人',
          dataIndex: 'sysUser.nickName',
          align: 'center'
        },
        {
          title: '开票单位',
          dataIndex: 'makeUnit',
          align: 'center',
          customRender: text => {
            return text ? (
              <Ellipsis length={24} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          title: '本次开票金额(元)',
          dataIndex: 'thisMoney',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
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
              <Ellipsis length={24} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          title: '合同名称',
          dataIndex: 'contractName',
          align: 'center',
          customRender: text => {
            return text ? (
              <Ellipsis length={24} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        // {
        //   title: '开票类型',
        //   dataIndex: 'type',
        //   align: 'center'
        // },
        {
          title: '当前税率(%)',
          dataIndex: 'taxRate',
          align: 'center'
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
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
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
    handleOk() {
      this.$emit('ok', this.selectedRows, this.selectedRowKeys)
      this.$emit('close')
    },
    handleCancel() {
      this.$emit('cancel')
      this.$emit('close')
    },
    /* 查询按钮 */
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    },
    // 刷新页面
    refresh() {
      this.$refs.table.refresh()
    }
  },
  mounted() {
    this.onSearch(this.projectName)
  }
}
</script>
