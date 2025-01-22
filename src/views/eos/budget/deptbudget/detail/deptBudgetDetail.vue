<!-- 项目预算执行情况 -->
<template>
  <a-tabs default-active-key="0">
    <a-tab-pane v-for="(item, index) in budgetUserList" :key="index">
      <span slot="tab">
        {{ item.type }}
      </span>
      <s-descriptions title="基本信息" :formItems="formItems" :formData="item" />
      <s-table ref="table" rowKey="id" :columns="columns" :data="loadData(item.budgetTypeVos)" :show-pagination="false" />
    </a-tab-pane>
  </a-tabs>
</template>

<script lang="jsx">
import dictConfig from '/src/views/eos/config/dict.config.js'
import { budgetPassDept } from '/src/api/eos/budget/apply.js'
import { SDescriptions, STable, Ellipsis } from '/src/components/index.js'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  components: {
    SDescriptions,
    STable
  },
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dictKeys: [dictConfig.PROJECT_BUDGET_TYPE],
      dictMap: {},
      budgetUserList: [],
      formItems: [
        {
          label: '预算编号',
          prop: 'code'
        },
        {
          label: '部门名称',
          prop: 'sysDept.deptName'
        },
        {
          label: '预算类型',
          prop: 'type'
        },
        {
          label: '申请人',
          prop: 'createBy'
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
          title: '#',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '预算名称',
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
        {
          title: '金额(元)',
          dataIndex: 'sum',
          align: 'left',
          customRender: text => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '已使用(元)',
          dataIndex: 'useMoney',
          align: 'center',
          customRender: (text, record) => {
            return <a-tag color="blue">{this.toThousandFilter(text)}</a-tag>
          }
        },
        {
          title: '剩余金额(元)',
          dataIndex: 'sumLeft',
          align: 'left',
          customRender: text => {
            return <span style={{ color: 'red' }}>{this.toThousandFilter(text)}</span>
          }
        },
        {
          title: '备注',
          dataIndex: 'sealBudgetType.remark',
          align: 'center',
          customRender: text => {
            return text ? (
              <Ellipsis length={20} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
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
    this.getBudgetUse()
  },
  methods: {
    loadData(data) {
      return () => {
        return new Promise((resolve, reject) => {
          resolve({
            data
          })
        })
      }
    },
    getBudgetUse() {
      budgetPassDept({ orgId: this.row.sysDept.deptId, deptTime: this.row.deptTime }).then(res => {
        this.budgetUserList = res.data
      })
    }
  }
}
</script>
