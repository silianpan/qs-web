import PropTypes from 'ant-design-vue/es/_util/vue-types'

import 'ant-design-vue/es/tooltip/style'
import Tooltip from 'ant-design-vue/es/tooltip'
import 'ant-design-vue/es/list/style'
import List from 'ant-design-vue/es/list'
import ListItem from 'ant-design-vue/es/list/Item.js'
import 'ant-design-vue/es/select/style'
import Select from 'ant-design-vue/es/select'
import 'ant-design-vue/es/switch/style'
import Switch from 'ant-design-vue/es/switch'

export const renderLayoutSettingItem = (h, item) => {
  const action = { ...item.action }
  return (
    <Tooltip title={item.disabled ? item.disabledReason : ''} placement="left">
      <ListItem actions={[action]}>
        <span style={{ opacity: item.disabled ? 0.5 : 1 }}>{item.title}</span>
      </ListItem>
    </Tooltip>
  )
}

export const LayoutSettingProps = {
  contentWidth: PropTypes.oneOf(['Fluid', 'Fixed']).def('Fluid'),
  fixedHeader: PropTypes.bool,
  fixSiderbar: PropTypes.bool,
  multiTab: PropTypes.bool,
  breadcrumb: PropTypes.bool,
  footerView: PropTypes.bool,
  showFirstLevelMenu: PropTypes.bool,
  menuIconHorizontal: PropTypes.bool,
  layout: PropTypes.oneOf(['sidemenu', 'topmenu']),

  i18nRender: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(false)
}

export default {
  props: LayoutSettingProps,
  inject: ['locale'],
  render(h) {
    const i18n = this.$props.i18nRender || this.locale
    const { contentWidth, fixedHeader, layout, fixSiderbar, multiTab, breadcrumb, footerView, showFirstLevelMenu, menuIconHorizontal } = this

    const handleChange = (type, value) => {
      this.$emit('change', { type, value })
    }

    return (
      <List
        split={false}
        dataSource={[
          {
            title: i18n('app.setting.content-width'),
            action: (
              <Select value={contentWidth} size="small" onSelect={value => handleChange('contentWidth', value)} style={{ width: '80px' }}>
                {layout === 'sidemenu' ? null : <Select.Option value="Fixed">{i18n('app.setting.content-width.fixed')}</Select.Option>}
                <Select.Option value="Fluid">{i18n('app.setting.content-width.fluid')}</Select.Option>
              </Select>
            )
          },
          {
            title: i18n('app.setting.fixedheader'),
            action: <Switch size="small" checked={!!fixedHeader} onChange={checked => handleChange('fixedHeader', checked)} />
          },
          {
            title: i18n('app.setting.fixedsidebar'),
            disabled: layout === 'topmenu',
            disabledReason: i18n('app.setting.fixedsidebar.hint'),
            action: <Switch size="small" disabled={layout === 'topmenu'} checked={!!fixSiderbar} onChange={checked => handleChange('fixSiderbar', checked)} />
          },
          {
            title: i18n('app.setting.multitab'),
            disabledReason: i18n('app.setting.fixedsidebar.hint'),
            action: <Switch size="small" checked={!!multiTab} onChange={checked => handleChange('multiTab', checked)} />
          },
          {
            title: i18n('app.setting.breadcrumb'),
            disabledReason: i18n('app.setting.fixedsidebar.hint'),
            action: <Switch size="small" checked={!!breadcrumb} onChange={checked => handleChange('breadcrumb', checked)} />
          },
          {
            title: i18n('app.setting.footerView'),
            disabledReason: i18n('app.setting.fixedsidebar.hint'),
            action: <Switch size="small" checked={!!footerView} onChange={checked => handleChange('footerView', checked)} />
          },
          {
            title: i18n('app.setting.showFirstLevelMenu'),
            disabledReason: i18n('app.setting.fixedsidebar.hint'),
            action: <Switch size="small" checked={!!showFirstLevelMenu} onChange={checked => handleChange('showFirstLevelMenu', checked)} />
          },
          {
            title: i18n('app.setting.menuIconHorizontal'),
            disabledReason: i18n('app.setting.fixedsidebar.hint'),
            action: <Switch size="small" checked={!!menuIconHorizontal} onChange={checked => handleChange('menuIconHorizontal', checked)} />
          }
        ]}
        renderItem={(item, index) => renderLayoutSettingItem(h, item)}
      />
    )
  }
}
