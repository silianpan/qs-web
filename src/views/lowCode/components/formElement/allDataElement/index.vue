<template>
  <!-- 数据表格 -->
  <s-table ref="table" size="default" rowKey="_id" :columns="columns" :data="loadData"> </s-table>
</template>

<script>
import { STable } from '/src/components/index.js'
import { createDataFind } from '/src/api/processDesign/index.js'

export default {
  components: { STable },
  props: {
    formId: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      columns: [
        {
          title: '提交人',
          dataIndex: 'create_by',
          align: 'center'
        },
        {
          title: '提交时间',
          dataIndex: 'create_time',
          align: 'center'
        },
        {
          title: '更新时间',
          dataIndex: 'update_time',
          align: 'center'
        }
      ],
      // 查询参数
      queryParam: {
        isOwner: false
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => this.initData(param)
    }
  },
  methods: {
    initData(param) {
      return createDataFind(Object.assign({}, param, this.queryParam)).then(res => {
        const findHeader = res.header.map(({ label, vModel }) => ({ title: label, dataIndex: vModel, align: 'center' }))
        const columns = [...findHeader, ...this.columns]
        const obj = {}
        this.columns = columns.reduce((cur, next) => {
          // eslint-disable-next-line no-unused-expressions
          obj[next.dataIndex] ? '' : (obj[next.dataIndex] = true && cur.push(next))
          return cur
        }, [])
        return {
          data: res.data,
          totalCount: res.total,
          pageNum: param.pageNum,
          pageSize: param.pageSize
        }
      })
    }
  },
  created() {
    this.queryParam.tenantAppId = this.$route.params.id
    this.queryParam.formId = this.formId
  },
  watch: {
    formId(data) {
      this.queryParam.tenantAppId = this.$route.params.id
      this.queryParam.formId = data
      this.$refs.table.refresh()
    }
  }
}
</script>

<style></style>
