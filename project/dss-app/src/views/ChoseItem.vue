<template>
  <div class="start-up-choose" :class="customStyle" v-loading="loading" element-loading-spinner="el-icon-loading">
    <div class="app-container">
      <div class="tag">{{ item.packageName }}</div>
      <div class="_title">
        {{ item.appName
        }}<span class="app-status" v-if="!available(item.status)">{{ AppStatusDesc[item.status] }}</span>
      </div>
      <div class="_desc limit-line line-2">{{ getDesc(item) }}</div>
    </div>
    <img class="img" :src="getLogo(item)" alt="" />

    <!-- <div class="app-desc">
  
    </div> -->

    <div class="_btns" @click="toConsole(item.id, item.categoryId)">
      <button :class="!available(item.status) ? 'disabled-btn' : 'default-btn'" :disabled="!available(item.status)">
        进入应用
      </button>
    </div>
  </div>
</template>

<script>
  import dateUtil from '@/dss-common/utils/date';
  import store from '@/business-common/store.js';
  import storeUser from '@/business-common/store_user.js';
  import api from '@/dss-wechat3rd/src/api';
  import types from '@/business-common/industry-enum.js';
  import urlUtil from '@/dss-common/utils/url.js';
  import { mapState } from 'vuex';
  import chooseApi from '@/business-common/api/epApi.js';
  import { AppStatus, AppStatusDesc } from '../enum';

  const NowTime = +new Date();
  const NearTime = types.NEAR_TIME_LINE_DAY * 24 * 60 * 60 * 1000;
  const PACKAGE_STATUS = types.PACKAGE_STATUS;

  export default {
    mixins: [storeUser],
    data() {
      return {
        AppStatus,
        AppStatusDesc,
        loading: false,
        industryList: [
          {
            category: '零售',
            categoryId: 3,
            industryKey: 'retail',
            desc: '商城零售系统，打造自营+招商+O2O新模式',
            icon: require('../images/home/retail.png'),
          },
          {
            category: '地产置业',
            categoryId: 116,
            industryKey: 'estate_business',
            desc: '打破信息壁垒，全新的线上置业体验',
            icon: require('../images/home/home-ownership.png'),
          },
          {
            category: '酒店文旅',
            categoryId: 121,
            industryKey: 'hotel_travel',
            desc: '一站式酒店管理服务平台，助力酒店行业数字化升级',
            icon: require('../images/home/hotel.png'),
          },
          {
            category: '家居',
            categoryId: 112,
            industryKey: 'home_build_material',
            desc: '门店开启数字化经营，高效获取和服务客户',
            icon: require('../images/home/home-decoration.png'),
          },
          {
            category: '商业中心',
            categoryId: 118,
            industryKey: 'business_center',
            desc: '购物中心数字化经营系统，赋能实体商业高速发展',
            icon: require('../images/home/shopping.png'),
          },
          //  {
          //     category: '写字楼',
          //     categoryId: 118,
          //     key: 'office_building',
          //     desc: '购物中心数字化经营系统，赋能实体商业高速发展',
          //     icon: require('../images/home/office_building.png'),
          //   },
        ],
      };
    },
    props: {
      item: {
        type: Object,
        default: null,
      },
      index: {
        type: Number,
        default: 1,
      },
      customStyle: {
        type: String,
        default: 'normal',
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
      imgPrefix() {
        return this.item.isWs ? 'ws-' : 'bg-';
      },
      available() {
        return item => {
          return [AppStatus.VALID, AppStatus.TRY].includes(item);
        };
      },
    },
    methods: {
      // 是否接近要续费的日期
      isNearTime(time) {
        return time - NowTime <= NearTime;
      },

      getDesc(industry) {
        let desc = '门店开启数字化经营，高效获取和服务客户';
        if (industry.desc) {
          return industry.desc;
        }
        this.industryList.forEach(item => {
          if (industry.industryKey === item.industryKey) {
            desc = item.desc;
          }
        });
        return desc;
      },

      // 获取业态logo
      getLogo(industry) {
        let logo = '';
        this.industryList.forEach(item => {
          if (industry.categoryId === item.categoryId) {
            logo = item.icon;
          }
        });
        return logo || require('../images/home/retail.png');
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
        if (this.item.url) {
          this.gotoWsLink(this.item.url);
          return;
        }

        if (!id) {
          return;
        }

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

          const { appInfo, userId, accountType } = res.data;
          localStorage.setItem('accountInfo', JSON.stringify({ ...appInfo, userId, accountType }));
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
                window.top.location.href = '/wkb.html';
              }
            }
          })
          .always(() => {
            this.loading = false;
          });
      },
      gotoWsLink(url) {
        window.open(url, '_blank');
      },
    },
  };
</script>
<style rel="stylesheet/less" lang="less">
  .start-up-choose {
    position: relative;
    width: 284px;
    height: 200px;
    background: rgba(255, 255, 255, 1);
    float: left;
    border-radius: 6px;
    // border: 2px solid #fff;
    margin: 0 16px 16px 0;
    box-shadow: 0 4px 8px 0 rgba(200, 206, 216, 0.09);
    cursor: pointer;
    z-index: 0;
    overflow: hidden;

    .app-container {
      width: 100%;
      padding: 0 16px;
    }

    .app-status {
      margin-left: 6px;
      padding: 1px 2px;
      border: 1px solid #cdd2e4;
      border-radius: 2px;
      font-size: 12px;
      font-weight: 400;
      color: #cdd2e4;
      line-height: 16px;
    }

    .img {
      position: absolute;
      right: -48px;
      bottom: -46px;
      width: 200px;
      height: 200px;
      z-index: -1;
      opacity: 0.2;
    }

    .tag {
      position: absolute;
      right: 0;
      top: 0;
      width: 64px;
      height: 25px;
      background: rgba(230, 231, 236, 0.39);
      border-radius: 0 6px 0 4px;
      text-align: center;
      font-size: 13px;
      font-weight: 400;
      color: #a2a6b8;
      line-height: 25px;
    }

    ._title {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 600;
      color: #27292f;
      line-height: 22px;
      margin: 32px 0 0 0;
    }

    ._desc {
      width: 167px;
      font-size: 13px;
      font-weight: 400;
      color: #8b91a4;
      line-height: 18px;
      margin-top: 16px;
    }
  }

  ._header {
    position: absolute;
    top: 0;
    left: 0;
    padding: 2px 20px;
    height: 22px;
    line-height: 22px;
    background: #fff0e5;
    border-radius: 0 4px 0 3px;
    font-size: 12px;
    color: #fa7516;
  }

  ._btns {
    position: absolute;
    left: 16px;
    bottom: 24px;
    width: 105px;
    height: 36px;
    font-size: 14px;
    line-height: 36px;
    text-align: center;
    cursor: pointer;

    .default-btn {
      width: 100%;
      height: inherit;
      margin: 0;
      padding: 0;
      outline: none;
      border-radius: 5px;
      line-height: 20px;
      color: #fff;
      border: 1px solid #fff;
      background: #ff8341;
      cursor: pointer;
    }

    .disabled-btn {
      width: 100%;
      height: inherit;
      margin: 0;
      padding: 0;
      outline: none;
      border-radius: 5px;
      line-height: 20px;
      color: #fff;
      background: rgba(255, 131, 65, 0.3);
      border: 1px solid #fff;
      cursor: pointer;
    }

    .default-btn:hover {
      background: rgba(255, 131, 65, 0.8);
    }

    .active {
      color: #2e8dff;
    }
  }

  &:hover {
    &.disabled-border {
    }

    ._btns {
      cursor: pointer;
    }
  }

  .start-up-choose:nth-child(3n) {
    margin-right: 0;
  }

  //一行三个

  .normal {
    .img {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 80px;
      height: 80px;
      z-index: -1;
      opacity: 0.2;
    }
  }

  //一行一个

  .one {
    width: 884px;
    height: 200px;

    .app-container {
      padding: 0 32px;
    }

    ._btns {
      left: 32px;
    }
  }

  //一行两个

  .oneTwo {
    width: 434px;
    height: 200px;

    .app-container {
      padding: 0 24px;
    }

    ._btns {
      left: 24px;
    }
  }

  .oneTwo:nth-child(2n) {
    margin-right: 0;
  }

  .oneTwo:nth-child(3n) {
    margin-right: 16px;
  }
</style>
