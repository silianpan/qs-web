<!-- 采购申请 -->
<template>
  <page-header-wrapper :breadcrumb="false">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="handleAdd">新增</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索项目名称、申请单号、采购事由" @onSearch="onSearch" />
      </div>
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record">
          <BusCommit :handleUpdate="handleUpdate" :handleDelete="handleDelete" :requestMapping="'/project/apply/payment'" :busForm="record" @getList="refresh" />
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import moment from 'moment'
import { purchaseList, delPurchase } from '/src/api/eos/purchase/purchase.js'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import ApplyForm from './modules/ApplyForm.vue'
import detail from './detail.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import BusCommit from '/src/components/Activiti/BusCommit.vue'

export default {
  name: 'Apply',
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
            this.handleDetail(record, record.id)
          }
        },
        style: {
          cursor: 'pointer'
        }
      }),
      /* 是否有数据 */
      noData: false,
      // 用于存放请求详细的数据
      temp: {},
      dictKeys: [],
      dictMap: {},
      selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return purchaseList(Object.assign({}, param, this.queryParam)).then(res => {
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
          label: '申请人',
          prop: 'nickName'
        },
        {
          type: 'input',
          label: '项目名称',
          prop: 'projectName'
        }
      ],
      columns: [
        {
          title: '申请人',
          align: 'left',
          dataIndex: 'sealWorkflow.applyUserName'
        },
        {
          title: '申请时间',
          align: 'left',
          dataIndex: 'sealWorkflow.applyTime',
          customRender: text => {
            if (text) {
              return moment(text).format('MM-DD HH:mm')
            } else {
              return ''
            }
          }
        },
        // {
        //   title: '申请单号',
        //   align: 'center',
        //   dataIndex: 'code'
        // },
        {
          title: '项目/部门',
          align: 'left',
          dataIndex: 'sealProject.name',
          customRender: (text, record) => {
            return record.sealProject ? (
              <Ellipsis length={40} tooltip>
                {record.sealProject.name}
              </Ellipsis>
            ) : (
              <Ellipsis length={40} tooltip>
                {record.dept.deptName}
              </Ellipsis>
            )
          }
        },
        {
          title: '合同名称',
          align: 'left',
          dataIndex: 'sealContract.name'
        },
        {
          title: '采购类型',
          align: 'left',
          dataIndex: 'purchaseType',
          customRender: (text, record) => (text === 0 ? '项目采购' : '非项目采购')
        },
        {
          title: '附件',
          dataIndex: 'attachment',
          align: 'left',
          customRender: (text, record) => {
            return <s-doc-list text={text} />
          }
        },
        // {
        //   title: '采购事由',
        //   align: 'center',
        //   dataIndex: 'remark',
        //   width: 80,
        //   customRender: text => {
        //     return text ? (
        //       <Ellipsis length={8} tooltip>
        //         {text}
        //       </Ellipsis>
        //     ) : (
        //       text
        //     )
        //   }
        // },
        {
          title: '审批状态',
          dataIndex: 'state',
          align: 'left',
          customRender: (text, record) => {
            return <AuditStatusTag clickable state={text} instanceId={record.sealWorkflow.instanceId} />
          }
        },
        {
          title: '操作',
          width: 160,
          align: 'left',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  computed: {},
  created() {
    // 查询字典
    this.dictKeys.forEach(key => {
      this.getDicts(key).then(res => {
        this.$set(this.dictMap, key, res.data)
      })
    })
  },
  methods: {
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '新增采购申请',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: ApplyForm,
          props: {},
          on: {
            ok: () => {
              this.refresh()
            },
            close: () => {
              this.refresh()
            }
          }
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '修改采购申请',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: ApplyForm,
          props: {
            isUpdate: true,
            updateRow: row
          },
          on: {
            ok: () => {
              this.refresh()
            },
            close: () => {
              this.refresh()
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
        content: '是否确认删除采购申请编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delPurchase([ids]).then(() => {
            this.refresh()
            this.$message.success('删除成功', 3)
          })
        }
      })
    },
    /** 详情 */
    handleDetail(row, formId) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '采购申请详情',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: detail,
          props: {
            row,
            formId
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
