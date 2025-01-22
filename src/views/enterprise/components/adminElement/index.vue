<template>
  <div>
    <div class="manager-group-name">{{ title }}</div>
    <!-- 系统管理员 -->
    <div class="group-config" v-if="title === '系统管理员'">
      <div class="config-line">
        <div class="line-item left">系统管理员</div>
        <div class="line-item right">
          <div class="item-content">
            <div class="adminEdit">
              <div class="admin-wallperpar">
                <span class="admin-item" v-for="item in ststemAdminList" :key="item.userId">
                  <a-icon type="user" />
                  {{ item.nickName }}
                </span>
              </div>
              <!-- 只有创建者才能有修改 -->
              <a-button v-if="isOwner === '0'" type="link" icon="edit" @click="editSystemAdmin"> 修改 </a-button>
            </div>
          </div>
        </div>
      </div>
      <div class="config-line">
        <div class="line-item left">应用权限</div>
        <div class="line-item right">具备对所有应用的管理权限</div>
      </div>
      <div class="config-line">
        <div class="line-item left">通讯录权限</div>
        <div class="line-item right">具备对所有部门和成员的管理权限</div>
      </div>
    </div>
    <!-- 普通管理员 -->
    <div class="group-config" v-else>
      <a-spin tip="加载中..." :spinning="spinning">
        <div class="config-line">
          <div class="line-item left">管理员</div>
          <div class="line-item right">
            <a-button type="link" icon="plus" @click="addAdminPerson"> 添加管理员 </a-button>
            <div class="item-content">
              <div class="adminEdit">
                <div class="admin-wallperpar">
                  <span class="admin-item" v-for="item in ststemAdminList" :key="item.userId">
                    <a-icon type="user" />
                    {{ item.nickName }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="config-line">
          <div class="line-item left">应用权限</div>
          <div class="line-item right">
            <a-button type="link" icon="plus" @click="editApp"> 选择可以编辑的应用 </a-button>
            <div class="app-wallperpar">
              <span class="app-item" v-for="item in initAppList" :key="item.id"> {{ item.appName }} </span>
            </div>
            <div class="inline-line">
              <span class="inline-left">可添加／删除应用</span>
              <a-switch :checked="checkedSwitch" @change="onChangeSwitch" />
            </div>
          </div>
        </div>
        <div class="config-line">
          <div class="line-item left">通讯录权限</div>
          <div class="line-item right">
            <div class="checkbox-container">
              <div class="checkbox-item">
                <span class="inline-left">内部部门</span>
                <a-checkbox @change="visibleInManageable" :checked="vimchecked"> 可见可管理 </a-checkbox>
              </div>
              <div class="checkbox-item">
                <span class="inline-left">内部角色</span>
                <a-checkbox @change="visible" :checked="vchecked"> 可见 </a-checkbox>
                <a-checkbox @change="manageable" :checked="mchecked"> 可管理 </a-checkbox>
              </div>
              <!-- <div class="checkbox-item">
              <span class="inline-left">互联组织</span>
              <a-checkbox> 可见可管理 (勾选后，默认管理范围为全部互联组织) </a-checkbox>
            </div> -->
            </div>
          </div>
        </div>
        <div class="config-line">
          <div class="line-item left">管理范围</div>
          <div class="line-item right">
            <div class="range-container">
              <div class="line-item-detail">
                <div class="edit">
                  <span> 部门管理范围 (未选择时默认可管理所有部门)</span>
                  <a-popover placement="bottom" trigger="click" v-model="adjusDepVisible">
                    <template slot="content">
                      <div class="setDepTree">
                        <SelectDepartmentElement :defaultValue="deptRange" :multiple="true" :treeData="adjusDepTreeData" :replaceFields="adjusReplaceFields" @returnData="returnAdjusData" />
                      </div>
                      <div class="editNameBtn">
                        <a-button @click="adjusting(0)"> 取消 </a-button>
                        <a-button type="primary" @click="adjusting(1)"> 确认 </a-button>
                      </div>
                    </template>
                    <a-button type="link" icon="edit" @click="editAdjusDep">修改</a-button>
                  </a-popover>
                </div>
                <div class="view-wallperpar">
                  <span class="view-item" v-for="item in deptRange" :key="item.deptId">
                    <a-icon type="apartment" style="color: #fa9657" />
                    {{ item.deptName }}
                  </span>
                </div>
              </div>
              <div class="line-item-detail">
                <div class="edit">
                  <span> 角色管理范围(未选择时默认可管理所有角色)(按住ctrl多选)</span>
                  <a-popover placement="bottom" trigger="click" v-model="RoleVisible">
                    <template slot="content">
                      <div class="setDepTree">
                        <a-directory-tree multiple default-expand-all @select="onSelectRole" :selectedKeys="selectedKeysRole">
                          <a-tree-node :title="item.groupName" :selectable="false" v-for="item in RoleMenuTree" :key="item.groupId">
                            <a-tree-node :key="ritem.roleId" :title="ritem.roleName" is-leaf v-for="ritem in item.roles" />
                          </a-tree-node>
                        </a-directory-tree>
                      </div>
                      <div class="editNameBtn">
                        <a-button @click="selectRoleCallback(0)"> 取消 </a-button>
                        <a-button type="primary" @click="selectRoleCallback(1)"> 确认 </a-button>
                      </div>
                    </template>
                    <a-button type="link" icon="edit" @click="editRole">修改</a-button>
                  </a-popover>
                </div>
                <div class="view-wallperpar">
                  <span class="view-item" v-for="item in roleRange" :key="item.roleId">
                    <a-icon type="usergroup-delete" style="color: #57c4fa" />
                    {{ item.roleName }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-spin>
    </div>
    <!-- 选择管理员弹窗 -->
    <a-modal destroyOnClose title="成员列表" width="600px" :visible="adminVisible" @ok="handleOk" @cancel="handleCancel">
      <MemberSelect @checkedList="checkedList" :ststemAdminList="ststemAdminList" />
    </a-modal>
    <!-- 编辑应用弹窗 -->
    <a-modal destroyOnClose title="应用列表" width="400px" :visible="appVisible" @ok="apphandleOk" @cancel="apphandleCancel">
      <SelectApp @checkCallback="checkCallback" :defaultValue="SelectedAppList" />
    </a-modal>
  </div>
</template>

<script>
import { getTreeMenu, getRoleListClass, queryStstemAdmin, queryNormalAdminDetail, adminUpdatePre, addAdminStstemGroup } from '/src/api/enterprise/index.js'
import { getByUsername } from '/src/api/system/user.js'
import MemberSelect from '../memberSelect/index.vue'
import SelectApp from '/src/views/appCenter/SelectApp/index.vue'
import SelectDepartmentElement from '../selectDepartmentElement/index.vue'

export default {
  components: { SelectDepartmentElement, MemberSelect, SelectApp },
  props: {
    title: {
      type: String,
      default: '系统管理员'
    },
    groupId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      // 是否为创建者
      isOwner: '1',
      /* 开关 */
      checkedSwitch: false,
      /* 可见可管理 */
      vimchecked: false,
      /* 可见 */
      vchecked: false,
      /* 可管理 */
      mchecked: false,
      /* 选择部门 */
      adjusDepVisible: false,
      /* 选择角色 */
      RoleVisible: false,
      /* 部门树 */
      adjusDepTreeData: [],
      adjusReplaceFields: { children: 'children', title: 'label', key: 'id', value: 'id' },
      /* 角色组树菜单 */
      RoleMenuTree: [],
      /* 角色树选中 */
      selectedKeysRole: [],
      /* 选择管理人员弹窗 */
      adminVisible: false,
      /* 选中的人员 */
      PersonList: [],
      /* 选择应用 */
      appVisible: false,
      /* 管理组人员 */
      ststemAdminList: [],
      /* 部门管理范围 */
      deptRange: null,
      /* 人员管理范围 */
      roleRange: null,
      /* 选择部门返回的ID */
      AdjusDataList: [],
      /* loding */
      spinning: true,
      /* 初始化app */
      initAppList: [],
      /* 默认选中的app */
      SelectedAppList: [],
      /* 应用选择回调 */
      selectedAppListBack: []
    }
  },
  methods: {
    /* 开关 */
    onChangeSwitch(e) {
      const op = {
        appUpdate: e
      }
      adminUpdatePre({ groupId: this.groupId, op }).then(res => {
        if (res.code === 200) {
          this.initQueryNormalAdminDetail()
          return this.$message.success('修改成功')
        }
      })
    },
    /* 可见可管理 */
    visibleInManageable(e) {
      const op = {
        memberManage: e.target.checked,
        memberRead: e.target.checked
      }
      adminUpdatePre({ groupId: this.groupId, op }).then(res => {
        if (res.code === 200) {
          this.initQueryNormalAdminDetail()
          return this.$message.success('修改成功')
        }
      })
    },
    /* 可见 */
    visible(e) {
      const op = {
        roleRead: e.target.checked
      }
      adminUpdatePre({ groupId: this.groupId, op }).then(res => {
        if (res.code === 200) {
          this.initQueryNormalAdminDetail()
          return this.$message.success('修改成功')
        }
      })
    },
    /* 可管理 */
    manageable(e) {
      const op = {
        roleManage: e.target.checked
      }
      adminUpdatePre({ groupId: this.groupId, op }).then(res => {
        if (res.code === 200) {
          this.initQueryNormalAdminDetail()
          return this.$message.success('修改成功')
        }
      })
    },
    /* 修改部门 */
    editAdjusDep() {
      this.initAdjusDepTreeData()
    },
    /* 选择部门确认 */
    adjusting(v) {
      if (v === 1) {
        const deptRange = this.AdjusDataList
        adminUpdatePre({ groupId: this.groupId, deptRange }).then(res => {
          if (res.code === 200) {
            this.initQueryNormalAdminDetail()
            this.adjusDepVisible = false
            return this.$message.success('修改成功')
          }
        })
      } else {
        this.adjusDepVisible = false
      }
    },
    /* 部门选择回调 */
    returnAdjusData(d) {
      this.AdjusDataList = d
    },
    /* 初始化调整部门树 */
    initAdjusDepTreeData() {
      getTreeMenu().then(res => {
        this.adjusDepTreeData = res.data
      })
    },
    /* 修改角色 */
    editRole() {
      this.initRoleList()
    },
    /* 角色树菜单选中回调 */
    onSelectRole(keys, { selected, node }) {
      this.selectedKeysRole = keys
    },
    /* 选择角色确认 */
    selectRoleCallback(v) {
      if (v === 1) {
        const roleRange = this.selectedKeysRole
        adminUpdatePre({ groupId: this.groupId, roleRange }).then(res => {
          if (res.code === 200) {
            this.initQueryNormalAdminDetail()
            this.RoleVisible = false
            return this.$message.success('修改成功')
          }
        })
      } else {
        this.RoleVisible = false
        this.selectedKeysRole = []
      }
    },
    /* 查询角色组和角色 */
    initRoleList() {
      getRoleListClass().then(res => {
        this.RoleMenuTree = res.data
      })
    },
    /* 修改系统管理员 */
    editSystemAdmin() {
      this.adminVisible = true
    },
    /* 修改普通管理员 */
    addAdminPerson() {
      this.adminVisible = true
    },
    /* 修改管理员提交 */
    handleOk() {
      if (this.title === '系统管理员') {
        addAdminStstemGroup({ userIds: this.PersonList.length === 0 ? [] : this.PersonList }).then(res => {
          if (res.code === 200) {
            this.adminVisible = false
            this.initQueryStstemAdmin()
            return this.$message.success('修改成功')
          }
        })
      } else {
        const adminList = this.PersonList
        const params = {}
        params.groupId = this.groupId
        params.members = adminList
        adminUpdatePre(params).then(res => {
          if (res.code === 200) {
            this.adminVisible = false
            this.initQueryNormalAdminDetail()
            return this.$message.success('修改成功')
          }
        })
      }
    },
    /* 取消 */
    handleCancel() {
      this.adminVisible = false
    },
    /* 选择管理人员回调 */
    checkedList(d) {
      this.PersonList = d
    },
    /* 编辑应用 */
    editApp() {
      this.appVisible = true
    },
    /* 选择应用提交 */
    apphandleOk() {
      const apps = this.selectedAppListBack
      adminUpdatePre({ groupId: this.groupId, apps }).then(res => {
        if (res.code === 200) {
          this.initQueryNormalAdminDetail()
          this.appVisible = false
          return this.$message.success('修改成功')
        }
      })
    },
    /* 取消 */
    apphandleCancel() {
      this.appVisible = false
    },
    /* 应用选中回调 */
    checkCallback(v) {
      this.selectedAppListBack = v
    },
    /* 查询系统管理员 */
    initQueryStstemAdmin() {
      queryStstemAdmin().then(res => {
        this.ststemAdminList = res.data
      })
    },
    /* 查询普通管理员详情 */
    initQueryNormalAdminDetail() {
      this.spinning = true
      queryNormalAdminDetail({ groupId: this.groupId }).then(res => {
        if (res.code === 200) {
          this.ststemAdminList = res.data.members
          this.checkedSwitch = res.data.op.appUpdate
          this.vimchecked = res.data.op.memberManage
          this.vchecked = res.data.op.roleRead
          this.mchecked = res.data.op.roleManage
          this.deptRange = res.data.deptRange
          this.roleRange = res.data.roleRange
          if (res.data.apps.length !== 0) {
            this.initAppList = res.data.apps
            /* 应用默认选中 */
            this.SelectedAppList = res.data.apps.map(item => item.id)
          } else {
            /* 清空 */
            this.initAppList = []
            this.SelectedAppList = []
          }
          /* 角色默认选中 */
          if (res.data.roleRange.length !== 0) {
            this.selectedKeysRole = res.data.roleRange.map(item => item.roleId)
          }
          this.spinning = false
        }
      })
    }
  },
  created() {
    this.initQueryStstemAdmin()
    // 获取当前登录者的信息
    getByUsername({ userName: this.$store.getters.userName }).then(res => {
      this.isOwner = res.data.isOwner
    })
  },
  watch: {
    title(d) {
      if (d === '系统管理员') {
        this.initQueryStstemAdmin()
      } else {
        this.initQueryNormalAdminDetail()
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
