import request from '/src/utils/axios/request.js'

/**
 * 根据id更新待办任务已读列表
 * @param {Number} id 业务流程单号
 * @param {String} taskId 任务ID
 * @param {String} read 是否设置已读，1，已读；其他，未读
 * @returns True or False
 */
export function updateReadUsers(id, taskId, read) {
  return request({
    url: `/activiti/workflow/read/${id}/${taskId}/${read}`,
    method: 'get'
  })
}

// 查询业务流程列表
export function listWorkflow(query) {
  return request({
    url: '/activiti/workflow/list',
    method: 'get',
    params: query
  })
}

// 查询业务流程详细
export function getWorkflow(id) {
  return request({
    url: '/activiti/workflow/' + id,
    method: 'get'
  })
}

// 新增业务流程
export function addWorkflow(data) {
  return request({
    url: '/activiti/workflow',
    method: 'post',
    data: data
  })
}

// 修改业务流程
export function updateWorkflow(data) {
  return request({
    url: '/activiti/workflow',
    method: 'put',
    data: data
  })
}

// 删除业务流程
export function delWorkflow(id) {
  return request({
    url: '/activiti/workflow/' + id,
    method: 'delete'
  })
}

// 导出业务流程
export function exportWorkflow(query) {
  return request({
    url: '/activiti/workflow/export',
    method: 'get',
    params: query
  })
}
