/* eslint-disable no-useless-escape */
/* eslint-disable no-prototype-builtins */
import { getTreeMenu, getUserList, getRoleByAdmin } from '/src/api/enterprise/index.js'
import { listPostAll } from '/src/api/system/post.js'

// 获取部门下的成员
function getDeptUser(id) {
  return getUserList({ deptId: id })
}
const defaultOption = {
  tabName: '部门', // 选项卡名称
  tabKey: 'dept', // 选项卡键值 传入的selected要和键值保持一致 eg: {dep: [], role: []}
  children: 'children', // 子节点标志
  // 生成每个节点的id 保证唯一
  nodeId: function (data) {
    return data.hasOwnProperty('userId') ? data.userId : data.hasOwnProperty('roleId') ? data.roleId : data.id // 部门的id是data.id
  },
  // 生成节点的名称 可选值 string | function
  label: function (data, node) {
    // return data.hasOwnProperty('userId') ? data.userName : data.deptName
    // 有无userId 有就代表是不是用户信息 不是就是部门 部门的名称传的是label
    return data.hasOwnProperty('userId') ? data.nickName : data.hasOwnProperty('roleId') ? data.roleName : data.label
  },
  // 判断是否为叶子节点 可选值 string | function
  isLeaf: function (data, node) {
    return data.hasOwnProperty('userId') // 含有empID为人员  且为叶子节点
  },
  // 搜索后的结果如果需要展示一些提示文字 例如搜索人员 提示人员所属部门  可以使用该属性
  // function
  searchResTip: function (data) {
    return '部门：' + data.dept.deptName
  },
  // 判断该节点是否可选 例如同时选择部门和部门下的人
  disabled: function (data, node) {
    return false
  },
  // 搜索节点方法
  onsearch: async function (searchString, resolve, reject) {
    // const param = { page: 1, limit: 200, searchName: searchString }
    // todo 搜索节点
    resolve((await getUserList({ nickName: searchString })).rows)
  },
  // 用于tree渲染的数据
  getTreeData: getTreeMenu,
  getUserInfo: getDeptUser
}

export const DEP_CONFIG = Object.assign({}, defaultOption)
export const ROLE_CONFIG = Object.assign({}, defaultOption, { tabKey: 'role', tabName: '角色', children: 'roles', getTreeData: getRoleByAdmin, disabled: (data, node) => data.roles })
export const USER_CONFIG = Object.assign({}, defaultOption, { tabKey: 'user', tabName: '指定人员', disabled: (data, node) => !data.hasOwnProperty('userId') })
const DEP_USER_CONFIG = Object.assign({}, defaultOption, { tabKey: 'dep&user', tabName: '部门和人员', disabled: () => false })
const POSITION_CONFIG = Object.assign({}, defaultOption, { tabKey: 'position', tabName: '岗位', getTreeData: listPostAll })
// 2022-05-17新增项目角色
const PROJECT_ROLE_CONFIG = Object.assign({}, defaultOption, { tabKey: 'projectRole', tabName: '项目角色' })
export const CONFIG_LIST = [DEP_CONFIG, ROLE_CONFIG, USER_CONFIG, DEP_USER_CONFIG, POSITION_CONFIG, PROJECT_ROLE_CONFIG]
