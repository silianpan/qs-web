// eslint-disable-next-line
import { UserLayout } from '/src/components/layouts/index.js'

/**
 * 首页
 */
export const indexRouterMap = [
  {
    path: '/index',
    name: 'index',
    component: 'Index',
    hidden: true,
    meta: { title: '首页', keepAlive: true, icon: 'iconfont-biaoqiankuozhan_shouye-391' }
  },
  {
    path: '/processDesign',
    name: 'processDesign',
    hidden: true,
    component: 'processDesign',
    meta: { title: '流程设计', keepAlive: true }
  },
  {
    path: '/app/appCenter',
    name: 'appCenter',
    hidden: true,
    component: 'AppCenter',
    meta: { title: '新增应用', keepAlive: true }
  },
  {
    path: '/account/center',
    name: 'center',
    component: 'AccountCenter',
    meta: { title: '个人中心', keepAlive: true },
    hidden: true
  },
  {
    path: '/account/settings',
    name: 'settings',
    component: 'AccountSettings',
    meta: { title: '个人设置', hideHeader: true },
    redirect: '/account/settings/base',
    hidden: true,
    children: [
      {
        path: '/account/settings/base',
        name: 'BaseSettings',
        component: 'BaseSettings',
        hidden: true,
        meta: { title: '基本设置', hidden: true }
      },
      {
        path: '/account/settings/security',
        name: 'SecuritySettings',
        component: 'SecuritySettings',
        meta: { title: '安全设置', hidden: true, keepAlive: true }
      }
    ]
  },
  {
    path: '/monitor/job/log',
    name: 'JobLog',
    component: 'JobLog',
    meta: { title: '调度日志', keepAlive: true },
    hidden: true
  },
  {
    path: '/system/notice/form',
    name: 'NoticeForm',
    component: 'NoticeForm',
    meta: { title: '公告编辑', keepAlive: true },
    hidden: true
  },
  {
    path: '/gen/edit',
    name: 'GenEdit',
    component: 'GenEdit',
    meta: { title: '修改生成配置', keepAlive: true },
    hidden: true
  }
]
/**
  saas
 */
export const saasRouterMap = [
  {
    path: '/saas',
    name: 'saas',
    component: 'Saas',
    hidden: true,
    meta: { title: 'saas', keepAlive: true }
  }
]
/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/sdoc/preview',
    name: 'SDocPreview',
    hidden: true,
    component: () => import('/src/components/Office/DocPreview.vue')
  },
  {
    path: '/user',
    name: 'user-login',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('/src/views/user/Login.vue')
      }
    ]
  },
  {
    path: '/saas',
    name: 'saas',
    hidden: true,
    redirect: '/saasIndex',
    component: () => import('/src/views/enterprise/index.vue'),
    children: [
      {
        path: '/saasIndex',
        name: 'saasIndex',
        hidden: true,
        component: () => import('/src/views/enterprise/saasIndex/index.vue')
      },
      {
        path: '/saas/app/:id',
        name: 'saasApp',
        hidden: true,
        component: () => import('/src/views/lowCode/AppContainer/index.vue')
      },
      {
        path: '/saas/newCreatedForm',
        name: 'newCreatedForm',
        hidden: true,
        component: () => import('/src/views/lowCode/newCreatedForm/index.vue')
      },
      // 表单设计器
      {
        path: '/saas/formDesign/:id/:formid',
        name: 'formDesign',
        hidden: true,
        component: () => import('/src/views/lowCode/formDesignElement/index.vue')
      },
      // 流程表单设计器
      {
        path: '/saas/process/formDesign/:id',
        name: 'processFormDesign',
        hidden: true,
        component: () => import('/src/views/lowCode/processFormDesign/index.vue')
      },
      {
        path: '/preview',
        name: 'preview',
        component: () => import('/src/views/lowCode/previewForm/preview.vue'),
        meta: {
          keepAlive: false
        }
      },
      {
        path: '/jsxPreview',
        name: 'jsxPreview',
        component: () => import('/src/views/lowCode/previewForm/jsxPreview.vue'),
        meta: {
          keepAlive: false
        }
      },
      {
        path: '/saas/todoElement/:id',
        name: 'todoElement',
        hidden: true,
        component: () => import('/src/views/enterprise/todoElement/index.vue')
      }
    ]
  },
  {
    path: '/saas/contacts',
    name: 'Contacts',
    hidden: true,
    component: () => import('/src/views/enterprise/Contacts/index.vue')
  },
  // {
  //   path: '/saas/formBackGround/:tenantAppId',
  //   name: 'FormBackGround',
  //   hidden: true,
  //   component: () => import('/src/views/enterprise/FormBackGround')
  // },
  {
    path: '/404',
    component: () => import('/src/components/exception/404.vue')
  }
]
