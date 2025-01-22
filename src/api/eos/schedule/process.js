import request from '/src/utils/axios/request.js'

// 查询进度执行列表
export function listProcess(query) {
  return request({
    url: '/project/processWrite/list',
    method: 'get',
    params: query
  })
}

// 查询进度执行详细
export function getProcess(id) {
  return request({
    url: '/project/processWrite/' + id,
    method: 'get'
  })
}

// 新增进度执行
export function addProcess(data) {
  return request({
    url: '/project/processWrite',
    method: 'post',
    data: data
  })
}

// 修改进度执行
export function updateProcess(data) {
  return request({
    url: '/project/process',
    method: 'put',
    data: data
  })
}

// 删除详情单号
export function delProcess(id) {
  return request({
    url: '/project/process/' + id,
    method: 'delete'
  })
}

// 删除单号
export function delProcessWrite(id) {
  return request({
    url: '/project/processWrite/' + id,
    method: 'delete'
  })
}

// 导出进度执行
export function exportProcess(query) {
  return request({
    url: '/project/process/export',
    method: 'get',
    params: query
  })
}

// 查询项目
export function processProject() {
  return request({
    url: '/project/process/process/project',
    method: 'get'
  })
}
/* 查询项目阶段 */
export function ProjectScheduleList(query) {
  return request({
    url: '/project/schedule/getProject',
    method: 'get',
    params: query
  })
}
