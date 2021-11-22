<template>
  <div class="sms-recharge-container">
    <el-breadcrumb class="wkt-breadcrumb-container" separator="/">
      <el-breadcrumb-item :to="{ path: '/marketing/sms-group'}">短信群发</el-breadcrumb-item>
      <el-breadcrumb-item>短信充值</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="sms-recharge">
      <div class="recharge-tip">
        <div>
          <span class="remain-label">短信剩余条数: <span class="remain-count">{{remainCount}}</span></span>
        </div>
      </div>

      <div class="recharge-container"
           v-loading="loading">
        <div class="b-item"
             v-for="(item, index) in recharges"
             :key="index">
          <div class="count">
            {{item.totalCount}}条
          </div>
          <div class="unit-price">
            单价 {{item.unitPrice | price}} 元/条
          </div>
          <el-button class="cost"
                     size="mini"
                     @click="gotoRecharge(item)">
            ¥ {{item.totalPrice | price}}
          </el-button>
        </div>
      </div>

      <recharge-record />
    </div>
  </div>
</template>


<script>
import RechargeRecord from './recharge-record.vue';
import SMSGroupApi from '@/dss-wechat3rd/src/api/marketingAPI.js';

export default {
  name: 'recharges',

  components: {
    RechargeRecord
  },

  data() {
    return {
      remainCount: this.$route.query.remainCount,
      smsSignature: this.$route.query.smsSignature,
      loading: false,
      recharges: []
    };
  },

  mounted() {
    this.querySMSPackages();
  },

  methods: {
    gotoRecharge(item) {
      console.log('gotoRecharge ---->', item);
      this.$router.push({
        path: '/marketing/sms-group/order',
        query: {
          name: '短信充值',
          itemId: item.productId,
          count: item.totalCount,
          unitPrice: item.unitPrice,
          num: 1,
          cost: item.totalPrice
        }
      });
    },

    querySMSPackages() {
      this.loading = true;
      SMSGroupApi.querySMSPackages()
        .then(res => {
          console.log('querySMSPackages --->', res);
          this.recharges = res.data || [];
          this.recharges.sort((o1, o2) => {
            return o1.totalCount - o2.totalCount;
          });
        })
        .catch(err => {
          console.error('querySMSPackages', err);
        })
        .always(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less">
.sms-recharge {
  padding: 0 20px 20px;
  .market-breadcrumb{
    margin-left:0;
  }
  .recharge-tip {
    margin: 20px 0;
    max-width: 900px;
    background: rgba(46, 141, 255, 0.06);
    border: 1px solid rgba(46, 141, 255, 0.09);
    padding: 20px;
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: @black-color;

    .remain-label {
      width: 131px;
      height: 20px;
      font-size: 14px;
      font-family: PingFangSC-Semibold;
      font-weight: 600;
      color: @black-color;
      line-height: 20px;
    }

    .remain-count {
      color: @blue-color;
      margin-left: 10px;
    }
  }

  .row-2 .store-warn {
    color: red;
    margin-left: 10px;
  }

  .recharge-container {
    margin: 30px 0;

    .b-item {
      width: 210px;
      height: 250px;
      border-radius: 3px;
      border: 1px solid @border-color;
      margin-right: 45px;
      display: inline-block;
      text-align: center;
      padding-top: 50px;
      box-sizing: border-box;
    }
  }

  .b-item {
    .count {
      font-size: 14px;
      font-family: PingFangSC-Semibold;
      font-weight: 600;
      color: rgba(51, 51, 51, 1);
      line-height: 20px;
    }

    .unit-price {
      margin-top: 20px;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 20px;
    }

    .cost {
      margin-top: 40px;
      font-size: 12px;
    }
  }
}
</style>
