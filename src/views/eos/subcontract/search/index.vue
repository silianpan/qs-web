<!-- 分包综合查询 -->
<template>
  <page-header-wrapper v-if="!projectId" :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <!-- 查询表单 -->
      <div class="table-header-btns">
        <s-search placeholder="搜索此列表..." clickTips="搜索分包名称" @onSearch="onSearch" @reset="() => (this.queryParam = {})" :formItems="searchFormItems" :formData="queryParam" />
      </div>

      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
  <a-card v-else :bordered="false">
    <!-- 查询表单 -->
    <div class="table-header-btns">
      <s-search placeholder="搜索此列表..." clickTips="搜索分包名称" @onSearch="onSearch" />
    </div>

    <no-data v-show="noData" />
    <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
    </s-table>
  </a-card>
</template>

<script lang="jsx">
import moment from 'moment'
import { listApply, delApply, exportApply } from '/src/api/eos/subcontract/quantities.js'
import { STable, SSearch, Ellipsis } from '/src/components/index.js'
import ExecDetail from '/src/views/eos/subcontract/exec/modules/ExecDetail.vue'
import EmployeeDetail from '/src/views/eos/subcontract/employee/modules/EmployeeDetail.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  name: 'Quantities',
  components: {
    STable,
    SSearch
  },
  props: {
    projectId: {
      type: Number,
      default: null
    }
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
      noData: false,
      dictKeys: [],
      dictMap: {},
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        if (this.projectId) {
          this.queryParam.projectId = this.projectId
        }
        return listApply(Object.assign({}, param, this.queryParam)).then(res => {
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
          label: '创建者'
        },
        {
          type: 'input',
          prop: 'code',
          label: '编号'
        },
        {
          type: 'input',
          prop: 'name',
          label: '所属项目'
        },
        {
          type: 'input',
          prop: 'type',
          label: '类型'
        }
      ],
      columns: [
        // {
        //   title: '编号',
        //   dataIndex: 'code',
        //   align: 'left'
        // },
        {
          title: '所属项目',
          dataIndex: 'sealProject.name',
          align: 'left',
          customRender: text => {
            return text ? (
              <Ellipsis length={40} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          title: '所属合同',
          dataIndex: 'sealContract.name',
          align: 'left',
          customRender: text => {
            return text ? (
              <Ellipsis length={40} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          title: '类型',
          dataIndex: 'type',
          align: 'left'
        },
        {
          title: '结算金额(元)',
          dataIndex: 'sum',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
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
          dataIndex: 'sysUser.nickName',
          align: 'left'
        },
        // {
        //   title: '当前任务',
        //   align: 'left',
        //   dataIndex: 'sealWorkflow.taskName'
        // },
        {
          title: '申请时间',
          dataIndex: 'createTime',
          align: 'left',
          customRender: text => moment(text).format('MM-DD HH:mm')
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
    reset() {
      this.queryParam = {}
    },
    /** 详情 */
    handleDetail(row) {
      if (row.type === '零星用工') {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '零星用工付款详情',
            width: '60%',
            maskClosable: true
          },
          content: {
            template: EmployeeDetail,
            props: {
              row
            }
          }
        })
      }
      if (row.type === '工程量') {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '工程量结算详情',
            width: '80%',
            maskClosable: true
          },
          content: {
            template: ExecDetail,
            props: {
              row
            }
          }
        })
      }
    },
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    }
  }
}
</script>
