<!-- 采购申请列表 -->
<template>
  <div>
    <a-card :bordered="false">
      <!-- 查询表单，若无数据，不展示 -->
      <s-search placeholder="搜索此列表..." clickTips="搜索项目名称" @onSearch="onSearch" />
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
import { notPay } from '/src/api/eos/purchase/purchase.js'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import ApplyDetail from '/src/views/eos/purchase/apply/detail.vue'
import { getProject } from '/src/api/eos/project/project.js'
import { getContract } from '/src/api/eos/contract/contract.js'

import ProjectDetail from '/src/views/eos/project/detail.vue'
import ContractDetail from '/src/views/eos/contract/detail.vue'

export default {
  props: {
    selectType: {
      type: String,
      default: 'checkbox'
    }
  },
  name: 'PurchaseApplySelect',
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
        orderByColumn: 'createTime'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        // 查询未付款的采购申请
        return notPay(Object.assign({}, param, this.queryParam)).then(res => {
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
          align: 'center',
          dataIndex: 'code',
          customRender: (text, record) => {
            return (
              <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleDetail(record, record.id)}>
                {text}
              </span>
            )
          }
        },
        {
          title: '项目名称',
          align: 'center',
          dataIndex: 'sealProject.name',
          customRender: (text, record) => {
            return (
              <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleProjectDetail(record.sealProject.id)}>
                {text}
              </span>
            )
          }
        },
        {
          title: '合同名称',
          align: 'center',
          dataIndex: 'sealContract.name',
          customRender: (text, record) => {
            return (
              <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleContractDetail(record.sealContract.id)}>
                {text}
              </span>
            )
          }
        },
        // {
        //   title: '审批状态',
        //   align: 'center',
        //   dataIndex: 'state',
        //   customRender: (text, record) => {
        //     return <AuditStatusTag state={text} instanceId={record.busFlow.instanceId} />
        //   }
        // },
        {
          title: '附件',
          dataIndex: 'attachment',
          align: 'center',
          customRender: (text, record) => {
            return <s-doc-list text={text} />
          }
        },
        {
          title: '采购事由',
          align: 'center',
          dataIndex: 'remark',
          customRender: text => {
            return (
              <Ellipsis length={36} tooltip>
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
      if (this.isEmpty(this.selectedRows) || this.isEmpty(this.selectedRowKeys)) {
        return this.$message.warning('请选择一条采购')
      }
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
          title: '采购申请详情',
          width: '80%',
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
    },
    /* 查看项目详情 */
    async handleProjectDetail(id) {
      const row = await getProject(id)
      if (!this.isEmpty(row)) {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '项目详情',
            width: '60%',
            maskClosable: true
          },
          content: {
            template: ProjectDetail,
            props: {
              row: row.data
            }
          }
        })
      } else {
        this.$message.error('获取详情失败')
      }
    },
    /* 查看合同详情 */
    async handleContractDetail(id) {
      const row = await getContract(id)
      if (!this.isEmpty(row)) {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '项目详情',
            width: '60%',
            maskClosable: true
          },
          content: {
            template: ContractDetail,
            props: {
              row: row.data
            }
          }
        })
      } else {
        this.$message.error('获取详情失败')
      }
    }
  }
}
</script>
