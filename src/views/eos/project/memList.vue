<!-- 项目详细 -->
<template>
  <a-card :bordered="false" size="small">
    <a-collapse expand-icon-position="right" :defaultActiveKey="title">
      <a-collapse-panel :key="title" class="custom-collapse-panel">
        <span slot="header" class="custom-collapse-panel-header">
          {{ title }}
        </span>
        <a slot="extra" v-if="!isEmpty(MemData)" style="color: #348ee4" href="javascript:;" @click.stop="handleExportPM">导出项目经理任命书</a>
        <a-descriptions class="mem-item" v-if="!isEmpty(MemData)" :column="2" bordered size="small">
          <a-descriptions-item v-for="(item, index) in MemData" :key="index" :label="index + 1">
            <a-space align="center" :size="28">
              <a-tag :color="item.sysUser.status === '0' ? 'green' : 'red'">
                {{ item.sysUser.status === '0' ? '在职' : '离职' }}
              </a-tag>
              <span> {{ item.role }}</span>
              <span> {{ item.sysUser.nickName }}</span>
            </a-space>
          </a-descriptions-item>
        </a-descriptions>
      </a-collapse-panel>
    </a-collapse>
  </a-card>
</template>

<script>
import { listMem, exportPM } from '/src/api/eos/project/mem.js'
import defaultSettings from '/src/config/defaultSettings.js'

export default {
  props: {
    // 项目ID
    projectId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      title: '成员',
      // 加载数据方法 必须为 Promise 对象
      MemData: []
    }
  },
  mounted() {
    this.getlistMem()
  },
  methods: {
    getlistMem() {
      listMem({
        projectId: this.projectId
      }).then(res => {
        this.MemData = res.data
      })
    },
    handleExportPM() {
      exportPM(this.projectId, defaultSettings.companyDoc).then(res => {
        this.download(res.msg)
      })
    }
  }
}
</script>

<style scoped>
.mem-item ::v-deep .ant-descriptions-row > .ant-descriptions-item-label {
  text-align: center;
}
</style>
