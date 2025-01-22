<template>
  <div class="role-content">
    <div class="role-content-head">
      <div class="head-name">{{ roleTitel }}</div>
      <div class="role-edit-btn">
        <a-popover v-userPerms="{ bindingPerms: 'roleManage' }" placement="bottom" v-model="editNameVisible" trigger="click">
          <template slot="content">
            <a-input placeholder="输入名称" v-model="roleName" />
            <div class="role-ele-confirmBtn">
              <a-button class="abtn" @click="editNameConfirm(0)"> 取消 </a-button>
              <a-button class="abtn" type="primary" @click="editNameConfirm(1)"> 确认 </a-button>
            </div>
          </template>
          <a-button type="link"> 修改名称 </a-button>
        </a-popover>
        <a-divider type="vertical" />
        <a-popover v-userPerms="{ bindingPerms: 'roleManage' }" placement="bottom" title="调整分组" v-model="adjustVisible" trigger="click">
          <template slot="content">
            <div class="roleMenu">
              <h3 class="msg">请选择目标分组</h3>
              <ul class="menu-Wallperpar">
                <li :class="current === index ? 'active' : ''" class="menuItem" v-for="(item, index) in roleGroupTree" :key="index" @click="handlerCurrent(item, index)">
                  <span class="folderIcon">
                    <a-icon type="folder" theme="filled" />
                  </span>
                  <span class="menuName">{{ item.groupName }}</span>
                  <span class="circleIcon">
                    <a-icon type="check-circle" theme="filled" />
                  </span>
                </li>
              </ul>
            </div>
            <div class="role-ele-confirmBtn">
              <a-button class="abtn" @click="adjustConfirm(0)"> 取消 </a-button>
              <a-button class="abtn" type="primary" @click="adjustConfirm(1)"> 确认 </a-button>
            </div>
          </template>
          <a-button type="link" @click="adjustCallback"> 调整分组 </a-button>
        </a-popover>
      </div>
    </div>
    <div class="role-btn-pane">
      <div class="btn-group">
        <a-button v-userPerms="{ bindingPerms: 'roleManage' }" @click="addRangebtn">添加成员</a-button>
        <a-button v-userPerms="{ bindingPerms: 'roleManage' }" @click="batchDelete">批量删除</a-button>
      </div>
      <div class="search-input">
        <a-input-search size="small" placeholder="搜索成员" style="width: 200px" allow-clear @search="onSearch" />
      </div>
    </div>
    <div class="role-table">
      <!-- 数据表格 -->
      <s-table ref="table" size="default" rowKey="userId" :columns="columns" :data="loadData" :row-selection="rowSelection">
        <span slot="action" slot-scope="text, record, index">
          <a-button v-userPerms="{ bindingPerms: 'roleManage' }" type="link" @click="deleteMember(text, record, index)"> 删除 </a-button>
        </span>
      </s-table>
    </div>
    <!-- 添加成员弹窗 -->
    <a-modal destroyOnClose title="成员列表" width="600px" :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <MemberSelect @checkedList="checkedList" />
    </a-modal>
  </div>
</template>

<script lang="jsx">
import { STable } from '/src/components/index.js'
import MemberSelect from '../memberSelect/index.vue'
import { getRoleMemberList, addRoleinMember, deleteRoleinMember, updateRole, getRoleListClass } from '/src/api/enterprise/index.js'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    roleMenuId: {
      type: [String, Number],
      default: -1
    }
  },
  components: { STable, MemberSelect },
  data() {
    return {
      /* 修改名称 */
      editNameVisible: false,
      /* 调整分组 */
      adjustVisible: false,
      columns: [
        {
          title: '姓名',
          dataIndex: 'nickName',
          ellipsis: true
        },
        {
          title: '部门',
          dataIndex: 'dept',
          ellipsis: true,
          customRender: (text, record) => {
            if (record.dept.deptName) {
              return record.dept.deptName
            } else {
              return ''
            }
          }
        },
        {
          title: '',
          width: 100,
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      /* 表格查询参数 */
      UserListParams: {
        roleId: ''
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        this.UserListParams.roleId = this.roleId
        this.UserListParams = Object.assign(this.UserListParams, param)
        return this.changeTableData(this.UserListParams)
      },
      selectedRowKeys: [],
      selectedRows: [],
      visible: false,
      /* 选中的人员 */
      intoCheckedData: [],
      /* 修改名称val */
      roleName: '',
      // 角色id
      roleId: -1,
      /* 角色组 */
      roleGroupTree: [],
      /** 角色titel */
      roleTitel: '',
      current: -1,
      groupId: null
    }
  },
  methods: {
    /* 修改名称btn */
    editNameConfirm(v) {
      if (v === 1) {
        updateRole({ roleId: this.roleId, roleName: this.roleName }).then(res => {
          if (res.code === 200) {
            this.editNameVisible = false
            this.$emit('modifySuccess')
            return this.$message.success('修改成功')
          }
        })
      } else {
        this.editNameVisible = false
      }
    },
    /* 调整部门btn */
    adjustConfirm(v) {
      if (v === 1) {
        updateRole({ groupId: this.groupId, roleId: this.roleId }).then(res => {
          if (res.code === 200) {
            this.adjustVisible = false
            this.current = -1
            this.$emit('modifySuccess')
            return this.$message.success('修改成功')
          }
        })
      } else {
        this.adjustVisible = false
      }
    },
    /* 调整分组回调 */
    adjustCallback() {
      /* 查询角色组 */
      getRoleListClass().then(res => {
        this.roleGroupTree = res.data
      })
    },
    /* 搜索 */
    onSearch(val) {
      this.$refs.table.refresh()
    },
    /* 表格数据 */
    changeTableData(param) {
      return getRoleMemberList(param).then(res => {
        return {
          data: res.rows,
          totalCount: res.total,
          pageNum: param.pageNum,
          pageSize: param.pageSize
        }
      })
    },
    /* 表格多选 */
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    /* 添加成员 */
    addRangebtn() {
      if (this.isEmpty(this.UserListParams.roleId)) {
        return this.$message.warning('选择角色在添加成员')
      } else {
        this.visible = true
      }
    },
    /* 添加成员提交 */
    handleOk() {
      addRoleinMember({ roleId: this.roleId, userIds: this.intoCheckedData }).then(res => {
        if (res.code === 200) {
          this.visible = false
          this.$message.success('添加成功')
          this.$refs.table.refresh()
        }
      })
    },
    /* 取消 */
    handleCancel() {
      this.visible = false
    },
    /* 单个删除人员 */
    deleteMember(text, record, index) {
      const id = [record.userId]
      this.$antdconfirm({
        title: '您是否要移除所选成员？',
        content: h => <div>移除成员会同时移除所选成员的当前角色身份，但不会在通讯录中删除所选成员</div>,
        onOk: () => {
          deleteRoleinMember({ roleId: this.roleMenuId, userIds: id }).then(res => {
            if (res.code === 200) {
              this.$refs.table.refresh()
              this.$message.success('删除成功')
            }
          })
        }
      })
    },
    /* 批量删除人员 */
    batchDelete() {
      this.$antdconfirm({
        title: '您是否要移除所选成员？',
        content: h => <div>移除成员会同时移除所选成员的当前角色身份，但不会在通讯录中删除所选成员</div>,
        onOk: () => {
          deleteRoleinMember({ roleId: this.roleId, userIds: this.selectedRowKeys }).then(res => {
            if (res.code === 200) {
              this.$refs.table.refresh()
              this.$message.success('删除成功')
            }
          })
        }
      })
    },
    /* 人员组件选中的人员回调 */
    checkedList(data) {
      this.intoCheckedData = data
    },
    /* 处理当前选中的分组 */
    handlerCurrent(item, index) {
      this.groupId = item.groupId
      this.current = index
    }
  },
  computed: {
    rowSelection() {
      return {
        onChange: this.onSelectChange
      }
    }
  },
  mounted() {},
  created() {
    this.roleTitel = this.title
    this.roleId = this.roleMenuId ? this.roleMenuId : -1
  },
  watch: {
    roleMenuId(data) {
      this.roleId = data
      this.$refs.table.refresh()
    },
    title(val) {
      this.roleName = val
      this.roleTitel = val
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
