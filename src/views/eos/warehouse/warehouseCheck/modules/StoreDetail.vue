<template>
  <div>
    <s-descriptions title="基本信息" :formItems="formItems" :formData="formData" />
    <!-- 数据表格 -->
    <a-card :bordered="false" size="small">
      <a-collapse expand-icon-position="right" defaultActiveKey="库存">
        <a-collapse-panel key="库存" class="custom-collapse-panel">
          <span slot="header" class="custom-collapse-panel-header">库存</span>
          <s-table ref="table" size="default" :rowKey="(_, index) => index" :columns="columns" :data="loadData" />
        </a-collapse-panel>
      </a-collapse>
    </a-card>
  </div>
</template>

<script lang="jsx">
import { SDescriptions, STable } from '/src/components/index.js'
import ProjectDetail from '/src/views/eos/project/detail.vue'
import WarehouseDetail from '/src/views/eos/warehouse/warehouse/modules/WarehouseDetail.vue'
import { getProject } from '/src/api/eos/project/project.js'
import { getWarehouse } from '/src/api/eos/warehouse/warehouse'
import { queryInDetail } from '/src/api/eos/warehouse/warehouseInApply'
import { queryTransInDetail, queryTransOutDetail } from '/src/api/eos/warehouse/warehouseTransferApply'
import { queryOutDetail } from '/src/api/eos/warehouse/warehouseOutapply'
import InDetail from './inDetail'
import OutDetail from './outDetail'
import TransDetail from './transDetail'

export default {
  name: 'StoreDetail',
  components: {
    SDescriptions,
    STable
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    },
    // 传过来的每一行的table数据
    formData: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.tableData = this.row.rows
    this.$refs.table.refresh()
  },
  data() {
    return {
      formItems: [
        {
          label: '名称',
          prop: 'name'
        },
        {
          label: '编号',
          prop: 'code'
          // customRender: (text, record) => {
          //   return (
          //     <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleCodeClick(this.formData)}>
          //       {text}
          //     </span>
          //   )
          // }
        }
      ],
      loadData: param => {
        return new Promise(resolve => {
          resolve(param)
        }).then(param => {
          return {
            data: this.tableData,
            totalCount: this.row.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          align: 'center'
        },
        {
          title: '入库数量',
          dataIndex: 'inTotal',
          align: 'center',
          customRender: (text, record) => {
            return (
              <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleInDetail(this.formData.id, record.name)}>
                {text}
              </span>
            )
          }
        },
        {
          title: '划拨数量',
          dataIndex: 'transNum',
          align: 'center',
          customRender: (text, record) => {
            return (
              <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleTransDetail(this.formData.id, record.name)}>
                {text}
              </span>
            )
          }
        },
        {
          title: '出库数量',
          dataIndex: 'outTotal',
          align: 'center',
          customRender: (text, record) => {
            return (
              <span style="color:#348ee4;cursor:pointer" onClick={() => this.handleOutDetail(this.formData.id, record.name)}>
                {text}
              </span>
            )
          }
        },
        {
          title: '库存数量',
          dataIndex: 'leftNum',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    handleCodeClick(data) {
      if (data.type === '项目') {
        this.handleProjectDetail(data.id)
      } else {
        this.handleWarehouseDetail(data.id)
      }
    },
    /* 查看项目详情 */
    async handleProjectDetail(id) {
      const row = await getProject(id)
      if (!this.isEmpty(row)) {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '项目详情',
            width: '50%',
            maskClosable: true
          },
          content: {
            template: ProjectDetail,
            props: {
              row: row.data
            }
          }
        })
      } else {
        this.$message.error('获取详情失败')
      }
    },
    /* 查看库房详情 */
    async handleWarehouseDetail(id) {
      const row = await getWarehouse(id)
      if (!this.isEmpty(row)) {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '库房详情',
            width: '50%',
            maskClosable: true
          },
          content: {
            template: WarehouseDetail,
            props: {
              row: row.data
            }
          }
        })
      } else {
        this.$message.error('获取详情失败')
      }
    },
    /* 查看当前物品的入库明细 */
    async handleInDetail(id, name) {
      const queryParams = { name: name }
      if (this.formData.type === '项目') {
        queryParams.projectId = id
      } else {
        queryParams.warehouseId = id
      }
      const row = await queryInDetail(queryParams)
      if (!this.isEmpty(row)) {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '入库明细',
            width: '80%',
            maskClosable: true
          },
          content: {
            template: InDetail,
            props: {
              row: row
            }
          }
        })
      } else {
        this.$message.error('获取详情失败')
      }
    },
    /* 查看当前物品的划拨明细 */
    async handleTransDetail(id, name) {
      const queryParams = { name: name }
      if (this.formData.type === '项目') {
        queryParams.projectId = id
      } else {
        queryParams.warehouseId = id
      }
      const row1 = await queryTransInDetail(queryParams)
      const row2 = await queryTransOutDetail(queryParams)
      if (!this.isEmpty(row1 && row2)) {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '划拨明细',
            width: '80%',
            maskClosable: true
          },
          content: {
            template: TransDetail,
            props: {
              inData: row1,
              outData: row2
            }
          }
        })
      } else {
        this.$message.error('获取详情失败')
      }
    },
    /* 查看当前物品的出库明细 */
    async handleOutDetail(id, name) {
      const queryParams = { name: name }
      if (this.formData.type === '项目') {
        queryParams.projectId = id
      } else {
        queryParams.warehouseId = id
      }
      const row = await queryOutDetail(queryParams)
      if (!this.isEmpty(row)) {
        this.$createAntdDrawer({
          stopPropagation: true,
          drawerProps: {
            title: '出库明细',
            width: '80%',
            maskClosable: true
          },
          content: {
            template: OutDetail,
            props: {
              row: row
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
