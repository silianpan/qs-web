<!-- 库存盘点列表 -->
<template>
  <a-card :bordered="false">
    <h1 slot="title" class="card-title">库存盘点</h1>
    <no-data v-show="noDataWarehouse" />
    <s-table v-show="!noDataWarehouse" ref="warehouseTable" size="default" :rowKey="(_, index) => index" :columns="WarehouseColumns" :data="WarehouseLoadData" :show-pagination="true"> </s-table>
  </a-card>
</template>

<script>
import { STable } from '/src/components/index.js'
import { WareHouseIndex } from '../../../../api/dashboard/PM'
export default {
  name: 'DashboardIndex',
  components: {
    STable
  },
  data() {
    return {
      noDataWarehouse: false,
      queryParam: {},
      WarehouseLoadData: param => {
        return WareHouseIndex(Object.assign({}, param, this.queryParam)).then(res => {
          this.noDataWarehouse = res.data.length === 0
          return {
            data: res.data,
            totalCount: res.data.length,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      WarehouseColumns: [
        {
          title: '物料名称',
          dataIndex: 'name',
          align: 'center'
        },
        {
          title: '规格',
          dataIndex: 'spec',
          align: 'center'
        },
        {
          title: '单位',
          dataIndex: 'unit',
          align: 'center'
        },
        {
          title: '库存数量',
          dataIndex: 'leftNum',
          align: 'center'
        },
        {
          title: '项目',
          dataIndex: 'projectName',
          align: 'center',
          customRender: (text, record) => {
            return record.projectName ? text : record.warehouseName
          }
        }
      ]
    }
  },
  methods: {
    // 刷新页面
    refresh() {
      this.$nextTick(() => {
        this.$refs.warehouseTable.refresh()
      })
    }
  }
}
</script>

<style></style>
