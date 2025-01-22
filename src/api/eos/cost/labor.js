import request from '/src/utils/axios/request.js'

// 查询人工成本上报明细
export function listLaborDetail(query) {
  return request({
    url: '/project/labor/list',
    method: 'get',
    params: query
  })
}

// 查询人工成本上报列表
export function listLabor(query) {
  return request({
    url: '/project/cost/list',
    method: 'get',
    params: query
  })
}

// 查询人工成本上报详细
export function getLabor(id) {
  return request({
    url: '/project/cost/' + id,
    method: 'get'
  })
}

// 新增人工成本上报
export function addLabor(data) {
  return request({
    url: '/project/cost',
    method: 'post',
    data: data
  })
}

// 修改人工成本上报
export function updateLabor(data) {
  return request({
    url: '/project/cost',
    method: 'put',
    data: data
  })
}

// 删除人工成本上报
export function delLabor(id) {
  return request({
    url: '/project/cost/' + id,
    method: 'delete'
  })
}

// 导出人工成本上报
export function exportLabor(orderCode) {
  return request({
    url: '/project/labor/export/' + orderCode,
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

/* 删除人工成本上报明细 */
export function delOnbusDetail(id) {
  return request({
    url: '/project/labor/' + id,
    method: 'delete'
  })
}

// 项目人工成本上报费用
export function projectLabor(query) {
  return request({
    url: '/project/labor/project/labor',
    method: 'get',
    params: query
  })
}
