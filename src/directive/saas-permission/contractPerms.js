/**
 * saas通讯录权限
 */
import store from '/src/store/index.js'

const contractPerms = {
  inserted(el, binding, vnode) {
    const perms = store.getters.userPermission
    // 只要组织架构 角色其一可见 通讯录就可见
    if (!perms.has_team_read_perms && !perms.has_role_read_perms) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}

export default contractPerms
