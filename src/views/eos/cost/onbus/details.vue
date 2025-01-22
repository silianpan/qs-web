<!-- 项目详细 -->
<template>
  <div>
    <s-descriptions :title="title" :formItems="formItems" :formData="formData" />
    <a-collapse>
      <a-collapse-panel key="1" header="差旅成本明细">
        <div class="table">
          <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" :show-pagination="false"> </s-table>
        </div>
        <a-row style="text-align: center">
          <a-col :span="6"
            >票价合计:<a-tag color="pink">
              {{ sealCostOnbus.travelPrice }}
            </a-tag></a-col
          >
          <a-col :span="6"
            >民航发展基金合计:<a-tag color="red">
              {{ sealCostOnbus.travelFund }}
            </a-tag></a-col
          >
          <a-col :span="6"
            >代理服务费合计:<a-tag color="orange">
              {{ sealCostOnbus.travelService }}
            </a-tag></a-col
          >
          <a-col :span="6"
            >总计:<a-tag color="blue">
              {{ sealCostOnbus.travelTotalMoney }}
            </a-tag></a-col
          >
        </a-row>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="项目和费用类型分类统计">
        <div class="table">
          <s-table ref="table" size="default" rowKey="oid" :columns="totalColumns" :data="totalLoadData" :show-pagination="false"> </s-table>
        </div>
        <a-row style="text-align: center">
          <a-col :span="6"
            >票价合计:<a-tag color="pink">
              {{ sealCostOnbus.travelPrice }}
            </a-tag></a-col
          >
          <a-col :span="6"
            >民航发展基金合计:<a-tag color="red">
              {{ sealCostOnbus.travelFund }}
            </a-tag></a-col
          >
          <a-col :span="6"
            >代理服务费合计:<a-tag color="orange">
              {{ sealCostOnbus.travelService }}
            </a-tag></a-col
          >
          <a-col :span="6"
            >总计:<a-tag color="blue">
              {{ sealCostOnbus.travelTotalMoney }}
            </a-tag></a-col
          >
        </a-row>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script lang="jsx">
import dictConfig from '/src/views/eos/config/dict.config.js'
import { SDescriptions, STable } from '/src/components/index.js'
import { uuidv4 } from '/src/utils/common/util.js'

export default {
  name: 'OnbusDetail',
  props: {
    formId: {
      type: Number,
      required: true
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    SDescriptions,
    STable
  },
  data() {
    return {
      dictKeys: [dictConfig.PROJECT_BUDGET_TYPE],
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time'
      },
      dictMap: {},
      merchantList: [],
      title: '项目详情',
      formData: {
        nickname: this.$store.getters.nickname,
      },
      budgetTypeVOS: [],
      sealCostOnbus: {},
      formItems: [
        {
          label: '上报编号',
          prop: 'orderCode',
          align: 'center'
        },
        {
          label: '上报人',
          prop: 'sysUser.nickName',
          align: 'center'
        },
        {
          label: '上报时间',
          prop: 'orderTime',
          align: 'center'
        },
        {
          label: '上报类型',
          prop: 'orderType',
          align: 'center'
        },
        {
          label: '上报说明',
          prop: 'orderInfo',
          align: 'center'
        },
        {
          label: '原始附件',
          prop: 'attachment',
          align: 'center',
          customRender: text => {
            return <s-doc-list text={text} />
          }
        }
        // {
        //   label: '票价合计(元)',
        //   prop: 'travelPrice',
        //   align: 'center',
        //   customRender: text => {
        //     return <a-tag color="purple">{text}</a-tag>
        //   }
        // },
        // {
        //   label: '民航发展基金合计(元)',
        //   prop: 'travelFund',
        //   align: 'center',
        //   customRender: text => {
        //     return <a-tag color="purple">{text}</a-tag>
        //   }
        // },
        // {
        //   label: '代理服务费合计(元)',
        //   prop: 'travelService',
        //   align: 'center',
        //   customRender: text => {
        //     return <a-tag color="purple">{text}</a-tag>
        //   }
        // },
        // {
        //   label: '合计总金额(元)',
        //   prop: 'travelTotalMoney',
        //   align: 'center',
        //   customRender: text => {
        //     return <a-tag color="purple">{text}</a-tag>
        //   }
        // }
      ],
      columns: [
        {
          title: '#',
          dataIndex: 'oid',
          fixed: 'left',
          align: 'center',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '组织名称',
          dataIndex: 'org',
          align: 'center'
        },
        {
          title: '订票时间',
          dataIndex: 'bookTime',
          align: 'center'
        },
        {
          title: '姓名',
          dataIndex: 'userName',
          align: 'center'
        },
        {
          title: '航班时间',
          dataIndex: 'travelTime',
          align: 'center'
        },
        {
          title: '航班信息',
          dataIndex: 'travelInfo',
          align: 'center'
        },
        {
          title: '票价(元)',
          dataIndex: 'travelPrice',
          align: 'center'
        },
        {
          title: '民航发展基金(元)',
          dataIndex: 'travelFund',
          align: 'center'
        },
        {
          title: '代理服务费(元)',
          dataIndex: 'travelService',
          align: 'center'
        },
        {
          title: '合计(元)',
          dataIndex: 'travelTotalMoney',
          align: 'center'
        },
        {
          title: '项目编号',
          dataIndex: 'projectCode',
          align: 'center'
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          align: 'center'
        },
        {
          title: '费用类型',
          dataIndex: 'expenseType',
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center'
        }
      ],
      loadData: param => {
        return new Promise(resolve => {
          resolve({
            data: this.row.sealCostOnbuses
          })
        })
      },
      totalColumns: [
        {
          title: '#',
          dataIndex: 'oid',
          fixed: 'left',
          align: 'center',
          customRender: (text, record, index) => {
            return index + 1
          }
        },
        {
          title: '项目编号',
          dataIndex: 'projectCode',
          align: 'center'
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          align: 'center'
        },
        {
          title: '费用类型',
          dataIndex: 'expenseType',
          align: 'center'
        },
        {
          title: '票价(元)',
          dataIndex: 'travelPrice',
          align: 'center'
        },
        {
          title: '民航发展基金(元)',
          dataIndex: 'travelFund',
          align: 'center'
        },
        {
          title: '代理服务费(元)',
          dataIndex: 'travelService',
          align: 'center'
        },
        {
          title: '合计(元)',
          dataIndex: 'travelTotalMoney',
          align: 'center'
        }
      ],
      totalLoadData: param => {
        return new Promise(resolve => {
          this.row.total.forEach(item => (item.oid = uuidv4()))
          resolve({
            data: this.row.total
          })
        })
      }
    }
  },
  created() {
    this.sealCostOnbus = this.row.sealCostOnbus
    this.formData = { ...this.row }
    // 查询字典
    this.dictKeys.forEach(key => {
      this.getDicts(key).then(res => {
        this.$set(this.dictMap, key, res.data)
      })
    })
  }
}
</script>
<style lang="less" scoped>
.table {
  max-height: 420px;
  overflow: auto;
}
</style>
