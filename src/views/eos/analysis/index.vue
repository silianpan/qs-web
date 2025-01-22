<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <!-- 查询表单 -->
      <div class="table-page-search-wrapper">
        <s-form search layout="inline" @search="refresh" @reset="reset" :formItems="searchFormItems" :formData="queryParam"> </s-form>
      </div>

      <!-- 业务操作按钮 -->
      <div class="table-operations">
        <a-button type="primary" ghost icon="download" @click="handleExport">导出项目数据</a-button>
        <a-button type="dashed" shape="circle" :style="{ float: 'right' }" icon="reload" @click="$refs.table.refresh(true)" />
      </div>

      <!-- 数据表格 -->
      <s-table v-if="!isShowCardList" :customRow="rowClick" ref="table" size="default" rowKey="projectId" :columns="columns" :data="loadData">
        <p slot="expandedRowRender" slot-scope="record">
          <s-descriptions title="基本信息" :formItems="getDescItems(record.type)" :formData="record" />
        </p>
        <span slot="action" slot-scope="text, record, index">
          <a-button type="link" @click.stop="chartAnalyst(text, record, index)"> <a-icon type="bar-chart" />图表分析 </a-button>
          <a-button type="link" @click.stop="handleExportItem(record)"> <a-icon type="download" /> 导出</a-button>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import moment from 'moment'
import AnalysisProject from './analysis-project.vue'
import { analystList, getExcelAnasylt, exportAllOut } from '/src/api/eos/analysis/analyst.js'
import { isManageProject } from '/src/views/eos/config/busUtil.js'
import { SForm, STable, SDescriptions } from '/src/components/index.js'
import { getProject } from '/src/api/eos/project/project.js'
import porjectFrom from '/src/views/eos/project/detailAll.vue'

export default {
  name: 'Analyst',
  components: {
    STable,
    SForm,
    SDescriptions
  },
  data() {
    return {
      rowClick: record => ({
        on: {
          click: () => {
            this.handleDetail(record.projectId)
          }
        },
        style: {
          cursor: 'pointer'
        }
      }),
      // 是否展示卡片列表
      isShowCardList: false,
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      // 加载数据方法
      loadData: param => {
        const QueryParams = { ...this.queryParam }
        if (!this.isEmpty(QueryParams.startTime)) {
          QueryParams.startTime = moment(QueryParams.startTime).format('YYYY-MM-DD HH:MM:SS')
        }
        if (!this.isEmpty(QueryParams.endTime)) {
          QueryParams.endTime = moment(QueryParams.endTime).format('YYYY-MM-DD HH:MM:SS')
        }
        return analystList(Object.assign({}, param, QueryParams)).then(res => {
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
          prop: 'projectName',
          label: '项目名称'
        },
        {
          type: 'datePicker',
          label: '项目时间',
          prop: 'startTime'
        },
        {
          type: 'datePicker',
          label: '项目结束时间',
          prop: 'endTime'
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
          dataIndex: 'projectCode'
        },
        {
          title: '项目预估金额(元)',
          align: 'left',
          dataIndex: 'budgetAmount',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '收入合同(元)',
          dataIndex: 'incomeSum',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '支出合同(元)',
          dataIndex: 'outcomeSum',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        // {
        //   title: '报销(元)',
        //   dataIndex: 'expenseSum',
        //   customRender: (text, record) => {
        //     return this.toThousandFilter(text)
        //   }
        // },
        // {
        //   title: '采购(元)',
        //   dataIndex: 'paymentSum',
        //   customRender: (text, record) => {
        //     return this.toThousandFilter(text)
        //   }
        // },
        // {
        //   title: '开票(元)',
        //   dataIndex: 'invoiceSum',
        //   customRender: (text, record) => {
        //     return this.toThousandFilter(text)
        //   }
        // },
        // {
        //   title: '实际收款(元)',
        //   dataIndex: 'paymentRealSum',
        //   customRender: (text, record) => {
        //     return this.toThousandFilter(text)
        //   }
        // },
        {
          title: '销售预算(已使用，元)',
          dataIndex: 'budgetSaleSumUse',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '生产预算(已使用，元)',
          dataIndex: 'budgetProdSumUse',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '管理预算(已使用，元)',
          dataIndex: 'budgetMageSumUse',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '操作',
          width: 160,
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    // 刷新页面
    refresh() {
      this.isShowCardList ? this.$refs.list.refresh(true) : this.$refs.table.refresh(true)
    },
    // 重置查询参数
    reset() {
      this.queryParam = {}
    },
    getDescItems(projectType) {
      if (isManageProject(projectType)) {
        return [
          {
            label: '管理预算(总金额，元)',
            prop: 'budgetMageSum',
            customRender: (text, record) => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '管理预算(剩余，元)',
            prop: 'budgetMageSumLeft',
            customRender: text => this.toThousandFilter(text)
          },
          {
            label: '报销(管理，元)',
            prop: 'expenseSumMage',
            customRender: text => this.toThousandFilter(text)
          },
          {
            label: '开票(总金额，元)',
            prop: 'invoiceSum',
            customRender: text => this.toThousandFilter(text)
          },
          {
            label: '采购(管理，元)',
            prop: 'paymentSum',
            customRender: text => this.toThousandFilter(text)
          },
          {
            label: '实际收款(管理，元)',
            prop: 'paymentRealSum',
            customRender: text => this.toThousandFilter(text)
          },
          // {
          //   label: '资金计划(支出，元)',
          //   prop: 'fundOutSum',
          //   customRender: text => this.toThousandFilter(text)
          // },
          // {
          //   label: '资金计划(收入，元)',
          //   prop: 'fundInSum',
          //   customRender: text => this.toThousandFilter(text)
          // },
          {
            label: '人工成本(管理，元)',
            prop: 'laborSumMage',
            customRender: text => this.toThousandFilter(text)
          },

          {
            label: '差旅成本(管理，元)',
            prop: 'onBusSumMage',
            customRender: text => this.toThousandFilter(text)
          }
          // {
          //   label: '机票(管理)',
          //   prop: 'planeSumMage'
          // }
        ]
      } else {
        return [
          {
            label: '销售预算(元)',
            prop: 'budgetSaleSum'
          },
          {
            label: '销售预算(剩余，元)',
            prop: 'budgetSaleSumLeft'
          },
          {
            label: '生产预算(元)',
            prop: 'budgetProdSum'
          },
          {
            label: '生产预算(剩余，元)',
            prop: 'budgetProdSumLeft'
          },
          {
            label: '报销(总金额，元)',
            prop: 'expenseSum',
            customRender: (text, record) => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '报销(生产，元)',
            prop: 'expenseSumProd',
            customRender: (text, record) => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '报销(销售，元)',
            prop: 'expenseSumSale',
            customRender: (text, record) => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '开票(总金额，元)',
            prop: 'invoiceSum',
            customRender: (text, record) => {
              return this.toThousandFilter(text)
            }
          },

          {
            label: '实际收款(总金额，元)',
            prop: 'paymentRealSum',
            customRender: (text, record) => {
              return this.toThousandFilter(text)
            }
          },
          // {
          //   label: '资金计划(支出，元)',
          //   prop: 'fundOutSum',
          //   customRender: (text, record) => {
          //     return this.toThousandFilter(text)
          //   }
          // },
          // {
          //   label: '资金计划(收入，元)',
          //   prop: 'fundInSum',
          //   customRender: (text, record) => {
          //     return this.toThousandFilter(text)
          //   }
          // },
          {
            label: '采购(总金额，元)',
            prop: 'paymentSum',
            customRender: (text, record) => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '采购付款(生产，元)',
            prop: 'paymentSumProd',
            customRender: (text, record) => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '采购付款(销售，元)',
            prop: 'paymentSumSale',
            customRender: (text, record) => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '人工成本(总金额，元)',
            prop: 'laborSum',
            customRender: (text, record) => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '人工成本(生产，元)',
            prop: 'laborSumProd',
            customRender: (text, record) => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '人工成本(销售，元)',
            prop: 'laborSumSale',
            customRender: (text, record) => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '差旅成本(总金额，元)',
            prop: 'onBusSum',
            customRender: (text, record) => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '差旅成本(生产，元)',
            prop: 'onBusSumProd',
            customRender: (text, record) => {
              return this.toThousandFilter(text)
            }
          },
          {
            label: '差旅成本(销售，元)',
            prop: 'onBusSumSale',
            customRender: (text, record) => {
              return this.toThousandFilter(text)
            }
          }
          // {
          //   label: '机票(总金额)',
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
    },
    chartAnalyst(text, record, index) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '项目数据分析',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: AnalysisProject,
          props: {
            projectId: record.projectId
          }
        }
      })
    },
    /** 导出按钮操作 */
    handleExport(text, record) {
      this.$antdconfirm({
        title: '导出',
        content: '是否导出报表分析数据?',
        onOk: () => {
          const QueryParams = { ...this.queryParam }
          if (!this.isEmpty(QueryParams.startTime)) {
            QueryParams.startTime = moment(QueryParams.startTime).format('YYYY-MM-DD')
          }
          if (!this.isEmpty(QueryParams.endTime)) {
            QueryParams.endTime = moment(QueryParams.endTime).format('YYYY-MM-DD')
          }
          return getExcelAnasylt(Object.assign({}, QueryParams)).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /** 详情 */
    handleDetail(row) {
      return getProject(row).then(res => {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '项目详情',
            width: '80%',
            maskClosable: true
          },
          content: {
            template: porjectFrom,
            props: {
              row: res.data
            }
          }
        })
      })
    },
    /* 导出一项 */
    handleExportItem(record) {
      this.$antdconfirm({
        title: '导出',
        content: '是否确认导出编号为 ' + record.projectCode + ' 的项目数据?',
        onOk: () => {
          return exportAllOut(record.projectId).then(res => {
            this.download(res.msg)
          })
        }
      })
    }
  }
}
</script>
