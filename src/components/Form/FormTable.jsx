// 卡片表单：表格布局
import { Card, FormModel, Space, Button, Select, Input, Radio, DatePicker, Upload, Icon, InputNumber, TreeSelect } from 'ant-design-vue'
import storage from 'store'
import { ACCESS_TOKEN } from '/src/store/mutation-types.js'
import { previewDoc, deleteDoc } from '/src/components/Office/office.js'
import { isEmpty, uuidv4 } from '/src/utils/common/util.js'

export default {
  name: 'SFormTable',
  props: Object.assign({}, FormModel.props, {
    // 表单标题
    formTitle: {
      type: String,
      default: ''
    },
    formItems: {
      type: Array,
      required: true
    },
    formData: {
      type: Object,
      default: () => {}
    },
    // 底部是否有确认取消按钮
    ok: {
      type: Boolean,
      default: false
    },
    // 底部确定按钮文本
    okText: {
      type: String,
      default: '确 定'
    },
    // 查询字典keys
    queryDictKeys: {
      type: Array,
      default: () => []
    }
  }),
  data() {
    return {
      // 字典映射存储
      dictMap: {}
    }
  },
  created() {
    // 查询字典
    if (!isEmpty(this.queryDictKeys)) {
      this.queryDictKeys.forEach(key => {
        this.getDicts(key).then(res => {
          this.$set(this.dictMap, key, res.data)
        })
      })
    }
  },
  computed: {
    // render映射
    renderMap() {
      return {
        text: this.renderText,
        input: this.renderInput,
        inputNumber: this.renderInputNumber,
        inputTextArea: this.renderInputTextArea,
        select: this.renderSelect,
        radio: this.renderRadio,
        datePicker: this.renderDatePicker,
        datePickerRange: this.renderDatePickerRange,
        monthPicker: this.renderDateMonthPicker,
        upload: this.renderUpload,
        treeSelect: this.renderTreeSelect
      }
    }
  },
  methods: {
    // 文本
    renderText(item) {
      return (
        <span class="text" {...item.compProps}>
          {this.formData[item['prop']]}
        </span>
      )
    },
    // 输入
    renderInputItem(item, key) {
      return <Input key={key} class="text" vModel={this.formData[item['prop']]} placeholder="请输入" {...item.compProps} />
    },
    renderInput(item) {
      return item.renderSuffix instanceof Function ? (
        <div style={item.renderSuffixStyle || 'display:flex'}>
          {this.renderInputItem(item)}
          {item.renderSuffix(this.formData[item['prop']], this.formData)}
        </div>
      ) : (
        this.renderInputItem(item)
      )
    },
    // 输入
    renderInputNumber(item) {
      return <InputNumber class="text" vModel={this.formData[item['prop']]} placeholder="请输入" {...item.compProps} />
    },
    // 多行输入
    renderInputTextArea(item) {
      return <Input.TextArea autoSize={{ minRows: 3 }} class="text" vModel={this.formData[item['prop']]} placeholder="请输入" {...item.compProps} />
    },
    renderSelectItem(item, ops) {
      return (
        <Select
          vModel={this.formData[item['prop']]}
          placeholder="请选择"
          filterOption={(inputValue, option) => {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
          }}
          show-search
          allowClear={item.allowClear}
          {...item.compProps}
          open={item.open}
        >
          {ops.map((op, opIndex) => {
            return (
              <Select.Option key={`selectOp${opIndex}`} value={op[item['valueAlias'] || 'dictValue']}>
                {op[item['labelAlias'] || 'dictLabel']}
              </Select.Option>
            )
          })}
        </Select>
      )
    },
    // 选择
    renderSelect(item) {
      const ops = this.getOptions(item)
      if (!ops) return <span>请添加选项</span>
      return item.renderSuffix instanceof Function ? (
        <div style={item.renderSuffixStyle || 'display:flex'}>
          {this.renderSelectItem(item, ops)}
          {item.renderSuffix(this.formData[item['prop']], this.formData)}
        </div>
      ) : (
        this.renderSelectItem(item, ops)
      )
    },
    // 树选择
    renderTreeSelectItem(item, ops) {
      return (
        <TreeSelect
          vModel={this.formData[item['prop']]}
          treeData={ops}
          replaceFields={{ title: item['titleAlias'], key: item['keyAlias'], value: item['valueAlias'] }}
          placeholder="请选择"
          show-search
          allow-clear
          filterTreeNode={(inputValue, treeNode) => {
            return treeNode.data.props.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
          }}
          {...item.compProps}
        ></TreeSelect>
      )
    },
    renderTreeSelect(item) {
      const ops = this.getOptions(item)
      if (!ops) return <span>请添加选项</span>
      return item.renderSuffix instanceof Function ? (
        <div style={item.renderSuffixStyle || 'display:flex'}>
          {this.renderTreeSelectItem(item, ops)}
          {item.renderSuffix(this.formData[item['prop']], this.formData)}
        </div>
      ) : (
        this.renderTreeSelectItem(item, ops)
      )
    },
    // 单选框
    renderRadio(item) {
      const ops = this.getOptions(item)
      if (!ops) return <span>请添加选项</span>
      return (
        <Radio.Group vModel={this.formData[item['prop']]} {...item.compProps}>
          {ops.map((op, opIndex) => {
            return (
              <Radio key={`radioOp${opIndex}`} value={op[item['valueAlias'] || 'dictValue']}>
                {op[item['labelAlias'] || 'dictLabel']}
              </Radio>
            )
          })}
        </Radio.Group>
      )
    },
    // 日期选择
    renderDatePicker(item) {
      return <DatePicker vModel={this.formData[item['prop']]} placeholder="请选择日期" {...item.compProps} />
    },
    // 月份选择器
    renderDateMonthPicker(item) {
      return <DatePicker.MonthPicker vModel={this.formData[item['prop']]} placeholder="请选择日期" {...item.compProps} />
    },
    // 日期范围选择
    renderDatePickerRange(item) {
      return <DatePicker.RangePicker vModel={this.formData[item['prop']]} placeholder={['开始日期', '结束日期']} {...item.compProps} />
    },
    // 文件上传
    renderUpload(item) {
      return item.dragger ? (
        <Upload.Dragger
          headers={{ Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN) }}
          action={import.meta.env.VITE_APP_BASE_API + '/common/upload'}
          onChange={params => this.handleUploadChange(params, item)}
          onPreview={this.handleUploadPreview}
          remove={this.handleUploadRemove}
          defaultFileList={this.getUploadDefaultFileList(item)}
          {...item.compProps}
        >
          {this._.isFunction(item.renderUpload) ? (
            item.renderUpload(item)
          ) : (
            <Button type="dashed">
              <Icon type="upload" />
              点击上传
            </Button>
          )}
        </Upload.Dragger>
      ) : (
        <Upload
          headers={{ Authorization: 'Bearer ' + storage.get(ACCESS_TOKEN) }}
          action={import.meta.env.VITE_APP_BASE_API + '/common/upload'}
          onChange={params => this.handleUploadChange(params, item)}
          onPreview={this.handleUploadPreview}
          remove={this.handleUploadRemove}
          defaultFileList={this.getUploadDefaultFileList(item)}
          ref="upload"
          {...item.compProps}
        >
          {this._.isFunction(item.renderUpload) ? (
            item.renderUpload(item)
          ) : (
            <Button type="dashed">
              <Icon type="upload" />
              点击上传
            </Button>
          )}
        </Upload>
      )
    },
    // 获取选项
    getOptions(item) {
      // 常量选项
      let ops = item['options']
      if (!ops) {
        return null
      }
      // 获取查询字典映射
      if (this._.isString(ops)) {
        ops = this.dictMap[ops] || []
      } else if (this._.isFunction(ops)) {
        // 函数获取选项
        ops = ops(item)
      }
      return ops
    },
    handleUploadChange({ file, fileList, event }, item) {
      if (file.response && file.response.code !== 200) {
        return this.$message.error(file.response.msg)
      }
      const ret = []
      fileList.forEach(fileItem => {
        if (fileItem.response && fileItem.response.code === 200) {
          ret.push({ name: fileItem.name, url: fileItem.response.fileName })
        } else if (fileItem.name && fileItem.url) {
          ret.push({ name: fileItem.name, url: fileItem.url })
        }
      })
      if (file.status === 'done') {
        if (ret.length > 0) {
          if (item && item.handleChange instanceof Function) {
            item.handleChange(ret, { file, fileList, event })
          }
        }
      } else if (file.status === 'removed') {
        if (item && item.handleChange instanceof Function) {
          item.handleChange(ret, { file, fileList, event })
        }
      }
    },
    handleUploadPreview(file) {
      if (file.response) {
        if (file.status === 'done' && file.response.code === 200) {
          previewDoc(file.name, file.response.fileName)
        }
      } else {
        previewDoc(file.name, file.url)
      }
    },
    handleUploadRemove(file) {
      return new Promise((resolve, reject) => {
        this.$antdconfirm({
          title: '删除附件',
          content: '是否删除附件：' + file.name + '?',
          onOk: () => {
            const fileName = file.response ? file.response.fileName : file.url
            deleteDoc(fileName)
              .then(() => {
                this.$message.success('删除成功')
                resolve(true)
              })
              .catch(err => {
                this.$message.error('删除失败')
                reject(err)
              })
          },
          onCancel: () => {
            reject(new Error('删除失败'))
          }
        })
      })
    },
    getUploadDefaultFileList(item) {
      let fileList = []
      if (item && item.customDefaultFileList instanceof Function) {
        const fileData = item.customDefaultFileList()
        if (!isEmpty(fileData)) {
          fileList = JSON.parse(fileData)
          fileList.forEach(item => {
            item.uid = uuidv4()
          })
        }
      }
      // 这里改出问题了
      // if (!this.isEmpty(this.$refs.upload) && this.isEmpty(this.$refs.upload.sFileList)) {
      if (!this.isEmpty(fileList) && !this.isEmpty(this.$refs.upload)) {
        this.$refs.upload.sFileList = fileList
      }
      return fileList
    },
    // FormModel
    renderFormModel() {
      const { formTitle, formItems, formData, ...props } = this.$props
      return (
        <FormModel ref="ruleForm" props={{ ...props, model: formData }}>
          <Card class="table-card">
            <span class="documentsIssuedTitle">{formTitle}</span>
            {/* 表格头部（标题下） */}
            {this.$slots.theader}
            {/* 表格卡片表单 */}
            <table border="1px" class="documentsIssueTable">
              {formItems.map((subItems, formIndex) => {
                return (
                  <tr key={`formItem${formIndex}`}>
                    {subItems.map((item, subIndex) => {
                      return this._.isFunction(item.render)
                        ? item.render(item)
                        : [1, 2].map(i => {
                            return i === 1 ? (
                              <td key={`subItem1${formIndex}${subIndex}`} class="firstTr">
                                {item['label']}
                              </td>
                            ) : (
                              <td key={`subItem2${formIndex}${subIndex}`} colspan={item.colspan || 2} class="firstTr">
                                <FormModel.Item key={`subItemFormModelItem${formIndex}${subIndex}`} prop={item['prop']}>
                                  {this._.isFunction(this.renderMap[item['type']]) ? this.renderMap[item['type']](item, `subItemFormModelItem${formIndex}${subIndex}`) : '配置项不正确'}
                                </FormModel.Item>
                              </td>
                            )
                          })
                    })}
                  </tr>
                )
              })}
            </table>
            {/* 表格尾部 */}
            {this.$slots.tfooter}
          </Card>
        </FormModel>
      )
    }
  },
  render() {
    return (
      <div>
        {/* 头部 */}
        {this.$slots.header}
        {/* 表单内容 */}
        {this.renderFormModel()}
        {/* 是否有确定按钮 */}
        {this.ok ? (
          <div class="bottom-control">
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                      this.$emit('submit', this.formData)
                    } else {
                      return false
                    }
                  })
                }}
              >
                {this.okText}
              </Button>
              <Button
                onClick={() => {
                  this.$emit('cancel')
                }}
              >
                取 消
              </Button>
            </Space>
          </div>
        ) : (
          ''
        )}
        {/* 尾部 */}
        {this.$slots.footer}
      </div>
    )
  }
}
