<template>
  <div class="shopping-cart">
    <div class="title">
      <span>已选商品（{{ goods.length }}）</span>
      <span class="el-icon-delete delete" @click="empty"> 清空</span>
    </div>
    <div class="content-box">
      <div v-if="goods.length">
        <div class="item" v-for="(item, index) in goods" :key="item.id">
          <img :src="coffee" alt="" class="item-img" />
          <div class="center">
            <p class="title">{{ item.title }}</p>
            <div class="bottom">
              <span class="price">¥ {{ item.price }}</span>
              <span class="add"></span>
            </div>
          </div>
          <div class="rigth">
            <div class="reduce" @click="reduce(item, index)">-</div>
            <div class="number">{{ item.number }}</div>
            <div class="add" @click="add(item, index)">+</div>
          </div>
        </div>
        <div class="statistics">
          <span class="total">合计：¥ </span>
          <span class="price"> {{ totalPrice }} </span>
        </div>
      </div>
      <div v-else class="clear">
        <img src="../images/clear.png" alt="" />
      </div>
    </div>
    <div class="settlement">
      <span class="card"></span>
      <span class="total">
        <span>结算金额：</span>
        <span class="color">¥ </span>
        <span class="price color"> 2000</span>
      </span>
      <div class="btn">确认结算</div>
    </div>
  </div>
</template>

<script>
  import './shopping-cart.less';
  import coffee from '../images/coffee.png';

  export default {
    props: {
      goods: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        coffee,
      };
    },
    computed: {
      // 计算属性的 getter
      totalPrice: function () {
        // `this` 指向 vm 实例
        let price = 0;
        this.goods.forEach(item => {
          price += +item.price * +item.number;
        });
        return price;
      },
    },
    methods: {
      // 清空购物车
      empty() {
        this.$emit('done', []);
      },
      // -
      reduce(item, index) {
        if (item.number === 1) {
          this.$emit('done', index);
        } else {
          item.number--;
        }
      },
      // +
      add(item, index) {
        item.number++;
      },
    },
  };
</script>
