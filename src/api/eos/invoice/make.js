import request from '/src/utils/axios/request.js'

// 提交申请
export function submitApply(params) {
  return request({
    url: '/project/make/submitApply',
    method: 'post',
    params
  })
}

// 查询开票管理列表
export function listMake(params) {
  return request({
    url: '/project/make/list',
    method: 'get',
    params: params
  })
}

// 查询开票管理详细
export function getMake(id) {
  return request({
    url: '/project/make/' + id,
    method: 'get'
  })
}

// 新增开票管理
export function addMake(data) {
  return request({
    url: '/project/make',
    method: 'post',
    data: data
  })
}

// 修改开票管理
export function updateMake(data) {
  return request({
    url: '/project/make',
    method: 'put',
    data: data
  })
}

// 删除开票管理
export function delMake(id) {
  return request({
    url: '/project/make/' + id,
    method: 'delete'
  })
}

// 导出开票管理
export function exportMake(id) {
  return request({
    url: '/project/make/export/' + id,
    method: 'get'
  })
}
/**
 * 重新提交申请
 * @param {Object} data 修改保存对象
 * @returns
 */
export function reApply(data) {
  return request({
    url: '/project/make/reApply',
    method: 'post',
    data
  })
}

/**
 * 查询合同的已开票金额
 * @param {Object} data 修改保存对象
 * @returns
 */
 export function makeContractSum(contractCode) {
  return request({
    url: '/project/make/real/make/sum/' + contractCode,
    method: 'get',
  })
}
