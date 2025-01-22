<template>
  <div class="tinymce-editor">
    <Editor v-model="tinymceHtml" :id="tinymceId" :init="init" :disabled="disabled"></Editor>
  </div>
</template>

<script>
import { commonUpload } from '/src/api/system/user.js'
import tinymce from 'tinymce/tinymce' // tinymce默认hidden，不引入不显示
import Editor from '@tinymce/tinymce-vue' // 编辑器引入
import 'tinymce/themes/silver/theme' // 编辑器主题
import 'tinymce/icons/default/icons' // 图标
// 加载所需插件，和plugins配置选项保持一致
import 'tinymce/plugins/image' // 插入上传图片插件
import 'tinymce/plugins/media' // 插入视频插件
import 'tinymce/plugins/table' // 插入表格插件c
import 'tinymce/plugins/lists' // 列表插件
import 'tinymce/plugins/wordcount' // 字数统计插件
import 'tinymce/plugins/charmap' // 特殊字符
import 'tinymce/plugins/preview' // 预览
import 'tinymce/plugins/hr' // 水平线
import 'tinymce/plugins/imagetools' // 图片编辑工具
import 'tinymce/plugins/code' // 编辑源码
import 'tinymce/plugins/fullscreen' // 全屏
import 'tinymce/plugins/link' // 超链接
import 'tinymce/plugins/paste' // 粘贴
import 'tinymce/plugins/quickbars' // 快速工具栏
import 'tinymce/plugins/searchreplace' // 查找替换
import 'tinymce/plugins/print' // 打印
import 'tinymce/plugins/importcss'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/autosave'
import 'tinymce/plugins/save'
import 'tinymce/plugins/directionality'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/visualchars'
import 'tinymce/plugins/template'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/toc'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/textpattern'
import 'tinymce/plugins/noneditable'
import 'tinymce/plugins/help'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/emoticons/js/emojis.min.js'

export default {
  components: {
    Editor
  },
  props: {
    //内容
    value: {
      type: String,
      default: ''
    },
    //是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    triggerChange: {
      type: Boolean,
      default: false,
      required: false
    },
    //插件
    plugins: {
      type: [String, Array],
      default:
        'print preview importcss  searchreplace autolink autosave save directionality  visualblocks visualchars fullscreen image link media  template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists  wordcount   imagetools textpattern noneditable help    charmap   quickbars  emoticons code'
    },
    toolbar: {
      type: [String, Array],
      default() {
        return [
          'code | undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist  | forecolor backcolor casechange   removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media  template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment '
        ]
      }
    },
    inline: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //初始化配置
      tinymceHtml: '请输入内容',
      tinymceId: 'tinymce',
      myValue: this.value,
      mytinymce: tinymce
    }
  },
  computed: {
    init() {
      const publicPath = import.meta.env.VITE_PUBLIC_PATH || '/'
      console.log('publicPath', publicPath)
      return {
        inline: this.inline,
        // images_upload_url: `${import.meta.env.VITE_APP_BASE_API}/common/upload`, //这两行是更改只能上传图片路径的方法，变成可以拖拉上传（此处路径为后端需要上传图片的路径）
        // images_upload_base_path: '/demo', //这两行是更改只能上传图片路径的方法，变成可以拖拉上传
        language_url: `${publicPath}tinymce/langs/zh_CN.js`, //自己的static路径，路径错误会汉化失败
        language: 'zh_CN', //注意大小写
        selector: '#tinymce',
        skin_url: `${publicPath}tinymce/skins/ui/oxide`, //自己的static中路径
        content_css: `${publicPath}tinymce/skins/content/default/content.css`, //自己的static中路径
        content_style: 'img {max-width:100%;}', //限制图片大小
        plugins: this.plugins, //插件
        // menubar: false, //此处设置为false为默认不显示菜单栏，如果需要展示出来可以将此行注释
        menubar: 'file edit insert view format table',
        branding: false,
        //工具栏
        toolbar: this.toolbar,
        height: 500, //高度
        branding: false, //隐藏右下角技术支持
        paste_preprocess: function (plugin, args) {
          console.log(args.content)
        },
        paste_as_text: true,
        //init_instance_callback为回调配置项
        init_instance_callback: editor => {
          // console.log(`回调----`)
          editor.on('input', e => {
            // console.log('文本框input触发')
            this.$emit('input', e.target.innerHTML)
          })
          editor.on('change', e => {
            // console.log('文本框change触发')
            this.$emit('change', e.level.content)
          })
        },
        images_upload_handler: (blobInfo, success, failure) => {
          //文件上传的formData传递
          const isAccord = blobInfo.blob().type === 'image/jpeg' || blobInfo.blob().type === 'image/png' || blobInfo.blob().type === 'image/GIF' || blobInfo.blob().type === 'image/jpg' || blobInfo.blob().type === 'image/BMP'
          if (blobInfo.blob().size / 1024 / 1024 > 2) {
            failure('上传失败，图片大小请控制在 2M 以内')
          } else if (blobInfo.blob().type == isAccord) {
            failure('图片格式错误')
          } else {
            const formData = new FormData()
            // 服务端接收文件的参数名，文件数据，文件名
            formData.append('file', blobInfo.blob(), blobInfo.filename())
            commonUpload(formData)
              .then(res => {
                // this.$message.success(res.msg)
              })
              .catch(() => {
                failure('上传失败')
              })
          }
        }
      }
    }
  },
  mounted() {
    tinymce.init({}) //初始化编辑器
  },
  methods: {}
}
</script>
<style scoped>
.tox-dialog {
  z-index: 10000;
}
.tox-dialog--width-lg {
  z-index: 10000;
}
</style>
