<!-- 付款申请 -->
<template>
  <a-card :bordered="false">
    <!-- 查询表单 -->
    <div class="table-page-search-wrapper">
      <s-form search layout="inline" @search="refresh" @reset="reset" :formItems="searchFormItems" :formData="queryParam" />
    </div>

    <!-- 业务操作按钮 -->
    <div class="table-operations">
      <a-button type="primary" ghost icon="plus" @click="handleAdd" v-hasPermi="['project:payment:add']">新增</a-button>
      <a-button type="dashed" shape="circle" :style="{ float: 'right' }" icon="reload" @click="refresh" />
    </div>

    <!-- 数据表格 -->
    <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
      <span slot="action" slot-scope="text, record">
        <BusCommit :busCommitActions="busCommitActions" :handleUpdate="handleUpdate" :handleDelete="handleDelete" :requestMapping="'/project/payment'" :busForm="record" @getList="refresh" />
      </span>
    </s-table>
  </a-card>
</template>

<script lang="jsx">
import dictConfig from '/src/views/eos/config/dict.config.js'
import { listPaymentApply, delPayment, exportPayment } from '/src/api/eos/purchase/payment.js'
import { listMerchant } from '/src/api/eos/merchant/merchant.js'
import { SForm, STable, Ellipsis } from '/src/components/index.js'
import PaymentForm from './modules/PaymentForm'
import PaymentDetail from './detail'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import BusCommit from '/src/components/Activiti/BusCommit.vue'

export default {
  name: 'PaymentApplyListOp',
  components: {
    SForm,
    STable,
    BusCommit
  },
  data() {
    return {
      busCommitActions: [
        {
          label: '导出',
          icon: 'export',
          action: this.handleExport
        }
      ],
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
          const dataList = []
          res.rows.forEach(item => {
            if (item.busForm) {
              dataList.push({ ...item.busForm, busFlow: item.busFlow })
            }
          })
          return {
            data: dataList,
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
          dataIndex: 'busFlow.applyUserName'
        },
        {
          title: '申请时间',
          dataIndex: 'busFlow.applyTime'
        },
        {
          title: '当前任务',
          dataIndex: 'busFlow.taskName'
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          customRender: (text, record) => {
            return <AuditStatusTag state={text} instanceId={record.busFlow.instanceId} />
          }
        },
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
        //   align: 'center'
        // },
        {
          title: '收款单位',
          dataIndex: 'sealMerchant.name',
          align: 'center',
          customRender: text => {
            return text ? (
              <Ellipsis length={20} tooltip>
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
          align: 'center',
          customRender: text => {
            return (
              <Ellipsis length={20} tooltip>
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
          title: '项目名称',
          dataIndex: 'sealProject.name',
          align: 'center'
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
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        // {
        //   title: '附件',
        //   dataIndex: 'attachment',
        //   customRender: text => {
        //     return <s-doc-list text={text} />
        //   }
        // },
        {
          title: '操作',
          width: 170,
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
    },
    // 刷新页面
    refresh() {
      this.$refs.table.refresh(true)
    }
  }
}
</script>
