<template>
  <div class="brand-success">
    <p class="title">品牌创建成功</p>
    <div class="function-list">
      <p class="function-list-title">恭喜您解锁以下功能:</p>
      <div class="content">
        <div class="tab">
          <div class="top-box">
            <img class="logo" :src="require('@/dss-common/img/brand/logo-wkb.png')" />
            <p class="name">门店经营</p>
          </div>
          <p class="info">极速创建小程序，贴合行业特性的 UI 设计，抢占微信平台流量红利，打造一站式门店数字化经营系统</p>
        </div>
        <div class="tab">
          <div class="top-box">
            <img class="logo" :src="require('@/dss-common/img/brand/logo-analysis.png')" />
            <p class="name">经营分析</p>
          </div>
          <p class="info">建立一站式门店运营模式，实现门店数字化高效管理，基于企业数据化经营打造数据分析平台</p>
        </div>
        <div class="tab">
          <div class="top-box">
            <img class="logo" :src="require('@/dss-common/img/brand/logo-marketing.png')" />
            <p class="name">营销中心</p>
          </div>
          <p class="info">丰富的社交营销工具，结合用户画像精准触达，最大化社交营销裂变效果</p>
        </div>
      </div>
    </div>
    <div class="tips-box">
      <p class="tips-title">温馨提示</p>
      <p class="tips-txt">1、您的品牌免费体验期为7天，逾期未订购将无法正常营业</p>
      <p class="tips-txt">2、为不影响您的门店正常经营请及时续费或联系客服 18688178889</p>
      <p class="tips-txt">3、接下来请创建您的第一家门店，开启数字化经营之旅吧</p>
    </div>
    <div class="btn-box">
      <el-button type="primary" @click="createStore">创建{{ label }}</el-button>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      env: 'env'
    }),
    label() {
      return this.env.ESTATE ? '区域' : '门店';
    }
  },
  mounted() {
    // 判断是否正确操作进入该页面
    if (!this.$route.query.isAllow || this.$route.query.isAllow != 1) {
      this.$router.replace({ path: '/create/brand' });
    }
  },
  methods: {
    // 创建门店
    createStore() {
      this.$router.push({
        path: '/create/store',
        query: {
          isAllow: 1
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.brand-success {
  width: 800px;
  margin: 52px auto 20px;

  .title {
    font-size: 16px;
    font-weight: 600;
  }

  .function-list {
    margin-top: 50px;
    text-align: left;
    .function-list-title {
      font-size: 14px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }

    .content {
      margin-top: 10px;

      .tab {
        display: inline-block;
        width: 200px;
        height: 260px;
        text-align: center;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.11);
        margin-right: 10px;
        vertical-align: top;
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
      .tab:last-child {
        margin-right: 0px;
      }
    }
  }

  .tips-box {
    text-align: left;
    margin-top: 30px;
    color: rgba(51, 51, 51, 1);

    .tips-txt {
      margin-top: 5px;
    }
  }

  .btn-box {
    text-align: left;
    margin-top: 30px;
  }
}
</style>
