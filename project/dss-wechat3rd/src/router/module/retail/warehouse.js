/*
 * @Author: zk
 * @Date: 2019-4-16 19:55:00
 * @Last Modified by: zk
 * @Last Modified time:  2019-4-16 19:55:00
 */

import retailPage from '../../pages/retail.js';

export default {
  description: '仓储物流',
  route: {
    path: '/warehouse',
    redirect: '/warehouse/inventory-mgr/query',
    component: retailPage.warehouse.index,
    meta: {
      title: '仓储物流'
    },

    children: [
      {
        path: '/warehouse/inventory-mgr/query',
        component: retailPage.warehouse.inventoryMgr.query,
        meta: {
          title: '库存查询',
          keepAlive: true
        }
      },
      {
        path: '/warehouse/inventory-mgr/verification',
        component: retailPage.warehouse.inventoryMgr.verification.index,
        meta: {
          title: '库存盘点',
          keepAlive: true
        }
      },

      {
        path: '/warehouse/inventory-mgr/verification/detail',
        component: retailPage.warehouse.inventoryMgr.verification.detail,
        meta: {
          title: '盘点详情'
        }
      },

      {
        path: '/warehouse/inventory-mgr/verification/add-modify',
        component: retailPage.warehouse.inventoryMgr.verification.addOrModify,
        meta: {
          title: '新增盘点/继续盘点'
        }
      },

      {
        path: '/warehouse/inventory-mgr/inbound',
        component: retailPage.warehouse.inventoryMgr.inbound,
        meta: {
          title: '商品入库',
          keepAlive: true
        }
      },

      {
        name: 'inbound-detail',
        path: '/warehouse/inventory-mgr/inbound/inbound-detail',
        component: retailPage.warehouse.inventoryMgr.inboundDetail,
        meta: {
          title: '入库详情'
        }
      },

      {
        path: '/warehouse/inventory-mgr/inbound/purchase-inbound',
        component: retailPage.warehouse.inventoryMgr.purchaseInbound,
        meta: {
          title: '采购入库'
        }
      },

      {
        path: '/warehouse/inventory-mgr/inbound/allot-inbound',
        component: retailPage.warehouse.inventoryMgr.allotInbound,
        meta: {
          title: '调拨入库'
        }
      },

      {
        path: '/warehouse/inventory-mgr/inbound/batch-inbound',
        component: retailPage.warehouse.inventoryMgr.batchInbound,
        meta: {
          title: '批量多仓入库'
        }
      },

      {
        path: '/warehouse/inventory-mgr/outbound',
        component: retailPage.warehouse.inventoryMgr.outbound,
        meta: {
          title: '商品出库',
          keepAlive: true
        }
      },

      {
        name: 'outbound-detail',
        path: '/warehouse/inventory-mgr/outbound/outbound-detail',
        component: retailPage.warehouse.inventoryMgr.outboundOrder,
        meta: {
          title: '出库详情'
        }
      },

      {
        path: '/warehouse/inventory-mgr/outbound/batch-outbound',
        component: retailPage.warehouse.inventoryMgr.batchOutbound,
        meta: {
          title: '批量多仓出库'
        }
      },

      {
        path: '/warehouse/inventory-mgr/outbound/new-outbound',
        component: retailPage.warehouse.inventoryMgr.newOutbound,
        meta: {
          title: '新建出库单'
        }
      },

      {
        path: '/warehouse/inventory-mgr/iobound-detail',
        component: retailPage.warehouse.inventoryMgr.ioboundDetil,
        meta: {
          title: '出入库明细',
          keepAlive: true
        }
      },

      {
        path: '/warehouse/inventory-mgr/stock-warning',
        component: retailPage.warehouse.inventoryMgr.stockWarning,
        meta: {
          title: '库存预警'
        }
      },
      {
        path: '/warehouse/supplier/list',
        component: retailPage.warehouse.supplier.list,
        meta: {
          title: '供应商列表',
          keepAlive: true
        }
      },
      {
        path: '/warehouse/supplier/list/edit',
        component: retailPage.warehouse.supplier.edit,
        meta: {
          title: '编辑供应商'
        }
      },
      {
        path: '/warehouse/supplier/list/detail',
        component: retailPage.warehouse.supplier.detail,
        meta: {
          title: '供应商详情'
        }
      },
      {
        path: '/warehouse/stock-mgr',
        redirect: '/warehouse/stock-mgr/list',
        component: retailPage.warehouse.warehouseMgr.index,
        meta: {
          title: '仓库管理'
        },
        children: [
          {
            path: '/warehouse/stock-mgr/list',
            component: retailPage.warehouse.warehouseMgr.list,
            meta: {
              title: '仓库列表',
              keepAlive: true
            }
          },
          {
            path: '/warehouse/stock-mgr/list/add',
            component: retailPage.warehouse.warehouseMgr.add,
            meta: {
              title: '新增仓库'
            }
          },
          {
            path: '/warehouse/stock-mgr/list/express',
            component: retailPage.warehouse.warehouseMgr.express,
            meta: {
              title: '物流方式'
            }
          }
        ]
      },
      {
        path: '/warehouse/logistics-setting/freight-tpl/list/add',
        component: retailPage.warehouse.freightTpl.add,
        meta: {
          title: '添加/编辑模板'
        }
      },
      {
        path: '/warehouse/logistics-setting',
        component: retailPage.warehouse.logisticsSetting,
        meta: {
          title: '物流设置'
        }
      }
    ]
  }
};
