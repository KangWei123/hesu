<template>
  <div class="sidebar">
    <p
      :class="item.isCheck ? 'content border-left' : 'content'"
      v-for="(item, index) in tableList"
      :key="index"
      @click="select(index)"
    >
      <img :src="item.isCheck ? item.checkSrc : item.unchecked" class="product" />
      <span :class="item.isCheck ? 'select' : 'unchecked'"> {{ item.title }} </span>
    </p>
  </div>
</template>

<script>
  import './sidebar.less';
  import product from '../images/product.png';
  import product_ from '../images/product_.png';
  import mine from '../images/mine.png';
  import mine_ from '../images/mine_.png';

  export default {
    data() {
      return {
        product,
        product_,
        mine,
        mine_,
        tableList: [
          {
            title: '增肌减脂',
            checkSrc: product,
            unchecked: product_,
            isCheck: true,
          },
          {
            title: '轻食沙拉',
            checkSrc: mine,
            unchecked: mine_,
            isCheck: false,
          },
          {
            title: '鲜蔬简餐',
            checkSrc: mine,
            unchecked: mine_,
            isCheck: false,
          },
          {
            title: '零糖零卡',
            checkSrc: mine,
            unchecked: mine_,
            isCheck: false,
          },
          {
            title: '海鲜意面',
            checkSrc: mine,
            unchecked: mine_,
            isCheck: false,
          },
          {
            title: '意式咖啡',
            checkSrc: mine_,
            unchecked: mine_,
            isCheck: false,
          },
        ],
      };
    },

    methods: {
      select(index) {
        this.tableList.forEach(items => {
          items.isCheck = false;
        });
        this.tableList[index].isCheck = true;
      },
    },
  };
</script>
