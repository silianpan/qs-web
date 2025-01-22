<!-- 差旅成本上报 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <a-radio-group v-model="value" @change="onChange" class="change-show">
        <a-radio :value="1">人工成本上报</a-radio>
        <a-radio :value="2">差旅成本上报</a-radio>
      </a-radio-group>
      <template v-if="value === 1">
        <div class="table-header-btns">
          <a-button ghost type="primary" @click="handleAdd">上报</a-button>
          <!-- 查询表单，若无数据，不展示 -->
          <s-search placeholder="搜索此列表..." clickTips="搜索上报人、上报单号/时间/说明" @onSearch="onSearch" />
        </div>
        <!-- 数据表格 -->
        <no-data v-show="noData" />
        <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :rowSelection="rowSelection">
          <span slot="action" slot-scope="text, record">
            <BusCommit :busCommitActions="busCommitActions" :handleUpdate="handleUpdate" :handleDelete="handleDelete" :requestMapping="'/project/cost'" :busForm="record" @getList="refresh" />
          </span>
        </s-table>
      </template>
      <template v-else>
        <div class="table-header-btns">
          <a-button ghost type="primary" @click="handleAdd2">上报</a-button>
          <!-- 查询表单，若无数据，不展示 -->
          <s-search placeholder="搜索此列表..." clickTips="搜索上报人、上报编号/时间/说明" @onSearch="onSearch2" />
        </div>
        <!-- 数据表格 -->
        <no-data v-show="noData2" />
        <s-table v-show="!noData2" :customRow="rowClick2" ref="table2" size="default" rowKey="id" :columns="columns2" :data="loadData2" :rowSelection="rowSelection2">
          <span slot="action" slot-scope="text, record">
            <BusCommit :busCommitActions="busCommitActions2" :handleUpdate="handleUpdate2" :handleDelete="handleDelete2" :requestMapping="'/project/cost'" :busForm="record" @getList="refresh2" />
          </span>
        </s-table>
      </template>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import moment from 'moment'
import { listLabor, delLabor, exportLabor } from '/src/api/eos/cost/labor.js'
import { listOnbus, delOnbus, exportOnbus } from '/src/api/eos/cost/onbus.js'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import LaborForm from './labor/modules/LaborForm.vue'
import laborDetail from './labor/details.vue'
import onbusDetail from './onbus/details.vue'
import OnbusForm from './onbus/modules/OnbusForm.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import BusCommit from '/src/components/Activiti/BusCommit.vue'
export default {
  data() {
    return {
      value: 1,
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
      rowClick2: record => ({
        on: {
          click: () => {
            this.handleDetail2(record, record.id)
          }
        },
        style: {
          cursor: 'pointer'
        }
      }),
      busCommitActions: [
        {
          label: '导出',
          icon: 'export',
          action: this.handleExport
        }
      ],
      busCommitActions2: [
        {
          label: '导出',
          icon: 'export',
          action: this.handleExport2
        }
      ],
      /* 是否有数据 */
      noData: false,
      dictKeys: [],
      dictMap: {},
      selectedRowKeys: [],
      selectedRows: [],
      noData2: true,
      selectedRowKeys2: [],
      selectedRows2: [],
      // 查询参数
      queryParam: {
        kind: '人工成本上报',
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      queryParam2: {
        kind: '差旅成本上报',
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listLabor(Object.assign({}, param, this.queryParam)).then(res => {
          this.noData = res.total === 0

          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      loadData2: param => {
        return listOnbus(Object.assign({}, param, this.queryParam2)).then(res => {
          this.noData2 = res.total === 0

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
          label: '上报编号',
          prop: 'orderCode'
        },
        {
          type: 'datePicker',
          label: '上报时间',
          prop: 'orderTime'
        },
        {
          type: 'input',
          label: '上报人',
          prop: 'nickName'
        },
        {
          type: 'input',
          label: '上报说明',
          prop: 'remark'
        }
      ],
      columns: [
        {
          title: '上报编号',
          dataIndex: 'orderCode',
          align: 'left'
        },
        {
          title: '上报人',
          dataIndex: 'sysUser.nickName',
          align: 'left'
        },
        {
          title: '上报时间',
          dataIndex: 'orderTime',
          align: 'left',
        },
        {
          title: '上报类型',
          dataIndex: 'expenseType',
          align: 'left',
          customRender: (text, record) => {
            return '人工成本上报'
          }
        },
        {
          title: '合计金额(元)',
          dataIndex: 'sealCostLabor.totalMoney',
          align: 'left'
        },
        {
          title: '上报说明',
          dataIndex: 'orderInfo',
          align: 'left',
          customRender: text => {
            return text ? (
              <Ellipsis length={14} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          align: 'left',
          customRender: (text, record) => {
            return <AuditStatusTag state={text} />
          }
        },
        {
          title: '操作',
          align: 'left',
          width: 160,
          scopedSlots: { customRender: 'action' }
        }
      ],
      searchFormItems2: [
        {
          type: 'input',
          label: '上报编号',
          prop: 'orderCode'
        },
        {
          type: 'datePicker',
          label: '上报时间',
          prop: 'orderTime'
        },
        {
          type: 'input',
          label: '上报人',
          prop: 'createBy'
        },
        {
          type: 'input',
          label: '上报说明',
          prop: 'orderInfo'
        }
      ],
      columns2: [
        {
          title: '上报编号',
          dataIndex: 'orderCode',
          align: 'left'
        },
        {
          title: '上报人',
          dataIndex: 'sysUser.nickName',
          align: 'left'
        },
        {
          title: '上报时间',
          dataIndex: 'orderTime',
          align: 'left'
        },
        {
          title: '上报类型',
          dataIndex: 'orderType',
          align: 'left'
        },
        {
          title: '上报说明',
          dataIndex: 'orderInfo',
          align: 'left',
          customRender: text => {
            return text ? (
              <Ellipsis length={14} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          align: 'left',
          customRender: (text, record) => {
            return <AuditStatusTag state={text} />
          }
        },
        // {
        //   title: '原始附件',
        //   dataIndex: 'attachment',
        //   align: 'center',
        //   customRender: text => {
        //     return <s-doc-list text={text} />
        //   }
        // },
        {
          title: '操作',
          width: 160,
          align: 'left',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  components: {
    SSearch,
    STable,
    BusCommit
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    },
    rowSelection2() {
      return {
        selectedRowKeys: this.selectedRowKeys2,
        onChange: this.onSelectChange2
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
    onChange(e) {
      if (e.target.value === 1) {
        this.$nextTick(() => {
          this.refresh()
        })
      } else {
        this.$nextTick(() => {
          this.refresh2()
        })
      }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    onSelectChange2(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '新增人工成本上报',
          width: '85%',
          maskClosable: true
        },
        content: {
          template: LaborForm,
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
    handleAdd2() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '新增差旅成本上报',
          width: '85%',
          maskClosable: true
        },
        content: {
          template: OnbusForm,
          on: {
            ok: () => {
              this.refresh2()
            },
            close: () => {
              this.refresh2()
            }
          }
        }
      })
    },
    handleUpdate2(row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '修改差旅成本上报',
          width: '85%',
          maskClosable: true
        },
        content: {
          template: OnbusForm,
          props: {
            isUpdate: true,
            updateRow: row
          },
          on: {
            ok: () => {
              this.refresh2()
            },
            close: () => {
              this.refresh2()
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
          title: '修改人工成本上报',
          width: '85%',
          maskClosable: true
        },
        content: {
          template: LaborForm,
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
    // handleDelete(row) {
    //   const ids = row.id
    //   this.$antdconfirm({
    //     title: '删除',
    //     content: '是否确认删除人工成本上报编号为"' + ids + '"的数据项?',
    //     onOk: () => {
    //       return delLabor(ids).then(() => {
    //         this.refresh()
    //         this.$message.success('删除成功', 3)
    //       })
    //     }
    //   })
    // },
    /** 导出按钮操作 */
    handleExport(record) {
      this.$antdconfirm({
        title: '导出',
        content: '是否确认导出编号为 ' + record.orderCode + ' 的人工成本上报明细?',
        onOk: () => {
          return exportLabor(record.orderCode).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    handleExport2(record) {
      this.$antdconfirm({
        title: '导出',
        content: '是否确认导出上报编号为 ' + record.orderCode + ' 的差旅成本明细?',
        onOk: () => {
          return exportOnbus(record.orderCode).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /** 详情 */
    handleDetail(row, formId) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '人工成本上报详情',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: laborDetail,
          props: {
            title: '人工成本上报详情',
            row,
            formId
          }
        }
      })
    },
    handleDetail2(row, formId) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '差旅成本上报详情',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: onbusDetail,
          props: {
            title: '差旅成本上报详情',
            row,
            formId
          }
        }
      })
    },
    /* 删除 */
    handleDelete(row) {
      const ids = row.id
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除借款编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delLabor(ids).then(() => {
            this.refresh()
            this.$message.success('删除成功', 3)
          })
        }
      })
    },
    handleDelete2(row) {
      const ids = row.id
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除借款编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delOnbus(ids).then(() => {
            this.refresh2()
            this.$message.success('删除成功', 3)
          })
        }
      })
    },
    /* 查询按钮 */
    clickquery(param) {
      this.queryParam = { ...this.queryParam, orderByColumn: param }
      this.refresh()
    },
    clickquery2(param) {
      this.queryParam = { ...this.queryParam, orderByColumn: param }
      this.refresh2()
    },
    /* 查询按钮 */
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    },
    onSearch2(data, event) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh2()
    },
    // 刷新页面
    refresh() {
      this.$refs.table.refresh(true)
    },
    refresh2() {
      this.$refs.table2.refresh(true)
    }
  }
}
</script>
<style lang="less" scoped>
.change-show {
  margin-bottom: 10px;
}
</style>
