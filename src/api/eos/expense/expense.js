import request from '/src/utils/axios/request.js'

// 提交申请
export function submitApply(params) {
  return request({
    url: '/project/expense/submitApply',
    method: 'post',
    params
  })
}

// 查询报销明细列表
export function listExpenseDetail(query) {
  return request({
    url: '/project/detail/list',
    method: 'get',
    params: query
  })
}

// 查询报销申请单列表
export function listExpense(query) {
  return request({
    // baseURL: import.meta.env.VITE_APP_RAP2_API,
    url: '/project/expense/list',
    method: 'get',
    params: query
  })
}

// 查询报销申请单详细
export function getExpense(id) {
  return request({
    url: '/project/expense/' + id,
    method: 'get'
  })
}

// 新增报销申请单
export function addExpense(data) {
  return request({
    url: '/project/expense',
    method: 'post',
    data: data
  })
}

// 修改报销申请单
export function updateExpense(data) {
  return request({
    url: '/project/expense',
    method: 'put',
    data: data
  })
}

// 删除报销申请单
export function delExpense(id) {
  return request({
    url: '/project/expense/' + id,
    method: 'delete'
  })
}

// 导出报销申请单
export function exportExpense(query) {
  return request({
    url: '/project/expense/export',
    method: 'get',
    params: query
  })
}
// 查询费用类型
export function getResidueMoney(data) {
  return request({
    url: '/project/type/list/select/like',
    method: 'get',
    params: data
  })
}
// 查询预算大类
export function budgetType(data) {
  return request({
    url: '/project/expense/type/' + data,
    method: 'get'
  })
}
// 查询项目
export function listProjectSimple(data) {
  return request({
    url: '/project/expense/getProject',
    method: 'get'
  })
}
// 发票和明细
export function getExpenseList(data) {
  return request({
    url: 'project/expense/list/getExpense/' + data,
    method: 'get'
  })
}
// 删除明细
export function deletDetail(data) {
  return request({
    url: '/project/detail/' + data,
    method: 'delete'
  })
}
// 删除发票
export function deleteInvoice(data) {
  return request({
    url: '/project/invoice/' + data,
    method: 'delete'
  })
}
/**
 * 重新提交申请
 * @param {Object} data 修改保存对象
 * @returns
 */
export function reApply(data) {
  return request({
    url: 'project/expense/reApply',
    method: 'post',
    data
  })
}
// 导出发票管理
export function exportInvoice(query) {
  return request({
    url: `/project/invoice/download/zip/${query}`,
    method: 'get'
  })
}

// 导出报销明细
export function exportDetail(query) {
  return request({
    url: '/project/detail/export',
    method: 'get',
    params: query
  })
}

// 根据code查询详情
export function expensegetOne(query) {
  return request({
    url: '/project/expense/getOne',
    method: 'get',
    params: query
  })
}

// /**
//  *
//  *
//  * @export
//  * @param {number} query 发票号码
//  * @return {*}
//  */
// export function invoiceCheck(query) {
//   return request({
//     url: '/project/invoice/check',
//     params: query
//   })
// }

// 查询报销申请单列表
export function listExpensePersonal(query) {
  return request({
    url: '/project/expense/list/personal',
    method: 'get',
    params: query
  })
}