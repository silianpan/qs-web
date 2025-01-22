<!-- 预算综合查询 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <s-search
        placeholder="搜索此列表..."
        clickTips="搜索部门名称/编号/申请人"
        @onSearch="onSearch"
        @clickquery="clickquery"
        @reset="() => (this.queryParam = { isAsc: 'desc', orderByColumn: 'create_time', tenantAppId: this.$store.getters.tenantAppId, menuId: this.$route.meta.moduleId })"
        :formItems="searchFormItems"
        :formData="queryParam"
      />
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData"> </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import dictConfig from '/src/views/eos/config/dict.config.js'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import { allDeptBudget } from '/src/api/eos/budget/budget.js'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import BudgetDetail from './detailAll.vue'

export default {
  name: 'ProjectList',
  components: {
    STable,
    SSearch
  },
  data() {
    return {
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
      /* 是否有数据 */
      noData: false,
      dictConfig,
      // 是否展示卡片列表
      dictKeys: [dictConfig.PROJECT_BUDGET_TYPE],
      dictMap: {},
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time',
        tenantAppId: this.$store.getters.tenantAppId,
        menuId: this.$route.meta.moduleId
      },
      /* 当前查询的按钮 */
      current: '',
      // 加载数据方法 必须为 Promise 对象
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
      searchFormItems: [
        {
          type: 'input',
          prop: 'nickName',
          label: '申请人'
        },
        {
          type: 'input',
          prop: 'deptName',
          label: '部门名称'
        },
        {
          type: 'input',
          prop: 'code',
          label: '预算申请单编号'
        },
        {
          type: 'select',
          prop: 'type',
          label: '预算类型',
          options: item => this.dictMap[dictConfig.PROJECT_BUDGET_TYPE]
        }
      ],
      columns: [
        {
          title: '申请人',
          dataIndex: 'sysUser.nickName',
          align: 'left'
        },
        {
          title: '所属部门',
          dataIndex: 'sysDept.deptName',
          align: 'left',
          customRender: (text, record) => {
            return  (
              <Ellipsis length={64} tooltip>
                {record.deptTime.slice(0, 4) + '年' + record.sysDept.deptName}
              </Ellipsis>
            )
          }
        },
        {
          title: '预算编号',
          dataIndex: 'code',
          align: 'left'
        },
        {
          title: '预算总金额(元)',
          dataIndex: 'sum',
          align: 'left',
          customRender: text => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '预算类型',
          dataIndex: 'type',
          align: 'left'
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          align: 'left',
          customRender: (text, record) => {
            return <AuditStatusTag clickable="" state={text} instanceId={record.sealWorkflow.instanceId} />
          }
        }
      ]
    }
  },
  created() {
    // 查询字典
    this.dictKeys.forEach(key => {
      this.getDicts(key).then(res => {
        this.$set(this.dictMap, key, res.data)
      })
    })
  },
  methods: {
    // 刷新页面
    refresh() {
      this.$refs.table.refresh(true)
    },
    // 重置查询参数
    reset() {
      this.queryParam = { isAsc: 'desc', orderByColumn: 'create_time' }
    },
    handleDetail(row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '预算详情',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: BudgetDetail,
          props: {
            row,
            formId: row.id
          }
        }
      })
    },
    /* 查询按钮 */
    clickquery(param) {
      this.queryParam = { ...this.queryParam, orderByColumn: 'create_time' }
      this.refresh()
    },
    /* 查询按钮 */
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    }
  }
}
</script>
<style lang="less" scoped>
::v-deep .ant-card-meta-title {
  margin-top: 10px !important;
}
.cardStyle {
  box-shadow: rgba(0, 0, 0, 0.24) 2px 2px 4px;
}
.context {
  margin-bottom: 10px;
}
.footerButton {
  position: absolute;
  box-sizing: border-box;
  padding: 5px;
  padding: 0 10px;
  width: 100%;
  bottom: 0;
  left: 0;
  background-color: #eff5ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search {
  display: flex;
}
.inputquery {
  margin-right: 20px;
  width: 500px;
}
.queryList {
  display: flex;
  padding: 0;
  margin-right: 30px;
  li {
    text-align: center;
    padding: 4px;
    width: 80px;
    height: 31px;
    border: 1px solid #ccc;
    cursor: pointer;
    &:not(.current):hover {
      color: #13c2c2;
      border: 1px solid #13c2c2;
    }
  }
}
.current {
  color: white;
  background-color: #13c2c2;
  border: 1px solid #13c2c2;
}
tr.ant-table-expanded-row td > .ant-table-wrapper {
  margin: 0;
}
</style>
