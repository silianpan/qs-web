// 步骤组件
import { Steps } from 'ant-design-vue'

export default {
  name: 'SSteps',
  props: Object.assign({}, Steps.props, {
    // 步骤项
    stepItems: {
      type: Array,
      require: true
    }
  }),
  render() {
    const { stepItems, ...props } = this.$props
    return (
      <div>
        <Steps {...{ props }}>
          {stepItems.map(item => {
            return <Steps.Step title={item.title} />
          })}
        </Steps>
        {this.$slots.default}
      </div>
    )
  }
}
