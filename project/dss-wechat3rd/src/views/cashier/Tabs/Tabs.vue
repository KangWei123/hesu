<template>
  <div class="Tabs">
    <p class="content" v-for="(item, index) in tableList" :key="index" @click="select(item, index)">
      <span :class="item.isCheck ? 'border-bottom select' : 'unchecked'"> {{ item.title }} </span>
    </p>
  </div>
</template>

<script>
  import './Tabs.less';

  export default {
    name: 'Tabs',
    data() {
      return {
        tableList: [
          {
            title: '增肌减脂',
            name: 'Goods',
            isCheck: true,
          },
          {
            title: '订单管理',
            name: 'Order',
            isCheck: false,
          },
        ],
      };
    },
    methods: {
      select(item, index) {
        this.tableList.forEach(items => {
          items.isCheck = false;
        });
        this.tableList[index].isCheck = true;
        this.$emit('select', item);
      },
    },
  };
</script>
