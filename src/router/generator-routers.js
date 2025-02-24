// eslint-disable-next-line
import { getRouters } from '/src/api/user/module.js'
import { UserLayout, BasicLayout, BlankLayout, PageView, RouteView } from '/src/components/layouts/index.js'
import { indexRouterMap } from '/src/config/router.config.js'
import { validURL } from '/src/utils/common/validate.js'

const modules = import.meta.glob('../views/**/*.vue')

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  UserLayout: UserLayout, // 登陆注册页面的通用布局

  // 你需要动态引入的页面组件
  Index: () => import('/src/views/home/index.vue'),
  // account
  AccountCenter: () => import('/src/views/user/account/center/index.vue'),
  AccountSettings: () => import('/src/views/user/account/settings/index.vue'),
  BaseSettings: () => import('/src/views/user/account/settings/BaseSetting.vue'),
  SecuritySettings: () => import('/src/views/user/account/settings/Security.vue'),
  // job log
  // JobLog: () => import('@/views/monitor/job/log'),
  // 公告新增修改
  NoticeForm: () => import('/src/views/system/notice/CreateForm'),
  // 修改生成配置
  // GenEdit: () => import('@/views/tool/gen/modules/GenEdit'),
  // 应用中心
  // AppCenter: () => import('@/views/appCenter/appCenter'),
  // 流程设计器
  processDesign: () => import('/src/views/lowCode/processDesign/index.vue')
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*',
  redirect: '/404',
  hidden: true
}

// 根级菜单
const rootRouter = {
  key: '',
  // 不能是index，防止路由名称重复
  name: 'root',
  path: '/',
  component: 'BasicLayout',
  redirect: '/index',
  meta: {
    title: '首页'
  },
  children: []
}

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = token => {
  return new Promise((resolve, reject) => {
    // 向后端请求路由数据
    getRouters()
      .then(res => {
        const menuNav = []
        rootRouter.children = indexRouterMap.concat(res.data)
        menuNav.push(rootRouter)
        const routers = generator(menuNav)
        routers.push(notFoundRouter)
        resolve(routers)
      })
      .catch(err => {
        reject(err)
      })
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const { show, hideChildren, hiddenHeaderContent, hidden, icon, noCache, home, title } = item.meta || {}
    if (item.component) {
      // Layout ParentView 组件特殊处理
      if (item.component === 'Layout') {
        item.component = 'RouteView'
      } else if (item.component === 'ParentView') {
        // 三级菜单处理
        item.component = 'RouteView'
        item.path = '/' + item.path
      }
    }
    if (item.path) {
      // item.path = '/' + item.path
    }
    if (item.isFrame === 0) {
      item.target = '_blank'
    }
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path || `${(parent && parent.path) || ''}/${item.path}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件(动态加载)
      // component: constantRouterComponents[item.component || item.key] || (() => import(/* @vite-ignore */ `./../views/${item.component}.vue`)),
      component: constantRouterComponents[item.component || item.key] || modules[`../views/${item.component}.vue`],
      hidden: item.hidden,
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        moduleId: item.moduleId,
        moduleName: item.moduleName,
        title: title,
        icon: icon,
        hiddenHeaderContent: hiddenHeaderContent,
        // 目前只能通过判断path的http链接来判断是否外链，适配Seal
        target: validURL(item.path) ? '_blank' : '',
        permission: item.name,
        keepAlive: noCache,
        hidden: hidden,
        home: home
      },
      redirect: item.redirect
    }
    // 是否设置了隐藏菜单
    if (show === false) {
      currentRouter.hidden = true
    }
    // 适配Seal，Seal为缩写路径，而antdv-pro的pro-layout要求每个路径需为全路径
    if (!constantRouterComponents[item.component || item.key]) {
      if (parent && parent.path && parent.path !== '/') {
        currentRouter.path = `${parent && parent.path}/${item.path}`
      }
    }
    // 是否设置了隐藏子菜单
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 是否有子菜单，并递归处理，并将父path传入
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}
