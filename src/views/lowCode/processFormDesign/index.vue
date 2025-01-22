<!-- 流程表单设计 -->
<template>
  <div class="page">
    <header class="page__header">
      <div class="page-actions">
        <div style="border-right: 1px solid #c5c5c5; cursor: pointer" @click="exit">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div>{{ title }}</div>
      </div>
      <div class="step-tab">
        <div v-for="(item, index) in steps" :key="index" class="step" :class="[activeStep == item.key ? 'active' : '']" @click="changeSteps(item)">
          <span class="step-index">{{ index + 1 }}</span>
          {{ item.label }}
        </div>
      </div>
      <el-button size="small" class="publish-btn" @click="publish">发布</el-button>
    </header>
    <div v-if="mockData" class="page__content">
      <BasicSetting ref="basicSetting" :conf="mockData.basicSetting" v-show="activeStep === 'basicSetting'" tabName="basicSetting" />
      <DynamicForm ref="formDesign" v-show="activeStep === 'formDesign'" :conf="mockData.formData" tabName="formDesign" />
      <Process ref="processDesign" :conf="mockData.processData" tabName="processDesign" v-show="activeStep === 'processDesign'" />
    </div>
  </div>
</template>

<script>
import DynamicForm from '../components/DynamicForm/index.vue'
import BasicSetting from '../components/BasicSetting/index.vue'
import Process from '../components/Process/index.vue'
import { GET_MOCK_CONF, createdFrom, updateForm, getFormDetail } from '/src/api/processDesign/index.js'

const beforeUnload = function (e) {
  var confirmationMessage = '离开网站可能会丢失您编辑得内容'
  ;(e || window.event).returnValue = confirmationMessage // Gecko and Trident
  return confirmationMessage // Gecko and WebKit
}
export default {
  name: 'FormDesign',
  components: { DynamicForm, BasicSetting, Process },
  data() {
    return {
      activeStep: 'basicSetting', // 激活的步骤面板
      steps: [
        { label: '基础设置', key: 'basicSetting' },
        { label: '表单设计', key: 'formDesign' },
        { label: '流程设计', key: 'processDesign' }
      ],
      mockData: null, // 可选择诸如 $route.param，Ajax获取数据等方式自行注入
      title: ''
    }
  },
  methods: {
    exit() {
      this.$elconfirm('离开此页面您的修改将会丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$router.push({
            path: '/saas/app/' + this.$route.params.id
          })
        })
        .catch(() => {})
    },
    changeSteps(item) {
      this.activeStep = item.key
    },
    publish() {
      const getCmpData = name => this.$refs[name].getData()
      const p1 = getCmpData('basicSetting')
      const p2 = getCmpData('formDesign')
      const p3 = getCmpData('processDesign')
      Promise.all([p1, p2, p3])
        .then(res => {
          const param = {
            basicSetting: res[0].formData,
            formData: res[1].formData,
            processData: res[2].formData
          }
          this.sendToServer(param)
        })
        .catch(err => {
          err.target && (this.activeStep = err.target)
          err.msg && this.$message.warning(err.msg)
        })
    },
    sendToServer(param) {
      // this.$notify({
      //   title: '数据已整合完成',
      //   message: '请在控制台中查看数据输出',
      //   position: 'bottom-right'
      // })
      const formId = this.$route.params.formid
      if (this._.isNil(formId) || this._.isEmpty(formId)) {
        const data = {
          tenantAppId: this.$route.params.id,
          type: 'flow',
          parentId: '-1',
          basicSetting: param.basicSetting,
          formData: param.formData,
          processData: param.processData
        }
        createdFrom(data).then(res => {
          if (res.code === 200) {
            this.$router.push({
              path: '/saas/app/' + this.$route.params.id
            })
            return this.$message.success('创建成功')
          }
        })
      } else {
        const data = {
          formId: this.$route.params.formid,
          tenantAppId: this.$route.params.id,
          type: 'flow',
          parentId: '-1',
          basicSetting: param.basicSetting,
          formData: param.formData,
          processData: param.processData
        }
        updateForm(data).then(res => {
          if (res.code === 200) {
            this.$router.push({
              path: '/saas/app/' + this.$route.params.id
            })
            return this.$message.success('编辑成功')
          }
        })
      }
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
  mounted() {
    const formId = this.$route.params.formid
    if (this._.isNil(formId) || this._.isEmpty(formId)) {
      GET_MOCK_CONF().then(data => (this.mockData = data))
      this.title = '新建表单'
    } else {
      getFormDetail({ formId: this.$route.params.formid, tenantAppId: this.$route.params.id }).then(data => {
        this.mockData = data
        this.title = data.basicSetting.flowName
      })
    }
  },
  created() {}
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
      position absolute;
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
