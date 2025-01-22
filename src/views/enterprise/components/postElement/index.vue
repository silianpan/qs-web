<!-- 人员添加岗位 -->
<template>
  <div>
    <div class="depart-info">
      <div class="depart-name">{{ title }}</div>
      <div class="depart-operate" v-if="title === '全部成员'">
        <div class="edit-name-tip">
          <a-switch size="small" defaultChecked />
          <span>允许成员修改姓名</span>
        </div>
      </div>
      <div class="depart-operate" v-if="title !== '全部成员' && title !== '离职成员'">
        <a-popover trigger="click" v-model="visible">
          <template slot="content">
            <div class="editNameInput">
              <a-input placeholder="修改岗位" v-model="editNameVal" />
            </div>
            <div class="editNameBtn">
              <a-button @click="editPostName(0)"> 取消 </a-button>
              <a-button type="primary" @click="editPostName(1)"> 确认 </a-button>
            </div>
          </template>
          <a-button type="link">修改名称</a-button>
        </a-popover>
        <a-divider type="vertical" />
        <a-popover trigger="click" v-model="DepVisible">
          <template slot="content">
            <div class="editNameInput">
              <a-input placeholder="添加岗位" v-model="addPostNameVal" />
            </div>
            <div class="editNameBtn">
              <a-button @click="handleAddPost(0)"> 取消 </a-button>
              <a-button type="primary" @click="handleAddPost(1)"> 确认 </a-button>
            </div>
          </template>
          <a-button type="link">添加岗位</a-button>
        </a-popover>
        <a-popover trigger="click">
          <template slot="content">
            <div class="editNameBtn">
              <a-button @click="deletePost(false)"> 取消 </a-button>
              <a-button type="primary" @click="deletePost(true)"> 确认 </a-button>
            </div>
          </template>
          <a-button type="link">删除岗位</a-button>
        </a-popover>
      </div>
    </div>
    <div class="member-btn-pane">
      <div class="btn-group" v-if="title !== '离职成员'">
        <a-button @click="addRangebtn">添加成员</a-button>
        <a-button @click="batchDelete">批量删除</a-button>
      </div>
      <div class="earch-input">
        <a-input-search placeholder="搜索成员" size="small" style="width: 200px" allow-clear @search="onSearch" />
      </div>
    </div>
    <div class="member-table-content">
      <div class="member-table">
        <s-table ref="table" size="default" rowKey="userId" :columns="columns" :data="loadData" :rowSelection="rowSelection"> </s-table>
      </div>
    </div>
    <!-- 添加成员弹窗 -->
    <a-modal destroyOnClose title="成员列表" width="600px" :visible="visibleSelectUser" @ok="handleOk" @cancel="handleCancel">
      <MemberSelect @checkedList="checkedList" />
    </a-modal>
  </div>
</template>

<script lang="jsx">
import { STable } from '/src/components/index.js'
import MemberSelect from '../memberSelect/index.vue'
import { getUserList } from '/src/api/enterprise/index.js'
import { addPost, updatePost, delPost } from '/src/api/system/post.js'
import { listPostAll, addPostMember, deletePostMember } from '/src/api/system/post.js'

export default {
  components: { STable, MemberSelect },
  props: {
    title: {
      type: String,
      required: true
    },
    postId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      /* 选中的人员 */
      intoCheckedData: [],
      visibleSelectUser: false,
      selectedRowKeys: [],
      selectedRows: [],
      /* 查询参数 */
      UserListParams: {
        // isAsc: 'desc',
        // orderByColumn: 'create_time'
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: param => {
        this.UserListParams.postId = this.postId
        this.UserListParams = Object.assign(this.UserListParams, param)
        return this.changeTableData(this.UserListParams)
      },
      columns: [
        {
          title: '姓名',
          dataIndex: 'nickName',
          align: 'center'
        },
        {
          title: '手机',
          dataIndex: 'phonenumber',
          align: 'center'
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          align: 'center'
        },
        {
          title: '角色',
          dataIndex: 'roles',
          align: 'center',
          customRender: (text, record) => {
            if (text.length > 1) {
              let roles = ''
              text.forEach((item, index) => {
                roles += item.roleName + ','
              })
              return roles
            } else if (text.length === 1) {
              return text[0].roleName
            } else {
              return ''
            }
          }
        },
        {
          title: '部门角色',
          dataIndex: 'userDept',
          align: 'center',
          customRender: (text, record) => {
            let principals = '成员'
            if (text.length > 0) {
              text.forEach((item, index) => {
                if (item.principal === 0) {
                  principals = '主管'
                }
              })
            }
            return principals
          }
        }
        // {
        //   title: '',
        //   width: 160,
        //   align: 'center',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      /* 修改名称气泡弹窗 */
      visible: false,
      /* 添加岗位气泡 */
      DepVisible: false,
      /* 修改名称val */
      editNameVal: '',
      /* 添加岗位 */
      addPostNameVal: '',
      // 选中的岗位ID
      selectedPostId: null
    }
  },
  methods: {
    /* 添加成员 */
    addRangebtn() {
      if (this.isEmpty(this.UserListParams.postId)) {
        return this.$message.warning('先选择岗位再添加成员')
      } else {
        this.visibleSelectUser = true
      }
    },
    /* 批量删除人员 */
    batchDelete() {
      this.$antdconfirm({
        title: '您是否要移除所选成员？',
        content: h => <div>移除成员会同时移除所选成员的当前岗位，但不会在通讯录中删除所选成员</div>,
        onOk: () => {
          deletePostMember({ postId: this.postId, userIds: this.selectedRowKeys }).then(res => {
            if (res.code === 200) {
              this.$refs.table.refresh(true)
              this.$message.success('删除成功')
            }
          })
        }
      })
    },
    /* 人员组件选中的人员回调 */
    checkedList(data) {
      this.intoCheckedData = data
    },
    /* 添加成员提交 */
    handleOk() {
      addPostMember({ postId: this.postId, userIds: this.intoCheckedData }).then(res => {
        if (res.code === 200) {
          this.visibleSelectUser = false
          this.$message.success('添加成功')
          this.$refs.table.refresh(true)
        }
      })
    },
    /* 取消 */
    handleCancel() {
      this.visibleSelectUser = false
    },
    /* 表格多选 */
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    changeTableData(param) {
      return getUserList(param).then(res => {
        return {
          data: res.rows,
          totalCount: res.total,
          pageNum: param.pageNum,
          pageSize: param.pageSize
        }
      })
    },
    /* 搜索成员 */
    onSearch(val) {
      this.UserListParams.nickName = val
      this.$refs.table.refresh(true)
    },
    /* 修改岗位名称 */
    editPostName(v) {
      if (v === 1) {
        if (!this.editNameVal) {
          return this.$message.error('输入要修改的名称')
        } else {
          updatePost({ postId: this.postId, postName: this.editNameVal })
            .then(res => {
              if (res.code === 200) {
                this.visible = false
                this.$emit('saveSuccess')
                return this.$message.success('修改成功')
              }
            })
            .catch(err => {
              this.visible = false
              return this.$message.error(err)
            })
        }
      } else {
        this.editNameVal = ''
        this.visible = false
      }
    },
    /* 添加岗位 */
    handleAddPost(v) {
      if (v === 1) {
        if (!this.addPostNameVal) {
          return this.$message.error('输入要添加的岗位')
        } else {
          addPost({ postName: this.addPostNameVal })
            .then(res => {
              if (res.code === 200) {
                this.DepVisible = false
                this.$emit('saveSuccess')
                return this.$message.success('添加成功')
              }
            })
            .catch(err => {
              this.DepVisible = false
              return this.$message.error(err)
            })
        }
      } else {
        this.addPostNameVal = ''
        this.DepVisible = false
      }
    },
    /* 删除岗位 */
    deletePost(isDelete) {
      if (isDelete) {
        if (this.postId === null) {
          return this.$message.warning('请选择部门后删除')
        }
        delPost(this.postId)
          .then(res => {
            if (res.code === 200) {
              this.DepVisible = false
              this.$emit('saveSuccess')
              return this.$message.success('删除成功')
            }
          })
          .catch(err => {
            this.DepVisible = false
            return this.$message.error(err)
          })
      } else {
        this.DepVisible = false
      }
    }
  },
  watch: {
    postId() {
      this.$refs.table.refresh(true)
    },
    title: {
      handler(val) {
        this.editNameVal = this.title
      },
      immediate: true
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../memberElement/index.less';
</style>
