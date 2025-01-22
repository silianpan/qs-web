import storage from 'store'
import { login, getInfo, logout } from '/src/api/user/login.js'
import { registered } from '/src/api/user/registered.js'
import { ACCESS_TOKEN, TENANT_ID } from '/src/store/mutation-types.js'
import { getEnterprise, addEnterprise, toggleEnterprise } from '/src/api/user/enterprise.js'
import { getUserInfo, getAppList } from '/src/api/user/app.js'
import { isEmpty } from '/src/utils/common/util.js'

const user = {
  state: {
    token: '',
    name: '',
    userName: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    sex: '',
    posts: '',
    postGroup: '',
    todoTotal: '',
    userPermission: {},
    tenantAppId: null,
    // 默认企业
    defaultCompany: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_USER_NAME: (state, userName) => {
      state.userName = userName
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_SEX: (state, sex) => {
      state.sex = sex
    },
    SET_POSTS: (state, posts) => {
      state.posts = posts
    },
    SET_POSTSGROUP: (state, postGroup) => {
      state.postGroup = postGroup
    },
    SET_TODOTOTAL: (state, todoTotal) => {
      state.todoTotal = todoTotal
      storage.set('todoTotal', todoTotal)
    },
    SET_USERPERMISSION: (state, userPermission) => {
      state.userPermission = userPermission
    },
    SET_TENANT_APP_ID: (state, tenantAppId) => {
      state.tenantAppId = tenantAppId
      storage.set('TENANT_APP_ID', tenantAppId, 0)
    },
    SET_DEFAULT_COMPANY: (state, defaultCompany) => {
      state.defaultCompany = defaultCompany
      storage.set('DEFAULT_COMPANY', defaultCompany, 0)
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(res => {
            storage.set(ACCESS_TOKEN, res.token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', res.token)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 注册
    _registered({ commit }, params) {
      return new Promise((resolve, reject) => {
        registered(params)
          .then(res => {
            storage.set(ACCESS_TOKEN, res.token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', res.token)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    /* 获取企业 */
    _enterprise({ commit }, params) {
      return new Promise((resolve, reject) => {
        getEnterprise()
          .then(res => {
            if (!isEmpty(res.data)) {
              commit('SET_DEFAULT_COMPANY', res.data[0].name)
            }
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    /* 新增企业 */
    _addEnterprise({ commit }, data) {
      return new Promise((resolve, reject) => {
        addEnterprise(data)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    /* 切换企业 */
    _toggleEnterprise({ commit }, id) {
      return new Promise((resolve, reject) => {
        toggleEnterprise(id)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token)
          .then(res => {
            const user = res.user
            // const avatar = user.avatar === '' ? null : import.meta.env.VITE_APP_BASE_API + user.avatar
            let avatar = null
            if (isEmpty(user.avatar)) {
              avatar = null
            } else {
              if (user.avatar.slice(0, 5) === 'https') {
                avatar = user.avatar
              } else {
                avatar = import.meta.env.VITE_APP_BASE_API + user.avatar
              }
            }
            if (res.roles && res.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              commit('SET_ROLES', res.roles)
            } else {
              commit('SET_ROLES', ['ROLE_DEFAULT'])
            }
            for (let i = 0; i < res.posts.length; i++) {
              if (res.posts[i] === 'ptyg') {
                commit('SET_POSTS', '0')
              } else {
                commit('SET_POSTS', '1')
              }
            }
            commit('SET_PERMISSIONS', res.permissions)
            commit('SET_NAME', user.nickName)
            commit('SET_USER_NAME', user.userName)
            commit('SET_AVATAR', avatar)
            commit('SET_SEX', user.sex)
            storage.set(TENANT_ID, user.tenantId_, 7 * 24 * 60 * 60 * 1000)
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取登录用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then(res => {
            // 处理头像 开始
            const user = res.userInfo
            // const avatar = user.avatar === '' ? null : import.meta.env.VITE_APP_BASE_API + user.avatar
            let avatar = null
            if (user.avatar === null) {
              avatar = null
            } else {
              if (user.avatar.slice(0, 5) === 'https') {
                avatar = user.avatar
              } else {
                avatar = import.meta.env.VITE_APP_BASE_API + user.avatar
              }
            }
            // 处理头像 结束
            commit('SET_USERPERMISSION', res.perms)
            commit('SET_NAME', user.nickName)
            commit('SET_USER_NAME', user.userName)
            commit('SET_AVATAR', avatar)
            commit('SET_SEX', user.sex)
            storage.set(TENANT_ID, user.tenantId_, 7 * 24 * 60 * 60 * 1000)
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            commit('SET_PERMISSIONS', [])
            commit('SET_SEX', '')
            commit('SET_POSTS', '')
            // 清空默认AppID
            commit('SET_TENANT_APP_ID', null)
            storage.remove(ACCESS_TOKEN)
            storage.remove('mima')
            storage.remove('todoTotal')
            // 清空默认AppID
            storage.remove('TENANT_APP_ID')
            storage.remove(TENANT_ID)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
          .finally(() => {})
      })
    },
    // 获取单个App（默认QS应用）
    getTenantAppId({ commit }) {
      getAppList().then(res => {
        if (res.data.apps.length === 1) {
          commit('SET_TENANT_APP_ID', res.data.apps[0].tenantAppId)
        }
      })
    },
    // 获取多个App
    SetAppId({ commit, state }) {
      return new Promise((resolve, reject) => {
        getAppList()
          .then(res => {
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default user
