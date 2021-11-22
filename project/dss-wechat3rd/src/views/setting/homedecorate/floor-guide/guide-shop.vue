<style lang="less">
  .category-goods1 {

    .shop-card {
      width: 33.33%;
      height: 100px;
      float: left;
      align-items: center;
      .img {
        margin: 0 auto;
        height: 65px;
        width: 65px;
        border-radius: 3px;
      }
      .title {
        text-align: center;
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
    <div class="shop-card"
       v-for="(item,index) in dataSource"
       :key="index"
    >
      <div class="img"
           :style="{background: 'transparent url(' +  item.logo + ') no-repeat center center / cover'}"></div>
      <div class="title">{{item.name}}</div>
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

