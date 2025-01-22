import request from '/src/utils/axios/request.js'

// 按项目
export function getProjectList(query) {
  return request({
    url: '/project/schedule/project/processTotal',
    method: 'get',
    params: query
  })
}
// 按人员
export function getPeopleList(query) {
  return request({
    url: '/project/schedule/labor/processTotal',
    method: 'get',
    params: query
  })
}

/* 导出 */
export function ExportFile(query) {
  return request({
    url: '/project/schedule/export/processTotal',
    method: 'get',
    params: query
  })
}

/* 经营分析 按地区查项目 */
export function getRegionList(query) {
  return request({
    url: '/project/schedule/getRegion',
    method: 'get',
    params: query
  })
}
