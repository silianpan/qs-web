<!-- 开票详细 -->
<template>
  <div>
    <a-upload v-show="this.showReceipt" name="file" :multiple="true" :action="fileUploadUrl" :headers="fileUploadHeader" @change="handleFileUploadChange" :remove="handleUploadRemove">
      <a-button style="margin-left: 10px" type="primary" icon="upload">上传附件(eg.回执单)</a-button>
    </a-upload>
    <s-descriptions :title="title" :formItems="formItems" :formData="row" />
    <a-card v-if="row.sealPaymentReals !== undefined" :bordered="false" size="small">
      <a-collapse expand-icon-position="right" defaultActiveKey="实际收款">
        <a-collapse-panel key="实际收款" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">实际收款</span>
          <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :show-pagination="false"> </s-table>
        </a-collapse-panel>
      </a-collapse>
    </a-card>
  </div>
</template>

<script lang="jsx">
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { listReal } from '/src/api/eos/invoice/real.js'
import { updateMake } from '/src/api/eos/invoice/make.js'
import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'
import STable from '/src/components/Table/index.jsx'
import SDescriptions from '/src/components/Descriptions/index.jsx'

import storage from 'store'
import { getConfigKey } from '/src/api/system/config.js'
import { ACCESS_TOKEN, TENANT_ID } from '/src/store/mutation-types'
import { deleteDoc } from '/src/components/Office/office.js'

export default {
  name: 'MakeFormDetail',
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
      dictKeys: [dictConfig.PROJECT_BUDGET_TYPE],
      dictMap: {},
      sealPaymentReals: [],
      title: '开票详情',
      formItems: [
        {
          label: '开票单位',
          prop: 'makeUnit'
        },
        {
          label: '开票时间',
          prop: 'makeTime'
        },
        {
          label: '金额单位',
          prop: 'moneyUnit'
        },
        {
          label: '项目名称',
          prop: 'projectName'
        },
        {
          label: '项目编号',
          prop: 'projectCode'
        },
        {
          label: '是否有合同',
          prop: 'hasContract'
        },
        {
          label: '合同名称',
          prop: 'contractName'
        },
        {
          label: '合同编号',
          prop: 'contractCode'
        },
        {
          label: '合同金额',
          prop: 'contractMoney',
          customRender: text => {
            return text == null ? '' : this.toThousandFilter(text)
          }
        },
        {
          label: '已开票金额',
          prop: 'beforeMoney',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '本次开票比例(%)',
          prop: 'thisPercent'
        },
        {
          label: '本次开票金额',
          prop: 'thisMoney',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '发票类型',
          prop: 'type'
        },
        {
          label: '税率(%)',
          prop: 'taxRate'
        },
        {
          label: '预计回款日期',
          prop: 'returnDate'
        },
        {
          label: '备注',
          prop: 'remark'
        },
        {
          label: '客户单位名称',
          prop: 'clientUnit'
        },
        {
          label: '客户地址电话',
          prop: 'clientAddr'
        },
        {
          label: '客户纳税人识别号',
          prop: 'clientTaxno'
        },
        {
          label: '客户开户行及账号',
          prop: 'clientBank'
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
          title: '项目名称',
          dataIndex: 'projectName',
          align: 'left'
        },
        {
          title: '关联开票单号',
          dataIndex: 'makeCode',
          align: 'left'
        },
        {
          title: '付款单位',
          dataIndex: 'sealMerchant.name',
          align: 'left',
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
        {
          title: '收款年月',
          dataIndex: 'payTime',
          align: 'left',
          customRender: (text, record) => {
            return (
              <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleDetail(record)}>
                {text}
              </span>
            )
          }
        },
        {
          title: '合同名称',
          dataIndex: 'contractName',
          align: 'left'
        },
        {
          title: '实际收款金额(元)',
          dataIndex: 'payMoney',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        }
      ],
      loadData: param => {
        return new Promise(resolve => {
          resolve({
            data: this.sealPaymentReals
          })
        })
      }
    }
  },
  methods: {
    /** 详情 */
    handleDetail(row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '收款详情',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: SDescriptions,
          props: {
            title: '收款详情',
            formData: row,
            formItems: [
              {
                label: '项目编号',
                prop: 'projectCode'
              },
              {
                label: '项目名称',
                prop: 'projectName'
              },
              {
                label: '收款年月',
                prop: 'payTime',
                formatter: val => {
                  return moment(val).format('YYYY/MM/DD')
                }
              },
              {
                label: '收款单位',
                prop: 'company'
              },
              {
                label: '付款单位',
                prop: 'sealMerchant.name'
              },
              {
                label: '开户银行',
                prop: 'sealMerchant.bank'
              },
              {
                label: '银行账号',
                prop: 'sealMerchant.account'
              },
              {
                label: '合同编号',
                prop: 'contractCode'
              },
              {
                label: '合同名称',
                prop: 'contractName'
              },
              {
                label: '合同总金额',
                prop: 'contractSum',
                customRender: (text, record) => {
                  return this.toThousandFilter(text)
                }
              },
              {
                label: '合同附件',
                prop: 'sealContract.attachment',
                customRender: text => {
                  return <s-doc-list text={text} />
                }
              },
              {
                label: '实际收款金额',
                prop: 'payMoney',
                customRender: (text, record) => {
                  return this.toThousandFilter(text)
                }
              },
              {
                label: '收款金额大写',
                prop: 'payMoneyUpper'
              },
              {
                label: '备注',
                prop: 'remark'
              }
            ]
          }
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
      const loanObj = { ...this.row }
      loanObj.attachment = JSON.stringify(ret)
      updateMake(loanObj).then(res => {
        if (res.code === 200) {
          this.$message.success('保存成功')
        }
      })
    }
  },
  mounted() {
    listReal({ makeCode: this.row.code }).then(res => {
      this.sealPaymentReals = res.rows
      this.row.sealPaymentReals !== undefined && this.$refs.table.refresh()
    })
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
  }
}
</script>
