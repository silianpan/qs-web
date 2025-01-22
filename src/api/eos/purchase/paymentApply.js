import request from '/src/utils/axios/request.js'

// 提交申请
export function submitApply(params) {
  return request({
    url: '/project/apply/payment/submitApply',
    method: 'post',
    params
  })
}

// 查询采购申请列表
export function listApply(query) {
  return request({
    url: '/project/apply/payment/list',
    method: 'get',
    params: query
  })
}

// 查询采购申请综合列表
export function listApplyAll(query) {
  return request({
    url: '/project/apply/payment/list/all',
    method: 'get',
    params: query
  })
}

// 查询采购申请详细
export function getApply(id) {
  return request({
    url: '/project/apply/payment/' + id,
    method: 'get'
  })
}

// 新增采购申请
export function addApply(data) {
  return request({
    url: '/project/apply/payment',
    method: 'post',
    data: data
  })
}

// 修改采购申请
export function updateApply(data) {
  return request({
    url: '/project/apply/payment',
    method: 'put',
    data: data
  })
}

// 删除采购申请
export function delApply(id) {
  return request({
    url: '/project/apply/payment/' + id,
    method: 'delete'
  })
}

// 导出采购申请
export function exportApply(query) {
  return request({
    url: '/project/apply/payment/export',
    method: 'get',
    params: query
  })
}

/**
 * 重新提交申请
 * @param {Object} data 修改保存对象
 * @returns
 */
export function reApply(data) {
  return request({
    url: 'project/apply/payment/reApply',
    method: 'post',
    data
  })
}
