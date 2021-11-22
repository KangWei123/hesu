<template>
  <div class="coupon blue-shadow-box"> 
       <!-- v-if="!noVip" -->
    <div class="box-title">
      <div>持有优惠券</div>
    </div>
    <transition-group class="coupon-list" name="vuelist" tag="div">
      <div class="coupon-item gradual-bg"
            v-for="(item, index) in list"
            :key="index">
        <span class="coupon-item-discount hidden-over">{{item.desc}}</span>
        <span class="coupon-item-time">{{item.time}}</span>
        <!-- <span class="coupon-item-name">{{item.name}}</span> -->
      </div>
    </transition-group>
    <div class="no-data"
         v-show="list && !list.length">暂无优惠券</div>
  </div>
</template>

<script>
import utils from '@/dss-common/utils/date.js';
import cameraFlowApi from '@/dss-common/api/camera-flow.js';
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    wkbStatus: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      list: [],
      consumeAmount: '',
      orderTotalCount: '--'
    };
  },
  watch: {
    data(val, oldVal) {
      if (val && val.memberId) {
        this.getList(val);
      } else {
        this.list = [];
      }
    }
  },
  computed: {
    noVip() {
      return !(this.data.memberId && this.wkbStatus);
    }
  },
  methods: {
    getList(row) {
      cameraFlowApi
        .getCouponList({
          userId: row.memberId,
          pageSize: 3
        })
        .then(result => {
          this.list = (result.data || []).map(item => {
            return {
              name: item.name,
              time: utils.format(new Date(item.endTime), 'MM/DD', 8) + '到期',
              desc: `满${this.formatMoney(item.minimumFee, 2)}减${this.formatMoney(item.discountFee, 2)}`
            };
          });
        })
        .always(_ => {});
    },
    formatMoney(money, precision = 2) {
      return (~~money / 100).toFixed(precision);
    }
  }
};
</script>

<style lang="less" scoped>
.coupon {
  height: 100%;
}

.coupon-list {
  width: 233px;
  margin: 0 auto;
}

.coupon-item {
  height: 49px;
  line-height: 49px;
  font-size: 14px;
  color: #FFF;
  margin-top: 10px;
  background: url('../../../asserts/images/coupon-bg.png');
}

.coupon-item-discount {
  width: 65%;
  display: inline-block;
  vertical-align: middle;
  padding: 0 5px 0 25px;
  box-sizing: border-box;
}

.coupon-item-time {
  width: 33%;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
}
</style>
