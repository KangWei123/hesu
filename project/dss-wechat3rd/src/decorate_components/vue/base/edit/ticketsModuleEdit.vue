<template>
  <rooms-edit :dataSource="dataSource"
              :type="type"></rooms-edit>
</template>
<script>
import roomsEdit from './roomsEdit.vue';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
export default {
  name: 'productModuleEdit',
  components: {
    roomsEdit
  },
  props: {
    dataSource: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      type: goodsTypeEnum.ticket
    };
  }
};
</script>
