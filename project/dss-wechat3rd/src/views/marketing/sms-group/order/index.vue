<template>
  <div class="sms-order-container sms-order">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/marketing/sms-group'}">短信群发</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/marketing/sms-group/recharge'}">短信充值</el-breadcrumb-item>
      <el-breadcrumb-item>订单</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="sms-order-content" v-if="status == OrderStatus.Init">
      <table class="table table-bordered bg-grey">
        <tbody>
          <tr>
            <th>商品信息</th>
            <th>规格</th>
            <th>充值店铺</th>
            <th>单价</th>
            <th>数量</th>
            <th>小计</th>
          </tr>
        </tbody>
      </table>

      <table class="table table-bordered bg-white">
        <tbody>
          <tr>
            <td>{{ orderItem.name }}</td>
            <td>{{ orderItem.count }} 条</td>
            <td>{{ storeName }}</td>
            <td>¥ {{ orderItem.unitPrice | price }}</td>
            <td>x{{ orderItem.num }}</td>
            <td>¥ {{ orderItem.cost | price }}</td>
          </tr>
        </tbody>
      </table>

      <div class="op-order">
        <div class="order-price">
          应付： ¥ {{ pay | price }}
        </div>

        <div class="order-btn-container">
          <el-checkbox class="order-check"
                       v-model="checked">我已阅读并同意
            <a class="dss-link"
               href="javascript:;"
               @click="openProtocolPage">《短信充值协议》
            </a>
          </el-checkbox>

          <el-button type="primary"
                     class="order-btn"
                     size="small"
                     :disabled="!checked"
                     @click="doPay">
            确认支付
          </el-button>
        </div>
      </div>
    </div>

    <div class="sms-order-content" v-else>
      <div v-if="status == OrderStatus.Pending"
           class="qrcode-loading">
        正在加载支付二维码...
      </div>
      <div v-if="status == OrderStatus.OrderHangUp"
           class="qrcode-hangup">
        <img :src="qrcode">
        <div>请微信扫码支付</div>
      </div>
      <div v-if="status == OrderStatus.OrderDone"
           class="qrcode-done">
        <div class="header">
          <span class="icon"></span>
          <span class="title">订购成功</span>
        </div>
        <div class="success-tip">您已成功订购</div>
        <div class="success-desc">{{name}}</div>

        <el-button class="middle-red-btn"
                   type="primary"
                   @click="back">返回</el-button>
      </div>
    </div>

    <agreement-dialog :visible.sync="agreementShow"
                      protocol="sms">
    </agreement-dialog>
  </div>
</template>

<script>
import './index.less';
import api from '@/dss-wechat3rd/src/api';
import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';
import AgreementDialog from '@/dss-wechat3rd/src/bz_components/agreement/AgreementDialog';

const OrderStatus = {
  Init: 1, //初始状态
  Pending: 2, //请求生成订单
  OrderHangUp: 3, //订单生成等待支付
  OrderDone: 4, //支付成功
  OrderFail: 5 //支付失败
};

export default {
  mixins: [AdapterIfr.AdapterMixins],
  components: {
    AgreementDialog
  },

  data() {
    return {
      checked: false,
      orderItem: {},
      agreementShow: false,
      storeName: '',
      status: OrderStatus.Init,
      OrderStatus,
      qrcode: '',
      orderInter: null,
      appId: 0
    };
  },

  computed: {
    pay() {
      return this.orderItem.cost;
    }
  },

  watch: {
    agreementShow(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.adapterIfmMask(newVal);
      }
    }
  },

  mounted() {
    console.log('---------------->', JSON.stringify(this.$store.state.curApp));
    this.orderItem = this.$route.query;
    this.storeName = this.$store.state.curApp ? this.$store.state.curApp.name : '';
    this.appId = this.$store.state.curApp ? this.$store.state.curApp.id : 0;
    console.log('mounted ----->', JSON.stringify(this.orderItem));
  },

  beforeDestroy() {
    this.closeCheck();
  },

  methods: {
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
          itemId: this.orderItem.count
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

    doPay() {
      console.log('doPay ------->');
      if (!this.checked) {
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
          itemId: this.orderItem.itemId
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

    openProtocolPage() {
      console.log('gotoProtocolPage ------->');
      this.agreementShow = true;
    },

    back() {
      console.log('back ---->');
      this.$router.push('/marketing/sms-group/recharge');
    }
  }
};
</script>


<style lang="less">
  .sms-order-container {
    .sms-order-content {
      padding: 20px;
    }
  }
</style>
