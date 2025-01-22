<!-- 采购付款 -->
<template>
  <a-card :bordered="false">
    <div class="table-header-btns">
      <a-button ghost type="primary" @click="handleAdd">新增</a-button>
      <!-- 查询表单，若无数据，不展示 -->
      <s-search placeholder="搜索此列表..." clickTips="搜索项目名称、合同名称、申请单号、付款单位/事由/金额" @onSearch="onSearch" />
    </div>
    <!-- 数据表格 -->
    <no-data v-show="noData" />
    <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
      <span slot="action" slot-scope="text, record">
        <BusCommit :busCommitActions="busCommitActions" :handleUpdate="handleUpdate" :handleDelete="handleDelete" :requestMapping="'/project/payment'" :busForm="record" @getList="refresh" />
      </span>
    </s-table>
  </a-card>
</template>

<script lang="jsx">
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { listPaymentApply, delPayment, exportPayment } from '/src/api/eos/purchase/payment.js'
import { listMerchant } from '/src/api/eos/merchant/merchant.js'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import PaymentForm from './modules/PaymentForm.vue'
import PaymentDetail from './detail.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import BusCommit from '/src/components/Activiti/BusCommit.vue'

export default {
  name: 'PaymentOp',
  components: {
    SSearch,
    STable,
    BusCommit
  },
  data() {
    return {
      rowClick: record => ({
        on: {
          click: () => {
            this.handleDetail(record)
          }
        },
        style: {
          cursor: 'pointer'
        }
      }),
      busCommitActions: [
        {
          label: '导出',
          icon: 'export',
          action: this.handleExport
        }
      ],
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
        return listPaymentApply(Object.assign({}, param, this.queryParam)).then(res => {
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
          type: 'select',
          label: '付款单位',
          prop: 'company',
          options: () => this.dictMap[dictConfig.PROJECT_UNIT]
        },
        {
          type: 'select',
          label: '收款单位',
          prop: 'payeeId',
          valueAlias: 'id',
          labelAlias: 'name',
          options: () => this.merchantList
        },
        {
          type: 'input',
          label: '项目名称',
          prop: 'projectName'
        },
        {
          type: 'input',
          label: '合同名称',
          prop: 'contractName'
        }
      ],
      columns: [
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
            if (this.isEmpty(text)) {
              return ''
            } else {
              return moment(text).format('MM-DD HH:mm')
            }
          }
        },
        // {
        //   title: '当前任务',
        //   dataIndex: 'busFlow.taskName',
        //   align: 'center',
        //   customRender: (text, record) => {
        //     return <a-tag color="orange">{record.busFlow.taskName}</a-tag>
        //   }
        // },

        {
          title: '申请单号',
          dataIndex: 'code',
          align: 'left',
          width: 200
        },
        // {
        //   title: '付款单位',
        //   dataIndex: 'company',
        //   align: 'center'
        // },
        {
          title: '收款单位',
          dataIndex: 'sealMerchant.name',
          align: 'left',
          customRender: text => {
            return text ? (
              <Ellipsis length={12} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
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
          align: 'left',
          customRender: text => {
            return (
              <Ellipsis length={16} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        // {
        //   title: '项目编号',
        //   dataIndex: 'sealProject.code',
        //   align: 'center'
        // },
        {
          title: '项目/部门',
          dataIndex: 'sealProject.name',
          align: 'left',
          customRender: (text, record) => {
            return record.sealProject ? (
              <Ellipsis length={64} tooltip>
                {record.sealProject.name}
              </Ellipsis>
            ) : record.dept ? (
              <Ellipsis length={64} tooltip>
                {record.deptTime + '年' + record.dept.deptName}
              </Ellipsis>
            ) : null
          }
        },
        // {
        //   title: '合同编号',
        //   dataIndex: 'sealContract.code',
        //   align: 'center'
        // },
        // {
        //   title: '合同名称',
        //   dataIndex: 'sealContract.name',
        //   align: 'center'
        // },
        {
          title: '本次付款金额(元)',
          dataIndex: 'payMoney',
          align: 'left',
          customRender: text => this.toThousandFilter(text)
        },
        // {
        //   title: '附件',
        //   dataIndex: 'attachment',
        //   customRender: text => {
        //     return <s-doc-list text={text} />
        //   }
        // },
        {
          title: '审批状态',
          dataIndex: 'state',
          align: 'left',
          customRender: (text, record) => {
            return <AuditStatusTag clickable state={text} instanceId={record.sealWorkflow.instanceId} />
          }
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
  created() {
    // 查询字典
    this.dictKeys.forEach(key => {
      this.getDicts(key).then(res => {
        this.$set(this.dictMap, key, res.data)
      })
    })
    listMerchant().then(res => {
      this.merchantList = res.rows
    })
  },
  methods: {
    reset() {
      this.queryParam = { isAsc: 'desc', orderByColumn: 'create_time' }
    },
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '新增付款申请',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: PaymentForm,
          props: {},
          on: {
            ok: () => {
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
          title: '修改付款申请',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: PaymentForm,
          props: {
            isUpdate: true,
            updateRow
          },
          on: {
            ok: () => {
              this.refresh()
            }
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除付款申请编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delPayment(ids).then(() => {
            this.refresh()
            this.$message.success('删除成功', 3)
          })
        }
      })
    },
    /** 导出按钮操作 */
    handleExport(row) {
      this.$antdconfirm({
        title: '导出',
        content: '是否确认导出所有付款申请数据项?',
        onOk: () => {
          return exportPayment(row.id).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /** 详情 */
    handleDetail(row) {
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
            row
          }
        }
      })
    } /* 查询按钮 */,
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
