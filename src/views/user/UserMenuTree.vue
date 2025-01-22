<!-- 用户常用应用菜单树 -->
<template>
  <div>
    <a-tree
      v-model="menuCheckedKeys"
      checkable
      :checkStrictly="false"
      :expanded-keys="menuExpandedKeys"
      :auto-expand-parent="autoExpandParent"
      :tree-data="menuOptions"
      @check="onCheck"
      @expand="onExpandMenu"
      :replaceFields="defaultProps"
    />
    <div class="bottom-control">
      <a-space>
        <a-button type="primary" @click="handleOk">确 定</a-button>
        <a-button @click="handleClose">关 闭</a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import { getRouters } from '/src/api/user/module.js'
export default {
  data() {
    return {
      halfCheckedKeys: [],
      menuCheckedKeys: [],
      menuExpandedKeys: [],
      autoExpandParent: false,
      menuOptions: [],
      defaultProps: {
        children: 'children',
        title: 'menuName',
        key: 'menuId'
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      getRouters().then(res => {
        this.menuOptions = res.data
      })
    },
    onCheck(checkedKeys, info) {
      // 半选节点
      this.halfCheckedKeys = info.halfCheckedKeys

      // if (!this.isEmpty(info.node.$children)) {
      //   // 存在子节点，将该节点清除
      //   this.menuCheckedKeys = checkedKeys.filter(item => item !== info.node.dataRef.menuId)
      // } else {
      //   this.menuCheckedKeys = checkedKeys
      // }
      // 不把父节点过滤掉了
      this.menuCheckedKeys = checkedKeys
    },
    onExpandMenu(expandedKeys) {
      this.menuExpandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    handleOk() {
      this.$emit('ok', this.halfCheckedKeys.concat(this.menuCheckedKeys))
      this.handleClose()
    },
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>
