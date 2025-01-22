<!-- 工程量结算列表 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <!-- 查询表单 -->
      <div class="table-header-btns">
        <!-- 业务操作按钮 -->
        <a-button-group>
          <a-button type="primary" ghost @click="handleAdd" v-hasPermi="['project:exec:add']">新增</a-button>
          <!-- <a-button type="primary" ghost @click="handleExport" v-hasPermi="['project:exec:export']">导出</a-button> -->
        </a-button-group>
        <s-search placeholder="搜索此列表..." clickTips="搜索工程量名称" @onSearch="onSearch" />
      </div>

      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :rowSelection="rowSelection">
        <span slot="action" slot-scope="text, record">
          <BusCommit :handleUpdate="handleUpdate" :handleDelete="handleDelete" :requestMapping="'/project/exec'" :busForm="record" @getList="refresh" />
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import moment from 'moment'
import { listExec, delExec, exportExec } from '/src/api/eos/subcontract/exec.js'
import { STable, SSearch } from '/src/components/index.js'
import ExecForm from './modules/ExecForm.vue'
import ExecDetail from './modules/ExecDetail.vue'
import BusCommit from '/src/components/Activiti/BusCommit.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  name: 'Exec',
  components: {
    STable,
    BusCommit,
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
      noData: false,
      dictKeys: [],
      dictMap: {},
      selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listExec(Object.assign({}, param, this.queryParam)).then(res => {
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
        // {
        //   title: '申请单号',
        //   dataIndex: 'code',
        //   align: 'left'
        // },
        {
          title: '项目名称',
          dataIndex: 'sealProject.name',
          align: 'left'
        },
        {
          title: '合同名称',
          dataIndex: 'sealContract.name',
          align: 'left'
        },
        {
          title: '结算总金额(元)',
          dataIndex: 'sum',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
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
        {
          title: '申请时间',
          dataIndex: 'createTime',
          align: 'left',
          customRender: text => moment(text).format('MM-DD HH:mm')
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
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
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
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 刷新页面
    refresh() {
      this.$refs.table.refresh(true)
    },
    reset() {
      this.queryParam = {}
    },
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '新增工程量结算',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: ExecForm,
          on: {
            ok: () => {
              this.refresh()
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
          title: '修改工程量结算',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: ExecForm,
          props: {
            isUpdate: true,
            updateRow
          },
          on: {
            ok: () => {
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
        content: '是否确认删除工程量结算编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delExec(ids).then(() => {
            this.refresh()
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
        content: '是否确认导出所有工程量结算数据项?',
        onOk: () => {
          return exportExec(queryParam).then(res => {
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
    },
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    }
  }
}
</script>
