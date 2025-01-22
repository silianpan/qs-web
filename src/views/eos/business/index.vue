<!-- 商机管理 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="handleAdd">新增</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索商机名称、业主单位、销售负责人" @onSearch="onSearch" />
      </div>
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record">
          <s-action-columns :actions="getTableActions(record)" :record="record" />
        </span>
        <!-- 表格列搜索 -->
        <template slot="filterDropdown" slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }">
          <s-table-column-search @onSearch="handleColumnSearch" v-ant-ref="c => (searchInput = c)" :setSelectedKeys="setSelectedKeys" :selectedKeys="selectedKeys" :confirm="confirm" :clearFilters="clearFilters" :column="column" />
        </template>
        <template slot="filterIcon" slot-scope="filtered">
          <s-table-column-search-icon :filtered="filtered" />
        </template>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import moment from 'moment'
import { listBusiness, delBusiness, addBusinessStage } from '/src/api/eos/business/business.js'
import { SSearch, SActionColumns, STable, STableColumnSearch, STableColumnSearchIcon, Ellipsis } from '/src/components/index.js'
import BusinessForm from './modules/BusinessForm.vue'
import BusinessDetail from './modules/BusinessDetail.vue'
import ProjectForm from '/src/views/eos/project/modules/ProjectForm.vue'
import BusinessStageForm from './modules/BusinessStageForm.vue'

export default {
  name: 'Business',
  components: {
    SActionColumns,
    SSearch,
    STable,
    STableColumnSearch,
    STableColumnSearchIcon
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
      actions: [
        {
          label: '跟踪',
          icon: 'iconfont-zhiyeshengyamubiao',
          action: this.handleTrace
        },
        {
          label: '修改',
          icon: 'iconfont-bianji',
          action: this.handleUpdate
        },
        {
          label: '删除',
          icon: 'iconfont-shanchu',
          action: this.handleDelete
        }
      ],
      dictKeys: [],
      dictMap: {},
      // 查询参数
      queryParam: {},
      /* 是否有数据 */
      noData: false,
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listBusiness(Object.assign({}, param, this.queryParam)).then(res => {
          this.noData = res.total === 0
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      searchInput: null,
      columns: [
        {
          title: '商机名称',
          dataIndex: 'name',
          align: 'left',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon'
          },
          sortDirections: ['descend', 'ascend'],
          sorter: (a, b) => {
            // 调用接口查询
            // this.handleSortByColumn('name', a.name.length - b.name.length > 0 ? 'desc' : 'asc')
            return a.name.length - b.name.length
          },
          onFilter: (value, record) => record.name.toString().toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.$refs.searchInput.focus()
              }, 0)
            }
          }
        },
        {
          title: '商机描述',
          dataIndex: 'remark',
          align: 'left',
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
          title: '跟踪状态',
          dataIndex: 'businessState',
          align: 'left'
        },
        {
          title: '业主单位',
          dataIndex: 'ownerUnit',
          align: 'left'
        },
        {
          title: '预估金额(元)',
          dataIndex: 'amount',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '是否招投标',
          dataIndex: 'bid',
          align: 'center'
        },
        {
          title: '资金来源',
          dataIndex: 'fundSource',
          align: 'left'
        },
        {
          title: '预期利润率',
          dataIndex: 'profitRate',
          align: 'left'
        },
        {
          title: '销售负责人',
          dataIndex: 'sysUser.nickName',
          align: 'center'
        },
        // {
        //   title: '附件',
        //   dataIndex: 'attachment',
        //   align: 'center',
        //   customRender: (text, record) => {
        //     return <s-doc-list text={text} />
        //   }
        // },
        {
          title: '操作',
          align: 'center',
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
  },
  methods: {
    /* 列搜索 */
    handleColumnSearch(key, value) {
      this.queryParam[key] = value
    },
    getTableActions(record) {
      if (record.businessState !== '转化项目') {
        return [
          ...this.actions,
          {
            label: '转化项目',
            icon: 'iconfont-xiangmuguanli5',
            action: this.handleTransfer
          }
        ]
      }
      return this.actions
    },
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '新增商机信息',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: BusinessForm,
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
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '修改商机信息',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: BusinessForm,
          props: {
            isUpdate: true,
            updateRow: row
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
        content: '是否确认删除商机信息编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delBusiness(ids).then(() => {
            this.refresh()
            this.$message.success('删除成功', 3)
          })
        }
      })
    },
    /** 详情 */
    handleDetail(row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '商机详情',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: BusinessDetail,
          props: {
            formId: row.id
          }
        }
      })
    },
    // 刷新页面
    refresh() {
      this.$refs.table.refresh(true)
    },
    /* 查询按钮 */
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    },
    /* 转化项目 */
    handleTransfer(row) {
      // 新建项目
      const { name, ownerUnit, remark, id: businessId } = row
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '转化项目',
          width: '50%',
          maskClosable: true
        },
        content: {
          template: ProjectForm,
          props: {
            updateRow: {
              businessId,
              name,
              ownerUnit,
              remark
            }
          },
          on: {
            ok: () => {
              // 新增商机跟踪商机状态
              addBusinessStage({
                businessCode: row.code,
                name: '商机转化',
                state: '转化项目',
                recordTime: moment().format('YYYY-MM-DD HH:mm:ss')
              }).then(res => {
                this.$message.success(res.msg)
                this.refresh()
              })
            }
          }
        }
      })
    },
    /* 商机跟踪 */
    handleTrace(row) {
      this.$createAntdModal({
        stopPropagation: true,
        modalProps: {
          title: '活动',
          width: '60%',
          centered: true,
          maskClosable: true
        },
        footer: {
          template: 'div'
        },
        content: {
          template: BusinessStageForm,
          props: {
            formId: row.id,
            businessCode: row.code
          },
          on: {
            saveSuccess: () => {
              this.refresh()
            }
          }
        }
      })
    },
    /* 排序，orderProps：排序列；orderType：排序方式：asc, desc*/
    handleSortByColumn(orderProps, orderType) {
      const { orderByColumn } = this.queryParam
      let orderStr = null
      if (!this.isEmpty(orderByColumn)) {
        orderStr = `${orderByColumn}, ${orderProps} ${orderType}`
      } else {
        orderStr = `${orderProps} ${orderType}`
      }
      this.queryParam = { ...this.queryParam, orderByColumn: orderStr }
      this.refresh()
    }
  }
}
</script>
