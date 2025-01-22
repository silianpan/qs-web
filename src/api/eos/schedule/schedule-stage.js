import request from '/src/utils/axios/request.js'

// 查询进度计划阶段列表
export function listStage(query) {
  return request({
    url: '/project/scheduleStage/list',
    method: 'get',
    params: query
  })
}

// 查询进度计划阶段详细
export function getStage(id) {
  return request({
    url: '/project/scheduleStage/' + id,
    method: 'get'
  })
}

// 新增进度计划阶段
export function addStage(data) {
  return request({
    url: '/project/scheduleStage',
    method: 'post',
    data: data
  })
}

// 修改进度计划阶段
export function updateStage(data) {
  return request({
    url: '/project/scheduleStage',
    method: 'put',
    data: data
  })
}

// 删除进度计划阶段
export function delStage(id) {
  return request({
    url: '/project/scheduleStage/' + id,
    method: 'delete'
  })
}

// 导出进度计划阶段
export function exportStage(query) {
  return request({
    url: '/project/scheduleStage/export',
    method: 'get',
    params: query
  })
}
