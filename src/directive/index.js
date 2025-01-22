import Vue from 'vue'

import permission from './permission/index.js'
import hasUserPerms from './saas-permission/index.js'

Vue.use(permission)
Vue.use(hasUserPerms)
