/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername (str) {
  const validMap = ['admin', 'editor']
  return validMap.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL (url) {
  const reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~/])+$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase (str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase (str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets (str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail (email) {
  const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString (str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray (arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

// 表单验证器：金额验证
export const VALIDATE_MONEY = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('不能为空'))
  } else {
    const reg = /^[0-9]+(.[0-9]{1,2})?$/
    if (reg.test(value) && parseFloat(value) !== 0) {
      callback()
    } else {
      callback(new Error('请输入正整数或两位小数的浮点数'))
    }
  }
}

// 表单验证器：金额验证，允许为0
export const VALIDATE_MONEY_ZERO = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('不能为空'))
  } else {
    const reg = /^[0-9]+(.[0-9]{1,2})?$/
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正整数或两位小数的浮点数'))
    }
  }
}

// 表单验证器：验证空输入
export const VALIDATE_EMPTY = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入'))
  } else {
    callback()
  }
}

// 表单验证器：验证正(负)整数或两位小数的浮点数
export const VALIDATE_NE_INT = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入金额'))
  } else {
    const reg = /(^([-]?)[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^([-]?)(0){1}$)|(^([-]?)[0-9]\.[0-9]([0-9])?$)/
    // if (reg.test(value) && parseFloat(value) !== 0) {
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正(负)整数或两位小数的浮点数'))
    }
  }
}

// 判断金额函数
export const validMoney = num => {
  return /^[0-9]+(.[0-9]{1,2})?$/.test(num)
}

// 判断正整数
export const validPositiveInteger = num => {
  return /^[0-9]*[1-9][0-9]*$/.test(num)
}

// 判断金额是否合法，返回错误信息
export const judgetMoney = money => {
  let errorMsg = ''
  // 判断金额是否非法
  const reg = /^[0-9]+(.[0-9]{1,2})?$/
  if (reg.test(money) && parseFloat(money) !== 0) {
  } else {
    errorMsg = '【金额非法，需要正整数或两位小数的浮点数】'
  }
  return errorMsg
}
