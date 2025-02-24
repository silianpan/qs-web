import request from '/src/utils/axios/request.js'

// 查询登录日志列表
export function list (query) {
  return request({
    url: '/monitor/logininfor/list',
    method: 'get',
    params: query
  })
}

// 删除登录日志
export function delLogininfor (infoId) {
  return request({
    url: '/monitor/logininfor/' + infoId,
    method: 'delete'
  })
}

// 清空登录日志
export function cleanLogininfor () {
  return request({
    url: '/monitor/logininfor/clean',
    method: 'delete'
  })
}

// 导出登录日志
export function exportLogininfor (query) {
  return request({
    url: '/monitor/logininfor/export',
    method: 'get',
    params: query
  })
}
