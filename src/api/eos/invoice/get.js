import request from '/src/utils/axios/request.js'

// 查询收票管理列表
export function listGet(query) {
  return request({
    url: '/project/get/list',
    method: 'get',
    params: query
  })
}

// 查询收票管理详细
export function getGet(id) {
  return request({
    url: '/project/get/' + id,
    method: 'get'
  })
}

// 新增收票管理
export function addGet(data) {
  return request({
    url: '/project/get',
    method: 'post',
    data: data
  })
}

// 修改收票管理
export function updateGet(data) {
  return request({
    url: '/project/get',
    method: 'put',
    data: data
  })
}

// 删除收票管理
export function delGet(id) {
  return request({
    url: '/project/get/' + id,
    method: 'delete'
  })
}

// 导出收票管理
export function exportGet(query) {
  return request({
    url: '/project/get/export',
    method: 'get',
    params: query
  })
}
