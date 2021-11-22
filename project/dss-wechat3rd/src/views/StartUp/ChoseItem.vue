<template>
  <div class="start-up-choose" v-loading="loading" element-loading-spinner="el-icon-loading">
    <div class="_header">{{ item.packageName }}</div>
    <div class="_title">{{ item.appName }}</div>
    <div class="_desc" v-if="item.status == 2">套餐已过期</div>
    <div class="_desc" v-else-if="item.status == 3">试用套餐已过期</div>
    <div class="_desc" v-else>
      您的{{ item.status === 1 ? '有效期' : '试用期' }}至：{{ item.expireTime | expireDate }}<br />
      {{ isNearTime(item.expireTime) ? '避免无法使用，请续费开通' : '' }}。
      <!-- <a v-if="item.packageType==1 && item.status==1"
         href="javascript:;"
         class="dss-link"
         @click="toUpgrade(item.id)">您使用的单店版可以付费升级为连锁版。</a> -->
    </div>
    <div class="_btns">
      <!-- <el-button v-if="ableRenew(item.status==1)"
                 class="pay-btn"
                 size="small"
                 type="primary"
                 @click="toOrder(item.id)">立即续费
      </el-button> -->
      <el-button class="enter-btn" size="small" type="primary" @click="toConsole(item.id, item.categoryId)"
        >进入店铺
      </el-button>
    </div>
  </div>
</template>
<style rel="stylesheet/less" lang="less">
  .start-up-choose {
    position: relative;
    width: 220px;
    height: 210px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    float: left;
    margin: 0 0 20px 10px;

    ._header {
      position: absolute;
      top: 0;
      left: 0;
      padding: 2px 20px;
      height: 22px;
      line-height: 22px;
      background: #fff0e5;
      border-radius: 0px 4px 0px 3px;
      font-size: 12px;
      color: #fa7516;
    }

    ._title {
      height: 19px;
      font-size: 14px;
      color: rgba(32, 37, 44, 1);
      text-align: center;
      margin-top: 21px;
    }

    ._desc {
      width: 170px;
      height: 38px;
      font-size: 12px;
      color: #a1a4ab;
      line-height: 16px;
      text-align: justify;
      margin: 15px auto 0;
    }

    ._btns {
      position: absolute;
      width: 182px;
      height: 38px;
      margin-left: -91px;
      left: 50%;
      bottom: 10px;

      .pay-btn,
      .enter-btn {
        width: 182px;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        border-radius: 4px;
        text-align: center;
        margin: 0;
        padding: 0;
      }

      .pay-btn {
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(67, 121, 237, 1);
        color: rgba(67, 121, 237, 1);
        float: left;
      }

      .pay-btn:hover {
        background-color: rgba(255, 255, 255, 0.8);
        border-color: rgba(67, 121, 237, 0.8);
        color: rgba(67, 121, 237, 0.8);
      }

      .enter-btn {
        background: #fa7516;
        border: 1px solid #fa7516;
        color: #fff;
        float: right;
      }

      .enter-btn:hover {
        background-color: rgba(250, 117, 22, 0.8);
        border-color: rgba(250, 117, 22, 0.8);
      }
    }
  }
</style>
<script>
  import dateUtil from '@/dss-common/utils/date';
  import store from '@/business-common/store.js';
  import storeUser from '@/business-common/store_user.js';
  import api from '@/dss-wechat3rd/src/api';
  import types from '@/business-common/industry-enum.js';
  import urlUtil from '@/dss-common/utils/url.js';
  import { mapState } from 'vuex';
  import chooseApi from '@/business-common/api/epApi.js';

  const NowTime = +new Date();
  const NearTime = types.NEAR_TIME_LINE_DAY * 24 * 60 * 60 * 1000;
  const PACKAGE_STATUS = types.PACKAGE_STATUS;

  export default {
    mixins: [storeUser],
    data() {
      return {
        loading: false,
      };
    },
    props: {
      item: {
        type: Object,
        default: null,
      },
    },
    filters: {
      expireDate(value) {
        return dateUtil.format(new Date(value), 'YYYY-MM-DD');
      },
      statusName(value) {
        switch (value) {
          case PACKAGE_STATUS.VALID:
            return '有效';
          case PACKAGE_STATUS.NORMAL_EXPIRED:
            return '套餐过期';
          case PACKAGE_STATUS.TRY_EXPIRED:
            return '试用过期';
          case PACKAGE_STATUS.TRY:
            return '试用中';
        }
      },
    },
    computed: {
      ...mapState({
        userInfo: 'userInfo',
      }),
    },
    methods: {
      // 能否续费
      ableRenew(item) {
        // 套餐有效
        if (item.status == 1) {
          const now = +new Date();
          const lef = now - new Date();
          return lef < NearTime;
        }
        return true;
      },

      // 是否接近要续费的日期
      isNearTime(time) {
        return time - NowTime <= NearTime;
      },

      toOrder(id) {
        const day30Limit = 30 * 24 * 60 * 60 * 1000;
        if (this.item.expireTime + day30Limit > new Date().getTime()) {
          this.$router.push({
            path: '/startup/order',
            query: {
              id: id,
            },
          });
        } else {
          this.$message('套餐有效期超过1个月，不允许续费！');
        }
      },

      toUpgrade(id) {
        this.$router.push({
          path: '/startup/order',
          query: {
            id: id,
            upgrade: 'upgrade',
          },
        });
      },

      toConsole(id) {
        // this.loading = true;
        // api
        //   .changeApp({ appId: id })
        //   .then(res => {
        //     this.update_userInfo(res.data);
        //     this.getUserTemplateId();

        //     let appFeatures = [];
        //     if (!!res.data.appInfo) {
        //       appFeatures = res.data.appInfo.appFeatures;
        //     }
        //     //更新当前应用程序特征
        //     store.commit('set_app_features', appFeatures);
        //   })
        //   .catch(() => {
        //     this.loading = false;
        //   });

        const params = {
          employeeChooseAppId: id,
          employeeId: this.userInfo.userId,
        };
        chooseApi.chooseEp(params).then(res => {
          this.update_userInfo(res.data);
          this.getUserTemplateId();

          let appFeatures = [];
          if (res.data.appInfo) {
            appFeatures = res.data.appInfo.appFeatures;
          }
          // 更新当前应用程序特征
          store.commit('set_app_features', appFeatures);
          store.dispatch('getRootMenu');
        });
      },

      getUserTemplateId() {
        api
          .getUserTemplate()
          .then(response => {
            if (response.data && response.data.templateId) {
              store.commit('set_sellerTemplateId', response.data.id);
              const redirect = urlUtil.queryString('redirect');
              if (redirect) {
                window.top.location.href = decodeURIComponent(redirect);
              } else {
                this.$router.push('/console');
              }
            }
          })
          .always(() => {
            this.loading = false;
          });
      },
    },
  };
</script>
