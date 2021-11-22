<template>
  <div class="user-detail" v-loading="loading">
    <header class="user-detail__header">
      <base-info :info="userInfo"></base-info>
    </header>
    <main class="user-detail__body">
      <el-tabs v-model="active" type="card">
        <el-tab-pane v-for="item of TABS" :key="item.name" :label="item.name" :name="item.component" lazy>
          <component v-if="userInfo" :is="item.component" :info="userInfo"></component>
        </el-tab-pane>
      </el-tabs>
    </main>
  </div>
</template>

<script>
  import BaseInfo from './base-info.vue';
  import api from '@/mod-member/src/api/memberAPI';

  const TABS = [
    { name: '会员概况', component: 'isummary' },
    { name: '应用渠道', component: 'channel' },
    { name: '成长值明细', component: 'growth' },
    { name: '积分明细', component: 'scores' },
    { name: '会员订单', component: 'orders' },
    { name: '优惠券明细', component: 'coupons' },
    { name: '礼品卡明细', component: 'giftCard' },
    { name: '充值卡明细', component: 'rechargeCard' },
    { name: '浏览记录', component: 'visisted' },
  ];

  /**
   * 用户详情
   */
  export default {
    name: 'UserDetail',
    components: {
      BaseInfo,
      isummary: () => import('./summary/index.vue'),
      scores: () => import('./scores/index.vue'),
      growth: () => import('./growth/index.vue'),
      channel: () => import('./channel/index.vue'),
      orders: () => import('./orders/index.vue'),
      coupons: () => import('./coupons/index.vue'),
      visisted: () => import('./visisted/index.vue'),
      giftCard: () => import('./gift-card.vue'),
      rechargeCard: () => import('./recharge-card.vue'),
    },
    provide() {
      return {
        switchTab: tab => {
          this.active = tab;
        },
        refreshUserInfo: () => {
          this.getDetail();
        },
      };
    },
    data() {
      return {
        TABS,
        active: this.$route.query.tab || 'isummary',
        userInfo: undefined,
        loading: true,
      };
    },
    computed: {
      isNormal() {
        return this.$route.path.includes('/normal/');
      },
      parentPath() {
        return this.isNormal ? { name: 'member.normal-user-list' } : { name: 'member.company-user-list' };
      },
      id() {
        return this.$route.params.id;
      },
    },
    watch: {
      active(v) {
        this.$router.replace({
          ...this.$route,
          query: {
            ...this.$route.query,
            tab: v,
          },
        });
      },
    },
    mounted() {
      this.getDetail();
    },
    methods: {
      async getDetail() {
        try {
          this.loading = true;
          const { data } = await api.memberCenter.getDetail({ id: this.id });
          this.userInfo = data;
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>

<style lang="less">
  .user-detail {
    .el-tabs--card > .el-tabs__header .el-tabs__item {
      border-color: #dce1e6;
      font-weight: 400;

      &.is-active {
        font-weight: 500;
      }
    }

    &__header {
      background: white;
      padding: 20px 32px;
    }

    &__body {
      background: white;
      margin-top: 24px;

      .el-tabs__nav-scroll {
        padding-left: 24px;
        padding-top: 14px;
      }
    }
  }
</style>
