<template>
  <div class="box">
    <div class="chart-box">
      <div class="outside-box"
           @click="goStoreMgr"
           v-if="title!=='Customer'">
        <div class="sum"
             v-if="title!=='Customer'&&flowData.outdoorPassengerCount!=null">{{flowData.outdoorPassengerCount}}</div>
        <div class="sum blue"
             @click="goStoreMgr"
             v-else>未绑定设备,前往配置</div>
        <div class="text">店外{{title==='Customer'?'客户':'客流'}}(人)</div>
        <div class="outside-convert"
             v-if="title!=='Customer'">
          <div class="outside-convert-desc convert-desc">店外收银转化率{{flowData.outdoorCheckoutPassengerRate||0}}%</div>
        </div>
      </div>
      <div class="entrance-box">
        <div class="sum"
             v-if="flowData.entrancePassengerCount!=null||customerData.entrancePassengerCount!=null">
          {{title==='Customer'?customerData.entranceCustomerCount:flowData.entrancePassengerCount}}
        </div>
        <div class="sum blue"
             @click="goStoreMgr"
             v-else>未绑定设备,前往配置</div>
        <div class="text">入口{{title==='Customer'?'客户':'客流'}}(人)</div>
        <div class="entrance-convert"
             v-if="title!=='Customer'">
          <div class="entrance-convert-desc convert-desc">进店转化率{{flowData.outdoorEntrancePassengerRate||0}}%</div>
        </div>
      </div>
      <div class="cashier-box">
        <div class="sum"
             v-if="flowData.checkoutPassengerCount!=null||customerData.checkoutCustomerCount!=null">
          {{(title==='Customer'?customerData.checkoutCustomerCount:flowData.checkoutPassengerCount)}}
        </div>
        <div class="sum blue"
             @click="goStoreMgr"
             v-else>未绑定设备,前往配置</div>
        <div class="text">收银台{{title==='Customer'?'客户':'客流'}}(人)</div>
        <div class="cashier-convert">
          <div class="cashier-convert-desc convert-desc">收银转化率{{(title==='Customer'?customerData.entranceCheckoutCustomerRate:flowData.entranceCheckoutPassengerRate)||0}}%</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Chart from '@/dss-common/components/Chart.vue';
import newapi from '@/dss-store/src/api/index.js';
export default {
  components: { Chart },
  props: {
    data: {
      type: Object,
      default() {
        return null;
      }
    },
    title: {
      type: String,
      default() {
        return null;
      }
    }
  },
  data() {
    return {
      customerData: {},
      flowData: {}
    };
  },
  watch: {
    data(newVal) {
      if (this.data) {
        this.format();
      }
    },
    title(newVal) {
      if (!this.data) {
        return;
      }
      this.format();
    }
  },
  mounted() {
    this.format();
  },
  methods: {
    goStoreMgr() {
      this.$router.push('/passflow/store-layout');
    },
    format() {
      if (this.title === 'Customer') {
        let customerData = {
          entranceCustomerCount: this.data.entranceCustomerCount,
          checkoutCustomerCount: this.data.checkoutCustomerCount,
          entranceCheckoutCustomerRate: this.data.entranceCheckoutCustomerRate
        };
        this.customerData = customerData;
      } else {
        let flowData = {
          entrancePassengerCount: this.data.entrancePassengerCount,
          outdoorPassengerCount: this.data.outdoorPassengerCount,
          checkoutPassengerCount: this.data.checkoutPassengerCount,
          outdoorEntrancePassengerRate: this.data.outdoorEntrancePassengerRate,
          outdoorCheckoutPassengerRate: this.data.outdoorCheckoutPassengerRate,
          entranceCheckoutPassengerRate: this.data.entranceCheckoutPassengerRate
        };
        this.flowData = flowData;
      }
    }
  }
};
</script>

<style scoped lang="less">
.box {
  width: 100%;
  height: 350px;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  .chart-box {
    margin-top: 29px;
    position: relative;
    width: 550px;
    text-align: center;
    margin-left: 300px;
  }
  .outside-box {
    display: inline-block;
    position: relative;
    width: 550px;
    height: 80px;
    background: rgba(255, 102, 0, 0.5);
    color: rgba(255, 255, 255, 1);
    text-align: center;
  }
  .entrance-box {
    display: inline-block;
    position: relative;
    width: 490px;
    height: 80px;
    background: rgba(255, 102, 0, 0.7);
    margin-top: 30px;
    text-align: center;
  }
  .cashier-box {
    display: inline-block;
    position: relative;
    text-align: center;
    width: 430px;
    height: 80px;
    background: rgba(255, 102, 0, 1);
    margin-top: 30px;
  }
  .sum {
    margin-top: 15px;
  }
  .blue {
    //  color: #256eff;
    cursor: pointer;
  }
  .text {
    margin-top: 10px;
  }
  .outside-convert {
    position: absolute;
    top: 47px;
    left: -100px;
    width: 85px;
    height: 232px;
    border: 1px solid #979797;
    border-right: none;
    color: rgba(51, 51, 51, 1);
  }
  .entrance-convert {
    position: absolute;
    top: -80px;
    left: 525px;
    width: 149px;
    height: 124px;
    border: 1px solid #979797;
    border-left: none;
    color: rgba(51, 51, 51, 1);
  }
  .cashier-convert {
    position: absolute;
    top: -45px;
    left: 495px;
    width: 149px;
    height: 107px;
    border: 1px solid #979797;
    border-left: none;
    color: rgba(51, 51, 51, 1);
  }
  .convert-desc {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .outside-convert-desc {
    left: -126px;
  }
  .entrance-convert-desc,
  .cashier-convert-desc {
    width: 100%;
    left: 132px;
  }
}
</style>
