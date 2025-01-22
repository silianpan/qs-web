import Vue from 'vue'

// 完整引入
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

// Vue.use(ElementUI)

// 按需引入

import {
  Icon,
  Button,
  ButtonGroup,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxGroup,
  CheckboxButton,
  Select,
  Cascader,
  Switch,
  Option,
  OptionGroup,
  Form,
  FormItem,
  Input,
  InputNumber,
  Dialog,
  Drawer,
  DatePicker,
  TimePicker,
  Tag,
  Table,
  TableColumn,
  Popconfirm,
  Upload,
  Tooltip,
  Scrollbar,
  Tabs,
  TabPane,
  Row,
  Col,
  Popover,
  Slider,
  Divider,
  Rate,
  Tree,
  ColorPicker,
  Alert,
  Loading,
  MessageBox
} from 'element-ui'

Vue.use(Icon)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(CheckboxButton)
Vue.use(Select)
Vue.use(Cascader)
Vue.use(Switch)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Dialog)
Vue.use(Drawer)
Vue.use(DatePicker)
Vue.use(TimePicker)
Vue.use(Tag)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Popconfirm)
Vue.use(Upload)
Vue.use(Tooltip)
Vue.use(Scrollbar)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Row)
Vue.use(Col)
Vue.use(Popover)
Vue.use(Slider)
Vue.use(Divider)
Vue.use(Rate)
Vue.use(Tree)
Vue.use(ColorPicker)
Vue.use(Alert)
Vue.use(Loading)


Vue.prototype.$elconfirm = MessageBox.confirm

