import contractPerms from './contractPerms'
import userPerms from './userPerms'

const install = function (Vue) {
  Vue.directive('contractPerms', contractPerms)
  Vue.directive('userPerms', userPerms)
}

if (window.Vue) {
  window['contractPerms'] = contractPerms
  window['userPerms'] = userPerms
  Vue.use(install) // eslint-disable-line
}

export default install
