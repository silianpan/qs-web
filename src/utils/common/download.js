import axios from 'axios'
import notification from 'ant-design-vue/es/notification'
import { saveAs } from 'file-saver'
import storage from 'store'
import { ACCESS_TOKEN } from '/src/store/mutation-types.js'
import errorCode from '/src/utils/axios/errorCode.js'

const baseURL = process.env.VITE_APP_BASE_API

// 验证是否为blob格式
async function blobValidate(data) {
  try {
    const text = await data.text()
    JSON.parse(text)
    return false
  } catch (error) {
    return true
  }
}

export default {
  downloadIncludeDelete(fileName, isDelete = true) {
    const url = baseURL + '/common/download?fileName=' + encodeURIComponent(fileName) + '&delete=' + isDelete
    axios({
      method: 'get',
      url,
      responseType: 'blob',
      headers: { Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN) }
    }).then(async res => {
      const isLogin = await blobValidate(res.data)
      if (isLogin) {
        const blob = new Blob([res.data])
        this.saveAs(blob, fileName)
      } else {
        this.printErrMsg(res.data)
      }
    })
  },
  resource(resource) {
    const url = baseURL + '/common/download/resource?resource=' + encodeURIComponent(resource)
    axios({
      method: 'get',
      url,
      responseType: 'blob',
      headers: { Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN) }
    }).then(async res => {
      const isLogin = await blobValidate(res.data)
      if (isLogin) {
        const blob = new Blob([res.data])
        this.saveAs(blob, resource.substring(resource.lastIndexOf('/') + 1))
      } else {
        this.printErrMsg(res.data)
      }
    })
  },
  doc(fileName, fileUrl) {
    const url = baseURL + '/common/download/doc?name=' + encodeURIComponent(fileName) + '&url=' + fileUrl
    axios({
      method: 'get',
      url,
      responseType: 'blob',
      headers: { Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN) }
    }).then(async res => {
      const isLogin = await blobValidate(res.data)
      if (isLogin) {
        const blob = new Blob([res.data])
        this.saveAs(blob, fileName)
      } else {
        this.printErrMsg(res.data)
      }
    })
  },
  async blob(fileName, fileUrl) {
    const url = baseURL + '/common/download/doc?name=' + encodeURIComponent(fileName) + '&url=' + fileUrl
    const res = await axios({
      method: 'get',
      url,
      responseType: 'blob',
      headers: { Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN) }
    })
    const isLogin = await blobValidate(res.data)
    if (isLogin) {
      const blob = new Blob([res.data])
      return blob
    } else {
      this.printErrMsg(res.data)
      return null
    }
  },
  async binary(fileName, fileUrl) {
    const url = baseURL + '/common/download/doc?name=' + encodeURIComponent(fileName) + '&url=' + fileUrl
    const res = await axios({
      method: 'get',
      url,
      responseType: 'blob',
      headers: { Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN) }
    })
    const isLogin = await blobValidate(res.data)
    if (isLogin) {
      return res.data
    } else {
      this.printErrMsg(res.data)
      return null
    }
  },
  zip(fileUrl, fileName) {
    const url = baseURL + fileUrl
    axios({
      method: 'get',
      url,
      responseType: 'blob',
      headers: { Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN) }
    }).then(async res => {
      const isLogin = await blobValidate(res.data)
      if (isLogin) {
        const blob = new Blob([res.data], { type: 'application/zip' })
        this.saveAs(blob, fileName)
      } else {
        this.printErrMsg(res.data)
      }
    })
  },
  saveAs(text, name, opts) {
    saveAs(text, name, opts)
  },
  async printErrMsg(data) {
    const resText = await data.text()
    const rspObj = JSON.parse(resText)
    const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
    notification.error({
      message: errMsg,
      duration: 5
    })
  }
}
