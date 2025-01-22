import request from '/src/utils/axios/request.js'

// 获取Access Token
export function getAccessToken(data) {
  return request({
    baseURL: import.meta.env.VITE_APP_BAIDU_API,
    url: '/oauth/2.0/token',
    method: 'post',
    params: data
  })
}

// 获取 增值税普票、专票、卷票、电子发票 接口
export function getVatInvoice(image, params) {
  return request({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    baseURL: import.meta.env.VITE_APP_BAIDU_API,
    url: '/rest/2.0/ocr/v1/vat_invoice?access_token=' + params.access_token,
    method: 'post',
    data: image
  })
}

// 上海合合OCR国内通用票据识别
export function OCRTextinBillsCrop(data) {
  return request({
    headers: {
      'x-ti-app-id': 'bedf89fb9e283f1bb4ac6702ababeaa4',
      'x-ti-secret-code': 'c3df57f96b75ea0a6a5c26094919d076',
      'Content-Type': 'application/octet-stream;charset=utf-8'
    },
    baseURL: import.meta.env.VITE_APP_TEXTIN_API,
    url: '/robot/v1.0/api/bills_crop',
    method: 'post',
    data
  })
}
