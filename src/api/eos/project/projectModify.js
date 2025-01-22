import request from '/src/utils/axios/request.js'

// 项目变更查询
export function projectModifyList(query) {
  return request({
    url: '/project/project/list/change',
    method: 'get',
    params: query
  })
}
// 查询项目原信息
export function queryProjectDetail(id) {
  return request({
    url: '/project/project/' + id,
    method: 'get'
  })
}

// 提交项目变更
export function submitProject(data) {
  return request({
    url: '/project/project/addChange',
    method: 'post',
    data: data
  })
}

// 申请提交
export function submitApplyProject(id) {
  return request({
    url: '/project/project/submitApply/change/' + id,
    method: 'post'
  })
}
// 删除
export function HanderDelProject(id) {
  return request({
    url: '/project/project/project/change/' + id,
    method: 'delete'
  })
}
