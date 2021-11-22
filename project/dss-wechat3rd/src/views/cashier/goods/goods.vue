<template>
  <div class="goods">
    <div class="content">
      <div class="item" v-for="(item, index) in tableList" :key="item.id">
        <img :src="coffee" alt="" class="item-img" />
        <p class="title">{{ item.title }}</p>
        <div class="bottom">
          <span class="price">¥ {{ item.price }}</span>
          <span class="add" @click="addShoppingCart(item, index)"></span>
        </div>
      </div>
    </div>
    <!-- 购物车信息  -->
    <ShoppingCart :goods="goods" @done="done" />
  </div>
</template>

<script>
  import ShoppingCart from '../shopping-cart/shopping-cart.vue';
  import './goods.less';
  import coffee from '../images/coffee.png';

  export default {
    components: {
      ShoppingCart,
    },
    data() {
      return {
        coffee,
        tableList: [
          {
            title: '香煎鸡肉藜麦饭',
            price: 128,
            id: '123',
            number: 1,
          },
          {
            title: '香煎鸡肉藜麦饭',
            price: 1288,
            id: '456',
            number: 1,
          },
          {
            title: '香煎鸡肉藜麦饭',
            price: 188,
            id: '789',
            number: 1,
          },
          {
            title: '香煎鸡肉藜麦饭',
            price: 288,
            id: '012',
            number: 1,
          },
          {
            title: '香煎鸡肉藜麦饭',
            price: 1208,
            id: '234',
            number: 1,
          },
          {
            title: '香煎鸡肉藜麦饭',
            price: 2188,
            id: '345',
            number: 1,
          },
          {
            title: '香煎鸡肉藜麦饭',
            price: 1238,
            id: '457',
            number: 1,
          },
          {
            title: '香煎鸡肉藜麦饭',
            price: 2188,
            id: '567',
            number: 1,
          },
          {
            title: '香煎鸡肉藜麦饭',
            price: 1238,
            id: '678',
            number: 1,
          },
          {
            title: '香煎鸡肉藜麦饭',
            price: 2188,
            id: '780',
            number: 1,
          },
          {
            title: '香煎鸡肉藜麦饭',
            price: 1238,
            id: '781',
            number: 1,
          },
        ],
        goods: [],
      };
    },

    methods: {
      // 添加购物车
      addShoppingCart(item) {
        if (!this.goods.length) {
          this.goods.push(item);
        }
        const finditem = this.goods.find(items => items.id === item.id);
        if (!finditem) {
          this.goods.push(item);
        }
      },
      // 组件通信
      done(data) {
        if (data instanceof Array) {
          // 清空购物车
          this.goods = [];
        } else {
          this.goods.splice(data, 1);
        }
      },
    },
  };
</script>
