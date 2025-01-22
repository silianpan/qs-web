<!-- 工程量结算详细 -->
<template>
  <div>
    <s-descriptions :title="title" :formItems="formItems" :formData="row" />
    <a-card :bordered="false" size="small">
      <a-collapse expand-icon-position="right" defaultActiveKey="工程量结算清单">
        <a-collapse-panel key="工程量结算清单" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">工程量结算清单</span>
          <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :showPagination="false" />
        </a-collapse-panel>
      </a-collapse>
    </a-card>
  </div>
</template>

<script lang="jsx">
import { SDescriptions, STable } from '/src/components/index.js'
import { previewDoc } from '/src/components/Office/office.js'
import { getExec } from '/src/api/eos/subcontract/exec.js'

export default {
  name: 'ExecDetail',
  props: {
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
      title: '工程量结算详情',
      formItems: [
        {
          label: '申请人',
          prop: 'sysUser.nickName'
        },
        {
          label: '项目名称',
          prop: 'sealProject.name'
        },
        {
          label: '合同名称',
          prop: 'sealContract.name'
        },
        {
          label: '申请编号',
          prop: 'code'
        },
        {
          label: '结算总金额',
          prop: 'sum',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          label: '申请时间',
          prop: 'createTime'
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
        }
      ],
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          align: 'center'
        },
        {
          title: '阶段',
          dataIndex: 'stageName',
          align: 'center'
        },
        {
          title: '截止日期',
          dataIndex: 'stageDate',
          align: 'center'
        },
        {
          title: '阶段描述',
          dataIndex: 'stageContent',
          align: 'center'
        },
        {
          title: '本次填报量',
          dataIndex: 'thisAmount',
          align: 'center',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '合同数量',
          dataIndex: 'contractNum',
          align: 'center',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '核准量',
          dataIndex: 'checkAmount',
          align: 'center',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '本次批量',
          dataIndex: 'thisMoney',
          align: 'center',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center'
        },
        {
          title: '单价',
          dataIndex: 'onePrice',
          align: 'center',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '本次批量小计',
          dataIndex: 'checkAmountTotal',
          align: 'center',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        }
      ],
      loadData: param => {
        return getExec(this.row.id).then(res => {
          return {
            data: res.data.sealAmountListExecs || [],
            totalCount: res.data.sealAmountListExecs && res.data.sealAmountListExecs.length || 0
          }
        })
      }
    }
  },
  methods: {
    handlePreviewDoc(doc) {
      previewDoc(doc.name, doc.url)
    },
    // 新增明细行
    addLine() {
      let status = true
      if (this.materialProcurement.length > 0) {
        const value = this.materialProcurement.map(({ description, personNum, days, moneyDay, money, moneyReal }) => ({ description, personNum, days, moneyDay, money, moneyReal }))
        value.map(item => {
          for (const key in item) {
            if (!item[key]) {
              status = false
              this.$message.error('请填写完整,在添加新行!')
              return
            }
          }
        })
        if (!status) {
          return
        }
      }
      this.materialProcurement.push({})
      this.$nextTick(() => {
        this.$refs.employeeTable.refresh(true)
      })
    }
  }
}
</script>
