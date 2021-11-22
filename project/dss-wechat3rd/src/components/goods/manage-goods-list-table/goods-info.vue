<template>
  <div class="goods-desc-box">
    <div class="goods-img"><img :src="row.thumbnail" /></div>
    <div class="goods-desc">
      <div>{{ row.name }}</div>
      <div class="price" v-if="goodsType.type === goodsTypeEnum.estate.type">
        均价：￥{{ row.averagePrice | price }}/m<sup>2</sup>
      </div>
      <div class="price" v-if="goodsType.type === goodsTypeEnum.estate.type">
        认筹金：￥{{ row.recognitionOfGold | price }}
      </div>
      <div class="price" v-if="goodsType.type !== goodsTypeEnum.estate.type">￥{{ row.salePrice | price }}</div>
    </div>
  </div>
</template>

<script>
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';

const MoneyUnit = '￥';
export default {
  props: ['row', 'col'],
  data() {
    return {
      goodsTypeEnum,
      goodsType: this.col.goodsType
    };
  },
  mounted() {},
  filters: {
    toPageUnit(val) {
      let money = val;
      return money ? MoneyUnit + money : '免费';
    }
  }
};
</script>
