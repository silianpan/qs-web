import request from '/src/utils/axios/request.js'

// 查询所有岗位列表，不分页
export function listPostAll(query) {
  return request({
    url: '/system/post/list/all',
    method: 'get',
    params: query
  })
}

// 查询岗位列表
export function listPost(query) {
  return request({
    url: '/system/post/list',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getPost(postId) {
  return request({
    url: '/system/post/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addPost(data) {
  return request({
    url: '/system/post',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    url: '/system/post',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delPost(postId) {
  return request({
    url: '/system/post/' + postId,
    method: 'delete'
  })
}

// 导出岗位
export function exportPost(query) {
  return request({
    url: '/system/post/export',
    method: 'get',
    params: query
  })
}

// 岗位添加成员
export function addPostMember(data) {
  return request({
    url: '/system/post/add_member',
    method: 'post',
    data
  })
}
// 岗位删除成员
export function deletePostMember(data) {
  return request({
    url: '/system/post/remove_member',
    method: 'delete',
    data
  })
}
