<!-- 收票登记 票据登记 -->
<template>
  <div>
    <a-card :bordered="false" v-if="inDrawer">
      <div v-if="!simple" class="table-header-btns">
        <a-button-group>
          <a-button ghost type="primary" @click="handleAdd">新增</a-button>
          <a-button type="primary" ghost @click="handleExport">导出</a-button>
        </a-button-group>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索项目名称、收票单号" @onSearch="onSearch" />
      </div>
      <!-- 数据表格 -->
      <s-table :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record">
          <a-button type="link" @click.stop="handleUpdate(text, record)">
            <a-icon type="edit" />
            修改
          </a-button>
          <a-button type="link" @click.stop="handleDelete(text, record)" style="color: red">
            <a-icon type="close-circle" />
            删除
          </a-button>
        </span>
      </s-table>
    </a-card>
    <a-card :bordered="false" v-else>
      <div v-if="!simple" class="table-header-btns">
        <a-button-group>
          <a-button ghost type="primary" @click="handleAdd">新增</a-button>
          <a-button type="primary" ghost @click="handleExport">导出</a-button>
          <a-month-picker placeholder="选择导出月份" @change="selectExport" style="margin-left: 20px"/>
        </a-button-group>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索项目名称、收票单号" @onSearch="onSearch">
          <a-button-group slot="left" style="margin-right: 10px">
            <a-button ghost type="primary" @click="changeInOut(1)">收票</a-button>
            <a-button type="primary" ghost @click="changeInOut(2)">开票</a-button>
          </a-button-group>
        </s-search>
      </div>
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :rowSelection="rowSelection">
        <span slot="action" slot-scope="text, record">
          <a-button type="link" @click.stop="handleUpdate(text, record)">
            <a-icon type="edit" />
            修改
          </a-button>
          <a-button type="link" @click.stop="handleDelete(text, record)" style="color: red">
            <a-icon type="close-circle" />
            删除
          </a-button>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script lang="jsx">
import moment from 'moment'
import { listGet, delGet, exportGet } from '/src/api/eos/invoice/get.js'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import GetForm from './modules/GetForm.vue'
import detail from './detail.vue'

export default {
  name: 'Get',
  components: {
    SSearch,
    STable
  },
  props: {
    contractCode: {
      type: String,
      default: ''
    },
    getType: {
      type: String,
      default: ''
    },
    simple: {
      type: Boolean,
      default: false
    },
    inDrawer: {
      type: Boolean,
      default: false
    }
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
      dictKeys: [],
      dictMap: {},
      selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'createTime'
      },
      // 导出搜索日期
      exportDate: '',
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        if (!this.isEmpty(this.contractCode) && !this.isEmpty(this.getType)) {
          this.queryParam = {
            contractCode: this.contractCode,
            getType: this.getType
          }
        }
        return listGet(Object.assign({}, param, this.queryParam)).then(res => {
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
          title: '票据类型',
          dataIndex: 'getType',
          align: 'left'
        },
        // {
        //   title: '收票单号',
        //   dataIndex: 'code',
        //   align: 'left',
        //   customRender: text => {
        //     return (
        //         <Ellipsis length={15} tooltip>
        //           {text}
        //         </Ellipsis>
        //     )
        //   }
        // },
        {
          title: '收票时间',
          dataIndex: 'getTime',
          align: 'left',
          customRender: text => {
            return text ? moment(text).format('YYYY-MM-DD') : text
          }
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          align: 'left',
          customRender: (text, record) => {
            return (
              <Ellipsis length={15} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        // {
        //   title: '合同名称',
        //   dataIndex: 'contractName',
        //   align: 'left',
        //   customRender: (text, record) => {
        //     return (
        //       <Ellipsis length={15} tooltip>
        //         {text}
        //       </Ellipsis>
        //     )
        //   }
        // },
        {
          title: '发票类型',
          dataIndex: 'type',
          align: 'left'
        },
        {
          title: '金额(元)',
          dataIndex: 'money',
          align: 'left'
        },
        {
          title: '税率(%)',
          dataIndex: 'taxRate',
          align: 'left'
        },
        {
          title: '税额',
          dataIndex: 'taxAmount',
          align: 'left'
        },
        {
          title: '税价合计',
          dataIndex: 'moneyAndTax',
          align: 'left'
        },
        {
          title: '合同票据比例合计(%)',
          dataIndex: 'rate',
          align: 'left'
        },
        {
          title: '合同票据金额合计(元)',
          dataIndex: 'payed',
          align: 'left'
        },
        {
          title: '操作',
          align: 'left',
          width: 200,
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
    if(this.inDrawer){
      delete this.columns[this.columns.length-1]
    }
  },
  methods: {
    handleInOutClick(getType) {
      this.queryParam.getType = getType
      this.refresh()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 导出日期搜索
    selectExport(date, dateString){
      // console.log(date, dateString)
      this.exportDate = dateString
    },
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '新增票据登记',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: GetForm,
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
          title: '修改票据登记',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: GetForm,
          props: {
            isUpdate: true,
            updateRow: row
          },
          on: {
            ok: () => {
              this.refresh()
            },
            cancel: () => {
              this.refresh()
            }
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.code
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除收票管理编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delGet(row.id).then(() => {
            this.$refs.table.refresh(true)
            this.$message.success('删除成功', 3)
          })
        }
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const tips = !this.isEmpty(this.selectedRowKeys) ? '是否导出所选择的票据？' : '是否导出查询列表所有票据？'
      this.$antdconfirm({
        title: '导出',
        content: tips,
        onOk: () => {
          const params = { ...this.queryParam }
          if (!this.isEmpty(this.exportDate)) {
            params.exportDate = this.exportDate
          }
          if (!this.isEmpty(this.selectedRowKeys)) {
            params.ids = this.selectedRowKeys.join(',')
          }
          return exportGet(params).then(res => {
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
          title: '票据详情',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: detail,
          on: {
            ok: () => {},
            close: () => {}
          },
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
    },
    changeInOut(n) {
      this.queryParam.getType = n === 1 ? '收票' : '开票'
      this.refresh()
    }
  }
}
</script>

<style lang="less" scoped></style>
