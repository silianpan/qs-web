import request from '/src/utils/axios/request.js'

// 查询App列表
export function getAppList(query) {
  return request({
    url: '/app/user/list',
    method: 'get',
    params: query
  })
}
// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/crm/user/get_user_info',
    method: 'get'
  })
}
// 查询应用商店所有应用
export function getAppSystemList(query) {
  return request({
    url: '/app/system/list',
    method: 'get',
    params: query
  })
}

// 通讯录 部门树
export function getTreeMenu(query) {
  return request({
    url: '/system/dept/admin/tree',
    method: 'get',
    params: query
  })
}
// 全部成员
export function getUserList(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}
// 离职成员
export function getDismissList(params) {
  return request({
    url: '/system/user/dismiss_list',
    method: 'get',
    params
  })
}

// 新增成员
export function addRole(data) {
  return request({
    url: '/system/user/add',
    method: 'post',
    data
  })
}

// 拖拽接口
export function deptsort(params) {
  return request({
    url: '/system/dept/sort',
    method: 'get',
    params
  })
}
// 修改部门名称
export function editDeptName(data) {
  return request({
    url: '/system/dept',
    method: 'put',
    data
  })
}

// 添加子部门
export function addSystemDepchild(data) {
  return request({
    url: '/system/dept',
    method: 'post',
    data
  })
}

// 设置部门主管
export function addDeptPrincipal(params) {
  return request({
    url: '/system/dept/add/principal',
    method: 'get',
    params
  })
}

// 查询当前部门成员
export function queryUserList(params) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params
  })
}

// 调整部门成员
export function adjustDeptUser(params) {
  return request({
    url: '/system/dept/addUser',
    method: 'get',
    params
  })
}

// 删除成员
export function addUserDismiss(params) {
  return request({
    url: '/system/user/dismiss',
    method: 'get',
    params
  })
}
// 根据权限查询角色
export function getRoleByAdmin() {
  return request({
    url: '/system/role/admin/list',
    method: 'get'
  })
}
// 查询角色组
export function getRoleListClass(params) {
  return request({
    url: '/system/role_group/group_list',
    method: 'get',
    params
  })
}

// 查询角色下有那些成员
export function getRoleMemberList(params) {
  return request({
    url: '/system/role/list_member',
    method: 'get',
    params
  })
}

// 角色添加成员
export function addRoleinMember(data) {
  return request({
    url: '/system/role/add_member',
    method: 'post',
    data
  })
}
// 角色删除成员
export function deleteRoleinMember(data) {
  return request({
    url: '/system/role/remove_member',
    method: 'delete',
    data
  })
}

// 角色组新增/修改
export function updateRoleGroup(data) {
  return request({
    url: '/system/role_group/group_update',
    method: 'post',
    data
  })
}

// 角色修改
export function updateRole(data) {
  return request({
    url: '/system/role/update',
    method: 'post',
    data
  })
}

// 角色新增
export function insertRole(data) {
  return request({
    url: '/system/role/insert',
    method: 'post',
    data
  })
}

// 成员导入
export function roleImport(data) {
  return request({
    url: '/system/user/excel_import',
    method: 'post',
    data
  })
}

//  查询管理组
export function queryAdminGroup() {
  return request({
    url: '/system/admin/query/adminGroup',
    method: 'get'
  })
}
// 查询系统管理员
export function queryStstemAdmin() {
  return request({
    url: '/system/admin/query/admin',
    method: 'get'
  })
}

// 查询普通管组详情
export function queryNormalAdminDetail(params) {
  return request({
    url: '/system/admin/adminGroup/' + params.groupId,
    method: 'get'
  })
}

// 添加管理组
export function addAdminGroup(data) {
  return request({
    url: '/system/admin/addGroup',
    method: 'post',
    data
  })
}

// 添加系统管理员
export function addAdminStstemGroup(data) {
  return request({
    url: '/system/admin/addAdmin',
    method: 'post',
    data
  })
}

// 管理组更新权限
export function adminUpdatePre(data) {
  return request({
    url: '/system/admin/update',
    method: 'post',
    data
  })
}

// 创建空白应用
export function createdNewApp(data) {
  return request({
    url: '/app/user/self/app',
    method: 'post',
    data
  })
}

// 用户修改应用
export function updateApp(data) {
  return request({
    url: '/app/user/update',
    method: 'put',
    data
  })
}

// 用户删除应用
export function deleteAppItem(params) {
  return request({
    url: '/app/user/delete/' + params,
    method: 'delete'
  })
}

// 管理组修改
export function editGroupName(data) {
  return request({
    url: '/system/admin/edit',
    method: 'post',
    data
  })
}
// 管理组删除
export function adminGroupDelete(params) {
  return request({
    url: '/system/admin/remove/' + params,
    method: 'delete'
  })
}

// 根据应用id查询表单
export function queryAppByTenantAppId(tenantAppId) {
  return request({
    url: '/app/user/module/' + tenantAppId,
    method: 'get'
  })
}

// 添加模块权限
export function addMenuPerm(data) {
  return request({
    url: '/app/user/addModule',
    method: 'post',
    data
  })
}
