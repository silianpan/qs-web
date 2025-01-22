import request from '/src/utils/axios/request.js'

// 提交申请
export function submitApply(params) {
  return request({
    url: '/project/loan/submitApply',
    method: 'post',
    params
  })
}

// 查询借款列表
export function listLoan(query) {
  return request({
    url: '/project/loan/list',
    method: 'get',
    params: query
  })
}
// 借款综合查询（查询所有借款）
export function listLoanAll(query) {
  return request({
    url: '/project/loan/list/all',
    method: 'get',
    params: query
  })
}

// 查询借款详细
export function getLoan(id) {
  return request({
    url: '/project/loan/' + id,
    method: 'get'
  })
}

// 新增借款
export function addLoan(data) {
  return request({
    url: '/project/loan',
    method: 'post',
    data: data
  })
}

// 修改借款
export function updateLoan(data) {
  return request({
    url: '/project/loan',
    method: 'put',
    data: data
  })
}

// 删除借款
export function delLoan(id) {
  return request({
    url: '/project/loan/' + id,
    method: 'delete'
  })
}

// 导出借款
export function exportLoan(query) {
  return request({
    url: '/project/loan/export',
    method: 'get',
    params: query
  })
}
// 查询项目
export function getProject() {
  return request({
    url: '/project/loan/getProject',
    method: 'get'
  })
}
/**
 * 重新提交申请
 * @param {Object} data 修改保存对象
 * @returns
 */
export function reApply(data) {
  return request({
    url: '/project/loan/reApply',
    method: 'post',
    data
  })
}
// 查询剩余金额
export function getUserMoney() {
  return request({
    url: '/project/repay/getUserMoney',
    method: 'get'
  })
}

// 删除借款
export function delLoanDetail(id) {
  return request({
    url: '/project/loan/detail/' + id,
    method: 'delete'
  })
}
