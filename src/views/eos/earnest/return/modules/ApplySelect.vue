<!-- 保证金申请列表 -->
<template>
  <div>
    <a-card :bordered="false">
      <!-- 查询表单，若无数据，不展示 -->
      <s-search placeholder="搜索此列表..." clickTips="搜索项目名称、保证金类型/金额/退还时间、备注" @onSearch="onSearch" />
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :row-selection="{ type: selectType, selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData"></s-table>
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
import dictConfig from '/src/views/eos/config/dict.config.js'
import { listApplySimple } from '/src/api/eos/earnest/earnestMoney.js'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import ApplyDetail from '/src/views/eos/earnest/apply/modules/ApplyDetail.vue'

export default {
  props: {
    selectType: {
      type: String,
      default: 'checkbox'
    }
  },
  name: 'ApplySelect',
  components: {
    SSearch,
    STable
  },
  data() {
    return {
      /* 是否有数据 */
      noData: false,
      dictKeys: [dictConfig.PROJECT_EARNESTMONEY_TYPE],
      dictMap: {},
      selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'createTime',
        createBy: this.$store.getters.userName
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listApplySimple(Object.assign({}, param, this.queryParam)).then(res => {
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
          title: '项目编号',
          dataIndex: 'projectId',
          align: 'center'
        },
        {
          title: '项目名称',
          dataIndex: 'sealProject.name',
          align: 'center',
          customRender: text => {
            return (
              <Ellipsis length={15} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '保证金类型',
          dataIndex: 'depositType',
          align: 'center'
        },
        {
          title: '保证金金额(元)',
          dataIndex: 'depositMoney',
          align: 'left',
          size: '8'
        },
        {
          title: '预计退还时间',
          dataIndex: 'returnTime',
          align: 'center'
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
    reset() {
      this.queryParam = {}
    },
    handleOk() {
      this.$emit('ok', this.selectedRows, this.selectedRowKeys)
      this.$emit('close')
    },
    handleCancel() {
      this.$emit('close')
    },
    /** 详情 */
    handleDetail(row, formId) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '保证金申请详情',
          width: '50%',
          maskClosable: true
        },
        content: {
          template: ApplyDetail,
          props: {
            row,
            formId
          }
        }
      })
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
  }
}
</script>
