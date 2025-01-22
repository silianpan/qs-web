// 渲染附件列表
// import { getClassWithColor } from 'file-icons-js'
import 'ant-design-vue/es/list/style'
import List from 'ant-design-vue/es/list'
import ListItem from 'ant-design-vue/es/list/Item.js'
import { Popover } from 'ant-design-vue'
import Ellipsis from '/src/components/Ellipsis/Ellipsis.vue'
import { previewDoc, downloadDoc } from './office.js'

export default {
  name: 'SDocList',
  props: {
    // db保存的附件列表，注意是json字符串
    text: {
      type: String,
      default: null
    }
  },
  render() {
    const { text } = this.$props
    if (text) {
      const arr = JSON.parse(text)
      if (arr && arr.length > 0) {
        return (
          <Popover>
            <template slot="content">
              {/* <ul>
                {arr.map(item => {
                  return (
                    <li style="margin:5px 0;cursor: pointer" onClick={() => previewDoc(item.name, item.url)}>
                      <span style="margin-right:5px" class={getClassWithColor(item.name)} />
                      {item.name}
                    </li>
                  )
                })}
              </ul> */}
              <List
                data-source={arr}
                bordered
                renderItem={item => {
                  return (
                    <ListItem>
                      <span style="cursor: pointer;" onClick={() => previewDoc(item.name, item.url)}>
                        {/* <span style="margin-right:5px" class={getClassWithColor(item.name)} /> */}
                        {item.name}
                      </span>
                      <icon-font onClick={() => downloadDoc(item.name, item.url)} style="font-size:18px" slot="actions" type="iconfont-xiazai" />
                    </ListItem>
                  )
                }}
              ></List>
            </template>
            <div style="cursor: pointer" onClick={() => previewDoc(arr[0].name, arr[0].url)}>
              {/* <span style="margin-right:5px" class={getClassWithColor(arr[0].name)} /> */}
              <Ellipsis length={10}>{arr[0].name}</Ellipsis>
            </div>
          </Popover>
        )
      }
    }
    return text
  }
}
