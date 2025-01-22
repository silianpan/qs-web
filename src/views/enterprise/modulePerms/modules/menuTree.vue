<!-- 菜单树 -->
<template>
  <a-drawer width="35%" :label-col="4" :wrapper-col="14" :visible="open" @close="onClose">
    <a-divider orientation="left">
      <b>{{ formTitle }}</b>
    </a-divider>
    <a-form-model ref="form" :model="form">
      <a-form-model-item label="模块权限">
        <a-checkbox @change="handleCheckedTreeExpand($event)"> 展开/折叠 </a-checkbox>
        <a-checkbox @change="handleCheckedTreeNodeAll($event)"> 全选/全不选 </a-checkbox>
        <a-checkbox @change="handleCheckedTreeConnect($event)" :checked="form.menuCheckStrictly"> 父子联动 </a-checkbox>
        <a-tree
          v-model="menuCheckedKeys"
          checkable
          :checkStrictly="!form.menuCheckStrictly"
          :expanded-keys="menuExpandedKeys"
          :auto-expand-parent="autoExpandParent"
          :tree-data="menuOptions"
          @check="onCheck"
          @expand="onExpandMenu"
          :replaceFields="defaultProps"
        />
      </a-form-model-item>
      <div class="bottom-control">
        <a-space>
          <a-button type="primary" @click="submitForm"> 保存 </a-button>
          <a-button type="dashed" @click="cancel"> 取消 </a-button>
        </a-space>
      </div>
    </a-form-model>
  </a-drawer>
</template>

<script>
import { addMenuPerm } from '/src/api/enterprise/index.js'
import { roleMenuTree, userMenuTree, deptMenuTree } from '/src/api/system/menu.js'

export default {
  name: 'MenuTree',
  components: {},
  data() {
    return {
      loading: false,
      menuExpandedKeys: [],
      autoExpandParent: false,
      menuCheckedKeys: [],
      halfCheckedKeys: [],
      menuOptions: [],
      formTitle: '',
      // 表单参数
      form: {
        userId: undefined,
        deptId: undefined,
        roleId: undefined,
        tenantModuleIds: [],
        menuCheckStrictly: true
      },
      open: false,
      menuExpand: false,
      menuNodeAll: false,
      defaultProps: {
        children: 'children',
        title: 'label',
        key: 'id'
      }
    }
  },
  filters: {},
  created() {},
  computed: {},
  watch: {},
  methods: {
    onExpandMenu(expandedKeys) {
      this.menuExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 全选与半选
      return this.menuCheckedKeys.concat(this.halfCheckedKeys)
    },
    getAllMenuNode(nodes) {
      if (!nodes || nodes.length === 0) {
        return []
      }
      nodes.forEach(node => {
        this.menuCheckedKeys.push(node.id)
        return this.getAllMenuNode(node.children)
      })
    },
    // 回显过滤
    selectNodefilter(nodes, parentIds) {
      if (!nodes || nodes.length === 0) {
        return []
      }
      nodes.forEach(node => {
        // 父子关联模式且当前元素有父级
        const currentIndex = this.menuCheckedKeys.indexOf(node.id)
        // 当前节点存在,且父节点不存在，则说明父节点应是半选中状态
        if (currentIndex !== -1) {
          parentIds.forEach(parentId => {
            if (this.halfCheckedKeys.indexOf(parentId) === -1) {
              this.halfCheckedKeys.push(parentId)
            }
          })
          parentIds = []
        }
        // // 防重
        const isExist = this.halfCheckedKeys.indexOf(node.id)
        const isExistParentIds = parentIds.indexOf(node.id)
        if (isExist === -1 && isExistParentIds === -1 && currentIndex === -1) {
          parentIds.push(node.id)
        }
        // return this.selectNodefilter(node.children, parentIds)
      })
    },
    handleCheckedTreeNodeAll(value) {
      if (value.target.checked) {
        this.getAllMenuNode(this.menuOptions)
      } else {
        this.menuCheckedKeys = []
        this.halfCheckedKeys = []
      }
    },
    handleCheckedTreeExpand(value) {
      if (value.target.checked) {
        const treeList = this.menuOptions
        for (let i = 0; i < treeList.length; i++) {
          this.menuExpandedKeys.push(treeList[i].id)
        }
      } else {
        this.menuExpandedKeys = []
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value) {
      this.form.menuCheckStrictly = !this.form.menuCheckStrictly
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTree({ roleId: roleId, tenantAppId: this.$store.getters.tenantAppId }).then(response => {
        this.menuOptions = response.menus
        return response
      })
    },
    /** 根据部门ID查询菜单树结构 */
    getDeptMenuTreeselect(deptId) {
      return deptMenuTree({ deptId: deptId, tenantAppId: this.$store.getters.tenantAppId }).then(response => {
        this.menuOptions = response.menus
        return response
      })
    },
    /** 根据用户ID查询菜单树结构 */
    getUserMenuTreeselect(userId) {
      return userMenuTree({ userId: userId, tenantAppId: this.$store.getters.tenantAppId }).then(response => {
        this.menuOptions = response.menus
        return response
      })
    },
    onCheck(checkedKeys, info) {
      if (!this.form.menuCheckStrictly) {
        let currentCheckedKeys = []
        if (this.menuCheckedKeys.checked) {
          currentCheckedKeys = currentCheckedKeys.concat(this.menuCheckedKeys.checked)
        }
        if (this.menuCheckedKeys.halfChecked) {
          currentCheckedKeys = currentCheckedKeys.concat(this.menuCheckedKeys.halfChecked)
        }
        this.menuCheckedKeys = currentCheckedKeys
      } else {
        // 半选节点
        this.halfCheckedKeys = info.halfCheckedKeys
        this.menuCheckedKeys = checkedKeys
      }
    },
    onClose() {
      this.open = false
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      if (this.$refs.menu !== undefined) {
        this.menuCheckedKeys = []
        this.halfCheckedKeys = []
      }
      this.menuExpand = false
      this.menuNodeAll = false
      this.menuExpandedKeys = []
      this.autoExpandParent = false
      this.menuCheckedKeys = []
      this.halfCheckedKeys = []
      this.form = {
        userId: undefined,
        deptId: undefined,
        roleId: undefined,
        tenantModuleIds: [],
        menuCheckStrictly: true
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row, type) {
      if (type === '角色') {
        this.reset()
        const roleId = row.roleId
        const Menu = this.getRoleMenuTreeselect(roleId)
        this.form.roleId = roleId
        this.$nextTick(() => {
          this.open = true
          Menu.then(res => {
            this.menuCheckedKeys = res.checkedKeys
            // 过滤回显时的半选中node(父)
            if (this.form.menuCheckStrictly) {
              this.selectNodefilter(this.menuOptions, [])
            }
          })
        })
        this.formTitle = '角色模块'
      }
      if (type === '部门') {
        this.reset()
        const deptId = row.deptId
        const Menu = this.getDeptMenuTreeselect(deptId)
        this.form.deptId = deptId
        this.$nextTick(() => {
          this.open = true
          Menu.then(res => {
            this.menuCheckedKeys = res.checkedKeys
            // 过滤回显时的半选中node(父)
            if (this.form.menuCheckStrictly) {
              this.selectNodefilter(this.menuOptions, [])
            }
          })
        })
        this.formTitle = '部门模块'
      }
      if (type === '成员') {
        this.reset()
        const userId = row.userId
        const Menu = this.getUserMenuTreeselect(userId)
        this.form.userId = userId
        this.$nextTick(() => {
          this.open = true
          Menu.then(res => {
            this.menuCheckedKeys = res.checkedKeys
            // 过滤回显时的半选中node(父)
            if (this.form.menuCheckStrictly) {
              this.selectNodefilter(this.menuOptions, [])
            }
          })
        })
        this.formTitle = '成员模块'
      }
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.tenantModuleIds = this.getMenuAllCheckedKeys()
          addMenuPerm(this.form).then(response => {
            this.$message.success('修改成功', 3)
            this.open = false
            this.$emit('ok')
          })
        }
      })
    }
  }
}
</script>
