import request from '/src/utils/axios/request.js'

// 提交申请
export function submitApply(params) {
  return request({
    url: '/project/contract/submitApply',
    method: 'post',
    params
  })
}

// 查询自己创建的合同
export function listContractPersonal(query) {
  return request({
    url: '/project/contract/list/personal',
    method: 'get',
    params: query
  })
}

// 合同综合查询
export function listContract(query) {
  return request({
    url: '/project/contract/list',
    method: 'get',
    params: query
  })
}

// 查询我的合同审批列表
export function listContractApply(query) {
  return request({
    url: '/project/contract/list/apply',
    method: 'get',
    params: query
  })
}

// 根据id查询合同管理详细，包括阶段数据
export function getContract(id) {
  return request({
    url: '/project/contract/' + id,
    method: 'get'
  })
}

// 新增合同管理
export function addContract(data) {
  return request({
    url: '/project/contract',
    method: 'post',
    data: data
  })
}

// 修改合同管理
export function updateContract(data) {
  return request({
    url: '/project/contract',
    method: 'put',
    data: data
  })
}

// 删除合同管理
export function delContract(id) {
  return request({
    url: '/project/contract/' + id,
    method: 'delete'
  })
}
// 删除合同上的材料清单明细
export function delContractDetailList(id) {
  return request({
    url: '/project/list/' + id,
    method: 'delete'
  })
}

// 导出合同管理
export function exportContract(query) {
  return request({
    url: '/project/contract/export',
    method: 'get',
    params: query
  })
}

// 根据项目ID和合同类型查询合同列表
export function listByProject(query) {
  return request({
    url: '/project/contract/list/by/project',
    method: 'get',
    params: query
  })
}

// 根据项目ID查询合同列表
export function listByProjectIdOnly(query) {
  return request({
    url: '/project/contract/list/only',
    method: 'get',
    params: query
  })
}

/**
 * 重新提交申请
 * @param {Object} data 修改保存对象
 * @returns
 */
export function reApply(data) {
  return request({
    url: '/project/contract/reApply',
    method: 'post',
    data
  })
}

/*
 * 条件查询合同 用于选择
 */
export function queryContract(params) {
  return request({
    url: '/project/contract/list/qc',
    method: 'get',
    params
  })
}

export function listInContractPersonal(params) {
  return request({
    url: '/project/contract/list/in/personal',
    method: 'get',
    params
  })
}