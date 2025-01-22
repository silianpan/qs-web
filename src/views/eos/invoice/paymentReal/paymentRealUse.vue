<!-- 实际收款 -->
<template>
  <a-card :bordered="false">
    <!-- 查询表单 -->
    <div class="table-page-search-wrapper">
      <s-form search layout="inline" @search="$refs.table.refresh(true)" @reset="() => (this.queryParam = {})" :formItems="searchFormItems" :formData="queryParam"></s-form>
    </div>

    <!-- 数据表格 -->
    <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
      <p slot="expandedRowRender" slot-scope="record">
        <s-descriptions title="基本信息" :formItems="descItems" :formData="record" />
      </p>
    </s-table>
  </a-card>
</template>

<script>
import dictConfig from '/src/views/eos/config/dict.config.js'
import { listReal } from '/src/api/eos/invoice/real.js'
import { listMerchant } from '/src/api/eos/merchant/merchant.js'
import { SForm, STable, SDescriptions } from '/src/components/index.js'

export default {
  name: 'PaymentReal',
  components: {
    SForm,
    STable,
    SDescriptions
  },
  data() {
    return {
      dictKeys: [dictConfig.PROJECT_UNIT],
      dictMap: {},
      merchantList: [],
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      loadData: param => {
        return listReal(Object.assign({}, param, this.queryParam)).then(res => {
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
          type: 'select',
          label: '付款单位',
          prop: 'payeeId',
          valueAlias: 'id',
          labelAlias: 'name',
          options: () => this.merchantList
        },
        {
          type: 'select',
          label: '收款单位',
          prop: 'company',
          options: () => this.dictMap[dictConfig.PROJECT_UNIT]
        },
        {
          type: 'input',
          label: '合同名称',
          prop: 'contractName'
        }
      ],
      columns: [
        {
          title: '项目名称',
          dataIndex: 'projectName',
          customRender: (text, record) => record.projectName
        },
        {
          title: '项目编号',
          dataIndex: 'projectCode',
          customRender: (text, record) => record.projectCode
        },
        {
          title: '付款单位',
          dataIndex: 'company',
          customRender: (text, record) => record.company
        },
        {
          title: '收款年月',
          dataIndex: 'payTime',
          customRender: (text, record) => record.payTime
        },
        {
          title: '合同名称',
          dataIndex: 'contractName',
          customRender: (text, record) => record.contractName
        },
        {
          title: '实际收款金额(元)',
          align: 'left',
          dataIndex: 'payMoney',
          customRender: (text, record) => this.toThousandFilter(record.payMoney)
        }
      ],
      descItems: [
        {
          label: '合同编号',
          prop: 'contractCode'
        },
        {
          label: '合同总金额',
          prop: 'contractSum',
          customRender: (text, record) => this.toThousandFilter(text)
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ]
    }
  },
  created() {
    this.dictKeys.forEach(key => {
      this.getDicts(key).then(res => {
        this.$set(this.dictMap, key, res.data)
      })
    })
    listMerchant().then(res => {
      this.merchantList = res.rows
    })
  }
}
</script>
