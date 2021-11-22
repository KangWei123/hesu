<template>
  <mange-goods-list-table
    ref="list"
    :goods-type="goodsType"
    :ext-params="extParams"
    :show-barcode="false"
    :show-patch-shelf="false"
    :handler-config="{ edit: true, shelf: false, link: true, qrCode: true, del: true }"
    qr-code-path="wxat-common/pages/goods-detail/index"
    add-product-path="/estate/goods-mgr/building/list/add"
    manage-label-path="/estate/goods-mgr/building/list/label-manage"
    :slot-handler="layoutBtn"
  />
</template>

<script>
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';

import MangeGoodsListTable from '@/dss-wechat3rd/src/components/goods/manage-goods-list-table/index.vue';

import layoutBtn from './layout-btn.vue';
import { mapState } from 'vuex';

export default {
  name: 'index',

  components: {
    MangeGoodsListTable
  },

  data() {
    return {
      goodsType: goodsTypeEnum.estate,
      layoutBtn
    };
  },

  computed: {
    ...mapState({
      curStore: 'curStore'
    }),
    extParams() {
      if (this.curStore && this.curStore.id) {
        return {
          storeId: this.curStore.id
        };
      } else {
        return {};
      }
    }
  },

  // 钩子函数执行子组件列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.list.listGoodsByType(); // 根据商品类型获取商品列表
    });
  }
};
</script>

<style scoped></style>
