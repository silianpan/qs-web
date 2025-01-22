import { Tag } from 'ant-design-vue'
import { handleProcessHistory } from '/src/views/eos/config/busUtil.js'

export default {
  name: 'AuditStatusTag',
  props: {
    // 审批状态值
    state: {
      type: Number,
      default: null
    },
    // 流程实例ID
    instanceId: {
      type: String,
      default: null
    },
    clickable:{
      type: Boolean,
      defualt: false
    }
  },
  data() {
    return {
      // 审批状态Map
      auditStatusColorMap: {
        0: { color: 'green', text: '通过' },
        1: { color: 'blue', text: '未提交' },
        2: { color: 'orange', text: '流程中' },
        3: { color: 'red', text: '驳回' },
        4: { color: 'purple', text: '结束(未通过)' },
        null: { color: 'purple', text: '未知' }
      }
    }
  },
//   render() {
//     // 获取审批状态标签
//     const { state, instanceId, auditStatusColorMap } = this
//     return (
//       <span color={auditStatusColorMap[state].color}>{auditStatusColorMap[state].text}</span>
//     )
//   }
// }


  render() {
    // 获取审批状态标签
    const { state, instanceId, auditStatusColorMap } = this
    return this.clickable ? (
        <span
            onClick={(e) => {
              console.log('auditStatusTag instanceId', instanceId)
              e.stopPropagation()
              return handleProcessHistory(instanceId)
            }}
            style={{color:'#348ee4'}}
        >
          {auditStatusColorMap[state].text}
        </span>
    ) : (
        <span>{auditStatusColorMap[state].text}</span>
    )
  }
}
