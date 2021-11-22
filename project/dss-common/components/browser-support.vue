<template>
  <div>
    <slot v-if="isSupport"></slot>
    <div style="padding-top: 100px;" v-else class="browser-support">
      <div class="notice">
        <p><span>惟客宝在IE10浏览器或以下版本，部分功能不可使用，建议尽快升级浏览器，或者使用Chrome，Firefox。</span>
        </p>
        <ul>
          <li>
            <a href="http://www.firefox.com.cn/" target="_blank" title="火狐浏览器">
              <img class="banner-img" border="0" src="../img/browser/firefox.png" />
              <br />
              <span class="text">Firefox&nbsp;</span>
            </a>
          </li>
          <li>
            <a href="https://www.google.cn/chrome/" target="_blank" title="谷歌浏览器">
              <img class="banner-img" border="0" src="../img/browser/chrome.png" />
              <br />
              <span class="text">Chrome&nbsp;</span>
            </a>
          </li>
          <li>
            <a href="https://support.microsoft.com/zh-cn/help/17621/internet-explorer-downloads" title="Internet Explorer 11浏览器" target="_blank">
              <img class="banner-img" border="0" src="../img/browser/ie.png" />
              <br />
              <span class="text">IE 11</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import browser from '../utils/browser.js';

export default {
  data() {
    return {
      isSupport: true
    };
  },
  created() {
    this.isSupport = !browser.isLowerBrowser(11);
  }
};
</script>

<style scoped lang="less">
.browser-support {


  .tip {
      color: rgb(245, 108, 108);
    }

    .notice {
      width: 600px;
      height: 350px;
      padding: 10px;
      margin: 0 auto;
      background: #fff;
      background-clip: padding-box;
      border-radius: 10px;
      border: 10px solid #666;
      border: 15px solid rgba(0, 0, 0, 0.2);
    }

    .notice p {
      font: 13px "宋体";
      line-height: 30px;
      letter-spacing: 0.1em;
      margin-top: 35px;
      margin-bottom: 50px;
      color: orangered;
      padding: 0 40px;
      text-align: center;
    }

    .notice p span {
      color: #7d7d7d;
    }

    .notice a {
      text-decoration: none;
    }

    .notice ul {
      list-style: none;
      width: 475px;
      height: 103px;
      margin: 0 auto;
      border: 1px dashed #e4e4e4;
      overflow: hidden;
      padding: 0;
    }

    .notice ul li {
      float: left;
      width: 95px;
      height: 103px;
      overflow: hidden;
      text-align: center;
      padding-top: 10px;
      width: 33.33%;
    }

    .text {
      color: orange;
      font-size: 14px;
    }
}
</style>
