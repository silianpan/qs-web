<!-- 客商管理表单 -->
<template>
  <s-form ok okText="保存" formTitle="客商信息表单" single :formItems="formItems" :formData="formData" :rules="formRules" @submit="handleSubmit" @cancel="handleCancel">
    <template v-slot:footer>
      <a-button class="s-mb-6 s-mt-6" ghost type="primary" @click="handleAddBank">新增银行账户</a-button>
      <s-table ref="tableBank" size="default" :rowKey="(_, index) => index" :data="loadDataBank" :columns="bankColumns" :showPagination="false" />

      <a-button class="s-mb-6 s-mt-6" ghost type="primary" @click="handleAddLinkMan">新增联系人</a-button>
      <s-table ref="tableLinkMan" size="default" :rowKey="(_, index) => index" :data="loadDataLinkMan" :columns="linkManColumns" :showPagination="false" />
    </template>
  </s-form>
</template>

<script lang="jsx">
import moment from 'moment'
import { addMerchant, updateMerchant, deleteMerchatUser, deleteMerchatAccount, getMerchant } from '/src/api/eos/merchant/merchant.js'

import SForm from '/src/components/Form/index.jsx'
import STable from '/src/components/Table/index.jsx'

export default {
  name: 'MerchantForm',
  props: {
    // 是否更新表单
    isUpdate: {
      type: Boolean,
      default: false
    },
    // 表单更新数据
    updateRow: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    SForm,
    STable
  },
  data() {
    return {
      bankList: [],
      linkManList: [],
      loadDataBank: () => {
        return new Promise(resolve => resolve({ data: this.bankList }))
      },
      loadDataLinkMan: () => {
        return new Promise(resolve => resolve({ data: this.linkManList }))
      },
      dictKeys: [],
      // 表单数据
      formData: {
        createBy: this.$store.getters.userName,
        serial: moment().format('YYYYMMDDHHmmss')
      },
      formItems: [
        [
          {
            type: 'input',
            label: '客商名称',
            prop: 'name',
            colspan: 12
          },
          {
            type: 'text',
            label: '编号',
            prop: 'serial',
            colspan: 12
          }
        ],
        [
          {
            type: 'select',
            label: '客商类型',
            prop: 'type',
            colspan: 12,
            options: [
              { dictLabel: '自身经营主体', dictValue: '自身经营主体' },
              { dictLabel: '供应商', dictValue: '供应商' },
              { dictLabel: '客商', dictValue: '客商' },
              { dictLabel: '其他', dictValue: '其他' }
            ]
          },
          {
            type: 'input',
            label: '地址',
            prop: 'address',
            colspan: 12
          }
        ],
        [
          {
            type: 'input',
            label: '税号',
            prop: 'taxNumber',
            colspan: 12
          },
          {
            type: 'select',
            label: '纳税人类别',
            prop: 'taxpayerType',
            colspan: 12,
            options: [
              { dictLabel: '一般纳税人', dictValue: '一般纳税人' },
              { dictLabel: '小规模纳税人', dictValue: '小规模纳税人' }
            ]
          }
        ],
        [
          {
            type: 'inputTextArea',
            label: '备注',
            prop: 'remark',
            colspan: 24,
            formItemProps: {
              props: {
                labelCol: { lg: 3, md: 8, sm: 10, xs: 24 },
                wrapperCol: { lg: 21, md: 16, sm: 14, xs: 24 }
              }
            }
          }
        ],
        [
          {
            type: 'upload',
            label: '上传附件',
            prop: 'attachment',
            colspan: 24,
            customDefaultFileList: () => this.updateRow && this.updateRow.attachment,
            handleChange: ret => {
              this.formData.attachment = JSON.stringify(ret)
            },
            compProps: {
              props: {
                multiple: true
              }
            },
            formItemProps: {
              props: {
                labelCol: { lg: 3, md: 8, sm: 10, xs: 24 },
                wrapperCol: { lg: 21, md: 16, sm: 14, xs: 24 }
              }
            }
          }
        ]
      ],
      formRules: {
        name: { required: true, message: '请输入', trigger: 'blur' },
        serial: { required: true, message: '请输入', trigger: 'blur' },
        address: { required: true, message: '请输入', trigger: 'blur' },
        type: { required: true, message: '请选择', trigger: 'blur' },
        taxNumber: { required: true, message: '请输入', trigger: 'blur' }
        // taxpayerType: { required: true, message: '请输入', trigger: 'blur' }
      },
      bankColumns: [
        {
          title: '银行账号',
          dataIndex: 'account',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.account} placeholder="输入银行账号" />
          }
        },
        {
          title: '账号名称',
          dataIndex: 'accountName',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.accountName} placeholder="输入账号名称" />
          }
        },
        {
          title: '开户银行',
          dataIndex: 'bank',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.bank} placeholder="输入开户银行" />
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 80,
          customRender: (text, record, index) => {
            return <a-button type="danger" ghost icon="delete" onClick={() => this.handleDeleteBank(record, index)} />
          }
        }
      ],
      linkManColumns: [
        {
          title: '联系人',
          dataIndex: 'name',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.name} placeholder="输入联系人" />
          }
        },
        {
          title: '联系方式',
          dataIndex: 'link',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.link} placeholder="输入联系方式" />
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center',
          customRender: (text, record) => {
            return <a-input v-model={record.remark} placeholder="输入备注" />
          }
        },
        {
          title: '操作',
          align: 'center',
          width: 80,
          customRender: (text, record, index) => {
            return <a-button type="danger" ghost icon="delete" onClick={() => this.handleDeleteLinkMan(record, index)} />
          }
        }
      ]
    }
  },
  mounted() {
    if (this.isUpdate && !this.isEmpty(this.updateRow)) {
      // 查询明细
      getMerchant(this.updateRow.id).then(res => {
        this.formData = { ...res.data }
        this.bankList = res.data.sealMerchantAccounts || []
        this.linkManList = res.data.sealMerchantUsers || []
        this.$refs.tableBank.refresh(true)
        this.$refs.tableLinkMan.refresh(true)
      })
    }
  },
  methods: {
    handleDeleteBank(record, index) {
      if (record.id) {
        deleteMerchatAccount(record.id).then(_ => {
          this.$message.success('删除成功')
        })
      }
      this.bankList.splice(index, 1)
    },
    handleDeleteLinkMan(record, index) {
      if (record.id) {
        deleteMerchatUser(record.id).then(_ => {
          this.$message.success('删除成功')
        })
      }
      this.linkManList.splice(index, 1)
    },
    handleAddBank() {
      this.bankList.push({})
    },
    handleAddLinkMan() {
      this.linkManList.push({})
    },
    async handleSubmit() {
      const sealMerchant = { ...this.formData, sealMerchantAccounts: this.bankList, sealMerchantUsers: this.linkManList }
      if (this.isUpdate && !this.isEmpty(this.updateRow)) {
        try {
          const modify = await updateMerchant(sealMerchant)
          this.$emit('ok')
          this.$emit('close')
          if (modify.code === 200) return this.$message.success(modify.msg)
        } catch (error) {
          this.$message.error(error.message)
        }
      } else {
        try {
          const success = await addMerchant(sealMerchant)
          this.$emit('ok')
          this.$emit('close')
          if (success.code === 200) return this.$message.success(success.msg)
        } catch (error) {
          this.$message.error(error.message)
        }
      }
    },
    handleCancel() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
.s-border-zero {
  font-size: 14px;
  font-weight: bold;
  color: rgb(0, 55, 235);
}
</style>
