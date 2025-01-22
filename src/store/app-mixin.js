import { mapState } from 'vuex'

const baseMixin = {
  computed: {
    ...mapState({
      layout: state => state.app.layout,
      navTheme: state => state.app.theme,
      primaryColor: state => state.app.color,
      colorWeak: state => state.app.weak,
      fixedHeader: state => state.app.fixedHeader,
      fixedSidebar: state => state.app.fixedSidebar,
      contentWidth: state => state.app.contentWidth,
      autoHideHeader: state => state.app.autoHideHeader,

      isMobile: state => state.app.isMobile,
      sideCollapsed: state => state.app.sideCollapsed,
      multiTab: state => state.app.multiTab,
      breadcrumb: state => state.app.breadcrumb,
      footerView: state => state.app.footerView,
      showFirstLevelMenu: state => state.app.showFirstLevelMenu,
      menuIconHorizontal: state => state.app.menuIconHorizontal,
    }),
    isTopMenu() {
      return this.layout === 'topmenu'
    }
  },
  methods: {
    isSideMenu() {
      return !this.isTopMenu
    }
  }
}

export { baseMixin }
