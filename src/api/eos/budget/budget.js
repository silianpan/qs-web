import request from '/src/utils/axios/request.js'

// 查询预算列表
export function listBudget(query) {
  return request({
    url: '/project/budget/list',
    method: 'get',
    params: query
  })
}

// 查询预算详细
export function getBudget(id) {
  return request({
    url: '/project/budget/' + id,
    method: 'get'
  })
}

// 新增预算
export function addBudget(data) {
  return request({
    url: '/project/budget',
    method: 'post',
    data: data
  })
}

// 修改预算
export function updateBudget(data) {
  return request({
    url: '/project/budget',
    method: 'put',
    data: data
  })
}

// 删除预算
export function delBudget(id) {
  return request({
    url: '/project/budget/' + id,
    method: 'delete'
  })
}

// 导出预算
export function exportBudget(query) {
  return request({
    url: '/project/budget/export',
    method: 'get',
    params: query
  })
}
// 查询申请单详情
export function getOneApply(id) {
  return request({
    url: '/project/apply/' + id,
    method: 'get'
  })
}
// 查询预算项目
export function getProjectList() {
  return request({
    url: '/project/apply/budget/getProject/',
    method: 'get'
  })
}

// 项目的预算总金额查询
export function getProjectMoney(id) {
  return request({
    url: '/project/apply/budget/project/money/' + id,
    method: 'get'
  })
}

// 查询个人所在部门的预算
export function personalDeptBudget() {
  return request({
    url: '/project/apply/list/personal/dept',
    method: 'get'
  })
}

// 查询所有部门的预算
export function allDeptBudget(query) {
  return request({
    url: '/project/apply/list/personal/dept/all',
    method: 'get',
    params: query
  })
}
