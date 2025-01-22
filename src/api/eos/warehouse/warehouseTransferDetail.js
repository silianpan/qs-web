import request from '/src/utils/axios/request.js'

// 查询划拨申请明细列表
export function listWarehouseTransferDetail(query) {
  return request({
    url: '/project/warehouseTransferDetail/list',
    method: 'get',
    params: query
  })
}

// 查询划拨申请明细详细
export function getWarehouseTransferDetail(id) {
  return request({
    url: '/project/warehouseTransferDetail/' + id,
    method: 'get'
  })
}

// 新增划拨申请明细
export function addWarehouseTransferDetail(data) {
  return request({
    url: '/project/warehouseTransferDetail',
    method: 'post',
    data: data
  })
}

// 修改划拨申请明细
export function updateWarehouseTransferDetail(data) {
  return request({
    url: '/project/warehouseTransferDetail',
    method: 'put',
    data: data
  })
}

// 删除划拨申请明细
export function delWarehouseTransferDetail(id) {
  return request({
    url: '/project/warehouseTransferDetail/' + id,
    method: 'delete'
  })
}

// 导出划拨申请明细
export function exportWarehouseTransferDetail(query) {
  return request({
    url: '/project/warehouseTransferDetail/export',
    method: 'get',
    params: query
  })
}
