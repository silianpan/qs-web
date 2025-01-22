import { Upload, Icon, Button } from 'ant-design-vue'
import storage from 'store'
import { ACCESS_TOKEN } from '/src/store/mutation-types'
export default {
  name: 'SUpload',
  props: {
    uploadData: {
      type: Object,
      default: () => {}
    },
    btn: {
      type: String,
      default: '上传发票'
    }
  },
  computed: {
    // render映射
    renderMap() {
      return {
        upload: this.renderUpload
      }
    }
  },
  data() {
    return {
      base64: ''
    }
  },
  methods: {
    getUploadDefaultFileList(item) {
      let fileList = []
      if (item && item.customDefaultFileList instanceof Function) {
        fileList = item.customDefaultFileList()
      }
      // 这里改出问题了
      // if (!this.isEmpty(this.$refs.upload) && this.isEmpty(this.$refs.upload.sFileList)) {
      // if (!this.isEmpty(fileList) && !this.isEmpty(this.$refs.upload)) {
      //   this.$refs.upload.sFileList = fileList
      // }
      return fileList
    },
    renderUpload(item) {
      return (
        <Upload headers={{ Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN) }} action={import.meta.env.VITE_APP_BASE_API + '/common/upload'} {...item.compProps} defaultFileList={this.getUploadDefaultFileList(item)}>
          {this._.isFunction(item.renderUpload) ? (
            item.renderUpload(item)
          ) : (
            <Button type="primary" ghost>
              <Icon type="upload" />
              {this.btn}
            </Button>
          )}
        </Upload>
      )
    }
  },
  render() {
    return this.renderUpload(this.uploadData)
  }
}
