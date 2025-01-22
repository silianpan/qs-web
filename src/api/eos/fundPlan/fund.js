import request from '/src/utils/axios/request.js'

// 查询资金计划列表
export function listFund(query) {
  return request({
    url: '/project/fund/list',
    method: 'get',
    params: query
  })
}

// 查询资金计划详细
export function getFund(id) {
  return request({
    url: '/project/fund/' + id,
    method: 'get'
  })
}

// 新增资金计划
export function addFund(data) {
  return request({
    url: '/project/fund',
    method: 'post',
    data: data
  })
}

// 修改资金计划
export function updateFund(data) {
  return request({
    url: '/project/fund',
    method: 'put',
    data: data
  })
}

// 删除资金计划
export function delFund(id) {
  return request({
    url: '/project/fund/' + id,
    method: 'delete'
  })
}

// 导出资金计划
export function exportFund(query) {
  return request({
    url: '/project/fund/export',
    method: 'get',
    params: query
  })
}

// 支出查询项目
export function fundProjectOut(query) {
  return request({
    url: '/project/fund/project',
    method: 'get',
    params: query
  })
}
// 收入查询项目
export function fundProjectIn(query) {
  return request({
    url: '/project/fund/project',
    method: 'get',
    params: query
  })
}
//  查询合同
export function fundContract(query) {
  return request({
    url: '/project/fund/contract/',
    method: 'get',
    params: query
  })
}

// 资金计划提交审核
export function submitAudit(query) {
  return request({
    url: `/project/fund/submitApply/${query}`,
    method: 'post'
  })
}
// 资金计划审核
export function LaborProject(query) {
  return request({
    url: '/project/fund/approval',
    method: 'get',
    params: query
  })
}
