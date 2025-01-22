import request from '/src/utils/axios/request.js'

// 查询工程量结算申请列表
export function listApply(query) {
  return request({
    url: '/project/quantities/list',
    method: 'get',
    params: query
  })
}

// 查询工程量结算申请详细
export function getApply(id) {
  return request({
    url: '/project/quantities/' + id,
    method: 'get'
  })
}

// 新增工程量结算申请
export function addApply(data) {
  return request({
    url: '/project/quantities',
    method: 'post',
    data: data
  })
}

// 修改工程量结算申请
export function updateApply(data) {
  return request({
    url: '/project/quantities',
    method: 'put',
    data: data
  })
}

// 删除工程量结算申请
export function delApply(id) {
  return request({
    url: '/project/quantities/' + id,
    method: 'delete'
  })
}

// 导出工程量结算申请
export function exportApply(query) {
  return request({
    url: '/project/quantities/export',
    method: 'get',
    params: query
  })
}
