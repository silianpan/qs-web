import request from '/src/utils/axios/request.js'
import { encrypt } from '/src/utils/encrypt/jsencrypt.js'

const userApi = {
  Login: '/login',
  Logout: '/logout',
  // get my info
  UserInfo: '/getInfo'
}

/**
 * login func
 * @param parameter
 * @returns {*}
 */
export function login(parameter) {
  const { username, password, code, uuid, rememberMe } = parameter
  return request({
    url: userApi.Login,
    method: 'post',
    data: {
      username,
      password: encrypt(password),
      code,
      uuid,
      rememberMe
    }
  })
}

export function getInfo() {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout() {
  return request({
    url: userApi.Logout,
    method: 'delete',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    method: 'get'
  })
}
