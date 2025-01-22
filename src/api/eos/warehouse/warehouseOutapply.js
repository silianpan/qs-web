import request from '/src/utils/axios/request.js'


// 重新提交
export function reApply(data) {
  return request({
    url: '/project/warehouseOutapply/reApply',
    method: 'post',
    data: data
  })
}

// 提交申请
export function submitApply(params) {
  return request({
    url: '/project/warehouseOutapply/submitApply',
    method: 'post',
    params
  })
}

// 查询出库申请单列表
export function listWarehouseOutapply(query) {
  return request({
    url: '/project/warehouseOutapply/list',
    method: 'get',
    params: query
  })
}

// 查询出库申请单详细
export function getWarehouseOutapply(id) {
  return request({
    url: '/project/warehouseOutapply/' + id,
    method: 'get'
  })
}

// 新增出库申请单
export function addWarehouseOutapply(data) {
  return request({
    url: '/project/warehouseOutapply',
    method: 'post',
    data: data
  })
}

// 修改出库申请单
export function updateWarehouseOutapply(data) {
  return request({
    url: '/project/warehouseOutapply',
    method: 'put',
    data: data
  })
}

// 删除出库申请单
export function delWarehouseOutapply(id) {
  return request({
    url: '/project/warehouseOutapply/' + id,
    method: 'delete'
  })
}

// 导出出库申请单
export function exportWarehouseOutapply(query) {
  return request({
    url: '/project/warehouseOutapply/export',
    method: 'get',
    params: query
  })
}

// 条件查询出库明细
export function queryOutDetail(query) {
  return request({
    url: '/project/warehouseOutapply/detail/list',
    method: 'get',
    params: query
  })
}
