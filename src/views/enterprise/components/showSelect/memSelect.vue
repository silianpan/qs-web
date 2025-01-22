<template>
  <div class="member-select-container">
    <div class="has-list">
      <div class="member-tab-header">
        <ul class="tabs">
          <li class="tab-item">成员</li>
        </ul>
        <div class="input">
          <a-input-search size="small" placeholder="搜索" style="width: 100px" />
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
            <!-- <div class="select-all-item">
              <span>已选 {{ checkedList.length }} / {{ plainOptions.length }}</span>
              <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange" />
            </div> -->
            <div class="member-select-list">
              <!-- <a-checkbox-group v-model="checkedList" :options="plainOptions" @change="onChange" /> -->
              <a-table rowKey="userName" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :columns="columns" :data-source="plainOptions" />
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
    memberList: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      columns: [
        {
          title: '姓名',
          dataIndex: 'nickName'
        }
      ],
      selectedRowKeys: [],
      treeData: [],
      replaceFields: { children: 'children', title: 'label', key: 'id' },
      indeterminate: false,
      checkAll: false,
      plainOptions: [],
      /* 选中的 */
      checkedList: [],
      selectedKeys: []
    }
  },
  methods: {
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
          this.plainOptions = res.rows
        })
      }
    },
    // onChange(checkedList) {
    //   this.indeterminate = !!checkedList.length && checkedList.length < this.plainOptions.length
    //   this.checkAll = checkedList.length === this.plainOptions.length
    //   this.$emit('checkedList', this.checkedList)
    // },
    // onCheckAllChange(e) {
    //   Object.assign(this, {
    //     checkedList: e.target.checked ? this.plainOptions : [],
    //     indeterminate: false,
    //     checkAll: e.target.checked
    //   })
    //   this.checkedList = this.checkedList.map(item => item.value)
    //   this.$emit('checkedList', this.checkedList)
    // },
    /* 查询全部成员 */
    initgetUserList() {
      getUserList().then(res => {
        this.plainOptions = res.rows
      })
    },
    /* 获取部门树 */
    initTreeMenu() {
      getTreeMenu().then(res => {
        this.treeData = res.data
      })
    },
    // 表格选择事件
    onSelectChange(selectedRowKeys, selectRows) {
      this.selectedRowKeys = selectedRowKeys
      this.$emit(
        'checkedList',
        selectRows.map(({ userId, userName, nickName, deptId }) => ({ userId, userName, nickName, deptId }))
      )
    }
  },
  mounted() {
    this.initgetUserList()
    this.initTreeMenu()
  },
  created() {
    this.checkedList = this.memberList.map(item => item.userId)
    this.$emit('checkedList', this.checkedList)
  }
}
</script>

<style lang="less" scoped>
.member-select-container {
  width: 100%;
  height: 100%;
}
.empty-list {
  overflow-x: hidden;
  overflow-y: auto;
  cursor: pointer;
}
.has-list {
  border: 1px solid #d9d9d9;
  .member-tab-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    box-sizing: border-box;
    padding: 0 10px;
    .tabs {
      padding: 0;
      margin: 0;
      .tab-item {
        color: #0799ee;
      }
    }
    .input {
      display: flex;
      justify-content: center;
      align-items: center;
      ::v-deep .ant-input {
        border-radius: 25px;
      }
    }
  }
  .member-tab-content {
    border-top: 1px solid #d9d9d9;
    .member-tree {
      height: 300px;
      display: flex;
      .tree-scroll-bg {
        flex: 1;
        height: 100%;
        border-right: 1px solid #d9d9d9;
        overflow-x: hidden;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        .all-member {
          height: 30px;
          line-height: 30px;
          padding: 0 10px;
          cursor: pointer;
          color: #0799ee;
          background: #c8e7f5;
        }
        .clearAllMemner {
          background: #ffffff;
        }
        .tree-bg {
          flex: 1;
          box-sizing: border-box;
          padding: 0 10px;
        }
      }
      .member-list {
        flex: 1;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        .select-all-item {
          color: #0799ee;
          height: 30px;
          line-height: 30px;
          padding: 0 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .member-select-list {
          flex: 1;
          box-sizing: border-box;
          padding: 7px 10px;
          ::v-deep .ant-checkbox-group {
            width: 100%;
            display: flex;
            flex-direction: column;
          }
          ::v-deep .ant-checkbox-group-item {
            margin: 10px 0px;
          }
        }
      }
    }
  }
}
</style>
