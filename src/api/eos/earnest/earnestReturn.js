import request from '/src/utils/axios/request.js'

// 查询保证金退还列表
export function listReturn(query) {
  return request({
    url: '/project/earnestReturn/list',
    method: 'get',
    params: query
  })
}

// 查询保证金退还详细
export function getReturn(id) {
  return request({
    url: '/project/earnestReturn/' + id,
    method: 'get'
  })
}

// 新增保证金退还
export function addReturn(data) {
  return request({
    url: '/project/earnestReturn',
    method: 'post',
    data: data
  })
}

// 修改保证金退还
export function updateReturn(data) {
  return request({
    url: '/project/earnestReturn/',
    method: 'put',
    data: data
  })
}

// 删除保证金退还
export function delReturn(id) {
  return request({
    url: '/project/earnestReturn/' + id,
    method: 'delete'
  })
}

// 导出保证金退还
export function exportReturn(query) {
  return request({
    url: '/project/earnestReturn/export',
    method: 'get',
    params: query
  })
}
