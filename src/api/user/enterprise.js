import request from '/src/utils/axios/request.js'

/* 获取企业 */
export function getEnterprise(params) {
  return request({
    url: '/crm/company/getCompany',
    method: 'get',
    params
  })
}

/* 新增企业 */
export function addEnterprise(data) {
  return request({
    url: '/crm/company/add',
    method: 'post',
    data
  })
}

/* 切换企业 */
export function toggleEnterprise(id) {
  return request({
    url: '/crm/company/change/' + id,
    method: 'get'
  })
}
