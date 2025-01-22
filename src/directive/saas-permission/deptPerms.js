/**
 * saas组织架构权限
 */
import store from '/src/store/index.js'

const deptPerms = {
  inserted(el, binding, vnode) {
    const { value } = binding
    const perms = store.getters.userPermission
    const readPerms = perms.has_team_read_perms
    const managePerms = perms.has_team_manage_perms
    if (value === 'read') {
    }
    if (!perms.has_team_read_perms && !perms.has_role_read_perms) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}

export default deptPerms
