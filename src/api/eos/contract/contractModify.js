import request from '/src/utils/axios/request.js'

// 查询合同变更列表
export function getContractModify(query) {
  return request({
    url: '/project/contract/temporary/list',
    method: 'get',
    params: query
  })
}
// 保存合同变更
export function contractSaveChange(data) {
  return request({
    url: '/project/contract/temporary/saveChange',
    method: 'post',
    data: data
  })
}

// 提交合同变更
export function submitApplyContractModify(params) {
  return request({
    url: '/project/contract/temporary/submitApply',
    method: 'post',
    params
  })
}

// 删除合同变更
export function deleteContractModify(id) {
  return request({
    url: '/project/contract/temporary/remove/' + id,
    method: 'delete'
  })
}

// 根据项目ID查询所有合同
export function getContractList(id) {
  return request({
    url: '/project/contract/list/only',
    method: 'get',
    params: id
  })
}
