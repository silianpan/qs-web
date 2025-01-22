import request from '/src/utils/axios/request.js'

// 表单菜单
export function getFormPerms(params) {
  return request({
    url: '/form_perms/find/auth_group',
    method: 'get',
    params
  })
}
