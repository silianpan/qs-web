<!-- 项目立项 -->
<template>
  <page-header-wrapper :breadcrumb="$store.getters.breadcrumb">
    <a-card :bordered="false">
      <div class="table-header-btns">
        <a-button ghost type="primary" @click="createProject">项目立项</a-button>
        <!-- 查询表单，若无数据，不展示 -->
        <s-search placeholder="搜索此列表..." clickTips="搜索项目名称/编号、甲方、承建单位" @onSearch="onSearch" />
      </div>
      <!-- 数据表格 -->
      <no-data v-show="noData" />
      <s-table v-show="!noData" :customRow="rowClick" :expandIcon="parentExpandIcon" ref="table" size="default" rowKey="id" @expand="(_, record) => getExpandData(record)" :columns="columns" :data="loadData">
        <span slot="action" slot-scope="text, record">
          <BusCommit :busCommitActions="canSplitBusCommitActions(record)" :handleUpdate="handleUpdate" :handleDelete="handleDelete" :requestMapping="'/project/project'" :busForm="record" @getList="refresh" />
        </span>
        <template v-if="record.subProjectCount !== 0" slot="expandedRowRender" slot-scope="record">
          <a-table class="second-level-table" rowKey="id" :customRow="rowClick" :expandIcon="expandIcon" :columns="innerColumns" :data-source="record.innerData" :pagination="false">
            <span slot="operation" slot-scope="text, sonRecord" class="table-operation">
              <a @click.stop="updateChildProject(sonRecord, record)">修改 </a>
              <a @click.stop="deleteChildProject(sonRecord, record)">删除 </a>
            </span>
          </a-table>
        </template>
      </s-table>
    </a-card>
  </page-header-wrapper>
</template>

<script lang="jsx">
import dictConfig from '/src/views/eos/config/dict.config.js'
import AuditStatusTag from '/src/views/eos/components/AuditStatusTag.jsx'
import { listInProjectPersonal, submitApply, delProject, getChildProjectById } from '/src/api/eos/project/project.js'
import { SSearch, STable, Ellipsis } from '/src/components/index.js'
import ProjectForm from './modules/ProjectForm.vue'
import ProjectDetailAll from './detailAll.vue'
import BusCommit from '/src/components/Activiti/BusCommit.vue'
import splitProject from './splitProject.vue'

export default {
  name: 'Project',
  components: {
    SSearch,
    STable,
    BusCommit
  },
  data() {
    return {
      /* 是否有数据 */
      noData: false,
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
      busCommitActions: [
        {
          label: '项目拆分',
          icon: 'iconfont-xiangmuguanli5',
          action: this.splitProject
        }
      ],
      dictKeys: [dictConfig.PROJECT_TYPE],
      dictMap: {},
      // 查询参数
      queryParam: {
        isAsc: 'desc',
        orderByColumn: ['create_time']
      },
      /* 当前查询的按钮 */
      current: '',
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        return listInProjectPersonal(Object.assign({}, param, this.queryParam)).then(res => {
          this.noData = false
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
      columns: [
        {
          title: '项目名称',
          dataIndex: 'name',
          align: 'left',
          customRender: (text, record) => {
            return (
              <Ellipsis length={64} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        // {
        //   title: '项目编号',
        //   dataIndex: 'code',
        //   align: 'center'
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
          align: 'left'
        },
        {
          title: '所属部门',
          dataIndex: 'record.sysDept.deptName',
          align: 'left',
          customRender: (text, record) => {
            return (
              <Ellipsis length={10} tooltip>
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
              <Ellipsis length={20} tooltip>
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
          title: '审批状态',
          dataIndex: 'state',
          align: 'left',
          customRender: (text, record) => {
            return <AuditStatusTag state={text} instanceId={record.sealWorkflow.instanceId} />
          }
        },
        // {
        //   title: '申请人',
        //   dataIndex: 'sysUser.nickName',
        //   customRender: (text, record) => {
        //     return (
        //       <Ellipsis length={7} tooltip>
        //         {record.sysUser.nickName}
        //       </Ellipsis>
        //     )
        //   }
        // },
        // {
        //   title: '申请时间',
        //   dataIndex: 'createTime',
        //   customRender: (text, record) => {
        //     return (
        //       <Ellipsis length={8} tooltip>
        //         {record.createTime}
        //       </Ellipsis>
        //     )
        //   }
        // },
        {
          title: '操作',
          width: 160,
          align: 'left',
          scopedSlots: { customRender: 'action' }
        }
      ],
      innerColumns: [
        { title: '项目名称', dataIndex: 'name', align: 'left', key: 'name' },
        // {
        //   title: '项目编号',
        //   dataIndex: 'code',
        //   key: 'code',
        //   align: 'center'
        // },
        {
          title: '项目类型',
          dataIndex: 'type',
          align: 'left',
          customRender: (text, record) => {
            return (
              <Ellipsis length={7} tooltip>
                {text}
              </Ellipsis>
            )
          }
        },
        { title: '立项人', dataIndex: 'sysUser.nickName', align: 'left', key: 'sysUser.nickName' },
        { title: '所属部门', dataIndex: 'sysDept.deptName', align: 'left', key: 'sysDept.deptName' },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          align: 'left',
          scopedSlots: { customRender: 'operation' }
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
    // 自定义展开图标
    expandIcon() {
      return ''
    },
    parentExpandIcon(props) {
      const { record, expanded, onExpand } = props
      if (record.subProjectCount !== 0) {
        if (expanded) {
          return <a-icon type="minus-square" ref="minus" onClick={e => onExpand(record, e)} />
        } else {
          return <a-icon type="plus-square" onClick={e => onExpand(record, e)} />
        }
      }
      return ''
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
      this.$refs.table.refresh(true)
    },
    // 重置查询参数
    reset() {
      this.queryParam = { isAsc: 'desc', orderByColumn: 'create_time' }
    },
    // 立项
    createProject() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '立项申请',
          width: '60%',
          maskClosable: true
        },
        content: {
          template: ProjectForm,
          on: {
            ok: () => {
              this.refresh()
            }
          }
        }
      })
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
    // 呈报
    submitApply(id) {
      submitApply(id).then(res => {
        this.$message.success(res.msg, 3)
        this.refresh()
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const updateRow = { ...row }
      if (!this.isEmpty(row.cover) && row.cover.indexOf('base64') !== -1) {
        updateRow.cover = null
      }
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '修改立项',
          width: '50%',
          maskClosable: true
        },
        content: {
          template: ProjectForm,
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
    // 删除项目信息和项目成员
    handleDelete(row) {
      this.$antdconfirm({
        title: '删除项目',
        content: '是否确认删除项目：' + row.name + '?',
        onOk: () => {
          delProject(row.id).then(res => {
            this.$message.success('删除成功')
            this.refresh()
          })
        }
      })
    },
    /* 查询按钮 */
    onSearch(data) {
      this.queryParam = { ...this.queryParam, queryAll: data }
      this.refresh()
    },
    splitProject(record) {
      this.$createAntdModal({
        stopPropagation: true,
        modalProps: {
          title: '项目拆分',
          width: '60%',
          centered: true,
          maskClosable: true
        },
        content: {
          template: splitProject,
          props: {
            record,
            update: false
          },
          on: {
            saveChildProjectSuccess: () => {
              // record是父项目
              this.getExpandData(record)
              this.refresh()
            }
          }
        },
        footer: {
          template: 'div'
        },
        beforeClose: function () {},
        afterClose: function () {},
        onOk() {}
      })
    },
    getExpandData(recordParent) {
      getChildProjectById({ projectId: recordParent.id }).then(res => {
        this.$set(recordParent, 'innerData', res.data)
      })
    },
    updateChildProject(recordSub, recordParent) {
      this.$createAntdModal({
        stopPropagation: true,
        modalProps: {
          title: '子项目修改',
          width: '50%',
          centered: true,
          maskClosable: true
        },
        content: {
          template: splitProject,
          props: {
            record: recordSub,
            update: true
          },
          on: {
            saveChildProjectSuccess: () => {
              this.getExpandData(recordParent)
              this.refresh()
            }
          }
        },
        footer: {
          template: 'div'
        },
        beforeClose: function () {},
        afterClose: function () {},
        onOk() {}
      })
    },
    deleteChildProject(recordSub, recordParent) {
      delProject(recordSub.id).then(res => {
        this.$message.success('删除成功')
        this.getExpandData(recordParent)
        if (recordParent.innerData.length === 1) {
          this.$refs.minus._self.$listeners.click()
          this.refresh()
        }
      })
    },
    canSplitBusCommitActions(record) {
      let resArr = null
      if (record.state !== 0) {
        resArr = this.busCommitActions.filter(item => {
          return item.label !== '项目拆分'
        })
        return resArr
      } else {
        return this.busCommitActions
      }
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
tr.ant-table-expanded-row td > .ant-table-wrapper {
  margin: 0;
}
</style>
