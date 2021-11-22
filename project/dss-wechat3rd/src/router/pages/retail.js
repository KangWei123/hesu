/**
 * Created by love on 18/11/2.
 * @author trumpli<李志伟>
 */
/* eslint-disable */
export default {
  activity: {
    index: () => import( /* webpackChunkName: "retail-activity" */ '../../views-retail/activity/index.vue'),
    list: () => import( /* webpackChunkName: "retail-activity" */ '../../views-retail/activity/list.vue'),
    create: () => import( /* webpackChunkName: "retail-activity" */ '../../views-retail/activity/create.vue')
  },

  createGoods: {
    index: () => import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/create-goods/index.vue'),
    list: () => import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/create-goods/goods-list.vue'),
    discard: () => import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/create-goods/discard-list.vue'),
    addGoods: () => import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/create-goods/add-goods.vue'),
    labelManage: () => import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views/label/index.vue'),
    patchShelves: () =>
      import( /* webpackChunkName: "goods-mgr" */ '../../views/goods/goods-manage/patch-shelves/index.vue'),
    giftPatchShelves: () =>
      import( /* webpackChunkName: "goods-mgr" */ '../../views-retail/goods-mgr/gift-mgr/gift-shelf/index.vue'),
    parameter: ()=> import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/create-goods/parameter-list/index.vue'),
    parameterAdd: ()=> import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/create-goods/parameter-list/add-parameter.vue'),
    question: ()=> import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/create-goods/question-answer-list/index.vue'),
    questionAdd: ()=> import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/create-goods/question-answer-list/question-answer-add.vue'),
    quoteList: () => import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/create-goods/quote-goods-list.vue'),
    addQuoteGoods: () => import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/create-goods/add-quote-goods.vue'),
  },

  warehouse: {
    index: () => import( /* webpackChunkName: "warehouse-mgr" */ '../../views-retail/warehouse/index.vue'),
    warehouseMgr: {
      index: () =>
        import( /* webpackChunkName: "warehouse-mgr" */ '../../views-retail/warehouse/warehouse-mgr/index.vue'),
      list: () => import( /* webpackChunkName: "warehouse-mgr" */ '../../views-retail/warehouse/warehouse-mgr/list.vue'),
      add: () =>
        import( /* webpackChunkName: "warehouse-mgr" */ '../../views-retail/warehouse/warehouse-mgr/edit/index.vue'),
      express: () =>
        import( /* webpackChunkName: "warehouse-mgr" */ '../../views-retail/warehouse/warehouse-mgr/edit/express.vue')
    },
    inventoryMgr: {
      index: () =>
        import( /* webpackChunkName: "warehouse-mgr" */ '../../views-retail/warehouse/inventory-mgr/index.vue'),
      verification: {
        index: () =>
          import(
            /* webpackChunkName: "warehouse-mgr" */
            '../../views-retail/warehouse/inventory-mgr/verification/home/index.vue'
          ),
        addOrModify: () =>
          import(
            /* webpackChunkName: "warehouse-mgr" */
            '../../views-retail/warehouse/inventory-mgr/verification/addOrModify/index.vue'
          ),
        detail: () =>
          import(
            /* webpackChunkName: "warehouse-mgr" */
            '../../views-retail/warehouse/inventory-mgr/verification/detail/index.vue'
          )
      },
      query: () =>
        import(
          /* webpackChunkName: "warehouse-mgr" */
          '../../views-retail/warehouse/inventory-mgr/inventory-query/index.vue'
        ),
      inbound: () =>
        import( /* webpackChunkName: "warehouse-mgr" */ '../../views-retail/warehouse/inventory-mgr/inbound/index.vue'),
      inboundDetail: () =>
        import(
          /* webpackChunkName: "warehouse-mgr" */
          '../../views-retail/warehouse/inventory-mgr/inbound/inbound-detail/index.vue'
        ),
      purchaseInbound: () =>
        import(
          /* webpackChunkName: "warehouse-mgr" */
          '../../views-retail/warehouse/inventory-mgr/inbound/purchase-inbound/index.vue'
        ),
      allotInbound: () =>
        import(
          /* webpackChunkName: "warehouse-mgr" */
          '../../views-retail/warehouse/inventory-mgr/inbound/allot-inbound/index.vue'
        ),
      batchInbound: () =>
        import(
          /* webpackChunkName: "warehouse-mgr" */
          '../../views-retail/warehouse/inventory-mgr/inbound/batch-inbound/index.vue'
        ),
      outbound: () =>
        import( /* webpackChunkName: "warehouse-mgr" */ '../../views-retail/warehouse/inventory-mgr/outbound/index.vue'),
      batchOutbound: () =>
        import(
          /* webpackChunkName: "warehouse-mgr" */
          '../../views-retail/warehouse/inventory-mgr/outbound/batch-outbound/index.vue'
        ),
      newOutbound: () =>
        import(
          /* webpackChunkName: "warehouse-mgr" */
          '../../views-retail/warehouse/inventory-mgr/outbound/new-outbound/index.vue'
        ),
      /*batchOutbound: () =>
        import(
          /!* webpackChunkName: "warehouse-mgr" *!/
          '../../views-retail/warehouse/inventory-mgr/outbound/batch-outbound/index.vue'
        ),*/
      outboundOrder: () =>
        import(
          /* webpackChunkName: "warehouse-mgr" */
          '../../views-retail/warehouse/inventory-mgr/outbound/outbound-detail/index.vue'
        ),
      ioboundDetil: () =>
        import(
          /* webpackChunkName: "warehouse-mgr" */
          '../../views-retail/warehouse/inventory-mgr/iobound-detail/index.vue'
        ),
      stockWarning: () =>
        import(
          /* webpackChunkName: "warehouse-mgr" */
          '../../views-retail/warehouse/inventory-mgr/stock-warning/index.vue'
        )
    },
    supplier: {
      list: () => import( /* webpackChunkName: "warehouse-mgr" */ '../../views-retail/warehouse/supplier/list.vue'),
      edit: () => import( /* webpackChunkName: "warehouse-mgr" */ '../../views-retail/warehouse/supplier/edit.vue'),
      detail: () => import( /* webpackChunkName: "warehouse-mgr" */ '../../views-retail/warehouse/supplier/detail.vue')
    },
    freightTpl: {
      list: () => import( /* webpackChunkName: "warehouse-mgr" */ '../../views-retail/warehouse/freight-tpl/list.vue'),
      add: () => import( /* webpackChunkName: "warehouse-mgr" */ '../../views-retail/warehouse/freight-tpl/add.vue')
    },
    logisticsSetting: () =>
      import( /* webpackChunkName: "warehouse-mgr" */ '../../views-retail/warehouse/logistics-setting/index.vue')
  },

  goodsMgr: {
    index: () => import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/goods-mgr/index.vue'),
    goodsList: {
      index: () => import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/goods-mgr/goods-list/index.vue'),
      goodsShelf: () =>
        import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/goods-mgr/goods-list/goods-shelf.vue'),
      combinedShelf: () =>
        import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/goods-mgr/goods-list/combined-shelf.vue'),
      giftShelf: () =>
        import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/goods-mgr/goods-list/gift-shelf/list.vue'),
      giftDetail: () =>
        import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/goods-mgr/goods-list/gift-shelf/detail.vue'),
      detail: () => import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/goods-mgr/goods-list/detail.vue')
    },
    goodsCombined: {
      index: () => import( /* webpackChunkName: "goods-combined" */ '../../views/goods/goods-combined/index.vue'),
      goodsList: () =>
        import( /* webpackChunkName: "goods-combined" */ '../../views/goods/goods-combined/goods-list.vue'),
      edit: () => import( /* webpackChunkName: "goods-combined" */ '../../views/goods/goods-combined/edit.vue'),
      discardList: () =>
        import( /* webpackChunkName: "goods-combined" */ '../../views/goods/goods-combined/discard-list.vue')
    },
    giftMgr: {
      index: () => import( /* webpackChunkName: "goods-gift" */ '../../views-retail/goods-mgr/gift-mgr/index.vue'),
      goodsList: () =>
        import( /* webpackChunkName: "goods-gift" */ '../../views-retail/goods-mgr/gift-mgr/gift-list/index.vue'),
      edit: () =>
        import( /* webpackChunkName: "goods-gift" */ '../../views-retail/goods-mgr/gift-mgr/gift-create/index.vue'),
      discardList: () =>
        import(
          /* webpackChunkName: "goods-combined" */
          '../../views-retail/goods-mgr/gift-mgr/gift-list/discard-list.vue'
        )
    },

    classfiy: {
      index: () =>
        import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/goods-mgr/classfiy-mgr/index.vue'),
      list: () =>
        import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/goods-mgr/classfiy-mgr/classfiy-list.vue'),
      server: () =>
        import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/goods-mgr/classfiy-mgr/server.vue'),
      product: () =>
        import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/goods-mgr/classfiy-mgr/product.vue'),
      detail: () =>
        import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/goods-mgr/classfiy-mgr/detail.vue'),
      custom: () =>
        import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/goods-mgr/classfiy-mgr/custom-classfiy.vue')
    },
    commentMgr: {
      index: () => import( /* webpackChunkName: "goods-mgr" */ '../../views-retail/goods-mgr/comment-mgr/index.vue'),
      edit: () =>
        import( /* webpackChunkName: "goods-mgr" */ '../../views-retail/goods-mgr/comment-mgr/detail/index.vue'),
      setUp: () =>
        import( /* webpackChunkName: "goods-mgr" */ '../../views-retail/goods-mgr/comment-mgr/set-up.vue'),
    },
    customClassfiy: {
      index: () =>
        import( /* webpackChunkName: "goods-mgr-mgr" */ '../../views-retail/goods-mgr/classfiy-mgr/custom-classfiy.vue')
    }
  }
};
