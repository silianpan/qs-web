<!-- 收款管理 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="handleAdd">新增</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search
          placeholder="搜索此列表..."
          clickTips="搜索项目名称、合同名称、收款单位、金额"
          @onSearch="onSearch"
          @clickquery="clickquery"
          @reset="() => (this.queryParam = { isAsc: 'desc', orderByColumn: 'createTime' })"
          :formItems="searchFormItems"
          :formData="queryParam"
        />
      </div>
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record">
          <a-button-group>
            <a-button type="link" @click.stop="_handleUpdate(record)">
              <a-icon type="edit" />
              修改
            </a-button>
            <a-button type="link" @click.stop="handleDelete(record)" style="color: #ff1493">
              <a-icon type="close-circle" />
              删除
            </a-button>
            <a-button type="link" @click.stop="handleNotice(record)" style="color: #008b45">
              <a-icon type="bell" />
              通知
            </a-button>
          </a-button-group>
        </span>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { listReal, delReal, exportReal, dingdingMSG } from '/src/api/eos/invoice/real.js'
import { listMerchant } from '/src/api/eos/merchant/merchant.js'
import { SSearch, STable, SDescriptions, Ellipsis } from '/src/components/index.js'
import RealForm from './RealForm.vue'
import MakeFormDetail from '/src/views/eos/invoice/make/details.vue'
import MemSelect from '/src/views/eos/project/mem/modules/MemSelect.vue'

export default {
  name: 'PaymentReal',
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
      dictKeys: [dictConfig.PROJECT_UNIT],
      dictMap: {},
      merchantList: [],
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      loadData: param => {
        // 时间范围
        if (!this.isEmpty(this.queryParam.dateRange)) {
          this.queryParam.payStartTime = moment(this.queryParam.dateRange[0]).format('YYYY-MM-DD') + ' 00:00:00'
          this.queryParam.payEndTime = moment(this.queryParam.dateRange[1]).format('YYYY-MM-DD') + ' 23:59:59'
          // delete this.queryParam.dateRange
        }else {
          delete this.queryParam.payStartTime
          delete this.queryParam.payEndTime
        }

        return listReal(Object.assign({}, param, this.queryParam)).then(res => {
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
        // {
        //   type: 'input',
        //   label: '实际收款金额',
        //   prop: 'thisMoney'
        // },
        {
          type: 'input',
          label: '开票单号',
          prop: 'makeCode'
        },
        {
          type: 'datePickerRange',
          label: '收款日期',
          prop: 'dateRange'
        }
      ],
      columns: [
        {
          title: '项目名称',
          dataIndex: 'sealProject.name',
          align: 'left',
          customRender: text => {
            return (
              <Ellipsis length={30} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '关联开票单号',
          dataIndex: 'makeCode',
          align: 'left',
          customRender: (text, record) => {
            return (
              <span
                style="color:#348EE4;cursor:pointer"
                onClick={e => {
                  e.stopPropagation()
                  this.handleContractDetail(record.sealInvoiceMake, record.sealInvoiceMake.id)
                }}
              >
                {text}
              </span>
            )
          }
        },
        {
          title: '付款单位',
          dataIndex: 'sealMerchant.name',
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
          title: '收款日期',
          dataIndex: 'payTime',
          align: 'left',
          customRender: text => moment(text).format('YYYY-MM-DD')
        },
        {
          title: '合同名称',
          dataIndex: 'sealContract.name',
          align: 'left',
          customRender: text => {
            return (
              <Ellipsis length={30} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '实际收款金额(元)',
          dataIndex: 'payMoney',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '操作',
          width: 160,
          scopedSlots: { customRender: 'action' },
          align: 'center'
        }
      ]
    }
  },
  created() {
    this.dictKeys.forEach(key => {
      this.getDicts(key).then(res => {
        this.$set(this.dictMap, key, res.data)
      })
    })
    listMerchant().then(res => {
      this.merchantList = res.rows
    })
  },
  methods: {
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '新增收款',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: RealForm,
          props: {},
          on: {
            ok: () => {
              this.$refs.table.refresh(true)
            }
          }
        }
      })
    },
    /** 修改按钮操作 */
    _handleUpdate(row) {
      const updateRow = { ...row }
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '修改收款',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: RealForm,
          props: {
            isUpdate: true,
            updateRow
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
        content: '是否确认删除实际收款编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delReal(ids).then(() => {
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
        content: '是否确认导出所有实际收款数据项?',
        onOk: () => {
          return exportReal(queryParam).then(res => {
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
          title: '收款详情',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: SDescriptions,
          props: {
            title: '实际收款详情',
            formData: row,
            formItems: [
              {
                label: '项目编号',
                prop: 'sealProject.code'
              },
              {
                label: '项目名称',
                prop: 'sealProject.name'
              },
              {
                label: '创建人',
                prop: 'sysUser.nickName'
              },
              {
                label: '收款时间',
                prop: 'payTime',
                formatter: val => {
                  return moment(val).format('YYYY/MM/DD')
                }
              },
              {
                label: '收款单位',
                prop: 'company'
              },
              {
                label: '付款单位',
                prop: 'sealMerchant.name'
              },
              {
                label: '开户银行',
                prop: 'sealMerchant.bank'
              },
              {
                label: '银行账号',
                prop: 'sealMerchant.account'
              },
              {
                label: '合同编号',
                prop: 'sealContract.code'
              },
              {
                label: '合同名称',
                prop: 'sealContract.name'
              },
              {
                label: '合同总金额',
                prop: 'sealContract.sum',
                customRender: text => this.toThousandFilter(text)
              },
              {
                label: '合同附件',
                prop: 'sealContract.attachment',
                customRender: text => {
                  return <s-doc-list text={text} />
                }
              },
              {
                label: '实际收款金额',
                prop: 'payMoney',
                customRender: text => this.toThousandFilter(text)
              },
              {
                label: '收款金额大写',
                prop: 'payMoneyUpper'
              },
              {
                label: '备注',
                prop: 'remark'
              }
            ]
          }
        }
      })
    },
    /* 发票详情 */
    handleContractDetail(row, formId) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '开票详情',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: MakeFormDetail,
          props: {
            title: '开票详情',
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
            selectType: 'checkbox',
            rowKey: 'dingUserId'
          },
          on: {
            ok: (Rows, Keys) => {
              dingdingMSG({ id: row.id, dingUserId: Keys.join(',') }).then(res => {
                this.$message.success('通知成功')
              })
            },
            cancel: () => {}
          }
        }
      })
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
