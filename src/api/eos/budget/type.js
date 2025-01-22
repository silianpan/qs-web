import request from '/src/utils/axios/request.js'

// 查询预算类型列表
export function listType(query) {
  return request({
    url: '/project/type/list/select/like',
    method: 'get',
    params: query
  })
}

// 查询预算类型详细
export function getType(id) {
  return request({
    url: '/project/type/' + id,
    method: 'get'
  })
}

// 新增预算类型
export function addType(data) {
  return request({
    url: '/project/type',
    method: 'post',
    data: data
  })
}

// 修改预算类型
export function updateType(data) {
  return request({
    url: '/project/type',
    method: 'put',
    data: data
  })
}

// 删除预算类型
export function delType(id) {
  return request({
    url: '/project/type/' + id,
    method: 'delete'
  })
}

// 导出预算类型
export function exportType(query) {
  return request({
    url: '/project/type/export',
    method: 'get',
    params: query
  })
}

// 根据预算大类获取预算类型
export function TypeGetType(data) {
  return request({
    url: '/project/type/getType/' + data,
    method: 'get'
  })
}

// 查询预算大类
export function BigType(data) {
  return request({
    url: '/project/type/select/budget/type' ,
    method: 'get'
  })
}
