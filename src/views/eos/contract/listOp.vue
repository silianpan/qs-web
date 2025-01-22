<!-- 合同综合查询 -->
<template>
  <a-card :bordered="false">
    <!-- 查询表单，若无数据，不展示 -->
    <s-search
      placeholder="搜索此列表..."
      clickTips="搜索项目名称、合同名称/编号/类型/金额"
      @onSearch="onSearch"
      @clickquery="clickquery"
      @reset="() => (this.queryParam = { isAsc: 'desc', orderByColumn: 'create_time', tenantAppId: this.$store.getters.tenantAppId, menuId: this.$route.meta.moduleId })"
      :formItems="searchFormItems"
      :formData="queryParam"
    />

    <!-- 数据表格 -->
    <no-data v-show="noData" />
    <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" />
  </a-card>
</template>

<script lang="jsx">
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { listContract, exportContract } from '/src/api/eos/contract/contract.js'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'

import ContractDetail from './detail.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  name: 'ContractListOp',
  props: {
    projectId: {
      type: Number,
      default: null
    },
    deptId: {
      type: Number,
      default: null
    },
    deptTime: {
      type: String,
      default: null
    }
  },
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
      dictKeys: [dictConfig.CONTRACT_TYPE],
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
        if (!this.isEmpty(this.queryParam.dateRange)) {
          this.queryParam.startTime = moment(this.queryParam.dateRange[0]).format('YYYY-MM-DD') + ' 00:00:00'
          this.queryParam.endTime = moment(this.queryParam.dateRange[1]).format('YYYY-MM-DD') + ' 23:59:59'
          delete this.queryParam.dateRange
        }
        const tmpParams = this.projectId !== null ? { projectId: this.projectId } : { deptId: this.deptId, deptTime: this.deptTime }
        return listContract(Object.assign({}, param, this.queryParam, tmpParams)).then(res => {
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
          title: '合同名称',
          align: 'left',
          dataIndex: 'name',
          customRender: (text, record) => {
            return (
              <Ellipsis length={28} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '合同类型',
          align: 'center',
          dataIndex: 'type'
        },
        {
          title: '甲方',
          align: 'left',
          dataIndex: 'firstParty',
          customRender: (text, record) => {
            return (
              <Ellipsis length={12} tooltip>
                {{ text }}
              </Ellipsis>
            )
          }
        },
        {
          title: '乙方',
          align: 'left',
          dataIndex: 'secondParty',
          customRender: (text, record) => {
            return (
              <Ellipsis length={12} tooltip>
                {{ text }}
              </Ellipsis>
            )
          }
        },
        // {
        //   title: '合同编号',
        //   dataIndex: 'code',
        //   align: 'center',
        //   customRender: (text, record) => {
        //     return (
        //       <Ellipsis length={14} tooltip>
        //         {text}
        //       </Ellipsis>
        //     )
        //   }
        // },
        {
          title: '所属项目',
          dataIndex: 'sealProject.name',
          align: 'left',
          customRender: (text, record) => {
            return (
              <Ellipsis length={12} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '合同金额(元)',
          dataIndex: 'sum',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '合同效力',
          dataIndex: 'efficacy',
          align: 'left'
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          align: 'left',
          customRender: (text, record) => {
            return <AuditStatusTag clickable state={text} instanceId={record.sealWorkflow.instanceId} />
          }
        },
        {
          title: '申请人',
          align: 'left',
          dataIndex: 'sysUser.nickName'
        },
        {
          title: '申请时间',
          align: 'left',
          dataIndex: 'createTime',
          customRender: text => moment(text).format('YYYY-MM-DD')
        }
        // {
        //   title: '当前任务',
        //   align: 'left',
        //   dataIndex: 'sealWorkflow.taskName'
        // }
      ],
      searchFormItems: [
        {
          type: 'input',
          label: '合同名称',
          prop: 'name'
        },
        {
          type: 'input',
          label: '所属项目',
          prop: 'projectName'
        },
        {
          type: 'input',
          label: '合同编号',
          prop: 'contractCode'
        },
        {
          type: 'input',
          label: '合同金额(元)',
          prop: 'sum'
        },
        {
          type: 'select',
          label: '合同类型',
          prop: 'type',
          options: [
            {
              dictLabel: '支出合同',
              dictValue: '支出合同'
            },
            {
              dictValue: '收入合同',
              dictLabel: '收入合同'
            }
          ]
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
        },
        {
          type: 'datePickerRange',
          label: '时间范围',
          prop: 'dateRange'
        },
        {
          type: 'input',
          label: '申请人',
          prop: 'nickName'
        },
        {
          type: 'input',
          label: '合同金额起(元)',
          prop: 'startSum'
        },
        {
          type: 'input',
          label: '合同金额止(元)',
          prop: 'endSum'
        }
      ]
    }
  },
  created() {
    if (this.deptId && this.deptTime) {
      delete this.columns[3]
      delete this.searchFormItems[1]
    }
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
    reset() {
      this.queryParam = {
        isAsc: 'desc',
        orderByColumn: 'create_time'
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParam = this.queryParam
      this.$antdconfirm({
        title: '导出',
        content: '是否确认导出所有合同管理数据项?',
        onOk: () => {
          return exportContract(queryParam).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /** 详情 */
    handleDetail(row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '合同详情',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: ContractDetail,
          props: {
            row,
            hasInvoiceGet: true,
            deptId: this.deptId
          }
        }
      })
    },
    /* 查询按钮 */
    clickquery(param, index) {
      this.current = index
      this.queryParam = { ...this.queryParam, orderByColumn: param }
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
</style>
