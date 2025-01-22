<!-- 项目详细 -->
<template>
  <div>
    <a-steps class="contract-modify-detail-step" progress-dot :current="current">
      <a-step v-for="item in steps" :key="item.title" :title="item.title" />
    </a-steps>
    <div v-show="current === 0">
      <s-descriptions title="合同详情" :formItems="formItems" :formData="formData" />
      <s-descriptions v-if="row.aftContract.efficacy === '有效'" title="变更前" :formItems="formItemsBefore" :formData="formDataBefore" />
      <s-descriptions v-if="row.aftContract.efficacy === '有效'" title="变更后" :formItems="formItemsAfter" :formData="formDataAfter" />
    </div>
    <div v-show="current === 1" class="border">
      <div>
        <h2 class="title">变更前合同阶段</h2>
        <s-table ref="baseStageTable" size="default" :rowKey="(_, index) => index" :columns="baseStageColumns" :data="baseContractStagesLoadData" :showPagination="false"> </s-table>
      </div>
      <div style="margin-top: 100px">
        <h2 class="title">变更后合同阶段</h2>
        <s-table ref="aftStageTable" size="default" :rowKey="(_, index) => index" :columns="aftStageColumns" :data="aftContractStagesLoadData" :showPagination="false"> </s-table>
      </div>
    </div>
    <div v-show="current === 2">
      <div>
        <h2 class="title">变更前合同清单</h2>
        <s-table ref="baseAmountTable" size="default" :rowKey="(_, index) => index" :columns="baseAmountColumns" :data="baseAmountLoadData" :showPagination="false"> </s-table>
      </div>
      <div style="margin-top: 100px">
        <h2 class="title">变更后合同清单</h2>
        <s-table ref="aftAmountTable" size="default" :rowKey="(_, index) => index" :columns="aftAmountColumns" :data="aftAmountLoadData" :showPagination="false"> </s-table>
      </div>
    </div>

    <div class="steps-action">
      <a-button v-if="current > 0" style="margin-left: 8px" @click="current--"> 上一步 </a-button>
      <a-button v-if="current < steps.length - 1" type="primary" @click="current++"> 下一步 </a-button>
    </div>
  </div>
</template>

<script lang="jsx">
import { SDescriptions, Ellipsis, STable } from '/src/components/index.js'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import moment from 'moment'

export default {
  name: 'ContractModifyDetail',
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
      current: 0,
      steps: [
        {
          title: '合同变更详情'
        },
        {
          title: '合同阶段变更详情'
        },
        {
          title: '合同清单变更详情'
        }
      ],
      // 变更前清单
      prevAmounts: [],
      baseAmountColumns: [
        {
          title: '#',
          dataIndex: 'oid',
          align: 'center',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '清单类型',
          dataIndex: 'type',
          align: 'center'
        },
        {
          title: '名字',
          dataIndex: 'name',
          align: 'center'
        },
        {
          title: '描述',
          dataIndex: 'description',
          align: 'center',
          width: 150
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center'
        },
        {
          title: '数量',
          dataIndex: 'amount',
          align: 'center'
        },
        {
          title: '单价',
          dataIndex: 'price',
          align: 'center'
        },
        {
          title: '总价',
          dataIndex: 'totalPrice',
          align: 'center'
        }
      ],
      baseAmountLoadData: param => {
        return new Promise(resolve => resolve(param)).then(param => {
          return {
            data: this.prevAmounts
          }
        })
      },
      // 变更后清单
      aftAmountList: [],
      aftAmountColumns: [
        {
          title: '#',
          dataIndex: 'oid',
          align: 'center',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '清单类型',
          dataIndex: 'type',
          align: 'center'
        },
        {
          title: '名字',
          dataIndex: 'name',
          align: 'center'
        },
        {
          title: '描述',
          dataIndex: 'description',
          align: 'center',
          width: 150
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center'
        },
        {
          title: '数量',
          dataIndex: 'amount',
          align: 'center'
        },
        {
          title: '单价',
          dataIndex: 'price',
          align: 'center'
        },
        {
          title: '总价',
          dataIndex: 'totalPrice',
          align: 'center'
        }
      ],
      aftAmountLoadData: param => {
        return new Promise(resolve => resolve(param)).then(param => {
          return {
            data: this.aftAmountList
          }
        })
      },
      // 变更前合同阶段
      prevStages: [],
      // 合同阶段列
      baseStageColumns: [
        {
          title: '#',
          dataIndex: 'sn',
          align: 'center'
        },
        {
          title: '阶段名称',
          dataIndex: 'name',
          align: 'center',
          width: 160
        },
        {
          title: '阶段内容',
          dataIndex: 'content',
          align: 'center'
        },
        {
          title: '金额(元)',
          dataIndex: 'money',
          align: 'left'
        },
        {
          title: '比例(%)',
          dataIndex: 'percent',
          align: 'center'
        },
        {
          title: '截止日期',
          dataIndex: 'endDate',
          align: 'center',
          width: 260
        }
      ],
      // 合同阶段
      baseContractStagesLoadData: param => {
        return new Promise(resolve => resolve(param)).then(param => {
          return {
            data: this.prevStages,
            totalCount: this.prevStages.length
          }
        })
      },
      // 变更后合同阶段
      aftContractStages: [],
      // 合同阶段列
      aftStageColumns: [
        {
          title: '#',
          dataIndex: 'sn',
          align: 'center'
        },
        {
          title: '阶段名称',
          dataIndex: 'name',
          align: 'center',
          width: 160
        },
        {
          title: '阶段内容',
          dataIndex: 'content',
          align: 'center'
        },
        {
          title: '金额(元)',
          dataIndex: 'money',
          align: 'left'
        },
        {
          title: '比例(%)',
          dataIndex: 'percent',
          align: 'center'
        },
        {
          title: '截止日期',
          dataIndex: 'endDate',
          align: 'center',
          width: 260
        }
      ],
      // 合同阶段
      aftContractStagesLoadData: param => {
        return new Promise(resolve => resolve(param)).then(param => {
          return {
            data: this.aftContractStages,
            totalCount: this.aftContractStages.length
          }
        })
      },
      formData: {},
      formItemsBefore: [],
      formDataBefore: {},
      formItemsAfter: [],
      formDataAfter: {},
      // 变更明细
      tsealBudgetVo: [],
      formItems: [
        // {
        //   label: '申请人',
        //   prop: 'nickName',
        //   customRender: text => {
        //     return this.row.sysUser.nickName
        //   }
        // },
        {
          label: '合同编号',
          prop: 'code'
        },
        {
          label: '合同名称',
          prop: 'name',
          customRender: text => {
            return (
              <Ellipsis length={15} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          label: '合同类型',
          prop: 'type',
          customRender: text => {
            return <a-tag color="blue">{text}</a-tag>
          }
        },
        {
          label: '合同性质',
          prop: 'contractProp'
        },
        // {
        //   label: '所属项目',
        //   prop: 'projectName',
        //   formatter: val => {
        //     return this.row.contractToP.name
        //   }
        // },
        {
          label: '金额(元)',
          prop: 'sum'
        },
        {
          label: '甲方',
          prop: 'firstParty'
        },
        {
          label: '乙方',
          prop: 'secondParty'
        },
        {
          label: '签订日期',
          prop: 'signingDate'
        },
        {
          label: '附件',
          prop: 'attachment',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        },
        {
          label: '备注',
          prop: 'remark',
          customRender: text => {
            return (
              <Ellipsis length={24} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          label: '审批状态',
          prop: 'state',
          customRender: text => {
            return <AuditStatusTag state={text} />
          }
        },
        {
          label: '变更类型',
          prop: 'efficacy'
        },
        {
          label: '变更日期',
          prop: 'changeTime',
          customRender: text => moment(text).format('YYYY-MM-DD')
        },
        {
          label: '变更原因',
          prop: 'changeReason'
        }
      ]
    }
  },
  created() {
    this.formData = { ...this.row.baseContract, tremark: this.row.remark, attachment: this.row.aftContract.attachment, changeReason: this.row.changeReason, state: this.row.state, efficacy: this.row.aftContract.efficacy }
    this.formData.efficacy = this.formData.efficacy === '有效' ? '合同变更' : '合同作废'
    this.formData.changeTime = this.row.createTime
    if(this.formData.efficacy === '合同作废'){
      this.formData.attachment = this.row.baseContract.attachment
    }
  },
  mounted() {
    const { prevContract, aftContract, prevContractStage, aftContractStage, prevAmountList, aftAmountList } = this.row
    this.formDataBefore = prevContract
    this.formItemsBefore = this.formItems.filter(item => prevContract[item.prop] !== null)
    this.formItemsBefore = this.formItemsBefore.filter(item => item.label !== '审批状态' && item.label !== '变更原因').filter(item => item.label !== '变更日期')
    this.formDataAfter = aftContract
    this.formItemsAfter = this.formItems.filter(item => aftContract[item.prop] !== null)
    this.formItemsAfter = this.formItemsAfter.filter(item => item.label !== '审批状态' && item.label !== '变更原因').filter(item => item.label !== '变更日期')
    // 变更前合同阶段
    this.prevStages = prevContractStage
    this.$refs.baseStageTable.refresh()
    // 变更后合同阶段
    this.aftContractStages = aftContractStage
    this.$refs.aftStageTable.refresh()

    // 变更前合同清单
    this.prevAmounts = prevAmountList
    this.$refs.baseAmountTable.refresh()
    // 变更后合同清单
    this.aftAmountList = aftAmountList
    this.$refs.aftAmountTable.refresh()
  }
}
</script>
<style lang="less" scoped>
.contract-modify-detail-step {
  margin-bottom: 24px;
}
.title {
  font-weight: 700;
  text-align: center;
  display: block;
  color: #000;
  font-size: 20px;
}
</style>
