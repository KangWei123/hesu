/* eslint-disable */

export default {
  cashier: () => import('../views/cashier/index.vue'),
  console: () => import('../views/console/index.vue'),
  forwardEntry: () => import('../views/forwardEntry/index.vue'),

  square: {
    index: () => import('../views/square/index.vue'),
    merchant: () => import('../views/square/merchant/index.vue'),
    add: () => import('../views/square/merchant/add-merchant.vue'),
    view: () => import('../views/square/merchant/view-merchant.vue'),
    floor: {
      list: () => import('../views/square/floor/list.vue'),
      edit: () => import('../views/square/floor/edit.vue'),
    },
    category: {
      list: () => import('../views/square/category/list.vue'),
    },
  },

  largeMemScore: {
    index: () => import('../views/large-mem-score/index.vue'),
    customer: () => import('../views/large-mem-score/customer/index.vue'),
    editCustomer: () => import('../views/large-mem-score/customer/edit.vue'),
    picture: () => import('../views/large-mem-score/picture/index.vue'),
    detail: () => import('../views/large-mem-score/picture/detail.vue'),
    config: () => import('../views/large-mem-score/picture/config.vue'),
    rule: () => import('../views/large-mem-score/rule/index.vue'),
    ruleEdit: () => import('../views/large-mem-score/rule/edit.vue'),
    noFeeling: () => import('../views/large-mem-score/no-feeling/index.vue'),
    noFeelingPay: () => import('../views/large-mem-score/no-feeling/setting.vue'),
    list: () => import('../views/large-mem-score/list/index.vue'),
  },

  feedback: {
    index: () => import('../views/feedback/index.vue'),
    list: () => import('../views/feedback/list.vue'),
    set: () => import('../views/feedback/quick-reply.vue'),
  },

  startup: {
    index: () => import(/* webpackChunkName: "startup" */ '../views/StartUp/index.vue'),
    create: () => import(/* webpackChunkName: "startup" */ '../views/StartUp/Create.vue'),
    template: () => import(/* webpackChunkName: "startup" */ '../views/StartUp/template-list.vue'),
    industry: () => import(/* webpackChunkName: "startup" */ '../views/StartUp/Industry.vue'),
    chose: () => import(/* webpackChunkName: "startup" */ '../views/StartUp/Chose.vue'),
    order: () => import(/* webpackChunkName: "startup" */ '../views/StartUp/Order.vue'),
    pay: () => import(/* webpackChunkName: "startup" */ '../views/StartUp/Pay.vue'),
  },

  setting: {
    index: () => import(/* webpackChunkName: "setting" */ '../views/setting/index.vue'),
    app: () => import(/* webpackChunkName: "setting" */ '../views/setting/app/index.vue'),
    wx: {
      index: () => import(/* webpackChunkName: "setting" */ '../views/setting/wx/index.vue'),
      mp: () => import(/* webpackChunkName: "setting" */ '../views/setting/wx/mp/index.vue'),
      version: () => import(/* webpackChunkName: "setting" */ '../views/setting/wx/mp/version.vue'),
      user_deal: () => import(/* webpackChunkName: "setting" */ '../views/setting/wx/mp/version-staff.vue'),
      pc: () => import(/* webpackChunkName: "setting" */ '../views/setting/wx/pc/index.vue'),
      pay: () => import(/* webpackChunkName: "setting" */ '../views/setting/wx/pay/index.vue'),
      card: () => import(/* webpackChunkName: "setting" */ '../views/setting/wx/card/index.vue'),
      cardCourse: () => import(/* webpackChunkName: "setting" */ '../views/setting/wx/card/course.vue'),
      qy: () => import(/* webpackChunkName: "setting" */ '../views/setting/wx/qy/index.vue'),
      clientAuth: () => import(/* webpackChunkName: "setting" */ '../views/setting/wx/qy/client-auth.vue'),
      authList: () => import(/* webpackChunkName: "setting" */ '../views/setting/wx/qy/auth-list.vue'),
      communicateAuth: () =>
        import(/* webpackChunkName: "setting" */ '../views/setting/wx/qy/auth/communicateAuth.vue'),
      mpAuth: () => import(/* webpackChunkName: "setting" */ '../views/setting/wx/qy/auth/mpAuth.vue'),
      clientApplicationAuth: () =>
        import(/* webpackChunkName: "setting" */ '../views/setting/wx/qy/auth/clientAuth.vue'),
      authReturn: () => import(/* webpackChunkName: "setting" */ '../views/setting/wx/qy/authReturn.vue'),
    },
    appointment: () => import(/* webpackChunkName: "setting" */ '../views/setting/appointment/index.vue'),
    homedecorate: {
      index: () => import(/* webpackChunkName: "store-mgr" */ '../views/setting/homedecorate/index.vue'),
      miniIndex: () => import(/* webpackChunkName: "store-mgr" */ '../views/setting/homedecorate/mini-index/index.vue'),
      miniIndexTemplate: () =>
        import(/* webpackChunkName: "store-mgr" */ '../views/setting/homedecorate/mini-index/decorate-template.vue'),
      storeIndex: () =>
        import(/* webpackChunkName: "store-mgr" */ '../views/setting/homedecorate/mini-index/store-index.vue'),
      customPage: () =>
        import(/* webpackChunkName: "store-mgr" */ '../views/setting/homedecorate/custom-page/index.vue'),
      homepageNav: () =>
        import(/* webpackChunkName: "store-mgr" */ '../views/setting/homedecorate/homepage-nav/index.vue'),
      storeLink: () => import(/* webpackChunkName: "store-mgr" */ '../views/setting/homedecorate/store-link/index.vue'),
      decorate: () => import(/* webpackChunkName: "store-mgr" */ '../views/setting/homedecorate/decorate/index.vue'),
      mineDecorate: () =>
        import(/* webpackChunkName: "store-mgr" */ '../views/setting/homedecorate/mine-decorate/multi-mine.vue'),
      parkDecorate: () =>
        import(/* webpackChunkName: "store-mgr" */ '../views/setting/homedecorate/park-decorate/index.vue'),
      mineDecorateDetail: () =>
        import(/* webpackChunkName: "store-mgr" */ '../views/setting/homedecorate/mine-decorate/index.vue'),
      shoppingCartStyle: () =>
        import(/* webpackChunkName: "store-mgr" */ '../views/setting/homedecorate/shopping-cart-style/index.vue'),
      floorGuide: () => import('../views/setting/homedecorate/floor-guide/index.vue'),
      categoryNav: () =>
        import(/* webpackChunkName: "store-mgr" */ '../views/setting/homedecorate/category-nav/index.vue'),
      auxiliaryFunctionSwitch: () =>
        import(/* webpackChunkName: "store-mgr" */ '../views/setting/homedecorate/auxiliary-function-switch/index.vue'),
      preview: () => import(/* webpackChunkName: "store-mgr" */ '../views/setting/homedecorate/mini-index/preview.vue'),

      /** 新增小程序设置菜单 */
      setup: () => import(/* webpackChunkName: "store-mgr" */ '../views/setting/homedecorate/setup/index.vue'),
    },
  },
  goodsMgr: {
    index: () => import(/* webpackChunkName: "goods-mgr" */ '../views/goods/index.vue'),
    list: () => import(/* webpackChunkName: "goods-mgr" */ '../views/goods/goods-manage/list/index.vue'),
    server: () => import(/* webpackChunkName: "goods-mgr" */ '../views/goods/goods-manage/list/server/index.vue'),
    card: () => import(/* webpackChunkName: "goods-mgr" */ '../views/goods/goods-manage/list/card/index.vue'),
    product: () => import(/* webpackChunkName: "goods-mgr" */ '../views/goods/goods-manage/list/product/index.vue'),
    add: () => import(/* webpackChunkName: "goods-mgr" */ '../views/goods/goods-manage/add/index.vue'),
    addServer: () => import(/* webpackChunkName: "goods-mgr" */ '../views/goods/goods-manage/add/server/index.vue'),
    addCard: () => import(/* webpackChunkName: "goods-mgr" */ '../views/goods/goods-manage/add/card/index.vue'),
    addProduct: () => import(/* webpackChunkName: "goods-mgr" */ '../views/goods/goods-manage/add/product/index.vue'),
    labelManage: () => import(/* webpackChunkName: "goods-mgr" */ '../views/label/index.vue'),
    patchShelves: () =>
      import(/* webpackChunkName: "goods-mgr" */ '../views/goods/goods-manage/patch-shelves/index.vue'),
  },
  goodsShelf: {
    list: {
      index: () => import(/* webpackChunkName: "goods-shelf" */ '../views/goods/goods-shelf/list/index.vue'),
      server: () => import(/* webpackChunkName: "goods-shelf" */ '../views/goods/goods-shelf/list/server/index.vue'),
      card: () => import(/* webpackChunkName: "goods-shelf" */ '../views/goods/goods-shelf/list/card/index.vue'),
      product: () => import(/* webpackChunkName: "goods-shelf" */ '../views/goods/goods-shelf/list/product/index.vue'),
    },
    detail: {
      index: () => import(/* webpackChunkName: "goods-shelf" */ '../views/goods/goods-shelf/detail/index.vue'),
      server: () => import(/* webpackChunkName: "goods-shelf" */ '../views/goods/goods-shelf/detail/server/index.vue'),
      card: () => import(/* webpackChunkName: "goods-shelf" */ '../views/goods/goods-shelf/detail/card/index.vue'),
      product: () =>
        import(/* webpackChunkName: "goods-shelf" */ '../views/goods/goods-shelf/detail/product/index.vue'),
    },
  },
  appointMgr: {
    index: () => import('../views/appointment/index.vue'),
    list: () => import('../views/appointment/list.vue'),
  },
  order: {
    list: {
      index: () => import(/* webpackChunkName: "order-mgr" */ '../views/order/index.vue'),
      orderList: () => import(/* webpackChunkName: "order-mgr" */ '../views/order/order-list/index.vue'),
      refundList: () => import(/* webpackChunkName: "order-mgr" */ '../views/order/refund-list/index.vue'),
      storedValList: () => import(/* webpackChunkName: "order-mgr" */ '../views/order/storedVal-list/index.vue'),
      giftCardList: () => import(/* webpackChunkName: "order-mgr" */ '../views/order/giftCard-list/index.vue'),
      offlineList: () => import(/* webpackChunkName: "order-mgr" */ '../views/order/offline-list/index.vue'),
      cardPackList: () => import(/* webpackChunkName: "order-mgr" */ '../views/order/card-pack-list/index.vue'),
      broker: () => import(/* webpackChunkName: "order-mgr" */ '../views/order-broker/list.vue'),
      brokerDetail: () => import(/* webpackChunkName: "order-mgr" */ '../views/order-broker/detail.vue'),
    },
    detail: {
      detail: () => import(/* webpackChunkName: "order-mgr" */ '../views/order/detail/order-detail.vue'),
      refundDetail: () => import(/* webpackChunkName: "order-mgr" */ '../views/order/detail/refund-detail.vue'),
    },
    analysis: () => import(/* webpackChunkName: "order-mgr" */ '../views/order/analysis/index.vue'),
  },
  orderGoods: {
    index: () => import(/* webpackChunkName: "order-goods" */ '../views/order-goods/index'),
    booking: {
      list: () => import(/* webpackChunkName: "order-goods" */ '../views/order-goods/booking/list'),
      detail: () => import(/* webpackChunkName: "order-goods" */ '../views/order-goods/booking/detail'),
    },
    dealer: {
      list: () => import(/* webpackChunkName: "order-goods" */ '../views/order-goods/dealer/list'),
      detail: () => import(/* webpackChunkName: "order-goods" */ '../views/order-goods/dealer/detail'),
    },
  },
  // 工程报价
  quote: {
    index: () => import(/* webpackChunkName: "quote" */ '../views/quote/index'),
    quotation: {
      list: () => import(/* webpackChunkName: "quote" */ '../views/quote/quotation/list'),
      detail: () => import(/* webpackChunkName: "quote" */ '../views/quote/quotation/detail'),
    },
    employee: {
      list: () => import(/* webpackChunkName: "quote" */ '../views/quote/employee/list'),
    },
  },
  hotelOrder: {
    list: () => import(/* webpackChunkName: "hotel-order-mgr" */ '../views/order/hotel-order/list/index.vue'),
    detail: () => import(/* webpackChunkName: "hotel-order-mgr" */ '../views/order/hotel-order/detail/index.vue'),
  },
  ticketOrder: {
    list: () => import(/* webpackChunkName: "ticket-order-mgr" */ '../views/order/ticket-order/list/index.vue'),
    detail: () => import(/* webpackChunkName: "ticket-order-mgr" */ '../views/order/ticket-order/detail/index.vue'),
  },
  microOrder: {
    list: () => import(/* webpackChunkName: "micro-order-mgr" */ '../views/order/micro-order/list/index.vue'),
    detail: () => import(/* webpackChunkName: "micro-order-mgr" */ '../views/order/micro-order/detail/index.vue'),
  },
  marketing: {
    template: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/template.vue'),
    index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/index.vue'),
    message: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/message/index.vue'),
    minappQrcode: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/minapp-qrcode/index.vue'),
      list: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/minapp-qrcode/list.vue'),
      add: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/minapp-qrcode/add.vue'),
    },
    // 表单工具
    formUtils: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/form-utils/index.vue'),
      list: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/form-utils/list.vue'),
      deleted: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/form-utils/deleted.vue'),
      edit: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/form-utils/edit.vue'),
      submitData: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/form-utils/submit-data.vue'),
      formData: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/form-utils/form-data.vue'),
    },
    chargeCard: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/charge-card/index.vue'),
      list: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/charge-card/list.vue'),
      add: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/charge-card/add.vue'),
      deal: () => import(/* webpackChunkName: "setting" */ '../views/marketing/charge-card/deal.vue'),
      discard: () => import(/* webpackChunkName: "setting" */ '../views/marketing/charge-card/discard.vue'),
    },
    qrCode: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/qrCode/index.vue'),
      list: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/qrCode/list.vue'),
      add: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/qrCode/add.vue'),
    },

    directionalCoupons: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/directional-coupons/index.vue'),
      list: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/directional-coupons/list.vue'),
      add: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/directional-coupons/add.vue'),
      analysis: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/directional-coupons/analysis.vue'),
    },

    coupon: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/coupon/index.vue'),
      couponMgr: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/coupon/couponmgr/index.vue'),
      discard: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/coupon/couponmgr/discard.vue'),
      couponPlan: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/coupon/couponplan/index.vue'),
      couponAdd: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/coupon/couponmgr/add/index.vue'),
      schemeAdd: () =>
        import(/* webpackChunkName: "marketing" */ '../views/marketing/coupon/couponplan/scheme/index.vue'),
      detail: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/coupon/analysis/index.vue'),
      verification: () =>
        import(/* webpackChunkName: "marketing" */ '../views/marketing/coupon/verification/index.vue'),
      couponDetail: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/coupon/detail/index.vue'),
    },
    group: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/pintuan/index.vue'),

      setting: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/pintuan/setting.vue'),

      deleteList: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/pintuan/delete-list.vue'),

      mgr: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/pintuan/manage/manage.vue'),
      mgrIndex: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/pintuan/manage/index.vue'),
      mgrDetail: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/pintuan/manage/detail.vue'),

      activityIndex: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/pintuan/activity/index.vue'),
      activityMgr: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/pintuan/activity/List'),
      activityEdit: () =>
        import(/* webpackChunkName: "marketing" */ '../views/marketing/pintuan/activity/Edit/index.vue'),
    },
    cutprice: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/cutprice/index.vue'),

      activityIndex: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/cutprice/activity/index.vue'),
      activityList: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/cutprice/activity/list.vue'),
      activityEdit: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/cutprice/activity/edit.vue'),

      mgrIndex: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/cutprice/manage/index.vue'),
      mgrList: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/cutprice/manage/mgr-list.vue'),
      mgrDetail: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/cutprice/manage/detail.vue'),

      setting: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/cutprice/setting.vue'),
      delete: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/cutprice/activity/delete-list.vue'),
    },
    seckill: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/seckill/index.vue'),
      activity: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/seckill/activity/index.vue'),
      activityList: () =>
        import(/* webpackChunkName: "marketing" */ '../views/marketing/seckill/activity/list/index.vue'),
      activityEdit: () =>
        import(/* webpackChunkName: "marketing" */ '../views/marketing/seckill/activity/edit/index.vue'),
      setting: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/seckill/setting.vue'),
      deleteList: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/seckill/delete-list.vue'),

      mgr: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/seckill/manage/manage.vue'),
      mgrIndex: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/seckill/manage/index.vue'),
      mgrDetail: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/seckill/manage/detail.vue'),
    },
    redpacket: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/redpacket/index.vue'),
      management: () =>
        import(/* webpackChunkName: "marketing" */ '../views/marketing/redpacket/redpacket-mgr/index.vue'),
      edit: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/redpacket/redpacket-mgr/edit.vue'),
      log: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/redpacket/redpacket-log/index.vue'),
      cashLog: () =>
        import(/* webpackChunkName: "marketing" */ '../views/marketing/redpacket/redpacket-cash-log/index.vue'),
    },
    new_user_gift: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/new-user-gift/index.vue'),
      mgr: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/new-user-gift/mgr.vue'),
      mgrHome: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/new-user-gift/home/home.vue'),
      new: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/new-user-gift/new/index.vue'),
      record: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/new-user-gift/record/index.vue'),
    },
    smsgroup: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/sms-group/index.vue'),
      home: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/sms-group/home/index.vue'),
      record: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/sms-group/home/record-table.vue'),
      recharge: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/sms-group/recharge/index.vue'),
      order: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/sms-group/order/index.vue'),
      new: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/sms-group/new/index.vue'),
    },
    giftcard: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/gift-card/index.vue'),
      mgr: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/gift-card/mgr.vue'),
      home: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/gift-card/home.vue'),
      background: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/gift-card/backgroud.vue'),
      edit: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/gift-card/edit.vue'),
      sellingDetails: () =>
        import(/* webpackChunkName: "marketing" */ '../views/marketing/gift-card/selling-details.vue'),
      consumption: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/gift-card/consumption.vue'),
      discard: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/gift-card/discard.vue'),
    },
    // 签到有礼
    checkin: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/checkin/index.vue'),
      list: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/checkin/list.vue'),
      setting: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/checkin/setting.vue'),
    },
    // 幸运转盘
    lucky: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/lucky/index.vue'),
      list: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/lucky/list.vue'),
      add: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/lucky/add.vue'),
      record: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/lucky/record.vue'),
    },
    //下单有礼
    courtesy: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/courtesy/index.vue'),
      list: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/courtesy/list.vue'),
      add: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/courtesy/add.vue'),
    },
    //加价换购
    repurchase: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/repurchase/index.vue'),
      list: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/repurchase/list.vue'),
      add: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/repurchase/add.vue'),
    },
    //分享有礼
    sharegift: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/share-gift/index.vue'),
      list: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/share-gift/list.vue'),
      record: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/share-gift/record.vue'),
      add: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/share-gift/add.vue'),
    },
    //任务中心
    taskcenter: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/task-center/index.vue'),
      list: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/task-center/list/index.vue'),
      delete: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/task-center/delete/index.vue'),
      //记录及订单详情
      operation: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/task-center/operation/index.vue'),
      operDetail: () =>
        import(/* webpackChunkName: "marketing" */ '../views/marketing/task-center/operation/detail/index'),
      operCutprice: () =>
        import(
          /* webpackChunkName: "marketing" */ '../views/marketing/task-center/operation/detail/components/cutPrice/detail'
        ),
      operOrder: () =>
        import(/* webpackChunkName: "marketing" */ '../views/marketing/task-center/components/order-detail/index.vue'),
      //创建/编辑/详情
      establish: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/task-center/establish/index.vue'),
      esbDetail: () =>
        import(/* webpackChunkName: "marketing" */ '../views/marketing/task-center/establish/detail.vue'),
    },
    //营销图文
    marketinggraph: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/marketing-graph/index.vue'),
      list: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/marketing-graph/list.vue'),
      add: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/marketing-graph/add.vue'),
      comment: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/marketing-graph/comment.vue'),
      preview: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/marketing-graph/preview.vue'),
    },
    // 积分商城
    integral: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/integral/index.vue'),
      list: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/integral/list.vue'),
      add: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/integral/add.vue'),
      deleteList: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/integral/delete-list.vue'),
    },
    // 赠品专区
    gift: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/gift-special-area/index.vue'),
      list: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/gift-special-area/list.vue'),
      setting: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/gift-special-area/setting.vue'),
      detail: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/gift-special-area/detail.vue'),
      deleteList: () =>
        import(/* webpackChunkName: "marketing" */ '../views/marketing/gift-special-area/delete-list.vue'),
    },
    // 代金卡包
    cardpack: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/card-pack/index.vue'),
      list: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/card-pack/list.vue'),
      add: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/card-pack/add.vue'),
      delete: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/card-pack/delete.vue'),
    },
    // 电子画册
    pdfbooks: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/electronic-books/index.vue'),
      list: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/electronic-books/list.vue'),
    },
    //第x件y折
    discount: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/discount/index.vue'),
      list: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/discount/activity/list/index.vue'),
      edit: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/discount/activity/edit/index.vue'),
      mgrIndex: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/discount/manage/index.vue'),
      mgr: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/discount/manage/list.vue'),
      mgrDetail: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/discount/manage/detail.vue'),
      discard: () =>
        import(/* webpackChunkName: "marketing" */ '../views/marketing/discount/activity/discard/index.vue'),
    },
    //满x件优惠
    fullreduction: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/full-reduction/index.vue'),
      list: () =>
        import(/* webpackChunkName: "marketing" */ '../views/marketing/full-reduction/activity/list/index.vue'),
      edit: () =>
        import(/* webpackChunkName: "marketing" */ '../views/marketing/full-reduction/activity/edit/index.vue'),
      mgrIndex: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/full-reduction/manage/index.vue'),
      mgr: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/full-reduction/manage/list.vue'),
      mgrDetail: () =>
        import(/* webpackChunkName: "marketing" */ '../views/marketing/full-reduction/manage/detail.vue'),
      discard: () =>
        import(/* webpackChunkName: "marketing" */ '../views/marketing/full-reduction/activity/discard/index.vue'),
    },
    //一口价
    mouthful: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/mouthful/index.vue'),
      list: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/mouthful/activity/list/index.vue'),
      edit: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/mouthful/activity/edit/index.vue'),
      mgrIndex: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/mouthful/manage/index.vue'),
      mgr: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/mouthful/manage/list.vue'),
      mgrDetail: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/mouthful/manage/detail.vue'),
      discard: () =>
        import(/* webpackChunkName: "marketing" */ '../views/marketing/mouthful/activity/discard/index.vue'),
    },
    // 微装
    microdecorate: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/micro-decorate/index.vue'),
      list: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/micro-decorate/list.vue'),
      delete: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/micro-decorate/delete.vue'),
      add: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/micro-decorate/add.vue'),
    },
    // 直播
    live: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/live/index.vue'),
      list: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/live/list.vue'),
      detail: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/live/detail.vue'),
    },
    //积分抵现
    scoreSetOff: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/score-set-off/index.vue'),
    },
    //积分兑钱
    exchangeMoney: {
      index: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/exchange-money/index.vue'),
      list: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/exchange-money/list.vue'),
      detail: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/exchange-money/detail.vue'),
      record: () => import(/* webpackChunkName: "marketing" */ '../views/marketing/exchange-money/record.vue'),
    },
  },

  // 全员营销
  distribution: {
    index: () => import(/* webpackChunkName: "distribution" */ '../views/distribution/index.vue'),
    // 员工管理
    staffManage: {
      index: () => import(/* webpackChunkName: "distribution" */ '../views/distribution/staff-manage/index.vue'),
      all: () => import(/* webpackChunkName: "distribution" */ '../views/distribution/staff-manage/all.vue'),
      marketing: () =>
        import(/* webpackChunkName: "distribution" */ '../views/distribution/staff-manage/marketing.vue'),
      purchase: () => import(/* webpackChunkName: "distribution" */ '../views/distribution/staff-manage/purchase.vue'),
      employee: () => import(/* webpackChunkName: "distribution" */ '../views/distribution/staff-manage/employee.vue'),
    },
    // 业绩统计
    performanceStatistic: {
      index: () =>
        import(/* webpackChunkName: "distribution" */ '../views/distribution/performance-statistic/index.vue'),
      marketing: () =>
        import(/* webpackChunkName: "distribution" */ '../views/distribution/performance-statistic/marketing.vue'),
      purchase: () =>
        import(/* webpackChunkName: "distribution" */ '../views/distribution/performance-statistic/purchase.vue'),
      orderDetail: () =>
        import(/* webpackChunkName: "distribution" */ '../views/distribution/performance-statistic/order-detail.vue'),
    },
    // 佣金结算
    commissionSettlement: {
      index: () =>
        import(/* webpackChunkName: "distribution" */ '../views/distribution/commission-settlement/index.vue'),
      marketing: () =>
        import(/* webpackChunkName: "distribution" */ '../views/distribution/commission-settlement/marketing.vue'),
      setting: () =>
        import(/* webpackChunkName: "distribution" */ '../views/distribution/commission-settlement/setting.vue'),
      purchase: () =>
        import(/* webpackChunkName: "distribution" */ '../views/distribution/commission-settlement/purchase.vue'),
    },
    // 员工内购
    internalPurchase: {
      index: () => import(/* webpackChunkName: "distribution" */ '../views/distribution/internal-purchase/index.vue'),
      goodsSetting: () =>
        import(/* webpackChunkName: "distribution" */ '../views/distribution/internal-purchase/goods-setting.vue'),
      voucherSetting: () =>
        import(/* webpackChunkName: "distribution" */ '../views/distribution/internal-purchase/voucher-setting.vue'),
      ruleSetting: () =>
        import(/* webpackChunkName: "distribution" */ '../views/distribution/internal-purchase/rule-setting.vue'),
    },
    // 全员营销
    allMarketing: {
      index: () => import(/* webpackChunkName: "distribution" */ '../views/distribution/all-marketing/index.vue'),
      goodsSetting: () =>
        import(/* webpackChunkName: "distribution" */ '../views/distribution/all-marketing/goods-setting.vue'),
      ruleSetting: () =>
        import(/* webpackChunkName: "distribution" */ '../views/distribution/all-marketing/rule-setting.vue'),
    },
  },

  park: {
    parkConfig: {},
    parkOrder: {
      index: '../views/park-order/index.vue',
    },
  },
};
