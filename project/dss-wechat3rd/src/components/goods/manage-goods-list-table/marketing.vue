<template>
  <span class="ellipsis" :title="activityList(row)">{{ activityList(row) }}</span>
</template>

<script>
export default {
  props: ['row', 'col'],
  computed: {
    activityList() {
      return function(item) {
        const preSellText = item.preSell ? '预售,' : '';
        const groupText = item.pt ? '拼团,' : '';
        const cutPriceText = item.bargain ? '砍价,' : '';
        const seckillText = item.seckill ? '秒杀,' : '';
        const integralItemText = item.integralItem ? '积分商品,' : '';
        if (preSellText || groupText || cutPriceText || seckillText || integralItemText) {
          const activityText = preSellText + groupText + cutPriceText + seckillText + integralItemText;
          return activityText.slice(0, activityText.length - 1);
        } else {
          return '无';
        }
      };
    }
  }
};
</script>
