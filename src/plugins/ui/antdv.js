import Vue from 'vue'
import store from '/src/store/index.js'
import router from '/src/router/index.js'

import {
  ConfigProvider,
  Layout,
  Input,
  InputNumber,
  Button,
  Switch,
  Radio,
  Checkbox,
  Select,
  TreeSelect,
  Card,
  Form,
  Row,
  Col,
  Modal,
  Table,
  Tabs,
  Icon,
  Badge,
  Popover,
  Dropdown,
  // List,
  Avatar,
  Breadcrumb,
  Steps,
  Spin,
  Menu,
  Drawer,
  Tooltip,
  Alert,
  Tag,
  Divider,
  DatePicker,
  TimePicker,
  Upload,
  Progress,
  Skeleton,
  Popconfirm,
  Pagination,
  FormModel,
  PageHeader,
  Result,
  Statistic,
  Descriptions,
  message,
  notification,
  Space,
  Tree,
  Collapse
} from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import SDrawer from '/src/components/Drawer/index.js'
import themePluginConfig from '/src/config/themePluginConfig.js'

Vue.use(Collapse)
Vue.use(ConfigProvider)
Vue.use(Layout)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Button)
Vue.use(Switch)
Vue.use(Radio)
Vue.use(Checkbox)
Vue.use(Select)
Vue.use(TreeSelect)
Vue.use(Card)
Vue.use(Form)
Vue.use(Row)
Vue.use(Col)
Vue.use(Modal)
Vue.use(Table)
Vue.use(Tabs)
Vue.use(Icon)
Vue.use(Badge)
Vue.use(Popover)
Vue.use(Dropdown)
// vite引入List有问题，使用时单独引入，包括样式
// Vue.use(List)
Vue.use(Avatar)
Vue.use(Breadcrumb)
Vue.use(Steps)
Vue.use(Spin)
Vue.use(Menu)
Vue.use(Drawer)
Vue.use(Tooltip)
Vue.use(Alert)
Vue.use(Tag)
Vue.use(Divider)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(Upload)
Vue.use(Progress)
Vue.use(Skeleton)
Vue.use(Popconfirm)
Vue.use(Pagination)
Vue.use(FormModel)
Vue.use(PageHeader)
Vue.use(Result)
Vue.use(Statistic)
Vue.use(Descriptions)
Vue.use(Space)
Vue.use(Tree)

// 暂不使用，使用this.$createAntdDrawer
Vue.use(SDrawer, {
  antdModal: Modal,
  antdDrawer: Drawer,
  store,
  router
})

Vue.prototype.$message = message
Vue.prototype.$notification = notification
Vue.prototype.$antdconfirm = Modal.confirm
Vue.prototype.$info = Modal.info
Vue.prototype.$success = Modal.success
Vue.prototype.$error = Modal.error
Vue.prototype.$warning = Modal.warning

window.umi_plugin_ant_themeVar = themePluginConfig.theme
