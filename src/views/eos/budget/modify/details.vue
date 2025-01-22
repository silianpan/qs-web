<!-- 项目详细 -->
<template>
  <div>
    <s-descriptions :title="title" :formItems="formItems" :formData="formData" />
    <!-- 数据表格 -->
    <a-card :bordered="false" size="small">
      <a-collapse expand-icon-position="right" defaultActiveKey="变更明细">
        <a-collapse-panel key="变更明细" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">变更明细</span>
          <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :show-pagination="false"> </s-table>
        </a-collapse-panel>
      </a-collapse>
    </a-card>
  </div>
</template>

<script lang="jsx">
import dictConfig from '/src/views/eos/config/dict.config.js'
import { SDescriptions, STable, Ellipsis } from '/src/components/index.js'
import moment from 'moment'

export default {
  name: 'BudgetModifyDetail',
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
        orderByColumn: 'create_time'
      },
      dictMap: {},
      merchantList: [],
      title: '预算变更详情',
      formData: {},
      // 变更明细
      tsealBudgetVo: [],
      formItems: [
        {
          label: '项目编号',
          prop: 'code'
        },
        {
          label: '所属项目/部门',
          prop: 'sealProject.name',
          customRender: (text, record) => {
            return record.budgetApplyVo.sealProject ? (
              <Ellipsis length={64} tooltip>
                {record.budgetApplyVo.sealProject.name}
              </Ellipsis>
            ) : (
              <Ellipsis length={64} tooltip>
                {record.budgetApplyVo.deptTime.slice(0, 4) + '年' + record.budgetApplyVo.sysDept.deptName}
              </Ellipsis>
            )
          }
        },
        {
          label: '申请人',
          prop: 'sysUser.nickName'
        },
        {
          label: '变更附件',
          prop: 'newAttachment',
          customRender: (text, record) => {
            return <s-doc-list text={record.newAttachment} />
          }
        },
        {
          label: '变更日期',
          prop: 'createTime',
          customRender: text => moment(text).format('YYYY-MM-DD')
        },
        {
          label: '变更原因',
          prop: 'changeReason'
        }
      ],
      columns: [
        {
          title: '类型名称',
          dataIndex: 'sealBudgetType.name',
          align: 'center'
        },
        {
          title: '变更前金额(元)',
          dataIndex: 'oldSum',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '变更后金额(元)',
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
            data: this.tsealBudgetVo
          })
        })
      }
    }
  },
  created() {
    // 变更后附件
    const newAttachment = this.row.tsealBudgetVo[0].attachment
    this.formData.newAttachment = newAttachment
    this.formData = { ...this.row, ...this.formData }

    this.tsealBudgetVo = [...this.row.tsealBudgetVo]
    this.tsealBudgetVo = this.tsealBudgetVo.filter(item => {
      return item.oldSum !== item.sum
    })
    // 查询字典
    this.dictKeys.forEach(key => {
      this.getDicts(key).then(res => {
        this.$set(this.dictMap, key, res.data)
      })
    })
  }
}
</script>
