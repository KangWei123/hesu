<template>
  <div class="app-main" v-loading="loading" element-loading-spinner="el-icon-loading">
    <div class="card-item">
      <div class="ump-box" v-if="ump">
        <div class="ump-tag">集团</div>
        <img class="ump-img" src="../images/home/ump-logo.png" />
        <div class="ump-title">{{ ump.appName }}</div>
        <div class="ump-desc">多业态会员一站式管理，用数据驱动业务增长</div>
        <button class="default-btn" @click="toConsole(ump.id, ump.categoryId)">进入集团</button>
      </div>
      <div class="item-box">
        <template v-for="(item, index) in data">
          <chose-item :key="index" :item="item" :index="index" :custom-style="style" />
        </template>
        <i></i><i></i><i></i><i></i><i></i>
      </div>
    </div>
  </div>
</template>
<script>
  import { w3rdApi } from '@/register/wechat3rd';
  // import menu from '@/dss-wechat3rd/src/menu/index.js';
  import ChoseItem from './ChoseItem.vue';
  import { mapState } from 'vuex';
  import chooseApi from '@/business-common/api/epApi.js';
  import api from '@/dss-wechat3rd/src/api';
  import urlUtil from '@/dss-common/utils/url.js';

  export default {
    components: { ChoseItem },
    data() {
      return {
        loading: true,
        data: [],
        ump: null,
      };
    },
    computed: {
      ...mapState({
        userInfo: 'userInfo',
      }),

      style() {
        if (this.data.length <= 3) {
          return 'one';
        } else if (this.data.length === 4) {
          return 'oneTwo';
        } else {
          return 'normal';
        }
      },
    },

    mounted() {
      this.apiList();
    },

    methods: {
      apiList() {
        w3rdApi
          .getUserStoreList()
          .then(res => {
            this.data = res.data || [];
            if (this.userInfo.accountType == 0) {
              this.getUmp();
            }
          })
          .always(res => {
            this.loading = false;
          });
      },

      toConsole(id) {
        if (!id) {
          return;
        }
        const params = {
          employeeChooseAppId: id,
          employeeId: this.userInfo.userId,
        };
        chooseApi.chooseEp(params).then(res => {
          this.getUserTemplateId();

          const { appInfo, userId, accountType } = res.data;
          localStorage.setItem('accountInfo', JSON.stringify({ ...appInfo, userId, accountType }));
        });
      },

      getUserTemplateId() {
        api
          .getUserTemplate()
          .then(response => {
            if (response.data && response.data.templateId) {
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

      // 获取大会员集团业态
      getUmp() {
        this.data.forEach((item, index) => {
          if (item.industryKey === 'ump') {
            this.ump = item;
            this.data.splice(index, 1);
          }
        });
      },
    },
  };
</script>

<style lang="less">
  .app-main {
    position: absolute;
    top: 170px;
    margin: 0 auto;
    width: 100%;
  }

  .card-item {
    margin: 0 auto;
    width: 1200px;
    display: flex;
    justify-content: flex-start;

    .ump-box {
      position: relative;
      width: 300px;
      height: 632px;
      opacity: 1;
      background: #ffffff;
      border-radius: 6px;
      margin-right: 16px;
      .ump-tag {
        position: absolute;
        right: 0;
        top: 0;
        width: 64px;
        height: 25px;
        background: linear-gradient(90deg, #ffb976, #ff8341);
        border-radius: 0px 6px 0px 4px;
        text-align: center;
        font-size: 13px;
        font-weight: 400;
        color: #ffffff;
        line-height: 25px;
      }

      .ump-img {
        width: 202px;
        height: 202px;
        position: absolute;
        top: -34px;
        left: -10px;
      }

      .ump-title {
        font-size: 18px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 600;
        text-align: left;
        color: #27292f;
        line-height: 24px;
        margin-top: 200px;
        margin-left: 32px;
      }
      .ump-desc {
        width: 215px;
        font-size: 13px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 400;
        text-align: left;
        color: #8b91a4;
        line-height: 24px;
        margin-left: 32px;
        margin-top: 16px;
      }
      .default-btn {
        cursor: pointer;
        margin-left: 32px;
        cursor: pointer;
        border: none;
        width: 105px;
        height: 36px;
        line-height: 36px;
        background: #ff8341;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 400;
        text-align: center;
        color: #ffffff;
        margin-top: 24px;
      }
      .default-btn:hover {
        background: rgba(255, 131, 65, 0.8);
      }
    }

    .item-box {
      width: 884px;
    }

    i {
      width: 330px;
      margin-right: 10px;
    }

    .card-title {
      position: relative;
      font-size: 24px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: center;
      color: #000000;
      line-height: 33px;
      margin-bottom: 24px;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        margin-top: -6px;
        width: 16px;
        height: 12px;
        background-image: url('../images/bg/icon.png');
      }

      &::before {
        left: calc(50% - 90px);
      }

      &::after {
        margin-left: 18px;
      }
    }
  }

  // @media screen and (max-width: 1200px) {
  //   .card-item {
  //     width: 690px;
  //   }
  // }

  // @media (max-width: 1440px) and (min-width: 1200px) {
  //   .card-item {
  //     width: 1040px;
  //   }
  // }
</style>
