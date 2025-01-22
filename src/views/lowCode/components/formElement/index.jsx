import './index.less'
import { getAmountChinese } from '../utils/index.js'
import oneSelfDataElement from './oneSelfDataElement/index.vue'
import allDataElement from './allDataElement/index.vue'
import jsxPreviewCommit from '../../previewForm/jsxPreviewCommit.vue'

export default {
  name: 'FormElement',
  props: {
    element: {
      type: Object,
      require: true,
      default: null
    },
    formId: {
      type: [Number, String],
      default: null
    }
  },
  components: { oneSelfDataElement, allDataElement },
  data() {
    return {
      form: {},
      elementData: {},
      componentChild: {
        'el-input': (options, form) => {
          return <el-input vModel={form[options.vModel]} type={options.type} placeholder={options.placeholder} disabled={options.disabled} />
        },
        'el-select': (options, form) => {
          return (
            <el-select vModel={form[options.vModel]} placeholder={options.placeholder} disabled={options.disabled}>
              {options.options ? options.options.map(child => <el-option key={child.value} label={child.label} value={child.value}></el-option>) : null}
            </el-select>
          )
        },
        'el-input-number': (options, form) => {
          return (
            <el-input-number vModel={form[options.vModel]} stepStrictly={options['step-strictly']} controls-position={options['controls-position']} placeholder={options.placeholder} disabled={options.disabled}></el-input-number>
          )
        },
        'fc-amount': (options, form) => {
          return (
            <div class="fc-amount">
              <el-input-number
                style="width: 100%;"
                vModel={form[options.vModel]}
                onChange={this.handleInput}
                stepStrictly={options['step-strictly']}
                controls-position={options['controls-position']}
                placeholder={options.placeholder}
                disabled={options.disabled}
              ></el-input-number>
              <div class="explain-text">{('大写：', this.chinese)}</div>
            </div>
          )
        },
        'el-cascader': (options, form) => {
          return <el-cascader vModel={form[options.vModel]} props={options.props.props} options={options['options']} placeholder={options.placeholder} disabled={options.disabled}></el-cascader>
        },
        'el-radio-group': (options, form) => {
          return (
            <el-radio-group vModel={form[options.vModel]} disabled={options.disabled}>
              {options.options ? options.options.map(item => <el-radio key={item.value} label={item.label} value={item.value}></el-radio>) : null}
            </el-radio-group>
          )
        },
        'el-checkbox-group': ({ vModel, disabled, options }, form) => {
          return (
            <a-checkbox-group vModel={form[vModel]} disabled={disabled}>
              {options.length
                ? options.map(item => {
                    return (
                      <a-checkbox key={item.value} value={item.value}>
                        {item.label}
                      </a-checkbox>
                    )
                  })
                : null}
            </a-checkbox-group>
          )
        },
        'el-slider': (options, form) => {
          return <el-slider vModel={form[options.vModel]} showStops={options['show-stops']} max={options.max} min={options.min} step={options.step} disabled={options.disabled}></el-slider>
        },
        'el-time-picker': (options, form) => {
          return (
            <el-time-picker
              vModel={form[options.vModel]}
              picker-options={options['picker-options']['selectableRange']}
              value-format={options['value-format']}
              placeholder={options.placeholder}
              disabled={options.disabled}
            ></el-time-picker>
          )
        },
        'fc-time-duration': (options, form) => {
          return (
            <el-time-picker
              is-range
              vModel={form[options.vModel]}
              range-separator={options['range-separator']}
              start-placeholder={options['start-placeholder']}
              end-placeholder={options['end-placeholder']}
              placeholder={options.placeholder}
              disabled={options.disabled}
              value-format={options['value-format']}
            ></el-time-picker>
          )
        },
        'el-date-picker': (options, form) => {
          return <el-date-picker value-format={options['value-format']} vModel={form[options.vModel]} placeholder={options.placeholder} disabled={options.disabled}></el-date-picker>
        },
        'fc-date-duration': (options, form) => {
          return (
            <el-date-picker
              vModel={form[options.vModel]}
              type={options['type']}
              range-separator={options['range-separator']}
              start-placeholder={options['start-placeholder']}
              end-placeholder={options['end-placeholder']}
              placeholder={options.placeholder}
              disabled={options.disabled}
              value-format={options['value-format']}
            ></el-date-picker>
          )
        },
        'el-rate': (options, form) => {
          return <el-rate vModel={form[options.vModel]} show-text={options['show-text']} show-score={options['show-score']} max={options['max']} disabled={options.disabled}></el-rate>
        },
        'el-upload': (options, form) => {
          return (
            <el-upload
              before-upload={this.handlerUpload}
              action={options['action']}
              name={options['name']}
              multiple={options['multiple']}
              list-type={options['list-type']}
              auto-upload={options['auto-upload']}
              disabled={options['disabled']}
            >
              <el-button size="small" type="primary">
                {options['buttonText']}
              </el-button>
            </el-upload>
          )
        }
      },
      /* 大小写 */
      chinese: '',
      /* 选择器 */
      selectValue: 1,
      options: [
        {
          value: 1,
          label: '提交表单/发起流程'
        },
        {
          value: 2,
          label: '管理本人数据/流程'
        },
        {
          value: 3,
          label: '查看所有数据/流程'
        }
      ],
      TformId: null
    }
  },
  watch: {
    element: {
      handler(data) {
        if (data) {
          this.elementData = data
          this.form = {}
        }
      },
      deep: true
    },
    formId(data) {
      this.TformId = data
    }
  },
  methods: {
    handleInput(val) {
      this.chinese = getAmountChinese(val)
    },
    /* 文件上传之前钩子 */
    handlerUpload(file) {
      return new Promise((resolve, reject) => {
        return reject
      })
    },
    /* 切换菜单 */
    hanlderSelectd(val) {
      if (val === 1) {
        this.$emit('isSubmit', true)
      } else if (val === 2) {
        this.$emit('isSubmit', false)
      } else {
        this.$emit('isSubmit', false)
      }
    },
    // 提交表单
    submitForm(callbackFunc) {
      this.$refs.jsxPreviewCommit.submitForm(formData => {
        if (callbackFunc instanceof Function) {
          callbackFunc(formData)
        }
      })
    },
    // 重置表单
    resetForm() {
      this.$refs.jsxPreviewCommit.resetForm()
    }
  },
  render(h) {
    return (
      <div class="form-element-container">
        <div class="form-element-container-header">
          <el-select onChange={this.hanlderSelectd} vModel={this.selectValue} size={'small'}>
            {this.options.map(item => {
              return <el-option key={item.value} label={item.label} value={item.value} />
            })}
          </el-select>
        </div>
        <div class="form-element-container-body">
          {this.selectValue === 1 ? (
            // <el-form ref={this.elementData.formRef} vModel={this.form} label-width={this.elementData.labelWidth + 'px'}>
            //   <el-row gutter={this.elementData.gutter}>
            //     {this.elementData.fields
            //       ? this.elementData.fields.map(item => {
            //           return (
            //             <el-col span={item.span} key={item.formId}>
            //               <el-form-item label={item.label}>{this.componentChild[item.tag] ? this.componentChild[item.tag](item, this.form) : ''}</el-form-item>
            //             </el-col>
            //           )
            //         })
            //       : null}
            //   </el-row>
            // </el-form>
            <jsxPreviewCommit ref="jsxPreviewCommit" formData={this.elementData && this.elementData.fields ? this.elementData : null} />
          ) : this.selectValue === 2 ? (
            <oneSelfDataElement formId={this.TformId} />
          ) : (
            <allDataElement formId={this.TformId} />
          )}
        </div>
      </div>
    )
  }
}
