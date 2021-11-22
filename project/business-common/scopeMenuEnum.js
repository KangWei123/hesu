export default {
  dictionary: {
    wkbMenu: 'wkb',
    dmpMenu: 'customer',
    shanhuMenu: 'shanhu',
    customerMenu: 'customer',
    marketingMenu: 'marketing',
    analysisMenu: 'analysis',
    storeMenu: 'store',
    companyMenu: 'company',
    settingsMenu: 'settings',
    messagesMenu: 'message',
    wkbChildMenu: {
      console: 'wkb:console',
      goods_mgr: 'wkb:goods_mgr',
      merchant: 'wkb:merchant',
      feedback: 'wkb:feedback',
      score_mgr: 'wkb:score_mgr',
      appoint_mgr: 'wkb:appoint_mgr',
      hotel_mgr: 'wkb:hotel_mgr',
      ticketing_mgr: 'wkb:ticketing_mgr',
      estate_goods_mgr: 'wkb:estate_goods_mgr',
      estate_order_mgr: 'wkb:estate_order_mgr',
      ma_decorate: 'wkb:ma_decorate',
      ma_marketing: 'wkb:ma_marketing',
      order_mgr: 'wkb:order_mgr',
      order_goods: 'wkb:order_goods',
      quote: 'wkb:project_quote',
      warehouse: 'wkb:warehouse',
      wx_setting: 'wkb:wx_setting',
      // distribution: 'marketing:distribution',
      distribution: 'wkb:distribution',
      store: 'wkb:store',
      park_mgr: 'wkb:park_mgr',
      project_mgr: 'wkb:project',
      ky_activity_mgr: 'wkb:ky_activity',
      relative_verify: 'wkb:relative_verify',
      wkbGoodsMgrMenu: {
        goods_list: 'wkb:goods_mgr:goods_list',
        combine_goods: 'wkb:goods_mgr:combine_goods',
        gift_list: 'wkb:gift_mgr:gift_list',
        classify_mgr: 'wkb:goods_mgr:classify_mgr',
        custom_classify_mgr: 'wkb:goods_mgr:custom_classify_mgr',
        store_shelf: 'wkb:goods_mgr:store_shelf',
        comment_mgr: 'wkb:goods_mgr:comment_mgr',
        goodsListButton: {
          goods_manage: 'wkb:goods_mgr:goods_list:goods_manage',
          abandoned_goods: 'wkb:goods_mgr:goods_list:abandoned_goods',
          goods_list_paramter_template: 'wkb:goods_mgr:goods_list:goods_list_paramter_template',
          goods_list_answer_template: 'wkb:goods_mgr:goods_list:goods_list_answer_template',
          server: 'wkb:goods_mgr:goods_list:server',
          card: 'wkb:goods_mgr:goods_list:card',
          product: 'wkb:goods_mgr:goods_list:product',
          quote_product_list: 'wkb:goods_mgr:goods_list:quote_product_list',
        },
        combineGoodsButton: {
          goods_manager: 'wkb:goods_mgr:combine_goods:goods_manager',
          combine_abandoned_goods: 'wkb:goods_mgr:combine_goods:combine_abandoned_goods',
        },
        giftGoodsButton: {
          gifts_list_detail: 'wkb:goods_mgr:gift_mgr:gift_list:gifts_list_detail',
          edit_gift: 'wkb:goods_mgr:gift_mgr:gift_list:edit_gift',
          shelf_gift: 'wkb:goods_mgr:gift_mgr:gift_list:shelf_gift',
        },
        storeShelfMenu: {
          store_goods: 'wkb:goods_mgr:store_shelf:store_goods',
          store_combine_goods: 'wkb:goods_mgr:store_shelf:store_combine_goods',
          store_gift: 'wkb:goods_mgr:store_shelf:store_gift',
          shelf_server: 'wkb:goods_mgr:store_shelf:shelf_server',
          shelf_product: 'wkb:goods_mgr:store_shelf:shelf_product',
          goodsButton: {
            store_goods_show: 'wkb:goods_mgr:store_shelf:store_goods:store_goods_show',
            store_shelf_goods: 'wkb:goods_mgr:store_shelf:store_goods:store_shelf_goods',
            store_price_goods: 'wkb:goods_mgr:store_shelf:store_goods:store_price_goods',
            store_goods_edit: 'wkb:goods_mgr:store_shelf:store_goods:store_goods_edit',
          },
          combineButton: {
            store_combine_goods_show: 'wkb:goods_mgr:store_shelf:store_combine_goods:store_combine_goods_show',
            store_shelf_combine: 'wkb:goods_mgr:store_shelf:store_combine_goods:store_shelf_combine',
            store_price_combine: 'wkb:goods_mgr:store_shelf:store_combine_goods:store_price_combine',
            store_combine_goods_edit: 'wkb:goods_mgr:store_shelf:store_combine_goods:store_combine_goods_edit',
          },
          giftButton: {
            store_gift_show: 'wkb:goods_mgr:store_shelf:store_gift:store_gift_show',
            store_shelf_gift: 'wkb:goods_mgr:store_shelf:store_gift:store_shelf_gift',
            store_gift_edit: 'wkb:goods_mgr:store_shelf:store_gift:store_gift_edit',
          },
          serverButoon: {
            server_goods_show: 'wkb:goods_mgr:store_shelf:shelf_server:server_goods_show',
            server_shelf_goods: 'wkb:goods_mgr:store_shelf:shelf_server:server_shelf_goods',
            server_price_goods: 'wkb:goods_mgr:store_shelf:shelf_server:server_price_goods',
            server_goods_edit: 'wkb:goods_mgr:store_shelf:shelf_server:server_goods_edit',
          },
          productButoon: {
            product_goods_show: 'wkb:goods_mgr:store_shelf:shelf_product:product_goods_show',
            product_shelf_goods: 'wkb:goods_mgr:store_shelf:shelf_product:product_shelf_goods',
            product_price_goods: 'wkb:goods_mgr:store_shelf:shelf_product:product_price_goods',
            product_goods_edit: 'wkb:goods_mgr:store_shelf:shelf_product:product_goods_edit',
          },
        },
      },

      wkbScoreMgrMenu: {
        customer: 'wkb:score_mgr:score_mgr_customer',
        picture: 'wkb:score_mgr:score_mgr_picture',
      },

      wkbEstateOrderMgrMenu: {
        goodsOrderButton: {
          import_order_order: 'wkb:estate_order_mgr:import_order_order',
        },
      },
      wkbWareHouseMenu: {
        inventory_query: 'wkb:warehouse:inventory_query',
        inbound: 'wkb:warehouse:inbound',
        outbound: 'wkb:warehouse:outbound',
        inventory_verification: 'wkb:warehouse:inventory_verification',
        iobound_detail: 'wkb:warehouse:iobound_detail',
        supplier_mgr: 'wkb:warehouse:supplier_mgr',
        stock_mgr: 'wkb:warehouse:stock_mgr',
        logistics_setting: 'wkb:warehouse:logistics_setting',
      },
      wkbOrderMgrMenu: {
        goods_order: 'wkb:order_mgr:goods_order',
        charge_order: 'wkb:order_mgr:charge_order',
        gift_card_order: 'wkb:order_mgr:gift_card_order',
        cash_card_order: 'wkb:order_mgr:cash_card_order',
        refund_order: 'wkb:order_mgr:refund_order',
        offline_order: 'wkb:order_mgr:offline_order',
        order_broker: 'wkb:order_mgr:order_broker',
        goodsOrderButton: {
          goods_order_query: 'wkb:order_mgr:goods_order:goods_order_query',
          import_goods_order: 'wkb:order_mgr:goods_order:import_goods_order',
          shipping_action: 'wkb:order_mgr:goods_order:shipping_action',
        },
        chargeOrderButton: {
          import_charge_order: 'wkb:order_mgr:charge_order:import_charge_order',
          charge_order_show: 'wkb:order_mgr:charge_order:charge_order_show',
        },
        giftCardOrderButton: {
          import_gift_card_order: 'wkb:order_mgr:gift_card_order:import_gift_card_order',
          gift_card_order_show: 'wkb:order_mgr:gift_card_order:gift_card_order_show',
        },
        cashCardOrderButton: {
          cash_card_export_excel: 'wkb:order_mgr:cash_card_order:cash_card_export_excel',
          cash_card_order_show: 'wkb:order_mgr:cash_card_order:cash_card_order_show',
        },
        refundOrderButton: {
          import_refund_order: 'wkb:order_mgr:refund_order:import_refund_order',
          refund_order_show: 'wkb:order_mgr:refund_order:refund_order_show',
          refund_action: 'wkb:order_mgr:refund_order:refund_action',
        },
        offlineOrderButton: {
          import_offline_order: 'wkb:order_mgr:offline_order:import_offline_order',
          offline_order_show: 'wkb:order_mgr:offline_order:offline_order_show',
        },
      },
      wkbMaMarketingMgrMenu: {
        pt: 'wkb:ma_marketing:pt',
        yxzx_wscyx_ppdy: 'wkb:ma_marketing:yxzx_wscyx_ppdy',
        yxzx_wscyx_djkb: 'wkb:ma_marketing:yxzx_wscyx_djkb',
        form_tool: 'wkb:ma_marketing:form_tool',
        applet_qr_code: 'wkb:ma_marketing:applet_qr_code',
        service_notification: 'wkb:ma_marketing:service_notification',
        sharing_courtesy: 'wkb:ma_marketing:sharing_courtesy',
        gift_card: 'wkb:ma_marketing:gift_card',
        fission_red_envelope: 'wkb:ma_marketing:fission_red_envelope',
        seconds_kill: 'wkb:ma_marketing:seconds_kill',
        bargain: 'wkb:ma_marketing:bargain',
        new_guest_gift: 'wkb:ma_marketing:new_guest_gift',
        order_courtesy: 'wkb:ma_marketing:order_courtesy',
        lucky_guy: 'wkb:ma_marketing:lucky_guy',
        sign_in_polite: 'wkb:ma_marketing:sign_in_polite',
        integral_shop: 'wkb:ma_marketing:integral_shop',
        marketing_graphic: 'wkb:ma_marketing:marketing_graphic',
        coupon_batch_manage: 'wkb:ma_marketing:coupon_batch_manage',
        coupon: 'wkb:ma_marketing:coupon',
        topic_activity: 'wkb:ma_marketing:topic_activity',
        recharge_card: 'wkb:ma_marketing:recharge_card',
        mdjy_wscyx_zpzq: 'wkb:ma_marketing:mdjy_wscyx_zpzq',
      },
      wkbWxSettingMenu: {
        ma_setting: 'wkb:wx_setting:ma_setting',
        wx_card: 'wkb:wx_setting:wx_card',
        wx_pay: 'wkb:wx_setting:wx_pay',
        wx_pay_transfers: 'wkb:wx_setting:wx_pay_transfers',
        mp_setting: 'wkb:wx_setting:mp_setting',
        wx_qy: 'wkb:wx_setting:wx_qy',

        clientButton: {
          client_applet_authorization_show:
            'wkb:wx_setting:ma_setting:client_applet_authorization:client_applet_authorization_show',
          client_applet_authorization_edit:
            'wkb:wx_setting:ma_setting:client_applet_authorization:client_applet_authorization_edit',
          employee_applet_authorization_show:
            'wkb:wx_setting:ma_setting:mp_user_deal:employee_applet_authorization_show',
          employee_applet_authorization_edit:
            'wkb:wx_setting:ma_setting:mp_user_deal:employee_applet_authorization_edit',
        },
        wxCardButton: {
          wx_card_edit: 'wkb:wx_setting:wx_card:wx_card_edit',
        },
        wxPayButton: {
          wx_pay_edit: 'wkb:wx_setting:wx_pay:wx_pay_edit',
        },
        wxPayTransfersButton: {
          wx_pay_transfers_edit: 'wkb:wx_setting:wx_pay_transfers:wx_pay_transfers_edit',
        },
        settingButton: {
          mp_setting_edit: 'wkb:wx_setting:mp_setting:mp_setting_edit',
        },
        wxQyButton: {
          wx_qy_edit: 'wkb:wx_setting:wx_qy:wx_qy_edit',
        },
      },
      wkbHomedecorateMenu: {
        ma_home: 'wkb:ma_decorate:ma_home',
        ma_mine_center: 'wkb:ma_decorate:ma_mine_center',
        ma_custom_page: 'wkb:ma_decorate:ma_custom_page',
        ma_nav: 'wkb:ma_decorate:ma_nav',
        ma_cart_style: 'wkb:ma_decorate:ma_cart_style',
        ma_classify_nav: 'wkb:ma_decorate:ma_classify_nav',
        ma_func_switch: 'wkb:ma_decorate:ma_func_switch',
        /** 新增小程序设置菜单   糅合主页导航、购物车设置、功能开关页面 */
        ma_decorate_setup: 'wkb:ma_decorate:ma_decorate_setup',

        maHomeButton: {
          ma_home_template: 'wkb:ma_decorate:ma_home:ma_home_template',
          ma_store_home: 'wkb:ma_decorate:ma_home:ma_store_home',
        },
      },
      wkbHotelMgrMenu: {
        rooms_mgr: 'wkb:hotel_mgr:rooms_mgr',
        hotel_shelf_list: 'wkb:hotel_mgr:hotel_shelf_list',
        hotel_comment_mgr: 'wkb:hotel_mgr:hotel_comment_mgr',
      },
      wkbTicketingMgrMenu: {
        mgr_ticket: 'wkb:ticketing_mgr:mgr_ticket',
        ticket_shelf_list: 'wkb:ticketing_mgr:ticket_shelf_list',
        ticket_comment_mgr: 'wkb:ticketing_mgr:ticket_comment_mgr',
      },
      wkbDistributionMenu: {
        staff_manage: 'wkb:distribution:staff_manage',
        performance_statistics: 'wkb:distribution:performance_statistics',
        commission_settlement: 'wkb:distribution:commission_settlement',
        internal_purchase: 'wkb:distribution:internal_purchase',
        all_marketing: 'wkb:distribution:all_marketing',
      },
      wkbEstateMgrMenu: {
        building_list: 'wkb:estate_goods_mgr:building_list',
        shelf_list: 'wkb:estate_goods_mgr:shelf_list',
        comment_list: 'wkb:estate_goods_mgr:comment_list',
      },
      wkbBusinessMenu: {
        account: 'wkb:business_coupon:business_coupon_account',
      },
    },
    settingsChildMenu: {
      basic_info: 'settings:basic_info',
      common_setting: 'settings:common_setting',
      invoice: 'settings:invoice',
      distribution_mgr: 'settings:distribution_mgr',
      func_buy: 'settings:func_buy',
      ticket: 'settings:ticket',
      estate_deal: 'settings:estate_deal',
    },
    dmpChildMenu: {
      member_center: 'customer:member_center',
      level_center: 'customer:level_center',
      rights_center: 'customer:rights_center',
      score_center: 'customer:score_center',
      manage_center: 'customer:manage',
      portrait: 'customer:portrait',
      elders: 'customer:elders',
    },
    shanhuChildMenu: {
      inventory: 'shanhu:inventory',
    },
    companyChildMenu: {
      dealer_center: 'company:dealer_center',
      store_center: 'company:store_center',
      guide_center: 'company:guide_center',
      storeCenterChildMenu: {
        qygl_qygl_mdgl_mdgl_ck: 'company:company_mgr:store_mgr:store_manage:qygl_qygl_mdgl_mdgl_ck',
        store_manage_edit: 'company:company_mgr:store_mgr:store_manage:store_manage_edit',
        store_manage_export: 'company:company_mgr:store_mgr:store_manage:store_manage_export',
        store_manage_add: 'company:company_mgr:store_mgr:store_manage:store_manage_add',
        organizationPropertyButton: {
          org_property_query: 'company:company_mgr:store_mgr:store_org_attr:org_property_query',
          org_property_add: 'company:company_mgr:store_mgr:store_org_attr:org_property_add',
          org_property_edit: 'company:company_mgr:store_mgr:store_org_attr:org_property_edit',
          org_property_delete: 'company:company_mgr:store_mgr:store_org_attr:org_property_delete',
        },
      },
      orgCenterChildMenu: {
        qygl_qygl_mdgl_mdgl_ck: 'company:company_mgr:org_mgr:org_manage:qygl_qygl_mdgl_mdgl_ck',
        org_manage_edit: 'company:company_mgr:org_mgr:org_manage:org_manage_edit',
        org_manage_export: 'company:company_mgr:org_mgr:org_manage:org_manage_export',
        org_manage_add: 'company:company_mgr:org_mgr:org_manage:org_manage_add',
      },
      staff_center: 'company:staff_center',
      staffCenterChildMenu: {
        employeeButton: {
          qygl_qygl_mdgl_yggl_ck: 'company:staff_center:qygl_qygl_mdgl_yggl_ck',
          employee_manage_edit: 'company:staff_center:employee_manage_edit',
          employee_manage_export: 'company:staff_center:employee_manage_export',
        },
      },
      role_center: 'company:role_center',
      setting_center: 'company:setting_center',
      app_center: 'company:app_center',
      log_center: 'company:log_center',
      wx_setting: 'company:wx_setting',
      brand_setting: 'company:brand_setting',
      access_log: 'company:access_log',
      white_setting: 'company:white_setting',
      wkbWxSettingMenu: {
        ma_setting: 'company:wx_setting:ma_setting',
        wx_card: 'company:wx_setting:wx_card',
        wx_pay: 'company:wx_setting:wx_pay',
        wx_pay_transfers: 'company:wx_setting:wx_pay_transfers',
        mp_setting: 'company:wx_setting:mp_setting',
        wx_qy: 'company:wx_setting:wx_qy',

        clientButton: {
          client_applet_authorization_show:
            'company:wx_setting:ma_setting:client_applet_authorization:client_applet_authorization_show',
          client_applet_authorization_edit:
            'company:wx_setting:ma_setting:client_applet_authorization:client_applet_authorization_edit',
          employee_applet_authorization_show:
            'company:wx_setting:ma_setting:mp_user_deal:employee_applet_authorization_show',
          employee_applet_authorization_edit:
            'company:wx_setting:ma_setting:mp_user_deal:employee_applet_authorization_edit',
        },
        wxCardButton: {
          wx_card_edit: 'company:wx_setting:wx_card:wx_card_edit',
        },
        wxPayButton: {
          wx_pay_edit: 'company:wx_setting:wx_pay:wx_pay_edit',
        },
        wxPayTransfersButton: {
          wx_pay_transfers_edit: 'company:wx_setting:wx_pay_transfers:wx_pay_transfers_edit',
        },
        settingButton: {
          mp_setting_edit: 'company:wx_setting:mp_setting:mp_setting_edit',
        },
        wxQyButton: {
          wx_qy_edit: 'company:wx_setting:wx_qy:wx_qy_edit',
        },
      },

      // 品牌设置相关菜单标识
      brandSettingMenu: {
        basic_info: 'company:brand_setting:basic_info',
        common_setting: 'company:brand_setting:common_setting',
        invoice: 'company:brand_setting:invoice',
        distribution_mgr: 'company:brand_setting:distribution_mgr',
        func_buy: 'company:brand_setting:func_buy',
        ticket: 'company:brand_setting:ticket',
        estate_deal: 'company:brand_setting:estate_deal',
      },
    },
  },
  disabledTip: '该角色暂无权限访问',
  disabledBtnTip: '该角色暂无权限操作',
  getMenuScopeByIdentifier(scopeMenuList, identifier) {
    let identifierList = [];
    if (identifier && identifier.indexOf(':') !== -1) {
      identifierList = identifier.split(':');
    } else {
      identifierList = [identifier];
    }
    let copyMenuList = scopeMenuList;
    let menu = null;
    identifierList.forEach(key => {
      menu = copyMenuList
        ? copyMenuList.find(item => {
            return item.identifier === key;
          })
        : null;
      copyMenuList = menu ? menu.childMenu : null;
    });
    return menu;
  },
};
