<template>
  <a-card :bordered="false">
    <div class="table-header-btns">
      <s-upload style="width: 100%" :uploadData="uploadData" />
    </div>

    <no-data v-show="noData" />
    <!-- 数据表格 -->
    <s-table style="margin-top: 10px" v-show="!noData" ref="table" size="default" :rowKey="(_, index) => index" :columns="columns" :data="loadData" :showPagination="false" />
  </a-card>
</template>

<script lang="jsx">
import { SUpload, STable } from '/src/components/index.js'
import { OCRTextinBillsCrop } from '/src/api/eos/invoice/baidu_invoice.js'
import downloadUtil from '/src/utils/common/download.js'
import { previewDoc } from '/src/components/Office/office.js'
import storage from 'store'
import { TENANT_ID } from '/src/store/mutation-types.js'
import demoJson from './demo.json'

export default {
  components: { SUpload, STable },
  mounted() {
    if (!this.isEmpty(demoJson)) {
      this.invoiceDatas = demoJson
    }
  },
  methods: {
    // 查看图片
    async handlePreview(file) {
      previewDoc(file.name, file.url)
    }
  },
  data() {
    return {
      noData: false,
      invoiceDatas: [],
      loadData: param => {
        return new Promise(resolve => resolve(param)).then(() => {
          return {
            data: this.invoiceDatas
          }
        })
      },
      columns: [
        {
          title: '票据类型',
          align: 'left',
          dataIndex: 'type_description',
          width: 180,
          customRender: (text, record) => {
            const fileName = record.file
            const fileUrl = `/profile/ocrdemo/${record.file}`
            const ext = fileName.substring(fileName.lastIndexOf('.') + 1)
            console.log('ext', ext)
            if (ext === 'pdf') {
              return (
                <div>
                  <p>{text}</p>
                  <p style="color:#348ee4;cursor:pointer" onClick={() => previewDoc(text, fileUrl)}>
                    {record.file}
                  </p>
                </div>
              )
            } else {
              const tenantId = storage.get(TENANT_ID)
              const url = import.meta.env.VITE_APP_BASE_API + '/wopi/common/download/tenant?name=' + encodeURIComponent(fileName) + '&url=' + fileUrl + '&tenantId=' + tenantId
              return (
                <div>
                  <p>{text}</p>
                  <img style="width:50px;height:50px;cursor:pointer" src={url} onClick={() => previewDoc(text, fileUrl)} />
                </div>
              )
            }
          }
        },
        {
          title: '使用类型',
          align: 'left',
          dataIndex: 'kind_description',
          width: 100
        },
        {
          title: '大类类型',
          align: 'left',
          dataIndex: 'class',
          width: 100,
          customRender: text => (text === 'nation_tax_invoice' ? '国税' : text === 'local_invoice' ? '地方税种' : text === 'other_invoice' ? '其他票种' : text)
        },
        {
          title: '其他识别结果',
          align: 'left',
          dataIndex: 'item_list',
          customRender: (text, record) => {
            if (text) {
              return text.map(item => {
                return `${item.description}: ${item.value};`
              })
            } else if (record.others) {
              return record.others
            }
          }
        }
      ],
      /* 上传组件回调和参数 */
      uploadData: {
        compProps: {
          props: {
            multiple: true,
            'list-type': 'picture',
            beforeUpload: (file, fileList) => {
              if (fileList.length > 2) {
                return new Promise((resolve, reject) => {
                  this.$message.warning('一次最多上传2张发票!')
                  return reject
                })
              }
              return new Promise((resolve, reject) => {
                this.spinning = true
                if (file) {
                  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/bmp' || file.type === 'application/pdf' || file.type === 'application/ofd'
                  if (!isJpgOrPng) {
                    this.spinning = false
                    this.$message.error('您只能上传图片、PDF或ofd格式文件!')
                    return reject
                  }
                  const isLt2M = file.size / 1024 / 1024 < 10
                  if (!isLt2M) {
                    this.spinning = false
                    this.$message.error('文件必须小于10MB!')
                    return reject
                  }
                  // 允许上传
                  resolve(file)
                }
              })
            }
            /* remove: file => {
                  return new Promise((resolve, reject) => {
                    if (file.id) {
                      deleteInvoice(file.id).then(res => {
                        return resolve(true)
                      })
                    } else {
                      const addFilter = this.fileListData.filter(item => item.uid !== file.uid)
                      this.fileListData = addFilter
                      return resolve(true)
                    }
                  })
                } */
          },
          on: {
            change: ({ file, fileList, event }) => {
              if (file.status === 'done' || file.status === 'removed') {
                const ret = []
                fileList.forEach((item, index) => {
                  if (item.response && item.response.code === 200) {
                    ret.push({ attachment: item.response.fileName, ...item })
                  }
                })
                if (ret.length > 0) {
                  // 发票上传成功之后的URL----fileList
                  this.spinning = false
                  this.fileListData = ret
                }
                // 调用识别接口
                downloadUtil.binary(file.name, file.response.fileName).then(blobData => {
                  OCRTextinBillsCrop(blobData).then(ocrRet => {
                    console.log('ocrRet', ocrRet)
                    if (ocrRet.code === 200) {
                      const { result } = ocrRet
                      this.invoiceDatas = [...this.invoiceDatas, ...result.object_list]
                      this.$refs.table.refresh(true)
                    }
                  })
                })
              }
            },
            // 点击图片预览回调
            preview: this.handlePreview
          }
        }
      }
    }
  }
}
</script>
