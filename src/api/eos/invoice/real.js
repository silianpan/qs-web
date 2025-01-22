import request from '/src/utils/axios/request.js'

// 查询实际收款列表
export function listReal(query) {
  return request({
    url: '/project/real/list',
    method: 'get',
    params: query
  })
}

// 根据客商名称查询客商下的银行账户
export function bankList(query) {
  return request({
    url: '/project/merchant/merchant/bank',
    method: 'get',
    params: query
  })
}

// 查询实际收款详细
export function getReal(id) {
  return request({
    url: '/project/real/' + id,
    method: 'get'
  })
}

// 新增实际收款
export function addReal(data) {
  return request({
    url: '/project/real',
    method: 'post',
    data: data
  })
}

// 修改实际收款
export function updateReal(data) {
  return request({
    url: '/project/real',
    method: 'put',
    data: data
  })
}

// 删除实际收款
export function delReal(id) {
  return request({
    url: '/project/real/' + id,
    method: 'delete'
  })
}

// 导出实际收款
export function exportReal(query) {
  return request({
    url: '/project/real/export',
    method: 'get',
    params: query
  })
}

// 关联合同收款记录
export function contractReal(query) {
  return request({
    url: '/project/real/list/paymentReal',
    method: 'get',
    params: query
  })
}

// 钉钉通知
export function dingdingMSG(query) {
  return request({
    url: '/project/real/dingMsg',
    method: 'get',
    params: query
  })
}
