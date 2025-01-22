import request from '/src/utils/axios/request.js'

// 查询资金计划支出列表
export function listOutcome(query) {
  return request({
    url: '/project/outcome/list',
    method: 'get',
    params: query
  })
}

// 查询资金计划支出详细
export function getOutcome(id) {
  return request({
    url: '/project/outcome/' + id,
    method: 'get'
  })
}

// 新增资金计划支出
export function addOutcome(data) {
  return request({
    url: '/project/outcome',
    method: 'post',
    data: data
  })
}

// 修改资金计划支出
export function updateOutcome(data) {
  return request({
    url: '/project/outcome',
    method: 'put',
    data: data
  })
}

// 删除资金计划支出
export function delOutcome(id) {
  return request({
    url: '/project/outcome/' + id,
    method: 'delete'
  })
}

// 导出资金计划支出
export function exportOutcome(query) {
  return request({
    url: '/project/outcome/export',
    method: 'get',
    params: query
  })
}
