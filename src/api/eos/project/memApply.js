import request from '/src/utils/axios/request.js'

// 项目成员划分提交申请
export function submitApply(params) {
  return request({
    url: '/project/mem/apply/submitApply',
    method: 'post',
    params
  })
}

// 查询项目成员申请单列表
export function listMemApply(query) {
  return request({
    url: '/project/mem/apply/list',
    method: 'get',
    params: query
  })
}

// 查询项目成员申请单详细
export function getMemApply(id) {
  return request({
    url: '/project/mem/apply/' + id,
    method: 'get'
  })
}

// 新增项目成员申请单
export function addMemApply(data) {
  return request({
    url: '/project/mem/apply',
    method: 'post',
    data: data
  })
}

// 修改项目成员申请单
export function updateMemApply(data) {
  return request({
    url: '/project/mem/apply',
    method: 'put',
    data: data
  })
}

// 删除项目成员申请单
export function delMemApply(id) {
  return request({
    url: '/project/mem/apply/' + id,
    method: 'delete'
  })
}

// 导出项目成员申请单
export function exportMemApply(query) {
  return request({
    url: '/project/mem/apply/export',
    method: 'get',
    params: query
  })
}

/**
 * 重新提交申请
 * @param {Object} data 修改保存对象
 * @returns
 */
export function reApply(data) {
  return request({
    url: '/project/mem/apply/reApply',
    method: 'post',
    data
  })
}
