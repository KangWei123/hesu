<template>
  <classfiy-list :type="server"></classfiy-list>
</template>

<script>
import classfiyList from './classfiy-list.vue';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
export default {
  name: '',
  components: { classfiyList },
  data() {
    return { server: goodsTypeEnum.server.value };
  }
};
</script>
