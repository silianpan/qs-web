import request from '/src/utils/axios/request.js'

// 提交申请
export function submitApply(params) {
  return request({
    url: '/project/exec/submitApply',
    method: 'post',
    params
  })
}

// 重新提交
export function submitReApply(data) {
  return request({
    url: '/project/exec/reApply',
    method: 'post',
    data
  })
}

// 查询工程量结算列表
export function listExec(query) {
  return request({
    url: '/project/exec/list/personal',
    method: 'get',
    params: query
  })
}

// 查询工程量结算详细
export function getExec(id) {
  return request({
    url: '/project/exec/' + id,
    method: 'get'
  })
}

// 新增工程量结算
export function addExec(data) {
  return request({
    url: '/project/exec',
    method: 'post',
    data: data
  })
}

// 修改工程量结算
export function updateExec(data) {
  return request({
    url: '/project/exec',
    method: 'put',
    data: data
  })
}

// 删除工程量结算
export function delExec(id) {
  return request({
    url: '/project/exec/' + id,
    method: 'delete'
  })
}

// 删除工程量结算明细
export function delExecDetail(id) {
  return request({
    url: '/project/exec/detail/' + id,
    method: 'delete'
  })
}

// 导出工程量结算
export function exportExec(query) {
  return request({
    url: '/project/exec/export',
    method: 'get',
    params: query
  })
}
