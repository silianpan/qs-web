<!-- 项目维度：统计分析 -->
<template>
  <div>
    <a-button type="primary" ghost icon="download" @click="handleExport">导出</a-button>
    <s-descriptions title="基本信息" :formItems="getDescItems" :formData="record" />
    <project-chart :projectId="projectId" />
  </div>
</template>

<script jsx='lang'>
import { SDescriptions } from '/src/components/index.js'
import { isManageProject } from '/src/views/eos/config/busUtil.js'
import { analystList, getExcelAnasylt } from '/src/api/eos/analysis/analyst.js'
import ProjectChart from '/src/views/eos/analysis/analysis-project.vue'

export default {
  components: {
    ProjectChart,
    SDescriptions
  },
  props: {
    projectId: {
      type: Number,
      required: true
    },
    projectType: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.listAnalyst()
  },
  methods: {
    listAnalyst() {
      analystList({ projectId: this.projectId, project: true }).then(res => {
        if (!this.isEmpty(res.rows)) {
          this.record = res.rows[0]
        }
      })
    },
    handleExport() {
      getExcelAnasylt({ projectId: this.projectId }).then(res => {
        this.download(res.msg)
      })
    }
  },
  data() {
    return {
      record: {},
      projectDescItems: [
        {
          label: '项目预估金额（元）',
          prop: 'budgetAmount',
          customRender: text => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '收入合同（元）',
          prop: 'incomeSum',
          customRender: text => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '支出合同（元）',
          prop: 'outcomeSum',
          customRender: text => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '项目支出总成本（元）',
          prop: 'totalExpense',
          customRender: text => {
            return this.toThousandFilter(text)
          }
        },
        // {
        //   label: '报销（元）',
        //   prop: 'expenseSum',
        //   customRender: text => {
        //     return this.toThousandFilter(text)
        //   }
        // },
        // {
        //   label: '采购（元）',
        //   prop: 'paymentSum',
        //   customRender: text => {
        //     return this.toThousandFilter(text)
        //   }
        // },
        {
          label: '开票（元）',
          prop: 'invoiceSum',
          customRender: text => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '实际收款（元）',
          prop: 'paymentRealSum',
          customRender: text => {
            return this.toThousandFilter(text)
          }
        }
      ]
    }
  },
  computed: {
    getDescItems() {
      let tmpList = []
      if (isManageProject(this.projectType)) {
        tmpList = [
          {
            label: '管理预算(总金额，元)',
            prop: 'budgetMageSum',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '管理预算(剩余，元)',
            prop: 'budgetMageSumLeft',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '报销(管理，元)',
            prop: 'expenseSumMage',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '开票(管理，元)',
            prop: 'invoiceSum',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '采购(管理，元)',
            prop: 'paymentSum',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '实际收款(管理，元)',
            prop: 'paymentRealSum',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },
          // {
          //   label: '资金计划(支出，元)',
          //   prop: 'fundOutSum'
          // },
          // {
          //   label: '资金计划(收入，元)',
          //   prop: 'fundInSum'
          // },
          {
            label: '人工成本(管理，元)',
            prop: 'laborSumMage',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },

          {
            label: '差旅成本(管理，元)',
            prop: 'onBusSumMage',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          }
          // {
          //   label: '机票(管理)',
          //   prop: 'planeSumMage'
          // }
        ]
      } else {
        tmpList = [
          {
            label: '销售预算（元）',
            prop: 'budgetSaleSum',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '销售预算(剩余，元)',
            prop: 'budgetSaleSumLeft',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },
          {},
          {
            label: '生产预算（元）',
            prop: 'budgetProdSum',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '生产预算(剩余，元)',
            prop: 'budgetProdSumLeft',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },
          {},
          {
            label: '报销总金额（元）',
            prop: 'expenseSum',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },
          // {
          //   label: '资金计划(支出，元)',
          //   prop: 'fundInSum'
          // },
          {
            label: '报销(生产，元)',
            prop: 'expenseSumProd',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '报销(销售，元)',
            prop: 'expenseSumSale',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },
          // {
          //   label: '资金计划(收入，元)',
          //   prop: 'fundOutSum'
          // },
          // {
          {
            label: '采购总金额（元）',
            prop: 'paymentSum',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '采购付款(生产，元)',
            prop: 'paymentSumProd',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '采购付款(销售，元)',
            prop: 'paymentSumSale',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '人工成本总金额（元）',
            prop: 'laborSum',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '人工成本(生产，元)',
            prop: 'laborSumProd',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '人工成本(销售，元)',
            prop: 'laborSumSale',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '差旅成本总金额（元）',
            prop: 'onBusSum',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '差旅成本(生产，元)',
            prop: 'onBusSumProd',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '差旅成本(销售，元)',
            prop: 'onBusSumSale',
            customRender: text => {
              return this.toThousandFilter(text)
            }
          }
          // {
          //   label: '机票总金额',
          //   prop: 'planeSum'
          // },
          // {
          //   label: '机票(生产)',
          //   prop: 'planeSumProd'
          // },
          // {
          //   label: '机票(销售)',
          //   prop: 'planeSumSale'
          // }
        ]
      }
      return this.projectDescItems.concat(tmpList)
    }
  }
}
</script>
