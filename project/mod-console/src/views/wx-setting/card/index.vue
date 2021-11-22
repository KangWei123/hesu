<template>
  <div class="wx-card" v-loading="loading" element-loading-spinner="el-icon-loading">
    <div class="main">
      <div class="main-right">
        <div class="guide">
          <img class="guide-icon" :src="guideSmallProgram" alt="" />
          <p>用户可在微信卡包访问小程序</p>
        </div>
      </div>
      <div class="main-left">
        <div class="tips">
          <p class="fw" style="line-height: 1">
            绑定公众号授权后，在惟客宝平台生成的优惠券、会员卡，可以同步发布至用户的微信卡包中。
          </p>
          <p class="fw">同步微信卡包的好处：</p>
          <p>1、会员卡、优惠券访问更便捷；</p>
          <p>2、顾客可在微信里更方便地查看会员卡和优惠券，提高会员复购率；</p>
          <p>3、提升会员体验：一键直达商家的小程序首页。</p>
        </div>
        <div class="state-content">
          <div class="tab">
            <span>公众号授权状态：</span>
            <span :class="this.info.mpAuthStatus === 0 ? fcr : ''">{{ mpAuthStatus }}</span>
            <span
              class="btn"
              v-if="this.info.mpAuthStatus === 0"
              :title="this.allowOperate ? '' : '暂无权限操作'"
              @click="bindAuthorize('pc')"
              >重新授权</span
            >
          </div>
          <div class="tab">
            <span>小程序授权状态：</span>
            <span :class="this.info.maAuthStatus === 0 ? fcr : ''">{{ maAuthStatus }}</span>
            <span
              class="btn"
              v-if="this.info.maAuthStatus === 0"
              :title="this.allowOperate ? '' : '暂无权限操作'"
              @click="bindAuthorize('mp')"
              >重新授权</span
            >
          </div>
          <div class="tab">
            <span>卡券功能：</span>
            <span :class="this.info.cardAuthStatus !== 1 ? fcr : ''">{{ cardAuthStatus }}</span>
            <a
              href="javascript:;"
              class="course"
              v-if="this.info.cardAuthStatus === 2"
              :title="this.allowOperate ? '' : '暂无权限操作'"
              @click="bindCourse"
            >
              （卡券开通教程）
            </a>
            <span class="nots" v-if="this.info.cardAuthStatus === 2">*请至微信后台手动开通卡券功能，再重新授权</span>
            <span
              class="btn"
              v-if="this.info.cardAuthStatus === 0 || this.info.cardAuthStatus === 3"
              :title="this.allowOperate ? '' : '暂无权限操作'"
              @click="bindAuthorize('pc')"
              >重新授权</span
            >
          </div>
          <div class="tab">
            <span>同步至微信卡包：</span>
            <span :class="this.info.syncToPackageStatus !== 1 ? fcr : ''">{{ syncToPackageStatus }}</span>
            <span
              class="btn"
              v-if="this.info.syncToPackageStatus === 0"
              :title="this.allowOperate ? '' : '暂无权限操作'"
              @click="bindOpen"
              >立即开启</span
            >
            <div class="fail">
              <span>{{ auditFaildReason }}</span>
              <span
                class="btn"
                v-if="this.info.syncToPackageStatus === 5"
                :title="this.allowOperate ? '' : '暂无权限操作'"
                @click="bindOpen"
                >重新提交</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import './index.less';
  import { mapState } from 'vuex';
  import services from '@/dss-common/utils/services';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';

  export default {
    data() {
      return {
        loading: false,
        info: {
          mpAuthStatus: '',
          maAuthStatus: '',
          cardAuthStatus: '',
          syncToPackageStatus: '',
          auditFaildReason: '',
        },
        guideSmallProgram: require('../../../images/setting/wx-card/guide-smallProgram.png'),
        fcr: 'fcr',
        REQUEST_PREFIX: '/wp',
      };
    },
    computed: {
      ...mapState({
        roleList: 'roleList',
        companyScopeMenu: 'companyScopeMenu',
      }),
      // 只允许企业管理员操作
      allowOperate() {
        const editButton = scopeMenuEnum.getMenuScopeByIdentifier(
          this.companyScopeMenu,
          scopeMenuEnum.dictionary.companyChildMenu.wkbWxSettingMenu.wxCardButton.wx_card_edit
        );

        if (editButton.isHasPermission) {
          return true;
        } else {
          return false;
        }
      },
      mpAuthStatus: function () {
        // 公众号授权状态 1-正常，0-未授权
        if (this.info.mpAuthStatus === 0) {
          return '未授权';
        } else {
          return '正常';
        }
      },
      maAuthStatus: function () {
        // 小程序授权状态 1-正常，0-未授权
        if (this.info.maAuthStatus === 0) {
          return '未授权';
        } else {
          return '正常';
        }
      },
      cardAuthStatus: function () {
        // 卡券功能 0-未授权 1-已开通，2-未开通，3-未授权
        if (this.info.cardAuthStatus === 1) {
          return '已开通';
        } else if (this.info.cardAuthStatus === 2) {
          return '未开通';
        } else {
          return '未授权';
        }
      },
      syncToPackageStatus: function () {
        // 同步至微信卡包 0-未开启，1-已开启，4-提交微信审核中，5-审核失败
        if (this.info.syncToPackageStatus === 0) {
          return '未开启';
        } else if (this.info.syncToPackageStatus === 1) {
          return '已开启';
        } else if (this.info.syncToPackageStatus === 4) {
          return '提交微信审核中';
        } else if (this.info.syncToPackageStatus === 5) {
          return '审核失败';
        }
      },
      auditFaildReason: function () {
        return this.info.auditFaildReason;
      },
    },
    methods: {
      // 查询卡券授权信息
      cardAuthInfo() {
        const params = {};
        const url = this.REQUEST_PREFIX + '/card/card_auth_info';
        services
          .get(url, {
            params,
            action: '查询卡券授权信息',
          })
          .done(res => {
            if (res.data) {
              this.info = res.data;
            }
          })
          .always(() => {
            this.loading = false;
          });
      },

      // 跳转对应的微信公众号授权或微信小程序授权页面
      bindAuthorize(page) {
        if (this.allowOperate) {
          this.$router.push({ path: '/setting/wx/' + page });
        }
      },
      bindCourse() {
        if (this.allowOperate) {
          this.$router.push({ path: '/setting/wx/card/course' });
        }
      },
      // 开通卡券功能
      bindOpen() {
        if (this.allowOperate) {
          const params = {};
          const url = this.REQUEST_PREFIX + '/card/open';
          services
            .get(url, {
              params,
              action: '开通卡券功能',
            })
            .done(res => {
              // 查询卡券授权信息
              this.cardAuthInfo();
            })
            .always(() => {
              this.loading = false;
            });
        }
      },
    },
    mounted() {
      // 查询卡券授权信息
      this.cardAuthInfo();
    },
  };
</script>
