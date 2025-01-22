<!--部门预算-->
<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <no-data v-show="noData"></no-data>
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData"> </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import { personalDeptBudget } from '/src/api/eos/budget/budget.js'
import NoData from '../../../../components/exception/NoData.vue'
import deptBudgetDetail from './detail/deptBudgetDetail.vue'
import { STable } from '/src/components/index.js'
export default {
  components: { NoData, STable },
  data() {
    return {
      noData: false,
      rowClick: record => ({
        on: {
          click: () => {
            this.handleDetail(record)
          }
        },
        style: {
          cursor: 'pointer'
        }
      }),
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time',
        tenantAppId: this.$store.getters.tenantAppId,
        menuId: this.$route.meta.moduleId
      },
      loadData: param => {
        return personalDeptBudget(Object.assign({}, param, this.queryParam)).then(res => {
          this.noData = res.total === 0
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      columns: [
        {
          title: '部门',
          align: 'center',
          dataIndex: 'sysDept.deptName',
          customRender: (text, record) => {
            const year = record.createdTime.slice(0, 4)
            return (
              <Ellipsis length={16} tooltip>
                {year + '年' + text}
              </Ellipsis>
            )
          }
        },
        {
          title: '预算年份',
          align: 'center',
          dataIndex: 'deptTime'
        },
        {
          title: '是否预算管控',
          align: 'center',
          dataIndex: 'isBudget'
        },
        {
          title: '预算类型',
          align: 'center',
          dataIndex: 'type'
        },

        {
          title: '预算总金额(元)',
          align: 'left',
          dataIndex: 'sum'
        },
        {
          title: '预算剩余金额(元)',
          align: 'left',
          dataIndex: 'sumLeft'
        }
      ]
    }
  },
  methods: {
    handleDetail(row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '部门预算详情',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: deptBudgetDetail,
          props: {
            row
          }
        }
      })
    }
  }
}
</script>
