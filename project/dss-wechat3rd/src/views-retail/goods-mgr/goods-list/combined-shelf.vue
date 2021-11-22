<template>
  <shelf-goods-list-table ref="list"
                          :productDetailPrefix="detailPath"
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
  name: 'goods-mgr-goods-list',
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
      goodsPrice: true,
      goodEdit: true,
      goodsType: goodsTypeEnum.combinationItem,
      detailPath: '/retail/goods-mgr/shelf/combined-shelf/detail' // 详情页面路径
    };
  },
  methods: {
    queryUserPower() {
      if (this.wkbScopeMenu) {
        const combineButton = scopeMenuEnum.dictionary.wkbChildMenu.wkbGoodsMgrMenu.storeShelfMenu.combineButton;
        // 查看
        const scopeShowGoodsButton = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          combineButton.store_combine_goods_show
        );
        this.goodsShow = !!scopeShowGoodsButton && !!scopeShowGoodsButton.status;
        // 上下架
        const scopeShelfGoodsButton = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          combineButton.store_shelf_combine
        );
        this.goodsShelf = !!scopeShelfGoodsButton && !!scopeShelfGoodsButton.status;
        // 设置价格
        const scopePriceGoodsButton = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          combineButton.store_price_combine
        );
        this.goodsPrice = !!scopePriceGoodsButton && !!scopePriceGoodsButton.status;
        // 排序
        const scopeEditGoodsButton = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          combineButton.store_combine_goods_edit
        );
        this.goodEdit = !!scopeEditGoodsButton && !!scopeEditGoodsButton.status;
      }
    }
  },
  // 钩子函数执行子组件列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.list.listStoreItemsByType(); // 根据商品类型获取门店下的商品列表
    });
  }
};
</script>
