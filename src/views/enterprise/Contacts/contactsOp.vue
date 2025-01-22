/* 通讯录 */
<template>
  <div>
    <!-- 在组织架构 角色 管理员都没有的时候弹窗提示没有权限 -->
    <a-modal :visible="optionList.length === 0" :closable="false">
      <template slot="title">
        <a-icon type="smile" theme="twoTone" />
        温馨提醒
      </template>
      <template slot="footer">
        <a-button type="primary" @click="goIndex"> 返回首页 </a-button>
      </template>
      <p style="font-size: 25px; margin: 0 auto; text-align: center">您没有相关权限,请联系管理员授权</p>
    </a-modal>
    <div class="contacts-internal">
      <div class="layout-menu">
        <div class="menu-header">
          <!-- <a-radio-group button-style="solid" v-model="gvalue">
              <a-radio-button value="组织架构"> 组织架构 </a-radio-button>
              <a-radio-button value="角色"> 角色 </a-radio-button>
              <a-radio-button value="管理员"> 管理员 </a-radio-button>
            </a-radio-group> -->
          <a-radio-group button-style="solid" v-model="gvalue">
            <a-radio-button v-for="(item, index) in optionList" :key="index" :value="item">{{ item }}</a-radio-button>
          </a-radio-group>
        </div>
        <div class="menu-content" v-if="gvalue === '组织架构'">
          <div class="menu-type">成员</div>
          <div class="member-all">
            <a-menu class="member-menu" mode="inline" :selectedKeys="selectedKeys" @click="handleMemberMenu">
              <a-menu-item key="全部成员">
                <a-icon type="user" />
                全部成员
              </a-menu-item>
              <a-menu-item key="离职成员">
                <a-icon type="user" />
                离职成员
              </a-menu-item>
            </a-menu>
          </div>
          <div class="menu-type">部门</div>
          <div class="department-tree">
            <!-- <a-tree ref="treeRef" :tree-data="treeData" :selectedKeys="selectedTreeKeys" :replaceFields="replaceFields" @select="treeNodeSelect"> </a-tree> -->
            <a-tree ref="treeRef" :selectedKeys="selectedTreeKeys" :tree-data="treeData" :replaceFields="replaceFields" @dragenter="onDragEnter" @drop="onDrop" @select="treeNodeSelect"> </a-tree>
          </div>
          <div class="menu-type">岗位</div>
          <div class="department-tree">
            <a-tree ref="treePostRef" :selectedKeys="selectedPostTreeKeys" :tree-data="treePostData" :replaceFields="replacePostFields" @select="treeNodePostSelect"> </a-tree>
          </div>
        </div>
        <div class="menu-content" v-if="gvalue === '角色'">
          <div v-userPerms="{ bindingPerms: 'roleManage' }" class="menu-type">
            创建的角色
            <a-popover placement="bottom" v-model="popoverVisible" trigger="click">
              <template slot="content">
                <div class="operation">
                  <div class="operation-item" @click="createRoleGroup">创建角色组</div>
                  <div class="operation-item" @click="createRole">创建角色</div>
                </div>
              </template>
              <a-icon type="plus" />
            </a-popover>
            <!-- 创建角色组弹窗 -->
            <a-modal width="450px" :visible="crg_Visible" @ok="crg_handleOk" @cancel="crg_handleCancel">
              <p>角色组名称</p>
              <a-input placeholder="输入角色名称" allowClear v-model="roleGroupName" />
            </a-modal>
            <!-- 创建角色弹窗 -->
            <a-modal width="450px" :visible="cr_Visible" @ok="cr_handleOk" @cancel="cr_handleCancel">
              <p>角色名称</p>
              <a-input placeholder="输入角色组名称" allowClear v-model="roleName" />
              <p>目标分组</p>
              <a-select placeholder="选择角色组" allowClear style="width: 100%" @change="handleChange">
                <a-select-option v-for="item in RoleGroupMenu" :value="item.id" :key="item.id"> {{ item.value }} </a-select-option>
              </a-select>
            </a-modal>
          </div>
          <div class="roleMenu" v-if="RoleMenuTree.length > 0">
            <a-directory-tree :defaultExpandedKeys="selectedKeysRole" @select="onSelectRole" :selectedKeys="selectedKeysRole">
              <a-tree-node :title="item.groupName" :selectable="false" v-for="item in RoleMenuTree" :key="item.groupId">
                <a-tree-node :title="ritem.roleName" :key="ritem.roleId" is-leaf v-for="ritem in item.roles">
                  <span slot="icon" v-if="ritem">
                    <div class="role-line">
                      <!-- <span style="margin-right: 10px">{{ ritem.roleName }}</span> -->
                      <a-icon v-userPerms="{ bindingPerms: 'roleManage' }" type="delete" @click="deleteRole(ritem.roleId, ritem.roleName)" />
                    </div>
                  </span>
                </a-tree-node>
                <span slot="icon">
                  <div class="dept-line">
                    <!-- <span style="margin-right: 10px">{{ item.groupName }}</span> -->
                    <a-icon v-userPerms="{ bindingPerms: 'roleManage' }" type="delete" @click="deleteRoleGroup(item.groupId, item.groupName)" />
                  </div>
                </span>
              </a-tree-node>
            </a-directory-tree>
          </div>
        </div>
        <div class="menu-content" v-if="gvalue === '管理员'">
          <div class="menu-type">系统管理组</div>
          <div class="member-all">
            <a-menu class="member-menu" mode="inline" :selectedKeys="selectedKeys_AdminMenu" @click="handleAdminMenu">
              <a-menu-item key="系统管理员" title="系统管理员">
                <a-icon type="user" />
                系统管理员
              </a-menu-item>
            </a-menu>
          </div>
          <div class="menu-type">
            普通管理组
            <!-- 添加管理组 -->
            <a-icon type="plus" @click="addAdminGroup" />
            <!-- 添加管理组弹窗 -->
            <a-modal width="450px" :visible="admin_Visible" @ok="admin_handleOk" @cancel="admin_handleCancel">
              <p>添加管理组</p>
              <a-input placeholder="输入管理组名称" allowClear v-model="adminGroupName" />
            </a-modal>
          </div>
          <div class="member-all">
            <a-menu class="member-menu" mode="inline" :selectedKeys="selectedKeys_AdminMenu" @click="handleAdminMenu">
              <a-menu-item :key="item.groupId" v-for="item in adminGroupMenu" :title="item.groupName">
                <div class="adminMenuStyle">
                  <div class="left">
                    <a-icon type="user" />
                    {{ item.groupName }}
                  </div>
                  <div class="right">
                    <a-dropdown :trigger="['click']">
                      <a-icon type="more" style="font-size: 18px" @click="e => e.preventDefault()" />
                      <a-menu slot="overlay">
                        <a-menu-item>
                          <a-button type="link" @click="hanlderEditGroupName(item)"> 修改名称 </a-button>
                        </a-menu-item>
                        <a-menu-item>
                          <a-button type="link" style="color: red" @click="deleteGroupItem(item.groupId)"> 删除 </a-button>
                        </a-menu-item>
                      </a-menu>
                    </a-dropdown>
                  </div>
                </div>
              </a-menu-item>
            </a-menu>
            <a-modal title="修改管理组名称" :visible="editGroupNameVisible" @ok="editGroupNameHandleOk" @cancel="hanlderCancel">
              <a-input placeholder="Basic usage" v-model="newGroupName" />
            </a-modal>
          </div>
        </div>
      </div>
      <!-- 成员 -->
      <div class="layout-content" v-if="gvalue === '组织架构'">
        <MemberElement v-if="selectedKeys.includes('全部成员') || selectedKeys.includes('离职成员') || deptId" :title="mTitle" :deptId="deptId" @clearDeptId="clearDeptId" :treeNodeData="treeNodeData" @saveSuccess="saveSuccess" />
        <!-- 岗位 -->
        <PostElement v-if="localPostId" :title="mTitle" :postId="localPostId" @saveSuccess="saveSuccess" />
      </div>
      <!-- 角色 -->
      <div class="layout-content" v-if="gvalue === '角色'">
        <RoleElement :title="rtitle" :roleMenuId="roleMenuId" @modifySuccess="modifySuccess" />
      </div>
      <!-- 管理员 -->
      <div class="layout-content" v-if="gvalue === '管理员'">
        <AdminElement :title="atitle" :groupId="agroupId" />
      </div>
    </div>
  </div>
</template>

<script>
import MemberElement from '../components/memberElement/index.vue'
import PostElement from '../components/postElement/index.vue'
import RoleElement from '../components/roleElement/index.vue'
import AdminElement from '../components/adminElement/index.vue'
import { getTreeMenu, deptsort, getRoleListClass, insertRole, updateRoleGroup, queryAdminGroup, addAdminGroup, adminGroupDelete, editGroupName, getRoleByAdmin } from '/src/api/enterprise/index.js'
import { delSaasRole, delRoleGroup } from '/src/api/system/role.js'
import { listPostAll } from '/src/api/system/post.js'

export default {
  name: 'ContactsOp',
  components: { MemberElement, PostElement, RoleElement, AdminElement },
  data() {
    return {
      // 岗位
      /* 岗位选中节点 */
      selectedPostTreeKeys: [],
      /* 岗位 */
      treePostData: [],
      /* 岗位 tree 字段 */
      replacePostFields: { title: 'postName', key: 'postId' },
      selectedPostKeys: ['全部成员'],
      /* 岗位ID */
      localPostId: null,
      /* 岗位树节点数据 */
      treeNodePostData: {},
      gvalue: '',
      optionList: ['组织架构', '角色', '管理员'],
      memberTitle: '',
      /* 部门 */
      treeData: [],
      /* tree 字段 */
      replaceFields: { children: 'children', title: 'label', key: 'id' },
      mTitle: '',
      /* 部门ID */
      deptId: null,
      selectedKeys: ['全部成员'],
      /* 部门选中节点 */
      selectedTreeKeys: [],
      /* 树节点数据 */
      treeNodeData: {},
      /* 创建角色组弹窗 */
      crg_Visible: false,
      /* 创建角色弹窗 */
      cr_Visible: false,
      /* 气泡弹窗 */
      popoverVisible: false,
      /* 角色组树菜单 */
      RoleMenuTree: [],
      /* 角色树选中 */
      selectedKeysRole: [],
      /* 新建角色组名称 */
      roleGroupName: null,
      /* 新建角色 */
      roleName: null,
      /* 角色组菜单 */
      RoleGroupMenu: [],
      rtitle: '',
      /* 选中角色ID */
      roleMenuId: null,
      /* 选中目标分组 */
      selectRoleGroup: null,
      /* 新增管理组名称 */
      adminGroupName: null,
      /* 新增普通管理组弹窗 */
      admin_Visible: false,
      /* 管理组 */
      selectedKeys_AdminMenu: ['系统管理员'],
      atitle: '系统管理员',
      agroupId: null,
      /* 查询管理组菜单 */
      adminGroupMenu: [],
      editAdminGroup: false,
      editGroupNameVisible: false,
      editGroupName_Id: null,
      newGroupName: ''
    }
  },
  methods: {
    handleOrgTab() {
      if (!this.isEmpty(this.localPostId)) {
        this.clearMemberSelectedKeys()
        this.clearDeptSelectedKeys()
      }
      if (!this.isEmpty(this.deptId)) {
        this.clearMemberSelectedKeys()
        this.clearPostSelectedKeys()
      }
    },
    // 返回首页
    goIndex() {
      // this.$router.push('/saas')
      this.$router.push('/index')
    },
    // 根据权限去掉相应模块 => 更新optionList里面的内容
    toshow() {
      const perms = this.$store.getters.userPermission
      // 先判断有没有管理员这个模块
      if (!perms.is_admin && !perms.is_owner) {
        this.optionList.splice(
          this.optionList.findIndex(item => item === '管理员'),
          1
        )
        if (!perms.has_team_read_perms) {
          this.optionList.splice(
            this.optionList.findIndex(item => item === '组织架构'),
            1
          )
          if (!perms.has_role_read_perms) {
            this.optionList.splice(
              this.optionList.findIndex(item => item === '角色'),
              1
            )
          }
        } else if (!perms.has_role_read_perms) {
          this.optionList.splice(
            this.optionList.findIndex(item => item === '角色'),
            1
          )
          if (!perms.has_team_read_perms) {
            this.optionList.splice(
              this.optionList.findIndex(item => item === '组织架构'),
              1
            )
          }
        }
      } else {
        if (!perms.has_team_read_perms) {
          this.optionList.splice(
            this.optionList.findIndex(item => item === '组织架构'),
            1
          )
          if (!perms.has_role_read_perms) {
            this.optionList.splice(
              this.optionList.findIndex(item => item === '角色'),
              1
            )
          }
        } else if (!perms.has_role_read_perms) {
          this.optionList.splice(
            this.optionList.findIndex(item => item === '角色'),
            1
          )
          if (!perms.has_team_read_perms) {
            this.optionList.splice(
              this.optionList.findIndex(item => item === '组织架构'),
              1
            )
          }
        }
      }
    },
    // 全部成员
    handleMemberMenu({ key }) {
      this.mTitle = key
      this.selectedKeys[0] = key
      this.selectedTreeKeys = []
      this.treeNodeData = {}
    },
    /* 点击树节点 */
    treeNodeSelect(expandedKeys, { selected, node }) {
      if (selected) {
        this.selectedTreeKeys = expandedKeys
        this.mTitle = node.title
        // 全部成员、离职成员
        this.clearMemberSelectedKeys()
        // 岗位树
        this.clearPostSelectedKeys()
        this.deptId = expandedKeys[0]
        /* 树节点 */
        this.treeNodeData = node
      }
    },
    /* 点击岗位树节点 */
    treeNodePostSelect(expandedKeys, { selected, node }) {
      if (selected) {
        this.selectedPostTreeKeys = expandedKeys
        this.mTitle = node.title
        // 全部成员、离职成员
        this.clearMemberSelectedKeys()
        // 部门树
        this.clearDeptSelectedKeys()
        this.localPostId = expandedKeys[0]
        /* 岗位树节点 */
        this.treeNodePostData = node
      }
    },
    // 清理全部成员、离职成员
    clearMemberSelectedKeys() {
      // 全部成员、离职成员
      this.selectedKeys = ['']
    },
    // 清理部门树选择
    clearDeptSelectedKeys() {
      // 部门树
      this.selectedTreeKeys = ['']
      // 清空部门树id
      this.deptId = null
    },
    // 清理岗位树选择
    clearPostSelectedKeys() {
      // 岗位树
      this.selectedPostTreeKeys = ['']
      // 清空岗位树id
      this.localPostId = null
    },
    /* 清除部门ID */
    clearDeptId() {
      this.deptId = null
    },
    onDragEnter(info) {
      // expandedKeys 需要受控时设置
      // this.expandedKeys = info.expandedKeys
    },
    onDrop(info) {
      const dropKey = info.node.dataRef.id
      const dragKey = info.dragNode.dataRef.id
      const dropPos = info.node.pos.split('-')
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.id === key) {
            return callback(item, index, arr)
          }
          if (item.children) {
            return loop(item.children, key, callback)
          }
        })
      }
      const data = [...this.treeData]
      // 拖拽
      if (info.dropPosition === -1) {
        deptsort({ target: dragKey })
      } else {
        deptsort({ before: dropKey, target: dragKey })
      }
      // Find dragObject
      let dragObj
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1)
        dragObj = item
      })
      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, item => {
          item.children = item.children || []
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.push(dragObj)
        })
      } else if (
        (info.node.children || []).length > 0 && // Has children
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, item => {
          item.children = item.children || []
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.unshift(dragObj)
        })
      } else {
        let ar
        let i
        loop(data, dropKey, (item, index, arr) => {
          ar = arr
          i = index
        })
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj)
        } else {
          ar.splice(i + 1, 0, dragObj)
        }
      }
      this.treeData = data
    },
    /* 请求部门菜单 */
    initTreeMenuList(refresh = false) {
      /* 部门 */
      getTreeMenu().then(res => {
        this.treeData = res.data
      })
      /* 岗位 */
      listPostAll().then(res => {
        this.treePostData = res.data
      })
      if (!refresh && this.gvalue === '组织架构') {
        this.handleMemberMenu({ key: '全部成员' })
      }
    },
    /* 添加子部门成功回调 */
    saveSuccess() {
      this.initTreeMenuList(true)
    },
    /* 新增角色组 */
    createRoleGroup() {
      this.crg_Visible = true
      this.popoverVisible = false
      this.roleGroupName = null
    },
    /* 新增角色 */
    createRole() {
      this.cr_Visible = true
      this.popoverVisible = false
      this.roleName = null
      /* 查询角色组 */
      // getRoleListClass().then(res => {
      //   this.RoleGroupMenu = res.data.map(({ groupId, groupName }) => ({ id: groupId, value: groupName }))
      // })
      getRoleByAdmin().then(res => {
        this.RoleGroupMenu = res.data.roleGroups.map(({ groupId, groupName }) => ({ id: groupId, value: groupName }))
      })
    },
    /* 角色树菜单选中回调 */
    onSelectRole(keys, { selected, node }) {
      this.selectedKeysRole = keys
      this.rtitle = node.title
      this.roleMenuId = keys[0]
    },
    /* 删除角色 */
    deleteRole(id, name) {
      this.$antdconfirm({
        title: '删除确认',
        content: '是否删除：' + name,
        onOk: () => {
          if (id === null) {
            return this.$message.warning('请选择角色')
          }
          delSaasRole(id).then(res => {
            if (res.code === 200) {
              this.initRoleList()
              return this.$message.success('删除成功')
            }
          })
        }
      })
    },
    /* 删除角色组 */
    deleteRoleGroup(id, name) {
      this.$antdconfirm({
        title: '删除确认',
        content: '是否删除：' + name,
        onOk: () => {
          if (id === null) {
            return this.$message.warning('请选择角色组')
          }
          delRoleGroup(id).then(res => {
            if (res.code === 200) {
              this.initRoleList()
              return this.$message.success('删除成功')
            }
          })
        }
      })
    },
    /* 查询角色组和角色 */
    initRoleList() {
      // getRoleListClass().then(res => {
      //   this.RoleMenuTree = res.data
      //   this.selectedKeysRole[0] = this.RoleMenuTree[0].roles[0].roleId
      //   this.rtitle = this.RoleMenuTree[0].roles[0].roleName
      //   this.roleMenuId = this.RoleMenuTree[0].roles[0].roleId
      // })
      getRoleByAdmin().then(res => {
        this.RoleMenuTree = res.data.roleGroups
        if (this.RoleMenuTree[0].roles.length > 0) {
          this.selectedKeysRole[0] = this.RoleMenuTree[0].roles[0] ? this.RoleMenuTree[0].roles[0].roleId : null
          this.rtitle = this.RoleMenuTree[0].roles[0] ? this.RoleMenuTree[0].roles[0].roleName : ''
          this.roleMenuId = this.RoleMenuTree[0].roles[0].roleId ? this.RoleMenuTree[0].roles[0].roleId : null
        }
      })
    },
    /* 创建角色组提交 */
    crg_handleOk() {
      if (this.isEmpty(this.roleGroupName)) {
        return this.$message.warning('角色组名称不能为空')
      } else {
        updateRoleGroup({ groupName: this.roleGroupName }).then(res => {
          if (res.code === 200) {
            this.initRoleList()
            this.crg_Visible = false
            return this.$message.success('新增成功')
          }
        })
      }
    },
    /* 关闭 */
    crg_handleCancel() {
      this.crg_Visible = false
    },
    /* 创建角色提交 */
    cr_handleOk() {
      if (!this.isEmpty(this.roleName) && !this.isEmpty(this.selectRoleGroup)) {
        insertRole({ roleName: this.roleName, groupId: this.selectRoleGroup }).then(res => {
          if (res.code === 200) {
            this.initRoleList()
            this.cr_Visible = false
            return this.$message.success('新增成功')
          }
        })
      } else {
        return this.$message.warning('角色和分组不能为空')
      }
    },
    /* 修改角色名称回调 */
    modifySuccess() {
      this.initRoleList()
    },
    /* 目标分组回调 */
    handleChange(value) {
      this.selectRoleGroup = value
    },
    /* 关闭 */
    cr_handleCancel() {
      this.cr_Visible = false
    },
    /* 添加管理组 */
    addAdminGroup() {
      this.admin_Visible = true
    },
    /* 新增管理组提交 */
    admin_handleOk() {
      addAdminGroup({ groupName: this.adminGroupName }).then(res => {
        if (res.code === 200) {
          this.admin_Visible = false
          this.adminGroupName = null
          this.initAadminGroup()
          return this.$message.success('添加成功')
        }
      })
    },
    /* 关闭 */
    admin_handleCancel() {
      this.admin_Visible = false
    },
    /* 管理组菜单选中回调 */
    handleAdminMenu({ item, key, keyPath }) {
      this.selectedKeys_AdminMenu = []
      this.selectedKeys_AdminMenu = keyPath
      this.atitle = item.title
      if (typeof key === 'number' && key) {
        this.agroupId = key
      }
    },
    /* 查询管理组 */
    initAadminGroup() {
      queryAdminGroup().then(res => {
        this.adminGroupMenu = res.data
      })
    },
    /* 修改管理组名称 */
    hanlderEditGroupName({ groupId }) {
      this.editGroupName_Id = groupId
      this.editAdminGroup = false
      this.editGroupNameVisible = true
    },
    /* 删除管理组 */
    deleteGroupItem(groupId) {
      adminGroupDelete(groupId).then(res => {
        if (res.code === 200) {
          this.initAadminGroup()
          return this.$message.success('删除成功')
        }
      })
      this.editAdminGroup = false
    },
    /* 关闭弹窗 */
    hanlderCancel() {
      this.editGroupNameParmas = null
      this.newGroupName = ''
      this.editGroupNameVisible = false
    },
    /* 修改管理组名称确定 */
    editGroupNameHandleOk() {
      editGroupName({ groupName: this.newGroupName, groupId: this.editGroupName_Id }).then(res => {
        if (res.code === 200) {
          this.newGroupName = ''
          this.editGroupNameParmas = null
          this.editGroupNameVisible = false
          this.initAadminGroup()
          return this.$message.success('修改成功')
        }
      })
    }
  },
  created() {
    this.toshow()
    this.gvalue = this.optionList[0]
    this.initTreeMenuList()
  },
  watch: {
    gvalue(data) {
      if (data === '组织架构') {
        this.handleOrgTab()
        this.initTreeMenuList(true)
      }
      if (data === '角色') {
        this.initRoleList()
      }
      if (data === '管理员') {
        /* 默认选中系统管理员 */
        this.selectedKeys_AdminMenu = ['系统管理员']
        this.atitle = '系统管理员'
        this.initAadminGroup()
      }
    }
  },
  beforeDestroy() {
    this.clearMemberSelectedKeys()
    this.clearDeptSelectedKeys()
    this.clearPostSelectedKeys()
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
.role-line,
.dept-line {
  width: 60px;
  display: flex;
  justify-content: space-between;
  i {
    line-height: 27px;
  }
}
</style>
