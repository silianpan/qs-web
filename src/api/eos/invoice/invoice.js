import request from '/src/utils/axios/request.js'

// 查询发票管理列表
export function listInvoice(query) {
  return request({
    url: '/project/invoice/list',
    method: 'get',
    params: query
  })
}

// 查询发票管理详细
export function getInvoice(id) {
  return request({
    url: '/project/invoice/' + id,
    method: 'get'
  })
}

// 新增发票管理
export function addInvoice(data) {
  return request({
    url: '/project/invoice',
    method: 'post',
    data: data
  })
}

// 修改发票管理
export function updateInvoice(data) {
  return request({
    url: '/project/invoice',
    method: 'put',
    data: data
  })
}

// 删除发票管理
export function delInvoice(id) {
  return request({
    url: '/project/invoice/' + id,
    method: 'delete'
  })
}

// 导出发票管理
export function exportInvoice(query) {
  return request({
    url: '/project/invoice/export',
    method: 'get',
    params: query
  })
}
