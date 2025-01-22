import defaultSettings from '/src/config/defaultSettings.js'
import { Icon } from 'ant-design-vue'
import iconfontUrl from '/src/assets/font/iconfont.js?url'

export const IconFont = Icon.createFromIconfontCN({
  scriptUrl: defaultSettings.iconfontUrl || iconfontUrl
})
