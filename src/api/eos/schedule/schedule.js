import request from '/src/utils/axios/request.js'

// 查询进度计划列表
export function listSchedule(query) {
  return request({
    url: '/project/schedule/list',
    method: 'get',
    params: query
  })
}

// 查询进度计划详细
export function getSchedule(id) {
  return request({
    url: '/project/schedule/' + id,
    method: 'get'
  })
}

// 新增进度计划
export function addSchedule(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/project/schedule',
    method: 'post',
    data: data
  })
}

// 修改进度计划
export function updateSchedule(data) {
  return request({
    url: '/project/schedule',
    method: 'put',
    data: data
  })
}

// 删除进度计划
export function delSchedule(id) {
  return request({
    url: '/project/schedule/' + id,
    method: 'delete'
  })
}

// 导出进度计划
export function exportSchedule(query) {
  return request({
    url: '/project/schedule/export',
    method: 'get',
    params: query
  })
}

// 查询未作计划的项目
export function planProject() {
  return request({
    url: '/project/schedule/plan/project',
    method: 'get'
  })
}

// 删除阶段
export function deleteScheduleStage(id) {
  return request({
    url: '/project/scheduleStage/' + id,
    method: 'delete'
  })
}
