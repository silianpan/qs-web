/**
 * saas用户权限
 */
import store from '/src/store/index.js'

const userPerms = {
  inserted(el, binding, vnode) {
    const { bindingPerms } = binding.value
    const perms = store.getters.userPermission
    const isAdmin = perms.is_admin
    const isOwner = perms.is_owner
    const teamReadPerms = perms.has_team_read_perms
    const teamMangePerms = perms.has_team_manage_perms
    const roleReadPerms = perms.has_role_read_perms
    const roleManagePerms = perms.has_role_manage_perms
    // 存在才可设置
    if (bindingPerms && typeof String && bindingPerms.length > 0) {
      switch (bindingPerms) {
        case 'contract':
          if (!teamReadPerms && !roleReadPerms) el.parentNode && el.parentNode.removeChild(el)
          break
        case 'deptRead':
          if (!teamReadPerms) el.parentNode && el.parentNode.removeChild(el)
          break
        case 'deptManage':
          if (!teamMangePerms) el.parentNode && el.parentNode.removeChild(el)
          break
        case 'roleRead':
          if (!roleReadPerms) el.parentNode && el.parentNode.removeChild(el)
          break
        case 'roleManage':
          if (!roleManagePerms) el.parentNode && el.parentNode.removeChild(el)
          break
        case 'admin':
          if (!isAdmin && !isOwner) el.parentNode && el.parentNode.removeChild(el)
          break
        default:
          throw new Error(`请设置操作权限标签值`)
      }

      //   // 在通讯录 部门 角色 管理员上使用
      //   if (bindingPerms === 'contract') {
      //     // 只要组织架构 角色其一可见 通讯录就可见
      //     if (!teamReadPerms && !roleReadPerms) {
      //       el.parentNode && el.parentNode.removeChild(el)
      //     }
      //   } else if (bindingPerms === 'deptRead') {
      //     if (teamReadPerms) {
      //       el.parentNode && el.parentNode.removeChild(el)
      //     }
      //   } else if (bindingPerms === 'role') {
      //   } else if (bindingPerms === 'admin') {
      //   }
      // } else {
      //   throw new Error(`请设置操作权限标签值`)
    }
  }
}

export default userPerms
