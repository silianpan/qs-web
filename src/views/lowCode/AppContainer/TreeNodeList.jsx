import { getFormDetail, deleteForm } from '/src/api/processDesign/index.js'
// 获取图标
const req = import.meta.globEager('/src/assets/img/lowCode/approverIcon/*.png')
const iconList = Object.keys(req).map((t, idx) => ({ src: req[t].default, id: idx }))

export default {
  name: 'STreeNodeList',
  props: {
    nodeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      /* 图标 */
      iconList
    }
  },
  methods: {
    // 处理叶子节点的菜单
    handleLeafMenu(key, item) {
      // 编辑
      if (key.key === '1') {
        // 判断表单类型：普通表单和流程表单
        const pushName = item.type === 'flow' ? 'processFormDesign' : 'formDesign'
        this.$router.push({
          name: pushName,
          params: {
            id: this.$route.params.id,
            formid: item.id
          }
        })
        // 删除
      } else if (key.key === '2') {
        deleteForm({ formId: item.id, tenantAppId: this.$route.params.id }).then(res => {
          if (res.code === 200) {
            // 重新再拿一次数据
            this.$emit('fresh')
            return this.$message.success('删除成功')
          }
        })
      }
    },
    // 处理子菜单
    handlechildMenu(menuKey, item) {
      // 新建子菜单
      if (menuKey.key === '1') {
        this.$emit('handleMenu', {
          type: 'createchildGroup',
          data: item
        })
        // 编辑分组
      } else if (menuKey.key === '2') {
        this.$emit('handleMenu', {
          type: 'editChildGroup',
          data: item
        })
      } else if (menuKey.key === '3') {
        this.$emit('handleMenu', {
          type: 'createForm',
          data: item
        })
      } else if (menuKey.key === '4') {
        this.$emit('handleMenu', {
          type: 'createFlowForm',
          data: item
        })
      } else if (menuKey.key === '5') {
        this.$emit('handleMenu', {
          type: 'deleteChildGroup',
          data: item
        })
      }
    },
    // 叶子节点的点击事件回调
    leafSelect(selectKeys) {
      getFormDetail({ formId: selectKeys[0], tenantAppId: this.$route.params.id }).then(res => {
        this.$emit('getFormData', res.formData)
      })
    },
    // children节点图标
    getIcon(props) {
      const { expanded } = props
      return <icon-font style={{ fontSize: '18px' }} class={'Iconfont'} type={expanded ? 'iconfont-folder-open-fill' : 'iconfont-folder-fill'} />
    },
    // 叶子节点图标
    setLeafIcon(item) {
      const i = this.iconList.find(t => t.id === item.icon)
      return <img src={i.src} class="menuIcon" />
    },
    renderMenu(h, item) {
      return item.children || item.type === 'group' ? this.renderSubMenu(h, item) : this.renderMenuItem(h, item)
    },
    renderSubMenu(h, item) {
      // 新建分组的情况
      if (!item.children) {
        return (
          <a-tree-node class="app-container-child-node" icon={this.getIcon} key={item.id}>
            <template slot="title">
              <span>{item.name}</span>
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
      } else {
        return (
          <a-tree-node class="app-container-child-node" icon={this.getIcon} key={item.id}>
            {item.children.map(cd => this.renderMenu(h, cd))}
            <template slot="title">
              <span>{item.name}</span>
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
      }
    },
    // 叶子
    renderMenuItem(h, item) {
      return (
        <a-tree-node key={item.id} icon={this.setLeafIcon(item)} class="app-container-tree-node" is-leaf style="display: inline-block; width: 100%">
          <template slot="title">
            <span>{item.name}</span>
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
    return (
      <a-directory-tree
        onMouseenter={e => {
          e.node.$el.querySelector('.right-icon').style.display = 'inline-block'
        }}
        onMouseleave={e => {
          e.node.$el.querySelector('.right-icon').style.display = 'none'
        }}
        onSelect={this.leafSelect}
        multiple
        default-expand-all
        class="app-container-tree"
      >
        {this.nodeList.map(item => this.renderMenu(h, item))}
      </a-directory-tree>
    )
  }
}
