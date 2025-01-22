<template>
  <a-layout class="app-container">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible :collapsedWidth="0" width="270">
      <div class="toggleCollapsed" :class="collapsed ? 'isCollapsed' : ''" @click="toggleCollapsed">
        <a-icon :type="collapsed ? 'menu-unfold' : 'menu-fold'" />
      </div>
      <div class="menu-tool">
        <div class="search-input">
          <a-input-search placeholder="输入名称来搜索" size="small" />
        </div>
        <div class="add-btn">
          <a-dropdown :trigger="['click']">
            <a-button icon="plus" type="primary" size="small"> 新建 </a-button>
            <template #overlay>
              <a-menu @click="handleClickNewMenu">
                <a-menu-item :key="0">新建表单</a-menu-item>
                <a-menu-item :key="1">新建流程表单</a-menu-item>
                <a-menu-divider />
                <a-menu-item :key="2">新建分组</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
      <a-menu class="member-all" :selectedKeys="selectedKeys" mode="inline" theme="light" :inline-collapsed="collapsed" @click="hanlderMenu">
        <a-menu-item class="app-menu" :key="item.id" v-for="item in entryList">
          <div class="MenuStyle">
            <div class="left">
              <img :src="initIcon(item.icon)" class="menuIcon" />
              <span> {{ item.name }}</span>
            </div>
            <div class="right">
              <a-popover placement="leftTop" v-model="editAdminGroup" trigger="hover">
                <div><a-icon type="setting" /></div>
                <template slot="content">
                  <div><a-button type="link" @click="editFrom(item)"> 编辑表单 </a-button></div>
                  <div><a-button type="link" style="color: red" @click="deleteGroupItem(item.id)"> 删除 </a-button></div>
                </template>
              </a-popover>
            </div>
          </div>
        </a-menu-item>
      </a-menu>
      <!--<STreeNodeList-->
      <!--:nodeList="entryList"-->
      <!--@getFormData="-->
      <!--data => {-->
      <!--formData = data-->
      <!--}-->
      <!--"-->
      <!--@fresh="-->
      <!--() => {-->
      <!--this.initMenuList()-->
      <!--}-->
      <!--"-->
      <!--@handleMenu="handlechildMenu"-->
      <!--/>-->
      <div class="app-manage" @click="toManage">
        <icon-font class="iconfont app-manage-icon" type="iconfont-shezhi" />
        <a-button class="app-manage-btn" type="link">后台管理</a-button>
      </div>
    </a-layout-sider>
    <a-layout>
      <a-layout-content>
        <!-- 新建表单组弹窗 -->
        <a-modal width="450px" :visible="formGroupVisible" @ok="formGroup_handleOk" @cancel="formGroup_handleCancel">
          <p>分组名称</p>
          <a-input placeholder="输入分组名称" allowClear v-model="formGroupName" />
        </a-modal>
        <FromElement :element="formData" ref="formElement" @isSubmit="isSubmitButton" :formId="tformId" />
      </a-layout-content>
      <a-layout-footer>
        <el-button-group v-if="isSubmit">
          <el-button type="primary" @click="submitFrom">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-button-group>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
// import STreeNodeList from './TreeNodeList.jsx'
import FromElement from '../components/formElement/index.jsx'
import { getFormMenuList, getFormDetail, deleteForm, dataCreate, createdFrom, updateForm } from '/src/api/processDesign/index.js'
const req = import.meta.globEager('/src/assets/img/lowCode/approverIcon/*.png')
const iconList = Object.keys(req).map((t, idx) => ({ src: req[t].default, id: idx }))

export default {
  name: 'AppContainer',
  components: { FromElement },
  data() {
    return {
      collapsed: false,
      editAdminGroup: false,
      entryList: [],
      entryList2: [
        {
          id: 1,
          name: '项目管理',
          icon: 1,
          children: [
            {
              id: 2,
              name: '项目立项',
              icon: 2,
              children: [
                {
                  id: 3,
                  name: '商机跟踪',
                  icon: 3
                }
              ]
            },
            {
              id: 4,
              name: '综合查询',
              icon: 4
            }
          ]
        },
        {
          id: 5,
          name: '合同管理',
          icon: 5,
          children: [
            {
              id: 6,
              name: '合同审批',
              icon: 6
            }
          ]
        }
      ],
      selectedKeys: [],
      /* 图标 */
      iconList,
      formData: {},
      isSetting: false,
      isSubmit: true,
      tformId: null,
      // 表单组名
      formGroupName: '',
      // 控制表单组显隐
      formGroupVisible: false,
      // 组件传上来的数据
      retData: null
    }
  },
  methods: {
    // 处理表单组的回调
    handlechildMenu(item) {
      if (item.type === 'createchildGroup') {
        this.formGroupName = ''
        this.retData = item
        this.formGroupVisible = true
      } else if (item.type === 'editChildGroup') {
        this.formGroupName = ''
        this.formGroupName = item.data.name
        this.retData = item
        this.formGroupVisible = true
      }
    },
    // 新建表单组提交
    formGroup_handleOk() {
      if (this.isEmpty(this.formGroupName)) {
        return this.$message.warning('分组名称不能为空')
        // 外层的操作 只有新增
      } else if (this.isEmpty(this.retData)) {
        const defaultData = {
          tenantAppId: this.$route.params.id,
          type: 'group',
          parentId: '-1',
          basicSetting: {
            flowName: this.formGroupName
          }
        }
        createdFrom(defaultData).then(res => {
          if (res.code === 200) {
            this.formGroupName = ''
            this.formGroupVisible = false
            this.initMenuList()
            return this.$message.success('创建成功')
          }
        })
      } else {
        if (this.retData.type === 'createchildGroup') {
          const defaultData = {
            tenantAppId: this.$route.params.id,
            type: 'group',
            parentId: this.retData.data.id,
            basicSetting: {
              flowName: this.formGroupName
            }
          }
          createdFrom(defaultData).then(res => {
            if (res.code === 200) {
              this.formGroupName = ''
              this.formGroupVisible = false
              this.initMenuList()
              return this.$message.success('创建成功')
            }
          })
        } else {
          const defaultData = {
            formId: this.$route.params.formid,
            tenantAppId: this.$route.params.id,
            type: 'group',
            parentId: '-1',
            basicSetting: {
              flowName: this.formGroupName,
              flowId: this.retData.data.id
            }
          }
          updateForm(defaultData).then(res => {
            if (res.code === 200) {
              this.formGroupName = ''
              this.retData = ''
              this.formGroupVisible = false
              this.initMenuList()
              return this.$message.success('编辑成功')
            }
          })
        }
      }
    },
    // 新建表单组关闭
    formGroup_handleCancel() {
      this.formGroupName = ''
      this.retData = ''
      this.formGroupVisible = false
    },
    // 跳转后台管理页面
    toManage() {
      this.$router.push('/saas/formBackGround/' + this.$route.params.id)
    },
    // 新建表单、流程表单事件
    handleClickNewMenu(menuInfo) {
      const { key } = menuInfo
      if (key === 0) {
        this.createdApp()
      } else if (key === 1) {
        this.createdProcessApp()
      } else if (key === 2) {
        this.createFormgroup()
      }
    },
    toggleCollapsed() {
      this.collapsed = !this.collapsed
    },
    // 创建分组
    createFormgroup() {
      this.formGroupName = ''
      this.formGroupVisible = true
    },
    createdProcessApp() {
      this.$router.push({
        path: '/saas/process/formDesign/' + this.$route.params.id
      })
    },
    createdApp() {
      this.$router.push({
        name: 'formDesign',
        params: {
          id: this.$route.params.id,
          formid: 'null'
        }
      })
    },
    /* 编辑表单 */
    editFrom(item) {
      // 判断表单类型：普通表单和流程表单
      const pushName = item.type === 'flow' ? 'processFormDesign' : 'formDesign'
      this.$router.push({
        name: pushName,
        params: {
          id: this.$route.params.id,
          formid: item.id
        }
      })
      this.editAdminGroup = false
    },
    /* 删除应用 */
    deleteGroupItem(formid) {
      deleteForm({ formId: formid, tenantAppId: this.$route.params.id }).then(res => {
        if (res.code === 200) {
          this.initMenuList()
          return this.$message.success('删除成功')
        }
      })

      this.editAdminGroup = false
    },
    /* 菜单回调 */
    hanlderMenu(item) {
      this.selectedKeys = item.keyPath ? item.keyPath : item
      this.tformId = this.selectedKeys[0]
      if (!this.isEmpty(this.selectedKeys[0])) {
        getFormDetail({ formId: this.selectedKeys[0], tenantAppId: this.$route.params.id }).then(res => {
          this.formData = res.formData
        })
      }
    },
    /* 表单图标 */
    initIcon(icon) {
      const i = this.iconList.find(t => t.id === icon)
      return i.src
    },
    /* 提交 */
    submitFrom() {
      this.$refs.formElement.submitForm(formData => {
        dataCreate({ tenantAppId: this.$route.params.id, formId: this.selectedKeys[0], fields: formData }).then(res => {
          if (res.code === 200) {
            this.$message.success('提交成功')
          }
        })
      })
    },
    // 重置表单
    resetForm() {
      this.$refs.formElement.resetForm()
    },
    /* 请求菜单列表 */
    initMenuList() {
      getFormMenuList({ tenantAppId: this.$route.params.id }).then(res => {
        this.entryList = res.entryList
        if (res.entryList !== undefined && res.entryList !== null && res.entryList.length > 0) {
          this.selectedKeys[0] = res.entryList[0].id
          this.hanlderMenu(this.selectedKeys)
        }
      })
    },
    /* 是否隐藏提交按钮 */
    isSubmitButton(val) {
      this.isSubmit = val
    }
  },
  mounted() {
    this.initMenuList()
  },
  watch: {}
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
