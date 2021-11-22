<template>
  <div>
    <tenant-module :data-source="dataSource" :type="goodsTypeEnum.merchant" />
  </div>
</template>

<script>
  import tenantModule from './tenantModule.vue';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';

  export default {
    props: {
      dataSource: {
        type: Object,
        default: function () {
          return null;
        },
      },
    },

    components: {
      tenantModule,
    },
    data() {
      return {
        goodsTypeEnum: goodsTypeEnum,
      };
    },
  };
</script>
