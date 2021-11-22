<template>
  <div class="order-broker-detail-container" v-loading="loading" v-if="valetOrderNo">
    <div class="order-info">
      <div class="order-info-label">
        <span>{{ orderDetail ? orderDetail.orderStatusDesc : '-' }}</span>
      </div>
      <div class="order-info-label">代客订单编号: {{ orderDetail ? orderDetail.valetOrderNoStr : '-' }}</div>
      <div class="order-info-label">订单号: {{ orderDetail && orderDetail.orderNoStr ? orderDetail.orderNoStr : '-' }}</div>
      <div class="order-info-label">下单时间: {{ computeOrderTime(orderDetail ? orderDetail.createTime : null) }}</div>
      <div class="order-info-label" v-if="orderDetail && orderDetail.shippingTime">
        发货时间: {{ computeOrderTime(orderDetail ? orderDetail.shippingTime : null) }}
      </div>
      <div class="order-info-label" v-if="orderDetail && orderDetail.completeTime">
        完成时间: {{ computeOrderTime(orderDetail ? orderDetail.completeTime : null) }}
      </div>
      <div class="order-info-label">商家备注: {{ (orderDetail && orderDetail.guideComment) || '-' }}</div>
      <span v-if="orderDetail && orderDetail.paymentMethod"> 收货地址: {{ (orderDetail && (`${orderDetail.province || ''}${orderDetail.city || ''}${orderDetail.district || ''}${orderDetail.userAddress || ''}`)) || '--' }} </span>
      <span v-if="orderDetail && !orderDetail.paymentMethod"> 自提门店: {{(orderDetail && orderDetail.storeAddress) || '--'}} </span>
    </div>

    <div class="order-content">
      <!-- 会员信息 -->
      <div class="member-info">
        <div class="order-content-title">会员信息</div>
        <div class="member-content">
          <img
            style="margin-right: 18px"
            v-if="orderDetail && orderDetail.userAvatar"
            :src="orderDetail && orderDetail.userAvatar"
            class="icon"
          />
          <span style="margin-right: 60px"> 会员姓名: {{ (orderDetail && orderDetail.userName) || '-' }} </span>
          <span style="margin-right: 60px"> 联系电话: {{ (orderDetail && orderDetail.userPhone) || '-' }} </span>
          <span style="margin-right: 60px"> 订单归属导购: {{ (orderDetail && orderDetail.guideName) || '-' }} </span>
          <span :style="{'margin-right': (orderDetail && orderDetail.paymentMethod) ? '60px' : '0'}"> 下单导购: {{ (orderDetail && orderDetail.createdByName) || '--' }} </span>
        </div>
      </div>

      <!-- 商品信息 -->
      <div class="goods-info" v-if="orderDetail && orderDetail.valetItemList">
        <div class="order-content-title">商品信息</div>
        <div class="goods-info-content" v-for="(item, index) in orderDetail.valetItemList" :key="index">
          <div class="desc goods-info-desc">
            <img class="goods-image" v-if="item.thumbnail" :src="item.thumbnail" />
            <div class="goods-info-desc-content">
              <span>产品：{{ item.itemName }}</span>
              <span v-if="item.itemAttribute">{{ item.itemAttribute }}</span>
              <span>
                单价：￥{{ item.salePrice | price }}
                <span style="margin-left: 25px;display: inline-block;" v-if="item.giftAmount">
                  赠送金额：￥{{ item.giftAmount | price }}
                </span>
              </span>
            </div>
          </div>
          <div class="money out-box">
            <div class="inner-box">
              <span>数量: {{ item.itemCount }}</span>
              <span>小计: ￥{{ item.actualFee | price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '@/dss-common/utils';
import orderApi from '@/dss-wechat3rd/src/api/order';

export default {
  data() {
    return {
      valetOrderNo: this.$route.query.valetOrderNo,

      loading: false,

      orderDetail: null // 订单详情
    };
  },

  mounted() {
    this.getOrderDetail(); //获取订单详情
  },
  filters: {
    getData(val, count) {
      let dd = new Date();
      if (val) {
        dd = new Date(val);
      }
      dd.setDate(dd.getDate() + count);
      let y = dd.getFullYear();
      let m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1; //获取当前月份的日期，不足10补0
      let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
      return y + '-' + m + '-' + d;
    },
    // 处方药审核
    filterDrugApprove(status = 0) {
      // 0：待开方 1：医院审核完成，待人工审核 2：处方订单完成 3：医院开放拒绝或者人工拒绝 4: 商家拒绝
      let statusObj = {
        0: '待开方',
        1: '已开方',
        2: '已开方',
        3: '拒绝开方',
        4: '已开方'
      };
      return statusObj[status];
    }
  },

  methods: {
    //获取订单详情
    getOrderDetail() {
      this.loading = true;
      orderApi
        .getValetOrderDetail({ valetOrderNo: this.valetOrderNo })
        .then(res => {
          this.orderDetail = res.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },

    // 计算订单时间
    computeOrderTime(time) {
      if (time) {
        return utils.timeFormat(new Date(time));
      }
      return '-';
    }
  }
};
</script>

<style lang="less" scoped src="./index.less" />
