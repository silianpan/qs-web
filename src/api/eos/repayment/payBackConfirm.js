import request from '/src/utils/axios/request.js'

// 还款确认列表
export function unPayMoney(params) {
  return request({
    url: '/project/repay/unconfirm',
    method: 'get',
    params: params
  })
}
// 确认还款
export function confirmRepay(id) {
  return request({
    url: '/project/repay/confirmRepay/' + id,
    method: 'get'
  })
}
