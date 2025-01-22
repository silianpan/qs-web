<!-- 零星用工列表 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <!-- 查询表单 -->
      <div class="table-header-btns">
        <a-button-group>
          <a-button type="dashed" shape="round" @click="isShowCardList = !isShowCardList">
            <icon-font :style="{ fontSize: '18px' }" :type="isShowCardList ? 'iconfont-datuzhanshi' : 'iconfont-01_zhanshifenlei'" />
          </a-button>
          <a-button style="margin-left: 10px" type="primary" ghost @click="handleAdd" v-hasPermi="['project:employee:add']">新增</a-button>

          <!-- <a-button type="primary" ghost @click="handleExport" v-hasPermi="['project:employee:export']">导出</a-button> -->
        </a-button-group>
        <s-search placeholder="搜索此列表..." clickTips="搜索项目名称" @onSearch="onSearch" />
      </div>

      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!isShowCardList" ref="table" :customRow="rowClick" size="default" rowKey="id" :columns="columns" :data="loadData" :rowSelection="rowSelection">
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="action" slot-scope="text, record">
          <BusCommit :handleUpdate="handleUpdate" :handleDelete="handleDelete" :requestMapping="'/project/employee'" :busForm="record" @getList="refresh" />
        </span>
      </s-table>
    </a-card>
    <!-- 卡片式展示表格 -->
    <a-card v-show="isShowCardList">
      <a-row>
        <a-col :md="6" :sm="24">
          <template>
            <div v-infinite-scroll="handleInfiniteOnLoad" class="demo-infinite-container" :infinite-scroll-disabled="busy" :infinite-scroll-distance="10">
              <List :dataSource="cardData">
                <ListItem @click.native="showDetail(item)" style="cursor: pointer" slot="renderItem" slot-scope="item, index" :key="index">
                  <ListItemMeta>
                    <p slot="title" >项目名称: {{ item.sealProject.name }}</p>
                    <span slot="description">
                      <p class="security-list-description">申请人: {{ item.sysUser.nickName }}</p>
                      <p class="security-list-description">申请日期: {{ item.createTime }}</p>
                    </span>
                    <a slot="title" :href="item.href">{{ item.projectName }}</a>
                  </ListItemMeta>
                  <!-- <div>框框</div> -->
                </ListItem>
                <div v-if="loading && !busy" class="demo-loading-container">
                  <a-spin />
                </div>
              </List>
            </div>
          </template>
        </a-col>
        <a-col :md="18" :sm="24" v-if="!this.isEmpty(this.cardDataOne)">
          <employee-detail :row="cardDataOne" ref="employeeDetail" />
        </a-col>
      </a-row>
      <!-- <template v-slot:default="{ item }">
        <a-card class="ant-pro-pages-list-projects-card cardStyle" hoverable @click="handleDetail(item)">
          <a-card-meta :title="item.name">
            <template slot="description">
              <div style="margin-top: 20px">
                <div class="context">
                  <span><a-icon type="appstore" style="margin-right: 5px" />编号：</span><span style="color: orange">{{ item.code }}</span>
                </div>
                <div class="context" style="margin-bottom: 40px">
                  <span><a-icon type="pay-circle" style="margin-right: 5px" />金额：</span><span style="color: blue">{{ toThousandFilter(item.budgetAmount) }}元</span>
                </div>
              </div>
            </template>
          </a-card-meta>
          <div class="footerButton">
            <a-button type="link"> </a-button>

          </div>

        </a-card>
      </template> -->
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import moment from 'moment'
import { listEmployee, delEmployee, exportEmployee } from '/src/api/eos/subcontract/employee.js'
import { STable, SSearch, Ellipsis } from '/src/components/index.js'
import EmployeeForm from './modules/EmployeeForm.vue'
import EmployeeDetail from './modules/EmployeeDetail.vue'
import BusCommit from '/src/components/Activiti/BusCommit.vue'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import infiniteScroll from 'vue-infinite-scroll'
import List from 'ant-design-vue/es/list'
import ListItem from 'ant-design-vue/es/list/Item.js'
const { Meta } = ListItem
import 'ant-design-vue/es/list/style'

export default {
  name: 'Employee',
  components: {
    STable,
    BusCommit,
    SSearch,
    List,
    ListItem,
    ListItemMeta: Meta,
    EmployeeDetail
  },
  directives: { infiniteScroll },
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
      // 是否卡片展示
      isShowCardList: false,
      cardData: [],
      cardDataOne: {},
      loading: false,
      busy: false,

      noData: false,
      dictKeys: [],
      dictMap: {},
      selectedRowKeys: [],
      selectedRows: [],
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listEmployee(Object.assign({}, param, this.queryParam)).then(res => {
          this.noData = res.total === 0
          this.cardData = res.rows
          return {
            data: res.rows,
            totalCount: res.total,
            pageNum: param.pageNum,
            pageSize: param.pageSize
          }
        })
      },
      columns: [
        // {
        //   title: '申请单号',
        //   dataIndex: 'code',
        //   align: 'left'
        // },
        {
          title: '所属项目',
          dataIndex: 'sealProject.name',
          align: 'left',
          customRender: text => {
            return text ? (
              <Ellipsis length={40} tooltip>
                {text}
              </Ellipsis>
            ) : (
              text
            )
          }
        },
        {
          title: '结算总金额(元)',
          dataIndex: 'sum',
          align: 'left'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'left'
        },
        {
          title: '审批状态',
          dataIndex: 'state',
          align: 'left',
          customRender: (text, record) => {
            return <AuditStatusTag state={text} instanceId={record.sealWorkflow.instanceId} />
          }
        },
        {
          title: '申请人',
          dataIndex: 'sysUser.nickName',
          align: 'left'
        },
        {
          title: '申请时间',
          dataIndex: 'createTime',
          align: 'left',
          customRender: text => moment(text).format('MM-DD HH:mm')
        },
        {
          title: '操作',
          align: 'left',
          width: 160,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
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
    // 卡片详情
    showDetail(row) {
      this.cardDataOne = row
      this.$nextTick(() => {
        this.$refs.employeeDetail.$refs.table.refresh()
      })
    },
    // 方法调用
    handleInfiniteOnLoad() {
      const dataLoad = this.cardData
      this.loading = true
      if (dataLoad.length > 10) {
        this.busy = true
        this.loading = false
        return
      }
      listEmployee(this.queryParam).then(res => {
        // 第一次请求默认显示第一个
        if (this.isEmpty(this.cardDataOne) && res.rows.length > 0) {
          this.showDetail(res.rows[0])
        }
        this.cardData = dataLoad.concat(res.rows)
        this.loading = false
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 刷新页面
    refresh() {
      this.$refs.table.refresh(true)
    },
    reset() {
      this.queryParam = {}
    },
    /** 新增按钮操作，新建表单 */
    handleAdd() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '新增零星用工付款',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: EmployeeForm,
          on: {
            ok: () => {
              this.refresh()
            }
          }
        }
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const updateRow = { ...row }
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '修改零星用工付款',
          width: '80%',
          maskClosable: true
        },
        content: {
          template: EmployeeForm,
          props: {
            isUpdate: true,
            updateRow
          },
          on: {
            ok: () => {
              this.refresh()
            }
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id
      this.$antdconfirm({
        title: '删除',
        content: '是否确认删除零星用工付款编号为"' + ids + '"的数据项?',
        onOk: () => {
          return delEmployee(ids).then(() => {
            this.refresh()
            this.$message.success('删除成功', 3)
          })
        }
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParam = this.queryParam
      this.$antdconfirm({
        title: '导出',
        content: '是否确认导出所有零星用工付款数据项?',
        onOk: () => {
          return exportEmployee(queryParam).then(res => {
            this.download(res.msg)
          })
        }
      })
    },
    /** 详情 */
    handleDetail(row) {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '零星用工付款详情',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: EmployeeDetail,
          props: {
            row
          }
        }
      })
    },
    onSearch(data, event) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    }
  }
}
</script>

<style>
.demo-infinite-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px;
  height: 69vh;
}
.demo-loading-container {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
}
</style>
