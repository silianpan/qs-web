<!-- 主体收支项目 -->
<template>
  <a-card :bordered="false">
    <!-- 查询表单 -->
    <div class="table-page-search-wrapper">
      <s-form search layout="inline" @search="refresh" @reset="reset" :formItems="searchFormItems" :formData="queryParam"> </s-form>
    </div>
    <!-- 数据表格 -->
    <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData"> </s-table>
  </a-card>
</template>

<script lang="jsx">
import dictConfig from '/src/views/eos/config/dict.config.js'
import { listProjectAll } from '/src/api/eos/project/project.js'
import { SForm, STable, Ellipsis } from '/src/components/index.js'
import ProjectDetail from '/src/views/eos/project/detail.vue'
// import search from '/src/components/Form/search'

export default {
  name: 'SubjectProject',
  props: {
    queryUint: {
      type: String,
      require: true,
      default: ''
    }
  },
  components: {
    SForm,
    STable
  },
  data() {
    return {
      dictKeys: [dictConfig.PROJECT_TYPE],
      dictMap: {},
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: ['create_time'],
        queryUint: this.queryUint
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listProjectAll(Object.assign({}, param, this.queryParam)).then(res => {
          return {
            data: res.data,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      searchFormItems: [
        {
          type: 'input',
          prop: 'code',
          label: '项目编号'
        },
        {
          type: 'input',
          prop: 'name',
          label: '项目名称'
        },
        {
          type: 'select',
          prop: 'type',
          label: '项目类型',
          options: () => this.dictMap[dictConfig.PROJECT_TYPE]
        }
      ],
      columns: [
        {
          title: '申请人',
          dataIndex: 'sysUser.nickName',
          customRender: (text, record) => {
            return (
              <Ellipsis length={7} tooltip>
                {record.sysUser.nickName}
              </Ellipsis>
            )
          }
        },
        {
          title: '申请时间',
          dataIndex: 'createTime'
        },
        {
          title: '项目编号',
          dataIndex: 'code',
          customRender: (text, record) => {
            return (
              <span style="color:#348EE4;cursor:pointer" onClick={() => this.handleDetail(record)}>
                {text}
              </span>
            )
          }
        },
        {
          title: '项目名称',
          dataIndex: 'name',
          customRender: text => {
            return text ? (
              <Ellipsis length={10} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          title: '项目类型',
          dataIndex: 'type',
          customRender: text => {
            const ret = this.selectDictItem(this.dictMap[dictConfig.PROJECT_TYPE], text)
            return (
              <a-tag color={ret.listClass}>
                <Ellipsis length={8} tooltip>
                  {text}
                </Ellipsis>
              </a-tag>
            )
          }
        },
        {
          title: '预估金额(元)',
          align: 'left',
          dataIndex: 'budgetAmount',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '项目状态',
          dataIndex: 'status',
          customRender: (text, record) => {
            return <a-tag color="blue">{text}</a-tag>
          }
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
    getProjectTypeColor(typeName) {
      const ret = this.selectDictItem(this.dictMap[dictConfig.PROJECT_TYPE], typeName)
      if (this.isEmpty(ret) || this.isEmpty(ret.listClass)) {
        return 'blue'
      }
      return ret.listClass
    },
    // 刷新页面
    refresh() {
      this.isShowCardList ? this.$refs.list.refresh() : this.$refs.table.refresh()
    },
    // 重置查询参数
    reset() {
      this.queryParam = { isAsc: 'desc', orderByColumn: 'create_time', queryUint: this.queryUint }
      this.$refs.table.refresh()
    },

    handleDetail(row) {
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
            row
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.ant-card-meta-title {
  margin-top: 10px !important;
}
.cardStyle {
  box-shadow: rgba(0, 0, 0, 0.24) 2px 2px 4px;
}
// .cardProjectType {
//   position: absolute;
//   top: 0;
//   left: 0;
// }
.context {
  margin-bottom: 10px;
}
.footerButton {
  position: absolute;
  box-sizing: border-box;
  padding: 5px;
  padding: 0 10px;
  width: 100%;
  bottom: 0;
  left: 0;
  background-color: #eff5ff;
  display: flex;
  justify-content: space-between;
}
.search {
  display: flex;
}
.inputquery {
  margin-right: 20px;
  width: 300px;
}
.queryList {
  display: flex;
  padding: 0;
  margin-right: 30px;
  li {
    text-align: center;
    padding: 4px;
    width: 80px;
    height: 31px;
    border: 1px solid #ccc;
    cursor: pointer;
    &:not(.current):hover {
      color: #13c2c2;
      border: 1px solid #13c2c2;
    }
  }
}
.current {
  color: white;
  background-color: #13c2c2;
  border: 1px solid #13c2c2;
}
.addproject {
  margin-left: auto;
}
</style>
