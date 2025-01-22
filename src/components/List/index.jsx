// 项目卡片列表
import List from 'ant-design-vue/es/list'
import ListItem from 'ant-design-vue/es/list/Item.js'
export default {
  name: 'SList',
  props: Object.assign({}, List.props, {
    data: {
      type: Function,
      required: true
    },
    pagination: {
      type: Object,
      default: () => {}
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    showSizeChanger: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'default'
    },
    showPagination: {
      type: String | Boolean,
      default: 'auto'
    },
    /**
     * enable page URI mode
     *
     * e.g:
     * /users/1
     * /users/2
     * /users/3?queryParam=test
     * ...
     */
    pageURI: {
      type: Boolean,
      default: false
    },
    // 响应式布局
    grid: {
      type: Object,
      default: () => {
        return { gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }
      }
    }
  }),
  data() {
    return {
      localLoading: false,
      localDataSource: [],
      localPagination: Object.assign(
        {
          pageSizeOptions: ['10', '20', '50', '100']
        },
        this.pagination
      )
      // localGrid: { gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }
    }
  },
  watch: {
    'localPagination.current'(val) {
      this.pageURI &&
        this.$router.push({
          ...this.$route,
          name: this.$route.name,
          params: Object.assign({}, this.$route.params, {
            pageNum: val
          })
        })
    },
    pageNum(val) {
      Object.assign(this.localPagination, {
        current: val
      })
    },
    pageSize(val) {
      Object.assign(this.localPagination, {
        pageSize: val
      })
    },
    showSizeChanger(val) {
      Object.assign(this.localPagination, {
        showSizeChanger: val
      })
    }
  },
  created() {
    const { pageNum } = this.$route.params
    const localPageNum = (this.pageURI && pageNum && parseInt(pageNum)) || this.pageNum
    this.localPagination =
      (['auto', true].includes(this.showPagination) &&
        Object.assign({}, this.localPagination, {
          current: localPageNum,
          pageSize: this.pageSize,
          showSizeChanger: this.showSizeChanger,
          onChange: (page, pageSize) => {
            this.localPagination.current = page
            this.localPagination.pageSize = pageSize
            this.loadData()
          },
          onShowSizeChange: (current, size) => {
            this.localPagination.current = current
            this.localPagination.pageSize = size
            this.loadData()
          }
        })) ||
      false
    this.loadData()
  },
  methods: {
    /**
     * 表格重新加载方法
     * 如果参数为 true, 则强制刷新到第一页
     * @param Boolean bool
     */
    refresh(bool = false) {
      bool &&
        (this.localPagination = Object.assign(
          {},
          {
            current: 1,
            pageSize: this.pageSize
          }
        ))
      this.loadData()
    },
    /**
     * 加载数据方法
     * @param {Object} pagination 分页选项器
     * @param {Object} filters 过滤条件
     * @param {Object} sorter 排序条件
     */
    loadData(pagination, filters, sorter) {
      this.localLoading = true
      const parameter = Object.assign(
        {
          pageNum: (pagination && pagination.current) || (this.showPagination && this.localPagination.current) || this.pageNum,
          pageSize: (pagination && pagination.pageSize) || (this.showPagination && this.localPagination.pageSize) || this.pageSize
        },
        (sorter &&
          sorter.field && {
            sortField: sorter.field
          }) ||
          {},
        (sorter &&
          sorter.order && {
            sortOrder: sorter.order
          }) ||
          {},
        {
          ...filters
        }
      )
      const result = this.data(parameter)
      // 对接自己的通用数据接口需要修改下方代码中的 r.pageNum, r.totalCount, r.data
      // eslint-disable-next-line
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        result.then(r => {
          this.localPagination =
            (this.showPagination &&
              Object.assign({}, this.localPagination, {
                current: r.pageNum, // 返回结果中的当前分页数
                total: r.totalCount, // 返回结果中的总记录数
                showSizeChanger: this.showSizeChanger,
                pageSize: (pagination && pagination.pageSize) || this.localPagination.pageSize
              })) ||
            false
          // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
          if (r.data.length === 0 && this.showPagination && this.localPagination.current > 1) {
            this.localPagination.current--
            this.loadData()
            return
          }

          // 这里用于判断接口是否有返回 r.totalCount 且 this.showPagination = true 且 pageNum 和 pageSize 存在 且 totalCount 小于等于 pageNum * pageSize 的大小
          // 当情况满足时，表示数据不满足分页大小，关闭 table 分页功能
          try {
            if (['auto', true].includes(this.showPagination) && r.totalCount <= r.pageNum * this.localPagination.pageSize) {
              this.localPagination.hideOnSinglePage = true
            }
          } catch (e) {
            this.localPagination = false
          }
          this.localDataSource = r.data // 返回结果中的数组数据
          this.localLoading = false
        })
      }
    },
    renderCardItem(item) {
      return <ListItem>{this.$scopedSlots.default({ item })}</ListItem>
    }
  },
  render() {
    const props = {}
    const localKeys = Object.keys(this.$data)

    Object.keys(List.props).forEach(k => {
      const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
      if (localKeys.includes(localKey)) {
        props[k] = this[localKey]
        return props[k]
      }
      this[k] && (props[k] = this[k])
      return props[k]
    })

    // props
    const { grid } = this.$props

    return (
      <div class="ant-pro-pages-list-projects-cardList">
        <List {...{ props, scopedSlots: { ...this.$scopedSlots }, grid }} renderItem={item => this.renderCardItem(item)} />
      </div>
    )
  }
}
