<template>
  <div class="header-right-box" :class="wrpCls">
    <div v-if="layout === 'sidemenu' && showFirstLevelMenu" class="first-level-menu" :class="{'menu-line-height':!menuIconHorizontal}">
      <a-menu v-model="current" mode="horizontal">
        <a-menu-item @click="changeCurrentFirstLevelMenu(item)" v-for="item in rightContentMenus" :key="item.meta.menuId">
          <IconFont :type="item.meta.icon !== '#' ? item.meta.icon : 'iconfont-caidanguanli'" :class="{'icon-upon':!menuIconHorizontal}" />
          <span :class="{'menu-name-upon':!menuIconHorizontal}">{{ item.meta.title }}</span>
        </a-menu-item>
      </a-menu>
    </div>
    <div class="header-right-content" :class="{'header-msg-bkc': layout !== 'sidemenu'}">
      <a-badge :count="todoTotal" class="badge" @click="gotodo">
        <a-icon type="bell" class="icon" />
      </a-badge>
      <div class="selectBox">
        <a-dropdown :placement="'bottomCenter'" :trigger="['click']">
          <a class="ant-dropdown-link" @click="e => e.preventDefault()"
            ><Ellipsis :length="12" tooltip>{{ defaultModel }}</Ellipsis
            ><a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item v-for="item in items" :key="item.id" @click="handleChange(item.id)">
              <Ellipsis :length="12" tooltip>{{ item.name }}</Ellipsis>
            </a-menu-item>
            <a-menu-item>
              <div @click="addItem" class="addItem"><a-icon type="plus" class="addicon" />新建企业</div>
            </a-menu-item>
            <!-- <a-menu-item>
              <div @click="addApp" class="addApp"><a-icon type="appstore" class="appicon"/>新建应用</div>
            </a-menu-item> -->
          </a-menu>
        </a-dropdown>
      </div>
      <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />
    </div>
    <a-modal :visible="visible" @ok="handleOk" @cancel="handleCancel">
      <div slot="title">
        <a-icon type="usergroup-add" style="margin-right: 20px" />
        <span>新建企业</span>
      </div>
      <a-textarea placeholder="请输入企业名称" v-model="EnterpriseName" :autoSize="{ minRows: 2, maxRows: 6 }" />
    </a-modal>
  </div>
</template>

<script>
import defaultSettings from '../../../config/defaultSettings'
import AvatarDropdown from './AvatarDropdown.vue'
import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'
import { mapState, mapGetters, mapActions } from 'vuex'
import { IconFont } from '/src/components/IconFont/index.js'

export default {
  name: 'RightContent',
  components: {
    Ellipsis,
    AvatarDropdown,
    /* 企业菜单 */
    // VNodes: {
    //   functional: true,
    //   render: (h, ctx) => ctx.props.vnodes
    // },
    IconFont
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showMenu: true,
      currentUser: {},
      /* 企业 */
      items: [],
      /* 对话框 */
      visible: false,
      /* 企业名称 */
      EnterpriseName: '',
      /* 默认企业 */
      defaultModel: '',
      current: ['mail'],
      menuLineHeight: false,
      iconUpon: false,
      menuNameUpon: false
    }
  },
  methods: {
    ...mapActions(['_enterprise', '_addEnterprise', '_toggleEnterprise', 'SetCurrentLevelOneMenu']),
    gotodo() {
      this.$router.push('/todoItem/todo')
    },
    /* 新建企业 */
    addItem() {
      this.visible = true
    },
    handleOk(e) {
      this._addEnterprise({ name: this.EnterpriseName }).then(res => {
        if (res.code === 200) {
          this.visible = false
          this.$router.go(0)
        }
      })
    },
    /* 添加企业 */
    handleCancel(e) {
      this.EnterpriseName = ''
      this.visible = false
    },
    /* 切换企业 */
    handleChange(id) {
      this._toggleEnterprise(id).then(res => {
        if (res.code === 200) {
          this.visible = false
          this.$router.go(0)
        }
      })
    },
    /* 新建应用 */
    // addApp() {
    //   this.$router.push({ path: '/app/appCenter' })
    // },
    // 点击修改当前的一级菜单
    changeCurrentFirstLevelMenu(item) {
      this.SetCurrentLevelOneMenu([])
      if (!item.children) {
        this.$router.push({
          name: item.name
        })
      } else {
        this.SetCurrentLevelOneMenu([item])
        let routerName = null
        let firstChild = {}
        for (let i = 0; i < item.children.length; i++) {
          if(item.children[i].hidden === false){
            firstChild = item.children[i]
            break
          }
        }
        while(!routerName){
          if(!firstChild.children){
            routerName = firstChild.name
          }else{
            firstChild = firstChild.children[0]
          }
        }
        this.$router.push({
          name: routerName
        })
      }
    }
  },
  computed: {
    ...mapGetters(['todoTotal', 'addRouters', 'layout']),
    ...mapState({
      showFirstLevelMenu: state => state.app.showFirstLevelMenu,
      menuIconHorizontal: state => state.app.menuIconHorizontal
    }),
    wrpCls() {
      return {
        'ant-pro-global-header-index-right': true,
        'ant-pro-global-header-index-left': false,
        [`ant-pro-global-header-index-${this.isMobile || !this.topMenu ? 'light' : this.theme}`]: true,
        'self-info-flex': !this.showFirstLevelMenu
      }
    },
    rightContentMenus() {
      return this.addRouters[0].children.filter((item, index) => {
        return item.hidden !== true
      })
    }
  },
  mounted() {
    /* 获取企业 */
    this._enterprise().then(res => {
      this.items = res.data
      this.defaultModel = this.items[0].name
    })
    setTimeout(() => {
      this.currentUser = {
        name: 'Seal'
      }
    }, 1500)
  }
}
</script>
<style lang="less" scoped>
@import './RightContent.less';
.header-msg-bkc{
  .selectBox{
    /deep/ span,i{
      color: rgba(0, 0, 0, 0.65);
    }
  }
  /deep/ svg{
    color: rgba(0, 0, 0, 0.65);
  }
}
</style>
