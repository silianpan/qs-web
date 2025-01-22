<template>
  <a-card class="card-container card-container-height" :bordered="false" :headStyle="{ border: 'none' }" :bodyStyle="{ padding: 0, overflow: 'hidden' }">
    <h1 slot="title" class="card-title">{{ title }}</h1>
    <no-data v-show="noData" />
    <s-table class="recentproject-table" v-show="!noData" ref="table" size="default" rowKey="id" :columns="columns" :data="loadData"> </s-table>
  </a-card>
</template>

<script lang="jsx">
import STable from '/src/components/Table/index.jsx'
import { listProject } from '/src/api/eos/project/project.js'
const statusImgs = import.meta.globEager('../../../../assets/img/dashboard/recentProject/*.png')
import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'

export default {
  name: 'RencentProject',
  props: {
    title: {
      type: String,
      default: null
    }
  },
  components: {
    STable
  },
  data() {
    return {
      noData: false,
      simple: true,
      projectList: [],
      columns: [
        {
          title: '状态',
          dataIndex: 'state',
          align: 'center',
          width: 90,
          customRender: (text, record) => {
            let imgSrc = null
            if (text === '在建') {
              imgSrc = statusImgs['../../../../assets/img/dashboard/recentProject/time.png'].default
            } else if (text === '关闭') {
              imgSrc = statusImgs['../../../../assets/img/dashboard/recentProject/house.png'].default
            } else {
              imgSrc = statusImgs['../../../../assets/img/dashboard/recentProject/phone.png'].default
            }
            return <img style={{ width: '30px', height: '30px' }} src={imgSrc}></img>
          }
        },
        {
          title: '项目',
          dataIndex: 'name',
          align: 'center',
          customRender: text => {
            return (
              <Ellipsis length={20} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '类型',
          dataIndex: 'type',
          align: 'center',
          width: 90
        }
      ],
      queryParam: {},
      loadData: param => {
        if (this.simple) {
          param.pageNum = 1
          param.pageSize = 4
        }
        return listProject(Object.assign({}, param, this.queryParam)).then(res => {
          res.rows.forEach(item => {
            delete item.children
          })
          this.noData = res.total === 0
          return {
            data: res.rows,
            totalCount: this.simple ? 0 : res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      }
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less">
.recentproject-table {
  border-top: 1px solid #ebebeb;
  .s-table {
    .ant-table-tbody {
      tr > td {
        border: none;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #333333;
      }
    }
    .ant-table-thead {
      tr {
        > th {
          background-color: transparent !important;
          color: black;
          border: none;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #333333;
        }
      }
    }
  }
}
</style>
