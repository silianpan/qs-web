<template>
  <div class="member-select">
    <a-tree-select
      style="width: 100%"
      :value="value"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      allow-clear
      :multiple="multiple"
      tree-default-expand-all
      @change="onChange"
      :tree-data="initTreeData"
      :replaceFields="replaceFields"
      placeholder="点击选择"
      :filterTreeNode="
        (inputValue, treeNode) => {
          return treeNode.data.props.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
        }
      "
    >
    </a-tree-select>
  </div>
</template>

<script>
export default {
  props: {
    treeData: {
      type: Array,
      default: () => [
        {
          title: 'Node1',
          value: '0-0',
          key: '0-0'
        }
      ],
      require: true
    },
    replaceFields: {
      type: Object,
      default: () => {
        return { children: 'children', title: 'label', key: 'id', value: 'id' }
      }
    },
    multiple: {
      type: Boolean,
      default: true
    },
    defaultValue: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      value: []
    }
  },
  methods: {
    // 选中树节点时调用此函数
    onChange(value, label, extra) {
      this.value = value
      /* 返回已选中的数据 */
      this.$emit('returnData', this.value)
    }
  },
  computed: {
    initTreeData() {
      return this.treeData
    }
  },
  created() {
    // console.log('treeData',this.treeData)
    if (this.defaultValue) {
      const mapVal = this.defaultValue.map(item => item.deptId)
      this.value = mapVal
      this.$emit('returnData', this.value)
    } else {
      this.$emit('returnData', null)
    }
  }
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
