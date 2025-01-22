<!-- 项目详细 -->
<template>
  <div>
    <a-upload v-show="this.showReceipt" name="file" :multiple="true" :action="fileUploadUrl" :headers="fileUploadHeader" @change="handleFileUploadChange" :remove="handleUploadRemove">
      <a-button style="margin-left: 10px" type="primary" icon="upload">上传附件(eg.回执单)</a-button>
    </a-upload>
    <s-descriptions :title="title" :formItems="formItems" :formData="row" />
    <!-- 数据表格 -->
    <a-card :bordered="false" size="small">
      <a-collapse expand-icon-position="right" defaultActiveKey="报销明细">
        <a-collapse-panel key="报销明细" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">报销明细</span>
          <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :showPagination="false"> </s-table>
        </a-collapse-panel>
        <a-collapse-panel v-if="!isEmpty(invoiceDataList)" key="发票" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">发票</span>
          <a slot="extra" style="color: #348ee4" href="javascript:;" @click.stop="handleExport(row)">导出发票</a>
          <s-table ref="s_table" size="default" rowKey="id" :columns="columnsSealInvoicesData" :data="sealInvoicesData" :showPagination="false"> </s-table>
        </a-collapse-panel>
      </a-collapse>
    </a-card>
  </div>
</template>

<script lang="jsx">
import dictConfig from '/src/views/eos/config/dict.config.js'
import { SDescriptions, STable, Ellipsis } from '/src/components/index.js'
import { previewDoc } from '/src/components/Office/office.js'
import { exportInvoice, getExpense, getResidueMoney, updateExpense } from '/src/api/eos/expense/expense.js'
import { budgetPassOne } from '/src/api/eos/budget/apply.js'

import storage from 'store'
import { getConfigKey } from '/src/api/system/config.js'
import { ACCESS_TOKEN, TENANT_ID } from '/src/store/mutation-types'
import { deleteDoc } from '/src/components/Office/office.js'

export default {
  name: 'ExpenseDetail',
  props: {
    formId: {
      type: Number,
      required: true
    },
    row: {
      type: Object,
      default: () => {}
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
      // 源报销单所有信息
      orangeExpenseForm: {},
      selsetValue: [],
      dictKeys: [dictConfig.PROJECT_BUDGET_TYPE],
      dictMap: {},
      merchantList: [],
      title: '项目详情',
      formItems: [
        {
          label: '报销人',
          prop: 'sysUser.nickName'
        },
        {
          label: '报销单号',
          prop: 'code'
        },
        {
          label: '报销日期',
          prop: 'createTime'
        },
        {
          label: '所属项目/部门',
          prop: 'sealProject.name',
          customRender: (text, record) => {
            return record.sealProject ? (
              <Ellipsis length={16} tooltip>
                {record.sealProject.name}
              </Ellipsis>
            ) : (
              <Ellipsis length={16} tooltip>
                {record.sysDept.deptName}
              </Ellipsis>
            )
          }
        },
        {
          label: '报销总金额',
          prop: 'sum'
        },
        {
          label: '实报金额',
          prop: 'finalSum'
        },
        {
          label: '报销事由',
          prop: 'content'
        },
        {
          label: '是否冲抵贷款',
          prop: 'repay',
          customRender: text => {
            if (text === '否') {
              return <a-tag color="red">{text}</a-tag>
            } else {
              return <a-tag color="blue">{text}</a-tag>
            }
          }
        },
        {
          label: '附件',
          prop: 'attachment',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        }
      ],
      columns: [
        {
          title: '#',
          dataIndex: 'id',
          align: 'center',
          fixed: 'left',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '费用类型',
          dataIndex: 'budgetId',
          align: 'center',
          customRender: (text, record) => {
            const arr = this.selsetValue.filter((item, index) => {
              return item.id === text
            })
            return this.isEmpty(arr) ? '' : arr[0].sealBudgetType.name
          }
        },
        {
          title: '费用详情',
          dataIndex: 'detail',
          align: 'center',
          width: 200
        },
        {
          title: '剩余报销金额(元)',
          dataIndex: 'sumLeft',
          align: 'left',
          customRender: (text, record) => {
            if (record.budgetId) {
              const val = this.selsetValue.find(item => {
                return item.id === record.budgetId
              })
              if (!this.isEmpty(val)) {
                return this.toThousandFilter(val.sumLeft)
              }
            }
          }
        },
        {
          title: '报销金额(元)',
          dataIndex: 'sum',
          align: 'left'
        },
        {
          title: '是否代票',
          dataIndex: 'replaced',
          align: 'center'
        },
        {
          title: '代票详情',
          dataIndex: 'remark',
          align: 'center'
        }
      ],
      // 报销明细数据
      expenseDetailVos: [],
      loadData: param => {
        return new Promise(resolve => {
          resolve({
            data: this.expenseDetailVos
          })
        })
      },
      // loadData: param => {
      //   return new Promise(resolve => {
      //     resolve(param)
      //   }).then(param => {
      //     return {
      //       data: this.TableDatas
      //     }
      //   })
      // },
      /* 发票 */
      columnsSealInvoicesData: [
        {
          title: '#',
          dataIndex: 'id',
          align: 'center',
          fixed: 'left',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '发票代码',
          dataIndex: 'invoiceCode',
          align: 'center'
        },
        {
          title: '发票号码',
          dataIndex: 'invoiceNum',
          align: 'center'
        },
        {
          title: '机器号码',
          dataIndex: 'machineCode',
          align: 'center'
        },
        {
          title: '发票单位',
          dataIndex: 'purchaserName',
          align: 'center'
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
          align: 'center',
          customRender: (text, record) => {
            if (!text) return
            return (
              <span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => previewDoc(record.invoiceCode, text)}>
                {record.invoiceNum + '.' + text.substring(text.lastIndexOf('.'))}
              </span>
            )
          }
        }
      ],
      // 发票数据列表
      invoiceDataList: [],
      sealInvoicesData: param => {
        return new Promise(resolve => {
          resolve({ data: this.invoiceDataList })
        })
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
    // 查询配置
    getConfigKey('receipt').then(res => {
      if (res.msg === 'receipt' && this.row.state === 2) {
        this.showReceipt = true
      }
    })
    this.orangeExpenseForm = { ...this.row }
    // 查询报销明细
    getExpense(this.row.id).then(res => {
      this.expenseDetailVos = res.data.expenseDetailVos || []
      this.invoiceDataList = res.data.sealInvoices || []
      // 表单赋值，
      this.orangeExpenseForm.sealExpenseDetails = res.data.expenseDetailVos || []
      this.orangeExpenseForm.sealInvoices = res.data.sealInvoices || []
      this.$refs.table.refresh()
    })
    /* 查询类型 */
    if (this.row.orgId === null) {
      // 根据budgetId查询预算明细
      budgetPassOne({ projectId: this.row.projectId, type: this.row.budgetType }).then(res => {
        const budgetApply = res.data
        if (budgetApply.isBudget === '是') {
          this.selsetValue = budgetApply.budgetTypeVos || []
        } else {
          getResidueMoney().then(res => {
            this.selsetValue = res.rows || []
          })
        }
      })
    } else {
      budgetPassOne({ orgId: this.row.orgId, deptTime: this.row.deptTime, type: this.row.budgetType }).then(res => {
        this.selsetValue = (res.data && res.data.budgetTypeVos) || []
      })
    }
  },
  methods: {
    refresh() {
      this.$refs.table.refresh(true)
    },
    // 导出发票
    handleExport(row) {
      this.$antdconfirm({
        title: '导出',
        content: '是否确认导出开票数据项?',
        onOk: () => {
          return exportInvoice(row.code).then(res => {
            this.download(res.msg)
          })
        }
      })
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
      const loanObj = { ...this.orangeExpenseForm }
      loanObj.attachment = JSON.stringify(ret)
      updateExpense(loanObj).then(res => {
        if (res.code === 200) {
          this.$message.success('保存成功')
        }
      })
    }
  }
}
</script>
