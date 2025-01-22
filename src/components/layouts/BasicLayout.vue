<template>
  <pro-layout
    :siderWidth="208"
    :menus="menus"
    :collapsed="collapsed"
    :mediaQuery="query"
    :isMobile="isMobile"
    :handleMediaQuery="handleMediaQuery"
    :handleCollapse="handleCollapse"
    :i18nRender="i18nRender"
    v-bind="settings"
    :footerRender="footerView"
  >
    <!-- layout content -->
    <!-- 2021.01.15 默认固定页头，去掉样式paddingTop: fixedHeader ? '64' : '0'  -->
    <a-layout-content :style="{ height: '100%', margin: '0 0 0px 0' }">
      <multi-tab v-if="settings.multiTab"></multi-tab>
      <transition name="page-transition"> </transition>
    </a-layout-content>
    <!-- 1.0.0+ 版本 pro-layout 提供 API，
          我们推荐使用这种方式进行 LOGO 和 title 自定义
    -->
    <template v-slot:menuHeaderRender>
      <div class="logo-container">
        <img v-if="collapsed" :src="smallLogo" class="logo" alt="logo" />
        <img v-else :src="bigLogo" class="logo-name" alt="logo-name" style="width: 141px; height: 56px" />
        <div class="index-menu">
          <a-button type="primary" v-show="!collapsed" @click="goHome">
            <img class="btn-icon" :src="imgHome" alt="" />
            首页
          </a-button>
          <!-- <img class="toggle-icon" v-if="!collapsed" @click="handleCollapse(!collapsed)" src="" alt="" /> -->
          <!-- <img class="toggle-icon" v-else @click="handleCollapse(!collapsed)" src="" alt="" /> -->
          <icon-font type="iconfont-shouqicaidan" class="toggle-icon" v-if="!collapsed" @click.prevent.stop="handleCollapse(!collapsed)" />
          <icon-font type="iconfont-zhankaicaidan" class="toggle-icon" v-else @click.prevent.stop="handleCollapse(!collapsed)" />
        </div>
      </div>
    </template>

    <!-- <setting-drawer v-if="showSettingDrawer" :settings="settings" @change="handleSettingChange" /> -->
    <template v-slot:rightContentRender>
      <right-content :top-menu="settings.layout === 'topmenu'" :is-mobile="isMobile" :theme="settings.theme" />
    </template>
    <template v-slot:footerRender v-if="footerView">
      <global-footer />
    </template>
    <router-view />
  </pro-layout>
</template>

<script>
import MultiTab from './MultiTab/index.js'
import { updateTheme } from './ProLayout/index.js'
import { i18nRender } from '/src/locales/index.js'
import { mapState } from 'vuex'
import { CONTENT_WIDTH_TYPE, SIDEBAR_TYPE, TOGGLE_MOBILE_TYPE } from '/src/store/mutation-types.js'

import defaultSettings from '/src/config/defaultSettings.js'
import RightContent from './GlobalHeader/RightContent.vue'
import GlobalFooter from './GlobalFooter/index.vue'
import { firstUpperCase } from '/src/utils/common/util.js'

import smallLogo from '/src/assets/img/logo.png'
import bigLogo from '/src/assets/img/home-logo.png'
import imgHome from '/src/assets/img/home.png'

export default {
  name: 'BasicLayout',
  components: {
    RightContent,
    GlobalFooter,
    MultiTab
  },
  data() {
    return {
      smallLogo,
      bigLogo,
      imgHome,
      // preview.pro.antdv.com only use.
      isProPreviewSite: import.meta.env.VITE_APP_PREVIEW === 'true' && import.meta.env.MODE !== 'development',
      // end
      // multiTab: defaultSettings.multiTab,
      // fixedHeader: defaultSettings.fixedHeader,
      // base
      menus: [],
      // 侧栏展开状态
      collapsed: false,
      title: defaultSettings.title,
      // 是否显示settingDrawer
      showSettingDrawer: defaultSettings.showSettingDrawer,
      // 媒体查询
      query: {},
      // 是否手机模式
      isMobile: false
    }
  },
  computed: {
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
  created() {
    const routes = this.mainMenu.find(item => item.path === '/')
    this.menus = (routes && routes.children) || []
    // 处理侧栏展开状态
    this.$watch('collapsed', () => {
      this.$store.commit(SIDEBAR_TYPE, this.collapsed)
    })
    this.$watch('isMobile', () => {
      this.$store.commit(TOGGLE_MOBILE_TYPE, this.isMobile)
    })
  },
  mounted() {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }

    // first update color
    // TIPS: THEME COLOR HANDLER!! PLEASE CHECK THAT!!
    // if (import.meta.env.MODE !== 'production' || import.meta.env.VITE_APP_PREVIEW === 'true') {
    //   // 读取store里的primaryColor
    //   updateTheme(this.settings.primaryColor)
    // }
    console.log('NODE_ENV', import.meta.env.MODE)
    console.log('VITE_APP_PREVIEW', import.meta.env.VITE_APP_PREVIEW)
    // 生产环境和开发环境都具备切换颜色
    updateTheme(this.settings.primaryColor)
  },
  methods: {
    i18nRender,
    handleMediaQuery(val) {
      this.query = val
      if (this.isMobile && !val['screen-xs']) {
        this.isMobile = false
        return
      }
      if (!this.isMobile && val['screen-xs']) {
        this.isMobile = true
        this.collapsed = false
        // this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
        this.$store.dispatch('ToggleContentWidth', CONTENT_WIDTH_TYPE.Fluid)
        // this.settings.fixSiderbar = false
      }
    },
    handleCollapse(val) {
      this.collapsed = val
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
    },
    goHome() {
      this.$router.push({ path: '/index' })
    }
  }
}
</script>

<style lang="less">
@import './BasicLayout.less';
</style>
