import { Upload, Icon, Button } from 'ant-design-vue'
import storage from 'store'
import { ACCESS_TOKEN } from '/src/store/mutation-types'

export default {
  name: 'ImportExcel',
  props: {
    uploadData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    RenderImportExcel(item) {
      return (
        <Upload headers={{ Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN) }} action={import.meta.env.VITE_APP_BASE_API + '/common/upload'} {...item.compProps}>
          {this._.isFunction(item.renderUpload) ? (
            item.renderUpload(item)
          ) : (
            <Button type="primary" ghost>
              <Icon type="upload" />
              导入
            </Button>
          )}
        </Upload>
      )
    }
  },
  render() {
    return this.RenderImportExcel(this.uploadData)
  }
}
