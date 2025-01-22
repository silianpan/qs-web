import request from '/src/utils/axios/request.js'

// 提交申请
export function submitApply(params) {
  return request({
    url: '/project/employee/submitApply',
    method: 'post',
    params
  })
}

// 提交申请
export function submitReApply(data) {
  return request({
    url: '/project/employee/reApply',
    method: 'post',
    data
  })
}
// 查询零星用工付款列表
export function listEmployee(query) {
  return request({
    url: 'project/employee/list/personal',
    method: 'get',
    params: query
  })
}

// 查询零星用工付款详细
export function getEmployee(id) {
  return request({
    url: '/project/employee/' + id,
    method: 'get'
  })
}

// 新增零星用工付款
export function addEmployee(data) {
  return request({
    url: '/project/employee',
    method: 'post',
    data: data
  })
}

// 修改零星用工付款
export function updateEmployee(data) {
  return request({
    url: '/project/employee',
    method: 'put',
    data: data
  })
}

// 删除零星用工付款
export function delEmployee(id) {
  return request({
    url: '/project/employee/' + id,
    method: 'delete'
  })
}

// 删除零星用工付款明细
export function delEmployeeDetail(ids) {
  return request({
    url: '/project/employee/detail/' + ids,
    method: 'delete'
  })
}

// 导出零星用工付款
export function exportEmployee(query) {
  return request({
    url: '/project/employee/export',
    method: 'get',
    params: query
  })
}
