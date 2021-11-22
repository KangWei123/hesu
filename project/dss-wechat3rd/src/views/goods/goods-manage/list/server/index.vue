<template>
  <goods-list-table ref="list"
                    :goods-type="goodsType"
                    addProductPath="/beauty/goods-mgr/goods/server/add"
                    manageLabelPath="/beauty/goods-mgr/goods/server/label-manage"
                    :lookitem="lookitem"
                    :edititem="edititem"
                    :exportitem="exportitem"
                    :ulshelve="ulshelve"
                    :setprice="setprice"/>
</template>

<script>
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';

import GoodsListTable from '@/dss-wechat3rd/src/components/goods/ManageGoodsListTable';
import scopeMenuEnum from '@/business-common/scopeMenuEnum';
import { mapState } from 'vuex';

export default {
  name: 'index',

  components: {
    GoodsListTable
  },

  data() {
    return {
      goodsType: goodsTypeEnum.server,
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
      const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
        this.wkbScopeMenu,
        scopeMenuEnum.dictionary.wkbChildMenu.wkbGoodsMgrMenu.goodsListButton.server
      );
      scopeMenu.childMenu &&
        scopeMenu.childMenu.forEach(item => {
          if (item.identifier == 'server_detail' && item.isHasPermission != 1) {
            this.lookitem = false;
          }
          if (item.identifier == 'edit_server' && item.isHasPermission != 1) {
            this.edititem = false;
          }
          if (item.identifier == 'import_server' && item.isHasPermission != 1) {
            this.exportitem = false;
          }
          if (item.identifier == 'shelf_server' && item.isHasPermission != 1) {
            this.ulshelve = false;
          }
          if (item.identifier == 'server_price' && item.isHasPermission != 1) {
            this.setprice = false;
          }
        });
    }
  }
};
</script>
