<template>
  <div class="container">
    <div class="main">
      <div class="mainItem help">
        <div class="guide-title">新手引导</div>
        <i class="x-icon"><a-icon type="close" /></i>
        <div class="guide-content">
          <div class="step">
            <div class="action">
              <img :src="getImageUrl('../../../assets/img/lowCode/read/1.png')" alt="" />
              <div class="text-wrapper">
                <div class="num">1.</div>
                <div class="radius">了解~~~</div>
              </div>
            </div>
          </div>
          <div class="step">
            <div class="action">
              <img :src="getImageUrl('../../../assets/img/lowCode/read/2.png')" alt="" />
              <div class="text-wrapper">
                <div class="num">2.</div>
                <div class="radius">了解~~~</div>
              </div>
            </div>
          </div>
          <div class="step">
            <div class="action">
              <img :src="getImageUrl('../../../assets/img/lowCode/read/3.png')" alt="" />
              <div class="text-wrapper">
                <div class="num">3.</div>
                <div class="radius">了解~~~</div>
              </div>
            </div>
          </div>
          <div class="step">
            <div class="action">
              <img :src="getImageUrl('../../../assets/img/lowCode/read/4.png')" alt="" />
              <div class="text-wrapper">
                <div class="num">4.</div>
                <div class="radius">了解~~~</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mainItem flow-center-wrapper">
        <div class="todo" @click="todo">
          <div class="todo-wrapper">
            <div class="image-wrapper">
              <img :src="getImageUrlTodos('../../../assets/img/lowCode/todo/icon0.png')" alt="" />
            </div>
            <div class="todo-count">
              <div class="todo-count-text">我的待办</div>
              <div class="todo-count-number">{{ taskWaitCount }}</div>
            </div>
          </div>
        </div>
        <div class="flow-steps">
          <div class="step-wrapper" @click="myInitiate">
            <img :src="getImageUrlTodos('../../../assets/img/lowCode/todo/icon0.png')" alt="" />
            <div class="step-text">我发起的</div>
          </div>
          <div class="step-wrapper" @click="myTough">
            <img :src="getImageUrlTodos('../../../assets/img/lowCode/todo/icon1.png')" alt="" />
            <div class="step-text">我处理的</div>
          </div>
          <div class="step-wrapper" @click="myCC">
            <img :src="getImageUrlTodos('../../../assets/img/lowCode/todo/icon2.png')" alt="" />
            <div class="step-text">抄送我的</div>
          </div>
          <div class="step-wrapper" @click="newProcess">
            <img :src="getImageUrlTodos('../../../assets/img/lowCode/todo/icon3.png')" alt="" />
            <div class="step-text">发起新流程</div>
          </div>
        </div>
      </div>
      <div class="mainItem application">
        <div class="app-list">
          <div class="app-header">
            <div class="left">
              我的应用
              <!-- <a-icon type="setting" class="icon-shezhi" /> -->
            </div>
            <div class="right">
              <a-input-search placeholder="输入名称来搜索" @search="onSearch" allowClear />
              <a-button v-if="createTable" @click="visible = true" class="addbtn" icon="plus"> 新建应用 </a-button>
            </div>
          </div>
          <div class="add-content">
            <ul class="app-group">
              <li class="fx-app-item" @click="nextEos()" @mouseenter="mouseenter" @mouseleave="mouseleave">
                <div class="app-mine">
                  <div class="app-visit-area">
                    <div class="app-wrapper">
                      <img :src="webLogo" class="icon-wrapper" />
                      <div class="app-title">QS</div>
                    </div>
                  </div>
                  <div class="icon-set">
                    <a-icon type="setting" @click.stop="isShowSet = !isShowSet" />
                    <div class="settingAppList" v-if="isShowSet">
                      <ul class="app-menu-pane">
                        <li class="menu-item" @click.stop="eidtAppIcon(item)">修改图标</li>
                        <li class="menu-item" @click.stop="eidtAppName(item)">修改名称</li>
                        <li class="menu-item" @click.stop="deleteAppItem(item)">删除应用</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
              <li class="fx-app-item" v-for="item in AppList" :key="item.id" @click="nextApp(item)" @mouseenter="mouseenter" @mouseleave="mouseleave">
                <div class="app-mine">
                  <div class="app-visit-area">
                    <div class="app-wrapper">
                      <img :src="initAppIcon(item.icon * 1)" class="icon-wrapper" />
                      <div class="app-title">{{ item.appName }}</div>
                    </div>
                  </div>
                  <div class="icon-set">
                    <a-icon v-if="item.isEdit || item.isDelete" type="setting" @click.stop="isShowSet = !isShowSet" />
                    <div class="settingAppList" v-if="isShowSet">
                      <ul class="app-menu-pane">
                        <li v-if="item.isEdit" class="menu-item" @click.stop="eidtAppIcon(item)">修改图标</li>
                        <li v-if="item.isEdit" class="menu-item" @click.stop="eidtAppName(item)">修改名称</li>
                        <li v-if="item.isDelete" class="menu-item" @click.stop="deleteAppItem(item)">删除应用</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- 新建应用弹窗 -->
    <a-modal v-model="visible" title="新建应用" :footer="null" :width="720">
      <NewApp @createBlock="createBlock" @createTemplate="createTemplate" @createService="createService" />
    </a-modal>
    <!-- 创建空白应用弹窗 -->
    <a-modal v-model="BlockModal" title="创建空白应用" @ok="() => handleOk(showUpdate)" :width="550">
      <div class="blockCantainer">
        <div class="name">应用名称</div>
        <a-input placeholder="给应用命名，例如 “客户管理系统”" v-model="newAppName" />
        <div class="name">应用图标</div>
        <div>
          <img :src="activeIconSrc" style="width: 28px; height: 28px; vertical-align: middle" />
          <el-button plain size="mini" @click="dialogVisible = true" style="margin-left: 10px">选择图标</el-button>
        </div>
        <a-modal title="选择图标" :visible.sync="dialogVisible" width="612px">
          <img v-for="(icon, index) in iconList" :key="index" :src="icon.src" class="icon-item" :class="{ active: selectedIcon === icon.id }" @click="selectedIcon = icon.id" />
          <span slot="footer" class="dialog-footer">
            <el-button
              @click="
                dialogVisible = false
                selectedIcon = activeIcon
              "
              size="small"
              >取 消</el-button
            >
            <el-button
              type="primary"
              @click="
                dialogVisible = false
                activeIcon = selectedIcon
              "
              size="small"
              >确 定</el-button
            >
          </span>
        </a-modal>
      </div>
    </a-modal>
    <!-- 修改应用名称 -->
    <a-modal title="修改应用名称" :visible="EditAppNameVisible" @ok="EditAppNameOK" @cancel="EditAppNameVisible = false">
      <a-input placeholder="输入应用名称" v-model="EditNewAppName" allowClear />
    </a-modal>
  </div>
</template>

<script lang="jsx">
import { mapActions } from 'vuex'
import NewApp from '/src/views/appCenter/newApp/index.vue'
// import TemplateHbu from '/src/views/appCenter/templateHub/index.vue'
import { createdNewApp, updateApp, deleteAppItem } from '/src/api/enterprise/index.js'
import { getTaskListCount } from '/src/api/processDesign/index.js'

import webLogo from '/src/assets/img/logo.png'

const req = import.meta.globEager('/src/assets/img/lowCode/approverIcon/*.png')
const iconList = Object.keys(req).map((t, idx) => ({ src: req[t].default, id: idx }))

export default {
  components: { NewApp },
  data() {
    return {
      webLogo,
      /* 权限 */
      createTable: false,
      visible: false,
      BlockModal: false,
      /* App名称 */
      newAppName: '',
      AppList: [],
      isShowSet: false,
      EditAppNameVisible: false,
      EditNewAppName: '',
      AppItemId: null,
      /* 选择图标 */
      dialogVisible: false,
      iconList,
      activeIcon: iconList[0].id,
      selectedIcon: iconList[0].id,
      /* 判断是新建还是修改 */
      showUpdate: true,
      tenantApp: {},
      queryParams: {
        orderByColumn: 'create_time',
        isAsc: 'desc',
        pageNum: '1',
        pageSize: '99999'
      },
      /* 代办数量 */
      taskWaitCount: 0
    }
  },
  methods: {
    ...mapActions(['SetAppId']),
    getImageUrl(img) {
      const modules = import.meta.globEager('../../../assets/img/lowCode/read/*.png')
      return modules[img].default
    },
    getImageUrlTodos(img) {
      const modules = import.meta.globEager('../../../assets/img/lowCode/todo/*.png')
      return modules[img].default
    },
    /* 创建空白应用 */
    createBlock() {
      this.visible = false
      this.BlockModal = true
      this.showUpdate = true
    },
    /* 创建模板 */
    createTemplate() {
      this.$createAntdDrawer({
        stopPropagation: true,
        drawerProps: {
          title: '模板中心',
          width: '100%',
          height: '90%',
          maskClosable: true,
          placement: 'bottom',
          headerStyle: {
            position: 'sticky',
            top: '0',
            zIndex: '999',
            textAlign: 'center'
          },
          drawerStyle: {
            overflow: 'hidden',
            backgroundColor: '#f7f7f7'
          },
          bodyStyle: {
            padding: 0
          }
        },
        content: {
          template: TemplateHbu,
          on: {}
        }
      })
      this.visible = false
    },
    /* 定制 */
    createService() {},
    /* 新建空白应用提交 */
    handleOk(val) {
      if (val) {
        if (!this.newAppName) {
          return this.$message.warning('请输入应用名称')
        } else {
          createdNewApp({
            appName: this.newAppName,
            icon: this.activeIcon,
            tenantAppId: this.AppItemId
          }).then(res => {
            if (res.code === 200) {
              this.BlockModal = false
              this.initAppList()
            }
          })
        }
      } else {
        this.tenantApp = {
          id: this.AppItemId,
          tenantAppId: this.AppItemId,
          icon: this.activeIcon
        }
        updateApp(this.tenantApp).then(res => {
          if (res.code === 200) {
            this.BlockModal = false
            this.initAppList()
            this.tenantApp = {}
            return this.$message.success('修改成功')
          }
        })
      }
    },
    /* 搜索App */
    onSearch(val) {},
    /* 查询App列表 */
    initAppList() {
      this.SetAppId().then(res => {
        this.AppList = res.data.apps
        this.createTable = res.data.createTable
      })
    },
    /* 应用图标 */
    initAppIcon(tenantAppId) {
      const icon = iconList.find(t => t.id === tenantAppId)
      return icon ? icon.src : '/src/assets/img/lowCode/approverIcon/A (1).png'
    },
    /* 进入App */
    nextApp(item) {
      this.$router.push({
        path: '/saas/app/' + item.tenantAppId
      })
    },
    mouseenter() {},
    /* 移出关闭设置窗 */
    mouseleave() {
      this.isShowSet = false
    },
    /* 修改图标 */
    eidtAppIcon(item) {
      this.BlockModal = true
      this.newAppName = item.appName
      if (item.icon !== undefined && item.icon !== null && item.icon.indexOf('http') === -1) {
        this.selectedIcon = iconList[item.icon * 1].id
        this.activeIcon = iconList[item.icon * 1].id
      } else {
        this.selectedIcon = 0
        this.activeIcon = 0
      }
      this.AppItemId = item.tenantAppId
      this.showUpdate = false
    },
    /* 修改名称 */
    eidtAppName(item) {
      this.EditNewAppName = item.appName
      this.AppItemId = item.tenantAppId
      this.isShowSet = false
      this.EditAppNameVisible = true
    },
    /* 修改名称提交 */
    EditAppNameOK() {
      this.tenantApp = {
        tenantAppId: this.AppItemId,
        appName: this.EditNewAppName
      }
      updateApp(this.tenantApp).then(res => {
        if (res.code === 200) {
          this.EditAppNameVisible = false
          this.EditNewAppName = ''
          this.initAppList()
          this.tenantApp = {}
          return this.$message.success('修改成功')
        }
      })
    },
    /* 删除应用 */
    deleteAppItem(item) {
      this.AppItemId = item.tenantAppId
      deleteAppItem(this.AppItemId).then(res => {
        if (res.code === 200) {
          this.initAppList()
          return this.$message.warning('删除成功')
        }
      })
    },
    nextEos() {
      this.$router.push('/index')
    },
    /* 我的代办 */
    todo() {
      this.$router.push({
        name: 'todoElement',
        params: {
          id: 0
        }
      })
    },
    /* 我发起的 */
    myInitiate() {
      this.$router.push({
        name: 'todoElement',
        params: {
          id: 1
        }
      })
    },
    /* 我处理的 */
    myTough() {
      this.$router.push({
        name: 'todoElement',
        params: {
          id: 2
        }
      })
    },
    /* 我的抄送 */
    myCC() {
      this.$router.push({
        name: 'todoElement',
        params: {
          id: 3
        }
      })
    },
    /* 新流程 */
    newProcess() {
      this.$router.push({
        name: 'todoElement',
        params: {
          id: 4
        }
      })
    }
  },
  computed: {
    activeIconSrc() {
      const icon = iconList.find(t => t.id === this.activeIcon)
      return icon ? icon.src : '/src/assets/img/lowCode/approverIcon/A (1).png'
    }
  },
  created() {
    /* 获取代办数量 */
    getTaskListCount(this.queryParams).then(res => {
      this.taskWaitCount = res.taskWaitCount
    })
  },
  mounted() {
    this.initAppList()
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
.icon-item {
  width: 40px;
  height: 40px;
  margin: 6px;
  position: relative;
  cursor: pointer;
  opacity: 0.5;

  &.active {
    opacity: 1;
  }
  &:hover {
    opacity: 1;
  }
}
</style>
