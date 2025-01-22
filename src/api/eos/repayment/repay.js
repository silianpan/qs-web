import request from '/src/utils/axios/request.js'

// 查询还款列表
export function listRepay(query) {
  return request({
    url: '/project/repay/list',
    method: 'get',
    params: query
  })
}

// 查询还款详细
export function getRepay(id) {
  return request({
    url: '/project/repay/' + id,
    method: 'get'
  })
}

// 新增还款
export function addRepay(data) {
  return request({
    url: '/project/repay',
    method: 'post',
    data: data
  })
}

// 修改还款
export function updateRepay(data) {
  return request({
    url: '/project/repay',
    method: 'put',
    data: data
  })
}

// 删除还款
export function delRepay(id) {
  return request({
    url: '/project/repay/' + id,
    method: 'delete'
  })
}

// 导出还款
export function exportRepay(query) {
  return request({
    url: '/project/repay/export',
    method: 'get',
    params: query
  })
}
// 查询剩余金额
export function getUserMoney() {
  return request({
    url: '/project/repay/getUserMoney',
    method: 'get'
  })
}
