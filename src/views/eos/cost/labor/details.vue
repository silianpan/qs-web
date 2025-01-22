<!-- 项目详细 -->
<template>
  <div>
    <s-descriptions :title="title" :formItems="formItems" :formData="formData" />
    <!-- 数据表格 -->
    <div class="table">
      <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :show-pagination="false"> </s-table>
    </div>
    <a-row style="text-align: center" v-if="sealCostLabor">
      <a-col :span="6"
        >工时合计:<a-tag color="pink">
          {{ this.toThousandFilter(sealCostLabor.workHour) }}
        </a-tag></a-col
      >
      <a-col :span="6"
        >人工金额合计:<a-tag color="red">
          {{ this.toThousandFilter(sealCostLabor.labMoney) }}
        </a-tag></a-col
      >
      <a-col :span="6"
        >差补金额合计:<a-tag color="orange">
          {{ this.toThousandFilter(sealCostLabor.diffMoney) }}
        </a-tag></a-col
      >
      <a-col :span="6"
        >总计金额:<a-tag color="blue">
          {{ this.toThousandFilter(sealCostLabor.totalMoney) }}
        </a-tag></a-col
      >
    </a-row>
  </div>
</template>

<script lang="jsx">
import { SDescriptions, STable, Ellipsis } from '/src/components/index.js'

export default {
  name: 'LaborDetail',
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
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      merchantList: [],
      title: '项目详情',
      formData: {
        nickname: this.$store.getters.nickname
      },
      budgetTypeVOS: [],
      sealCostLabor: {},
      formItems: [
        {
          label: '上报编号',
          prop: 'orderCode',
          align: 'center'
        },
        {
          label: '上报人',
          prop: 'sysUser.nickName',
          align: 'center'
        },
        {
          label: '上报时间',
          prop: 'orderTime',
          align: 'center'
        },
        {
          label: '上报类型',
          prop: 'expenseType',
          align: 'center'
        },
        {
          label: '上报说明',
          prop: 'orderInfo',
          align: 'center',
          customRender: text => {
            return text ? (
              <Ellipsis length={100} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          label: '原始附件',
          prop: 'attachment',
          align: 'center',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        }
      ],
      columns: [
        {
          title: '#',
          dataIndex: 'oid',
          fixed: 'left',
          align: 'center',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '项目编号',
          dataIndex: 'projectCode',
          align: 'center'
        },
        {
          title: '项目',
          dataIndex: 'projectName',
          align: 'center'
        },
        {
          title: '工时(人/天)',
          dataIndex: 'workHour',
          align: 'center'
        },
        {
          title: '人工金额(元)',
          dataIndex: 'labMoney',
          align: 'left'
        },
        {
          title: '差补金额(元)',
          dataIndex: 'diffMoney',
          align: 'left'
        },
        {
          title: '合计金额(元)',
          dataIndex: 'totalMoney',
          align: 'left'
        },
        {
          title: '费用类型',
          dataIndex: 'expenseType',
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center'
        }
      ],
      loadData: param => {
        return new Promise(resolve => {
          resolve({
            data: this.row.sealCostLabors
          })
        })
      }
    }
  },
  created() {
    this.sealCostLabor = this.row.sealCostLabor
    this.formData = { ...this.row }
    this.formData.expenseType = '人工成本上报'
  }
}
</script>
<style lang="less" scoped>
.table {
  max-height: 550px;
  overflow: auto;
}
</style>
