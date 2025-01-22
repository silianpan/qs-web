import request from '/src/utils/axios/request.js'

// 销售主管 头部展示请求
export function infoRmation(params) {
  return request({
    url: '/project/analysis/top/sale',
    method: 'get',
    params
  })
}
//商机跟进转化 opportunitiesToFollowUp
export function opportunitiesToFollowUp(params) {
  return request({
    url: '/project/analysis/business/sale',
    method: 'get',
    params
  })
}
//项目状态分类 ProjectStatusClassiFication
export function ProjectStatusClassiFication(params) {
  return request({
    url: 'project/analysis/project/sale',
    method: 'get',
    params
  })
}
// 收入合同 /project/analysis/project/sale/invoice  RevenueContractInvoicing
export function RevenueContractInvoicing(params) {
  return request({
    url: '/project/analysis/project/sale/invoice',
    method: 'get',
    params
  })
}
// 项目收款记录
export function projectPayment(params) {
  return request({
    url: '/project/analysis/project/sale/total?projectName',
    method: 'get',
    params
  })
}
