<!-- 流程表单设计 -->
<template>
  <div v-if="spinning" style="text-align: center">
    <a-spin :spinning="spinning"> </a-spin>
  </div>
  <div v-else class="page">
    <header class="page__header">
      <div class="step-tab">
        <div v-for="(item, index) in steps" :key="index" class="step" :class="[activeStep == item.key ? 'active' : '']" @click="changeSteps(item)">
          <span class="step-index">{{ index + 1 }}</span>
          {{ item.label }}
        </div>
      </div>
      <el-button size="small" class="publish-btn" @click="publish">发布</el-button>
    </header>
    <div v-if="mockData" class="page__content">
      <Process ref="processDesign" :conf="mockData.processData" tabName="processDesign" v-show="activeStep === 'processDesign'" />
    </div>
  </div>
</template>

<script>
import Process from '../components/Process/index.vue'
import { GET_MOCK_CONF } from '/src/api/processDesign/index.js'
import { setProcess, detailProcess } from '/src/api/processDesign/index.js'

const beforeUnload = function (e) {
  var confirmationMessage = '离开网站可能会丢失您编辑得内容'
  ;(e || window.event).returnValue = confirmationMessage // Gecko and Trident
  return confirmationMessage // Gecko and WebKit
}
export default {
  name: 'FormDesign',
  components: { Process },
  data() {
    return {
      // 加载字段
      spinning: true,
      // 表单字段
      formItems: [],
      activeStep: 'processDesign', // 激活的步骤面板
      steps: [{ label: '流程设计', key: 'processDesign' }],
      mockData: null // 可选择诸如 $route.param，Ajax获取数据等方式自行注入
    }
  },
  methods: {
    changeSteps(item) {
      this.activeStep = item.key
    },
    publish() {
      const getCmpData = name => this.$refs[name].getData()
      const p3 = getCmpData('processDesign')
      Promise.all([p3])
        .then(res => {
          const param = {
            processData: res[0].formData
          }
          this.sendToServer(param)
        })
        .catch(err => {
          err.target && (this.activeStep = err.target)
          err.msg && this.$message.warning(err.msg)
        })
    },
    sendToServer(param) {
      const { menuId, menuName, tenantAppId } = this.$route.query
      const menuIdInt = parseInt(menuId)
      const tenantAppIdInt = parseInt(tenantAppId)
      // 为空新增
      if (this._.isNil(this.mockData._id)) {
        const data = {
          tenantAppId: tenantAppIdInt,
          menuId: menuIdInt,
          menuName,
          processData: param.processData
        }
        setProcess(data).then(res => {
          if (res.code === 200) {
            this.$message.success('创建成功')
            this.$router.go(-1)
          }
        })
        // 否则修改
      } else {
        const data = {
          tenantAppId: tenantAppIdInt,
          menuId: menuIdInt,
          menuName,
          processData: param.processData,
          _id: this.mockData._id
        }
        setProcess(data).then(res => {
          if (res.code === 200) {
            this.$message.success('编辑成功')
            this.$router.go(-1)
          }
        })
      }
    },
    handleFormItem() {
      const { formItems: formItemsQuery, conditions } = this.$route.query
      this.formItems = []
      // 表单配置项
      if (formItemsQuery) {
        formItemsQuery.map(item => {
          item.map(i => {
            if (i.type === 'select') {
              i.formId = this.uuidv4()
              // 将其设置为el的组件
              i.tag = 'el-select'
              i.vModel = i.prop
              this.formItems.push(i)
            } else if (i.type === 'inputNumber') {
              i.formId = this.uuidv4()
              // 将其设置为el的组件
              i.tag = 'el-input-number'
              i.vModel = i.prop
              this.formItems.push(i)
            } else if (i.type === 'radio') {
              i.formId = this.uuidv4()
              // 将其设置为el的组件
              i.tag = 'el-radio-group'
              i.vModel = i.prop
              this.formItems.push(i)
            }
          })
        })
      }
      if (conditions) {
        try {
          this.formItems = JSON.parse(conditions)
        } catch (error) {
          console.log('err', error)
          this.formItems = []
        }
      }
      this.$store.commit('clearPCondition')
      this.$store.commit('initPConditions', this.formItems)
    },
    initFlowData() {
      // 处理formItems
      this.handleFormItem()
      const { menuId, tenantAppId } = this.$route.query
      detailProcess({
        tenantAppId: parseInt(tenantAppId),
        menuId: parseInt(menuId)
      }).then(res => {
        // 为空就做新增操作
        if (this.isEmpty(res)) {
          GET_MOCK_CONF().then(data => {
            this.mockData = data
            this.spinning = false
          })
        } else {
          // 否则就是修改
          // 回显
          this.mockData = res
          this.spinning = false
        }
      })
      // const formId = this.$route.query.formid
      // if (this._.isNil(formId) || this._.isEmpty(formId)) {
      //   GET_MOCK_CONF().then(data => (this.mockData = data))
      // } else {
      //   getFormDetail({ formId: this.$route.query.formid, tenantAppId: this.$route.query.id }).then(data => {
      //     this.mockData = data
      //   })
      // }
    }
  },
  beforeRouteEnter(to, from, next) {
    window.addEventListener('beforeunload', beforeUnload)
    next()
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('beforeunload', beforeUnload)
    next()
  },
  watch: {
    '$route.query': {
      handler(newVal, oldVal) {
        this.mockData = null
        this.initFlowData()
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="stylus" scoped>
$header-height = 54px;

.page {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .page__header {
    width: 100%;
    height: $header-height;
    flex-center();
    justify-content: center;
    box-sizing: border-box;
    color: white;
    background: #3296fa;
    font-size: 14px;
    position: sticky;
    top: 0;
    z-index: 10;

    .page-actions {
      text-align: center;
      line-height: $header-height;
      position: absolute;
      left: 0;

      > div {
        height: 100%;
        padding-left: 20px;
        padding-right: 20px;
        display: inline-block;
      }

      i {
        font-size: 22px;
        vertical-align: middle;
      }
    }

    .step-tab {
      display: flex;
      justify-content: center;
      height: 100%;
      position: relative;

      >.step {
        width: 140px;
        line-height: $header-height;
        padding-left: 30px;
        padding-right: 30px;
        cursor: pointer;
        position: relative;

        &.active >.step-index {
          background: white;
          color: #4483f2;
        }

        >.step-index {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 1px solid #fff;
          border-radius: 8px;
          line-height: 18px;
          text-align: center;
          box-sizing: border-box;
        }
      }
    }
  }

  .page__content {
    width: 100%;
    height: 90%;
    overflow: hidden;
    box-sizing: border-box;
    background: #f5f5f7;
  }
}

.publish-btn {
  color: #3296fa;
  padding: 7px 20px;
  border-radius: 4px;
  font-size: 14px;
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
}

.github {
  position: fixed;
  bottom: 10px;
  left: 20px;
}
</style>
