import request from '/src/utils/axios/request.js'


// 重新提交
export function reApply(data) {
  return request({
    url: '/project/warehouseTransferApply/reApply',
    method: 'post',
    data: data
  })
}

// 提交申请
export function submitApply(params) {
  return request({
    url: '/project/warehouseTransferApply/submitApply',
    method: 'post',
    params
  })
}

// 查询划拨申请单(只能项目划项目)列表
export function listWarehouseTransferApply(query) {
  return request({
    url: '/project/warehouseTransferApply/list',
    method: 'get',
    params: query
  })
}

// 查询划拨申请单(只能项目划项目)详细
export function getWarehouseTransferApply(id) {
  return request({
    url: '/project/warehouseTransferApply/' + id,
    method: 'get'
  })
}

// 新增划拨申请单(只能项目划项目)
export function addWarehouseTransferApply(data) {
  return request({
    url: '/project/warehouseTransferApply',
    method: 'post',
    data: data
  })
}

// 修改划拨申请单(只能项目划项目)
export function updateWarehouseTransferApply(data) {
  return request({
    url: '/project/warehouseTransferApply',
    method: 'put',
    data: data
  })
}

// 删除划拨申请单(只能项目划项目)
export function delWarehouseTransferApply(id) {
  return request({
    url: '/project/warehouseTransferApply/' + id,
    method: 'delete'
  })
}

// 导出划拨申请单(只能项目划项目)
export function exportWarehouseTransferApply(query) {
  return request({
    url: '/project/warehouseTransferApply/export',
    method: 'get',
    params: query
  })
}

// 条件查询划入明细
export function queryTransInDetail(query) {
  return request({
    url: '/project/warehouseTransferApply/detail/in',
    method: 'get',
    params: query
  })
}

// 条件查询划出明细
export function queryTransOutDetail(query) {
  return request({
    url: '/project/warehouseTransferApply/detail/out',
    method: 'get',
    params: query
  })
}
