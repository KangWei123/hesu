<template>
  <div class="function"
       v-loading="loading">
    <div class="tab">
      <div class="store-content">
        <div class="top-box">
          <img class="logo"
               :src="require('@/dss-common/img/brand/logo-wkb.png')" />
          <p class="name">门店经营</p>
        </div>
        <p class="info">极速创建小程序，贴合行业特性的 UI 设计，抢占微信平台流量红利，打造一站式门店数字化经营系统</p>
      </div>
      <el-button type="primary"
                 class="btn"
                 @click="onExperience">立刻体验</el-button>
    </div>
    <div class="tab">
      <div class="store-content">
        <div class="top-box">
          <img class="logo"
               :src="require('@/dss-common/img/brand/logo-passflow.png')" />
          <p class="name">门店客流</p>
        </div>
        <p class="info">AI人脸识别，让线下零售快速认知客户，提供客户群画像分析，有针对性制定营销策略，根据客流、新客、回访等指标自动为门店客流健康值打分</p>
      </div>
      <el-button type="primary"
                 class="btn"
                 @click="contactUS">联系我们</el-button>
      <p class="tips">温馨提示：门店客流功能暂未开通线上体验，如需了解更多，请联系我们</p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false
    };
  },
  mounted() {
    // 判断是否正确操作进入该页面
    if (!this.$route.query.isAllow || this.$route.query.isAllow != 1) {
      this.$router.replace({ path: '/create/brand' });
    }
  },
  methods: {
    // 立刻体验，订购惟客宝、客流宝功能
    onExperience() {
      // 跳转创建品牌信息成功页面
      this.$router.push({
        path: '/create/brand-success',
        query: {
          isAllow: 1
        }
      });
    },

    // 联系我们
    contactUS() {
      this.$router.push({
        path: '/contact-us',
        query: {
          isAllow: 1
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.function {
  text-align: center;
  overflow: hidden;
  display: inline-block;
  margin: 50px auto 20px;

  .tab {
    float: left;
    margin: 0px 25px;
    position: relative;

    .store-content {
      width: 200px;
      height: 260px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.11);
      .top-box {
        background: rgba(226, 239, 255, 1);
        padding: 19px 0px 10px;
        .logo {
          display: inline-block;
          width: 30px;
          height: 30px;
        }

        .name {
          font-size: 16px;
          margin-top: 5px;
          color: @blue-color;
        }
      }
      .info {
        line-height: 22px;
        font-size: 12px;
        color: rgba(153, 153, 153, 1);
        padding: 15px;
        text-align: left;
      }
    }

    .tips {
      width: 174px;
      text-align: left;
      font-size: 12px;
      margin-top: 16px;
      color: rgba(153, 153, 153, 1);
      padding: 0 13px;
    }

    .btn {
      margin-top: 20px;
    }
  }
}
</style>

