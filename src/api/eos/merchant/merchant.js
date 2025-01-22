import request from '/src/utils/axios/request.js'

// 查询客商管理列表
export function listMerchant(query) {
  return request({
    url: '/project/merchant/list',
    method: 'get',
    params: { ...query, isAsc: 'desc', orderByColumn: 'createTime' }
  })
}

// 查询客商管理详细
export function getMerchant(id) {
  return request({
    url: '/project/merchant/' + id,
    method: 'get'
  })
}

// 新增客商管理
export function addMerchant(data) {
  return request({
    url: '/project/merchant',
    method: 'post',
    data: data
  })
}

// 修改客商管理
export function updateMerchant(data) {
  return request({
    url: '/project/merchant',
    method: 'put',
    data: data
  })
}

// 删除客商管理
export function delMerchant(id) {
  return request({
    url: '/project/merchant/' + id,
    method: 'delete'
  })
}

// 导出客商管理
export function exportMerchant(query) {
  return request({
    url: '/project/merchant/export',
    method: 'get',
    params: query
  })
}

// 删除客商联系人
export function deleteMerchatUser(id) {
  return request({
    url: '/project/merchant/user/' + id,
    method: 'delete'
  })
}

// 删除客商银行账户
export function deleteMerchatAccount(id) {
  return request({
    url: '/project/merchant/account/' + id,
    method: 'delete'
  })
}

// 根据account获取客商账户信息
export function getMerchanAccountInfo(params) {
  return request({
    url: '/project/merchant/account/query',
    method: 'get',
    params: params
  })
}
