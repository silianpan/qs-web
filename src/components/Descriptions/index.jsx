// 详情页
import { Card, Descriptions } from 'ant-design-vue'
export default {
  name: 'SDescriptions',
  props: Object.assign({}, Descriptions.props, {
    // 表单标签：中英文对照
    formItems: {
      type: Array,
      default: () => []
    },
    // 表单数据
    formData: {
      type: Object,
      default: () => {}
    }
  }),
  render() {
    const { ...props } = this.$props
    const { title } = this.$props
    return (
      <Card bordered={false} size='small'>
        <a-collapse expand-icon-position='right' defaultActiveKey={title}>
          <a-collapse-panel key={title} class='custom-collapse-panel'>
            <span slot='header' class='custom-collapse-panel-header'>
              {title}
            </span>
            <Descriptions>
              {this.formItems.map(item => {
                // let value = this.formData[item['prop']]
                let value = this._.get(this.formData, item['prop'], '')
                if (this._.isFunction(item['formatter'])) {
                  value = item['formatter'](value)
                }
                return <Descriptions.Item label={item.label}>{item.customRender instanceof Function ? item.customRender(value, this.formData) : value}</Descriptions.Item>
              })}
            </Descriptions>
            <template slot='extra'>{this.$slots.extra}</template>
          </a-collapse-panel>
        </a-collapse>
      </Card>
    )
  }
}
