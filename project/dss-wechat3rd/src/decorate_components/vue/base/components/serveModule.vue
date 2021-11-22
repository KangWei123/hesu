<template>
<div>
  <goods-module :dataSource="dataSource" :type="goodsTypeEnum.server"></goods-module>
</div>
</template>

<script>
import goodsModule from './goodsModule.vue';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
export default {
  props: {
    dataSource: {
      type: Object,
      default: function() {
        return null;
      }
    }
  },

  components: {
    goodsModule
  },

  data() {
    return {
      goodsTypeEnum: goodsTypeEnum
    };
  }
};
</script>
