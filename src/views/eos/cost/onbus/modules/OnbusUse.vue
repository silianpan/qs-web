<!-- 差旅成本上报使用情况 -->
<template>
  <div>
    <!-- 查询表单 -->
    <div class="table-header-btns">
      <s-search placeholder="搜索此列表..." clickTips="搜索上报时间" @onSearch="onSearch" />
    </div>
    <!-- 数据表格 -->
    <s-table ref="table" rowKey="id" :columns="columns" :data="loadData">
      <p slot="expandedRowRender" slot-scope="record">
        <s-descriptions title="基本信息" :formItems="descItems" :formData="record" />
      </p>
    </s-table>
  </div>
</template>

<script lang="jsx">
import { listOnbusDetail } from '/src/api/eos/cost/onbus.js'
import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'
import SForm from '/src/components/Form/index.jsx'
import { STable, SSearch } from '/src/components/index.js'
import SDescriptions from '/src/components/Descriptions/index.jsx'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  name: 'OnbusUse',
  components: {
    SSearch,
    STable,
    SDescriptions
  },
  props: {
    projectCode: {
      type: String,
      default: null
    },
    projectId: {
      type: Number,
      default: null
    },
    expenseType: {
      type: String,
      default: null
    },
    startTime: {
      type: Date,
      default: null
    },
    endTime: {
      type: Date,
      default: null
    },
    region: {
      type: String,
      default: null
    },
    // 项目统计分析传参
    createTime: {
      type: String,
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
  data() {
    return {
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'createTime'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        // if (!this.projectCode || !this.expenseType) {
        //   return
        // }
        if (this.createTime) {
          param.startTime = this.createTime + '-01'
          param.endTime = this.createTime + '-31'
        }
        param.projectCode = this.projectCode
        if (!this.expenseType == null) {
          param.expenseType = this.expenseType.substring(0, 2)
        }
        if (!this.isEmpty(this.startTime)) {
          param.startTime = moment(this.startTime).format('YYYY-MM') + '-01 00:00:00'
        }
        if (!this.isEmpty(this.endTime)) {
          param.endTime = moment(this.endTime).format('YYYY-MM') + '-31 23:59:59'
        }
        param.region = this.region
        param.projectId = this.projectId

        param.deptId = this.deptId
        param.deptTime = this.deptTime
        return listOnbusDetail(Object.assign({}, param, this.queryParam)).then(res => {
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
          label: '上报人',
          prop: 'nickName'
        }
      ],
      columns: [
        {
          title: '上报编号',
          dataIndex: 'sealCost.orderCode',
          align: 'center'
        },
        {
          title: '上报人',
          dataIndex: 'sysUser.nickName',
          align: 'center'
        },
        {
          title: '上报时间',
          dataIndex: 'sealCost.createTime',
          align: 'center'
        },
        {
          title: '金额(元)',
          dataIndex: 'travelTotalMoney',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '预算类型',
          dataIndex: 'expenseType',
          align: 'center',
          customRender: text => {
            return <a-tag color="blue">{text}</a-tag>
          }
        },
        {
          title: '上报说明',
          dataIndex: 'sealCost.orderInfo',
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
        },
        {
          title: '审批状态',
          dataIndex: 'sealCost.state',
          align: 'center',
          customRender: text => {
            return <AuditStatusTag state={text} />
          }
        },
        {
          title: '附件',
          dataIndex: 'sealCost.attachment',
          align: 'center',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        }
      ],
      descItems: [
        {
          label: '费用类型',
          prop: 'expenseType',
          customRender: text => {
            return <a-tag color="blue">{text}</a-tag>
          }
        },
        {
          label: '组织名称',
          prop: 'org'
        },
        {
          label: '订票时间',
          prop: 'bookTime'
        },
        {
          label: '姓名',
          prop: 'userName'
        },
        {
          label: '航班时间',
          prop: 'travelTime'
        },
        {
          label: '航班信息',
          prop: 'travelInfo'
        },
        {
          label: '票价(元)',
          prop: 'travelPrice'
        },
        {
          label: '民航发展基金(元)',
          prop: 'travelFund'
        },
        {
          label: '代理服务费(元)',
          prop: 'travelService'
        },
        {
          label: '合计(元)',
          prop: 'travelTotalMoney'
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ]
    }
  },
  methods: {
    // 刷新页面
    refresh() {
      this.$refs.table.refresh(true)
    },
    reset() {
      this.queryParam = { isAsc: 'desc', orderByColumn: 'createTime' }
    },
    handleExport() {},
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    }
  }
}
</script>
