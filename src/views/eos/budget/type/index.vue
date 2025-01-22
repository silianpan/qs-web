<!-- 预算类型 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <!-- 查询表单 -->
      <div class="table-header-btns">
        <a-button-group>
          <a-button ghost type="primary" @click="handleAdd">新增</a-button>
          <a-button ghost type="primary" @click="handleDelete" v-hasPermi="['project:type:remove']">删除</a-button>
          <a-button ghost type="primary" @click="handleExport" v-hasPermi="['project:type:export']">导出</a-button>
        </a-button-group>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索预算名称" @onSearch="onSearch" />
      </div>

      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :rowSelection="rowSelection">
        <span slot="action" slot-scope="text, record, index">
          <a-button type="link" @click="handleUpdate(text, record, index)"> <a-icon type="edit" /> 编辑 </a-button>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import dictConfig from '/src/views/eos/config/dict.config.js'
import { listType, delType, exportType } from '/src/api/eos/budget/type.js'
import { STable, SDescriptions, SSearch } from '/src/components/index.js'
import TypeForm from './modules/TypeForm.vue'

export default {
  name: 'Type',
  components: {
    STable,
    SSearch
  },
  data() {
    return {
      noData: false,
      dictKeys: [dictConfig.PROJECT_BUDGET_TYPE],
      dictMap: {},
      selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time',
        tenantAppId: this.$store.getters.tenantAppId,
        menuId: this.$route.meta.moduleId
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listType(Object.assign({}, param, this.queryParam)).then(res => {
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
        //   title: '#',
        //   dataIndex: 'id',
        //   align: 'center'
        // },
        {
          title: '预算名称',
          dataIndex: 'name',
          align: 'left'
        },
        {
          title: '预算类型 ',
          dataIndex: 'type',
          align: 'left'
        },
        // {
        //   title: '成本或者费用',
        //   dataIndex: 'corE',
        //   align: 'center'
        // },
        // {
        //   title: '是否对应合同',
        //   dataIndex: 'hasContract',
        //   align: 'center'
        // },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'left'
        },
        {
          title: '操作',
          width: 170,
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
    refresh() {
      this.$refs.table.refresh(true)
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdModal({
        stopPropagation: true,
        modalProps: {
          title: '预算类型',
          width: '40%',
          centered: true,
          maskClosable: true
        },
        footer: {
          template: 'div'
        },
        content: {
          template: TypeForm,
          on: {
            saveSuccess: () => {
              this.$refs.table.refresh(true)
            }
          }
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(text, record, index) {
      this.$createAntdModal({
        stopPropagation: true,
        modalProps: {
          title: '预算类型',
          width: '40%',
          centered: true,
          maskClosable: true
        },
        footer: {
          template: 'div'
        },
        content: {
          template: TypeForm,
          props: {
            record
          },
          on: {
            saveSuccess: () => {
              this.$refs.table.refresh(true)
            },
            restore: () => {
              this.$refs.table.refresh(true)
            }
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = this.selectedRowKeys.join(',')
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除预算类型编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delType(ids).then(() => {
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
        content: '是否确认导出所有预算类型数据项?',
        onOk: () => {
          return exportType(queryParam).then(res => {
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
          title: '预算类型详情',
          width: '30%',
          maskClosable: true
        },
        content: {
          template: SDescriptions,
          props: {
            title: '预算类型详情',
            formData: row
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
