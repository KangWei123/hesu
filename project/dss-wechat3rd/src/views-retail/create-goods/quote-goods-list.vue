<template>
  <manage-goodsList-table ref="list"
                          addProductPath="/retail/goods-mgr/product/quote-list/add"
                          manageLabelPath="/retail/goods-mgr/product/list/label-manage"
                          :goodsType="goodsTypeEnum.product"
                          :lookitem="lookitem"
                          :edititem="edititem"
                          :exportitem="exportitem"
                          :ulshelve="ulshelve"
                          :setprice="setprice"></manage-goodsList-table>
</template>

<script>
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
import ManageGoodsListTable from '@/dss-wechat3rd/src/components/goods/ManageGoodsListTable.vue';
import scopeMenuEnum from '@/business-common/scopeMenuEnum';
import { mapState } from 'vuex';
export default {
  name: 'create-quote-goods-list',
  components: { ManageGoodsListTable },
  data() {
    return {
      goodsTypeEnum,
      lookitem: true,
      edititem: true,
      exportitem: true,
      ulshelve: true,
      setprice: true
    };
  },
  computed: {
    ...mapState({
      env: 'env',
      curApp: 'curApp',
      curStore: 'curStore',
      roleList: 'roleList',
      wkbScopeMenu: 'wkbScopeMenu'
    })
  },
  watch: {
    wkbScopeMenu: {
      immediate: true,
      handler() {
        if (this.wkbScopeMenu) {
          this.assembleOrderMgrMenu();
        }
      }
    }
  },
  // 钩子函数执行子组件列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.list.listGoodsByType(); // 根据商品类型获取商品列表
    });
  },
  methods: {
    assembleOrderMgrMenu() {
      // const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
      //   this.wkbScopeMenu,
      //   scopeMenuEnum.dictionary.wkbChildMenu.wkbGoodsMgrMenu.goodsListButton.goods_manage
      // );
      // scopeMenu.childMenu &&
      //   scopeMenu.childMenu.forEach(item => {
      //     if (item.identifier == 'goods_list_detail' && item.isHasPermission != 1) {
      //       this.lookitem = false;
      //     }
      //     if (item.identifier == 'edit_goods' && item.isHasPermission != 1) {
      //       this.edititem = false;
      //     }
      //     if (item.identifier == 'import_goods' && item.isHasPermission != 1) {
      //       this.exportitem = false;
      //     }
      //     if (item.identifier == 'shelf_goods' && item.isHasPermission != 1) {
      //       this.ulshelve = false;
      //     }
      //     if (item.identifier == 'mdjy_spgl_splb_spgl_szjg' && item.isHasPermission != 1) {
      //       this.setprice = false;
      //     }
      //   });
    }
  }
};
</script>
