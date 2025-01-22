<!-- 合同拟定 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="handleAdd">新增</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索项目名称、合同名称/编号/类型/金额" @onSearch="onSearch" />
      </div>

      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record">
          <BusCommit :handleUpdate="handleUpdate" :handleDelete="handleDelete" :requestMapping="'/project/contract'" :busForm="record" @getList="refresh" />
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { delContract, exportContract, listContractPersonal, listInContractPersonal } from '/src/api/eos/contract/contract.js'
import { listProjectSimple } from '/src/api/eos/project/project.js'
import { SSearch, STable } from '/src/components/index.js'
import ContractForm from './modules/ContractForm.vue'
import ContractDetail from './detail.vue'
import BusCommit from '/src/components/Activiti/BusCommit.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'

export default {
  name: 'Contract',
  components: {
    SSearch,
    STable,
    BusCommit
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
      projectList: [],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time',
        tenantAppId: this.$store.getters.tenantAppId,
        menuId: this.$route.meta.moduleId
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listInContractPersonal(Object.assign({}, param, this.queryParam)).then(res => {
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
          label: '合同名称',
          prop: 'projectName'
        },
        {
          type: 'select',
          label: '所属项目',
          prop: 'projectId',
          options: () => this.projectList,
          valueAlias: 'id',
          labelAlias: 'name'
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
          title: '合同名称',
          align: 'left',
          dataIndex: 'name',
          customRender: (text, record) => {
            return (
              <Ellipsis length={28} tooltip>
                {{ text }}
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
        //         <Ellipsis length={20} tooltip>
        //           {{ text }}
        //         </Ellipsis>
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
                {{ text }}
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
            return <AuditStatusTag state={text} instanceId={record.sealWorkflow.instanceId} />
          }
        },
        // {
        //   title: '申请人',
        //   align: 'left',
        //   dataIndex: 'sysUser.nickName'
        // },
        // {
        //   title: '申请时间',
        //   align: 'left',
        //   dataIndex: 'createTime',
        //   customRender: text => moment(text).format('MM-DD HH:mm')
        // },
        {
          title: '操作',
          align: 'left',
          width: 160,
          scopedSlots: { customRender: 'action' }
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
    // 简单查询项目
    listProjectSimple().then(res => {
      this.projectList = res.rows
    })
  },
  methods: {
    reset() {
      this.queryParam = { isAsc: 'desc', orderByColumn: 'create_time' }
    },
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '合同拟定',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: ContractForm,
          on: {
            ok: () => {
              this.$refs.table.refresh(true)
            }
          }
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const updateRow = { ...row }
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '修改合同',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: ContractForm,
          props: {
            isUpdate: true,
            updateRow
          },
          on: {
            ok: () => {
              this.$refs.table.refresh(true)
            }
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除合同管理编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delContract(ids).then(() => {
            this.$refs.table.refresh(true)
            this.$message.success('删除成功', 3)
          })
        }
      })
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
            row
          }
        }
      })
    },
    /* 查询按钮 */
    clickquery(param) {
      this.queryParam = { ...this.queryParam, orderByColumn: param }
      this.refresh()
    },
    /* 查询按钮 */
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    },
    // 刷新页面
    refresh() {
      this.$refs.table.refresh(true)
    }
  }
}
</script>
