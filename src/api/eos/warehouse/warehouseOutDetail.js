import request from '/src/utils/axios/request.js'

// 查询出库申请明细列表
export function listWarehouseOutDetail(query) {
  return request({
    url: '/project/warehouseOutDetail/list',
    method: 'get',
    params: query
  })
}

// 查询出库申请明细详细
export function getWarehouseOutDetail(id) {
  return request({
    url: '/project/warehouseOutDetail/' + id,
    method: 'get'
  })
}

// 新增出库申请明细
export function addWarehouseOutDetail(data) {
  return request({
    url: '/project/warehouseOutDetail',
    method: 'post',
    data: data
  })
}

// 修改出库申请明细
export function updateWarehouseOutDetail(data) {
  return request({
    url: '/project/warehouseOutDetail',
    method: 'put',
    data: data
  })
}

// 删除出库申请明细
export function delWarehouseOutDetail(id) {
  return request({
    url: '/project/warehouseOutDetail/' + id,
    method: 'delete'
  })
}

// 导出出库申请明细
export function exportWarehouseOutDetail(query) {
  return request({
    url: '/project/warehouseOutDetail/export',
    method: 'get',
    params: query
  })
}
