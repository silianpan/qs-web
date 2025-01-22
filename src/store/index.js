import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import createdForm from './modules/created-form'
// default router permission control
// import permission from './modules/permission'
import permission from './modules/async-router'

// dynamic router permission control (Experimental)
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    createdForm
  },
  state: {},
  mutations: {},
  actions: {},
  getters
})
