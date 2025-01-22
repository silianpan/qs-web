<template>
  <div>
    <List itemLayout="horizontal" :dataSource="data">
      <ListItem slot="renderItem" slot-scope="item, index" :key="index">
        <ListItemMeta>
          <a slot="title">{{ item.title }}</a>
          <span slot="description">
            <span class="security-list-description">{{ item.description }}</span>
            <span v-if="item.value"> : </span>
            <span class="security-list-value">{{ item.value }}</span>
          </span>
        </ListItemMeta>
        <template v-if="item.actions">
          <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
        </template>
      </ListItem>
    </List>
    <!-- 修改密码抽屉 -->
    <update-password ref="updatePassword" />
  </div>
</template>

<script>
import 'ant-design-vue/es/list/style'
import List from 'ant-design-vue/es/list'
import ListItem from 'ant-design-vue/es/list/Item.js'
import UpdatePassword from './UpdatePassword'
const { Meta } = ListItem

export default {
  components: {
    List,
    ListItem,
    ListItemMeta: Meta,
    UpdatePassword
  },
  data() {
    return {
      data: [
        {
          title: '账户密码',
          description: '当前密码强度',
          value: '强',
          actions: {
            title: '修改',
            callback: () => {
              this.$refs.updatePassword.handleUpdatePwd()
            }
          }
        }
      ]
    }
  }
}
</script>
