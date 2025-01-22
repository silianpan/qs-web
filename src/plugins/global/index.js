import Vue from 'vue'
import _ from 'lodash'
import { isEmpty, uuidv4, toThousandFilter } from '/src/utils/common/util.js'

import ProLayout, { PageHeaderWrapper } from '/src/components/layouts/ProLayout/index.js'
import FooterToolBar from '/src/components/layouts/FooterToolbar/index.js'
import NoData from '/src/components/exception/NoData.vue'
import { IconFont } from '/src/components/IconFont/index.js'
import { SDocList } from '/src/components/Office/index.js'

import FormControls from '/src/views/lowCode/components/FormControls/index.js'
import '/src/views/lowCode/components/DynamicForm/icons/index.js'

import config from '/src/config/defaultSettings.js'
import { getDicts } from '/src/api/system/dict/data.js'
import { getConfigKey } from '/src/api/system/config.js'
import { parseTime, resetForm, addDateRange, selectDictItem, selectDictLabel, selectDictLabels, download, handleTree } from '/src/utils/common/seal.js'

Vue.prototype._ = _
Vue.prototype.isEmpty = isEmpty
Vue.prototype.uuidv4 = uuidv4
Vue.prototype.toThousandFilter = toThousandFilter
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictItem = selectDictItem
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.tableSize = config.tableSize

Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)
Vue.component('footer-tool-bar', FooterToolBar)
Vue.component('icon-font', IconFont)
Vue.component('s-doc-list', SDocList)
Vue.component('no-data', NoData)

Vue.use(FormControls)
