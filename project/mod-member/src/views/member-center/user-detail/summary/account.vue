<template>
  <div class="accounts">
    <el-dialog :visible.sync="scoreDialogVisible" title="积分有效期" center append-to-body width="500px">
      <el-table :data="score.validDateList" stripe size="small">
        <el-table-column label="积分" prop="score"></el-table-column>
        <el-table-column label="有效期至" prop="validDate" v-slot="scope">
          {{ scope.row.validDate.slice(0, -9) }}
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="scoreDialogVisible = false" type="primary">确 定</el-button>
      </template>
    </el-dialog>

    <account-item title="积分账户" :fields="scoreFields" :get-data="fetchScoreStat" details-name="scores">
      <template #main>{{ score.score || 0 }}</template>
      <template v-if="!!score.score && !!score.scoreValidity" #expireDate>
        <div class="score__expire" @click="scoreDialogVisible = true">
          <i class="el-icon-question" /> 最近有效期：{{ scoreExpireDate }}
        </div>
      </template>
    </account-item>
    <account-item
      title="优惠券"
      header-class="blue"
      :fields="couponFields"
      :get-data="fetchCouponStat"
      details-name="coupons"
    >
      <template #main="{ data }">{{ data.effectiveCouponTickets || 0 }} <span class="unit">张</span></template>
    </account-item>
    <account-item
      title="礼品卡"
      header-class="green"
      :fields="giftCardFields"
      :get-data="fetchGiftCardStat"
      details-name="giftCard"
    >
      <template #main="{ data }">{{ (data.balanceSum || 0) | price }} <span class="unit">元</span></template>
    </account-item>
    <account-item
      title="充值卡"
      header-class="blue"
      :fields="rechargeCardFileds"
      :get-data="fetchRechargeCardStat"
      details-name="rechargeCard"
    >
      <template #main="{ data }">{{ (data.balance || 0) | price }} <span class="unit">元</span></template>
    </account-item>
  </div>
</template>

<script>
  import api from '@/mod-member/src/api/memberAPI';
  import date from '@/dss-common/utils/date';
  import AccountItem from './account-item.vue';

  export default {
    name: 'Accounts',
    components: { AccountItem },
    props: {
      info: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        scoreDialogVisible: false,
        scoreFields: [
          { key: 'orderConsumeAwardScore', name: '消费积分' },
          { key: 'activityAwardScore', name: '活动积分' },
          { key: row => (row.addSpecialScore || 0) - (row.subtractSpecialScore || 0), name: '特殊积分' },
          { key: 'scoreTotal', name: '累计积分' },
          { key: 'usedScore', name: '使用积分' },
          { key: 'expiredScore', name: '过期积分' },
        ],
        score: {
          score: 0,
          scoreValidity: 0,
          validDateList: [],
        },
        couponFields: [
          { key: 'expiredCouponTicketsAmount', name: '已用优惠', unit: '元' },
          { key: 'usedCouponTickets', name: '已用优惠券', unit: '张' },
          { key: 'expiredCouponTickets', name: '过期优惠券', unit: '张' },
          { key: 'totalCouponTickets', name: '累计优惠券', unit: '张' },
        ],
        rechargeCardFileds: [
          { key: 'principalAmount', name: '累计本金', unit: '元' },
          { key: 'presentedAmount', name: '累计赠额', unit: '元' },
          { key: 'totalAmount', name: '累计总额', unit: '元' },
          { key: 'usedAmount', name: '已用额度', unit: '元' },
        ],
        giftCardFields: [
          { key: 'cumulativePrincipal', name: '累计本金', unit: '元' },
          { key: 'discountsQuota', name: '优惠额度', unit: '元' },
          { key: 'usedQuota', name: '已用额度', unit: '元' },
          { key: 'expiredQuota', name: '过期额度', unit: '元' },
        ],
      };
    },
    computed: {
      scoreExpireDate() {
        const { validDateList } = this.score;

        if (validDateList && validDateList.length) {
          const d = date.parse(validDateList[0].validDate);
          return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
        }

        return '';
      },
    },
    methods: {
      // 查询积分
      async fetchScoreStat() {
        const res = await api.scoreCenter.getUserAccount({ uniqueAccountId: this.info.uniqueAccountId });
        res.data && (this.score = res.data);
        return res;
      },
      // 查询优惠券
      fetchCouponStat() {
        return api.memberCenter.getUserCoupons(this.info.uniqueAccountId);
      },
      // 查询充值卡
      fetchRechargeCardStat() {
        return api.memberCenter.getUserRechargeCard(this.info.uniqueAccountId);
      },
      // 查询礼品卡
      fetchGiftCardStat() {
        return api.memberCenter.getUserGiftCard(this.info.id, 0);
      },
    },
  };
</script>

<style lang="less" scoped>
  .accounts {
    display: flex;
  }

  .score__expire {
    cursor: pointer;
    margin-left: 10px;
  }

  .unit {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
  }
</style>
