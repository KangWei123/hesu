<template>

  <div class="start-up-pay">

    <div v-if="status==OrderStatus.Init">

      <div class="block">
        <div class="up">
          <div class="icon"
               :class="packageType==1?'single-app-icon':'chain-app-icon'"></div>
          <div class="industry">{{name}}</div>
        </div>
        <div class="price">套餐价格：{{price/100}}</div>
        <div class="expire">订购时长：{{expireYear}}年</div>
        <el-button class="middle-red-btn"
                   type="primary"
                   @click="clickReadyToPay">立即支付</el-button>
      </div>

      <div class="agree-wrap">
        <el-checkbox v-model="agreement"></el-checkbox>
        <a href="javascript:;"
           @click="clickAgreement"
           class="agreement">我已阅读并同意《惟客宝产品及服务协议》</a>
      </div>

    </div>
    <div v-else>
      <div v-if="status==OrderStatus.Pending"
           class="qrcode-loading">
        正在加载支付二维码...
      </div>
      <div v-if="status==OrderStatus.OrderHangUp"
           class="qrcode-hangup">
        <img :src="qrcode">
        <div>请微信扫码支付</div>
      </div>
      <div v-if="status==OrderStatus.OrderDone"
           class="qrcode-done">
        <div class="header">
          <span class="icon"></span>
          <span class="title">订购成功</span>
        </div>
        <div class="success-tip">您已成功订购</div>
        <div class="success-desc">{{name}}</div>

        <el-button class="middle-red-btn"
                   type="primary"
                   @click="clickToStore">进入店铺</el-button>
      </div>
    </div>
    <agreement-dialog :visible.sync="dialog.agreement"
                      protocol="wkb-product">
    </agreement-dialog>
  </div>

</template>
<script>
import './Pay.less';
import AgreementDialog from '@/dss-wechat3rd/src/bz_components/agreement/AgreementDialog';
import api from '@/dss-wechat3rd/src/api';
import storeUser from '@/business-common/store_user.js';

const OrderStatus = {
  Init: 1, //初始状态
  Pending: 2, //请求生成订单
  OrderHangUp: 3, //订单生成等待支付
  OrderDone: 4, //支付成功
  OrderFail: 5 //支付失败
};

export default {
  mixins: [storeUser],
  components: {
    AgreementDialog
  },
  data() {
    return {
      agreement: false,

      appId: 0, ////续费或者购买的店铺Id
      itemId: 0, //选购的套餐ID
      name: '', //套餐名字
      price: 0, //套餐价格
      expireYear: 0, //使用周期
      packageType: 0,

      OrderStatus: OrderStatus,
      qrcode: '',
      order: {
        orderNo: '', //订单号
        itemName: '', //商品名称
        payFee: null, //实际付款金额
        promotionFee: null //优惠金额
      },
      orderInter: null,
      status: OrderStatus.Init,
      time: 0,
      dialog: {
        agreement: false
      }
    };
  },
  mounted() {
    const { appId, itemId, name, price, expireYear, packageType } = this.$route.query;
    this.appId = appId;
    this.itemId = itemId;
    this.expireYear = expireYear;
    this.price = price;
    this.name = name;
    this.packageType = packageType;
  },

  beforeDestroy() {
    this.closeCheck();
  },

  methods: {
    clickAgreement() {
      this.dialog.agreement = true;
    },

    //退出 订单状态 检查
    closeCheck() {
      if (this.orderInter) {
        window.clearTimeout(this.orderInter);
        delete this.orderInter;
      }
    },

    //开始 订单状态 检查
    startCheck() {
      this.time += 1;
      api
        .queryOrderStatus({
          appId: this.appId,
          itemId: this.itemId
        })
        .then(res => {
          let order = res.data;
          if (!!order) {
            //已付款
            if (!!order.paid) {
              this.status = OrderStatus.OrderDone;
              for (let key in order) {
                this.order[key] = order[key];
              }
              this.closeCheck();
            }
          }
        })
        .always(res => {
          !!this.orderInter && (this.orderInter = window.setTimeout(this.startCheck.bind(this), 3000));
        });
    },
    //请求支付二维码
    clickReadyToPay() {
      if (!this.agreement) {
        return this.$message({
          message: '请确认并同意协议',
          type: 'warning'
        });
      }
      this.qrcode = '';
      this.status = OrderStatus.Pending;
      api
        .userUnifiedOrder({
          appId: this.appId,
          itemId: this.itemId
        })
        .then(res => {
          this.qrcode = 'data:image/png;base64,' + res.data;
          this.status = OrderStatus.OrderHangUp;
          this.orderInter = window.setTimeout(this.startCheck.bind(this), 3000);
        })
        .then(res => {
          if (!this.qrcode) {
            this.status = OrderStatus.Init;
          }
        });
    },

    clickToStore() {
      if (this.appId) {
        api.changeApp({ appId: this.appId }).then(res => {
          this.update_userInfo(res.data);
        });
      }
      this.$router.push('/');
    }
  }
};
</script>
