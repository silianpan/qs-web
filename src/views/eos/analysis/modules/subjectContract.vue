<!-- 主体收支合同 -->
<template>
  <a-card :bordered="false">
    <!-- 查询表单 -->
    <div class="table-page-search-wrapper">
      <s-form search layout="inline" @search="refresh" @reset="reset" :formItems="searchFormItems" :formData="queryParam"> </s-form>
      <a-button type="primary" ghost icon="download" @click="exportAll(queryParam)" style="margin-bottom: 20px">导出</a-button>
    </div>
    <!-- 数据表格 -->
    <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData"> </s-table>
  </a-card>
</template>

<script lang="jsx">
import dictConfig from '/src/views/eos/config/dict.config.js'
import { subjectCtc, subjectCtcExport } from '/src/api/eos/analysis/analyst.js'
import { treeSelect } from '/src/api/eos/project/project.js'
import { SForm, STable, Ellipsis } from '/src/components/index.js'
import ContractDetail from '/src/views/eos/contract/detail.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  name: 'SubjectContract',
  props: {
    company: {
      type: String,
      require: true,
      default: ''
    }
  },
  components: {
    SForm,
    STable
  },
  data() {
    return {
      dictKeys: [dictConfig.CONTRACT_TYPE],
      dictMap: {},
      projectList: [],
      // 查询参数
      queryParam: {
        company: this.company,
        isAsc: 'desc',
        orderByColumn: 'type desc,create_time'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return subjectCtc(Object.assign({}, param, this.queryParam)).then(res => {
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
          label: '合同名称',
          prop: 'name'
        },
        {
          type: 'treeSelect',
          label: '所属项目',
          prop: 'projectId',
          options: () => this.projectList,
          keyAlias: 'id',
          titleAlias: 'label',
          valueAlias: 'id'
        },
        {
          type: 'input',
          label: '合同编号',
          prop: 'code'
        },
        {
          type: 'input',
          label: '合同金额(元)',
          prop: 'sum',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          type: 'input',
          label: '甲方',
          prop: 'firstParty'
        },
        {
          type: 'input',
          label: '乙方',
          prop: 'secondParty'
        }
      ],
      columns: [
        {
          title: '申请人',
          dataIndex: 'applyUserName',
          customRender: (text, record) => record.applyUserName
        },
        {
          title: '申请时间',
          dataIndex: 'applyTime',
          customRender: (text, record) => {
            return (
              <Ellipsis length={10} tooltip>
                {record.applyTime}
              </Ellipsis>
            )
          }
        },
        {
          title: '当前任务',
          dataIndex: 'taskName',
          customRender: (text, record) => {
            return (
              <Ellipsis length={8} tooltip>
                {record.taskName}
              </Ellipsis>
            )
          }
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          customRender: (text, record) => {
            return <AuditStatusTag clickable state={text} instanceId={record.instanceId} />
          }
        },
        {
          title: '合同编号',
          dataIndex: 'code',
          align: 'center',
          customRender: (text, record) => {
            return (
              <span style="color:#348EE4;cursor:pointer" onClick={() => this.handleDetail(record)}>
                {text}
              </span>
            )
          }
        },
        {
          title: '合同名称',
          dataIndex: 'name',
          align: 'center',
          customRender: text => {
            return (
              <Ellipsis length={14} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '合同类型',
          dataIndex: 'type',
          align: 'center',
          customRender: text => {
            const ret = this.selectDictItem(this.dictMap[dictConfig.CONTRACT_TYPE], text)
            return <a-tag color={ret.listClass}>{ret.dictLabel}</a-tag>
          }
        },
        {
          title: '所属项目',
          dataIndex: 'projectName',
          align: 'center',
          customRender: (text, record) => {
            return (
              <Ellipsis length={14} tooltip>
                {record.sealProject && record.sealProject.name}
              </Ellipsis>
            )
          }
        },
        {
          title: '金额(元)',
          dataIndex: 'sum',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: (
            <a-tooltip>
              <template slot="title">收入合同为已收，支出合同为已付</template>
              已收已付(元)
              <a-icon type="question-circle" />
            </a-tooltip>
          ),
          dataIndex: 'inOutSum.realSum',
          align: 'center',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: (
            <a-tooltip>
              <template slot="title">收入合同为未收，支出合同为未付</template>
              未收未付(元)
              <a-icon type="question-circle" />
            </a-tooltip>
          ),
          dataIndex: 'inOutSum.unRealSum',
          align: 'center',
          customRender: (text, record) => {
            return <span style="color:red">{this.toThousandFilter(text)}</span>
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
    treeSelect({ state: '0' }).then(res => {
      this.projectList = res.data
    })
  },
  methods: {
    reset() {
      this.queryParam = { company: this.company, isAsc: 'desc', orderByColumn: 'type desc,create_time' }
      this.refresh()
    },
    /** 详情 */
    handleDetail(row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '合同详情',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: ContractDetail,
          props: {
            row
          }
        }
      })
    },
    /** 导出 */
    exportAll(params) {
      this.$confirm({
        title: '导出',
        content: `是否导出当前合同列表信息 ?`,
        onOk: () => {
          return subjectCtcExport(params).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /* 查询按钮 */
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam }
      this.refresh()
    },
    // 刷新页面
    refresh() {
      this.$refs.table.refresh(true)
    }
  }
}
</script>
