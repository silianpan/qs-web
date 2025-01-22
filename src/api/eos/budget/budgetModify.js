import request from '/src/utils/axios/request.js'

// 查询预算变更列表
export function getBudgetModify(query) {
  return request({
    url: '/project/apply/budget/listChange',
    method: 'get',
    params: query
  })
}

// 新增预算变更
export function saveBudgetModify(data) {
  return request({
    url: '/project/apply/budget/saveChange',
    method: 'post',
    data: data
  })
}

// 删除预算变更
export function delBudgetModify(id) {
  return request({
    url: '/project/apply/budget/change/' + id,
    method: 'delete'
  })
}

// 获取预算类型
export function saveBudgetType(id) {
  return request({
    url: '/project/apply/budget/getType/' + id,
    method: 'get'
  })
}
// 获取明细
export function saveTypeList(query) {
  return request({
    url: '/project/apply/budget/getApply',
    method: 'get',
    params: query
  })
}
// 提交申请
export function submitApply(id) {
  return request({
    url: '/project/apply/submitApply/change/' + id,
    method: 'post'
  })
}
