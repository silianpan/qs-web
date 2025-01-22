import request from '/src/utils/axios/request.js'

// 查询变更历史列表
export function listHistory(query) {
  return request({
    url: '/project/apply/change/history',
    method: 'get',
    params: query
  })
}

// 查询变更历史详细
export function getHistory(id) {
  return request({
    url: '/project/history/' + id,
    method: 'get'
  })
}

// 新增变更历史
export function addHistory(data) {
  return request({
    url: '/project/history',
    method: 'post',
    data: data
  })
}

// 修改变更历史
export function updateHistory(data) {
  return request({
    url: '/project/history',
    method: 'put',
    data: data
  })
}

// 删除变更历史
export function delHistory(id) {
  return request({
    url: '/project/history/' + id,
    method: 'delete'
  })
}

// 导出变更历史
export function exportHistory(query) {
  return request({
    url: '/project/history/export',
    method: 'get',
    params: query
  })
}
