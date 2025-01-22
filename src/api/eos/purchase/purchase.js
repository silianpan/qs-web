import request from '/src/utils/axios/request.js'

// 提交申请
export function submitApply(params) {
  return request({
    url: '/project/apply/payment/submitApply',
    method: 'post',
    params
  })
}

// 新增采购申请
export function addPurchase(data) {
  return request({
    url: '/project/apply/payment',
    method: 'post',
    data: data
  })
}

// 修改采购申请
export function editPurchase(data) {
  return request({
    url: '/project/apply/payment',
    method: 'put',
    data: data
  })
}

// 采购查询
export function purchaseList(params) {
  return request({
    url: '/project/apply/payment/list',
    methond: 'get',
    params: params
  })
}

// 查详情
export function getDetail(id) {
  return request({
    url: '/project/apply/payment/' + id,
    method: 'get'
  })
}

// 删除申请单
export function delPurchase(ids) {
  return request({
    url: '/project/apply/payment/' + ids,
    method: 'delete'
  })
}

// 删除单挑明细
export function delDetail(ids) {
  return request({
    url: '/project/payment/apply/detail/' + ids,
    method: 'delete'
  })
}

// 综合查询
export function listAll(params) {
  return request({
    url: '/project/apply/payment/list/all',
    method: 'get',
    params: params
  })
}

// 查询没有付款的采购申请
export function notPay(params) {
  return request({
    url: '/project/apply/payment/list/notPay',
    method: 'get',
    params: params
  })
}

export function reApply(data) {
  return request({
    url: '/project/apply/payment/reApply',
    method: 'post',
    data: data
  })
}
