<!-- 客商管理 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="handleAdd">新增</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索客商名称" @onSearch="onSearch" />
      </div>
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record">
          <s-action-columns :actions="actions" :record="record" />
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import { listMerchant, delMerchant, exportMerchant } from '/src/api/eos/merchant/merchant.js'

import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'
import SSearch from '/src/components/Form/Search.vue'
import STable from '/src/components/Table/index.jsx'
import SActionColumns from '/src/components/Table/ActionColumns.vue'
import MerchantForm from './modules/MerchantForm.vue'
import MerchantDetail from './modules/MerchantDetail.vue'

export default {
  name: 'Merchant',
  components: {
    SActionColumns,
    SSearch,
    STable
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
      /* 是否有数据 */
      noData: false,
      dictKeys: [],
      dictMap: {},
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listMerchant(Object.assign({}, param, this.queryParam)).then(res => {
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
          title: '名称',
          dataIndex: 'name',
          align: 'left'
        },
        {
          title: '客商类型',
          dataIndex: 'type',
          align: 'left'
        },
        {
          title: '地址',
          dataIndex: 'address',
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
          title: '税号',
          dataIndex: 'taxNumber',
          align: 'left',
          customRender: text => {
            return text ? (
              <Ellipsis length={18} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          title: '纳税人类别',
          dataIndex: 'taxpayerType',
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'left'
        },
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
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '新增客商',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: MerchantForm,
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
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '修改客商',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: MerchantForm,
          props: {
            isUpdate: true,
            updateRow: row
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
        content: '是否确认删除客商管理编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delMerchant(ids).then(() => {
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
        content: '是否确认导出所有客商管理数据项?',
        onOk: () => {
          return exportMerchant(queryParam).then(res => {
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
          title: '客商详情',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: MerchantDetail,
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
      this.queryParam = { ...this.queryParam, name: data }
      this.refresh()
    }
  }
}
</script>
