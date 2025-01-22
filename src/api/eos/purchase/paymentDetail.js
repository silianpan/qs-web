import request from '/src/utils/axios/request.js'

// 删除付款申请
export function delPaymentDetail(id) {
  return request({
    url: '/project/payment/detail/' + id,
    method: 'delete'
  })
}