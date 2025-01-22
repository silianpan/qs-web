import request from '/src/utils/axios/request.js'

// 提醒首页
export function warnTotal() {
  return request({
    url: '/project/contract/warnTotal',
    method: 'get'
  })
}

// 合同阶段提醒
export function contractStage() {
  return request({
    url: '/project/contract/warnContractStage',
    method: 'get'
  })
}

// 保证金提醒
export function earnestList() {
  return request({
    url: '/project/contract/warnEarnest',
    method: 'get'
  })
}

// 计划收款提醒
export function planIn() {
  return request({
    url: '/project/contract/warnPaymentReal',
    method: 'get'
  })
}

// 计划付款提醒
export function planOut() {
  return request({
    url: '/project/contract/warnPayment',
    method: 'get'
  })
}
