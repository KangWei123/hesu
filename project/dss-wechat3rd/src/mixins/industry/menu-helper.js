import beautifyMenu from '../../menu/beautify.js';
import tourismMenu from '../../menu/tourism.js';
import estateMenu from '../../menu/estate.js';
import retailMenu from '../../menu/retail.js';
import medicineMenu from '../../menu/medicine.js';
import arrow from '../../menu/arrow.js';
import scopeMenuEnum from '@/business-common/scopeMenuEnum';

export default {
  getWkbMenu() {
    let firstMenu = null;

    if (this.env.BEAUTIFUL) {
      firstMenu = beautifyMenu.normal;
    } else if (this.env.TOURISM) {
      firstMenu = tourismMenu.normal();
    } else if (this.env.MEDICINE) {
      firstMenu = medicineMenu.normal();
    } else if (this.env.ESTATE) {
      firstMenu = estateMenu.normal();
    } else if (this.env.RETAIL) {
      firstMenu = retailMenu.normal();
    } else {
      //fixme 兜底，跟零售一样
      firstMenu = retailMenu.normal();
    }

    //中骏项目添加菜单
    if (this.isZhongJun) {
      const obj = {
        url: '/square',
        name: '商户管理',
        icon: 'icon-warehouse'
      };
      firstMenu.splice(2, 0, obj);
    }
    return firstMenu;
  },

  // 订单管理
  getOrderMenu() {
    const orderListMenu = [
      {
        path: '/order/list',
        name: '商品订单',
        breadcrumbs: [
          {
            path: '/order/list/detail',
            name: '订单详情',
            dark: true
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbOrderMgrMenu.goods_order,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      }
    ];
    const orderMenu = [
      {
        path: '/storedVal/list',
        name: '储值列表',
        breadcrumbs: [
          {
            path: '/storedVal/list/detail',
            name: '订单详情',
            dark: true
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbOrderMgrMenu.charge_order,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        path: '/giftCard/list',
        name: '礼品卡列表',
        breadcrumbs: [
          {
            path: '/giftCard/list/detail',
            name: '订单详情',
            dark: true
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbOrderMgrMenu.gift_card_order,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        path: '/card-pack/list',
        name: '代金卡包订单',
        breadcrumbs: [
          {
            path: '/card-pack/list/detail',
            name: '代金卡包详情',
            dark: true
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbOrderMgrMenu.cash_card_order,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        path: '/refund/list',
        name: '退款列表',
        breadcrumbs: [
          {
            path: '/refund/list/detail',
            name: '订单详情',
            dark: true
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbOrderMgrMenu.refund_order,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        path: '/offline/list',
        name: '线下订单',
        breadcrumbs: [
          {
            path: '/offline/list/detail',
            name: '订单详情',
            dark: true
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbOrderMgrMenu.offline_order,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      }
      /* {
        path: '/analysis/overview',
        name: '分析报表'
      } */
    ];
    if (this.env.TOURISM) {
      const tourismOrderMenus = [
        {
          path: '/hotel-order/list',
          name: '客房订单',
          breadcrumbs: [
            {
              path: '/hotel-order/list/detail',
              name: '订单详情'
            }
          ]
        },
        {
          path: '/ticket-order/list',
          name: '票务订单',
          breadcrumbs: [
            {
              path: '/ticket-order/list/detail',
              name: '订单详情'
            }
          ]
        }
      ];
      orderMenu.unshift(...tourismOrderMenus);
    }
    if (this.env.MEDICINE) {
      const medicineOrderMenus = [
        {
          path: '/micro-order/list',
          name: '订购订单',
          breadcrumbs: [
            {
              path: '/micro-order/list/detail',
              name: '订单详情'
            }
          ]
        }
      ];
      orderMenu.unshift(...medicineOrderMenus);
    }
    orderMenu.unshift(...orderListMenu);
    return orderMenu;
  },

  // 系统设置
  getSettingMenu() {
    const settingMenu = [
      {
        url: '/basic-data',
        name: '基础资料',
        identifier: scopeMenuEnum.dictionary.settingsChildMenu.basic_info,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        url: '/function-buy',
        name: '功能订购',
        identifier: scopeMenuEnum.dictionary.settingsChildMenu.func_buy,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        url: '/invoice-setting',
        name: '发票设置',
        identifier: scopeMenuEnum.dictionary.settingsChildMenu.invoice,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        url: '/general-setting',
        name: '通用设置',
        identifier: scopeMenuEnum.dictionary.settingsChildMenu.common_setting,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        url: '/sorting',
        name: '清分管理',
        identifier: scopeMenuEnum.dictionary.settingsChildMenu.distribution_mgr,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      }
      // {
      //   url: '/assets',
      //   name: '资产管理'
      // }
    ];
    if (this.env.TOURISM) {
      const tourismSettingMenu = [
        {
          url: '/ticket',
          name: '票务设置'
        }
      ];
      settingMenu.push(...tourismSettingMenu);
    }
    if (this.env.ESTATE) {
      const estateSettingMenu = [
        {
          url: '/estate-deal',
          name: '电子协议'
        }
      ];
      settingMenu.push(...estateSettingMenu);
    }
    return settingMenu;
  },

  // 营销工具
  mGetMarketingMenu() {
    const marketingMenus = [
      {
        name: '新客好礼',
        path: 'new-user-gift',
        children: [
          {
            name: '新客好礼',
            path: 'mgr'
          },
          {
            name: '活动记录',
            path: 'record'
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.new_guest_gift,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      // {
      //   name: '全渠道二维码',
      //   path: 'qrCode',
      //   breadcrumbs: [
      //     {
      //       path: 'qrCode/add',
      //       name: '添加二维码'
      //     }
      //   ]
      // },
      {
        name: '充值卡',
        path: 'charge-card',
        children: [
          {
            name: '充值卡',
            path: 'list'
          },
          {
            name: '废弃充值卡',
            path: 'discard'
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.recharge_card,
        disabled: false,
        disableTip: '该角色暂无权限访问'
        // breadcrumbs: [
        //   {
        //     path: 'charge-card/add',
        //     name: '添加充值卡'
        //   },
        //   {
        //     path: 'charge-card/deal',
        //     name: '充值协议',
        //     showBorder: true
        //   }
        // ]
      },
      {
        name: '专题活动',
        path: 'activities',
        breadcrumbs: [
          {
            path: 'activities/create',
            name: '新建专题活动'
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.topic_activity,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        name: '优惠券',
        path: 'coupon',
        children: [
          {
            name: '优惠券列表',
            path: 'coupon-list',
            breadcrumbs: [
              {
                path: 'coupon-list/add',
                name: '新建优惠券'
              },
              {
                path: 'coupon-list/detail',
                name: '活动详情'
              }
            ]
          },
          {
            name: '自动发放设置',
            path: 'plan',
            breadcrumbs: [
              {
                path: 'coupon/plan/add',
                name: '新建方案'
              }
            ]
          },
          {
            name: '废弃优惠券',
            path: 'discard',
            breadcrumbs: [
              {
                path: 'coupon/discard/detail',
                name: '废弃活动详情'
              }
            ]
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.coupon,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        name: '群发优惠券',
        path: 'directional-cp',
        showBorder: true,
        breadcrumbs: [
          {
            path: 'directional-cp/add',
            name: '新建群发'
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.coupon_batch_manage,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        name: '营销图文',
        path: 'marketing-graph',
        showBorder: true,
        children: [
          {
            path: 'list',
            name: '营销图文',
            breadcrumbs: [
              {
                path: '/list/add',
                name: '新建营销图文'
              }
            ]
          },
          {
            path: 'comment',
            name: '评论管理'
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.marketing_graphic,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        name: '积分商城',
        path: 'integral',
        children: [
          {
            path: 'list',
            name: '积分商城',
            breadcrumbs: [
              {
                path: 'integral/list/add',
                name: '添加商品',
                showBorder: true
              }
            ]
          },
          {
            path: 'delete',
            name: '已删除列表',
            breadcrumbs: [
              {
                path: 'integral/delete/add',
                name: '添加商品',
                showBorder: true
              }
            ]
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.integral_shop,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        name: '赠品专区',
        path: 'gift-special-area',
        children: [
          {
            path: 'list',
            name: '赠品列表',
            breadcrumbs: [
              {
                path: 'gift-special-area/list/detail',
                name: '赠品详情',
                showBorder: true
              }
            ]
          },

          {
            path: 'setting',
            name: '赠品设置'
          },
          {
            path: 'delete',
            name: '废弃赠品',
            breadcrumbs: [
              {
                path: 'gift-special-area/delete/detail',
                name: '赠品详情',
                showBorder: true
              }
            ]
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.mdjy_wscyx_zpzq,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        name: '代金卡包',
        path: 'card-pack',
        children: [
          {
            path: 'list',
            name: '卡包列表',
            breadcrumbs: [
              {
                path: 'add',
                name: '新增方案',
                showBorder: true
              }
            ]
          },

          {
            path: 'delete',
            name: '已删除'
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.yxzx_wscyx_djkb,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },

      {
        name: '电子画册',
        path: 'electronic-books',
        breadcrumbs: [
          {
            path: 'electronic-books/list',
            name: '电子画册'
          }
        ]
      },

      {
        name: '微装',
        path: 'micro-decorate',
        children: [
          {
            path: 'list',
            name: '微装方案',
            breadcrumbs: [
              {
                path: 'micro-decorate/list/add',
                name: '新增方案',
                showBorder: true
              }
            ]
          },

          {
            path: 'delete',
            name: '已删除方案'
          }
        ]
      },
      {
        name: '签到有礼',
        path: 'checkin',
        breadcrumbs: [
          {
            name: '签到有礼',
            path: 'checkin/list',
            showBorder: true
          },
          {
            name: '签到设置',
            path: 'checkin/setting'
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.sign_in_polite,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        name: '幸运转盘',
        path: 'lucky',
        showBorder: true,
        breadcrumbs: [
          {
            path: 'lucky/add',
            name: '新建幸运转盘'
          },
          {
            path: 'lucky/list',
            name: '幸运转盘列表',
            showBorder: true
          },
          {
            path: 'lucky/lucker/list',
            name: '抽奖记录'
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.lucky_guy,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },

      {
        name: '下单有礼',
        path: 'courtesy',
        breadcrumbs: [
          {
            path: 'courtesy/list',
            name: '下单有礼'
          },
          {
            path: 'courtesy/add',
            name: '新建下单有礼',
            showBorder: true
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.order_courtesy,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        name: '拼团',
        path: 'pintuan',
        children: [
          {
            name: '活动管理',
            path: 'activity'
          },
          {
            name: '拼团列表',
            path: 'management'
          },
          {
            name: '拼团设置',
            path: 'setting'
          },
          {
            name: '已删除的拼团',
            path: 'delete-list'
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.pt,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        name: '砍价',
        path: 'cutprice',
        children: [
          {
            name: '活动管理',
            path: 'activity'
          },
          {
            name: '砍价列表',
            path: 'management'
          },
          {
            name: '砍价设置',
            path: 'setting'
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.bargain,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        name: '秒杀',
        path: 'seckill',
        children: [
          {
            name: '活动管理',
            path: 'activity'
          },
          {
            name: '秒杀订单',
            path: 'management'
          },
          {
            name: '秒杀设置',
            path: 'setting'
          },
          {
            name: '已删除的秒杀',
            path: 'delete-list'
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.seconds_kill,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        name: '裂变红包',
        path: 'redpacket',
        children: [
          {
            name: '裂变红包列表',
            path: 'redpacket-mgr'
          },
          {
            name: '红包记录',
            path: 'redpacket-log'
          },
          {
            name: '提现记录',
            path: 'redpacket-cash-log'
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.fission_red_envelope,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        name: '礼品卡',
        path: 'gift-card',
        children: [
          {
            name: '礼品卡',
            path: 'mgr'
          },
          {
            name: '卡片背景',
            path: 'background'
          },
          {
            name: '废弃礼品卡',
            path: 'discard'
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.gift_card,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        name: '分享有礼',
        path: 'share-gift',
        breadcrumbs: [
          {
            path: 'share-gift/list',
            name: '分享有礼'
          },
          {
            path: 'share-gift/add',
            name: '新建分享有礼',
            showBorder: true
          }
        ],
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.sharing_courtesy,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        name: '品牌代言人',
        path: 'task-center',
        showBorder: true,
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.yxzx_wscyx_ppdy,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        name: '第x件y折',
        path: 'discount',
        children: [
          {
            name: '活动管理',
            path: 'activity/list'
          },
          // {
          //   name: '活动订单',
          //   path: 'management'
          // },
          {
            name: '已删除的活动',
            path: 'discard'
          }
        ]
      },
      {
        name: '满x件优惠',
        path: 'full-reduction',
        children: [
          {
            name: '活动管理',
            path: 'activity/list'
          },
          // {
          //   name: '活动订单',
          //   path: 'management'
          // },
          {
            name: '已删除的活动',
            path: 'discard'
          }
        ]
      },
      {
        name: '一口价',
        path: 'mouthful',
        children: [
          {
            name: '活动管理',
            path: 'activity/list'
          },
          // {
          //   name: '活动订单',
          //   path: 'management'
          // },
          {
            name: '已删除的活动',
            path: 'discard'
          }
        ]
      },

      {
        name: '服务通知',
        path: 'message',
        showBorder: true,
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.service_notification,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        name: '小程序二维码',
        path: 'minapp-qrcode',
        showBorder: true,
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.applet_qr_code,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      },
      {
        name: '表单工具',
        path: 'form-utils',
        showBorder: true,
        identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbMaMarketingMgrMenu.form_tool,
        disabled: false,
        disableTip: '该角色暂无权限访问'
      }
      // {
      //   name: '短信群发',
      //   path: 'sms-group',
      //   showBorder: true,
      //   breadcrumbs: [
      //     {
      //       path: 'sms-group/new',
      //       name: '新建群发'
      //     },
      //     {
      //       path: 'sms-group/recharge',
      //       name: '短信充值'
      //     },
      //     {
      //       path: 'sms-group/order',
      //       name: '短信订单'
      //     }
      //   ]
      // }
    ];
    if (this.isByx) {
      marketingMenus.splice(10, 0, {
        name: '加价换购',
        path: 'repurchase',
        breadcrumbs: [
          {
            path: 'repurchase/list',
            name: '加价换购'
          },
          {
            path: 'repurchase/add',
            name: '新建加价换购',
            showBorder: true
          }
        ]
      });
    }
    if (this.env.BEAUTIFUL) {
      marketingMenus.splice(3, 1);
    }
    return marketingMenus;
  }
};
