<template>
  <div class="order">
    <!-- 搜索条件 -->
    <OrderFilter />
    <!-- 列表 -->
    <OrderList />
  </div>
</template>

<script>
  import './order.less';
  import OrderFilter from './components/order-filter.vue';
  import OrderList from './components/order-list.vue';
  import coffee from '../images/coffee.png';

  export default {
    name: 'Order',
    components: {
      OrderFilter,
      OrderList,
    },
    data() {
      return {
        coffee,
      };
    },

    methods: {},
  };
</script>
