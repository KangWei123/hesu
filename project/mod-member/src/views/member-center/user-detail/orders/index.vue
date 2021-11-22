<template>
  <div class="growth">
    <div class="filters">
      <el-form ref="query" :model="form" inline @submit.native.prevent="$refs.table.search()" :disabled="!ready">
        <el-form-item label="应用">
          <app-select v-model="form.appId" placeholder="请选择" auto-select-first @change="handleReady"></app-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="itemName">
          <el-input placeholder="请输入商品名称" v-model="form.itemName"></el-input>
        </el-form-item>
        <el-form-item label="订单号" prop="orderNo">
          <el-input placeholder="请输入订单号" v-model="form.orderNo"></el-input>
        </el-form-item>

        <el-form-item label="下单时间" prop="dateRange">
          <date-range-picker v-model="form.dateRange" type="daterange" value-format="yyyy-MM-dd"></date-range-picker>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <fat-table ref="table" :state="form" :fetch-handler="handleFetch" :fetch-on-mounted="false">
        <el-table-column label="商品名称" v-slot="{ row: item }" width="350px">
          <div
            class="goods-info"
            :class="item.itemList && item.itemList.length > 1 ? 'border-right' : ''"
            v-for="(item2, index2) in item.itemList"
            :key="index2"
          >
            <!-- 卡券 -->
            <div
              class="card-type"
              v-if="item.itemType === cardEnum.cardType.timesCard || item.itemType === cardEnum.cardType.chargeCard"
              :class="{
                'recharge-card': item.itemType === cardEnum.cardType.chargeCard && !item2.thumbnail,
                'times-card': item.itemType === cardEnum.cardType.timesCard && !item2.thumbnail,
              }"
              :style="item2.thumbnail | bgImage"
            ></div>
            <!-- 非卡券 -->
            <div
              v-else
              :style="!!item2.thumbnail ? 'background: url(' + item2.thumbnail + ') no-repeat;' : ''"
              class="icon"
            ></div>

            <div class="info">
              <!-- 促销活动名称 -->
              <div v-if="item2.activityName" class="name item-name">活动名称：{{ item2.activityName }}</div>
              <div v-else-if="item.marketingName" class="name item-name">活动名称：{{ item.marketingName }}</div>
              <div class="name item-name">商品名称：{{ item2.itemName }}</div>
              <div class="attribute" v-if="item2.itemAttribute">{{ item2.itemAttribute }}</div>
              <div class="price-info">
                <div v-if="item.marketingPrice" class="price">秒杀价：￥{{ (item.marketingPrice || 0) | price }}</div>

                <template v-else>
                  <span class="price">￥{{ (item2.salePrice || 0) | price }}</span>
                  <span class="number" v-if="item2.giftAmount"
                    >赠送金额：
                    <span class="price">￥{{ (item2.giftAmount || 0) | price }}</span>
                  </span>
                  <!-- 叁拾加线下订单如果有重量显示重量，赠品不显示重量 -->
                  <span
                    class="number"
                    v-if="item2.itemWeight && item.itemType !== orderStatusEnum.ORDER_TYPE.GIFT.value"
                    >{{ item2.itemWeight }}{{ item2.itemUnit }}</span
                  >
                  <span class="number" v-else>数量：{{ item2.itemCount }}</span>
                  <span
                    class="number"
                    v-if="item2.itemWeight && item.itemType !== orderStatusEnum.ORDER_TYPE.GIFT.value"
                    >￥小计：
                    <span class="price">{{ (item2.payFee || 0) | price }}</span>
                  </span>
                </template>
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="订单号" v-slot="{ row: item }">
          {{ item.orderNo }}
        </el-table-column>
        <el-table-column label="订单金额" v-slot="{ row: item }">
          <span class="important">￥{{ item.payFee | price }}</span>
        </el-table-column>
        <el-table-column label="订单状态" v-slot="{ row: item }">
          <!--正常订单 状态描述信息是orderStatusDesc-->
          <div v-if="item.orderStatusDesc">
            <span class="span span-color">{{ showOrderDesc(item) }}</span>
          </div>
          <!--退款订单, 状态描述信息是statusDesc-->
          <div v-if="item.statusDesc">
            <span class="span">{{ item.statusDesc }}</span>
          </div>
          <div v-if="item.actuallyGoodStatus">
            <span class="span">{{ item.actuallyGoodStatus }}</span>
          </div>
          <div v-if="item.refundType">
            <span class="span important">{{ computeRefundType(item.refundType) }}</span>
          </div>
        </el-table-column>
        <el-table-column label="下单时间" v-slot="{ row: item }">
          {{ item.requestTime || item.orderTime }}
        </el-table-column>
        <el-table-column label="收货地址" v-slot="{ row: item }">
          <template v-if="item.expressType === 0 && (item.tag3 & 4) !== 4">
            <span class="address">自提门店：{{ item.storeAddress ? item.storeAddress : '-' }}</span>
          </template>
          <template v-else-if="item.expressType === 1">
            <span class="receive">收件人：{{ item.consignee ? item.consignee : '-' }}</span>
            <span class="tel">电话：{{ item.consigneeMobile ? item.consigneeMobile : '-' }}</span>
            <span class="address">地址：{{ item.detailAddress ? item.detailAddress : '-' }}</span>
          </template>
        </el-table-column>
      </fat-table>
    </div>
  </div>
</template>

<script>
  import { FatTable } from '@/dss-common/components/list-page/index';
  import AppSelect from '@/business-common/components/app-select';
  import DateRangePicker from '@/dss-common/components/date-range-picker';
  import { goodsTypeEnum, orderStatusEnum, cardEnum } from '@/mod-member/ref';
  import api from '@/mod-member/src/api/memberAPI';

  export default {
    name: 'Orders',
    components: {
      AppSelect,
      FatTable,
      DateRangePicker,
    },
    props: {
      info: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        ready: false,
        orderStatusEnum,
        cardEnum,
        form: {
          appId: null,
          itemName: null,
          orderNo: null,
          dateRange: null,
        },
      };
    },
    methods: {
      handleReady() {
        const ready = this.ready;
        this.ready = true;
        if (!ready) {
          this.$refs.table.search();
        }
      },
      // 退款类型
      computeRefundType(type) {
        switch (type) {
          case orderStatusEnum.refund_type.refund_item_and_money:
            return '退款退货';
          case orderStatusEnum.refund_type.refund_money:
            return '仅退款';
          default:
            return '';
        }
      },

      showOrderDesc(item) {
        if (item.orderStatusDesc === '待人工审核') {
          return '待审核';
        }
        if (item.orderStatusDesc === '待医院审核') {
          return '医院审核中';
        }
        if (
          item.itemType === goodsTypeEnum.estate.value &&
          item.orderStatus === orderStatusEnum.ORDER.STATUS.WAIT_SUBSCRIBED.value
        ) {
          return orderStatusEnum.ORDER.STATUS.WAIT_SUBSCRIBED.label;
        }

        return item.orderStatusDesc;
      },
      async handleFetch(params) {
        const { dateRange, ...other } = this.form;
        if (dateRange) {
          const [startDate, endDate] = dateRange;
          Object.assign(other, { startDate, endDate });
        }

        // 分页信息
        const { pagination } = params;
        // 请求参数
        const payload = {
          ...other,
          userId: this.info.id,

          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };

        const { data, totalCount } = await api.memberCenter.getOrderList(payload);

        return {
          list: data,
          total: totalCount,
        };
      },
    },
  };
</script>
<style lang="less" scoped>
  .filters {
    padding: 20px;
  }
  .table {
    padding-bottom: 20px;
  }

  .goods-info:first-child {
    border-top: none;
  }

  .goods-info {
    height: 62px;
    text-align: left;
    padding: 20px;
    // border-top: 1px solid #eceeef;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: content-box;

    .card-type {
      width: 62px;
      height: 35px;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      margin-right: 20px;
    }

    .recharge-card {
      background-image: url(./recharge-bg.png);
    }

    .times-card {
      background-image: url(./times-card.png);
    }

    .icon {
      background-size: 100% 100% !important;
      width: 65px;
      height: 65px;
      margin-right: 20px;
    }

    .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .item-name {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .attribute {
      color: rgba(153, 153, 153, 1);
    }

    .price {
      color: rgba(255, 86, 45, 1);
      font-weight: bold;
    }

    .number {
      margin-left: 25px;
    }
  }
</style>
