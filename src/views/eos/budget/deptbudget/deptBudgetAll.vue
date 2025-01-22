<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="year-select">
        预算年份：<a-select :default-value="queryParam.deptTime" @change="change" style="width: 120px">
          <a-select-option v-for="(item, index) in dataYears" :key="index">{{ item }}</a-select-option>
        </a-select>
      </div>
      <no-data v-show="noData"></no-data>
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData"> </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import moment from 'moment'
import { allDeptBudget } from '/src/api/eos/budget/budget.js'
import NoData from '../../../../components/exception/NoData.vue'
import deptBudgetDetail from './detail/deptBudgetDetail.vue'
import { STable } from '/src/components/index.js'
export default {
  components: { NoData, STable },
  data() {
    return {
      dataYears: [],
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
        menuId: this.$route.meta.moduleId,
        deptTime: new Date().getFullYear()
      },
      loadData: param => {
        return allDeptBudget(Object.assign({}, param, this.queryParam)).then(res => {
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
          dataIndex: 'sysDept.deptName'
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
  created() {
    // 年份选择范围为2017年到当前年份以及往后5年
    const nowYear = new Date().getFullYear()
    const num = nowYear - 2017
    for (let index = num * -1; index <= 5; index++) {
      this.dataYears.push(moment().subtract(index, 'year').format('yyyy'))
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
    },
    change(index) {
      this.queryParam.deptTime = this.dataYears[index]
      this.$refs.table.refresh()
    }
  }
}
</script>

<style>
.year-select {
  margin-bottom: 10px;
}
</style>
