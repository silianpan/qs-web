import request from '/src/utils/axios/request.js'

export function listProjectAll(query) {
  return listProject(query)
}

// 查询自己所在的存在项目预算管控的项目
export function myBudgetProjectList(query) {
  return request({
    url: '/project/apply/pass/budget/project',
    method: 'get',
    params: query
  })
}


// 查询项目管理列表所有的项目
export function listProject(query) {
  return request({
    url: '/project/project/list',
    method: 'get',
    params: query
  })
}


// 查询项目管理列表所有的项目
export function listProjectAllAndCildren(query) {
  return request({
    url: '/project/project/list/all',
    method: 'get',
    params: query
  })
}

// 查询自己创建的项目
export function personal(query) {
  return request({
    url: '/project/project/list/personal',
    method: 'get',
    params: query
  })
}
// 查询自己所在的项目
export function listIn(query) {
  return request({
    url: '/project/project/list/in',
    method: 'get',
    params: query
  })
}

// 查询项目列表（我作为项目经理、销售经理、负责人项目列表）
export function listProjectManager(query) {
  return request({
    url: '/project/project/list/manager',
    method: 'get',
    params: query
  })
}

// 查询项目管理详细
export function getProject(id) {
  return request({
    url: '/project/project/' + id,
    method: 'get'
  })
}

// 新增项目管理
export function addProject(data) {
  return request({
    url: '/project/project',
    method: 'post',
    data: data
  })
}

// 修改项目管理
export function updateProject(data) {
  return request({
    url: '/project/project',
    method: 'put',
    data: data
  })
}

// 删除项目管理
export function delProject(id) {
  return request({
    url: '/project/project/' + id,
    method: 'delete'
  })
}

// 添加子项目
export function addChildProject(data) {
  return request({
    url: '/project/project/add/children/project',
    method: 'post',
    data: data
  })
}

// 根据项目id查询子项目
export function getChildProjectById(params) {
  return request({
    url: '/project/project/query/children/project',
    method: 'get',
    params
  })
}

// 导出项目管理
export function exportProject(query) {
  return request({
    url: '/project/project/export',
    method: 'get',
    params: query
  })
}

// 提交申请
export function submitApply(params) {
  return request({
    url: '/project/project/submitApply',
    method: 'post',
    params
  })
}

/**
 * 重新提交申请
 * @param {Object} data 修改保存对象
 * @returns
 */
export function reApply(data) {
  return request({
    url: '/project/project/reApply',
    method: 'post',
    data
  })
}

/**
 * 导出项目申请单
 */
export function exportProjectApply(id, companyName) {
  return request({
    url: '/project/project/exportProject/' + id,
    method: 'get',
    params: { companyName }
  })
}
export function listProjectSimple(query) {
  return personal(query)
}

// 查询树形项目
export function treeSelect(params) {
  return request({
    url: '/project/project/select/tree',
    method: 'get',
    params: params
  })
}

export function listInProjectPersonal(params) {
  return request({
    url: '/project/project/list/in/personal',
    method: 'get',
    params: params
  })
}

// 查询自己的未作计划的项目tree结构
export function treePlanProject() {
  return request({
    url: '/project/project/list/in/personal/tree',
    method: 'get'
  })
}
