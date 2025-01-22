import request from '/src/utils/axios/request.js'
import { praseStrEmpty } from '/src/utils/common/seal.js'

// 上传文件
export function commonUpload(data) {
  return request({
    url: '/common/upload',
    method: 'post',
    data
  })
}

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}

// 不根据权限查询所有用户列表
export function queryAll(query) {
  return request({
    url: '/system/user/list/queryAll',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/system/user/' + praseStrEmpty(userId),
    method: 'get'
  })
}

// 根据userName查询用户
export function getByUsername(userName) {
  return request({
    url: '/system/user/getByUsername',
    method: 'get',
    params: userName
  })
}
// 新增用户
export function addUser(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}

// 导出用户
export function exportUser(query) {
  return request({
    url: '/system/user/export',
    method: 'get',
    params: query
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/system/user/importTemplate',
    method: 'get'
  })
}

// 导入钉钉数据
export function importdingding() {
  return request({
    url: '/dingDing/auth/insertUsers',
    method: 'get'
  })
}

// 修改成员
export function editUser(data) {
  return request({
    url: '/system/user/edit',
    method: 'put',
    data: data
  })
}

// excel 导入成员
export function excelImport(data) {
  return request({
    url: '/system/user/excel_import',
    method: 'post',
    data: data
  })
}
