import request from '/src/utils/axios/request.js'

// 重新提交
export function reApply(data) {
  return request({
    url: '/project/warehouseInApply/reApply',
    method: 'post',
    data: data
  })
}


// 提交申请
export function submitApply(params) {
  return request({
    url: '/project/warehouseInApply/submitApply',
    method: 'post',
    params
  })
}

// 查询入库申请单列表
export function listWarehouseInApply(query) {
  return request({
    url: '/project/warehouseInApply/list',
    method: 'get',
    params: query
  })
}

// 查询入库申请单详细
export function getWarehouseInApply(id) {
  return request({
    url: '/project/warehouseInApply/' + id,
    method: 'get'
  })
}

// 新增入库申请单
export function addWarehouseInApply(data) {
  return request({
    url: '/project/warehouseInApply',
    method: 'post',
    data: data
  })
}

// 修改入库申请单
export function updateWarehouseInApply(data) {
  return request({
    url: '/project/warehouseInApply',
    method: 'put',
    data: data
  })
}

// 删除入库申请单
export function delWarehouseInApply(id) {
  return request({
    url: '/project/warehouseInApply/' + id,
    method: 'delete'
  })
}

// 导出入库申请单
export function exportWarehouseInApply(query) {
  return request({
    url: '/project/warehouseInApply/export',
    method: 'get',
    params: query
  })
}

// 根据项目id&仓库id查询入库
export function getByProjectAndWarehouse(query) {
  return request({
    url: '/project/warehouseInApply/list/byProject/byWarehouse',
    method: 'get',
    params: query
  })
}

// 根据项目id是不是null查询入库明细
export function getByProject(params) {
  return request({
    url: '/project/warehouseInApply/list/byProject',
    method: 'get',
    params: params
  })
}

// 条件查询出库明细
export function queryInDetail(query) {
  return request({
    url: '/project/warehouseInApply/detail/list',
    method: 'get',
    params: query
  })
}
