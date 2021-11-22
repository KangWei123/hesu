<template>
  <div class="coupon-module-edit">
    <edit-header :data-source="dataSource" name="优惠券"></edit-header>

    <div class="com-body">
      <size :data-source="dataSource"></size>
      <commonEdit
        :data-source="dataSource"
        :type="type"
        :enable-edit-nav="false"
        nav-text="更多优惠券"
        :filter-list="filterList"
        :show-label="showLabel"
        :nav-page="linkedPages.page.COUPON_CENTER_PAGE"
        @chooseList="onChooseGoods"
      ></commonEdit>
      <!-- 零售 -->
      <div class="retail-coupons-module-edit-container">
        <div class="retail-item" v-for="(item, index) in dataSource.data" :key="index" :draggable="true">
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
          <!-- 礼品券 -->
          <div class="face-value" v-else-if="item.couponCategory === CouponType.GIFT_COUPON">
            <span>{{ item.name }}</span>
          </div>
          <div v-else class="face-price">{{ item.discountFee | price }}</div>
          <div class="require-value" v-if="item.minimumFee">满{{ item.minimumFee | price }}元可用</div>
          <div class="require-value" v-else>无门槛</div>
          <div class="com-close" @click="deteleImage(item)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import './css/common.less';
  import linkedPages from '@/dss-wechat3rd/src/constants/wxLinkPages';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import utils from '@/dss-wechat3rd/src/decorate_components/utils';
  import commonEdit from './commonEdit.vue';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields';
  import size from './size.vue';
  import couponBg from '@/dss-wechat3rd/src/images/goods/coupon-bg.png';
  import drag from './drag';
  import { couponTypeMap, CouponType } from '@/dss-wechat3rd/src/constants/coupon';
  import EditHeader from './edit-header.vue';

  export default {
    name: 'CouponsModuleEdit',
    components: {
      commonEdit,
      size,
      EditHeader,
    },
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        couponBg,
        linkedPages,
        type: goodsTypeEnum.coupon,
        CouponType,
        showLabel: false,
        filterList: [
          // {
          //   type: 'select', //选择器类型
          //   paramName: 'activityLevel',
          //   label: '活动类型',
          //   selectOptions: [
          //     //选择项
          //     { label: '品牌活动', value: 1 },
          //     { label: '门店活动', value: 10 }
          //   ]
          // },
          {
            type: 'select-store', // 选择器类型
            paramName: 'storeIds',
            label: '活动门店：',
            showFormLabel: true,
          },
          {
            type: 'input', // 选择器类型
            paramName: 'name',
            label: '按优惠券名称',
          },
        ],
      };
    },

    computed: {
      computeDataList() {
        return this.dataSource.data && this.dataSource.data.length ? this.dataSource.data : this.dataSource.exampleData;
      },
    },

    watch: {
      'dataSource.data': {
        deep: true,
        handler(newVal, oldVal) {
          console.log('newVal--->', newVal);
          drag.list = this.computeDataList;
        },
      },
    },

    mounted() {
      // 绑定拖拽容器，绑定拖拽事件
      const node = document.querySelector('.retail-coupons-module-edit-container');
      node.ondragstart = drag.ondragstart;
      node.ondragover = drag.ondragover;
      drag.list = this.computeDataList;
      drag.nodeClassName = 'retail-item';
      drag.nodeChildName = 'coupon-bg';
    },

    methods: {
      onChooseGoods(choosedGoodsList) {
        // 删除不需要的字段
        // eslint-disable-next-line vue/no-mutating-props
        this.dataSource.data = utils.saveAvailableFields(choosedGoodsList, fields.coupons);
      },

      deteleImage(item) {
        utils.deteleItem(this.dataSource.data, item);
      },
      getCouponTypeLabel(item) {
        return couponTypeMap[item.couponCategory];
      },
    },
  };
</script>

<style lang="less">
  .coupon-module-edit {
    .retail-coupons-module-edit-container {
      display: flex;
      justify-content: flex-start;
      padding-left: 75px;
      margin-top: 10px;
      flex-wrap: wrap;

      .retail-item {
        flex-shrink: 0;
        height: 75px;
        width: 120px;
        margin-bottom: 10px;
        border-radius: 3px;
        position: relative;
        overflow: hidden;
        z-index: 0;
        margin-right: 4px;

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

        .com-close {
          width: 16px;
          height: 16px;
          background: transparent url(../../../../images/close.png) no-repeat 0 0;
          background-size: cover;
          cursor: pointer;
          position: absolute;
          right: 0;
          top: 0;
          z-index: 99;
        }
      }
    }
  }
</style>
