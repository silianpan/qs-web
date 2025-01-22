import storage from 'store'
const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  layout: state => state.app.layout,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  userName: state => state.user.userName,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  breadcrumb: state => state.app.breadcrumb,
  footerView: state => state.app.footerView,
  showFirstLevelMenu: state => state.app.showFirstLevelMenu,
  menuIconHorizontal: state => state.app.menuIconHorizontal,
  sex: state => state.user.sex,
  posts: state => state.user.posts,
  postGroup: state => state.user.postGroup,
  todoTotal: state => state.user.todoTotal || storage.get('todoTotal'),
  userPermission: state => state.user.userPermission,
  tenantAppId: state => state.user.tenantAppId || storage.get('TENANT_APP_ID'),
  currentFirstLevelMenu: state => state.app.currentLevelOneMenu,
  defaultCompany: state => state.user.defaultCompany || storage.get('DEFAULT_COMPANY')
}

export default getters
