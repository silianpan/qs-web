<!-- 预算详情 -->
<template>
  <div>
    <s-descriptions :title="title" :formItems="formItems" :formData="formData" />
    <!-- 数据表格 -->
    <a-card :bordered="false" size="small">
      <a-collapse expand-icon-position="right" defaultActiveKey="预算明细">
        <a-collapse-panel key="预算明细" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">预算明细</span>
          <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :show-pagination="false"> </s-table>
        </a-collapse-panel>
      </a-collapse>
    </a-card>
  </div>
</template>

<script lang="jsx">
import { SDescriptions, STable, Ellipsis } from '/src/components/index.js'
import { getOneApply } from '/src/api/eos/budget/budget.js'

export default {
  name: 'BudgetDetail',
  props: {
    formId: {
      type: Number,
      required: true
    },
    row: {
      type: Object,
      default: () => {}
    },
    isIndex: {
      type: Boolean,
      default: false
    }
  },
  components: {
    SDescriptions,
    STable
  },
  data() {
    return {
      dictKeys: [],
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time',
        tenantAppId: this.$store.getters.tenantAppId,
        menuId: this.$route.meta.moduleId
      },
      dictMap: {},
      merchantList: [],
      title: '项目详情',
      formData: {
        nickname: this.$store.getters.nickname
      },
      budgetTypeVOS: [],
      formItems: [
        {
          label: '预算编号',
          prop: 'code'
        },
        {
          label: `${this.isIndex ? '所属项目/部门' : '所属部门'}`,
          prop: 'sealProject.name',
          customRender: (text, record) => {
            return !record.deptTime ? (
              <Ellipsis length={64} tooltip>
                {record.sealProject.name}
              </Ellipsis>
            ) : (
              <Ellipsis length={64} tooltip>
                {record.deptTime.slice(0, 4) + '年' + record.sysDept.deptName}
              </Ellipsis>
            )
          }
        },
        {
          label: '预算类型',
          prop: 'type'
        },
        {
          label: '申请人',
          prop: 'sysUser.nickName'
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
        },
        {
          label: '是否预算管控',
          prop: 'isBudget'
        }
      ],
      columns: [
        {
          title: '预算科目',
          dataIndex: 'sealBudgetType.name',
          align: 'center'
        },
        // {
        //   title: '预算类型',
        //   dataIndex: 'type',
        //   align: 'center',
        //   customRender: text => {
        //     const ret = this.selectDictItem(this.dictMap[dictConfig.PROJECT_BUDGET_TYPE], text)
        //     return <a-tag color={ret.listClass}>{ret.dictLabel}</a-tag>
        //   }
        // },
        // {
        //   title: '说明',
        //   dataIndex: 'sealBudgetType.remark',
        //   align: 'center'
        // },
        {
          title: '金额(元)',
          dataIndex: 'sum',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
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
            data: this.budgetTypeVOS
          })
        })
      }
    }
  },
  created() {
    this.formData = this.row
    this.dictKeys.forEach(key => {
      this.getDicts(key).then(res => {
        this.$set(this.dictMap, key, res.data)
      })
    })
    getOneApply(this.formId).then(({ data: { budgetTypeVos } }) => {
      this.budgetTypeVOS = budgetTypeVos
      this.$nextTick(() => {
        this.$refs.table.refresh(true)
      })
    })
  }
}
</script>
