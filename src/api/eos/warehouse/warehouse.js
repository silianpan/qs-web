import request from '/src/utils/axios/request.js'

// 查询库房管理列表
export function listWarehouse(query) {
  return request({
    url: '/project/warehouse/list',
    method: 'get',
    params: query
  })
}

// 不分页查询库房列表
export function queryWarehouse(params) {
  return request({
    url: '/project/warehouse/query',
    method: 'get',
    params: params
  })
}

// 查询库房管理详细
export function getWarehouse(id) {
  return request({
    url: '/project/warehouse/' + id,
    method: 'get'
  })
}

// 新增库房管理
export function addWarehouse(data) {
  return request({
    url: '/project/warehouse',
    method: 'post',
    data: data
  })
}

// 修改库房管理
export function updateWarehouse(data) {
  return request({
    url: '/project/warehouse',
    method: 'put',
    data: data
  })
}

// 删除库房管理
export function delWarehouse(id) {
  return request({
    url: '/project/warehouse/' + id,
    method: 'delete'
  })
}

// 导出库房管理
export function exportWarehouse(query) {
  return request({
    url: '/project/warehouse/export',
    method: 'get',
    params: query
  })
}

// 查询某个项目下的仓库
export function warehouseByProject(params) {
  return request({
    url: '/project/warehouse/list/byProject',
    method: 'get',
    params: params
  })
}

// 查询入了库的项目
export function projectInStore(params) {
  return request({
    url: '/project/warehouse/project/in',
    method: 'get',
    params: params
  })
}

// 查询项目下库存
export function storeByProject(params) {
  return request({
    url: '/project/warehouse/store/list/byProject',
    method: 'get',
    params: params
  })
}

// 查询仓库下库存
export function storeByWarehouse(params) {
  return request({
    url: '/project/warehouse/store/list/byWarehouse',
    method: 'get',
    params: params
  })
}

// 查库存
export function getStore(query) {
  return request({
    url: '/project/warehouse/getStore',
    method: 'get',
    params: query
  })
}
