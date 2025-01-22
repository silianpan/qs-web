<!-- 主体收支 -->
<template>
  <page-header-wrapper :breadcrumb="false">
    <!-- 项目表格 -->
    <a-card :bordered="false">
      <!-- 查询表单 -->
      <div class="table-page-search-wrapper">
        <s-form search layout="inline" @search="refresh" @reset="reset" :formItems="searchFormItems" :formData="queryParam"> </s-form>
        <a-button type="primary" ghost icon="download" @click="exportAll(queryParam)" style="margin-bottom: 20px">导出</a-button>
      </div>

      <!-- 数据表格 -->
      <s-table ref="table" size="default" rowKey="company" :columns="columns" :data="loadData">
        <div class="table-operator">
          <a-button type="dashed" shape="circle" :style="{ float: 'right' }" icon="reload" @click="refresh" />
        </div>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import { subject, subjectExport } from '/src/api/eos/analysis/analyst.js'
import { SForm, STable } from '/src/components/index.js'
import SubjectDetail from './modules/subjectDetail'

export default {
  name: 'Area',
  components: {
    STable,
    SForm
  },
  data() {
    return {
      // 查询参数
      queryParam: {},
      // 加载数据方法
      loadData: param => {
        return subject(this.queryParam).then(res => {
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      searchFormItems: [
        {
          type: 'input',
          prop: 'company',
          label: '主体名称'
        }
      ],
      columns: [
        {
          title: '主体名称',
          dataIndex: 'company',
          customRender: (text, record) => {
            return (
              <span style="color:#1E90FF;cursor:pointer" onClick={() => this.handleDetail(record)}>
                {text}
              </span>
            )
          }
        },
        {
          title: '应收(元)',
          dataIndex: 'shouldIn',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '应付(元)',
          dataIndex: 'shouldOut',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '已收(元)',
          dataIndex: 'realIn',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '已付(元)',
          dataIndex: 'realOut',
          customRender: (text, record) => {
            return this.toThousandFilter(text)
          }
        },
        {
          title: '未收(元)',
          dataIndex: 'notIn',
          customRender: (text, record) => {
            return <span style="color:red">{this.toThousandFilter(text)}</span>
          }
        },
        {
          title: '未付(元)',
          dataIndex: 'notOut',
          customRender: (text, record) => {
            return <span style="color:red">{this.toThousandFilter(text)}</span>
          }
        }
      ]
    }
  },
  methods: {
    // 刷新页面
    refresh() {
      this.$refs.table.refresh(true)
    },
    // 重置查询参数
    reset() {
      this.queryParam = {}
      this.$refs.table.refresh(true)
    },
    /** 详情列表 */
    handleDetail(record) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '应收应付详情',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: SubjectDetail,
          props: {
            company: record.company
          }
        }
      })
    },
    /** 导出 */
    exportAll(params) {
      this.$confirm({
        title: '导出',
        content: `是否导出收支情况 ?`,
        onOk: () => {
          return subjectExport(params).then(res => {
            this.download(res.msg)
          })
        }
      })
    }
  }
}
</script>
