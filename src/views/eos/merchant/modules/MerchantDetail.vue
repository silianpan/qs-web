<!-- 客商详情 -->
<template>
  <div>
    <s-descriptions title="基本信息" :formItems="formItems" :formData="formData" />
    <a-card :bordered="false" size="small">
      <a-collapse expand-icon-position="right" defaultActiveKey="银行账户">
        <a-collapse-panel key="银行账户" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">银行账户</span>
          <s-table ref="tableBank" size="default" rowKey="id" :columns="bankColumns" :data="loadDataBank" :show-pagination="false" />
        </a-collapse-panel>
        <a-collapse-panel key="联系人" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">联系人</span>
          <s-table ref="tableLinkMan" size="default" rowKey="id" :columns="linkManColumns" :data="loadDataLinkMan" :show-pagination="false" />
        </a-collapse-panel>
      </a-collapse>
    </a-card>
  </div>
</template>

<script lang="jsx">
import { getMerchant } from '/src/api/eos/merchant/merchant.js'
import STable from '/src/components/Table/index.jsx'
import SDescriptions from '/src/components/Descriptions/index.jsx'

export default {
  name: 'MerchantDetail',
  components: {
    SDescriptions,
    STable
  },
  props: {
    formId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      formData: {},
      bankList: [],
      linkManList: [],
      loadDataBank: () => {
        return new Promise(resolve => resolve({ data: this.bankList }))
      },
      loadDataLinkMan: () => {
        return new Promise(resolve => resolve({ data: this.linkManList }))
      },
      formItems: [
        {
          label: '客商名称',
          prop: 'name'
        },
        {
          label: '编号',
          prop: 'serial'
        },
        {
          label: '客商类型',
          prop: 'type'
        },
        {
          label: '地址',
          prop: 'address'
        },
        {
          label: '税号',
          prop: 'taxNumber'
        },
        {
          label: '纳税人类别',
          prop: 'taxpayerType'
        },
        {
          label: '备注',
          prop: 'remark'
        },
        {
          label: '附件',
          prop: 'attachment',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        }
      ],
      bankColumns: [
        {
          title: '银行账号',
          dataIndex: 'account',
          align: 'center'
        },
        {
          title: '账号名称',
          dataIndex: 'accountName',
          align: 'center'
        },
        {
          title: '开户银行',
          dataIndex: 'bank',
          align: 'center'
        }
      ],
      linkManColumns: [
        {
          title: '联系人',
          dataIndex: 'name',
          align: 'center'
        },
        {
          title: '联系方式',
          dataIndex: 'link',
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center'
        }
      ]
    }
  },
  mounted() {
    // 查询明细
    getMerchant(this.formId).then(res => {
      this.formData = { ...res.data }
      this.bankList = res.data.sealMerchantAccounts || []
      this.linkManList = res.data.sealMerchantUsers || []
      this.$refs.tableBank.refresh(true)
      // this.$refs.tableLinkMan.refresh(true)
    })
  }
}
</script>
