import request from '/src/utils/axios/request.js'

// 完成任务（通过、驳回、结束流程）
// export function completeTask(query) {
//   return request({
//     url: '/activiti/process/complete',
//     method: 'post',
//     data: query
//   })
// }

/* 办理流程 */
export function completeTask(query) {
  return request({
    url: '/project/activity/complete',
    method: 'post',
    data: query
  })
}

/* 驳回请求 */
export function rejectTask(query) {
  return request({
    url: '/project/activity/back',
    method: 'post',
    data: query
  })
}

/* 结束流程 */
export function finishTask(query) {
  return request({
    url: '/project/activity/end/process',
    method: 'post',
    data: query
  })
}

// 查询待办列表
export function listTodo(query) {
  return request({
    url: '/project/activity/taskWaitList',
    method: 'get',
    params: query
  })
}

// 查询历史活动
export function listHistory(query) {
  return request({
    url: '/activiti/process/listHistory',
    method: 'post',
    data: query
  })
}

// 查询已办列表
export function listDone(query) {
  return request({
    url: '/project/activity/taskDoneList',
    method: 'get',
    params: query
  })
}

// 获取模型所有节点元素
export function listFlowElements(pProcessInstanceId) {
  return request({
    url: '/activiti/process/listFlowElements',
    method: 'get',
    params: { pProcessInstanceId }
  })
}

// 获取模型有效节点
export function listFlowElementsValid(pProcessInstanceId) {
  return request({
    url: '/activiti/process/listFlowElementsValid',
    method: 'get',
    params: { pProcessInstanceId }
  })
}

// 获取已经经过节点ID和线ID集合
export function listFlowIds(pProcessInstanceId) {
  return request({
    url: '/activiti/process/listFlowIds',
    method: 'get',
    params: { pProcessInstanceId }
  })
}

// 查询用户发起的流程
export function findProcessStarted(query) {
  return request({
    url: '/project/activity/started',
    method: 'get',
    params: query
  })
}

// 查询某个业务信息
export function findProcessBusInfo(moduleName, formId) {
  return request({
    url: '/project/' + moduleName + '/' + formId,
    method: 'get'
  })
}
// 查询首页我的抄送
export function findTaskCopyList(params) {
  return request({
    url: '/project/activity/taskCopyList',
    method: 'get',
    params
  })
}
