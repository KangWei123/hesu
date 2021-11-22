<template>
  <shelf-goods-list-table ref="list"
                          v-model="goodsList"
                          :goods-type="goodsType"
                          :goodsShow="goodsShow"
                          :goodsShelf="goodsShelf"
                          :goodsPrice="goodsPrice"
                          :goodEdit="goodEdit"/>
</template>

<script>
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';

import ShelfGoodsListTable from '@/dss-wechat3rd/src/components/goods/ShelfGoodsListTable';
import scopeMenuEnum from '@/business-common/scopeMenuEnum.js';
import { mapState } from 'vuex';
export default {
  name: 'index',

  components: {
    ShelfGoodsListTable
  },

  data() {
    return {
      goodsType: goodsTypeEnum.card,
      goodsList: null,
      goodsShow: true,
      goodsShelf: true,
      goodsPrice: true,
      goodEdit: true
    };
  },
  computed: {
    ...mapState({
      curStore: state => state.curStore,
      wkbScopeMenu: 'wkbScopeMenu',
      roleList: 'roleList'
    })
  },
  watch: {
    wkbScopeMenu: {
      immediate: true,
      handler() {
        this.queryUserPower();
      }
    }
  },
  // 钩子函数执行子组件列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.list.listStoreItemsByType(); // 根据商品类型获取门店下的商品列表
    });
  },
  methods: {
    queryUserPower() {
      const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
        this.wkbScopeMenu,
        scopeMenuEnum.dictionary.wkbChildMenu.wkbGoodsMgrMenu.goodsListButton.card
      );
      scopeMenu.childMenu &&
        scopeMenu.childMenu.forEach(item => {
          if (item.identifier == 'card_show' && item.isHasPermission != 1) {
            this.goodsShow = false;
          }
          if (item.identifier == 'card_shelf' && item.isHasPermission != 1) {
            this.goodsShelf = false;
          }
          if (item.identifier == 'card_price' && item.isHasPermission != 1) {
            this.goodsPrice = false;
          }
          if (item.identifier == 'card_edit' && item.isHasPermission != 1) {
            this.goodEdit = false;
          }
        });
    }
  }
};
</script>

<style scoped>
</style>
