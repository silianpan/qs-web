import './index.less'

import omit from 'omit.js'
import PropTypes from 'ant-design-vue/es/_util/vue-types'

import 'ant-design-vue/es/divider/style'
import Divider from 'ant-design-vue/es/divider'

import 'ant-design-vue/es/drawer/style'
import Drawer from 'ant-design-vue/es/drawer'

import 'ant-design-vue/es/list/style'
import List from 'ant-design-vue/es/list'

import 'ant-design-vue/es/switch/style'
import Switch from 'ant-design-vue/es/switch'

import 'ant-design-vue/es/button/style'
import Button from 'ant-design-vue/es/button'

import 'ant-design-vue/es/icon/style'
import Icon from 'ant-design-vue/es/icon'

import 'ant-design-vue/es/alert/style'
import Alert from 'ant-design-vue/es/alert'

import antPortal from 'ant-design-vue/es/_util/portalDirective'

import 'ant-design-vue/es/message/style'
// import message from 'ant-design-vue/es/message'

import BlockCheckbox from './BlockCheckbox'
import ThemeColor from './ThemeColor'
import LayoutSetting, { renderLayoutSettingItem } from './LayoutChange'
import { updateTheme, updateColorWeak } from '../../utils/dynamicTheme'
import { genStringToTheme } from '../../utils/util'
// import CopyToClipboard from 'vue-copy-to-clipboard'

const baseClassName = 'ant-pro-setting-drawer'

const BodyProps = {
  title: PropTypes.string.def('')
}

const Body = {
  props: BodyProps,
  render(h) {
    const { title } = this

    return (
      <div style={{ marginBottom: 24 }}>
        <h3 class={`${baseClassName}-title`}>{title}</h3>
        {this.$slots.default}
      </div>
    )
  }
}

const defaultI18nRender = t => t

const getThemeList = i18nRender => {
  const list = window.umi_plugin_ant_themeVar || []

  const themeList = [
    {
      key: 'light',
      url: 'https://gw.alipayobjects.com/zos/antfincdn/NQ%24zoisaD2/jpRkZQMyYRryryPNtyIC.svg',
      title: i18nRender('app.setting.pagestyle.light')
    },
    {
      key: 'dark',
      url: 'https://gw.alipayobjects.com/zos/antfincdn/XwFOFbLkSM/LCkqqYNmvBEbokSDscrm.svg',
      title: i18nRender('app.setting.pagestyle.dark')
    }
  ]

  const darkColorList = [
    {
      key: '#1890ff',
      color: '#1890ff',
      theme: 'dark'
    }
  ]

  const lightColorList = [
    {
      key: '#1890ff',
      color: '#1890ff',
      theme: 'dark'
    }
  ]

  if (list.find(item => item.theme === 'dark')) {
    // themeList.push({
    //   // disable click
    //   // disable: true,
    //   key: 'realDark',
    //   url: 'https://gw.alipayobjects.com/zos/antfincdn/hmKaLQvmY2/LCkqqYNmvBEbokSDscrm.svg',
    //   title: i18nRender('app.setting.pagestyle.realdark')
    // })
  }
  // insert  theme color List
  list.forEach(item => {
    const color = (item.modifyVars || {})['@primary-color']
    if (item.theme === 'dark' && color) {
      darkColorList.push({
        color,
        ...item
      })
    }
    if (!item.theme || item.theme === 'light') {
      lightColorList.push({
        color,
        ...item
      })
    }
  })

  return {
    colorList: {
      dark: darkColorList,
      light: lightColorList
    },
    themeList
  }
}

const handleChangeSetting = (key, value, hideMessageLoading) => {
  if (key === 'primaryColor') {
    // 更新主色调
    updateTheme(value)
  }
  if (key === 'colorWeak') {
    updateColorWeak(value)
  }
}

const genCopySettingJson = settings =>
  JSON.stringify(
    omit(
      {
        ...settings,
        primaryColor: genStringToTheme(settings.primaryColor)
      },
      ['colorWeak']
    ),
    null,
    2
  )

export const settings = {
  theme: PropTypes.oneOf(['dark', 'light']),
  primaryColor: PropTypes.string,
  layout: PropTypes.oneOf(['sidemenu', 'topmenu']),
  colorWeak: PropTypes.bool,
  contentWidth: PropTypes.oneOf(['Fluid', 'Fixed']).def('Fluid'),
  // 替换兼容 PropTypes.oneOf(['Fluid', 'Fixed']).def('Fluid')
  // contentWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).def('Fluid'),
  fixedHeader: PropTypes.bool,
  fixSiderbar: PropTypes.bool,
  multiTab: PropTypes.bool,
  breadcrumb: PropTypes.bool,
  footerView: PropTypes.bool,
  showFirstLevelMenu: PropTypes.bool,
  menuIconHorizontal: PropTypes.bool,
  hideHintAlert: PropTypes.bool.def(false),
  hideCopyButton: PropTypes.bool.def(false)
}

export const SettingDrawerProps = {
  getContainer: PropTypes.func,
  settings: PropTypes.objectOf(settings),

  i18nRender: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(false)
}

const SettingDrawer = {
  name: 'SettingDrawer',
  props: SettingDrawerProps,
  inject: ['locale'],
  data() {
    return {
      show: false
    }
  },
  render(h) {
    const { setShow, getContainer, settings } = this

    const {
      theme = 'dark',
      primaryColor = 'daybreak',
      layout = 'sidemenu',
      fixedHeader = false,
      fixSiderbar = true,
      multiTab = true,
      breadcrumb = false,
      footerView = false,
      showFirstLevelMenu = false,
      menuIconHorizontal = false,
      contentWidth,
      hideHintAlert,
      hideCopyButton,
      colorWeak
    } = settings

    const i18n = this.$props.i18nRender || this.locale || defaultI18nRender
    const themeList = getThemeList(i18n)
    const isTopMenu = layout === 'topmenu'

    const iconStyle = {
      color: '#fff',
      fontSize: 20
    }

    const changeSetting = (type, value) => {
      this.$emit('change', { type, value })
      handleChangeSetting(type, value, false)
    }

    return (
      <Drawer
        visible={this.show}
        width={300}
        onClose={() => setShow(false)}
        placement="right"
        getContainer={getContainer}
        /* handle={
          <div class="ant-pro-setting-drawer-handle" onClick={() => setShow(!this.show)}>
            {this.show
              ? (<Icon type="close" style={iconStyle} />)
              : (<Icon type="setting" style={iconStyle} />)
            }
          </div>
        } */
        style={{
          zIndex: 999
        }}
      >
        {/* <template slot="handle">
          <div class={`${baseClassName}-handle`} onClick={() => setShow(!this.show)}>
            {this.show ? <Icon type="close" style={iconStyle} /> : <Icon type="setting" style={iconStyle} />}
          </div>
        </template> */}
        <div class={`${baseClassName}-content`}>
          <Body title={i18n('app.setting.pagestyle')}>
            <BlockCheckbox
              i18nRender={i18n}
              list={themeList.themeList}
              value={theme}
              onChange={val => {
                changeSetting('theme', val)
              }}
            />
          </Body>

          <ThemeColor
            i18nRender={i18n}
            title={i18n('app.setting.themecolor')}
            value={primaryColor}
            colors={themeList.colorList[theme === 'realDark' ? 'dark' : 'light']}
            onChange={color => {
              changeSetting('primaryColor', color, null)
            }}
          />

          <Divider />

          <Body title={i18n('app.setting.navigationmode')}>
            <BlockCheckbox
              i18nRender={i18n}
              value={layout}
              onChange={value => {
                changeSetting('layout', value, null)
              }}
            />
          </Body>

          <LayoutSetting
            i18nRender={i18n}
            contentWidth={contentWidth}
            fixedHeader={fixedHeader}
            fixSiderbar={isTopMenu ? false : fixSiderbar}
            multiTab={multiTab}
            breadcrumb={breadcrumb}
            footerView={footerView}
            showFirstLevelMenu={showFirstLevelMenu}
            menuIconHorizontal={menuIconHorizontal}
            layout={layout}
            onChange={({ type, value }) => {
              changeSetting(type, value)
            }}
          />
          <Divider />

          <Body title={i18n('app.setting.othersettings')}>
            <List
              split={false}
              renderItem={item => renderLayoutSettingItem(h, item)}
              dataSource={[
                {
                  title: i18n('app.setting.weakmode'),
                  action: <Switch size="small" checked={!!colorWeak} onChange={checked => changeSetting('colorWeak', checked)} />
                }
              ]}
            />
          </Body>

          {hideHintAlert && hideCopyButton ? null : <Divider />}

          {hideHintAlert ? null : <Alert type="warning" message={i18n('app.setting.production.hint')} icon={<Icon type={'notification'} />} showIcon style={{ marginBottom: '16px' }} />}

          {/* {hideCopyButton ? null : (
            <CopyToClipboard
              text={genCopySettingJson(settings)}
              onCopy={() =>
                message.success(i18n('app.setting.copyinfo'))
              }
            >
              <Button block>
                <Icon type={'copy'} />{i18n('app.setting.copy')}
              </Button>
            </CopyToClipboard>
          )} */}

          <div class={`${baseClassName}-content-footer`}>{this.$slots.default}</div>
        </div>
      </Drawer>
    )
  },
  methods: {
    setShow(flag) {
      this.show = flag
    }
  }
}

SettingDrawer.install = function (Vue) {
  Vue.use(antPortal)
  Vue.component(SettingDrawer.name, SettingDrawer)
}

export default SettingDrawer
