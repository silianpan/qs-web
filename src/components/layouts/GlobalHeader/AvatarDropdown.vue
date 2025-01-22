<template>
  <div :class="{ 'avatar-sidermenu': layout !== 'sidemenu' }">
    <setting-drawer ref="settingDrawer" v-if="showSettingDrawer" :settings="settings" @change="handleSettingChange" />
    <a-dropdown v-if="nickname" placement="bottomRight">
      <span class="ant-pro-account-avatar">
        <a-space class="avatar-box">
          <a-avatar size="large" :src="avatar" class="antd-pro-global-header-index-avatar avatar" v-if="avatar !== null" />
          <a-avatar
            size="large"
            :src="imgAvatar"
            class="avatar"
            v-else
          />
          <span class="text">{{ nickname }}</span>
          <a-icon type="caret-down" class="icon" />
        </a-space>
      </span>
      <template v-slot:overlay>
        <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
          <template v-if="menu">
            <a-menu-item key="team" @click="handleToContacts">
              <a-icon type="team" />
              团队管理
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="center" @click="handleToCenter">
              <a-icon type="user" />
              个人中心
            </a-menu-item>
            <a-menu-item key="settings" @click="handleToSettings">
              <a-icon type="setting" />
              个人设置
            </a-menu-item>
            <a-menu-divider />
          </template>
          <a-menu-item key="settingsSoftware" @click="handleToSettingsSoftware">
            <a-icon type="setting" />
            软件设置
          </a-menu-item>
          <a-menu-item key="logout" @click="handleLogout">
            <a-icon type="logout" />
            退出登录
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <span v-else>
      <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
    </span>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import defaultSettings from '/src/config/defaultSettings.js'
import { CONTENT_WIDTH_TYPE } from '/src/store/mutation-types.js'
import { SettingDrawer } from '/src/components/layouts/ProLayout/index.js'
import { firstUpperCase } from '/src/utils/common/util.js'
import imgAvatar from '/src/assets/img/avatar.png'

export default {
  name: 'AvatarDropdown',
  props: {
    menu: {
      type: Boolean,
      default: true
    }
  },
  components: {
    SettingDrawer
  },
  data() {
    return {
      imgAvatar,
      showSettingDrawer: defaultSettings.showSettingDrawer
    }
  },
  computed: {
    ...mapGetters(['avatar', 'nickname', 'sex', 'postGroup', 'layout']),
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters,
      layout: state => state.app.layout,
      navTheme: state => state.app.theme,
      primaryColor: state => state.app.color,
      colorWeak: state => state.app.weak,
      fixedHeader: state => state.app.fixedHeader,
      fixedSidebar: state => state.app.fixedSidebar,
      contentWidth: state => state.app.contentWidth,
      multiTab: state => state.app.multiTab,
      breadcrumb: state => state.app.breadcrumb,
      footerView: state => state.app.footerView,
      showFirstLevelMenu: state => state.app.showFirstLevelMenu,
      menuIconHorizontal: state => state.app.menuIconHorizontal,
      tenantAppId: state => state.user.tenantAppId
    }),
    settings() {
      return {
        // 布局类型
        layout: this.layout, // 'sidemenu', 'topmenu'
        // CONTENT_WIDTH_TYPE
        contentWidth: this.layout === 'sidemenu' ? CONTENT_WIDTH_TYPE.Fluid : this.contentWidth,
        // 主题 'dark' | 'light'
        theme: this.navTheme,
        // 主色调
        primaryColor: this.primaryColor,
        fixedHeader: this.fixedHeader,
        fixSiderbar: this.fixedSidebar,
        multiTab: this.multiTab,
        breadcrumb: this.breadcrumb,
        footerView: this.footerView,
        showFirstLevelMenu: this.showFirstLevelMenu,
        menuIconHorizontal: this.menuIconHorizontal,
        colorWeak: this.colorWeak,

        hideHintAlert: false,
        hideCopyButton: false
      }
    }
  },
  methods: {
    handleToCenter() {
      this.$router.push({ path: '/account/center' })
    },
    handleToSettings() {
      this.$router.push({ path: '/account/settings' })
    },
    handleToSettingsSoftware() {
      this.showSettingDrawer && this.$refs.settingDrawer.setShow(true)
    },
    /* 通讯录 */
    handleToContacts() {
      this.$router.push({ path: '/saas/contacts' })
    },
    handleLogout(e) {
      this.$antdconfirm({
        title: '提示',
        content: '确定注销并退出系统吗？',
        onOk: () => {
          return this.$store.dispatch('Logout').then(() => {
            location.href = '/qs/index'
          })
        },
        onCancel() {}
      })
    },
    handleSettingChange({ type, value }) {
      // type && (this.settings[type] = value)
      type && this.$store.dispatch('Toggle' + firstUpperCase(type), value)
      switch (type) {
        // case 'primaryColor':
        //   this.$store.dispatch('TogglePrimaryColor', value)
        //   break
        // case 'contentWidth':
        //   // this.settings[type] = value
        //   this.$store.dispatch('ToggleContentWidth', value)
        //   break
        case 'layout':
          if (value === 'sidemenu') {
            this.$store.dispatch('ToggleFixSiderbar', true)
            // this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
            this.$store.dispatch('ToggleContentWidth', CONTENT_WIDTH_TYPE.Fluid)
          } else {
            // this.settings.fixSiderbar = false
            this.$store.dispatch('ToggleFixSiderbar', false)
            // this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fixed
            this.$store.dispatch('ToggleContentWidth', CONTENT_WIDTH_TYPE.Fixed)
          }
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import './AvatarDropdown.less';
.ant-pro-drop-down {
  ::v-deep .action {
    margin-right: 8px;
  }
  ::v-deep .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
.avatar-sidermenu {
  .ant-pro-account-avatar {
    .ant-space-item {
      span.text {
        color: rgba(0, 0, 0, 0.65);
      }
    }
    /deep/ .anticon-caret-down {
      svg {
        color: rgba(0, 0, 0, 0.65) !important;
      }
    }
  }
}
</style>
