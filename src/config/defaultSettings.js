/**
 * 项目默认配置项
 * primaryColor - 默认主题色, 如果修改颜色不生效，请清理 localStorage
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左侧菜单栏 ： boolean
 * contentWidth - 内容区布局： 流式 |  固定
 * breadcrumb - 是否显示面包屑
 * footerView - 是否显示Footer
 * showSettingDrawer - 是否显示settingDrawer
 *
 * storageOptions: {} - Vue-ls 插件配置项 (localStorage/sessionStorage)
 *
 */

export default {
  // 是否显示settingDrawer
  showSettingDrawer: true,
  navTheme: 'light', // theme for nav menu
  primaryColor: '#348ee4', // primary color of ant design
  layout: 'sidemenu', // nav menu position: `sidemenu` or `topmenu`
  contentWidth: 'Fluid', // layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
  fixedHeader: true, // sticky header
  fixSiderbar: true, // sticky siderbar
  colorWeak: false,
  // 显示页签
  multiTab: true,
  // 是否显示一级菜单
  showFirstLevelMenu: true,
  // 顶部一级菜单icon水平展示
  menuIconHorizontal: false,
  // 显示面包屑
  breadcrumb: false,
  // 显示底部
  footerView: false,
  watermark: true, // 水印,
  comany: 'QS',
  companyDoc: '海豹科技有限公司',
  codePrefix: 'QS',
  websocketHost: 'ws://' + location.host + '/websocket/ws/wait/',
  menu: {
    locale: true
  },
  title: '啓思',
  pwa: false,
  // iconfontUrl: '//at.alicdn.com/t/font_2449767_8ld7v8xvxl8.js',
  production: import.meta.env.MODE === 'production' && import.meta.env.VITE_APP_PREVIEW !== 'true',
  tableSize: 'middle'
}
