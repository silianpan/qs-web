import request from '/src/utils/axios/request.js'

// 查询招投标管理列表
export function listBid(query) {
  return request({
    url: '/project/bid/list',
    method: 'get',
    params: query
  })
}

// 查询招投标管理详细
export function getBid(id) {
  return request({
    url: '/project/bid/' + id,
    method: 'get'
  })
}

// 新增招投标管理
export function addBid(data) {
  return request({
    url: '/project/bid',
    method: 'post',
    data: data
  })
}

// 修改招投标管理
export function updateBid(data) {
  return request({
    url: '/project/bid',
    method: 'put',
    data: data
  })
}

// 删除招投标管理
export function delBid(id) {
  return request({
    url: '/project/bid/' + id,
    method: 'delete'
  })
}

// 导出招投标管理
export function exportBid(query) {
  return request({
    url: '/project/bid/export',
    method: 'get',
    params: query
  })
}
