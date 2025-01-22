import request from '/src/utils/axios/request.js'

// 获取路由
export const getRouters = () => {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}
