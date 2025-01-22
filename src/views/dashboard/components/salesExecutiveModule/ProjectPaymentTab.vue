<!-- 项目收款表格  -->
<template>
  <a-card class="" :bordered="false" :headStyle="{ border: 'none' }" :bodyStyle="{ padding: '10px 0', overflow: 'hidden' }">
    <h1 class="my-todo-title">{{ title }}</h1>
    <div class="wap">
      <STable :columns="columns" :data="data" :customRow="rowClick" :rowKey="(_, index) => index">
        <template slot="name" slot-scope="text">
          <span style="color: #666666">{{ text }}</span>
        </template>
      </STable>
    </div>
  </a-card>
</template>

<script>
import { STable } from '/src/components/index.js'
export default {
  name: 'ProjectPaymentTab',
  components: { STable },
  props: {
    title: {
      type: String,
      required: true
    },
    data: {
      type: Function,
      default: () => {}
    },
    columns: {
      type: Array,
      required: true // 配置项必传
    },
    handleDetail: {
      type: Function,
      default: () => {}
    }
    // id: {
    //   type: String,
    //   required: true,
    //   default: 'id'
    // }
  },
  data() {
    return {
      rowClick: record => ({
        // 事件
        on: {
          click: () => {
            // console.log(record)
            // 点击改行时要做的事情
            this.handleDetail(record.projectId)
          }
        },
        style: {
          cursor: 'pointer'
        }
      })
    }
  },
  computed: {},
  watch: {},
  created() {
    // console.log('data666', this.data)
  },
  mounted() {},
  methods: {
    /** 详情 */
    // handleDetail(row) {
    //   return getProject(row).then(res => {
    //     this.$createAntdDrawer({
    //       stopPropagation: true,
    //       drawerProps: {
    //         title: '项目详情',
    //         width: '80%',
    //         maskClosable: true
    //       },
    //       content: {
    //         template: detailAll,
    //         props: {
    //           row: res.data
    //         }
    //       }
    //     })
    //   })
    // }
  }
}
</script>

<style scoped lang="less">
.wap {
  background: #ffffff;
}
th.column-money,
td.column-money {
  text-align: right !important;
}
.my-todo-title {
  padding: 6px 36px;
  margin-bottom: 11px;
  font-size: 18px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333333;
}
.my-todo-title:before {
  content: '';
  position: absolute;
  left: 20px;
  top: 20px;
  width: 8px;
  height: 20px;
  background: #348ee4;
  border-radius: 4px;
}
.title {
  font-size: 16px;
}
::v-deep .ant-table-content {
  width: 98%;
  margin-left: 15px;
}
::v-deep .ant-table-pagination {
  float: right;
  margin-right: 20px;
}
</style>
