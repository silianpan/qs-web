import request from '/src/utils/axios/request.js'

// 查询合同收付款阶段列表
export function listStage(query) {
  return request({
    url: '/project/stage/list',
    method: 'get',
    params: query
  })
}

// 查询合同收付款阶段详细
export function getStage(id) {
  return request({
    url: '/project/stage/' + id,
    method: 'get'
  })
}

// 新增合同收付款阶段
export function addStage(data) {
  return request({
    url: '/project/stage',
    method: 'post',
    data: data
  })
}

// 修改合同收付款阶段
export function updateStage(data) {
  return request({
    url: '/project/stage',
    method: 'put',
    data: data
  })
}

// 删除合同收付款阶段
export function delStage(id) {
  return request({
    url: '/project/stage/' + id,
    method: 'delete'
  })
}

// 导出合同收付款阶段
export function exportStage(query) {
  return request({
    url: '/project/stage/export',
    method: 'get',
    params: query
  })
}
