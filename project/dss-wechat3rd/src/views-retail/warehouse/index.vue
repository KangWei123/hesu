/* * @Author: Neexz * @Date: 2018-11-05 15:58:19 * @Last Modified by: Neexz * @Last Modified time: 2018-11-07 14:07:57
*/

<template>
  <div>
    <keep-alive>
      <wkb-page-nav :menuList="warehouseMenu"
                    :isHideNav="false"
                    v-if="$route.meta.keepAlive" />
    </keep-alive>
    <wkb-page-nav :menuList="warehouseMenu"
                  :isHideNav="false"
                  v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import WkbPageNav from '@/dss-wechat3rd/src/components/wkb-page-nav/index.vue';
import storeUser from '@/business-common/store_user.js';
import { mapState } from 'vuex';
import scopeMenuEnum from '@/business-common/scopeMenuEnum';
// const warehouseMenu = [
//   {
//     path: 'inventory-mgr/query',
//     name: '库存查询',
//     identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbWareHouseMenu.inventory_query,
//     disabled: false,
//     disableTip: '该角色暂无权限访问'
//   },
//   {
//     path: 'inventory-mgr/inbound',
//     name: '商品入库',
//     breadcrumbs: [
//       {
//         path: 'inventory-mgr/inbound/inbound-detail',
//         name: '入库明细'
//       },
//       {
//         path: 'inventory-mgr/inbound/purchase-inbound',
//         name: '采购入库'
//       },
//       {
//         path: 'inventory-mgr/inbound/allot-inbound',
//         name: '调拨入库'
//       },
//       {
//         path: 'inventory-mgr/inbound/other-inbound',
//         name: '其他入库'
//       }
//     ],
//     identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbWareHouseMenu.inbound,
//     disabled: false,
//     disableTip: '该角色暂无权限访问'
//   },
//   {
//     path: 'inventory-mgr/outbound',
//     name: '商品出库',
//     breadcrumbs: [
//       {
//         path: 'inventory-mgr/outbound/outbound-detail',
//         name: '出库详情'
//       },
//       {
//         path: 'inventory-mgr/outbound/new-outbound',
//         name: '新建/编辑出库单'
//       }
//     ],
//     identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbWareHouseMenu.outbound,
//     disabled: false,
//     disableTip: '该角色暂无权限访问'
//   },
//   {
//     path: 'inventory-mgr/verification',
//     name: '库存盘点',
//     breadcrumbs: [
//       {
//         path: 'inventory-mgr/verification/add-modify',
//         name: '新增/编辑盘点'
//       },
//       {
//         path: 'inventory-mgr/verification/detail',
//         name: '盘点详情'
//       }
//     ],
//     identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbWareHouseMenu.inventory_verification,
//     disabled: false,
//     disableTip: '该角色暂无权限访问'
//   },
//   {
//     path: 'inventory-mgr/iobound-detail',
//     name: '出入库明细',
//     identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbWareHouseMenu.iobound_detail,
//     disabled: false,
//     disableTip: '该角色暂无权限访问'
//   },
//   {
//     path: 'supplier/list',
//     name: '供应商管理',
//     breadcrumbs: [
//       {
//         path: 'supplier/list/edit',
//         name: '新增供应商'
//       },
//       {
//         path: 'supplier/list/detail',
//         name: '供应商详情'
//       }
//     ],
//     identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbWareHouseMenu.supplier_mgr,
//     disabled: false,
//     disableTip: '该角色暂无权限访问'
//   },
//   {
//     path: 'stock-mgr',
//     name: '仓库管理',
//     breadcrumbs: [
//       {
//         path: 'stock-mgr/list/add',
//         name: '编辑/新增仓库'
//       },
//       {
//         path: 'stock-mgr/list/express',
//         name: '物流方式'
//       }
//     ],
//     identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbWareHouseMenu.stock_mgr,
//     disabled: false,
//     disableTip: '该角色暂无权限访问'
//   },
//   // {
//   //   path: 'freight-tpl/list',
//   //   name: '运费模板',
//   //   showBorder: true,
//   //   breadcrumbs: [
//   //     {
//   //       path: 'logistics-setting/freight-tpl/list/add',
//   //       name: '编辑/新增运费模板'
//   //     }
//   //   ]
//   // },
//   {
//     path: 'logistics-setting',
//     name: '物流设置',
//     showBorder: true,
//     breadcrumbs: [
//       {
//         path: 'logistics-setting/freight-tpl/list/add',
//         name: '编辑/新增运费模板'
//       }
//     ],
//     identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbWareHouseMenu.logistics_setting,
//     disabled: false,
//     disableTip: '该角色暂无权限访问'
//   }
// ];

export default {
  mixins: [storeUser],
  components: {
    WkbPageNav
  },
  computed: {
    ...mapState({
      wkbScopeMenu: 'wkbScopeMenu'
    })
  },
  watch: {
    wkbScopeMenu: {
      immediate: true,
      handler() {
        if (this.wkbScopeMenu) {
          this.assembleGoodsMgrMenu();
        }
      }
    }
  },
  data() {
    return {
      warehouseMenu: []
    };
  },
  mounted() {
    //更新仓库列表
    this.__updateWarehouse();
  },
  methods: {
    assembleGoodsMgrMenu() {
      const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
        this.wkbScopeMenu,
        scopeMenuEnum.dictionary.wkbChildMenu.warehouse
      );

      this.warehouseMenu = scopeMenu && scopeMenu.childMenu;
    }
  }
};
</script>
