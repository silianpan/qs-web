<!-- 保证金退还列表 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索项目名称、保证金类型/金额、备注" @onSearch="onSearch" />
      </div>
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record">
          <a-button-group>
            <a-button type="link" @click.stop="handleUpdate(record)">
              <a-icon type="pay-circle" />
              退还金额
            </a-button>
            <!-- <a-button type="link" @click="handleDelete(record)" style="color: #ff1493">
              <a-icon type="close-circle" />
              删除
            </a-button> -->
          </a-button-group>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import { delReturn, exportReturn } from '/src/api/eos/earnest/earnestReturn.js'
import { listApply } from '/src/api/eos/earnest/earnestMoney.js'
import { SSearch, STable } from '/src/components/index.js'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import detailAndReturnList from '/src/views/eos/earnest/return/detailAndList.vue'
import PopoutReturn from './modules/PopoutReturn.vue'

export default {
  name: 'Return',
  components: {
    SSearch,
    STable
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
        orderByColumn: 'createTime',
        return: 'return'
      },
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
      searchFormItems: [],
      columns: [
        {
          title: '申请单号',
          dataIndex: 'code',
          align: 'left'
        },
        {
          title: '所属招投标',
          dataIndex: 'sealBid.name',
          align: 'center'
        },
        {
          title: '申请人',
          align: 'left',
          dataIndex: 'sysUser.nickName',
        },
        {
          title: '保证金类型',
          align: 'left',
          dataIndex: 'depositType',
        },
        {
          title: '保证金金额(元)',
          dataIndex: 'depositMoney',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '预计退还时间',
          align: 'left',
          dataIndex: 'returnTime',
        },
        {
          title: '退还金额(元)',
          dataIndex: 'returnAllMoney',
          align: 'left',
          customRender: text => {
            return text == null ? <span style="color:red">未退还</span> : this.toThousandFilter(text)
          }
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
    // /** 新增按钮操作，新建表单 */
    // handleAdd() {
    //   this.$createAntdDrawer({
    //     stopPropagation: true,
    //     drawerProps: {
    //       title: '新增保证金退还',
    //       width: '60%',
    //       maskClosable: true
    //     },
    //     content: {
    //       template: ReturnForm,
    //       on: {
    //         ok: () => {
    //           this.refresh()
    //         }
    //       }
    //     }
    //   })
    // },
    /**
     * 退还
     */
    handleUpdate(record) {
      const that = this
      this.$createAntdModal({
        stopPropagation: true,
        modalProps: {
          title: '保证金退还',
          width: '35%',
          centered: true,
          maskClosable: true
        },
        content: {
          template: PopoutReturn,
          props: {
            record
          },
          on: {
            // saveChildProjectSuccess: () => {
            //   // record是父项目
            //   this.getExpandData(record)
            // }
          }
        },
        footer: {
          template: 'div'
        },
        beforeClose: function () {},
        afterClose: function () {},
        onOk() {
          that.refresh()
        }
      })
    },
    // /** 修改按钮操作 */
    // handleUpdate(row) {
    //   const updateRow = { ...row }
    //   this.$createAntdDrawer({
    //     stopPropagation: true,
    //     drawerProps: {
    //       title: '修改保证金退还',
    //       width: '60%',
    //       maskClosable: true
    //     },
    //     content: {
    //       template: ReturnForm,
    //       props: {
    //         isUpdate: true,
    //         updateRow
    //       },
    //       on: {
    //         ok: () => {
    //           this.refresh()
    //         }
    //       }
    //     }
    //   })
    // },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除保证金退还单号为"' + row.code + '"的数据项?',
        onOk: () => {
          return delReturn(ids).then(() => {
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
        content: '是否确认导出所有保证金退还数据项?',
        onOk: () => {
          return exportReturn(queryParam).then(res => {
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
          title: '保证金退还详情',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: detailAndReturnList,
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
    }
  }
}
</script>
