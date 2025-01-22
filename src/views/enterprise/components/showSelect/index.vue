<template>
  <div class="showSelect">
    <div class="input-box" @click="visible = true">
      <!-- <el-tag class="org-tag" v-for="item in selectedData" :key="item.userId">
        {{ item.nickName }}
      </el-tag> -->
      {{ selectedData.map(item => item.nickName).join(',') }}
      <!-- {{ selectedData.map(item => (<el-tag class="org-tag" key={item.userId}>{item.nickName}</el-tag>)) }} -->
      <!-- 添加成员弹窗 -->
      <el-dialog title="选择成员" :visible.sync="visible" width="60%" :append-to-body="true" @close="visible = false" close-on-press-escape>
        <MemberSelect @checkedList="checkedList" :memberList="memberList" />
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleSure">确 定</el-button>
          <el-button @click="visible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import MemberSelect from './memSelect.vue'
export default {
  name: 'ShowSelect',
  data() {
    return {
      visible: false,
      memberList: [],
      selectedData: []
    }
  },
  components: {
    MemberSelect: MemberSelect
  },
  computed: {
    selectedLabels() {
      return this.selectedData.map(t => t.nickName).join(',')
    }
  },
  methods: {
    /* 选择人员回调 */
    checkedList(data) {
      // data.forEach((item, index) => {
      //   this.$set(this.selectedData, index, item)
      // })
      this.selectedData = data
      // this.selectedData = data.map(({ userId, userName, nickName, deptId }) => ({ userId, userName, nickName, deptId }))
    },
    handleSure() {
      this.$emit('checkedList', this.selectedData)
      this.visible = false
    }
  }
}
</script>

<style lang="less">
.input-box {
  border: 1px solid #dcdfe6;
  padding-left: 6px;
  font-size: 12px;
  min-height: 32px;
  line-height: 30px;
  border-radius: 4px;
  background: white;
  color: #606266;
  cursor: pointer;
}
.org-tag {
  margin-right: 6px;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  padding-right: 1rem;
  vertical-align: middle;
  .el-tag__close {
    position: absolute;
    right: 2px;
    top: 50%;
    margin-top: -7px;
  }
}
</style>
