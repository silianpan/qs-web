<template>
  <section v-if="show" class="h-transfer" :class="[tabConfig.length == 1 ? 'single-tab' : '']">
    <div class="mask"></div>
    <!-- 内容面板 -->
    <div class="transfer__content">
      <!-- 面板顶部标题 -->
      <header class="transfer__header">
        <i class="el-icon-monitor"></i>
        {{ title }}
        <i class="el-icon-close" @click="closeTransfer"></i>
      </header>
      <!-- 穿梭框主要内容 -->
      <div class="transfer__body">
        <!-- 左边穿梭框 -->
        <div class="transfer-pane">
          <div class="transfer-pane__tools">
            <el-input v-model="searchString" class="search-input" size="mini" style="width: 180px" type="search" placeholder="搜索人员" :disabled="!searchable"></el-input>
            <span>
              <span style="margin-right: 1rem; font-size: 14px">{{ selectedNum }} / {{ maxNum }}</span>
              <el-tooltip placement="top" content="清空">
                <i class="el-icon-delete" @click="removeAll"></i>
              </el-tooltip>
            </span>
          </div>
          <el-scrollbar class="transfer-pane__body shadow right-pane">
            <template v-for="type in tabKeys">
              <div v-for="(item, index) in selectedData[type]" :key="type + index" class="selected-item">
                <span>
                  <!-- <i v-if="item.deptName" class="iconfont iconbumen"></i>
                  <i v-else class="iconfont iconyuangong"></i> &nbsp; -->
                  <span>{{ getNodeProp(item, 'label') }}</span>
                </span>
                <i class="el-icon-delete" @click="removeData(item, type)"></i>
              </div>
            </template>
            <template v-for="type in tabKeys">
              <div v-for="(item, index) in aloneCheckedData[type]" :key="'alone' + type + index" class="selected-item">
                <span>
                  <!-- <i v-if="item.deptName" class="iconfont iconbumen"></i>
                  <i v-else class="iconfont iconyuangong"></i> &nbsp; -->
                  <span>{{ getNodeProp(item, 'label') }}</span>
                </span>
                <i class="el-icon-delete" @click="removeData(item, type, true)"></i>
              </div>
            </template>
          </el-scrollbar>
          <footer class="transfer__footer">
            <el-button type="info" plain size="mini" @click="confirm">确定</el-button>
            <el-button plain size="mini" @click="closeTransfer">取消</el-button>
          </footer>
        </div>
        <!-- 右边穿梭框 -->

        <div class="transfer-pane">
          <!-- 操作栏 -->
          <!-- <div class="transfer-pane__tools">
          </div> -->
          <!-- 穿梭框 -->
          <div class="transfer-pane__body" style="height: 370px">
            <div class="enough-mask" v-show="isEnough">
              <span class="p-center">最多选择{{ maxNum }}项</span>
            </div>
            <div class="searchResPane" :class="{ active: searchMode }" v-loading="searchLoading">
              <div class="hidden-tag" @click="searchString = ''">关闭</div>
              <div v-for="(item, index) in searchRes" :key="index" class="item">
                <div>
                  <div>{{ getNodeProp(item, 'label') }}</div>
                  <div class="text-ellipsis search-res-tip">
                    {{ getNodeProp(item, 'searchResTip') }}
                  </div>
                </div>
                <el-checkbox @change="checked => (checked ? addData(item) : removeData(item, activeTabName, true))"></el-checkbox>
              </div>
            </div>

            <el-scrollbar style="height: 100%">
              <el-tabs v-model="activeTabName" type="border-card" style="min-height: 370px">
                <el-tab-pane v-for="(tab_item, idx) in tabConfig" :name="tab_item.tabKey" :label="tab_item.tabName" :key="idx">
                  <div :class="{ orgTrans_selectTree: tab_item.tabKey === 'user' }">
                    <!-- 将tree设置为默认展开的原因是删除时不展开 selectData不能渲染-->
                    <el-tree
                      :data="treeData"
                      :ref="tab_item.tabKey"
                      show-checkbox
                      :props="{
                        children: tab_item.children,
                        label: tab_item.label,
                        isLeaf: tab_item.isLeaf,
                        disabled: tab_item.disabled
                      }"
                      default-expand-all
                      node-key="nodeId"
                      :check-strictly="true"
                      @check-change="(data, checked) => onCheckChange(data, checked, tab_item.tabKey)"
                      @node-click="handleNodeClick"
                    >
                    </el-tree>
                  </div>
                  <div v-if="tab_item.tabKey === 'user'" class="orgTrans_selected">
                    <el-table ref="selectTable" :row-key="tab_item.nodeId" :data="tableData" @selection-change="data => handleSelectChange(data, tab_item.tabKey)">
                      <el-table-column :reserve-selection="true" type="selection" />
                      <el-table-column prop="nickName" label="姓名" />
                    </el-table>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-return-assign */
/* eslint-disable handle-callback-err */

import { CONFIG_LIST } from './config.js'
import { debounce } from '../../utils/index.js'
import { projectRoleList } from './flowVar.js'
export default {
  name: 'fc-org-transfer',
  props: {
    // v-model 已经选择过的数据 用于回显
    value: {
      type: Object,
      default: () => ({})
    },
    // 字符串数组使用配置文件的预设值
    // 对象数组需要包含 key/conf 两个属性 conf 会覆盖对应key的默认配置
    tabList: {
      type: Array,
      default: () => ['dep', 'role']
    },
    title: {
      type: String,
      default: '组织机构'
    },
    show: {
      type: Boolean,
      reuired: true
    },
    // 是否支持模糊查询
    searchable: {
      type: Boolean,
      default: true
    },
    // 可选择的最大数量
    maxNum: {
      type: Number,
      default: 99
    }
  },
  data() {
    return {
      cbGroup: [],
      searchRes: [], // 搜索后的结果
      selectedData: [], // 用户手动选择的节点(在tree里面已经显示的节点)
      aloneCheckedData: [], // 已有的 但是未在tree中渲染的数据 例如回显时的数据
      isEnough: false, // 是否选择了足够的人数
      searchString: '',
      searchMode: false, // 是否展示搜索面板
      searchLoading: false,
      activeTabName: '',
      tabConfig: [],
      tabKeys: [],
      // config传入的数据
      treeData: [],
      // 具体某部门/角色下的成员
      tableData: [],
      // checkBox选中的数据
      checkData: []
    }
  },
  computed: {
    selectedNum() {
      let num = 0
      for (const key of this.tabKeys) {
        const data1 = this.selectedData[key]
        data1 && data1.length && (num += data1.length)
        const data2 = this.aloneCheckedData[key]
        data2 && data2.length && (num += data2.length)
      }
      return num
    },
    // 判断是不是选人 只有选人样式才生效
    isSelectTree(tabKey) {
      if (tabKey === 'user') {
        return {
          orgTrans_selectTree: true
        }
      }
    }
  },
  mounted() {
    this.isNumEnough()
    this.debounceSearch = debounce(this.searchDepUser, 500)
  },
  methods: {
    checkBoxChange(checked, val, tabKey) {
      this.activeTabName = tabKey
      val.checked = checked
      // 如果是选中就将checkData数据更新并渲染 去除反之
      if (checked) {
        // 更新checkData
        this.checkData.push(val)
      } else {
        const index = this.checkData.findIndex(t => t.roleId === val.roleId)
        index > -1 && this.checkData.splice(index, 1)
      }
      this.$nextTick(() => {
        this.$set(this.selectedData, this.activeTabName, this.checkData)
        this.isNumEnough()
        this.$forceUpdate()
      })
    },
    randomIndex(index) {
      return String(index)
    },
    // table选项的change回调
    handleSelectChange(data, tabKey) {
      this.activeTabName = tabKey
      // 去掉aloneCheckData
      this.aloneCheckedData[tabKey] = this.aloneCheckedData[tabKey].filter(al => {
        if (!data.includes(al)) return al
      })
      this.$nextTick(() => {
        this.$set(this.selectedData, this.activeTabName, data)
        this.isNumEnough()
        this.$forceUpdate()
      })
    },
    // table数据回显
    checkRow(rows) {
      // 这里有两个坑
      if (rows.length > 0) {
        rows.forEach(row => {
          // 一是必须要用nextTick来获取更新后的dom
          this.$nextTick(() => {
            // 二是 el-table的toggleRowSelection的row必须要与原来的数据的字段一模一样
            // 要不然就只能用find来匹配！！！
            this.$refs.selectTable[0].toggleRowSelection(row, true)
          })
        })
      } else {
        this.$nextTick(() => {
          this.$refs.selectTable[0].clearSelection()
        })
      }
    },
    handleNodeClick(data) {
      // 获取配置文件
      const conf = this.tabConfig.find(t => t.tabKey === this.activeTabName)
      // 指定人员 部门的id是data.id
      if (conf.tabKey === 'user') {
        conf.getUserInfo(data.deptId).then(res => {
          let data = res.rows
          data = data.map(t => ({ nodeId: conf.nodeId(t), ...t }))
          this.tableData = data
        })
      }
    },
    onLoad(node, resolve) {
      const conf = this.tabConfig.find(t => t.tabKey === this.activeTabName)
      // load 方法返回一个promise
      conf
        .onload(node)
        .then(res => {
          const nodes = res.map(t => ({ nodeId: conf.nodeId(t), ...t }))
          resolve(nodes)
        })
        .then(res => {
          for (const tabKey of this.tabKeys) {
            const tree = this.$refs[tabKey][0]
            this.aloneCheckedData[tabKey].forEach(data => {
              tree.setChecked(data.nodeId, true)
            })
          }
        })
    },

    searchDepUser() {
      if (!this.searchString) {
        this.searchRes = []
        return
      }
      this.searchLoading = true
      const activeConfig = this.getActiveConf()
      new Promise((resolve, reject) => {
        activeConfig.onsearch(this.searchString, resolve, reject)
      })
        .then(res => {
          this.searchRes = res.map(t => ({ nodeId: activeConfig.nodeId(t), ...t }))
        })
        .catch(err => console.warn(err))
        .finally(() => (this.searchLoading = false))
    },

    onCheckChange(data, checked, tabKey) {
      // 获取
      this.activeTabName = tabKey
      // const index = this.aloneCheckedData[tabKey].findIndex(t => t.nodeId === data.nodeId)
      // if (index > -1) {
      //   this.aloneCheckedData[tabKey].splice(index, 1)
      // }
      this.$nextTick(() => {
        const tree = this.$refs[tabKey][0]
        const nodes = tree.getCheckedNodes().map(t => {
          !t.nodeId && (t.nodeId = this.getNodeProp(t, 'nodeId', this.activeTabName))
          return t
        })
        // 这里的思路是在回显的时候不需要aloneCheckedData的值，因此直接暴力删除
        this.$set(this.aloneCheckedData, this.activeTabName, [])
        this.$set(this.selectedData, this.activeTabName, nodes)
        this.isNumEnough()
        this.$forceUpdate()
      })
    },

    addData(data) {
      const tabKey = this.activeTabName
      const tree = this.$refs[tabKey][0]
      tree.setChecked(data.nodeId, true)
      !tree.getCheckedKeys(data).includes(data.nodeId) && !this.aloneCheckedData[tabKey].find(t => t.nodeId === data.nodeId) && this.aloneCheckedData[tabKey].push(data)
    },

    removeData(data, tabKey, fromAloneData = false) {
      if (fromAloneData) {
        const index = this.aloneCheckedData[tabKey].findIndex(t => t.nodeId === data.nodeId)
        index > -1 && this.aloneCheckedData[tabKey].splice(index, 1)
      } else {
        if (tabKey === 'user') {
          // 取消按钮选中
          // 注意要想操作table的时候是必须要用table的数据
          const arr = this.tableData.filter(item => item.nodeId === data.nodeId)
          const row = arr.length ? arr[0] : data
          this.$refs.selectTable[0] && this.$refs.selectTable[0].toggleRowSelection(row, false)
          this.selectedData[this.activeTabName] = this.selectedData[this.activeTabName].filter(item => item.userId !== data.userId)
        } else {
          this.$refs[tabKey][0].setChecked(data.nodeId, false) // 触发onCheckChange
        }
      }
    },

    removeAll() {
      for (const type of this.tabKeys) {
        const tree = this.$refs[type][0]
        tree.getCheckedKeys().forEach(key => {
          tree.setCheckedKeys([])
        })
        this.selectedData[type] = []
        this.aloneCheckedData[type] = []
        if (type === 'user') this.$refs.selectTable[0].clearSelection()
      }
    },

    isNumEnough() {
      let count = 0
      for (const type of this.tabKeys) {
        count += this.selectedData[type].length
        count += this.aloneCheckedData[type].length
      }
      this.isEnough = count >= this.maxNum
    },

    closeTransfer() {
      this.$emit('update:show', false)
      this.tabKeys = []
      this.isEnough = false
      this.searchString = ''
    },

    confirm() {
      const res = {}
      for (const type of this.tabKeys) {
        res[type] = this.selectedData[type].concat(this.aloneCheckedData[type])
      }
      this.$emit('confirm', res)
      this.closeTransfer()
    },

    getActiveConf(tabKey) {
      const target = tabKey || this.activeTabName
      return this.tabConfig.find(t => t.tabKey === target)
    },

    getConfProp(propName, tabKey) {
      const conf = this.getActiveConf(tabKey)
      return conf ? conf[propName] : null
    },

    getNodeProp(data, propName, tabKey) {
      try {
        const prop = this.getConfProp(propName, tabKey)
        if (typeof prop === 'string') {
          return data[prop]
        }
        if (typeof prop === 'function') {
          return prop(data)
        }
      } catch (e) {
        console.error(e)
        return '执行出错，可联系开发人员'
      }
    },

    dataInit() {
      this.aloneCheckedData = {}
      this.selectedData = {}
      this.tabConfig = []
      this.tabKeys = []
      const getTabProp = tabItem => (typeof tabItem === 'object' ? [tabItem.key, tabItem.config] : [tabItem, {}])
      const initDefaultData = (key, mergedConfig) => {
        this.tabConfig.push(mergedConfig)
        this.tabKeys.push(key)
        let data = this.value && this.value[key] ? this.value[key] : []
        // 添加key=projectRole的数据初始化，projectRole实质是user审批(用户审批)
        if (key === 'user' || key === 'projectRole') {
          data = data.map(t => ({ nodeId: mergedConfig.nodeId(t), ...t }))
        }
        this.$set(this.aloneCheckedData, key, data)
      }
      // 递归函数 用户给树的每个对象都赋予nodeId
      const treeSetNodeId = (tree, config) => {
        tree.forEach(node => {
          if (node.children && node.children.length > 0) {
            treeSetNodeId(node.children, config)
          }
          // 设置nodeId
          node.nodeId = config.nodeId(node)
          // 设置部门将部门id改为deptId
          node.deptId = node.id
          delete node.id
        })
      }
      // 给roleGroup里面的roles设置nodeId
      const roleSetNodeId = (roles, config) => {
        return roles.map(r => ({ nodeId: config.nodeId(r), ...r }))
      }
      this.tabList.forEach(item => {
        const [key, customConf] = getTabProp(item)
        this.$set(this.aloneCheckedData, key, [])
        this.$set(this.selectedData, key, [])
        const defaultConf = CONFIG_LIST.find(t => t.tabKey === key)
        if (key === 'role') {
          defaultConf.getTreeData().then(res => {
            let rData = res.data.roleGroups
            rData = rData.map(item => {
              // 这部是为了让tree同一的label显示roleName
              item.label = item.groupName
              if (!this.isEmpty(item.roles)) {
                item.roles = roleSetNodeId(item.roles, defaultConf)
              }
              return item
            })
            this.treeData = rData
          })
        } else if (key === 'user' || key === 'dept') {
          // 获取数据
          defaultConf.getTreeData().then(res => {
            // 将每个节点后设置nodeId
            let nodes = res.data
            treeSetNodeId(nodes, defaultConf)
            this.treeData = nodes
            // 只有在选人的时候才默认点击第一个
            if (key === 'user' && res.data.length > 0) {
              this.$nextTick(() => {
                const firstNode = document.querySelector('.el-tree-node')
                if (firstNode) firstNode.click()
              })
            }
          })
        } else if (key === 'projectRole') {
          // 2022-05-17新增项目角色
          this.treeData = projectRoleList
        } else if (key === 'position') {
          // 2022-05-26新增岗位
          defaultConf.getTreeData().then(res => {
            this.treeData = res.data.map(item => {
              item.nodeId = item.postId
              item.label = item.postName
              item.postKey = item.postCode
              return item
            })
          })
        }
        defaultConf && initDefaultData(key, Object.assign({}, defaultConf, customConf))
      })
      this.activeTabName = this.tabKeys[0]
    },
    setTree(data, tabKey) {
      this.$nextTick(() => {
        if (data) {
          // 取出nodeId作为新的数组
          const arr = data.map(d => {
            return d.nodeId
          })
          this.$refs[tabKey][0].setCheckedKeys(arr)
        }
      })
    }
  },
  watch: {
    searchString(newVal) {
      this.searchMode = !!newVal
      this.debounceSearch()
    },

    show: {
      handler: function (show) {
        if (show) {
          this.dataInit()
          this.isNumEnough()
          if (this.activeTabName === 'dept' || this.activeTabName === 'role' || this.activeTabName === 'projectRole' || this.activeTabName === 'position') this.setTree(this.aloneCheckedData[this.activeTabName], this.activeTabName)
          // 只有在选人的时候才进行table的回显
          else if (this.activeTabName === 'user') this.checkRow(this.aloneCheckedData[this.activeTabName])
          // else if (this.activeTabName === 'role') this.checkRole(this.aloneCheckedData[this.activeTabName])
        }
      },
      immediate: true
    },

    tabList: {
      handler: function (val) {
        this.dataInit() // tablist 比show 延后
      },
      immediate: true,
      deep: true
    }
  }
}
</script>
<style lang="stylus">
.role-menu {
  > .el-menu {
    border-right: 0
  }
}
.orgTrans_selectTree {
  float: left
  width: 50%
  height: 100%
}
.orgTrans_selected {
  float: right
  width: 50%
  height: 100%
  > .el-table th.el-table__cell {
    padding-top: 0px
  }
}
.h-transfer{
  text-align: left;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 2999;
  line-height: 32px;

  > .mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .el-tabs--border-card {
    box-shadow: none;
  }

  .el-tabs__content {
    overflow: visible;
    min-height: 250px;
  }

  .el-tabs__nav {
    width: 100%;
    display: flex;

    > .el-tabs__item {
      flex-grow: 1;
    }
  }

  &.single-tab .el-tabs__item {
    text-align: center;
    background: #f5f7fa !important;
    border-bottom: 1px solid #e4e7ed;
    border-right-width: 0px;
  }

  .el-tree-node__content > label.el-checkbox {
    // position: absolute;
    // right: 0;
  }

  .searchResPane{
    position: absolute;
    overflow-y: auto;
    z-index: 99;
    left: 0;
    top: 100%;
    width: 100%;
    height: 100%;
    background: white;
    border: 1px solid #dcdfe6;
    transition: top .5s;

    &.active{
        top: 0;
    }

    .hidden-tag{
        color:#999;
        font-size:12px;
        text-align:right;
        padding-top:4px;
        padding-right:12px;
        cursor pointer

        &:hover{
            color: #66b1ff;
        }
    }

    .item{
        padding: 4px 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height 1.5
        &:hover{
            background-color: #ecf5ff;
            color: #66b1ff;
            cursor: pointer;
        }

        .search-res-tip{
          font-size:12px;
          color:#999;
          max-width: 280px;
        }
    }
  }

  .enough-mask{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    color: white;
    font-size: 16px;
    z-index: 100;
    height: 100%;
    background: rgba(0,0,0,0.5);
    letter-spacing: 4px;
  }

  .p-center{
      position absolute
      top 50%
      left 50%
      transform translate(-50%, -50%)
  }

  .transfer__content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  background: white;
  overflow: hidden;
  border-radius: 4px;
}

.transfer__header {
  margin-bottom: 6px;
  background: #565656;
  padding: 6px 24px;
  color: white;
  .el-icon-close{
    cursor:pointer;
    float: right;
    margin-top: 10px;
  }
}

.transfer__body {
  padding: 12px 0;
  display: flex;
  justify-content: space-around;
}

.transfer-pane {
  width: 360px;
}
  .search-input  input{
    border: 1px solid #DCDFE6 !important;
    &:focus{
      border-color:#409EFF !important;
    }
  }

.transfer-pane__tools {
  margin-bottom: 10px;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span:last-child {
    cursor: pointer;
  }
}

.transfer-pane__body {
  position relative
  width: 100%;
  height: 330px;
  overflow hidden
  font-size: 14px;

  ::v-deep .el-scrollbar__view{
    height: 100%;
  }

  .el-tabs__item {
    height: 26px;
    line-height: 26px;
  }
}

.transfer-icons {
  display: flex;
  flex-direction: column;
  justify-content: center;

  i {
    margin-top: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    font-size: 20px;
    color: #696969;

    &:hover {
      transform: scale(1.1);
    }
  }
}

.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;

  .node-label {
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }

  .node-checkbox {
    position: absolute;
    right: 0;
  }

  i {
    &:hover {
      color: #1485f8;
      cursor: pointer;
    }

    font-size: 10px;
  }
}

.right-pane {
  box-sizing: border-box;
  overflow-x: hidden;
  height: 290px;
  margin-bottom: 10px;

  .selected-item {
    padding: 0px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
      background-color: #F5F7FA;
    }

    span {
      max-width: 90%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    i {
      &:hover {
        color: #1485f8;
        cursor: pointer;
      }
    }
  }
}

.dot{
  width: 2px;
  height: 2px;
  display: inline-block;
  border-radius: 50%;
  background: #4caf50;
}

  .text-ellipsis{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
