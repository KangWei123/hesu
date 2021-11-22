<template>
  <shelf-goods-list-table
    :goods-type="goodsType"
    :goodsShow="goodsShow"
    :goodsShelf="goodsShelf"
    :goodEdit="goodEdit"/>
</template>

<script>
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import ShelfGoodsListTable from './ShelfGoodsListTable';
import scopeMenuEnum from '@/business-common/scopeMenuEnum.js';
import { mapState } from 'vuex';
export default {
  components: {
    ShelfGoodsListTable
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
  data() {
    return {
      goodsShow: true,
      goodsShelf: true,
      goodEdit: true,
      goodsType: goodsTypeEnum.gift
    };
  },
  methods: {
    queryUserPower() {
      if (this.wkbScopeMenu) {
        const giftButton = scopeMenuEnum.dictionary.wkbChildMenu.wkbGoodsMgrMenu.storeShelfMenu.giftButton;
        // 查看
        const scopeShowGoodsButton = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          giftButton.store_gift_show
        );
        this.goodsShow = !!scopeShowGoodsButton && !!scopeShowGoodsButton.status;
        // 上下架
        const scopeShelfGoodsButton = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          giftButton.store_shelf_gift
        );
        this.goodsShelf = !!scopeShelfGoodsButton && !!scopeShelfGoodsButton.status;
        // 排序
        const scopeEditGoodsButton = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          giftButton.store_gift_edit
        );
        this.goodEdit = !!scopeEditGoodsButton && !!scopeEditGoodsButton.status;
      }
    }
  }
};
</script>
