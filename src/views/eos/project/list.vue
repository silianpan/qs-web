<!-- 项目综合查询 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <!-- 查询表单，若无数据，不展示 -->
      <s-search
        placeholder="搜索此列表..."
        clickTips="搜索项目名称、项目编号"
        @onSearch="onSearch"
        @clickquery="clickquery"
        @reset="() => (this.queryParam = { isAsc: 'desc', orderByColumn: 'create_time', tenantAppId: this.$store.getters.tenantAppId, menuId: this.$route.meta.moduleId })"
        :formItems="searchFormItems"
        :formData="queryParam"
      />
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <!-- 项目卡片列表 -->
      <s-list v-show="isShowCardList && !noData" ref="list" :data="loadData" :grid="{ gutter: 24, xl: 4, lg: 4, md: 3, sm: 2, xs: 1 }">
        <template v-slot:default="{ item }">
          <a-card class="ant-pro-pages-list-projects-card cardStyle" hoverable @click="handleDetail(item)">
            <!-- <img slot="cover" @error="handleImgError(item)" :src="item.cover" :alt="item.name" /> -->

            <a-card-meta :title="item.name">
              <template slot="description">
                <div style="margin-top: 20px">
                  <div class="context">
                    <span><a-icon type="appstore" style="margin-right: 5px" />编号：</span><span style="color: orange">{{ item.code }}</span>
                  </div>
                  <div class="context" style="margin-bottom: 40px">
                    <span><a-icon type="pay-circle" style="margin-right: 5px" />金额：</span><span style="color: #348ee4">{{ toThousandFilter(item.budgetAmount) }}元</span>
                  </div>
                </div>
              </template>
            </a-card-meta>
            <div class="footerButton">
              <a-button type="link">
                {{ item.status }}
              </a-button>
              <div :style="{ color: getProjectTypeColor(item.type) }">{{ item.type }}</div>
              <!-- <span :style="{ color: spcolor }">
                {{ item.type }}
                <a-tag :color="getProjectTypeColor(item.type)">{{ item.type }}</a-tag>
              </span> -->
            </div>
            <!-- <div class="cardItemContent">
              <span>{{ item.updatedAt }}</span>
              <div class="avatarList">
                <avatar-list size="small" :max-length="2">
                  <avatar-list-item v-for="(member, i) in item.members" :key="`${item.id}-avatar-${i}`" :src="member.avatar" :tips="member.name" />
                </avatar-list>
              </div>
            </div> -->
          </a-card>
        </template>
      </s-list>
      <!-- 数据表格 -->
      <s-table v-show="!isShowCardList && !noData" :customRow="rowClick" :expandIcon="parentExpandIcon" ref="table" size="default" rowKey="id" @expand="(_, record) => getExpandData(record)" :columns="columns" :data="loadData">
        <template slot="expandedRowRender" slot-scope="record">
          <a-table class="second-level-table" rowKey="id" :customRow="rowClick" :expandIcon="expandIcon" :columns="innerColumns" :data-source="record.innerData" :pagination="false"> </a-table>
        </template>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import storage from 'store'
import dictConfig from '/src/views/eos/config/dict.config.js'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import { listProject, getChildProjectById } from '/src/api/eos/project/project.js'
import { listMerchant } from '/src/api/eos/merchant/merchant.js'
import { SSearch, STable, SList, Ellipsis } from '/src/components/index.js'
import ProjectDetailAll from './detailAll.vue'

export default {
  name: 'ProjectList',
  components: {
    STable,
    SList,
    SSearch
  },
  data() {
    return {
      rowClick: record => ({
        on: {
          click: () => {
            this.handleDetail(record)
          }
        },
        style: {
          cursor: 'pointer'
        }
      }),
      /* 是否有数据 */
      noData: false,
      spcolor: '',
      dictConfig,
      merchantList: [],
      // 是否展示卡片列表
      isShowCardList: true,
      dictKeys: [dictConfig.PROJECT_TYPE, dictConfig.PROJECT_STATUS, dictConfig.PROJECT_REGION],
      dictMap: {},
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: 'create_time',
        tenantAppId: this.$store.getters.tenantAppId,
        menuId: this.$route.meta.moduleId
      },
      /* 当前查询的按钮 */
      current: '',
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listProject(Object.assign({}, param, this.queryParam)).then(res => {
          this.noData = res.total === 0
          res.rows.forEach(item => {
            delete item.children
          })
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
          prop: 'projectCode',
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
          options: item => this.dictMap[dictConfig.PROJECT_TYPE]
        },
        {
          type: 'input',
          prop: 'ownerUnit',
          label: '甲方'
          // valueAlias: 'name',
          // labelAlias: 'name',
          // options: item => this.merchantList
        },
        {
          type: 'input',
          prop: 'consUnit',
          label: '建设单位'
        }
      ],
      columns: [
        // {
        //   title: '项目编号',
        //   align: 'left',
        //   dataIndex: 'code'
        // },
        {
          title: '项目名称',
          dataIndex: 'name',
          align: 'left',
          customRender: text => {
            return text ? (
              <Ellipsis length={64} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        // {
        //   title: '项目编号',
        //   align: 'center',
        //   dataIndex: 'code'
        // },
        // {
        //   title: '当前任务',
        //   align: 'left',
        //   dataIndex: 'sealWorkflow.taskName'
        // },
        // {
        //   title: '所属商机',
        //   dataIndex: 'businessId',
        //   customRender: (text, record) => {
        //     return (
        //       <span>
        //         <Ellipsis length={8} tooltip>
        //           {text}
        //         </Ellipsis>
        //       </span>
        //     )
        //   }
        // },
        {
          title: '项目类型',
          dataIndex: 'type',
          align: 'left',
          customRender: (text, record) => {
            return (
              <Ellipsis length={20} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '所属部门',
          dataIndex: 'record.sysDept.deptName',
          align: 'left',
          customRender: (text, record) => {
            return (
              <Ellipsis length={20} tooltip>
                {record.sysDept.deptName}
              </Ellipsis>
            )
          }
        },
        {
          title: '甲方',
          dataIndex: 'ownerUnit',
          align: 'left',
          customRender: (text, record) => {
            return (
              <Ellipsis length={16} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '项目状态',
          dataIndex: 'status',
          align: 'left',
          customRender: (text, record) => {
            return (
              <Ellipsis length={7} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        {
          title: '立项人',
          dataIndex: 'sysUser.nickName',
          align: 'left'
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          align: 'left',
          customRender: (text, record) => {
            return <AuditStatusTag clickable state={text} instanceId={record.sealWorkflow.instanceId} />
          }
        }
      ],
      innerColumns: [
        { title: '项目名称', align: 'left', dataIndex: 'name', key: 'name' },
        {
          title: '项目编号',
          align: 'center',
          dataIndex: 'code',
          key: 'code'
        },
        { title: '项目类型', align: 'center', dataIndex: 'type', key: 'type' },
        // { title: '立项人', dataIndex: 'sysUser.nickName', key: 'sysUser.nickName' },
        { title: '所属部门', align: 'center', dataIndex: 'sysDept.deptName', key: 'sysDept.deptName' }
        // {
        //   title: '操作',
        //   dataIndex: 'operation',
        //   key: 'operation',
        //   scopedSlots: { customRender: 'operation' }
        // }
      ]
    }
  },
  created() {
    // 查询用户习惯
    this.isShowCardList = storage.get('isShowCardList')
    // 查询字典
    this.dictKeys.forEach(key => {
      this.getDicts(key).then(res => {
        this.$set(this.dictMap, key, res.data)
      })
    })
    listMerchant().then(res => {
      this.merchantList = res.rows
    })
  },
  methods: {
    // 自定义展开图标
    expandIcon() {
      return ''
    },
    parentExpandIcon(props) {
      const { record, expanded, onExpand } = props
      if (record.subProjectCount !== 0) {
        if (expanded) {
          return <a-icon type="minus-square" onClick={e => onExpand(record, e)} />
        } else {
          return <a-icon type="plus-square" onClick={e => onExpand(record, e)} />
        }
      }
      return ''
    },
    /* 过滤金额 */
    // _toThousandFilter(num) {
    //   return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
    // },
    handleChangeCardClick() {
      this.isShowCardList = !this.isShowCardList
      // 保存用户习惯
      storage.set('isShowCardList', this.isShowCardList)
    },
    getProjectTypeColor(typeName) {
      const ret = this.selectDictItem(this.dictMap[dictConfig.PROJECT_TYPE], typeName)
      if (this.isEmpty(ret) || this.isEmpty(ret.listClass)) {
        return 'blue'
      }
      return ret.listClass
    },
    // 刷新页面
    refresh() {
      this.isShowCardList ? this.$refs.list.refresh(true) : this.$refs.table.refresh(true)
    },
    // 重置查询参数
    reset() {
      this.queryParam = { isAsc: 'desc', orderByColumn: 'create_time' }
    },
    handleDetail(row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '项目详情',
          width: '85%',
          maskClosable: true
        },
        content: {
          template: ProjectDetailAll,
          props: {
            row
          }
        }
      })
    },
    /* 查询按钮 */
    clickquery(param) {
      this.queryParam = { ...this.queryParam, orderByColumn: 'create_time' }
      this.refresh()
    },
    /* 查询按钮 */
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    },
    // 图片加载失败处理
    // handleImgError(item) {
    //   item.cover = textToImg(item.name)
    // }
    getExpandData(recordParent) {
      getChildProjectById({ projectId: recordParent.id }).then(res => {
        this.$set(recordParent, 'innerData', res.data)
      })
    }
  }
}
</script>
<style lang="less" scoped>
::v-deep .ant-card-meta-title {
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
  align-items: center;
}
.search {
  display: flex;
}
.inputquery {
  margin-right: 20px;
  width: 500px;
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
tr.ant-table-expanded-row td > .ant-table-wrapper {
  margin: 0;
}
</style>
