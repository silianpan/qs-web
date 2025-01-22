import request from '/src/utils/axios/request.js'

// 提交申请
export function submitApply(params) {
  return request({
    url: '/project/earnestMoney/submitApply',
    method: 'post',
    params
  })
}

// 查询保证金申请列表
export function listApply(query) {
  return request({
    url: '/project/earnestMoney/list',
    method: 'get',
    params: query
  })
}

// 查询保证金申请列表(下拉菜单)
export function listApplySimple(query) {
  return request({
    url: '/project/earnestMoney/simpleList',
    method: 'get',
    params: query
  })
}

// 查询保证金申请详细
export function getApply(id) {
  return request({
    url: '/project/earnestMoney/' + id,
    method: 'get'
  })
}

// 重新提交保证金申请
export function reApply(data) {
  return request({
    url: 'project/earnestMoney/reApply',
    method: 'post',
    data
  })
}

// 新增保证金申请
export function addApply(data) {
  return request({
    url: '/project/earnestMoney',
    method: 'post',
    data: data
  })
}

// 修改保证金申请
export function updateApply(data) {
  return request({
    url: '/project/earnestMoney',
    method: 'put',
    data: data
  })
}

// 删除保证金申请
export function delApply(id) {
  return request({
    url: '/project/earnestMoney/' + id,
    method: 'delete'
  })
}

// 导出保证金申请
export function exportApply(query) {
  return request({
    url: '/project/earnestMoney/export',
    method: 'get',
    params: query
  })
}

// 钉钉通知
export function dingdingMSG(query) {
  return request({
    url: '/project/earnestMoney/dingMsg',
    method: 'get',
    params: query
  })
}
