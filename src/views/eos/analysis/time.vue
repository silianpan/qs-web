<template>
  <div>
    <div style="margin-bottom: 20px">
      <span class="s-mg-16">开始年月</span>
      <a-month-picker v-model="startTime" placeholder="请选择开始年月">
        <a-icon slot="suffixIcon" type="smile" />
      </a-month-picker>

      <span class="s-mg-16">结束年月</span>
      <a-month-picker v-model="endTime" placeholder="请选择结束年月">
        <a-icon slot="suffixIcon" type="smile" />
      </a-month-picker>

      <a-button-group class="s-ml-16">
        <a-button ghost type="primary" @click="handleSearch">搜索</a-button>
        <a-button @click="handleReset">重置</a-button>
      </a-button-group>
    </div>
    <div>
      <line-inout ref="lineInoutRef" />
    </div>
    <div>
      <bar-total ref="BarTotalRef" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import LineInout from '/src/views/dashboard/components/finance/LineInout.vue'
import BarTotal from './bar-total.vue'

export default {
  components: {
    LineInout,
    BarTotal
  },
  data() {
    return {
      startTime: null,
      endTime: null
    }
  },
  mounted() {
    this.$refs.BarTotalRef.queryData(false)
  },
  methods: {
    /**
     * 搜索
     */
    handleSearch() {
      this.$refs.lineInoutRef.queryData(true, moment(this.startTime).format('YYYY-MM') + '-01 00:00:00', moment(this.endTime).format('YYYY-MM') + '-31 23:59:59')
      this.$refs.BarTotalRef.queryData(true, moment(this.startTime).format('YYYY-MM') + '-01 00:00:00', moment(this.endTime).format('YYYY-MM') + '-31 23:59:59')
    },
    /**
     * 重置
     */
    handleReset() {
      this.startTime = null
      this.endTime = null
      this.$refs.lineInoutRef.queryData(true, null, null)
      this.$refs.BarTotalRef.queryData(true, null, null)
    }
  }
}
</script>
