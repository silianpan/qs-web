<template>
  <div class="member-select-container">
    <div class="has-list">
      <div class="member-tab-header">
        <ul class="tabs">
          <li class="tab-item">成员</li>
        </ul>
        <div class="input">
          <a-input-search size="small" placeholder="搜索" style="width: 100px" @search="onSearch" />
        </div>
      </div>
      <div class="member-tab-content">
        <div class="member-tree">
          <div class="tree-scroll-bg">
            <div class="all-member" :class="selectedKeys.length === 0 ? '' : 'clearAllMemner'" @click="allMember">全部成员</div>
            <div class="tree-bg">
              <a-tree :replaceFields="replaceFields" :tree-data="treeData" @select="onSelect" :selectedKeys="selectedKeys" />
            </div>
          </div>
          <div class="member-list">
            <div class="select-all-item">
              <span>已选 {{ checkedList.length }} / {{ personList.length }}</span>
              <a-checkbox ref="checkBoxAll" :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange" />
            </div>
            <div class="member-select-list">
              <!-- <a-checkbox-group v-model="checkedList" :options="plainOptions" @change="onChange" /> -->
              <a-checkbox-group ref="checkGroup">
                <a-checkbox @change="handleCheckboxChange" v-for="item in plainOptions" :key="item.value" :value="item.value">
                  {{ item.label }}
                </a-checkbox>
              </a-checkbox-group>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserList, getTreeMenu } from '/src/api/enterprise/index.js'

export default {
  props: {
    ststemAdminList: {
      type: Array,
      require: false,
      default: () => []
    }
  },
  data() {
    return {
      treeData: [],
      replaceFields: { children: 'children', title: 'label', key: 'id' },
      indeterminate: false,
      checkAll: false,
      plainOptions: [],
      /* 选中的 */
      checkedList: [],
      selectedKeys: [],
      // 所有选中的
      chooseList: [],
      // 存放所有人员 用做判断
      personList: []
    }
  },
  methods: {
    onSearch(value) {
      getUserList({ nickName: value }).then(res => {
        this.plainOptions = res.rows.map(({ nickName, userId }) => ({ label: nickName, value: userId }))
      })
    },
    /* 全部成员查询 */
    allMember() {
      if (this.selectedKeys.length !== 0) {
        this.selectedKeys = []
        this.initgetUserList()
      }
    },
    /* 部门成员查询 */
    onSelect(selectedKeys, { selected, selectedNodes, node, event }) {
      if (selected) {
        this.selectedKeys = selectedKeys
        getUserList({ deptId: this.selectedKeys[0] }).then(res => {
          this.plainOptions = res.rows.map(({ nickName, userId }) => ({ label: nickName, value: userId }))
        })
      }
    },
    handleCheckboxChange(e) {
      // 选中
      if (e.target.checked) {
        this.checkedList.push(e.target.value)
        this.indeterminate = !!this.checkedList.length && this.checkedList.length < this.personList.length
        this.$nextTick(() => {
          this.checkAll = this.checkedList.length === this.personList.length
        })
      } else {
        this.checkedList = this.checkedList.filter(item => item !== e.target.value)
        this.indeterminate = !!this.checkedList.length && this.checkedList.length < this.personList.length
        this.$nextTick(() => {
          this.checkAll = this.checkedList.length === this.personList.length
        })
      }
      this.$emit('checkedList', this.checkedList)
    },
    onChange(checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < this.plainOptions.length
      this.checkAll = checkedList.length === this.plainOptions.length
      this.$emit('checkedList', this.checkedList)
    },
    onCheckAllChange(e) {
      // Object.assign(this, {
      //   checkedList: e.target.checked ? this.personList : [],
      //   indeterminate: false,
      //   checkAll: e.target.checked
      // })
      this.$nextTick(() => {
        this.checkedList = e.target.checked ? this.personList : []
        this.indeterminate = false
        this.checkAll = e.target.checked
        this.checkedList = this.checkedList.map(item => item.value)
        this.$refs.checkGroup.sValue = [...this.checkedList]
        this.$emit('checkedList', this.checkedList)
      })
    },
    /* 查询全部成员 */
    initgetUserList() {
      getUserList().then(res => {
        this.plainOptions = res.rows.map(({ nickName, userId }) => ({ label: nickName, value: userId }))
        this.personList = [...this.plainOptions]
      })
    },
    /* 获取部门树 */
    initTreeMenu() {
      getTreeMenu().then(res => {
        this.treeData = res.data
      })
    }
  },
  mounted() {
    this.initgetUserList()
    this.initTreeMenu()
  },
  created() {
    this.checkedList = this.ststemAdminList.map(item => item.userId)
    this.$emit('checkedList', this.checkedList)
    // 回显选中
    this.$nextTick(() => {
      this.$refs.checkGroup.sValue = [...this.checkedList]
    })
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
