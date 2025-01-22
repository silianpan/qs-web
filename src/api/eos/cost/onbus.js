import request from '/src/utils/axios/request.js'

// 机票申请列表查询
export function listPlaneSimple(query) {
  return request({
    url: '/project/plane/list/simple',
    method: 'get',
    params: query
  })
}

// 查询差旅成本上报明细
export function listOnbusDetail(query) {
  return request({
    url: '/project/onbus/list',
    method: 'get',
    params: query
  })
}

// 查询差旅成本上报列表
export function listOnbus(query) {
  return request({
    url: '/project/cost/list',
    method: 'get',
    params: query
  })
}

// 查询差旅成本上报详细
export function getOnbus(id) {
  return request({
    url: '/project/cost/' + id,
    method: 'get'
  })
}

// 新增差旅成本上报
export function addOnbus(data) {
  return request({
    url: '/project/cost',
    method: 'post',
    data: data
  })
}

// 修改差旅成本上报
export function updateOnbus(data) {
  return request({
    url: '/project/cost',
    method: 'put',
    data: data
  })
}

// 删除差旅成本上报
export function delOnbus(id) {
  return request({
    url: '/project/cost/' + id,
    method: 'delete'
  })
}

// 导出差旅成本上报
export function exportOnbus(orderCode) {
  return request({
    url: '/project/onbus/export/' + orderCode,
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
    url: '/project/cost/reApply',
    method: 'post',
    data
  })
}

/* 删除差旅成本上报明细 */
export function delOnbusDetail(id) {
  return request({
    url: '/project/onbus/' + id,
    method: 'delete'
  })
}
