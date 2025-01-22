import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'
import i18n from './locales/index.js'
import bootstrap from './plugins/global/bootstrap.js'

import './plugins/ui/index.js'
import './plugins/dayjs/index.js'
import './plugins/viewerjs/index.js'
import './plugins/global/index.js'
import './router/permission.js'
import './directive/index.js'
import './assets/style/global.less'

Vue.config.productionTip = false
import qs from 'qs'
Vue.prototype.$qs = qs

new Vue({
  router,
  store,
  i18n,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
