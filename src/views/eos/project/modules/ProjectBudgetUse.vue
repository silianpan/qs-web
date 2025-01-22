<!-- 项目预算执行情况 -->
<template>
  <a-tabs default-active-key="0">
    <a-tab-pane v-for="(item, index) in budgetUserList" :key="index">
      <span slot="tab">
        {{ item.type }}
        <!-- <AuditStatusTag :state="item.state"/> -->
      </span>
      <s-descriptions title="基本信息" :formItems="formItems" :formData="item" />
      <s-table ref="table" rowKey="id" :columns="columns" :data="loadData(item.budgetTypeVos)" :show-pagination="false" />
    </a-tab-pane>
    <!-- <a-tab-pane>
      <span slot="tab">
        <audit-status-tag :state="budgetUserList.state" />
      </span>
      <s-descriptions title="基本信息" :formItems="formItems" :formData="budgetUserList" />
      <s-table ref="table" rowKey="id" :columns="columns" :data="loadData(budgetUserList.budgetTypeVos)" :show-pagination="false" />
    </a-tab-pane> -->
  </a-tabs>
</template>

<script lang="jsx">
import dictConfig from '/src/views/eos/config/dict.config.js'
import { budgetPass } from '/src/api/eos/budget/apply.js'
import { SDescriptions, STable, Ellipsis } from '/src/components/index.js'
import ProjectBudgetUseDetail from './ProjectBudgetUseDetail.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  components: {
    SDescriptions,
    STable
  },
  props: {
    // 项目ID
    projectId: {
      type: Number,
      default: null
    },
    orgId: {
      type: Number,
      default: null
    },
    deptTime: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dictKeys: [dictConfig.PROJECT_BUDGET_TYPE],
      dictMap: {},
      budgetUserList: [],
      formItems: [
        {
          label: '预算金额合计(元)',
          prop: 'sum',
          customRender: text => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '已使用金额合计(元)',
          prop: 'resTotal',
          customRender: text => {
            return <a-tag color="blue">{this.toThousandFilter(text)}</a-tag>
          }
        },
        {
          label: '剩余金额合计(元)',
          prop: 'sumLeft',
          customRender: text => {
            return <a-tag color="red">{this.toThousandFilter(text)}</a-tag>
          }
        },
        {
          label: '附件',
          prop: 'attachment',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        },
        {
          label: '审批状态',
          prop: 'state',
          customRender: text => {
            return <AuditStatusTag state={text} />
          }
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
            return (
              <a-tag color="blue" style="cursor: pointer" onClick={() => this.handleUseMoney(record)}>
                {this.toThousandFilter(text)}
              </a-tag>
              // <a-tag color="blue">{this.toThousandFilter(text)}</a-tag>
            )
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
      if (this.projectId) {
        budgetPass({ projectId: this.projectId }).then(res => {
          this.budgetUserList = res.data
        })
      } else {
        budgetPass({ orgId: this.orgId, deptTime: this.deptTime }).then(res => {
          this.budgetUserList = res.data
        })
      }
    },
    handleUseMoney(row) {
      const tmpProp = { budgetType: row.type, expenseType: row.sealBudgetType.name, budgetTypeId: row.typeId }
      if (this.projectId) {
        tmpProp.projectId = row.projectId
        tmpProp.projectCode = this.budgetUserList[0].sealProject.code
      } else {
        tmpProp.deptId = this.orgId
        tmpProp.deptTime = this.deptTime
      }
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '预算执行明细',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: ProjectBudgetUseDetail,
          props: tmpProp
        }
      })
    }
  },
  watch: {
    projectId() {
      this.getBudgetUse()
    }
  }
}
</script>
