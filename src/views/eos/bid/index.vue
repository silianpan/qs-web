<!-- 招标信息管理 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="handleAdd">新增</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索标（包）名称/编号、创建人" @onSearch="onSearch" />
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
import moment from 'moment'
import { listBid, delBid } from '/src/api/eos/bid/bid.js'
import { SSearch, STable, SActionColumns } from '/src/components/index.js'
import BidForm from './modules/BidForm.vue'
import BidDetail from './modules/BidDetail.vue'

export default {
  name: 'Bid',
  components: {
    STable,
    SSearch,
    SActionColumns
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
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listBid(Object.assign({}, param, this.queryParam)).then(res => {
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
          title: '标（包）名称',
          dataIndex: 'name',
          align: 'left'
        },
        {
          title: '标（包）编号',
          dataIndex: 'code',
          align: 'left'
        },
        {
          title: '描述',
          dataIndex: 'description',
          align: 'left'
        },
        {
          title: '开标日期',
          dataIndex: 'openDate',
          align: 'center',
          customRender: text => moment(text).format('YYYY-MM-DD')
        },
        {
          title: '代理机构',
          dataIndex: 'agency',
          align: 'left'
        },
        {
          title: '附件',
          dataIndex: 'attachment',
          align: 'center',
          customRender: (text, record) => {
            return <s-doc-list text={text} />
          }
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
  methods: {
    /* 查询按钮 */
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    },
    // 刷新页面
    refresh() {
      this.noData = false
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
          title: '新增招标信息',
          width: '45%',
          maskClosable: true
        },
        content: {
          template: BidForm,
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
          title: '修改招标信息',
          width: '45%',
          maskClosable: true
        },
        content: {
          template: BidForm,
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
        content: '是否确认删除招标信息编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delBid(ids).then(() => {
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
          title: '招标信息',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: BidDetail,
          props: {
            row
          }
        }
      })
    }
  }
}
</script>
