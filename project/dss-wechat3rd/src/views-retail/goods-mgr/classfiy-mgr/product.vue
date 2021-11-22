<template>
  <classfiy-list :type="product"></classfiy-list>
</template>

<script>
import classfiyList from './classfiy-list.vue';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
export default {
  name: '',
  components: { classfiyList },
  data() {
    return { product: goodsTypeEnum.product.value };
  }
};
</script>
