import request from '/src/utils/axios/request.js'

// 查询个人开票历史列表
export function getHistory(params) {
  return request({
    url: 'project/make/list/personal',
    method: 'get',
    params: params
  })
}
// 导出开票管理
export function exportMake(id) {
  return request({
    url: '/project/make/export/' + id,
    method: 'get'
  })
}
