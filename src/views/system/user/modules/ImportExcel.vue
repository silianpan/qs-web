<template>
  <a-modal :title="upload.title" :visible="upload.open" @cancel="importExcelHandleCancel">
    <a-spin tip="上传中..." :spinning="upload.uploadStatus == 'uploading'">
      <a-upload-dragger name="file" accept=".xlsx, .xls" :file-list="upload.fileList" :multiple="false" :headers="upload.headers" :action="upload.url + '?updateSupport=' + upload.updateSupport" @change="importExcelHandleChange">
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">请将文件拖拽到此处上传❥(^_-)</p>
        <p class="ant-upload-hint">支持单个上传，也可以点击后选择文件上传</p>
      </a-upload-dragger>
      <a-checkbox @change="handleCheckedUpdateSupport" :checked="upload.updateSupport != 0"> 是否更新已经存在的用户数据 </a-checkbox>
      <a @click="importTemplate">下载模板</a>
    </a-spin>
  </a-modal>
</template>

<script>
import storage from 'store'
import { ACCESS_TOKEN } from '/src/store/mutation-types.js'
import { importTemplate } from '/src/api/system/user.js'

export default {
  name: 'ImportExcel',
  props: {},
  components: {},
  data() {
    return {
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        uploadStatus: '',
        fileList: [],
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN) },
        // 上传的地址
        url: import.meta.env.VITE_APP_BASE_API + '/system/user/importData'
      }
    }
  },
  filters: {},
  created() {},
  computed: {},
  watch: {},
  methods: {
    /** 导入excel窗体关闭 */
    importExcelHandleCancel(e) {
      this.upload.open = false
      this.upload.fileList = []
      // 关闭后刷新列表
      this.$emit('ok')
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.download(response.msg)
      })
    },
    /** 导入excel窗体开启 */
    importExcelHandleOpen(e) {
      this.upload.open = true
    },
    /** 导入excel */
    importExcelHandleChange(info) {
      const status = info.file.status
      this.upload.uploadStatus = status
      if (status !== 'uploading') {
      }
      if (status === 'done') {
        this.$message.success(`${info.file.name}: ${info.file.response.msg}`)
      } else if (status === 'error') {
        this.$message.error(`${info.file.name}: ${info.file.response.msg}`)
      }
      this.upload.open = false
      this.upload.fileList = []
      this.$emit('ok')
    },
    handleCheckedUpdateSupport() {
      this.upload.updateSupport = this.upload.updateSupport === 0 ? 1 : 0
    }
  }
}
</script>
