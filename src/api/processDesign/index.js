/**
 * 描述
 * @date 2022-01-06
 * 表单mock数据
 */

import request from '/src/utils/axios/request.js'
import processConfData from './mockConf.json'

// 获取Mock数据
// export const GET_MOCK_CONF = () =>
//   request({
//     url: import.meta.env.BASE_URL + 'mockConf.json',
//     method: 'get'
//   })
export const GET_MOCK_CONF = () => {
  return new Promise(resolve => {
    resolve(processConfData)
  })
}

// 创建表单
export function createdFrom(data) {
  return request({
    url: '/form/create',
    method: 'post',
    data
  })
}

// 表单菜单
export function getFormMenuList(params) {
  return request({
    url: '/form/list',
    method: 'get',
    params
  })
}

// 表单详情
export function getFormDetail(data) {
  return request({
    url: '/form/detail',
    method: 'post',
    data
  })
}

// 编辑表单
export function updateForm(data) {
  return request({
    url: '/form/update',
    method: 'post',
    data
  })
}

// 删除表单
export function deleteForm(data) {
  return request({
    url: '/form/remove',
    method: 'post',
    data
  })
}

// 提交
export function dataCreate(data) {
  return request({
    url: '/data/create',
    method: 'post',
    data
  })
}

// 查询表格数据
export function createDataFind(data) {
  return request({
    url: '/data/find',
    method: 'post',
    data
  })
}
// 删除表格数据
export function deleteFormItem(data) {
  return request({
    url: '/data/remove',
    method: 'post',
    data
  })
}
// 查询待办流程
export function getTaskList(params) {
  return request({
    url: '/activiti/mongoWorkflow/taskWaitList',
    method: 'get',
    params
  })
}

// 查询待办流程总数量
export function getTaskListCount(params) {
  return request({
    url: '/activiti/mongoWorkflow/taskWaitCount',
    method: 'get',
    params
  })
}

// 我发起的流程
export function getMongoWorkflowList(params) {
  return request({
    url: '/activiti/mongoWorkflow/taskStartList',
    method: 'get',
    params
  })
}

// 我处理的
export function getTaskDoneList(params) {
  return request({
    url: '/activiti/mongoWorkflow/taskDoneList',
    method: 'get',
    params
  })
}

// 抄送我的
export function getTaskCopyList(params) {
  return request({
    url: '/activiti/mongoWorkflow/taskCopyList',
    method: 'get',
    params
  })
}

// 表单数据详情
export function getFormDataDetail(data) {
  return request({
    url: '/data/detail',
    method: 'post',
    data
  })
}
/* 代办同意 */
export function activitiProcess(params) {
  return request({
    url: '/activiti/process/complete',
    method: 'post',
    params
  })
}

/* 设计流程保存 */
export function setProcess(data) {
  return request({
    url: '/activiti/mongo/setProcess',
    method: 'post',
    data
  })
}

/* 设计流程查看 */
export function detailProcess(data) {
  return request({
    url: '/activiti/mongo/detailProcess',
    method: 'post',
    data
  })
}

/* 提教流程 */
export function subumitProcess(data) {
  return request({
    url: '/activiti/mongo/submitProcess',
    method: 'post',
    data
  })
}
