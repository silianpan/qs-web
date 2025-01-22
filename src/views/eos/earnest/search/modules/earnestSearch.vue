<template>
  <!-- 查询表单 -->
  <div class="search">
    <ul class="queryList" :class="queryList.length < 1 ? 'notMargin' : ''">
      <li :class="currents.includes(index) ? 'current' : ''" v-for="(item, index) in queryList" :key="item.text" @click="clickquery(item.query, index)">{{ item.text }}<a-icon type="caret-down" /></li>
    </ul>
    <slot name="left"></slot>
    <ul class="queryList">
      <li :class="clickButton ? 'current' : '' " @click="selectEarnestReturn()">近期退还</li>
      <li :class="clickNoReturn ? 'current' : '' " @click="selectNoReturn()">未退还</li>
    </ul>
    <div class="inputquery"><a-input-search ref="searchBar" :placeholder="placeholder" enter-button @search="onSearch" allowClear /></div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Search',
  components: {},
  props: {
    queryList: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      currents: [],
      params: [],
      clickButton: false,
      clickNoReturn: false
    }
  },
  watch: {},
  computed: {},
  methods: {
    /* 按钮排序 */
    clickquery(param, index) {
      if (!this.currents.includes(index)) {
        this.currents = [...this.currents, index]
        this.params = [...this.params, param]
      } else {
        this.currents = this.currents.filter(item => item !== index)
        this.params = this.params.filter(item => item !== param)
      }

      this.$emit('clickquery', this.params.join(','))
    },
    /* 查询 */
    onSearch(data, event) {
      this.$emit('onSearch', data)
    },
    /* 查询保证金近七天退还的内容 */
    selectEarnestReturn() {
      this.clickButton = !this.clickButton
      this.$emit('earnestReturnSearch', this.clickButton)
    },
    /* 查询未退还的内容 */
    selectNoReturn() {
      this.clickNoReturn = !this.clickNoReturn
      this.$emit('earnestNoReturn', this.clickNoReturn)
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="less" scoped>
.search {
  display: flex;
}
.inputquery {
  margin-right: 20px;
  width: 500px;
}
.queryList {
  display: flex;
  padding: 0;
  margin-right: 30px;
  li {
    text-align: center;
    padding: 4px;
    width: 80px;
    height: 31px;
    border: 1px solid #ccc;
    cursor: pointer;
    &:not(.current):hover {
      color: #13c2c2;
      border: 1px solid #13c2c2;
    }
  }
}
.notMargin {
  margin-right: 0px;
}
.current {
  color: white;
  background-color: #13c2c2;
  border: 1px solid #13c2c2;
}
.addproject {
  margin-left: auto;
}
</style>
