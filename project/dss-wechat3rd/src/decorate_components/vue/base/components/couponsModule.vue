<template>
  <div
    class="coupons-module"
    :style="{
      margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      borderRadius: dataSource.radius + 'px',
    }"
  >
    <!-- 零售的视觉 -->
    <div>
      <text-nav-module v-if="dataSource.showNav" :data-source="dataSource.textNavSource"></text-nav-module>
      <div
        v-if="dataSource.data.length"
        class="retail-coupons-module-container"
        :style="{ 'padding-left': dataSource.componentsPadding + 'px' }"
      >
        <div class="item" v-for="(item, index) in dataSource.data" :key="index">
          <img class="coupon-bg" :src="item.couponBackgroundStyle ? item.couponBackgroundUrl : couponBg" />
          <div class="coupon-type">{{ getCouponTypeLabel(item) }}</div>
          <div v-if="item.couponCategory === CouponType.DISCOUNT_COUPON" class="face-value">
            <span> {{ item.discountFee | discount }}折</span>
          </div>
          <!-- 停车券 -->
          <div
            v-else-if="item.couponCategory === CouponType.PARKING_AMOUNT_COUPON"
            :class="item.discountFee === 0 ? 'face-value' : 'face-price'"
          >
            <span v-if="item.discountFee === 0">免停车费</span>
            <span v-else>{{ item.discountFee | price }}</span>
          </div>
          <!-- 停车券时长 -->
          <div v-else-if="item.couponCategory === CouponType.PARKING_DURATION_COUPON" class="face-value">
            <span v-if="item.discountFee === 0">免停车费</span>
            <span v-else>{{ (item.discountFee * 60) | time2String }}</span>
          </div>
          <!-- 运费券 -->
          <div
            v-else-if="item.couponCategory === CouponType.LOGISTICS_COUPON"
            :class="item.discountFee === 0 ? 'face-value' : 'face-price'"
          >
            <span v-if="item.discountFee === 0">免运费</span>
            <span v-else>{{ item.discountFee | price }}</span>
          </div>
          <div class="face-value" v-else-if="item.couponCategory === CouponType.GIFT_COUPON">
            <span>{{ item.name }}</span>
          </div>
          <div v-else class="face-price">{{ item.discountFee | price }}</div>
          <div class="require-value" v-if="item.minimumFee">满{{ item.minimumFee | price }}元可用</div>
          <div class="require-value" v-else>无门槛</div>
        </div>
      </div>
      <!-- 无数据状态 -->
      <div class="no-data" v-else>
        <div>点击编辑优惠券</div>
      </div>
    </div>
  </div>
</template>

<script>
  import textNavModule from './textNavModule.vue';
  import service from '@/dss-wechat3rd/src/api/index';
  import utils from '@/dss-wechat3rd/src/decorate_components/utils/index';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields';
  import couponBg from '@/dss-wechat3rd/src/images/goods/coupon-bg.png';
  import { couponTypeMap, CouponType } from '@/dss-wechat3rd/src/constants/coupon';

  export default {
    data() {
      return {
        x: 10,
        couponBg: couponBg,
        CouponType,
      };
    },

    components: {
      textNavModule,
    },

    filters: {},

    props: {
      dataSource: {
        type: Object,
        default: function () {
          return null;
        },
      },
    },

    mounted() {
      this.getList();
    },

    methods: {
      getList() {
        const data = this.dataSource.data;
        if (data && data.length) {
          const itemNos = utils.pickUpItemNos(data, 'id');
          const ids = itemNos.join(',');
          service
            .itemNosForCouponsList({
              couponIds: ids,
              pageNo: 1,
              pageSize: itemNos.length,
            })
            .then(res => {
              // eslint-disable-next-line vue/no-mutating-props
              this.dataSource.data = utils.saveAvailableFields(res.data, fields.coupons);
            });
        }
      },
      calcProgress(item) {
        return parseInt((item.issueAmount * 100) / item.quantity);
      },
      getCouponTypeLabel(item) {
        return couponTypeMap[item.couponCategory];
      },
    },
  };
</script>

<style lang="less">
  .coupons-module {
    background-color: white;
    overflow: hidden;

    /*********** 零售视觉开始 ************/

    .retail-coupons-module-container {
      display: flex;
      padding-bottom: 8px;
      // height: 77px;

      .item {
        flex-shrink: 0;
        height: 75px;
        width: 120px;
        margin-right: 8px;
        border-radius: 3px;
        position: relative;
        z-index: 0;

        .coupon-bg {
          position: absolute;
          height: 100%;
          width: 100%;
          z-index: -1;
        }

        .coupon-type {
          position: absolute;
          top: 4px;
          left: 8px;
          line-height: 16px;
          font-size: 11px;
          color: #fff;
          font-weight: 400;
        }

        .face-value {
          margin-top: 26px;
          margin-left: 8px;
          line-height: 25px;
          font-size: 18px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .face-price {
          margin-top: 20px;
          margin-left: 8px;
          line-height: 31px;
          font-size: 24px;
          font-family: PingFangSC-Regular;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);

          &::before {
            content: '￥';
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
          }
        }

        .require-value {
          font-size: 10px;
          font-family: PingFangSC-Light;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 14px;
          margin-top: 4px;
          margin-left: 8px;
        }
      }
    }

    /*********** 零售视觉结束 ************/

    .no-data {
      width: 100%;
      height: 130px;
      background-color: #f1f4f9;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #303133;
    }
  }
</style>
