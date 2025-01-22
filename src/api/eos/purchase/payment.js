import request from '/src/utils/axios/request.js'

// 提交申请
export function submitApply(params) {
  return request({
    url: '/project/payment/submitApply',
    method: 'post',
    params
  })
}

// 综合查询付款申请列表
export function listPayment(query) {
  return request({
    url: '/project/payment/list',
    method: 'get',
    params: query
  })
}

// 个人付款申请列表
export function listPaymentApply(query) {
  return request({
    url: '/project/payment/list/apply',
    method: 'get',
    params: query
  })
}

// 查询付款申请详细
export function getPayment(id) {
  return request({
    url: '/project/payment/' + id,
    method: 'get'
  })
}

// 新增付款申请
export function addPayment(data) {
  return request({
    url: '/project/payment',
    method: 'post',
    data: data
  })
}

// 修改付款申请
export function updatePayment(data) {
  return request({
    url: '/project/payment',
    method: 'put',
    data: data
  })
}

// 删除付款申请
export function delPayment(id) {
  return request({
    url: '/project/payment/' + id,
    method: 'delete'
  })
}

// 导出付款申请
export function exportPayment(id) {
  return request({
    url: '/project/payment/export/' + id,
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
    url: '/project/payment/reApply',
    method: 'post',
    data
  })
}

// 导出项目下的付款申请
export function exportPaymentExcel(query) {
  return request({
    url: '/project/payment/getPaymentExcel',
    method: 'get',
    params: query
  })
}


// 导出项目下的付款列表
export function exportPaymentListExcel(query) {
  return request({
    url: '/project/payment/getPaymentExcel/list',
    method: 'get',
    params: query
  })
}

// 关联合同付款记录
export function contractPayment(query) {
  return request({
    url: '/project/payment/list/payment',
    method: 'get',
    params: query
  })
}

// 查询未入库的付款申请
export function notStore(params) {
  return request({
    url: '/project/payment/list/notStore',
    method: 'get',
    params: params
  })
}

// 用以查询预算已使用
export function queryUsed(params) {
  return request({
    url: '/project/payment/queryUsed',
    method: 'get',
    params: params
  })
}
