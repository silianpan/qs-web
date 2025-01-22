<!-- 项目详细 -->
<template>
  <div>
    <s-descriptions :title="title" :formItems="formItems" :formData="row" />
    <!-- 数据表格 -->
    <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :show-pagination="false"> </s-table>
  </div>
</template>

<script lang="jsx">
import dictConfig from '/src/views/eos/config/dict.config.js'
import { SDescriptions, STable } from '/src/components/index.js'
import { getLoan } from '/src/api/eos/repayment/loan.js'

export default {
  name: 'LoanDetail',
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
      dictKeys: [dictConfig.PROJECT_BUDGET_TYPE],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time',
        tenantAppId: this.$store.getters.tenantAppId,
        menuId: this.$route.meta.moduleId
      },
      dictMap: {},
      merchantList: [],
      title: '借款详情',
      formData: {},
      budgetTypeVOS: [],
      formItems: [
        {
          label: '申请单号',
          prop: 'code'
        },
        {
          label: '类型',
          prop: 'type'
        },
        {
          label: '申请人',
          prop: 'sysUser.nickName'
        },
        {
          label: '总金额(元)',
          prop: 'sum',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '借款事由',
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
      columns: [
        {
          title: '名称',
          dataIndex: 'loanName',
          align: 'center'
        },
        {
          title: '金额(元)',
          dataIndex: 'sum',
          align: 'left',
          customRender: (text, record) => {
            return <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#FF4500' }}>{text}</span>
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center'
        }
      ],
      loadData: param => {
        return getLoan(this.formId).then(res => {
          return {
            data: res.data.sealLoanDetails || []
          }
        })
        // return new Promise(resolve => {
        //   resolve({
        //     data: this.row.sealLoanDetails || []
        //   })
        // })
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
  }
}
</script>
