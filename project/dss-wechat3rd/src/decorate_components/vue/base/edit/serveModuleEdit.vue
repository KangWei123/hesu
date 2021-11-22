<template>
  <goods-module-edit :dataSource="dataSource" :type="type"></goods-module-edit>
</template>
<script>
import goodsModuleEdit from './goodsModuleEdit.vue';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
export default {
  name: 'serveModuleEdit',
  components: {
    goodsModuleEdit
  },
  props: {
    dataSource: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      type: goodsTypeEnum.server
    };
  }
};
</script>

