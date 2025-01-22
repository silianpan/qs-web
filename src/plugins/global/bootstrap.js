import store from '/src/store/index.js'
import storage from 'store'
import {
  ACCESS_TOKEN,
  TOGGLE_CONTENT_WIDTH,
  TOGGLE_FIXED_HEADER,
  TOGGLE_FIXED_SIDEBAR,
  TOGGLE_HIDE_HEADER,
  TOGGLE_LAYOUT,
  TOGGLE_NAV_THEME,
  TOGGLE_WEAK,
  TOGGLE_COLOR,
  TOGGLE_MULTI_TAB,
  TOGGLE_BREADCRUMB,
  TOGGLE_FOOTER_VIEW,
  TOGGLE_SHOW_FIRST_LEVEL_MENU,
  TOGGLE_MENU_ICON_HORIZONTAL,
} from '/src/store/mutation-types.js'
import defaultSettings from '/src/config/defaultSettings.js'

export default function Initializer() {
  store.commit(TOGGLE_LAYOUT, storage.get(TOGGLE_LAYOUT, defaultSettings.layout))
  store.commit(TOGGLE_FIXED_HEADER, storage.get(TOGGLE_FIXED_HEADER, defaultSettings.fixedHeader))
  store.commit(TOGGLE_FIXED_SIDEBAR, storage.get(TOGGLE_FIXED_SIDEBAR, defaultSettings.fixSiderbar))
  store.commit(TOGGLE_CONTENT_WIDTH, storage.get(TOGGLE_CONTENT_WIDTH, defaultSettings.contentWidth))
  store.commit(TOGGLE_HIDE_HEADER, storage.get(TOGGLE_HIDE_HEADER, defaultSettings.autoHideHeader))
  store.commit(TOGGLE_NAV_THEME, storage.get(TOGGLE_NAV_THEME, defaultSettings.navTheme))
  store.commit(TOGGLE_WEAK, storage.get(TOGGLE_WEAK, defaultSettings.colorWeak))
  store.commit(TOGGLE_COLOR, storage.get(TOGGLE_COLOR, defaultSettings.primaryColor))
  store.commit(TOGGLE_MULTI_TAB, storage.get(TOGGLE_MULTI_TAB, defaultSettings.multiTab))
  store.commit(TOGGLE_BREADCRUMB, storage.get(TOGGLE_BREADCRUMB, defaultSettings.breadcrumb))
  store.commit(TOGGLE_FOOTER_VIEW, storage.get(TOGGLE_FOOTER_VIEW, defaultSettings.footerView))
  store.commit(TOGGLE_SHOW_FIRST_LEVEL_MENU, storage.get(TOGGLE_SHOW_FIRST_LEVEL_MENU, defaultSettings.showFirstLevelMenu))
  store.commit(TOGGLE_MENU_ICON_HORIZONTAL, storage.get(TOGGLE_MENU_ICON_HORIZONTAL, defaultSettings.menuIconHorizontal))
  store.commit('SET_TOKEN', storage.get(ACCESS_TOKEN))
}
