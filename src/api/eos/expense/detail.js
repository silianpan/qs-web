import request from '/src/utils/axios/request.js'

// 查询报销明细列表
export function listDetail(query) {
  return request({
    url: '/project/detail/list',
    method: 'get',
    params: query
  })
}

// 查询报销明细详细
export function getDetail(id) {
  return request({
    url: '/project/detail/' + id,
    method: 'get'
  })
}

// 新增报销明细
export function addDetail(data) {
  return request({
    url: '/project/detail',
    method: 'post',
    data: data
  })
}

// 修改报销明细
export function updateDetail(data) {
  return request({
    url: '/project/detail',
    method: 'put',
    data: data
  })
}

// 删除报销明细
export function delDetail(id) {
  return request({
    url: '/project/detail/' + id,
    method: 'delete'
  })
}

// 导出报销明细
export function exportDetail(query) {
  return request({
    url: '/project/detail/export',
    method: 'get',
    params: query
  })
}

// 导出项目下报销明细
export function exportProjectDetail(query) {
  return request({
    url: '/project/detail/getProjectExcel',
    method: 'get',
    params: query
  })
}
