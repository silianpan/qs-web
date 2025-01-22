<template>
  <!-- 查询表单 -->
  <div>
    <div class="search">
      <ul class="queryList" :class="queryList.length < 1 ? 'notMargin' : ''">
        <li :class="currents.includes(index) ? 'current' : ''" v-for="(item, index) in queryList" :key="item.text" @click="clickquery(item.query, index)">{{ item.text }}<a-icon type="caret-down" /></li>
      </ul>
      <slot name="left"></slot>
      <div class="inputquery">
        <a-tooltip trigger="click" placement="bottomLeft">
          <span v-if="clickTips" slot="title">{{ clickTips }}</span>
          <a-input ref="searchInput" size="default" :placeholder="placeholder" @keyup.enter.native="onSearch" allowClear>
            <a-icon slot="prefix" type="search" />
          </a-input>
        </a-tooltip>
      </div>
      <a-button type="primary" ghost :style="{ float: 'right' }" icon="reload" @click="onSearch" />
      <a-button v-if="formItems.length !== 0" type="primary" ghost :style="{ float: 'right', margin: '0 10px' }" @click="toggle_search = !toggle_search">高级查询</a-button>

      <slot />
    </div>
    <transition name="transition" enter-active-class="animate__animated animate__fadeInLeft" leave-active-class="animate__animated animate__fadeOutRight">
      <div class="table-page-search-wrapper" v-if="toggle_search">
        <s-form search layout="inline" @search="onSearch" @reset="$emit('reset')" :formItems="formItems" :formData="formData"></s-form>
      </div>
    </transition>
  </div>
</template>

<script>
import { SForm } from '/src/components/index.js'
export default {
  name: 'SSearch',
  components: {
    SForm
  },
  props: {
    queryList: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      required: true
    },
    clickTips: {
      type: String,
      default: ''
    },
    formItems: {
      type: Array,
      default: () => []
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      currents: [],
      params: [],
      toggle_search: false
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
    onSearch() {
      this.$emit('onSearch', this.$refs.searchInput.stateValue)
    }
  }
}
</script>
<style lang="less" scoped>
.search {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}
.inputquery {
  // float: right;
  margin-right: 20px;
  // width: 500px;
  ::v-deep input {
    border-color: #348ee4 !important;
  }
  ::v-deep .anticon-search {
    color: #348ee4 !important;
  }
}
.queryList {
  display: flex;
  padding: 0;
  margin-right: 30px;
  li {
    text-align: center;
    padding: 4px;
    width: 120px;
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
