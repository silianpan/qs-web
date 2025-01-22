import request from '/src/utils/axios/request.js'

// 查询入库申请单明细列表
export function listWarehouseInDetail(query) {
  return request({
    url: '/project/warehouseInDetail/list',
    method: 'get',
    params: query
  })
}

// 查询入库申请单明细详细
export function getWarehouseInDetail(id) {
  return request({
    url: '/project/warehouseInDetail/' + id,
    method: 'get'
  })
}

// 新增入库申请单明细
export function addWarehouseInDetail(data) {
  return request({
    url: '/project/warehouseInDetail',
    method: 'post',
    data: data
  })
}

// 修改入库申请单明细
export function updateWarehouseInDetail(data) {
  return request({
    url: '/project/warehouseInDetail',
    method: 'put',
    data: data
  })
}

// 删除入库申请单明细
export function delWarehouseInDetail(id) {
  return request({
    url: '/project/warehouseInDetail/' + id,
    method: 'delete'
  })
}

// 导出入库申请单明细
export function exportWarehouseInDetail(query) {
  return request({
    url: '/project/warehouseInDetail/export',
    method: 'get',
    params: query
  })
}
