<template>
  <div class="main">
    <div v-if="isNext">
      <!-- 登录界面 -->
      <div v-if="isLogin">
        <div class="title">登录</div>
        <div class="user-login-text">通过帐号密码登录，或者切换为<span class="toggle" @click="registered">注册</span></div>
        <a-form-model id="formLogin" ref="loginForm" :model="loginForm" :rules="loginRules">
          <a-alert v-if="isLoginError" class="error" type="error" showIcon :message="loginErrorInfo" closable :after-close="handleCloseLoginError" />
          <div class="formTitle">手机号/账户</div>
          <a-form-model-item prop="username">
            <a-input v-model="loginForm.username" placeholder="手机号/账户"> </a-input>
          </a-form-model-item>
          <div class="formTitle">密码</div>
          <a-form-model-item prop="password">
            <a-input-password v-model="loginForm.password" placeholder="密码"> </a-input-password>
          </a-form-model-item>
          <div class="formTitle">验证码</div>
          <div class="codeContent">
            <a-form-model-item prop="code">
              <a-input v-model="loginForm.code" type="text" autocomplete="off" placeholder="验证码" class="codeInput"> </a-input>
            </a-form-model-item>
            <img :src="codeUrl" @click="getCode" class="codeImg" />
          </div>
          <a-form-item>
            <a-button class="confirmBtn" size="large" type="primary" htmlType="submit" :loading="logining" :disabled="logining" @click="handleSubmit">登 录</a-button>
          </a-form-item>
        </a-form-model>
      </div>
      <!-- 注册 -->
      <div v-else>
        <div class="title">登录</div>
        <div class="user-login-text">通过手机号码注册 ，或者切换为<span class="toggle" @click="goLogin">账号密码登录</span></div>
        <a-form-model id="formReg" ref="RegForm" :model="RegForm" :rules="RegRules">
          <div class="formTitle">手机号</div>
          <a-form-model-item prop="username">
            <div class="p-a-c">
              <countryCodeSelector :countryCode.sync="areaCode" />
              <a-input class="regPhoneInput" v-model="RegForm.username" placeholder="手机号"> </a-input>
            </div>
          </a-form-model-item>
          <!-- 密码 -->
          <div class="formTitle">密码</div>
          <a-form-model-item has-feedback prop="password">
            <a-input v-model="RegForm.password" type="password" placeholder="请输入密码"> </a-input>
          </a-form-model-item>
          <!-- 确认密码 -->
          <div class="formTitle">确认密码</div>
          <a-form-model-item has-feedback prop="checkPass">
            <a-input v-model="RegForm.checkPass" type="password" placeholder="请再次输入密码"> </a-input>
          </a-form-model-item>
          <a-form-item>
            <a-button class="confirmBtn" size="large" type="primary" htmlType="submit" :loading="logining" :disabled="logining" @click="nextTick">下一步</a-button>
          </a-form-item>
        </a-form-model>
      </div>
    </div>
    <!-- 企业 -->
    <div v-else>
      <div class="title">填写企业信息</div>
      <div class="user-login-text">请填写营业执照上的企业名称 <span class="toggle" @click="goback_">返回</span></div>
      <a-form-model ref="firmForm" :model="firmForm" :rules="FirmRules">
        <div class="formTitle">企业名称</div>
        <a-form-model-item prop="firmName">
          <a-input v-model="firmForm.firmName" placeholder="请填写企业名称"> </a-input>
        </a-form-model-item>
        <a-form-item>
          <a-button class="confirmBtn" size="large" type="primary" htmlType="submit" :loading="logining" :disabled="logining" @click="handleRegistered">完 成</a-button>
        </a-form-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import storage from 'store'
import { encrypt, decrypt } from '/src/utils/encrypt/jsencrypt.js'
import { mapActions } from 'vuex'
import { timeFix } from '/src/utils/common/util.js'
import { getCodeImg } from '/src/api/user/login.js'
/* 手机区号选择插件 */
import countryCodeSelector from '/src/components/CountryCodeSelector/index.vue'

export default {
  components: {
    countryCodeSelector
  },
  data() {
    const phonerReg = /^[1][3,4,5,7,8][0-9]{9}$/
    const pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,}$/
    const validateUsername = (rule, value, callback) => {
      if (phonerReg.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号!'))
      }
    }
    const validatePass = (rule, value, callback) => {
      if (pwdReg.test(value)) {
        /* 密码正确格式 */
        callback()
      } else {
        if (this.RegForm.checkPass !== '') {
          this.$refs.RegForm.validateField('checkPass')
        }
        callback(new Error('密码至少8位，要求必须字母、数字加英文符号(不含空格)'))
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value !== this.RegForm.password) {
        callback(new Error('两次输入的密码不一样!'))
      } else {
        callback()
      }
    }
    return {
      codeUrl: '',
      isLoginError: false,
      loginErrorInfo: '',
      /* 登录表单 */
      loginForm: {
        username: '',
        password: '',
        rememberMe: true,
        code: undefined
      },
      /* 登录验证 */
      loginRules: {
        username: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      logining: false,
      /* 是否为登录  */
      isLogin: true,
      /* 是否进入企业填写 */
      isNext: true,
      /* 注册表单验证 */
      RegRules: {
        username: [{ validator: validateUsername, trigger: 'change' }],
        password: [{ validator: validatePass, trigger: 'change' }],
        checkPass: [{ validator: validatePass2, trigger: 'change' }]
      },
      /* 注册表单 */
      RegForm: {
        username: '',
        password: '',
        checkPass: ''
      },
      FirmRules: {
        firmName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }]
      },
      /* 企业表单 */
      firmForm: {
        firmName: ''
      },
      /* 区号 */
      areaCode: 86
    }
  },
  created() {
    this.getCode()
    this.getCookie()
  },
  methods: {
    ...mapActions(['Login', 'Logout', '_registered']),
    getCode() {
      getCodeImg().then(res => {
        this.codeUrl = 'data:image/gif;base64,' + res.img
        this.loginForm.uuid = res.uuid
      })
    },
    getCookie() {
      const username = storage.get('username')
      const password = storage.get('password')
      const rememberMe = storage.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? true : Boolean(rememberMe)
      }
    },
    capctchaCheckSuccess(params) {
      this.loginForm.code = params.captchaVerification
      this.logining = true
      if (this.loginForm.rememberMe) {
        storage.set('username', this.loginForm.username, { expires: 30 })
        storage.set('password', encrypt(this.loginForm.password), { expires: 30 })
        storage.set('rememberMe', this.loginForm.rememberMe, { expires: 30 })
      } else {
        storage.remove('username')
        storage.remove('password')
        storage.remove('rememberMe')
      }
      this.Login(this.loginForm)
        .then(res => {
          if (this.loginForm.password === 'admin123') {
            storage.set('mima', this.loginForm.password, { expires: 30 })
          }
          this.loginSuccess(res)
        })
        .catch(err => this.requestFailed(err))
        .finally(() => {
          this.logining = false
        })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$refs.verify.show()
        } else {
          setTimeout(() => {
            this.logining = false
          }, 600)
        }
      })
    },
    handleSubmit() {
      this.logining = true
      if (this.loginForm.rememberMe) {
        storage.set('username', this.loginForm.username, { expires: 30 })
        storage.set('password', encrypt(this.loginForm.password), { expires: 30 })
        storage.set('rememberMe', this.loginForm.rememberMe, { expires: 30 })
      } else {
        storage.remove('username')
        storage.remove('password')
        storage.remove('rememberMe')
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.Login(this.loginForm)
            .then(res => {
              if (this.loginForm.password === 'admin123') {
                storage.set('mima', this.loginForm.password, { expires: 30 })
              }
              this.loginSuccess(res)
            })
            .catch(err => this.requestFailed(err))
            .finally(() => {
              this.logining = false
            })
        } else {
          setTimeout(() => {
            this.logining = false
          }, 600)
        }
      })
    },
    loginSuccess() {
      // 请求默认App
      this.$store.dispatch('getTenantAppId')
      this.$router.push({ path: '/' })
      // this.$router.push({ path: `/sass` })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      this.handleCloseLoginError()
    },
    requestFailed(err) {
      this.isLoginError = true
      this.loginErrorInfo = err
      this.loginForm.code = undefined
      this.getCode()
    },
    handleCloseLoginError() {
      this.isLoginError = false
      this.loginErrorInfo = ''
    },
    /* 注册模块 */
    registered() {
      this.isLogin = false
    },
    /* 登录模块 */
    goLogin() {
      this.isLogin = true
    },
    goback_() {
      this.isNext = true
    },
    /* 下一步 */
    nextTick() {
      this.$refs.RegForm.validate(valid => {
        if (valid) {
          this.isNext = false //  进入企业填写
        }
      })
    },
    /* 注册提交 */
    handleRegistered() {
      this.$refs.firmForm.validate(valid => {
        if (valid) {
          this.logining = true
          const params = { name: this.firmForm['firmName'], sysUser: { userName: this.RegForm['username'], password: this.RegForm['password'], countryCode: this.areaCode } }
          /* 注册状态模块 */
          this._registered(params)
            .then(res => {
              this.loginSuccess(res)
            })
            .catch(err => this.requestFailed(err))
            .finally(() => {
              this.logining = false
            })
        } else {
          setTimeout(() => {
            this.logining = false
          }, 600)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import './user.less';
</style>
