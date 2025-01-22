import request from '/src/utils/axios/request.js'

// 查询资金计划收入列表
export function listIncome(query) {
  return request({
    url: '/project/income/list',
    method: 'get',
    params: query
  })
}

// 查询资金计划收入详细
export function getIncome(id) {
  return request({
    url: '/project/income/' + id,
    method: 'get'
  })
}

// 新增资金计划收入
export function addIncome(data) {
  return request({
    url: '/project/income',
    method: 'post',
    data: data
  })
}

// 修改资金计划收入
export function updateIncome(data) {
  return request({
    url: '/project/income',
    method: 'put',
    data: data
  })
}

// 删除资金计划收入
export function delIncome(id) {
  return request({
    url: '/project/income/' + id,
    method: 'delete'
  })
}

// 导出资金计划收入
export function exportIncome(query) {
  return request({
    url: '/project/income/export',
    method: 'get',
    params: query
  })
}
