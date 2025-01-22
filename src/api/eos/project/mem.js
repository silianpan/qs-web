import request from '/src/utils/axios/request.js'

// 查询一个项目，审批通过的项目成员列表
export function listMem(query) {
  return request({
    url: '/project/mem/list',
    method: 'get',
    params: query
  })
}

// 导出项目经理任命书
export function exportPM(projectId, companyName) {
  return request({
    url: '/project/mem/exportPM/' + projectId,
    method: 'get',
    params: { companyName }
  })
}

// 查询一个项目，一个申请单，所有的（包括审批未通过的）项目成员列表
export function listMemAll(query) {
  return request({
    url: '/project/mem/list/all',
    method: 'get',
    params: query
  })
}

// 查询一个项目，相应角色的，审批通过的项目成员列表
export function listMemRole(query) {
  return request({
    url: '/project/mem/rolelist',
    method: 'get',
    params: query
  })
}

// 查询项目成员详细
export function getMem(id) {
  return request({
    url: '/project/mem/' + id,
    method: 'get'
  })
}

// 新增项目成员
export function addMem(data) {
  return request({
    url: '/project/mem',
    method: 'post',
    data: data
  })
}

// 删除项目成员
export function delMem(id) {
  return request({
    url: '/project/mem/' + id,
    method: 'delete'
  })
}

// 导出项目成员
export function exportMem(query) {
  return request({
    url: '/project/mem/export',
    method: 'get',
    params: query
  })
}
