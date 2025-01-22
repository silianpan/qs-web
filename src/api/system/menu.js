import request from '/src/utils/axios/request.js'

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: '/system/menu/list',
    method: 'get',
    params: query
  })
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: '/system/menu/' + menuId,
    method: 'get'
  })
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: '/system/menu/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: '/system/menu/roleMenuTreeselect/' + roleId,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/system/menu',
    method: 'post',
    data: data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/system/menu',
    method: 'put',
    data: data
  })
}

// 删除菜单
export function delMenu(menuId) {
  return request({
    url: '/system/menu/' + menuId,
    method: 'delete'
  })
}

// 用户常用菜单API
// 获取用户常用应用(构建菜单之后的)
export function listUserMenus() {
  return request({
    url: '/project/regular/menu/list/build',
    method: 'get'
  })
}

// 添加用户常用菜单
export function addUserMenu(data) {
  return request({
    url: '/project/regular/menu',
    method: 'post',
    data: data
  })
}

// 删除常用应用菜单
export function deleteUserMenu(menuId) {
  return request({
    url: '/project/regular/menu/' + menuId,
    method: 'delete'
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTree(params) {
  return request({
    url: '/app/user/roleMenuTree',
    method: 'get',
    params
  })
}

// 根据部门ID查询菜单下拉树结构
export function deptMenuTree(params) {
  return request({
    url: '/app/user/deptMenuTree',
    method: 'get',
    params
  })
}

// 根据用户ID查询菜单下拉树结构
export function userMenuTree(params) {
  return request({
    url: '/app/user/userMenuTree',
    method: 'get',
    params
  })
}
