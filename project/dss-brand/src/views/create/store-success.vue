<template>
  <div class="store-success">
    <div class="home-spot"
         :class="bgImage"></div>
    <div class="split-line"></div>
    <div class="main">
      <div class="title">
        <i class="success_icon"></i>
        <span>创建成功</span>
      </div>
      <div class="desc">如果您有微信公众号及小程序，马上把店铺与微信打通吧，<br />
        为保证所有功能正常，授权时请保持默认选择，把权限统一授权给惟客宝
      </div>
      <ul class="rules">
        <li> • 绑定微信公众号，将可适用惟客宝帮助您推送营销图文</li>
        <li> • 绑定小程序，将可以通过惟客宝一键发布小程序</li>
        <li> • 如果您还没有微信公众号，可以点此<a href="/wkb.html#/setting/wx/pc">注册</a></li>
        <li> • 如果您还没有小程序，可以点此<a href="/wkb.html#/setting/wx/mp/version">注册</a></li>
      </ul>
      <div class="btn-box">
        <el-button type="primary"
                   size="mini"
                   @click="toBind">去绑定公众号及小程序
        </el-button>
        <el-button size="mini"
                   class="bgWhite"
                   @click="toConsole">稍后再说，进入店铺后台
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      bgImage: null
    };
  },
  computed: {
    ...mapState({
      curApp: 'curApp'
    })
  },
  mounted() {
    // 判断是否正确操作进入该页面
    if (!this.$route.query.isAllow || this.$route.query.isAllow != 1) {
      this.$router.replace({ path: '/create/brand' });
    }

    // 根据行业获取显示不同图片
    this.bgImage = this.curApp.industryKey;
  },
  methods: {
    //跳绑定设置
    toBind() {
      window.top.location.href = '/wkb.html#/setting/wx/mp/version';
    },
    //跳控制台
    toConsole() {
      window.top.location.href = '/wkb.html';
    }
  }
};
</script>
<style lang="less">
.store-success {
  width: 800px;
  margin: 0px auto;

  .home-spot {
    display: inline-block;
    width: 180px;
    height: 321px;
    // background: transparent url(../../images/industry/home.png) no-repeat 0 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.11);
    margin-right: 50px;
    vertical-align: top;
  }

  .split-line {
    display: inline-block;
    width: 0px;
    height: 241px;
    border-left: 1px dashed rgba(186, 198, 211, 1);
    margin-top: 40px;
  }

  .main {
    display: inline-block;
    width: 500px;
    margin-left: 50px;
    vertical-align: top;
    .title {
      .success_icon {
        display: inline-block;
        width: 38px;
        height: 38px;
        background: url(../../images/industry/smil-icon.png) no-repeat;
        background-size: 100% 100%;
        margin-right: 20px;
        vertical-align: middle;
      }
      span {
        font-size: 20px;
        font-weight: bold;
        color: rgba(44, 54, 65, 1);
        text-align: center;
        vertical-align: middle;
      }
    }
    .desc {
      margin-top: 37px;
      height: 38px;
      line-height: 1.4;
      font-size: 13px;
      color: rgba(44, 54, 65, 1);
      text-align: left;
    }
    .rules {
      font-family: MicrosoftYaHei;
      margin-top: 22px;
      text-align: left;
      li {
        font-size: 12px;
        line-height: 1.8;
        color: rgba(133, 140, 153, 1);
        a {
          text-decoration: underline;
          color: #409eff;
        }
      }
    }
    .btn-box {
      margin-top: 37px;
      text-align: center;
      font-size: 0px;
      .el-button:last-child {
        margin-left: 50px;
      }
      .bgWhite {
        background-color: #ffffff;
        border: 1px solid rgba(210, 211, 214, 1);
        color: rgba(153, 153, 153, 1);
      }
    }
  }

  // 本地插图片
  .beautiful {
    background-image: url(../../images/industry/beautiful-bg.png);
  }
  .retail {
    background-image: url(../../images/industry/retail-bg.png);
  }
  .clother {
    background-image: url(../../images/industry/clother-bg.png);
  }
  .education {
    background-image: url(../../images/industry/education-bg.png);
  }
  .bodybuilding {
    background-image: url(../../images/industry/bodybuilding-bg.png);
  }
  .fruit {
    background-image: url(../../images/industry/fruit-bg.png);
  }
}
</style>


