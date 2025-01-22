<template>
  <div class="navContainer">
    <div class="navigation-left">
      <router-link to="/index" class="header-text">
        <div class="menu-icon"></div>
        {{ this.$route.fullPath !== '/saas/contacts' ? '工作台' : '👈 团队管理' }}
      </router-link>
      <div class="selectBox" v-if="this.$route.fullPath !== '/saas/contacts'">
        <a-dropdown>
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">{{ defaultModel }} <a-icon type="down" /> </a>
          <a-menu slot="overlay">
            <a-menu-item v-for="item in items" :key="item.id" @click="handleChange(item.id)">
              {{ item.name }}
            </a-menu-item>
            <a-menu-item>
              <div @click="addItem" class="addItem"><a-icon type="plus" class="addicon" />新建企业</div>
            </a-menu-item>
            <a-menu-item>
              <div @click="addApp" class="addApp"><a-icon type="appstore" class="appicon" />新建应用</div>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
    <div class="navigation-right">
      <div class="comp-item" v-if="this.$route.fullPath !== '/saas/contacts'">
        <a-button class="button"> 自定义工作台 </a-button>
      </div>
      <div v-userPerms="userPermsObj" class="comp-item" @click="goContacts" v-if="this.$route.fullPath !== '/saas/contacts'">
        <a-tooltip>
          <template slot="title"> 通讯录 </template>
          <a-icon type="layout" theme="filled" style="font-size: 20px" />
        </a-tooltip>
      </div>
      <div class="comp-item">
        <a-tooltip>
          <template slot="title"> 消息 </template>
          <a-badge :dot="true" :offset="[-5, 3]">
            <a-icon type="bell" theme="filled" style="font-size: 20px" />
          </a-badge>
        </a-tooltip>
      </div>
      <div class="comp-item">
        <a-tooltip>
          <template slot="title"> 帮助 </template>
          <a-icon type="question-circle" theme="filled" style="font-size: 20px" />
        </a-tooltip>
      </div>
      <div class="comp-item">
        <a-dropdown placement="bottomRight">
          <span>
            <a-space>
              <a-avatar :src="avatar" v-if="avatar !== null" />
              <a-avatar
                :src="imgAvatar"
                v-else
              />
            </a-space>
          </span>
          <template v-slot:overlay>
            <a-menu :selected-keys="[]">
              <a-menu-item v-if="menu" key="center" @click="handleToCenter">
                <a-icon type="user" />
                个人中心
              </a-menu-item>
              <a-menu-item v-if="menu" key="settings" @click="handleToSettings">
                <a-icon type="setting" />
                个人设置
              </a-menu-item>
              <a-menu-divider v-if="menu" />
              <a-menu-item key="logout" @click="handleLogout">
                <a-icon type="logout" />
                退出登录
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
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
import { Modal } from 'ant-design-vue'
import { mapGetters, mapActions } from 'vuex'
import { timeFix } from '/src/utils/common/util.js'
import imgAvatar from '/src/assets/img/avatar.png'

export default {
  props: {
    menu: {
      type: Boolean,
      default: true
    }
  },
  components: {
    /* 企业菜单 */
    // VNodes: {
    //   functional: true,
    //   render: (h, ctx) => ctx.props.vnodes
    // }
  },
  data() {
    return {
      imgAvatar,
      userPermsObj: { bindingPerms: 'contract' },
      timeFix: timeFix(),
      /* 企业 */
      items: [],
      /* 对话框 */
      visible: false,
      /* 企业名称 */
      EnterpriseName: '',
      /* 默认企业 */
      defaultModel: ''
    }
  },
  computed: {
    ...mapGetters(['avatar', 'nickname', 'sex', 'postGroup', 'todoTotal'])
  },
  methods: {
    ...mapActions(['_enterprise', '_addEnterprise', '_toggleEnterprise']),
    handleToCenter() {
      this.$router.push({ path: '/account/center' })
    },
    handleToSettings() {
      this.$router.push({ path: '/account/settings' })
    },
    handleLogout(e) {
      Modal.confirm({
        title: '提示',
        content: '确定注销并退出系统吗？',
        onOk: () => {
          return this.$store.dispatch('Logout').then(() => {
            location.href = '/qs/index'
          })
        },
        onCancel() {}
      })
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
    addApp() {
      this.$router.push({ path: '/app/appCenter' })
    },
    /* 通讯录 */
    goContacts() {
      this.$router.push({ path: '/saas/contacts' })
    }
  },
  mounted() {
    /* 获取企业 */
    this._enterprise().then(res => {
      this.items = res.data
      this.defaultModel = this.items[0].name
    })
  },
  created() {}
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>
