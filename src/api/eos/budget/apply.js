import request from '/src/utils/axios/request.js'

// 提交申请
export function submitApply(params) {
  return request({
    url: '/project/apply/submitApply',
    method: 'post',
    params
  })
}

// 新增预算申请单和预算明细
export function addApply(data) {
  return request({
    url: '/project/apply',
    method: 'post',
    data: data
  })
}
// 查询预算申请单列表
export function getList(query) {
  return request({
    url: '/project/apply/list',
    method: 'get',
    params: query
  })
}

// 查询个人指定预算
export function listSelf(query) {
  return request({
    url: '/project/apply/list/personal',
    method: 'get',
    params: query
  })
}

// 查询预算类型
export function budgetType(data) {
  return request({
    url: '/project/apply/budgetType/' + data,
    method: 'get'
  })
}
// 查询项目下的预算申请单以及预算明细
export function budgetPass(data) {
  return request({
    url: '/project/apply/budget/pass',
    method: 'get',
    params: data
  })
}

// 查询部门下的预算申请单以及预算明细
export function budgetPassDept(data) {
  return request({
    url: '/project/apply/budget/pass/dept',
    method: 'get',
    params: data
  })
}

// 预算申请单以及预算明细(预算大类下)
export function budgetPassOne(data) {
  return request({
    url: '/project/apply/budget/pass/one',
    method: 'get',
    params: data
  })
}

// 根据项目id查询执行情况（预算明细的剩余金额以及使用金额）
export function resMoney(projectId) {
  return request({
    url: '/project/apply/resMoney/' + projectId,
    method: 'get'
  })
}

// 删除预算
export function delBudget(id) {
  return request({
    url: '/project/apply/' + id,
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
// 预算修改
export function applyEdit(data) {
  return request({
    url: '/project/apply/edit',
    method: 'put',
    data: data
  })
}

/**
 * 重新提交申请
 * @param {Object} data 修改保存对象
 * @returns
 */
 export function reApply(data) {
  return request({
    url: 'project/apply/reApply',
    method: 'post',
    data
  })
}
