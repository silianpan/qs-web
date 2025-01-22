<!-- 操作列组件 -->
<template>
  <div>
    <template v-if="actionFirst">
      <a-popconfirm v-if="actionFirst.popconfirm" :title="actionFirst.confirmTitle" :ok-text="actionFirst.confirmOkText" :cancel-text="actionFirst.confirmCancelText" @confirm="handleCustomAction(actionFirst.action)" @cancel="handleCustomAction(actionFirst.cancelAction)">
        <a-icon v-if="actionFirst.confirmIcon" slot="icon" :type="actionFirst.confirmIcon" style="color: red" />
        <a @click.stop>
          <template v-if="!isEmpty(actionFirst.icon)">
            <icon-font v-if="actionFirst.icon.indexOf('iconfont-') !== -1" class="s-mr-3" :type="actionFirst.icon" />
            <a-icon v-else class="s-mr-3" :type="actionFirst.icon" />
          </template>
          {{ actionFirst.label }}
        </a>
      </a-popconfirm>
      <a v-else @click.stop="handleCustomAction(actionFirst.action)">
        <template v-if="!isEmpty(actionFirst.icon)">
          <icon-font v-if="actionFirst.icon.indexOf('iconfont-') !== -1" class="s-mr-3" :type="actionFirst.icon" />
          <a-icon v-else class="s-mr-3" :type="actionFirst.icon" />
        </template>
        {{ actionFirst.label }}
      </a>
      <a-divider v-if="actionMore" type="vertical" />
    </template>
    <a-dropdown v-if="actionMore">
      <a-menu slot="overlay">
        <a-menu-item v-for="item in actionMore" :key="item.label">
          <a-popconfirm v-if="item.popconfirm" :title="item.confirmTitle" :ok-text="item.confirmOkText" :cancel-text="item.confirmCancelText" @confirm="handleCustomAction(item.action)" @cancel="handleCustomAction(item.cancelAction)">
            <a @click.stop>
              <template v-if="!isEmpty(item.icon)">
                <icon-font v-if="item.icon.indexOf('iconfont-') !== -1" class="s-mr-3" :type="item.icon" />
                <a-icon v-else class="s-mr-3" :type="item.icon" />
              </template>
              {{ item.label }}
            </a>
          </a-popconfirm>
          <a v-else @click.stop="handleCustomAction(item.action)">
            <template v-if="!isEmpty(item.icon)">
              <icon-font v-if="item.icon.indexOf('iconfont-') !== -1" class="s-mr-3" :type="item.icon" />
              <a-icon v-else class="s-mr-3" :type="item.icon" />
            </template>
            {{ item.label }}</a>
        </a-menu-item>
      </a-menu>
      <a @click.stop>
        <icon-font class="s-mr-3" type="iconfont-gengduo" />更多
        <!-- <a-icon type="down" /> -->
      </a>
    </a-dropdown>
  </div>
</template>

<script>
export default {
  name: 'SActionColumns',
  props: {
    // 表格行数据
    record: {
      type: Object,
      default: () => {}
    },
    actions: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    // 操作列第一个按钮，是对象
    actionFirst() {
      return !this.isEmpty(this.actions) ? this.actions[0] : null
    },
    // 操作列更多按钮，是数组
    actionMore() {
      return !this.isEmpty(this.actions) && this.actions.length > 1 ? this.actions.slice(1) : null
    }
  },
  methods: {
    /* 处理自定义action事件 */
    handleCustomAction(action) {
      if (action instanceof Function) {
        action(this.record)
      } else if (typeof action === 'string') {
        this.$emit(action, this.record)
      }
    }
  }
}
</script>
