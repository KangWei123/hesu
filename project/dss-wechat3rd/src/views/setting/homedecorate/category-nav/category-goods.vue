<style lang="less">
.category-goods1 {
  .goods-container {
    padding: 15px 0;
    box-sizing: border-box;
    .img {
      float: left;
      height: 85px;
      width: 85px;
      border-radius: 3px;
    }
    .content {
      float: right;
      width: calc(100% - 95px);
      position: relative;
      height: 85px;
      .title {
        height:20px;
        font-size:14px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(55,58,68,1);
        line-height:20px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
      }

      .sale-count {
        height:15px;
        font-size:11px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(163,163,163,1);
        line-height:15px;
      }

      .footer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 34px;

        .price {
          float: left;
          max-width: 90px;
          overflow: hidden;

          .real {
            height:22px;
            font-size:18px;
            font-family:DIN-Medium;
            font-weight:500;
            color:rgba(255,62,41,1);
            line-height:22px;
            &:before {
              content: '￥';
              font-size:12px;
              font-family:PingFangSC-Medium;
              font-weight:500;
              color:rgba(255,62,41,1);
              }
          }
          .origin {
            height:16px;
            font-size:12px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(163,163,163,1);
            line-height:16px;
            text-decoration: line-through;
          }
        }

        .join-cart {
          float: right;
          height:22px;
          line-height: 22px;
          background:rgba(255,129,59,1);
          border-radius:22px;
          padding: 0 10px;
          font-family:PingFangSC-Semibold;
          font-weight:600;
          color:rgba(255,255,255,1);
          font-size: 12px;
        }
      }
    }
  }

  .clearfix:after {
    content: " ";
    display: block;
    clear: both;
    height: 0;
  }
　.clearfix {
    zoom: 1;
  }
}
</style>

<template>
  <div class='category-goods1'>
    <div class="goods-container clearfix"
         v-for="(item,index) in dataSource"
         :style="{'border-top': index === 0 ? '1px solid transparent' : '1px solid rgba(241,241,241,1)'}"
         :key="index">
      <div class="img"
           :style="{background: 'transparent url(' +  item.thumbnail + ') no-repeat center center / cover'}"></div>
      <div class="content">
        <div class="title">{{item.name}}</div>
        <div class="sale-count">{{item.virtualSalesVolume}}人已购买</div>
        <div class="footer">
          <div class="price">
            <div class="real">{{item.salePrice/ 100}}</div>
            <div class="origin">￥{{item.labelPrice/ 100}}</div>
          </div>
          <div class="join-cart">+购物车</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'categoryGoods',
  props: {
    dataSource: {
      type: Array,
      default: null
    }
  }
};
</script>

