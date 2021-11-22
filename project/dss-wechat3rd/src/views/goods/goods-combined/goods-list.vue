<template>
  <div class="goods-combined-goods-list">
         <div class="Add-Manage-Button">
          <el-button class="btn btn-right"
                    slot="reference"
                    @click="manageLabel"
                    type="primary" plain
                    v-if="allowManageLabel">管理标签</el-button>
          <el-popover placement="bottom"
                      width="200"
                      trigger="hover"
                      :content="scopeMenuEnum.disabledBtnTip"
                      v-else>
            <el-button class="btn isdisabled"
                      type="primary" plain
                      slot="reference">管理标签</el-button>
          </el-popover>

          <el-button class="btn"
                    type="primary"
                    slot="reference"
                    @click="createGoods"
                    icon="el-icon-plus"
                    v-if="allowCreateItem">添加组合商品</el-button>
          <el-popover placement="bottom"
                      width="200"
                      trigger="hover"
                      :content="scopeMenuEnum.disabledBtnTip"
                      v-else>
            <el-button class="btn isdisabled"
                      type="primary"
                      icon="el-icon-plus"
                      slot="reference">添加组合商品</el-button>
          </el-popover>
        </div>
    <!-- <div class="head"> -->
      <!-- 查询条件过滤器 -->
      <query-filter class="wkt-opt-label-container"
                    :goods-type="goodsTypeEnum.product"
                    @filter="onFilter" />
    <!-- </div> -->

  

    <!-- 商品列表 -->
    <list-table ref="list"
                class="goods-list wkb-table-border goods-list-mgr-table"
                :goods-type="goodsTypeEnum.combinationItem"
                :filter-params="filterParams" />
  </div>
</template>
<script>
import '@/dss-wechat3rd/src/components/goods/css/CommonGoodsListTable.less';
import queryFilter from './query-filter.vue';
import listTable from './list-table.vue';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
import scopeMenuEnum from '@/business-common/scopeMenuEnum';
import wpBaseApi from '@/business-common/wp-base-api.js';
import { mapState } from 'vuex';

export default {
  components: {
    queryFilter,
    listTable
  },
  data() {
    return {
      loading: false,

      goodsTypeEnum, // 商品类型
      scopeMenuEnum,
      create_item: false, // 是否允许创建
      update_item: false, // 是否允许修改
      manage_label: false, // 是否允许管理标签

      filterParams: null, // 列表查询条件

      // 按钮接口返回的权限
      lookitem: false, // 查看: 搜索
      edititem: false // 编辑商品：添加、编辑、删除、管理标签
    };
  },

  computed: {
    ...mapState({
      env: 'env',
      curApp: 'curApp',
      curStore: 'curStore',
      roleList: 'roleList',
      wkbScopeMenu: 'wkbScopeMenu'
    }),
    /**
     * 是否企业管理员
     */
    isEnterpriseManager() {
      return !!this.roleList && this.roleList.indexOf('common_role_enterprise') !== -1;
    },

    /**
     * 是否区域管理员
     */
    isAreaManager() {
      return (
        !!this.roleList &&
        (this.roleList.indexOf('common_role_area_manager') !== -1 ||
          this.roleList.indexOf('common_role_dealer_manager') !== -1)
      );
    },
    /**
     * 是否允许创建商品。
     * 兼容以往的判断条件
     */
    allowCreateItem() {
      const canCustomItem = this.curApp && this.curApp.canCustomItem ? this.curApp.canCustomItem : 0; // 是否支持门店自主管理商品，0：不支持，1：支持
      // 是否支持门店自主管理商品，新增的角色管理商品权限
      if (this.isEnterpriseManager || (this.edititem && canCustomItem)) {
        return true;
      } else {
        return false;
      }
    },

    /**
     * 是否允许修改商品，包括编辑、删除。
     * 兼容以往的判断条件
     */
    allowUpdateItem() {
      return createStoreId => {
        const canCustomItem = this.curApp && this.curApp.canCustomItem ? this.curApp.canCustomItem : 0; // 是否支持门店自主管理商品，0：不支持，1：支持
        if (
          this.isEnterpriseManager ||
          (this.edititem && // 是否区域管理员
          canCustomItem && // 是否支持门店自主管理商品，新增的角色管理商品权限
          createStoreId && // 商品来源门店id是否存在
            createStoreId === this.curStore.id) // 商品来源门店id是否等于当前门店id
        ) {
          return true;
        }
        return false;
      };
    },

    /**
     * 是否允许管理标签。
     * 兼容以往的判断条件
     */
    allowManageLabel() {
      const canCustomItem = this.curApp && this.curApp.canCustomItem ? this.curApp.canCustomItem : 0; // 是否支持门店自主管理商品，0：不支持，1：支持
      // 是否支持门店自主管理商品，新增的角色管理商品权限
      if (this.isEnterpriseManager || (this.edititem && canCustomItem)) {
        return true;
      } else {
        return false;
      }
    }
  },

  // 钩子函数执行子组件列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.list.listGoodsByType(); // 根据商品类型获取商品列表
    });
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
  mounted() {
    this.queryUserManagement(); // 获取用户是否为管理员
  },
  methods: {
    assembleOrderMgrMenu() {
      const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
        this.wkbScopeMenu,
        scopeMenuEnum.dictionary.wkbChildMenu.wkbGoodsMgrMenu.combineGoodsButton.goods_manager
      );
      scopeMenu.childMenu &&
        scopeMenu.childMenu.forEach(item => {
          if (item.identifier == 'combine_goods_detail' && item.isHasPermission == 1) {
            this.lookitem = true;
          }
          if (item.identifier == 'edit_combine_goods' && item.isHasPermission == 1) {
            this.edititem = true;
          }
        });
    },
    /**
     * 获取用户是否为管理员
     */
    queryUserManagement() {
      wpBaseApi
        .queryUserManagement()
        .then(res => {
          res.data.forEach(item => {
            if (item.name === 'create_item') {
              this.create_item = true;
            }
            if (item.name === 'update_item') {
              this.update_item = true;
            }
            if (item.name === 'manage_label') {
              this.manage_label = true;
            }
          });
        })
        .always(() => {});
    },

    // 按条件查询
    onFilter(filterParams) {
      this.filterParams = filterParams; // 列表查询条件
    },

    // /**
    //  * 显示loading
    //  */
    // onLoading() {
    //   this.loading = true;
    // },

    // /**
    //  * 隐藏loading
    //  */
    // unLoading() {
    //   this.loading = false;
    // },

    /**
     * 创建组合商品
     */
    createGoods() {
      this.$router.push({
        path: '/retail/goods-mgr/goods-combined/goods-list/edit'
      });
    },

    /**
     * 管理标签
     */
    manageLabel() {
      this.$router.push({
        path: '/retail/goods-mgr/goods-combined/goods-list/label-manage',
        query: {
          labelType: goodsTypeEnum.combinationItem.value,
          goodsType: goodsTypeEnum.combinationItem.type
        }
      });
    }
  }
};
</script>
