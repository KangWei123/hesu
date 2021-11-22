<template>
  <div class="storemgr-view" v-loading="loading" element-loading-spinner="el-icon-loading">
    <div class="single-store" v-if="!isChainStore">
      <span class="icon">!</span>
      <span class="tip">您当前仅能管理1家门店，如需新增门店请联系客服</span>
    </div>

    <div class="store-theme">
      <span class="icon" :style="iconStyle"></span>
      <span class="name">{{ data.name }}</span>
      <el-switch
        v-model="data.isOpen"
        @change="switchBusiness(data)"
        style="margin-left: 20px"
        :active-value="1"
        active-text="营业"
        inactive-text="闭店"
      >
      </el-switch>
    </div>

    <div class="store-detail">
      <div>
        <span class="name">客服电话 ：</span>
        <span>{{ data.tel | empty }}</span>
      </div>
      <div v-if="showBusinessDayOfWeek">
        <span class="name">营业时间 ：</span>
        <span>{{ businessTime }}</span>
      </div>
      <div v-if="!this.env.ESTATE">
        <span class="name">{{ storeLabel }}地址 ：</span>
        <span>{{ data.address | empty }}</span>
      </div>
      <div>
        <span class="name">{{ storeLabel }}简介 ：</span>
        <span style="word-break: break-all">{{ data.describe | empty }}</span>
      </div>

      <el-button type="primary" style="margin-top: 20px" @click="clickEdit">编辑信息 </el-button>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import * as storeApi from '@/mod-console/src/api/storeApi';
  import { toShowNames } from '@/dss-common/utils/date-format';
  import defaultLogo from '@/mod-console/src/images/logo-default.png';

  export default {
    computed: {
      ...mapState({
        curApp: 'curApp',
        env: 'env',
        appFeatures: 'appFeatures',
      }),
      showLogo() {
        return !this.env.ESTATE;
      },
      storeLabel() {
        if (this.appFeatures && this.appFeatures.indexOf('zhongjun') > -1) {
          return '商场';
        } else {
          return this.env.ESTATE ? '区域' : '门店';
        }
      },
      showBusinessDayOfWeek() {
        return !this.env.ESTATE;
      },
      // 周一至周六 10：00至22：00
      businessTime() {
        const { businessStartHour, businessEndHour, businessDayOfWeek } = this.data;
        // businessStartHour,businessEndHour要考虑为0的情况
        if (businessStartHour == null || businessEndHour == null || !businessDayOfWeek) {
          return '- -';
        }
        return `${toShowNames(businessDayOfWeek)} ${this.toHour(businessStartHour)} 至 ${this.toHour(businessEndHour)}`;
      },
    },
    data() {
      return {
        loading: true,
        isChainStore: false,
        id: '',
        iconStyle: '',
        data: {
          name: '',
          address: '',
          tel: null, // 客服电话
          describe: null, // 门店介绍
          isOpen: 1, // 是否打样
          businessStartHour: null, // 门店营业起始时间
          businessEndHour: null, // 门店营业结束时间
          businessDayOfWeek: null, // 门店营业星期（按位 天一二三四五六）

          type: 0, // 0:门店,1:商圈
          logo: '',
        },
      };
    },
    mounted() {
      this.isChainStore = true;
      // 支持组件传入 && 路由传入
      this.id = (this.$route.query || {}).storeId || this.storeId;
      this.apiView();
    },
    props: {
      // 支持组件传入
      storeId: {
        type: Number,
      },
    },

    filters: {
      empty(val) {
        if (!val) {
          return '- -';
        }
        return val;
      },
    },

    methods: {
      toHour(t) {
        const over = t >= 24;
        if (over) {
          t -= 24;
        }
        const hour = parseInt(t);
        const min = hour !== 0 ? t % hour : t === 0.5 ? 0.5 : 0;
        return (over ? '次日' : '') + (hour > 9 ? hour : '0' + hour) + ': ' + (min == 0 ? '00' : '30');
      },

      // 营业开关
      switchBusiness(row) {
        this.loading = true;
        storeApi
          .toggleSwitch({
            storeId: this.id,
            isOpen: row.isOpen ? 1 : 0,
          })
          .then(res => {
            this.api();
          })
          .always(() => {
            this.loading = false;
          });
      },

      apiView() {
        storeApi
          .viewStore({ storeId: this.id })
          .then(res => {
            console.log('res.data -> ', res.data);
            for (const key in this.data) {
              this.data[key] = res.data[key];
            }
            // this.iconStyle = `background: transparent url(${this.data.logo || '../../../images/store.png'}) no-repeat 0 0;background-size: cover;`
            this.iconStyle = `background: url(${this.data.logo || defaultLogo})`;
          })
          .always(() => {
            this.loading = false;
          });
      },

      // 编辑
      clickEdit() {
        const { data } = this.$route.query;
        this.$router.push({
          path: '/companyManage/store-center/store-mgr/add',
          query: {
            storeId: this.id,
            data: data,
          },
        });
      },
    },
  };
</script>

<style lang="less">
  .storemgr-view {
    background-color: #fff;

    .single-store {
      .icon {
        display: inline-block;
        width: 26px;
        height: 20px;
        background: rgba(56, 226, 190, 1);
        border-radius: 10px 10px 10px 0;
        text-align: center;
        color: #fff;
      }

      .tip {
        height: 16px;
        line-height: 16px;
        font-size: 12px;
        color: rgba(133, 140, 153, 1);
      }
    }

    .store-theme {
      padding: 20px;
      border-bottom: 1px dashed rgba(186, 198, 211, 1);

      .icon {
        height: 48px;
        width: 48px;
        display: inline-block;
        border-radius: 100%;
        vertical-align: middle;
        background-size: cover !important;
      }

      .name {
        height: 48px;
        line-height: 48px;
        font-size: 24px;
        color: rgba(32, 37, 44, 1);
        margin-left: 18px;
      }
    }

    .store-detail {
      padding: 0 20px 20px 20px;

      div {
        height: 19px;
        line-height: 19px;
        font-size: 14px;
        color: rgba(133, 140, 153, 1);
        padding-top: 20px;

        .name {
          display: inline-block;
        }
      }
    }

    .left {
      margin-left: 20px;
    }
  }
</style>
