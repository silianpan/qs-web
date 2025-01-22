<!-- 库存盘点列表 -->
<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-radio-group v-model="radioValue" @change="onChange">
          <a-radio value="项目">按项目</a-radio>
          <a-radio value="库房">按库房</a-radio>
        </a-radio-group>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search v-if="(radioValue === '项目' && !noDataProject) || (radioValue === '库房' && !noDataWarehouse)" placeholder="搜索此列表..." clickTips="搜索名称" @onSearch="onSearch" />
      </div>
      <!-- 数据表格 按项目 -->
      <no-data v-show="(radioValue === '项目' && noDataProject) || (radioValue === '库房' && noDataWarehouse)" />
      <s-table ref="projectTable" :customRow="rowClick" size="default" rowKey="id" :columns="projectColumns" :data="ProjectLoadData" v-show="radioValue === '项目' && !noDataProject"> </s-table>
      <!-- 数据表格 按库房 -->
      <s-table ref="warehouseTable" :customRow="rowClick2" size="default" rowKey="id" :columns="WarehouseColumns" :data="WarehouseLoadData" v-show="radioValue === '库房' && !noDataWarehouse"> </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import { STable, SSearch } from '/src/components/index.js'
import { projectInStore, listWarehouse, storeByProject, storeByWarehouse } from '/src/api/eos/warehouse/warehouse'
import StoreDetail from './modules/StoreDetail'
export default {
  name: 'WarehouseCheck',
  components: {
    SSearch,
    STable
  },
  data() {
    return {
      rowClick: record => ({
        on: {
          click: () => {
            this.ProjectDetail(record)
          }
        },
        style: {
          cursor: 'pointer'
        }
      }),
      rowClick2: record => ({
        on: {
          click: () => {
            this.warehouseDetail(record)
          }
        },
        style: {
          cursor: 'pointer'
        }
      }),
      /* 是否有数据 */
      noDataProject: false,
      noDataWarehouse: false,
      /* 切换表格 */
      radioValue: '项目',
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      ProjectLoadData: param => {
        return projectInStore(Object.assign({}, param, this.queryParam)).then(res => {
          this.noDataProject = res.total === 0
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      WarehouseLoadData: param => {
        return listWarehouse(Object.assign({}, param, this.queryParam)).then(res => {
          this.noDataWarehouse = res.total === 0
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      projectColumns: [
        {
          title: '名称',
          dataIndex: 'name',
          align: 'left'
        },
        {
          title: '编号',
          dataIndex: 'code',
          align: 'left'
        }
        // {
        //   title: '操作',
        //   width: 160,
        //   align: 'center',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      WarehouseColumns: [
        {
          title: '名称',
          dataIndex: 'name',
          align: 'left'
        },
        {
          title: '编号',
          dataIndex: 'code',
          align: 'left'
        }
        // {
        //   title: '操作',
        //   width: 160,
        //   align: 'center',
        //   scopedSlots: { customRender: 'action' }
        // }
      ]
    }
  },
  methods: {
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
      if (this.radioValue === '项目') {
        this.$nextTick(() => {
          this.$refs.projectTable.refresh()
        })
      } else {
        this.$nextTick(() => {
          this.$refs.warehouseTable.refresh()
        })
      }
    },
    /* 切换表格重新请求 */
    onChange(e) {
      this.refresh()
    },
    async ProjectDetail(record) {
      const data = await storeByProject({ projectId: record.id })
      const formData = { ...record }
      formData.type = this.radioValue
      if (!this.isEmpty(data)) {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '库存详情',
            width: '50%',
            maskClosable: true
          },
          content: {
            template: StoreDetail,
            props: {
              row: data,
              formData: formData
            }
          }
        })
      } else {
        this.$message.error('获取详情失败')
      }
    },
    async warehouseDetail(record) {
      const data = await storeByWarehouse({ warehouseId: record.id })
      const formData = { ...record }
      formData.type = this.radioValue
      if (!this.isEmpty(data)) {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '库存详情',
            width: '50%',
            maskClosable: true
          },
          content: {
            template: StoreDetail,
            props: {
              row: data,
              formData: formData
            }
          }
        })
      } else {
        this.$message.error('获取详情失败')
      }
    }
  }
}
</script>

<style></style>