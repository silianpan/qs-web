import request from '/src/utils/axios/request.js'
// 综合查询列表
export function getIntegratedQuery(params) {
  return request({
    url: '/project/loan/getAll',
    method: 'get',
    params: params
  })
}
// 综合查询详情
export function getRepay(params) {
  return request({
    url: '/project/loan/getAll',
    method: 'get',
    params: params
  })
}
// 借款查询
export function getLoanList(params) {
  return request({
    url: '/project/loan/getLoan',
    method: 'get',
    params: params
  })
}
// 还款查询
export function getRepayList(params) {
  return request({
    url: 'project/repay/getRepay/',
    method: 'get',
    params: params
  })
}
// 催办
export function repayPress(userId) {
  return request({
    url: 'project/repay/repayPress/' + userId,
    method: 'get'
  })
}
