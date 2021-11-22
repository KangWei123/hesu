import services from '@/dss-common/utils/services';

const REQUEST_PREFIX = '/wp';

const api = {
  Api: {
    goods: {
      add: `${REQUEST_PREFIX}/item/add`,
      update: `${REQUEST_PREFIX}/item/update`,
      list: `${REQUEST_PREFIX}/item/queryList`,
      skuList: `${REQUEST_PREFIX}/item/query/item/sku`,
      epSkuList: `${REQUEST_PREFIX}/item/query/item/epsku`,
      detail: `${REQUEST_PREFIX}/item/queryDetail`,
      getQRCode: `${REQUEST_PREFIX}/verification/getQRCode`, // 获取商品二维码(微信)
      getQRCodeOthers: `${REQUEST_PREFIX}/qrcode/get`, // 获取商品二维码(其他平台)
      del: `${REQUEST_PREFIX}/item/deleteItem`,
      itemExport: `${REQUEST_PREFIX}/item/export`, // 商品导出接口
      batchDel: `${REQUEST_PREFIX}/item/batchDeleteItem`, // 批量删除商品

      attribute: {
        list: `${REQUEST_PREFIX}/item/attr/queryAttrKey`,
        add: `${REQUEST_PREFIX}/item/attr/addAttrKey`,
        itemList: `${REQUEST_PREFIX}/item/attr/queryAttrVal`,
        addItem: `${REQUEST_PREFIX}/item/attr/addAttrVal`,
      },
      // 创建商品-管理标签
      label: {
        list: `${REQUEST_PREFIX}/item/label/query`,
        add: `${REQUEST_PREFIX}/item/label/insert`,
        update: `${REQUEST_PREFIX}/item/label/update`,
        delete: `${REQUEST_PREFIX}/item/label/delete`,
        cateList: `${REQUEST_PREFIX}/item/label/category/list`, // 标签分类列表
      },
    },
    card: {
      add: `${REQUEST_PREFIX}/wx_item_card/add`,
      list: `${REQUEST_PREFIX}/wx_item_card/query_list`,
      detail: `${REQUEST_PREFIX}/wx_item_card/query`,
      update: `${REQUEST_PREFIX}/wx_item_card/update`,
      shelf: `${REQUEST_PREFIX}/wx_item_card/shelf`,
      // 商品管理的卡项改变排序
      updateSort: `${REQUEST_PREFIX}/wx_item_card/order`,
    },
    category: {
      list: `${REQUEST_PREFIX}/item/category/queryCategoryList`,
      pageList: `${REQUEST_PREFIX}/item/query/app/category`,
    },
    store: {
      // 门店下的商品列表,分页
      queryStoreItems: `${REQUEST_PREFIX}/wx_store_item/query/Item_list`,
      // 上下架
      shelf: `${REQUEST_PREFIX}/wx_store_item/shelf/item`,
      // 多商品多门店批量上下架
      batchShelf: `${REQUEST_PREFIX}/wx_store_item/batch/shelf/item`,
      // 统一上下架，支持选择多个门店进行上架
      unifyShelf: `${REQUEST_PREFIX}/wx_store_item/shelf/item/unify`,
      itemDetail: `${REQUEST_PREFIX}/wx_store_item/query/Item_detail`,
      updateItem: `${REQUEST_PREFIX}/wx_store_item/update/item`,
      // 商品上下架的服务改变排序
      updateSort: `${REQUEST_PREFIX}/wx_store_item/order/item`,
      // 拼团活动获取商品列表接口，跟商品上下架接口不一样
      queryList: `${REQUEST_PREFIX}/item/queryList`,
      categoryList: `${REQUEST_PREFIX}/wx_store_item/query/category`,
      // 门店列表
      storeList: `${REQUEST_PREFIX}/store/query/dept`,
      // 多商品批量查详情
      batchItemDetail: `${REQUEST_PREFIX}/wx_store_item/query_store`,
      // 多商品批量改价
      batchUpdateItem: `${REQUEST_PREFIX}/wx_store_item/update/item/price`,
    },
    order: {
      list: `${REQUEST_PREFIX}/order/listV2`, // 商家订单列表查询接口
      detail: `${REQUEST_PREFIX}/order/detail`, // 查询订单详情
      remark: `${REQUEST_PREFIX}/order/message`, // 订单备注接口
      shipping: `${REQUEST_PREFIX}/order/shipping`, // 订单发货接口
      updateAddress: `${REQUEST_PREFIX}/order/update/address`, // 修改收货地址
      selfPickup: `${REQUEST_PREFIX}/order/self_pickup`, // 确认自提接口

      refundList: `${REQUEST_PREFIX}/order/refund/list`, // 商家退款订单列表查询接口
      refundDetail: `${REQUEST_PREFIX}/order/refund/detail`, // 查询退款订单详情
      refundAddressList: `${REQUEST_PREFIX}/order/refund/address/list`, // 商家退货地址
      agreeRequestRefund: `${REQUEST_PREFIX}/order/agree_refund_request`, // 商家同意退款申请接口
      refuseRefund: `${REQUEST_PREFIX}/order/refuse_refund`, // 商家拒绝退款请求接口
      confirmRefundItem: `${REQUEST_PREFIX}/order/seller_confirm_receipt`, // 商家确认已收货接口(即确认已退货操作)
      queryRefundOrderStatus: `${REQUEST_PREFIX}/order/query_refund_order_status`, // 查询退款订单状态
      agreeRefund: `${REQUEST_PREFIX}/order/confirm_refund`, // 商家确认退款接口(即确认退款操作)
      queryLogistics: `${REQUEST_PREFIX}/order/query_logistics`, // 商家查询发货单信息
      exportOrder: `${REQUEST_PREFIX}/order/export/excel`, // 订单导出
      exportRefund: `${REQUEST_PREFIX}/order/refund/export/excel`, // 退款订单导出
      patchReconciliationOrder: `${REQUEST_PREFIX}/order/reconciliation/export/excel`, // 对账单导出

      refuseReset: `${REQUEST_PREFIX}/order/refuse_reset`, // 重置退款状态,
      refundReRequest: `${REQUEST_PREFIX}/order/refund/reRequest`, // 更新退款状态
      uploadOrder: `${REQUEST_PREFIX}/order/import/excel`, // 批量导入订单，手动编辑物流单号
      preShipOder: `${REQUEST_PREFIX}/third_wms/order/push`, // 预售商品批量提前发货
      checkingIn: `${REQUEST_PREFIX}/order/hotel/check_in`, // 客房订单入住接口
      query_order: `${REQUEST_PREFIX}/cashier_board/query_order`, // 核销查询门票订单接口
      verification_order: `${REQUEST_PREFIX}/cashier_board/verification_order`, // 核销接口

      // 代客下单
      valetList: `${REQUEST_PREFIX}/valet/order/list`, // 代客下单列表
      valetDetail: `${REQUEST_PREFIX}/valet/order/detail`, // 代客下单详情
      valetRemark: `${REQUEST_PREFIX}/valet/order/change`, // 代客下单备注
      valetExport: `${REQUEST_PREFIX}/valet/order/export/excel`,
    },
    // 设置管理
    setting: {
      member: {
        // 会员等级
        level: {
          list: `${REQUEST_PREFIX}/user/level/list`,
          delete: `${REQUEST_PREFIX}/user/level/delete`,
          add: `${REQUEST_PREFIX}/user/level/add`,
          update: `${REQUEST_PREFIX}/user/level/update`,
          detail: `${REQUEST_PREFIX}/user/level/detail`,
        },
        // 积分设置
        score: {
          settings: `${REQUEST_PREFIX}/score/settings`,
          update_settings: `${REQUEST_PREFIX}/score/update_settings`,
        },
        // 会员等级
        label: {
          list: `${REQUEST_PREFIX}/user/query_auto_label`,
          delete: `${REQUEST_PREFIX}/user/delete_auto_label`,
          add: `${REQUEST_PREFIX}/user/add_auto_label`,
          update: `${REQUEST_PREFIX}/user/update_auto_label`,
          detail: `${REQUEST_PREFIX}/user/auto_label_detail`,
        },
      },
    },
    // 客房管理
    hotel: {
      list: `${REQUEST_PREFIX}/item_hotel/query_hotel_list`,
      delete: `${REQUEST_PREFIX}/item_hotel/delete_hotel`,
      create: `${REQUEST_PREFIX}/item_hotel/add_hotel`,
      update: `${REQUEST_PREFIX}/item_hotel/update_hotel`,
      detail: `${REQUEST_PREFIX}/item_hotel/query_detail_hotel`,
    },
    // 票务管理
    ticketing: {
      list: `${REQUEST_PREFIX}/item_ticket/query_ticket_list`,
      delete: `${REQUEST_PREFIX}/item_ticket/delete_ticket`,
      create: `${REQUEST_PREFIX}/item_ticket/add_ticket`,
      update: `${REQUEST_PREFIX}/item_ticket/update_ticket`,
      detail: `${REQUEST_PREFIX}/item_ticket/query_ticket_one`,
    },
    micro_order: {
      list: `${REQUEST_PREFIX}/order/customize/queryList`,
      detail: `${REQUEST_PREFIX}/order/customize/query`,
      audit: `${REQUEST_PREFIX}/order/customize/examineOrder`,
      selfPickup: `${REQUEST_PREFIX}/order/customize/self_pickup`, // 确认自提接口
      remark: `${REQUEST_PREFIX}/order/customize/saveOrderMsg`,
      confirm_PickUp: `${REQUEST_PREFIX}/order/customize/confirmArrival`,
    },
    staff: {
      staffList: REQUEST_PREFIX + '/employee/query',
    },
    // 订货管理 & 经销商
    purchaseOrder: {
      dealerDetail: `${REQUEST_PREFIX}/purchase/dealer/detail`, // 经销商详情
      dealerList: `${REQUEST_PREFIX}/purchase/dealer/list`, // 经销商列表
      orderConfirm: `${REQUEST_PREFIX}/purchase/order/confirm`, // 确定下单
      orderBatchConfirm: `${REQUEST_PREFIX}/purchase/order/batch_confirm`, // 批量确认
      orderDetail: `${REQUEST_PREFIX}/purchase/order/detail`, // 下单详情
      orderExport: `${REQUEST_PREFIX}/purchase/order/export`, // 下单列表导出
      dealerOrderList: `${REQUEST_PREFIX}/purchase/order/item/list`, // 经销商下单商品列表
      orderList: `${REQUEST_PREFIX}/purchase/order/list`, // 下单列表
      dealerExport: `${REQUEST_PREFIX}/purchase/order/item/export`, // 经销商下单商品导出
    },
    // 工程报价
    quote: {
      quotationList: `${REQUEST_PREFIX}/quotation/page/list`,
      quotationDetail: `${REQUEST_PREFIX}/quotation/detail`,
      quotationConfirm: `${REQUEST_PREFIX}/quotation/employee/confirm`,

      positionList: `${REQUEST_PREFIX}/dis_participate_emp/position/list`,
    },
    // 直播
    live: {
      list: `${REQUEST_PREFIX}/we/live/list`,
      detail: `${REQUEST_PREFIX}/we/live/get`,
      shelf: `${REQUEST_PREFIX}/we/live/shelf`,
      update: `${REQUEST_PREFIX}/we/live/update`,
    },
  },
  goods: {
    list(params) {
      return services.get(api.Api.goods.list, {
        action: '获取产品列表',
        params,
      });
    },
    detail(itemNo) {
      return services.get(api.Api.goods.detail, {
        action: '获取产品详情',
        params: {
          itemNo,
        },
      });
    },
  },
  card: {
    list(params) {
      return services.get(api.Api.card.list, {
        action: '获取产品列表',
        params,
      });
    },
  },
  store: {
    // 门店下的商品列表,分页
    queryList(params) {
      return services.get(api.Api.store.queryList, {
        action: '获取门店产品列表',
        params,
      });
    },
  },
};

export default api;
