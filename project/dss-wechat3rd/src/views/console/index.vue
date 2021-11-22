<template>
  <wkb-page-nav
    class="wkb-console-container"
    :class="hasScroll ? 'console-scroll' : ''"
    hide-nav
    page-name="工作台"
    :show-page-name="false"
  >
    <div class="wkb-console" v-loading="loading" element-loading-spinner="el-icon-loading">
      <business-dashboard v-if="env.BUSINESS_CENTER" :on-ready="handleReady" />
      <default-dashboard v-else :on-ready="handleReady" />
      <!-- <div class="right">
        <div class="top">
          <div class="imgTxt"><span class="sign"></span>套餐信息</div>
          <div class="top-wrap">
            <div class="day-num">
              <span>有效天数：</span>
              <span>{{ curApp.expireDay }}</span>
            </div>
            <div class="expire-time">
              <span>到期时间：</span>
              <span>{{ curApp.expireTime }}</span>
            </div>
            <div class="renew" @click="toBuy">立即续费</div>
          </div>
        </div>
        <div class="btm">
          <div class="imgTxt"><span class="sign"></span>帮助中心</div>
          <div class="btm-wrap">
            <ul>
              <li v-for="(item, index) in helpList" :key="index">
                <a target="_blank" class="link" :href="!!item.path ? item.path : 'javascript:;'">{{ item.title }}</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="qrcode" v-if="false">
          <div class="phone"></div>
          <div class="txt">微商城二维码</div>
          <div class="img-wrap">
            <div class="img">
              <img src="../../images/console/qrcode.png" alt="" />
            </div>
          </div>
        </div>
      </div> -->

      <!-- 发版通知 -->
      <message-dialog />
    </div>
  </wkb-page-nav>
</template>
<script>
  import { mapState } from 'vuex';
  import td from 'throttle-debounce';
  import WkbPageNav from '@/dss-wechat3rd/src/components/wkb-page-nav/index.vue';
  import sellerDashboardApi from '@/dss-wechat3rd/src/api/seller_dashboard';
  import MessageDialog from '@/dss-wechat3rd/src/components/message-dialog';
  import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin';
  import BusinessDashboard from './business.vue';
  import DefaultDashboard from './default.vue';
  import './index.less';

  export default {
    components: {
      WkbPageNav,
      MessageDialog,
      BusinessDashboard,
      DefaultDashboard,
    },
    mixins: [industryHelperMixin],
    data() {
      return {
        loading: true,
        hasScroll: false,
        // 帮助中心
        helpList: [],
      };
    },
    computed: {
      ...mapState({
        curApp: 'curApp',
        env: 'env',
      }),
    },
    mounted() {
      // this.getHelpData();
      // 这个函数不能放在methods里，同个页面有多个相同组件，debounce会有影响
      this.resize = td.debounce(300, () => {
        this.hasScroll = this.hasScrollbar();
      });

      this.hasScroll = this.hasScrollbar();

      window.addEventListener('resize', this.resize);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resize);
    },

    methods: {
      hasScrollbar() {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      },
      handleReady() {
        this.loading = false;
      },
      // 去购买
      toBuy() {
        if (this.allowEnter) {
          window.location.href = '/console.html#/brand-setting/function-buy/homepage';
        }
      },
      getHelpData() {
        sellerDashboardApi.getHelpData({}).then(res => {
          this.helpList = res.data || [];
        });
      },
    },
  };
</script>
<style lang="less" scoped>
  @media screen and (max-width: 1200px) {
    .right {
      display: none;
    }
  }
  @media screen and (min-width: 1200px) and (max-width: 1340px) {
    .data-analysis {
      .analysis-item:last-child {
        margin-top: 20px;
      }
    }
  }
</style>
