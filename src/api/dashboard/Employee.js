import request from '/src/utils/axios/request.js'

// 销售主管 头部展示请求/project/analysis/project/top/staff
export function employeesTitle(params) {
  return request({
    url: '/project/analysis/project/top/staff',
    method: 'get',
    params
  })
}

// 参与项目分析
export function projectChart(params) {
  return request({
    url: '/project/analysis/project/staff/project/type',
    method: 'get',
    params
  })
}
// 员工所在项目 /project/analysis/project/staff/project/process
export function ProjectProgressOfEmployee(params) {
  return request({
    url: '/project/analysis/project/staff/project/process',
    method: 'get',
    params
  })
}
