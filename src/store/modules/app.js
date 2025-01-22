import storage from 'store'
import {
  SIDEBAR_TYPE,
  TOGGLE_MOBILE_TYPE,
  TOGGLE_NAV_THEME,
  TOGGLE_LAYOUT,
  TOGGLE_FIXED_HEADER,
  TOGGLE_FIXED_SIDEBAR,
  TOGGLE_CONTENT_WIDTH,
  TOGGLE_HIDE_HEADER,
  TOGGLE_COLOR,
  TOGGLE_WEAK,
  TOGGLE_MULTI_TAB,
  TOGGLE_BREADCRUMB,
  TOGGLE_FOOTER_VIEW,
  TOGGLE_SHOW_FIRST_LEVEL_MENU,
  TOGGLE_MENU_ICON_HORIZONTAL,
  // i18n
  APP_LANGUAGE,
  SET_CURRENT_LEVEL_ONE_MENU
} from '/src/store/mutation-types.js'

const app = {
  state: {
    sideCollapsed: false,
    isMobile: false,
    theme: 'light',
    layout: 'sidemenu',
    contentWidth: '',
    fixedHeader: false,
    fixedSidebar: false,
    autoHideHeader: false,
    color: '',
    weak: false,
    multiTab: true,
    breadcrumb: true,
    footerView: false,
    showFirstLevelMenu: false,
    menuIconHorizontal: false,
    lang: 'zh-CN',
    _antLocale: {},
    currentLevelOneMenu: []
  },
  mutations: {
    [SIDEBAR_TYPE]: (state, type) => {
      state.sideCollapsed = type
      storage.set(SIDEBAR_TYPE, type)
    },
    [TOGGLE_MOBILE_TYPE]: (state, isMobile) => {
      state.isMobile = isMobile
    },
    [TOGGLE_NAV_THEME]: (state, theme) => {
      state.theme = theme
      storage.set(TOGGLE_NAV_THEME, theme)
    },
    [TOGGLE_LAYOUT]: (state, mode) => {
      state.layout = mode
      storage.set(TOGGLE_LAYOUT, mode)
    },
    [TOGGLE_FIXED_HEADER]: (state, mode) => {
      state.fixedHeader = mode
      storage.set(TOGGLE_FIXED_HEADER, mode)
    },
    [TOGGLE_FIXED_SIDEBAR]: (state, mode) => {
      state.fixedSidebar = mode
      storage.set(TOGGLE_FIXED_SIDEBAR, mode)
    },
    [TOGGLE_CONTENT_WIDTH]: (state, type) => {
      state.contentWidth = type
      storage.set(TOGGLE_CONTENT_WIDTH, type)
    },
    [TOGGLE_HIDE_HEADER]: (state, type) => {
      state.autoHideHeader = type
      storage.set(TOGGLE_HIDE_HEADER, type)
    },
    [TOGGLE_COLOR]: (state, color) => {
      state.color = color
      storage.set(TOGGLE_COLOR, color)
    },
    [TOGGLE_WEAK]: (state, mode) => {
      state.weak = mode
      storage.set(TOGGLE_WEAK, mode)
    },
    [APP_LANGUAGE]: (state, lang, antd = {}) => {
      state.lang = lang
      state._antLocale = antd
      storage.set(APP_LANGUAGE, lang)
    },
    [TOGGLE_MULTI_TAB]: (state, bool) => {
      storage.set(TOGGLE_MULTI_TAB, bool)
      state.multiTab = bool
    },
    [TOGGLE_BREADCRUMB]: (state, bool) => {
      storage.set(TOGGLE_BREADCRUMB, bool)
      state.breadcrumb = bool
    },
    [TOGGLE_FOOTER_VIEW]: (state, bool) => {
      storage.set(TOGGLE_FOOTER_VIEW, bool)
      state.footerView = bool
    },
    [TOGGLE_SHOW_FIRST_LEVEL_MENU]: (state, bool) => {
      storage.set(TOGGLE_SHOW_FIRST_LEVEL_MENU, bool)
      state.showFirstLevelMenu = bool
    },
    [TOGGLE_MENU_ICON_HORIZONTAL]: (state, bool) => {
      storage.set(TOGGLE_MENU_ICON_HORIZONTAL,bool)
      state.menuIconHorizontal = bool
    },
    [SET_CURRENT_LEVEL_ONE_MENU]: (state, menu) => {
      storage.set(SET_CURRENT_LEVEL_ONE_MENU, menu)
      state.currentLevelOneMenu = menu
    }
  },
  actions: {
    ToggleLayout({ commit }, layout) {
      commit(TOGGLE_LAYOUT, layout)
    },
    ToggleContentWidth({ commit }, contentWidth) {
      commit(TOGGLE_CONTENT_WIDTH, contentWidth)
    },
    ToggleTheme({ commit }, navTheme) {
      commit(TOGGLE_NAV_THEME, navTheme)
    },
    TogglePrimaryColor({ commit }, color) {
      commit(TOGGLE_COLOR, color)
    },
    ToggleFixedHeader({ commit }, fixedHeader) {
      commit(TOGGLE_FIXED_HEADER, fixedHeader)
    },
    ToggleFixSiderbar({ commit }, fixedSidebar) {
      commit(TOGGLE_FIXED_SIDEBAR, fixedSidebar)
    },
    ToggleMultiTab({ commit }, multiTab) {
      commit(TOGGLE_MULTI_TAB, multiTab)
    },
    ToggleBreadcrumb({ commit }, breadcrumb) {
      commit(TOGGLE_BREADCRUMB, breadcrumb)
    },
    ToggleFooterView({ commit }, footerView) {
      commit(TOGGLE_FOOTER_VIEW, footerView)
    },
    ToggleShowFirstLevelMenu({ commit }, showFirstLevelMenu) {
      commit(TOGGLE_SHOW_FIRST_LEVEL_MENU, showFirstLevelMenu)
    },
    ToggleMenuIconHorizontal({ commit }, menuIconHorizontal){
      commit(TOGGLE_MENU_ICON_HORIZONTAL, menuIconHorizontal)
    },
    ToggleColorWeak({ commit }, colorWeak) {
      commit(TOGGLE_WEAK, colorWeak)
    },
    SetCurrentLevelOneMenu({ commit }, menu) {
      commit(SET_CURRENT_LEVEL_ONE_MENU, menu)
    }
  }
}

export default app
