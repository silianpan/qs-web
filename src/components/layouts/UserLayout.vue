<template>
  <div id="userLayout">
    <div class="FormWrap">
      <div class="FormContent">
        <div class="FormLeft">
          <img class="logo" :src="bigLogo" alt="logo" />
          <img class="leftWrap" :src="imgLoginBg" alt="" />
          <div class="phone">
            <a-icon type="phone" class="p-icon" />
            <span class="num">XXX-XXXXXXXX</span>
          </div>
          <div class="mail">
            <a-icon type="mail" class="m-icon" />
            <span class="url">qs@seals.com</span>
          </div>
        </div>
        <div class="verticalContainer">
          <a-divider type="vertical" class="vertical" />
        </div>
        <!-- 分割线 -->
        <div class="FormRight">
          <router-view />
        </div>
      </div>
      <div class="FormFooter">
        <div class="FormFooter-icp" >&copy XXX - <a target="_blank" href="https://beian.miit.gov.cn">XICP备XXXXXXXXXX号</a> &nbsp;</div>
        <a class="FormFooter-ga" target="_blank" href="http://www.beian.gov.cn/portal/index.do">
          <!-- <img :src="gonganImg" /> -->
          <p>X公网安备 XXXXXXXXXXXXXX号</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { deviceMixin } from '/src/store/device-mixin'
import gonganImg from '/src/assets/img/ga.png'
import bigLogo from '/src/assets/img/home-logo.png'
import imgLoginBg from '/src/assets/img/login-bg.png'

export default {
  name: 'UserLayout',
  mixins: [deviceMixin],
  data() {
    return {
      gonganImg,
      bigLogo,
      imgLoginBg
    }
  },
  mounted() {},
  beforeDestroy() {}
}
</script>

<style lang="less" scoped>
#userLayout {
  background-color: #fafafa;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  min-height: 692px;
  z-index: 0;
  overflow: hidden;
  .FormWrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 400px) {
      height: 80%;
    }
    .FormContent {
      /* max-width: 1000px; */
      height: 600px;
      padding: 40px 0;
      background-color: #fff;
      box-shadow: 0px 1px 6px 0px rgba(4, 0, 0, 0.08);
      display: flex;
      justify-content: flex-start;
      .FormLeft {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 0 42px;
        .logo {
          width: 150px;
          height: 48px;
          margin-bottom: 32px;
          box-sizing: border-box;
        }
        .leftWrap {
          width: 418px;
          height: 361px;
        }
        .phone {
          .p-icon {
            color: #cccccc;
            margin-right: 27px;
          }
          .num {
            font-size: 14px;
            color: #cccccc;
          }
        }
        .mail {
          .m-icon {
            color: #cccccc;
            margin-right: 27px;
          }
          .url {
            font-size: 14px;
            color: #cccccc;
          }
        }
      }
      .verticalContainer {
        box-sizing: border-box;
        padding: 30px 0;
        .vertical {
          width: 2px;
          height: 100%;
          margin-right: 0;
          background-color: #fafafa;
        }
      }
      .FormRight {
        padding: 0 42px;
      }
    }
  }
  .FormFooter {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

    .FormFooter-icp {
      color: #aaa;
      font-size: 14px;
      line-height: 60px;
      text-align: center;
      a {
        color: #aaa;
      }
    }
    .FormFooter-ga {
      display:flex;
      text-decoration: none;
      height: 18px;
      line-height: 18px;
      p {
        font-size: 14px;
        color: #aaa;
      }
    }
  }
}
</style>
