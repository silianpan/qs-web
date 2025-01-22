import router from '/src/router/index.js'
import store from '/src/store/index.js'
import storage from 'store'
import NProgress from 'nprogress'
import '/src/assets/style/nprogress.less'
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '/src/utils/common/domUtil'
import { ACCESS_TOKEN } from '/src/store/mutation-types.js'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const allowList = ['login'] // no redirect allowList
const loginRoutePath = '/user/login'
const defaultRoutePath = '/index'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`)
  /* has token */
  if (storage.get(ACCESS_TOKEN)) {
    if (to.path === loginRoutePath || to.path === '/') {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      if (store.getters.userPermission === null || Object.keys(store.getters.userPermission).length === 0) {
        store
          .dispatch('GetUserInfo')
          .then(res => {})
          .catch(() => {
            // 这里注释，不显示登录失败错误
            // notification.error({
            //   message: '错误',
            //   description: '请求登录用户信息失败,请重试'
            // })
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            store.dispatch('Logout').then(() => {
              next({ path: '/' })
            })
          })
      } else {
        next()
      }
      // check login user.roles is null
      if (store.getters.roles.length === 0) {
        // request login userInfo
        store
          .dispatch('GetInfo')
          .then(res => {
            // const roles = res.result && res.result.role
            const roles = res.roles
            // generate dynamic router
            store.dispatch('GenerateRoutes', { roles }).then(() => {
              // 根据roles权限生成可访问的路由表
              try {
                // 低版本的yarn会报错
                if (store.getters.addRouters !== undefined && store.getters.addRouters !== null) {
                  store.getters.addRouters.forEach(item => {
                    router.addRoute(item)
                  })
                }
              } catch (error) {
                // 动态添加可访问路由表
                router.addRoutes(store.getters.addRouters)
              }
              // router.addRoutes(accessRoutes)
              // 请求带有 redirect 重定向时，登录自动重定向到该地址
              next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
              // const redirect = decodeURIComponent(from.query.redirect || to.path)
              // if (to.path === redirect) {
              //   // set the replace: true so the navigation will not leave a history record
              //   next({ ...to, replace: true })
              // } else {
              //   // 跳转到目的路由
              //   next({ path: redirect })
              // }
            })
          })
          .catch(() => {
            notification.error({
              message: '错误',
              description: '请求用户信息失败，请重试'
            })
            // 失败时，获取用户信息失败时，调用登出，来清空历史保留信息
            store.dispatch('Logout').then(() => {
              next({ path: '/' })
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      next()
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
