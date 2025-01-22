import request from '/src/utils/axios/request.js'

export function fundApproval(query) {
  return request({
    url: '/project/fund/approval',
    method: 'get',
    params: query
  })
}
