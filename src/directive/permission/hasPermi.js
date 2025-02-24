/**
 * 操作权限处理
 * Copyright (c) 2019 Seal-Group
 */
import store from '/src/store/index.js'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const allPermission = '*:*:*'
    const permissions = store.getters && (store.getters.permissions === undefined ? [] : store.getters.permissions)
    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value

      const hasPermissions = permissions.some(permission => {
        return allPermission === permission || permissionFlag.includes(permission)
      })

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  }
}
