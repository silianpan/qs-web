<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import { mapGetters } from 'vuex'
import defaultSettings from '/src/config/defaultSettings.js'
import watermark from '/src/utils/common/watermark.js'
import moment from 'moment'
import { domTitle, setDocumentTitle } from '/src/utils/common/domUtil.js'
import { i18nRender } from '/src/locales/index.js'

export default {
  computed: {
    ...mapGetters(['nickname', 'defaultCompany']),
    locale() {
      // 只是为了切换语言时，更新标题
      const { title } = this.$route.meta
      title && setDocumentTitle(`${i18nRender(title)} - ${domTitle}`)
      return this.$i18n.getLocaleMessage(this.$store.getters.lang).antLocale
    }
  },
  mounted() {
    // 添加水印
    if (defaultSettings.watermark) {
      setInterval(() => {
        watermark(`${this.defaultCompany || defaultSettings.comany}<br>${moment().format('YYYY-MM-DD HH:mm:ss')}<br>${this.nickname || ''}`)
      }, 1000)
    }
  }
}
</script>

<style lang="less">
.water-mark-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
  top: 0;
  left: 0;
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;
}
.water-word {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: rgba(191, 191, 191, 0.15);
  transform: rotate(-15deg);
  user-select: none;
}
// 全局修改sform中 datepicker的宽度，与其他表单对齐
.ant-form-item-children {
  display: inline-block;
  width: 100%;
  .ant-calendar-picker {
    display: inline-block;
    width: 100%;
  }
}
</style>
