<template>
  <div class="order-list">
    <p class="title">订单列表</p>
    <div class="content">
      <div class="base">
        <div class="time ml-time">下单时间：2021-11-16 11:11:11</div>
        <div class="no ml-no">流水单号：212345678902239</div>
        <div class="member ml-member">会员：张三</div>
        <div class="print ml-print">打印小票</div>
        <div class="refund ml-refund">退款</div>
      </div>
      <div class="detail">
        <div class="item">
          <img src="../../images/dog.png" class="pic" />
          <div class="info">
            <p class="name">香煎鸡肉藜麦饭</p>
            <div>
              <span class="price">￥999</span>
              <span class="number">数量：1</span>
            </div>
          </div>
          <div class="mode">
            <div class="heshu">和素币：-￥40.00</div>
            <div class="discount">优惠券：￥959.00</div>
            <div class="have">用餐方式：堂食</div>
          </div>
          <div class="money">实付金额：￥40.00</div>
          <div class="status">已付款</div>
        </div>
      </div>
    </div>

    <div class="content">
      <div class="base">
        <div class="time ml-time">下单时间：2021-11-16 11:11:11</div>
        <div class="no ml-no">流水单号：212345678902239</div>
        <div class="member ml-member">会员：张三</div>
        <div class="print ml-print">打印小票</div>
        <div class="refund ml-refund">退款</div>
      </div>
      <div class="detail">
        <div class="item">
          <img src="../../images/dog.png" class="pic" />
          <div class="info">
            <p class="name">香煎鸡肉藜麦饭</p>
            <div>
              <span class="price">￥999</span>
              <span class="number">数量：1</span>
            </div>
          </div>
          <div class="mode">
            <div class="heshu">和素币：-￥40.00</div>
            <div class="discount">优惠券：￥959.00</div>
            <div class="have">用餐方式：堂食</div>
          </div>
          <div class="money">
            <div class="total">实付金额：￥40.00</div>
          </div>
          <div class="status">已付款</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import './order-list.less';
  import orderStatusEnum from '@/dss-wechat3rd/src/constants/orderStatusEnum';

  export default {
    components: {},
    // 接收过滤之后的列表进行页面渲染
    props: {
      filterlist: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data() {
      return {
        orderStatusEnum,
      };
    },

    methods: {
      // 跳转订单详情页面
      handleShowDetail(item) {
        const PATH = this.BBC_ORDER_TYPE[this.orderMode];
        this.$router.push({
          path: `/order/list/${PATH.detailPath}`,
          query: {
            orderNo: item.orderNo + '',
            orderMode: this.orderMode,
            path: PATH.path,
            isExtraBed: this.isExtraBed,
          },
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
  .no-data-div {
    display: flex;
    justify-content: center;
    padding-top: 200px;
    color: #909399;
  }
</style>
