import './MenuTree.less'
import { IconFont } from '/src/components/IconFont/index.js'
const httpReg = /(http|https|ftp):\/\/([\w.]+\/?)\S*/

export default {
  name: 'STreeNodeList',
  props: {
    nodeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  methods: {
    // 渲染顶部首页按钮
    renderHome(h, item, i18nRender) {
      const meta = Object.assign({}, item.meta)
      return <Button>{meta.title}</Button>
    },
    renderTitle(h, title, i18nRender) {
      return <span>{(i18nRender && i18nRender(title)) || title}</span>
    },
    renderIcon(h, icon) {
      if (icon === undefined || icon === 'none' || icon === null) {
        return null
      }
      const props = {}
      typeof icon === 'object' ? (props.component = icon) : (props.type = icon)
      return <IconFont {...{ props }} />
    },
    renderMenu(h, item, i18nRender) {
      if (item && !item.hidden) {
        if (item.meta && item.meta.home) {
          return this.renderHome(h, item, i18nRender)
        } else {
          const bool = item.children && !item.hideChildrenInMenu
          return bool ? this.renderSubMenu(h, item, i18nRender) : this.renderMenuItem(h, item, i18nRender)
        }
      }
      return null
    },
    renderSubMenu(h, item, i18nRender) {
      return (
        <a-tree-node icon={this.renderIcon(h, item.meta.icon)} class="app-container-child-node" key={item.menuId}>
          {!item.hideChildrenInMenu && item.children.map(cd => this.renderMenu(h, cd, i18nRender))}
          <template slot="title">
            <span>
              <span>{this.renderTitle(h, item.meta.title, i18nRender)}</span>
            </span>
            <div class="child-popover">
              <a-popover
                placement="bottom"
                trigger="click"
                autoAdjustOverflow
                onClick={event => {
                  event.stopPropagation() // 阻止onClick事件冒泡
                }}
              >
                <a-icon class="right-icon" type="setting" />
                <template slot="content" style={{ padding: '5px' }}>
                  <a-menu mode="vertical" style={{ borderRight: '0' }} onClick={menuKey => this.handlechildMenu(menuKey, item)}>
                    <a-menu-item key="1">{'新建子分组'}</a-menu-item>
                    <a-menu-item key="2">{'编辑分组'}</a-menu-item>
                    <a-sub-menu key="sub1">
                      <span slot="title">
                        <span>{'新建表单'}</span>
                      </span>
                      <a-menu-item key="3">{'新建普通表单'}</a-menu-item>
                      <a-menu-item key="4">{'新建流程表单'}</a-menu-item>
                    </a-sub-menu>
                    <a-menu-item key="5" style={{ color: 'red' }}>
                      {'删除'}
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-popover>
            </div>
          </template>
        </a-tree-node>
      )
    },
    // 叶子
    renderMenuItem(h, item, i18nRender) {
      const meta = Object.assign({}, item.meta)
      const target = meta.target || null
      const hasRemoteUrl = httpReg.test(item.path)
      const CustomTag = (target && 'a') || 'router-link'
      const props = {
        to: {
          name: item.name,
          params: {
            menuId: item.menuId,
            menuName: meta.title
          }
        }
      }
      const attrs = hasRemoteUrl || target ? { href: item.path, target: target } : {}
      if (item.children && item.hideChildrenInMenu) {
        // 把有子菜单的 并且 父菜单是要隐藏子菜单的
        // 都给子菜单增加一个 hidden 属性
        // 用来给刷新页面时， selectedKeys 做控制用
        item.children.forEach(cd => {
          cd.meta = Object.assign(cd.meta || {}, { hidden: true })
        })
      }
      return (
        <a-tree-node icon={this.renderIcon(h, item.meta.icon)} key={item.menuId} class="app-container-tree-node" is-leaf style="width: 100%">
          <template slot="title">
            <CustomTag {...{ props, attrs }}>{this.renderTitle(h, meta.title, i18nRender)}</CustomTag>
            <div class="leaf-popover">
              <a-popover
                overlayClassName={'app-container-popover'}
                placement="bottom"
                trigger="click"
                autoAdjustOverflow
                onClick={event => {
                  event.stopPropagation() // 阻止onClick事件冒泡
                }}
              >
                <a-icon class="right-icon" type="setting" />
                <template slot="content" style={{ padding: '5px' }}>
                  <a-menu mode="vertical" style={{ borderRight: '0' }} onClick={key => this.handleLeafMenu(key, item)}>
                    <a-menu-item key="1">{'编辑表单'}</a-menu-item>
                    <a-menu-item key="2" style={{ color: 'red' }}>
                      {'删除表单'}
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-popover>
            </div>
          </template>
        </a-tree-node>
      )
    }
  },
  render(h) {
    const menuItems = this.nodeList.map(item => {
      if (item.hidden) {
        return null
      }
      return this.renderMenu(h, item, null)
    })
    return (
      <a-directory-tree multiple class="app-container-tree">
        {menuItems}
      </a-directory-tree>
    )
  }
}
