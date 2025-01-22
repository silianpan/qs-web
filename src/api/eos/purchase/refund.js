import { method } from 'lodash'
import request from '/src/utils/axios/request.js'

// 查询退款管理列表
export function reFundList(query) {
  return request({
    url: '/project/payment/reFund/list',
    method: 'get',
    params: query
  })
}
// 新增退款管理
export function saveRefund(data) {
  return request({
    url: '/project/payment/reFund/saveRefund',
    method: 'post',
    data: data
  })
}
// 修改退款管理
export function changeRefund(data) {
  return request({
    url: '/project/payment/reFund/editChange',
    method: 'put',
    data: data
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
// 删除
export function deleteRefund(id) {
  return request({
    url: '/project/payment/refund/' + id,
    method: 'delete'
  })
}

// 获取退款详情
export function refundDetail(id) {
  return request({
    url: '/project/payment/refund/detail/' + id,
    method: 'get'
  })
}
