<!-- 开票使用情况：根据项目ID获取开票信息 -->
<template>
  <div>
    <!-- 查询表单 -->
    <div class="table-page-search-wrapper">
      <s-form search layout="inline" @search="$refs.table.refresh(true)" @reset="reset" :formItems="searchFormItems" :formData="queryParam" />
    </div>

    <!-- 数据表格 -->
    <s-table ref="table" rowKey="id" :columns="columns" :data="loadData" />
  </div>
</template>

<script lang="jsx">
import moment from 'moment'
import dictConfig from '/src/views/eos/config/dict.config.js'
import { SForm, STable } from '/src/components/index.js'
import { listMake } from '/src/api/eos/invoice/make.js'
import makeDatil from '../details.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'

export default {
  name: 'MakeUse',
  components: {
    SForm,
    STable
  },
  props: {
    projectId: {
      type: Number,
      default: -1
    },
    // 创建时间
    createTime: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dictKeys: [dictConfig.PROJECT_UNIT, dictConfig.PROJECT_INVOICE_TYPE],
      dictMap: {},
      merchantList: [],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        param.projectId = this.projectId
        param.createTime = this.createTime
        param.zh = 'zh'
        return listMake(Object.assign({}, param, this.queryParam)).then(res => {
          const dataList = []
          res.rows.forEach(item => {
            if (item.busForm) {
              dataList.push({ ...item.busForm, busFlow: item.busFlow })
            }
          })
          return {
            data: dataList,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      searchFormItems: [
        {
          type: 'input',
          label: '申请单号',
          prop: 'code'
        },
        {
          type: 'input',
          label: '项目名称',
          prop: 'projectName'
        },
        {
          type: 'input',
          label: '开票单位',
          prop: 'makeUnit'
        },
        {
          type: 'input',
          label: '本次开票金额',
          prop: 'thisMoney'
        },
        {
          type: 'datePicker',
          label: '开票时间',
          prop: 'makeTime'
        },
        {
          type: 'input',
          label: '合同名称',
          prop: 'contractName'
        },
        {
          type: 'input',
          label: '开票类型',
          prop: 'type'
        }
      ],
      columns: [
        {
          title: '申请单号',
          dataIndex: 'code',
          align: 'center',
          customRender: (text, record) => {
            return (
              <span style="color:#348EE4;cursor:pointer" onClick={() => this.handleDetail(record, record.id)}>
                {text}
              </span>
            )
          }
        },
        {
          title: '申请人',
          dataIndex: 'sysUser.nickName',
          align: 'center'
        },
        {
          title: '开票单位',
          dataIndex: 'makeUnit',
          align: 'center'
        },
        {
          title: '本次开票金额(元)',
          dataIndex: 'thisMoney',
          align: 'left',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '开票时间',
          dataIndex: 'makeTime',
          align: 'center',
          customRender: text => moment(text).format('MM-DD HH:mm')
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          align: 'center'
        },
        {
          title: '合同名称',
          dataIndex: 'contractName',
          align: 'center'
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          align: 'center',
          customRender: text => {
            return <AuditStatusTag state={text} />
          }
        },
        {
          title: '开票类型',
          dataIndex: 'type',
          align: 'center'
        },
        {
          title: '当前税率(%)',
          dataIndex: 'taxRate',
          align: 'center'
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
    reset() {
      this.queryParam = { isAsc: 'desc', orderByColumn: 'create_time' }
    },
    /** 详情 */
    handleDetail(row, formId) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '开票详情',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: makeDatil,
          props: {
            title: '开票详情',
            row,
            formId
          }
        }
      })
    }
  }
}
</script>
