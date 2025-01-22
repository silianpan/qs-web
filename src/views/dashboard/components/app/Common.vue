<!-- 常用应用 -->
<template>
  <a-card class="card-container card-container-height" :bordered="false" :headStyle="{ border: 'none' }" :bodyStyle="{ overflowY: 'hidden', height: '100%' }">
    <h1 slot="title" class="card-title">常用应用</h1>
    <a slot="extra" @click="handleEditUserMenus">添加</a>
    <a slot="extra" class="s-ml-10" @click="handleDelMenu">{{ isEditUserMenu ? '完成' : '删除' }}</a>
    <a-card-grid class="project-card-grid" :key="i" v-for="(item, i) in userMenuList">
      <a-card :bordered="false" :body-style="{ padding: 0, cursor: 'pointer' }" :class="isEditUserMenu ? 'grid-selected' : ''">
        <img v-if="isEditUserMenu" @click="handleDeleteUserMenu(item)" :src="imgRemove" class="badge-icon" />
        <icon-font @click="handleApp(item.path)" :type="item.meta.icon" :style="{ fontSize: '14px' }" />
        <span @click="handleApp(item.path)" style="font-size: 14px" class="s-ml-10">
          <Ellipsis :length="item.menuName.length > 4 ? 6 : 8" tooltip>{{ item.menuName }}</Ellipsis>
        </span>
      </a-card>
    </a-card-grid>
  </a-card>
</template>

<script>
import { listUserMenus, addUserMenu, deleteUserMenu } from '/src/api/system/menu.js'
import UserMenuTree from '/src/views/user/UserMenuTree.vue'
import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'
import imgRemove from '/src/assets/img/remove.png'

export default {
  components: {
    Ellipsis
  },
  data() {
    return {
      imgRemove,
      isEditUserMenu: false,
      userMenuList: []
    }
  },
  created() {
    this.getUserMenus()
  },
  methods: {
    handleApp(url) {
      this.$router.push({ path: url })
    },
    // 获取用户常用菜单
    getUserMenus() {
      listUserMenus().then(res => {
        // const menuList = []
        // res.data.forEach(item => {
        //   if (item.children) {
        //     item.children.forEach(child => {
        //       child.path = item.path + '/' + child.path
        //       menuList.push(child)
        //     })
        //   }
        // })
        this.userMenuList = res.data
      })
    },
    // 编辑用户常用应用菜单
    handleEditUserMenus() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '编辑常用应用',
          width: '30%',
          maskClosable: true
        },
        content: {
          template: UserMenuTree,
          on: {
            ok: selectedMenuIds => {
              const menuData = []
              selectedMenuIds.forEach(item => {
                menuData.push({ menuId: item })
              })
              addUserMenu(menuData).then(res => {
                this.$message.success('添加成功')
                this.getUserMenus()
              })
            }
          }
        }
      })
    },
    handleDelMenu() {
      this.isEditUserMenu = !this.isEditUserMenu
    },
    handleDeleteUserMenu(item) {
      deleteUserMenu(item.menuId).then(res => {
        this.$message.success('删除成功')
        this.getUserMenus()
      })
    }
  }
}
</script>

<style scoped>
.project-card-grid {
  padding: 16px !important;
}
</style>
