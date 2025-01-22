import request from '/src/utils/axios/request.js'

// 查询所有商机列表
export function listBusiness(query) {
  return request({
    url: '/project/business/list',
    method: 'get',
    params: query
  })
}

// 新增商机管理
export function addBusiness(data) {
  return request({
    url: '/project/business',
    method: 'post',
    data: data
  })
}

// 修改商机管理
export function updateBusiness(data) {
  return request({
    url: '/project/business',
    method: 'put',
    data: data
  })
}

// 删除商机管理
export function delBusiness(id) {
  return request({
    url: '/project/business/' + id,
    method: 'delete'
  })
}

// 删除商机干系人
export function deleteBusinessUser(id) {
  return request({
    url: '/project/business/user/' + id,
    method: 'delete'
  })
}

// 删除商机跟踪阶段
export function deleteBusinessStage(id) {
  return request({
    url: '/project/business/stage/' + id,
    method: 'delete'
  })
}

// 查询商机详细
export function getBusiness(id) {
  return request({
    url: '/project/business/' + id,
    method: 'get'
  })
}

// 新增商机跟踪阶段
export function addBusinessStage(data) {
  return request({
    url: '/project/business/stage/insert',
    method: 'post',
    data: data
  })
}
