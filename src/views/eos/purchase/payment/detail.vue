<!-- 付款申请详细 -->
<template>
  <div>
    <a-upload v-show="this.showReceipt" name="file" :multiple="true" :action="fileUploadUrl" :headers="fileUploadHeader" @change="handleFileUploadChange" :remove="handleUploadRemove">
      <a-button style="margin-left: 10px" type="primary" icon="upload">上传附件(eg.回执单)</a-button>
    </a-upload>
    <s-descriptions title="基本信息" :formItems="formItems" :formData="formData">
      <a slot="extra" style="color: #348ee4" href="javascript:;" @click.stop="handleExport(row)">导出详情</a>
    </s-descriptions>
    <s-table ref="table" size="default" :rowKey="(_, index) => index" :columns="columns" :data="loadData" :showPagination="false" :scroll="{ x: true }" />
  </div>
</template>

<script lang="jsx">
import moment from 'moment'
import { exportPayment, updatePayment } from '/src/api/eos/purchase/payment.js'
import { getDetail } from '/src/api/eos/purchase/purchase.js'
import { getProject } from '/src/api/eos/project/project.js'
import { getContract } from '/src/api/eos/contract/contract.js'
import { getType } from '/src/api/eos/budget/type.js'
import { getMerchanAccountInfo } from '/src/api/eos/merchant/merchant.js'
import { getPayment } from '/src/api/eos/purchase/payment.js'
import { STable } from '/src/components/index.js'
import { refundDetail } from '/src/api/eos/purchase/refund.js'

import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'
import SDescriptions from '/src/components/Descriptions/index.jsx'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import ProjectDetail from '/src/views/eos/project/detail.vue'
import ContractDetail from '/src/views/eos/contract/detail.vue'
import PurchaseDetail from '/src/views/eos/purchase/apply/detail.vue'

import storage from 'store'
import { getConfigKey } from '/src/api/system/config.js'
import { ACCESS_TOKEN, TENANT_ID } from '/src/store/mutation-types'
import { deleteDoc } from '/src/components/Office/office.js'

export default {
  name: 'PaymentDetail',
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    isRefund: {
      type: Boolean,
      default: false
    }
  },
  components: {
    SDescriptions,
    STable
  },
  data() {
    return {
      // 回执单
      showReceipt: false,
      fileList: [],
      // 文件上传地址
      fileUploadUrl: import.meta.env.VITE_APP_BASE_API + '/common/upload',
      fileUploadHeader: { Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN) },
      // 加载明细数据
      loadData: param => {
        return new Promise(resolve => {
          resolve(param)
        }).then(param => {
          // 统计合同总金额
          return {
            data: this.tableData
          }
        })
      },
      tableData: [],
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          align: 'center'
        },
        {
          title: '描述',
          dataIndex: 'description',
          align: 'center'
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center'
        },
        {
          title: '数量',
          dataIndex: 'amount',
          align: 'center'
        },
        {
          title: '单价',
          dataIndex: 'price',
          align: 'center'
        },
        {
          title: '总价',
          dataIndex: 'totalPrice',
          align: 'center'
        },
        {
          title: '型号规格',
          dataIndex: 'spec',
          align: 'center'
        }
      ],
      formData: {},
      formItems: [],
      formItems1: [
        {
          label: '申请单号',
          prop: 'code'
        },
        {
          label: '申请人',
          prop: 'sysUser.nickName'
        },
        {
          label: '申请时间',
          prop: 'applyDate',
          formatter: val => {
            if (val) {
              return moment(val).format('YYYY/MM/DD')
            } else {
              return ''
            }
          }
        },
        {
          label: '采购申请单号',
          prop: 'purchaseApply.code'
          // customRender: (text, record) => {
          //   return (
          //     <span style="color:#348ee4;cursor:pointer" onClick={() => this.handlePurchaseDetail(record.purchaseApplyId)}>
          //       <Ellipsis length={18} tooltip>
          //         {text}
          //       </Ellipsis>
          //     </span>
          //   )
          // }
        },
        {
          label: '申请部门',
          prop: 'dept.deptName'
        },
        {
          label: '付款单位',
          prop: 'company'
        },
        {
          label: '收款单位',
          prop: 'sealMerchant.name'
        },
        {
          label: '开户银行',
          prop: 'sealMerchant.bank'
        },
        {
          label: '收款账号',
          prop: 'payeeAccount'
        },
        {
          label: '付款方式',
          prop: 'payWay'
        },
        {
          label: '付款类型',
          prop: 'payType'
        },
        // {
        //   label: '资金计划',
        //   prop: 'fundPlan'
        // },
        {
          label: '发票类型',
          prop: 'invoiceType',
          customRender: text => {
            return <a-tag color="blue">{text}</a-tag>
          }
        },
        {
          label: '是否已经开具发票',
          prop: 'invoiceHas',
          customRender: text => {
            return <a-tag color="blue">{text}</a-tag>
          }
        },
        {
          label: '付款事由说明',
          prop: 'reason'
        },
        {
          label: '项目编号',
          prop: 'sealProject.code'
          // customRender: (text, record) => {
          //   return (
          //     <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleProjectDetail(record.sealProject.id)}>
          //       {text}
          //     </span>
          //   )
          // }
        },
        {
          label: '项目名称',
          prop: 'sealProject.name'
        },
        {
          label: '预算类型',
          prop: 'budgetType',
          customRender: text => {
            return <a-tag color="blue">{text}</a-tag>
          }
        },
        {
          label: '费用类型',
          prop: 'expenseType',
          customRender: text => {
            return <a-tag color="blue">{text}</a-tag>
          }
        },
        {
          label: '合同编号',
          prop: 'sealContract.code'
          // customRender: (text, record) => {
          //   return (
          //     <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleContractDetail(record.sealContract.id)}>
          //       {text}
          //     </span>
          //   )
          // }
        },
        {
          label: '合同名称',
          prop: 'sealContract.name'
        },
        {
          label: '合同总金额',
          prop: 'sealContract.sum',
          customRender: text => this.toThousandFilter(text)
        },
        {
          label: '合同附件',
          prop: 'sealContract.attachment',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        },
        {
          label: '已付款金额(元)',
          prop: 'preMoney',
          customRender: text => this.toThousandFilter(text)
        },
        {
          label: '本次付款金额(元)',
          prop: 'payMoney',
          customRender: text => this.toThousandFilter(text)
        },
        {
          label: '付款金额大写',
          prop: 'payMoneyUpper'
        },
        {
          label: '审批状态',
          prop: 'state',
          customRender: text => {
            return <AuditStatusTag state={text} />
          }
        },
        {
          label: '图片附件',
          prop: 'attachmentPic',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        },
        {
          label: '附件',
          prop: 'attachment',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        },
        {
          label: '备注',
          prop: 'remark',
          customRender: text => {
            return text ? (
              <Ellipsis length={20} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        }
      ],
      formItems2: [
        {
          label: '申请单号',
          prop: 'code'
        },
        {
          label: '申请人',
          prop: 'sysUser.nickName'
        },
        {
          label: '申请时间',
          prop: 'applyDate',
          formatter: val => {
            return moment(val).format('YYYY/MM/DD')
          }
        },
        {
          label: '申请部门',
          prop: 'dept.deptName'
        },
        {
          label: '采购申请单号',
          prop: 'purchaseApplyId'
          // customRender: (text, record) => {
          //   return (
          //     <span style="color:color:#348ee4;cursor:pointer" onClick={() => this.handlePurchaseDetail(record.purchaseApplyId)}>
          //       <Ellipsis length={18} tooltip>
          //         {text}
          //       </Ellipsis>
          //     </span>
          //   )
          // }
        },
        {
          label: '付款单位',
          prop: 'company'
        },
        {
          label: '收款单位',
          prop: 'sealMerchant.name'
        },
        {
          label: '开户银行',
          prop: 'sealMerchant.bank'
        },
        {
          label: '收款账号',
          prop: 'payeeAccount'
        },
        {
          label: '付款方式',
          prop: 'payWay'
        },
        {
          label: '付款类型',
          prop: 'payType'
        },
        // {
        //   label: '资金计划',
        //   prop: 'fundPlan'
        // },
        {
          label: '发票类型',
          prop: 'invoiceType',
          customRender: text => {
            return <a-tag color="blue">{text}</a-tag>
          }
        },
        {
          label: '是否已经开具发票',
          prop: 'invoiceHas',
          customRender: text => {
            return <a-tag color="blue">{text}</a-tag>
          }
        },
        {
          label: '项目编号',
          prop: 'sealProject.code'
          // customRender: (text, record) => {
          //   return (
          //     <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleProjectDetail(record.sealProject.id)}>
          //       {text}
          //     </span>
          //   )
          // }
        },
        {
          label: '项目名称',
          prop: 'sealProject.name'
        },
        {
          label: '预算类型',
          prop: 'budgetType',
          customRender: text => {
            return <a-tag color="blue">{text}</a-tag>
          }
        },
        {
          label: '费用类型',
          prop: 'expenseType',
          customRender: text => {
            return <a-tag color="blue">{text}</a-tag>
          }
        },
        {
          label: '合同编号',
          prop: 'sealContract.code'
          // customRender: (text, record) => {
          //   return (
          //     <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleContractDetail(record.sealContract.id)}>
          //       {text}
          //     </span>
          //   )
          // }
        },
        {
          label: '合同名称',
          prop: 'sealContract.name'
        },
        {
          label: '合同总金额',
          prop: 'sealContract.sum',
          customRender: text => this.toThousandFilter(text)
        },
        {
          label: '合同附件',
          prop: 'sealContract.attachment',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        },
        {
          label: '本次退款金额(元)',
          prop: 'payMoney',
          customRender: text => this.toThousandFilter(text)
        },
        // {
        //   label: '审批状态',
        //   prop: 'state',
        //   customRender: text => {
        //     return <AuditStatusTag state={text} />
        //   }
        // },
        {
          label: '图片附件',
          prop: 'attachmentPic',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        },
        {
          label: '附件',
          prop: 'attachment',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        },
        {
          label: '备注',
          prop: 'remark',
          customRender: text => {
            return text ? (
              <Ellipsis length={20} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        }
      ]
    }
  },
  methods: {
    async handlePurchaseDetail(id) {
      const row = await getDetail(id)
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '采购申请详情',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: PurchaseDetail,
          props: {
            row: row.data,
            formId: row.data.id
          }
        }
      })
    },
    /** 导出按钮操作 */
    handleExport(row) {
      this.$antdconfirm({
        title: '导出',
        content: '是否确认导出该付款申请数据项?',
        onOk: () => {
          return exportPayment(row.id).then(res => {
            this.download(res.msg)
          })
        }
      })
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
    // 回执单文件
    handleFileUploadChange({ file, fileList, event }) {
      if (file.response && file.response.code !== 200) {
        return this.$message.error(file.response.msg)
      }
      // 上传情况 得到上传之后的文件
      if (file.status === 'done') {
        let ret = []
        fileList.forEach(item => {
          if (item.response && item.response.code === 200) {
            ret.push({ name: item.name, url: item.response.fileName })
          } else {
            ret.push({ name: item.name, url: item.url })
          }
        })
        // 更新表单数据
        if (ret.length > 0) {
          if (this.row.attachment) {
            const old = JSON.parse(this.row.attachment)
            ret = [...ret, ...old]
          }
          this.fileList = ret
          // 更新数据
        }
        this.handleUpdateMake(ret)
      }
      if (file.status === 'remove') {
        handleUploadRemove(file)
      }
    },
    handleUploadRemove(file) {
      return new Promise((resolve, reject) => {
        this.$antdconfirm({
          title: '删除附件',
          content: '是否删除附件：' + file.name + '?',
          onOk: () => {
            const fileName = file.response ? file.response.fileName : file.url
            deleteDoc(fileName)
              .then(() => {
                this.$message.success('删除成功')
                // 删除之后的数据
                let ret = []
                ret = this.fileList.filter(e => e.url !== fileName)
                this.fileList = ret
                // 更新表单数据
                if (ret.length > 0) {
                  // 更新数据
                  this.handleUpdateMake(ret)
                }
                resolve(true)
              })
              .catch(err => {
                this.$message.error('删除失败')
                reject(err)
              })
          }
        })
      })
    },
    // 更新
    handleUpdateMake(ret) {
      const loanObj = { ...this.row }
      loanObj.attachment = JSON.stringify(ret)
      updatePayment(loanObj).then(res => {
        if (res.code === 200) {
          this.$message.success('保存成功')
        }
      })
    },
    /* 查看合同详情 */
    async handleContractDetail(id) {
      const row = await getContract(id)
      if (!this.isEmpty(row)) {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '合同详情',
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
  },
  created() {
    this.formData = { ...this.row }
    if (!this.isRefund) {
      getPayment(this.formData.id).then(res => {
        this.tableData = res.data.paymentDetailList
        this.$refs.table.refresh()
      })
    } else {
      refundDetail(this.formData.id).then(res => {
        this.tableData = res.data.paymentDetailList
        this.$refs.table.refresh()
      })
    }
    const { budgetTypeId, payeeAccount, payeeAccountId } = { ...this.row }
    if (budgetTypeId) {
      getType(budgetTypeId).then(res => {
        this.$set(this.formData, 'expenseType', res.data.name)
      })
    }
    // payeeAccountId存在的情况下采取请求
    if (payeeAccountId) {
      getMerchanAccountInfo({ accountId: payeeAccountId }).then(res => {
        if (res.data) {
          this.$set(this.formData.sealMerchant, 'bank', res.data.bank)
          this.$set(this.formData, 'payeeAccount', res.data.account)
        }
      })
    }
    if (!this.isRefund) {
      this.formItems = this.formItems1
    } else {
      this.formItems = this.formItems2
    }
    // 查询配置
    getConfigKey('receipt').then(res => {
      if (res.msg === 'receipt' && this.row.state === 2) {
        this.showReceipt = true
      }
    })
  }
}
</script>
