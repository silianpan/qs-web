import request from '/src/utils/axios/request.js'

export function registered(data) {
  return request({
    url: '/crm/user/register',
    method: 'post',
    data
  })
}
