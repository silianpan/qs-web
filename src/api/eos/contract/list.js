import request from '/src/utils/axios/request.js'

// 查询工程量，采购清单列表
export function listList(query) {
  return request({
    url: '/project/list/list',
    method: 'get',
    params: query
  })
}

// 查询工程量，采购清单详细
export function getList(id) {
  return request({
    url: '/project/list/' + id,
    method: 'get'
  })
}

// 新增工程量，采购清单
export function addList(data) {
  return request({
    url: '/project/list',
    method: 'post',
    data: data
  })
}

// 修改工程量，采购清单
export function updateList(data) {
  return request({
    url: '/project/list',
    method: 'put',
    data: data
  })
}

// 删除工程量，采购清单
export function delList(id) {
  return request({
    url: '/project/list/' + id,
    method: 'delete'
  })
}

// 导出工程量，采购清单
export function exportList(query) {
  return request({
    url: '/project/list/export',
    method: 'get',
    params: query
  })
}

// 查询合同的清单
export function getAmountListByContract(query) {
  return request({
    url: '/project/list/list/contract',
    method: 'get',
    params: query
  })
}
