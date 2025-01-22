<!-- 保证金综合查询 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <!-- 查询表单 -->
      <s-search
        placeholder="搜索此列表..."
        clickTips="搜索申请人/保证金类型/保证金金额/预计退还时间/备注"
        @onSearch="onSearch"
        @clickquery="clickquery"
        @reset="() => (this.queryParam = { isAsc: 'desc', orderByColumn: 'createTime' })"
        :formItems="searchFormItems"
        :formData="queryParam"
      >
      </s-search>
      <no-data v-show="noData" />
      <!-- 数据表格 -->
      <s-table v-show="!noData" ref="table" :customRow="rowClick" size="default" rowKey="id" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record">
          <s-action-columns :actions="actions" :record="record" />
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import dictConfig from '/src/views/eos/config/dict.config.js'
import { listApply, delApply, exportApply, dingdingMSG } from '/src/api/eos/earnest/earnestMoney.js'
import { STable, Ellipsis, SSearch, SActionColumns } from '/src/components/index.js'
import SelectForm from './modules/SelectForm.vue'
import earnestSearch from './modules/earnestSearch.vue'
import MemSelect from '/src/views/eos/project/mem/modules/MemSelect.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import detailAndList from './detailAndList.vue'

export default {
  name: 'Apply',
  components: {
    STable,
    SSearch,
    SActionColumns
  },
  data() {
    return {
      actions: [
        {
          label: '通知',
          icon: 'bell',
          action: this.handleNotice
        }
      ],
      noData: false,
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
      dictKeys: [dictConfig.SEAL_PROJECT_EARNESTMONEY_TYPE],
      dictMap: {},
      selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'createTime'
      },
      /* 查询列表 */
      queryList: [
        { text: '按时间', query: 'create_time' },
        { text: '按类型', query: 'depositType' }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
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
          type: 'select',
          label: '保证金类型',
          options: () => this.dictMap[dictConfig.SEAL_PROJECT_EARNESTMONEY_TYPE],
          prop: 'depositType'
        }
      ],
      columns: [
        // {
        //   title: '申请单号',
        //   dataIndex: 'code',
        //   align: 'left'
        // },
        {
          title: '保证金类型',
          dataIndex: 'depositType',
          align: 'left'
        },
        {
          title: '保证金金额(元)',
          dataIndex: 'depositMoney',
          align: 'left',
          customRender: text => this.toThousandFilter(text)
        },
        {
          title: '预计退还时间',
          dataIndex: 'returnTime',
          align: 'left'
        },
        {
          title: '退还金额(元)',
          dataIndex: 'returnAllMoney',
          align: 'left',
          customRender: text => {
            return text == null ? <span style="color:red">未退还</span> : text
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'left',
          customRender: text => {
            return (
              <Ellipsis length={40} tooltip>
                {text}
              </Ellipsis>
            )
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
          align: 'left',
          dataIndex: 'sysUser.nickName'
        },
        {
          title: '操作',
          width: 160,
          align: 'center',
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
    reset() {
      this.queryParam = {}
    },
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '新增保证金申请',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: SelectForm,
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
          title: '修改保证金申请',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: SelectForm,
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
        content: '是否确认删除保证金申请单号为"' + row.code + '"的数据项?',
        onOk: () => {
          return delApply(ids).then(() => {
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
        content: '是否确认导出所有保证金申请数据项?',
        onOk: () => {
          return exportApply(queryParam).then(res => {
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
          title: '保证金申请详情',
          width: '50%',
          maskClosable: true
        },
        content: {
          template: detailAndList,
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
    /* 查询近期退还 */
    earnestReturnSearch(data, event) {
      this.queryParam = { ...this.queryParam, earnestReturn: data }
      this.refresh()
    },
    /* 查询未退还 */
    earnestNoReturn(data, event) {
      this.queryParam = { ...this.queryParam, earnestNoReturn: data }
      this.refresh()
    },
    // 刷新页面
    refresh() {
      this.$refs.table.refresh(true)
    },
    /* 通知 */
    handleNotice(row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '通知人员',
          width: '50%',
          maskClosable: true
        },
        content: {
          template: MemSelect,
          props: {
            selectType: 'checkbox'
          },
          on: {
            ok: (Rows, Keys) => {
              const ids = Rows.map(item => item.dingUserId)
              const userIds = ids.filter(item => item != null)
              dingdingMSG({ id: row.id, dingUserId: userIds.join(',') }).then(res => {
                this.$message.success('通知成功')
              })
            },
            cancel: () => {}
          }
        }
      })
    }
  }
}
</script>
