import router from '/src/router/index.js'
import request from '/src/utils/axios/request.js'
import Viewer from 'viewerjs'
import storage from 'store'
// import { ACCESS_TOKEN } from '/src/store/mutation-types.js'
import { TENANT_ID } from '/src/store/mutation-types.js'
import downloadUtil from '/src/utils/common/download.js'

// 下载文件
export function downloadDoc(name, url) {
  // return request({
  //   url: '/common/download/resource',
  //   method: 'get',
  //   params: { resource }
  // })
  if (name && url) {
    // window.open可以调用，但是不能传递header
    // const convertUrl = import.meta.env.VITE_APP_BASE_API + `/common/download/doc?name=${encodeURIComponent(name)}&url=${url}`
    // window.open(convertUrl, '_blank')
    // 此种方法有问题
    // return request({
    //   url: '/common/download/doc',
    //   method: 'get',
    //   params: { name, url }
    // })
    return downloadUtil.doc(name, url)
  }
}

// 删除文档
export function deleteDoc(fileName) {
  return request({
    url: '/common/delete',
    method: 'delete',
    params: { fileName }
  })
}

// 转换文件为PDF
export function convertDoc(name, url) {
  return request({
    url: '/common/convert/doc',
    method: 'get',
    params: { name, url }
  })
}

export function previewDoc(name, url) {
  if (url && typeof url === 'string') {
    const convertUrl = import.meta.env.VITE_APP_BASE_API + `/common/download/doc?name=${encodeURIComponent(name)}&url=${url}`
    const index = url.lastIndexOf('.')
    let suffix = url.substring(index + 1)
    if (suffix) {
      suffix = suffix.toLowerCase()
      switch (suffix) {
        case 'pdf':
          // pdf预览
          const viewerUrl = import.meta.env.VITE_APP_PREVIEW_URL + '/web/viewer.html'
          const { href } = router.resolve({
            name: 'SDocPreview',
            query: { viewerUrl, fileUrl: convertUrl, url, name }
          })
          window.open(href, '_blank')
          // const pdfUrl = viewerUrl + '?file=' + encodeURIComponent(convertUrl)
          // window.open(pdfUrl, '_blank')
          break
        case 'doc':
        case 'docx':
        case 'xls':
        case 'xlsx':
        case 'ppt':
        case 'pptx':
        case 'txt':
          // const fileUrl = url.substring(0, url.lastIndexOf('/')) + '/'
          // const fileName = url.substring(url.lastIndexOf('/') + 1)
          // const WOPISrc = `http://172.19.249.124:8010/wopi/files/test.docx`
          // const WOPISrc = `http://39.98.39.58:8010${import.meta.env.VITE_APP_BASE_API}/wopi/files/${fileName}?fileUrl=${fileUrl}&w=1`
          // const docUrl = `http://39.98.39.58:9980/loleaflet/dist/loleaflet.html?WOPISrc=${encodeURIComponent(WOPISrc)}`
          const docUrl = '/loleaflet/dist/loleaflet.html?file_path=' + encodeURIComponent('file:///opt/lool/upload/' + url.replace('/profile', storage.get(TENANT_ID)))
          window.open(docUrl, '_blank')
          break
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'bmp':
        case 'gif':
          downloadUtil.blob(name, url).then(blobData => {
            const urlCreator = window.URL || window.webkitURL
            // 图片预览
            const image = new Image()
            image.src = urlCreator.createObjectURL(blobData)
            image.alt = name
            const viewer = new Viewer(image, {
              hidden: function () {
                viewer.destroy()
              }
            })
            // image.click()
            viewer.show()
          })
          break
        default:
          // window.open(convertUrl, '_blank')
          downloadDoc(name, url)
          break
      }
    }
  }
}
