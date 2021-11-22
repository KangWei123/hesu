<style lang="less">
.category-goods {
  // overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  // padding: 0 10px;
  .goods-container {
    width: calc(50% - 3px);
    border: 1px solid rgba(229, 233, 243, 0.5);
    box-sizing: border-box;
    margin-bottom: 6px;
    background: rgba(255, 255, 255, 1);
    border-radius: 2px;
    overflow: hidden;
    .img {
      width: 100%;
      height: 100px;
    }
    .title {
      font-size: 12px;
      font-weight: 400;
      color: rgba(55, 58, 68, 1);
      width: 100%;
      box-sizing: border-box;
      padding: 5px 5px 12px;
      height: 50px;
      margin: 0px;
    }

    .footer {
      padding: 0px 5px 5px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .price {
        font-size: 16px;
        font-weight: 600;
        color: rgba(240, 85, 108, 1);
        line-height: 19px;
        overflow: hidden;
        width: 100px;
        height: 18px;
        .unit {
          font-size: 10px;
          display: inline-block;
        }
      }

      .sale-count {
        font-size: 10px;
        font-family: PingFangSC-Regular;
        font-weight: 300;
        color: rgba(162, 162, 164, 1);
        overflow: hidden;
        flex-shrink: 0;
      }
    }
  }
}
</style>

<template>
  <div class='category-goods'>
    <div class="goods-container"
         v-for="(item,index) in dataSource"
         :key="index">
      <div class="img"
           :style="{background: 'transparent url(' +  item.thumbnail + ') no-repeat center center / cover'}"></div>
      <div class="title">{{item.name}}</div>
      <div class="footer">
        <div class="price">
          <div class='unit'>￥</div>{{item.salePrice/ 100}}
        </div>
        <div class="sale-count">{{item.itemSalesVolume}}人已购买</div>
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

