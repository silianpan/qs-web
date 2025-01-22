/**
 * 向后端请求用户的菜单，动态生成路由
 */
import { generatorDynamicRouter } from '/src/router/generator-routers.js'

const permission = {
  state: {
    routers: [],
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = routers
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        generatorDynamicRouter(data).then(routers => {
          commit('SET_ROUTERS', routers)
          resolve()
        })
      })
    }
  }
}

export default permission
