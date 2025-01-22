import downloadUtil from '/src/utils/common/download.js'
/**
 * 通用js方法封装处理
 * Copyright (c) 2019 Seal-Group
 */

// padStart 的 polyfill，因为某些机型或情况，还无法支持es7的padStart，比如电脑版的微信小程序
// 所以这里做一个兼容polyfill的兼容处理
// eslint-disable-next-line no-extend-native
if (!String.prototype.padStart) {
  // 为了方便表示这里 fillString 用了ES6 的默认参数，不影响理解
  // eslint-disable-next-line no-extend-native
  String.prototype.padStart = function (maxLength, fillString = ' ') {
    if (Object.prototype.toString.call(fillString) !== '[object String]') throw new TypeError('fillString must be String')
    const str = this
    // 返回 String(str) 这里是为了使返回的值是字符串字面量，在控制台中更符合直觉
    if (str.length >= maxLength) return String(str)

    const fillLength = maxLength - str.length
    let times = Math.ceil(fillLength / fillString.length)
    while ((times >>= 1)) {
      fillString += fillString
      if (times === 1) {
        fillString += fillString
      }
    }
    return fillString.slice(0, fillLength) + str
  }
}

const baseURL = import.meta.env.VITE_APP_BASE_API

// 日期格式化
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    } else if (typeof time === 'string') {
      time = time.replace(new RegExp(/-/gm), '/')
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

// 其他更多是格式化有如下:
// yyyy:mm:dd|yyyy:mm|yyyy年mm月dd日|yyyy年mm月dd日 hh时MM分等,可自定义组合
export function timeFormat(dateTime = null, fmt = 'yyyy-mm-dd') {
  // 如果为null,则格式化当前时间
  if (!dateTime) dateTime = Number(new Date())
  // 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
  if (dateTime.toString().length === 10) dateTime *= 1000
  const date = new Date(dateTime)
  let ret
  const opt = {
    'y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'h+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    's+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'))
    }
  }
  return fmt
}

/**
 * 时间戳转为多久之前
 * @param String timestamp 时间戳
 * @param String | Boolean format 如果为时间格式字符串，超出一定时间范围，返回固定的时间格式；
 * 如果为布尔值false，无论什么时间，都返回多久以前的格式
 */
export function timeFrom(dateTime = null, format = 'yyyy-mm-dd') {
  // 如果为null,则格式化当前时间
  if (!dateTime) dateTime = Number(new Date())
  // 如果dateTime长度为10或者13，则为秒和毫秒的时间戳，如果超过13位，则为其他的时间格式
  if (dateTime.toString().length === 10) dateTime *= 1000
  const timestamp = +new Date(Number(dateTime))

  const timer = (Number(new Date()) - timestamp) / 1000
  // 如果小于5分钟,则返回"刚刚",其他以此类推
  let tips = ''
  switch (true) {
    case timer < 300:
      tips = '刚刚'
      break
    case timer >= 300 && timer < 3600:
      tips = parseInt(timer / 60) + '分钟前'
      break
    case timer >= 3600 && timer < 86400:
      tips = parseInt(timer / 3600) + '小时前'
      break
    case timer >= 86400 && timer < 2592000:
      tips = parseInt(timer / 86400) + '天前'
      break
    default:
      // 如果format为false，则无论什么时间戳，都显示xx之前
      if (format === false) {
        if (timer >= 2592000 && timer < 365 * 86400) {
          tips = parseInt(timer / (86400 * 30)) + '个月前'
        } else {
          tips = parseInt(timer / (86400 * 365)) + '年前'
        }
      } else {
        tips = timeFormat(timestamp, format)
      }
  }
  return tips
}

// 表单重置
export function resetForm(refName) {
  if (this[refName]) {
    this[refName].resetFields()
  }
}

// 添加日期范围
export function addDateRange(params, dateRange, propName) {
  var search = params
  search.params = {}
  if (dateRange !== null && dateRange !== '' && dateRange.length === 2) {
    if (typeof propName === 'undefined') {
      search.params['beginTime'] = dateRange[0]
      search.params['endTime'] = dateRange[1]
    } else {
      search.params[propName + 'BeginTime'] = dateRange[0]
      search.params[propName + 'EndTime'] = dateRange[1]
    }
  }
  return search
}

// 获取字典项
export function selectDictItem(datas, value) {
  if (datas === undefined || datas === null || datas.length === 0 || value === undefined || value === null || value === '') return {}
  const ret = datas.filter(item => item['dictValue'] === '' + value)
  return ret !== undefined && ret !== null && ret.length > 0 ? ret[0] : {}
}

// 回显数据字典
export function selectDictLabel(datas, value) {
  var actions = []
  Object.keys(datas).some(key => {
    if (datas[key].dictValue === '' + value) {
      actions.push(datas[key].dictLabel)
      return true
    }
  })
  return actions.join('')
}

// 回显数据字典（字符串数组）
export function selectDictLabels(datas, value, separator) {
  var actions = []
  var currentSeparator = undefined === separator ? ',' : separator
  var temp = value.split(currentSeparator)
  Object.keys(value.split(currentSeparator)).some(val => {
    Object.keys(datas).some(key => {
      if (datas[key].dictValue === '' + temp[val]) {
        actions.push(datas[key].dictLabel + currentSeparator)
      }
    })
  })
  return actions.join('').substring(0, actions.join('').length - 1)
}

// 通用下载方法 使用encodeURIComponent来对  , / ? : @ & = + $ # 这些符号进行编码
export function download(fileName) {
  // window.location.href = baseURL + '/common/download?fileName=' + encodeURIComponent(fileName) + '&delete=' + true
  return downloadUtil.downloadIncludeDelete(fileName)
}

// 字符串格式化(%s )
export function sprintf(str) {
  var args = arguments
  var flag = true
  var i = 1
  str = str.replace(/%s/g, function () {
    var arg = args[i++]
    if (typeof arg === 'undefined') {
      flag = false
      return ''
    }
    return arg
  })
  return flag ? str : ''
}

// 转换字符串，undefined,null等转化为''
export function praseStrEmpty(str) {
  if (!str || str === 'undefined' || str === 'null') {
    return ''
  }
  return str
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId =
    rootId ||
    Math.min.apply(
      Math,
      data.map(item => {
        return item[parentId]
      })
    ) ||
    0
  // 对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  // 循环所有项
  const treeData = cloneData.filter(father => {
    var branchArr = cloneData.filter(child => {
      // 返回每一项的子级数组
      return father[id] === child[parentId]
    })
    if (branchArr.length > 0) {
      father.children = branchArr
    } else {
      father.children = ''
    }
    // 返回第一层
    return father[parentId] === rootId
  })
  return treeData !== '' ? treeData : data
}
