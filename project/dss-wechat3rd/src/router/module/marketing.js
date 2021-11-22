import pages from '../page';
import retailPage from '../pages/retail.js';
console.log(pages);
/**
 * Created by love on 18/11/2.
 * @author trumpli<李志伟>
 */
export default {
  description: '营销中心（各个行业复用）',
  route: {
    path: '/marketing',
    redirect: '/marketing/template',
    component: pages.marketing.index,
    meta: {
      title: '营销中心',
    },
    children: [
      // 营销中心入口
      {
        path: '/marketing/template',
        component: pages.marketing.template,
        meta: {
          title: '营销中心入口',
        },
      },
      // 模板消息
      {
        path: '/marketing/message',
        component: pages.marketing.message,
        meta: {
          title: '模板消息',
        },
      },
      {
        path: '/marketing/minapp-qrcode',
        component: pages.marketing.minappQrcode.index,
        // redirect: '/marketing/minapp-qrcode/list',
        meta: {
          title: '小程序二维码',
        },
        children: [
          {
            path: '/marketing/minapp-qrcode',
            component: pages.marketing.minappQrcode.list,
            meta: {
              title: '小程序二维码列表',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/minapp-qrcode/add',
            component: pages.marketing.minappQrcode.add,
            meta: {
              title: '新增小程序二维码',
            },
          },
        ],
      },
      // 表单工具
      {
        path: '/marketing/form-utils',
        redirect: '/marketing/form-utils/list',
        component: pages.marketing.formUtils.index,
        meta: {
          title: '表单工具',
        },
        children: [
          {
            name: 'form-list',
            path: '/marketing/form-utils/list',
            component: pages.marketing.formUtils.list,
            meta: {
              title: '表单工具',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/form-utils/deleted',
            component: pages.marketing.formUtils.deleted,
            meta: {
              title: '已删除',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/form-utils/list/edit',
            component: pages.marketing.formUtils.edit,
            meta: {
              title: '编辑表单',
            },
          },
          {
            path: '/marketing/form-utils/list/submit-data',
            component: pages.marketing.formUtils.submitData,
            meta: {
              title: '提交数据',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/form-utils/list/form-data',
            component: pages.marketing.formUtils.formData,
            meta: {
              title: '表单数据',
            },
          },
          {
            path: '/marketing/form-utils/deleted/submit-data',
            component: pages.marketing.formUtils.submitData,
            meta: {
              title: '提交数据',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/form-utils/deleted/form-data',
            component: pages.marketing.formUtils.formData,
            meta: {
              title: '表单数据',
            },
          },
        ],
      },
      // 优惠券
      {
        path: '/marketing/coupon',
        // redirect: '/marketing/coupon/coupon-list',
        component: pages.marketing.coupon.index,
        meta: {
          title: '优惠券',
        },
        children: [
          {
            path: '/marketing/coupon/coupon-list',
            component: pages.marketing.coupon.couponMgr,
            meta: {
              title: '优惠券管理',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/coupon/discard',
            component: pages.marketing.coupon.discard,
            meta: {
              title: '废弃优惠券',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/coupon/plan',
            component: pages.marketing.coupon.couponPlan,
            meta: {
              title: '自动发放设置',
            },
          },
          {
            path: '/marketing/coupon/coupon-list/add',
            component: pages.marketing.coupon.couponAdd,
            meta: {
              title: '新建优惠券',
            },
          },
          {
            path: '/marketing/coupon/detail',
            component: pages.marketing.coupon.couponDetail,
            meta: {
              title: '优惠券明细',
            },
          },
          {
            path: '/marketing/coupon/verification',
            component: pages.marketing.coupon.verification,
            meta: {
              title: '优惠券核销',
            },
          },
          {
            path: '/marketing/coupon/plan/add',
            component: pages.marketing.coupon.schemeAdd,
            meta: {
              title: '新建方案',
            },
          },
          {
            path: '/marketing/coupon/coupon-list/detail',
            component: pages.marketing.coupon.detail,
            meta: {
              title: '活动详情',
            },
          },
          {
            path: '/marketing/coupon/discard/detail',
            component: pages.marketing.coupon.detail,
            meta: {
              title: '废弃活动详情',
            },
          },
        ],
      },
      // 专题活动
      {
        path: '/marketing/activities',
        // redirect: '/marketing/activities/list',
        component: retailPage.activity.index,
        meta: {
          title: '专题活动管理',
        },
        children: [
          {
            path: '/marketing/activities',
            component: retailPage.activity.list,
            meta: {
              title: '专题活动列表',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/activities/create',
            component: retailPage.activity.create,
            meta: {
              title: '新建专题活动',
            },
          },
        ],
      },
      // 拼团
      {
        path: '/marketing/pintuan',
        component: pages.marketing.group.index,
        // redirect: '/marketing/pintuan/activity',
        meta: {
          title: '拼团活动',
        },
        children: [
          {
            path: '/marketing/pintuan/activity',
            // redirect: '/marketing/pintuan/activity/list',
            component: pages.marketing.group.activityIndex,
            children: [
              {
                path: '/marketing/pintuan/activity',
                meta: {
                  title: '活动列表',
                },
                component: pages.marketing.group.activityMgr,
              },
              {
                path: '/marketing/pintuan/activity/edit',
                meta: {
                  title: '活动编辑',
                },
                component: pages.marketing.group.activityEdit,
              },
            ],
          },
          {
            path: '/marketing/pintuan/management',
            component: pages.marketing.group.mgrIndex,
            // redirect: '/marketing/pintuan/management/list',
            children: [
              {
                path: '/marketing/pintuan/management',
                meta: {
                  title: '拼团列表',
                  keepAlive: true,
                },
                component: pages.marketing.group.mgr,
              },
              // 拼团详情
              {
                path: '/marketing/pintuan/management/detail',
                meta: {
                  title: '拼团详情',
                },
                component: pages.marketing.group.mgrDetail,
              },
            ],
          },
          {
            path: '/marketing/pintuan/setting',
            meta: {
              title: '拼团设置',
            },
            component: pages.marketing.group.setting,
          },
          {
            path: '/marketing/pintuan/delete-list',
            component: pages.marketing.group.deleteList,
            meta: {
              title: '已删除的拼团',
            },
          },
          {
            path: '/marketing/pintuan/delete-list/delete-detail',
            component: pages.marketing.group.activityEdit,
            meta: {
              title: '已删除的拼团详情',
            },
          },
        ],
      },
      // 砍价
      {
        path: '/marketing/cutprice',
        component: pages.marketing.cutprice.index,
        // redirect: '/marketing/cutprice/activity',
        meta: {
          title: '砍价活动',
        },
        children: [
          {
            path: '/marketing/cutprice/activity',
            // redirect: '/marketing/cutprice/activity/list',
            component: pages.marketing.cutprice.activityIndex,
            children: [
              {
                path: '/marketing/cutprice/activity/list',
                meta: {
                  title: '活动列表',
                },
                component: pages.marketing.cutprice.activityList,
              },
              {
                path: '/marketing/cutprice/activity/edit',
                meta: {
                  title: '活动编辑',
                },
                component: pages.marketing.cutprice.activityEdit,
              },
            ],
          },
          {
            path: '/marketing/cutprice/management',
            component: pages.marketing.cutprice.mgrIndex,
            // redirect: '/marketing/cutprice/management/list',
            children: [
              {
                path: '/marketing/cutprice/management/list',
                meta: {
                  title: '砍价列表',
                  keepAlive: true,
                },
                component: pages.marketing.cutprice.mgrList,
              },
              {
                path: '/marketing/cutprice/management/detail',
                meta: {
                  title: '砍价详情',
                },
                component: pages.marketing.cutprice.mgrDetail,
              },
            ],
          },
          {
            path: '/marketing/cutprice/setting',
            meta: {
              title: '砍价设置',
            },
            component: pages.marketing.cutprice.setting,
          },
          {
            path: '/marketing/cutprice/delete',
            meta: {
              title: '已删除砍价',
            },
            component: pages.marketing.cutprice.delete,
          },
        ],
      },
      // 秒杀
      {
        path: '/marketing/seckill',
        component: pages.marketing.seckill.index,
        meta: {
          title: '限时秒杀',
        },
        // redirect: '/marketing/seckill/activity',
        children: [
          {
            path: '/marketing/seckill/activity',
            component: pages.marketing.seckill.activity,
            // redirect: '/marketing/seckill/activity/list',
            children: [
              {
                path: '/marketing/seckill/activity/list',
                component: pages.marketing.seckill.activityList,
                meta: {
                  title: '活动列表',
                  keepAlive: true,
                },
              },
              {
                path: '/marketing/seckill/activity/edit',
                component: pages.marketing.seckill.activityEdit,
                meta: {
                  title: '活动编辑',
                },
              },
            ],
          },
          {
            path: '/marketing/seckill/management',
            component: pages.marketing.seckill.mgrIndex,
            // redirect: '/marketing/seckill/management/list',
            children: [
              {
                path: '/marketing/seckill/management/list',
                meta: {
                  title: '秒杀订单',
                  keepAlive: true,
                },
                component: pages.marketing.seckill.mgr,
              },
              // 拼团详情
              {
                path: '/marketing/seckill/management/detail',
                meta: {
                  title: '秒杀详情',
                },
                component: pages.marketing.seckill.mgrDetail,
              },
            ],
          },
          {
            path: '/marketing/seckill/setting',
            component: pages.marketing.seckill.setting,
            meta: {
              title: '秒杀规则',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/seckill/delete-list',
            component: pages.marketing.seckill.deleteList,
            meta: {
              title: '已删除的秒杀',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/seckill/delete-list/delete-detail',
            component: pages.marketing.seckill.activityEdit,
            meta: {
              title: '已删除的秒杀详情',
            },
          },
        ],
      },
      // 红包
      {
        path: '/marketing/redpacket',
        // redirect: '/marketing/redpacket/redpacket-mgr',
        component: pages.marketing.redpacket.index,
        meta: {
          title: '裂变红包',
        },
        children: [
          {
            path: '/marketing/redpacket/redpacket-mgr',
            component: pages.marketing.redpacket.management,
            meta: {
              title: '裂变红包列表',
            },
          },
          {
            path: '/marketing/redpacket/redpacket-mgr/edit',
            component: pages.marketing.redpacket.edit,
            meta: {
              title: '新建红包',
            },
          },
          {
            path: '/marketing/redpacket/redpacket-log',
            component: pages.marketing.redpacket.log,
            meta: {
              title: '红包记录',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/redpacket/redpacket-cash-log',
            component: pages.marketing.redpacket.cashLog,
            meta: {
              title: '提现记录',
              keepAlive: true,
            },
          },
        ],
      },
      // 新客进店好礼
      {
        path: '/marketing/new-user-gift',
        component: pages.marketing.new_user_gift.index,
        redirect: '/marketing/new-user-gift/mgr/home',
        meta: {
          title: '新客进店好礼',
        },
        children: [
          {
            path: '/marketing/new-user-gift/mgr',
            component: pages.marketing.new_user_gift.mgr,
            redirect: '/marketing/new-user-gift/mgr/home',
            meta: {
              title: '新客进店好礼',
            },
            children: [
              {
                path: '/marketing/new-user-gift/mgr/home',
                component: pages.marketing.new_user_gift.mgrHome,
                meta: {
                  title: '新客进店好礼当前方案',
                },
              },
              {
                path: '/marketing/new-user-gift/mgr/new',
                component: pages.marketing.new_user_gift.new,
                meta: {
                  title: '新建新客进店好礼活动',
                },
              },
            ],
          },
          {
            path: '/marketing/new-user-gift/record',
            component: pages.marketing.new_user_gift.record,
            meta: {
              title: '活动记录',
              keepAlive: true,
            },
          },
        ],
      },
      // 充值卡
      {
        path: '/marketing/charge-card',
        // redirect: '/marketing/charge-card/list',
        component: pages.marketing.chargeCard.index,
        meta: {
          title: '充值卡',
        },
        children: [
          {
            path: '/marketing/charge-card/index',
            component: pages.marketing.chargeCard.index,
            // redirect: '/marketing/charge-card/list',
            children: [
              {
                path: '/marketing/charge-card/list',
                component: pages.marketing.chargeCard.list,
                meta: {
                  title: '充值卡列表',
                  keepAlive: true,
                },
              },
              {
                path: '/marketing/charge-card/add',
                component: pages.marketing.chargeCard.add,
                meta: {
                  title: '添加充值卡',
                },
              },
              {
                path: '/marketing/charge-card/deal',
                component: pages.marketing.chargeCard.deal,
                meta: {
                  title: '充值协议',
                },
              },
            ],
          },
          {
            path: '/marketing/charge-card/discard',
            component: pages.marketing.chargeCard.discard,
            meta: {
              title: '废弃充值卡',
              keepAlive: true,
            },
          },
        ],
      },
      // 全渠道二维码
      {
        path: '/marketing/qrCode',
        redirect: '/marketing/qrCode/list',
        component: pages.marketing.qrCode.index,
        meta: {
          title: '全渠道二维码',
        },
        children: [
          {
            path: '/marketing/qrCode/list',
            component: pages.marketing.qrCode.list,
            meta: {
              title: '二维码列表',
            },
          },
          {
            path: '/marketing/qrCode/add',
            component: pages.marketing.qrCode.add,
            meta: {
              title: '添加二维码',
            },
          },
        ],
      },
      // 短信群发
      {
        path: '/marketing/sms-group',
        component: pages.marketing.smsgroup.index,
        redirect: '/marketing/sms-group/home',
        meta: {
          title: '短信群发',
        },
        children: [
          {
            path: '/marketing/sms-group/home',
            component: pages.marketing.smsgroup.home,
            meta: {
              title: '短信群发',
            },
          },
          {
            path: '/marketing/sms-group/recharge',
            component: pages.marketing.smsgroup.recharge,
            meta: {
              title: '短信充值',
            },
          },
          {
            path: '/marketing/sms-group/order',
            component: pages.marketing.smsgroup.order,
            meta: {
              title: '短信订单',
            },
          },
          {
            path: '/marketing/sms-group/new',
            component: pages.marketing.smsgroup.new,
            meta: {
              title: '新建群发',
            },
          },
        ],
      },

      // 礼品卡
      {
        path: '/marketing/gift-card',
        component: pages.marketing.giftcard.index,
        // redirect: '/marketing/gift-card/mgr',
        meta: {
          title: '礼品卡',
        },
        children: [
          {
            path: '/marketing/gift-card/mgr',
            component: pages.marketing.giftcard.mgr,
            // redirect: '/marketing/gift-card/mgr/home',
            children: [
              {
                path: '/marketing/gift-card/mgr',
                component: pages.marketing.giftcard.home,
                meta: {
                  title: '礼品卡',
                  keepAlive: true,
                },
              },
              {
                path: '/marketing/gift-card/mgr/edit',
                meta: {
                  title: '添加礼品卡',
                },
                component: pages.marketing.giftcard.edit,
              },
              {
                path: '/marketing/gift-card/mgr/selling-details',
                meta: {
                  title: '礼品卡售卖详情',
                },
                component: pages.marketing.giftcard.sellingDetails,
              },
              {
                path: '/marketing/gift-card/mgr/selling-details/consumption',
                meta: {
                  title: '礼品卡消费记录',
                },
                component: pages.marketing.giftcard.consumption,
              },
            ],
          },
          {
            path: '/marketing/gift-card/background',
            component: pages.marketing.giftcard.background,
            meta: {
              title: '卡片背景',
            },
          },
          {
            path: '/marketing/gift-card/discard',
            component: pages.marketing.giftcard.discard,
            meta: {
              title: '废弃礼品卡',
              keepAlive: true,
            },
          },
        ],
      },
      // 定向群发优惠券
      {
        path: '/marketing/directional-cp',
        // redirect: '/marketing/directional-cp/directional-list',
        component: pages.marketing.directionalCoupons.index,
        meta: {
          title: '定向群发优惠券',
        },
        children: [
          {
            path: '/marketing/directional-cp',
            component: pages.marketing.directionalCoupons.list,
            meta: {
              title: '群发优惠券列表',
            },
          },
          {
            path: '/marketing/directional-cp/add',
            component: pages.marketing.directionalCoupons.add,
            meta: {
              title: '新建群发优惠券',
            },
          },
          {
            path: '/marketing/directional-cp/analysis',
            component: pages.marketing.directionalCoupons.analysis,
            meta: {
              title: '群发优惠券效果分析',
            },
          },
        ],
      },
      // 签到有礼
      {
        path: '/marketing/checkin',
        // redirect: '/marketing/checkin/list',
        component: pages.marketing.checkin.index,
        children: [
          {
            path: '/marketing/checkin',
            component: pages.marketing.checkin.list,
            meta: {
              title: '签到有礼',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/checkin/setting',
            component: pages.marketing.checkin.setting,
            meta: {
              title: '签到设置',
            },
          },
        ],
      },

      // 幸运转盘
      {
        path: '/marketing/lucky',
        // redirect: '/marketing/lucky/list',
        component: pages.marketing.lucky.index,
        meta: {
          title: '幸运转盘',
        },
        children: [
          {
            path: '/marketing/lucky',
            component: pages.marketing.lucky.list,
            meta: {
              title: '幸运转盘列表',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/lucky/add',
            component: pages.marketing.lucky.add,
            meta: {
              title: '新建幸运转盘',
            },
          },
          {
            path: '/marketing/lucky/record',
            component: pages.marketing.lucky.record,
            meta: {
              title: '抽奖记录',
            },
          },
        ],
      },
      // 下单有礼
      {
        path: '/marketing/courtesy',
        // redirect: '/marketing/courtesy/list',
        component: pages.marketing.courtesy.index,
        meta: {
          title: '下单有礼',
        },
        children: [
          {
            path: '/marketing/courtesy',
            component: pages.marketing.courtesy.list,
            meta: {
              title: '下单有礼列表',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/courtesy/add',
            component: pages.marketing.courtesy.add,
            meta: {
              title: '新增下单有礼',
            },
          },
        ],
      },
      // 加价换购
      {
        path: '/marketing/repurchase',
        redirect: '/marketing/repurchase/list',
        component: pages.marketing.repurchase.index,
        meta: {
          title: '加价换购',
        },
        children: [
          {
            path: '/marketing/repurchase/list',
            component: pages.marketing.repurchase.list,
            meta: {
              title: '加价换购列表',
            },
          },
          {
            path: '/marketing/repurchase/add',
            component: pages.marketing.repurchase.add,
            meta: {
              title: '新增加价换购',
            },
          },
        ],
      },
      // 分享有礼
      {
        path: '/marketing/share-gift',
        // redirect: '/marketing/share-gift/list',
        component: pages.marketing.sharegift.index,
        meta: {
          title: '分享有礼',
        },
        children: [
          {
            path: '/marketing/share-gift',
            component: pages.marketing.sharegift.list,
            meta: {
              title: '分享有礼列表',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/share-gift/record',
            component: pages.marketing.sharegift.record,
            meta: {
              title: '分享有礼活动记录',
            },
          },
          {
            path: '/marketing/share-gift/add',
            component: pages.marketing.sharegift.add,
            meta: {
              title: '新增分享有礼',
            },
          },
        ],
      },
      {
        path: '/marketing/task-center',
        redirect: '/marketing/task-center/list',
        component: pages.marketing.taskcenter.index,
        meta: {
          title: '任务中心',
        },
        children: [
          {
            path: '/marketing/task-center/list',
            component: pages.marketing.taskcenter.list,
            meta: {
              title: '任务中心',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/task-center/establish',
            component: pages.marketing.taskcenter.establish,
            meta: {
              title: '创建任务',
            },
          },
          {
            path: '/marketing/task-center/establish/detail',
            meta: {
              title: '任务详情',
            },
            component: pages.marketing.taskcenter.establish,
          },
          {
            path: '/marketing/task-center/operation',
            component: pages.marketing.taskcenter.operation,
            meta: {
              title: '任务记录',
            },
          },
          {
            path: '/marketing/task-center/operation/detail',
            meta: {
              title: '详情列表',
            },
            component: pages.marketing.taskcenter.operDetail,
          },
          {
            path: '/marketing/task-center/operation/cutPrice/detail',
            meta: {
              title: '砍价详情',
            },
            component: pages.marketing.taskcenter.operCutprice,
          },
          {
            path: '/marketing/task-center/operation/order/detail',
            meta: {
              title: '拼团详情',
            },
            component: pages.marketing.taskcenter.operOrder,
          },
          {
            path: '/marketing/task-center/delete',
            component: pages.marketing.taskcenter.delete,
            meta: {
              title: '已删除任务',
            },
          },
        ],
      },
      // 营销图文
      {
        path: '/marketing/marketing-graph',
        // redirect: '/marketing/marketing-graph/list',
        component: pages.marketing.marketinggraph.index,
        meta: {
          title: '营销图文',
        },
        children: [
          {
            path: '/marketing/marketing-graph/list',
            component: pages.marketing.marketinggraph.list,
            meta: {
              title: '营销图文列表',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/marketing-graph/list/add',
            component: pages.marketing.marketinggraph.add,
            meta: {
              title: '新增营销图文',
            },
          },
          {
            path: '/marketing/marketing-graph/list/preview',
            name: 'marketGraphPreview',
            component: pages.marketing.marketinggraph.preview,
            meta: {
              title: '营销图文预览',
            },
          },
          {
            name: 'marketing-graph-comment',
            path: '/marketing/marketing-graph/comment',
            component: pages.marketing.marketinggraph.comment,
            meta: {
              title: '评论管理',
              keepAlive: true,
            },
          },
        ],
      },
      // 积分商城
      {
        path: '/marketing/integral',
        // redirect: '/marketing/integral/list',
        component: pages.marketing.integral.index,
        meta: {
          title: '积分商城',
        },
        children: [
          {
            path: '/marketing/integral/list',
            component: pages.marketing.integral.list,
            meta: {
              title: '积分商城',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/integral/delete',
            component: pages.marketing.integral.deleteList,
            meta: {
              title: '已删除列表',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/integral/delete/add',
            component: pages.marketing.integral.add,
            meta: {
              title: '删除商品详情',
            },
          },
          {
            path: '/marketing/integral/list/add',
            component: pages.marketing.integral.add,
            meta: {
              title: '添加商品',
            },
          },
        ],
      },
      // 赠品专区
      {
        path: '/marketing/gift-special-area',
        // redirect: '/marketing/gift-special-area/list',
        component: pages.marketing.gift.index,
        meta: {
          title: '赠品专区',
        },
        children: [
          {
            path: '/marketing/gift-special-area/list',
            component: pages.marketing.gift.list,
            meta: {
              title: '赠品列表',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/gift-special-area/setting',
            component: pages.marketing.gift.setting,
            meta: {
              title: '赠品设置',
            },
          },
          {
            path: '/marketing/gift-special-area/delete',
            component: pages.marketing.gift.deleteList,
            meta: {
              title: '废弃赠品',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/gift-special-area/delete/detail',
            component: pages.marketing.gift.detail,
            meta: {
              title: '删除商品详情',
            },
          },
        ],
      },
      // 代金卡包
      {
        path: '/marketing/card-pack',
        // redirect: '/marketing/card-pack/list',
        component: pages.marketing.cardpack.index,
        meta: {
          title: '代金卡包',
        },
        children: [
          {
            path: '/marketing/card-pack/list',
            component: pages.marketing.cardpack.list,
            meta: {
              title: '代金卡包列表',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/card-pack/delete',
            component: pages.marketing.cardpack.delete,
            meta: {
              title: '已删除',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/card-pack/list/add',
            component: pages.marketing.cardpack.add,
            meta: {
              title: '新增卡包',
            },
          },
        ],
      },
      // 电子画册
      {
        path: '/marketing/electronic-books',
        // redirect: '/marketing/electronic-books/list',
        component: pages.marketing.pdfbooks.index,
        meta: {
          title: '电子画册',
        },
        children: [
          {
            path: '/marketing/electronic-books',
            component: pages.marketing.pdfbooks.list,
            meta: {
              title: '电子画册列表',
              keepAlive: true,
            },
          },
        ],
      },
      // 第x件y折
      {
        path: '/marketing/discount',
        // redirect: '/marketing/discount/activity/list',
        component: pages.marketing.discount.index,
        meta: {
          title: '第x件y折',
        },
        children: [
          {
            path: '/marketing/discount/activity/list',
            component: pages.marketing.discount.list,
            meta: {
              title: '列表',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/discount/activity/list/edit',
            component: pages.marketing.discount.edit,
            meta: {
              title: '编辑',
            },
          },
          {
            path: '/marketing/discount/manage',
            component: pages.marketing.discount.mgrIndex,
            redirect: '/marketing/discount/manage/list',
            // redirect: '/marketing/seckill/management/list',
            children: [
              {
                path: '/marketing/discount/manage/list',
                meta: {
                  title: '第x件y折订单',
                  keepAlive: true,
                },
                component: pages.marketing.discount.mgr,
              },
              // 拼团详情
              {
                path: '/marketing/discount/manage/detail',
                meta: {
                  title: '第x件y折详情',
                },
                component: pages.marketing.discount.mgrDetail,
              },
            ],
          },
          {
            path: '/marketing/discount/discard',
            component: pages.marketing.discount.discard,
            meta: {
              title: '废弃列表',
              keepAlive: true,
            },
          },
        ],
      },
      // 满x件优惠
      {
        path: '/marketing/full-reduction',
        // redirect: '/marketing/full-reduction/activity/list',
        component: pages.marketing.fullreduction.index,
        meta: {
          title: '满x件优惠',
        },
        children: [
          {
            path: '/marketing/full-reduction/activity/list',
            component: pages.marketing.fullreduction.list,
            meta: {
              title: '列表',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/full-reduction/activity/list/edit',
            component: pages.marketing.fullreduction.edit,
            meta: {
              title: '编辑',
            },
          },
          {
            path: '/marketing/full-reduction/manage',
            component: pages.marketing.fullreduction.mgrIndex,
            redirect: '/marketing/full-reduction/manage/list',
            // redirect: '/marketing/seckill/management/list',
            children: [
              {
                path: '/marketing/full-reduction/manage/list',
                meta: {
                  title: '第x件y折订单',
                  keepAlive: true,
                },
                component: pages.marketing.fullreduction.mgr,
              },
              // 拼团详情
              {
                path: '/marketing/full-reduction/manage/detail',
                meta: {
                  title: '第x件y折详情',
                },
                component: pages.marketing.fullreduction.mgrDetail,
              },
            ],
          },
          {
            path: '/marketing/full-reduction/discard',
            component: pages.marketing.fullreduction.discard,
            meta: {
              title: '废弃列表',
              keepAlive: true,
            },
          },
        ],
      },
      // 一口价
      {
        path: '/marketing/mouthful',
        // redirect: '/marketing/mouthful/activity/list',
        component: pages.marketing.mouthful.index,
        meta: {
          title: '一口价',
        },
        children: [
          {
            path: '/marketing/mouthful/activity/list',
            component: pages.marketing.mouthful.list,
            meta: {
              title: '列表',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/mouthful/activity/list/edit',
            component: pages.marketing.mouthful.edit,
            meta: {
              title: '编辑',
            },
          },
          {
            path: '/marketing/mouthful/manage',
            component: pages.marketing.mouthful.mgrIndex,
            redirect: '/marketing/mouthful/manage/list',
            // redirect: '/marketing/seckill/management/list',
            children: [
              {
                path: '/marketing/mouthful/manage/list',
                meta: {
                  title: '第x件y折订单',
                  keepAlive: true,
                },
                component: pages.marketing.mouthful.mgr,
              },
              // 拼团详情
              {
                path: '/marketing/mouthful/manage/detail',
                meta: {
                  title: '第x件y折详情',
                },
                component: pages.marketing.mouthful.mgrDetail,
              },
            ],
          },
          {
            path: '/marketing/mouthful/discard',
            component: pages.marketing.mouthful.discard,
            meta: {
              title: '废弃列表',
              keepAlive: true,
            },
          },
        ],
      },
      // 微装
      {
        path: '/marketing/micro-decorate',
        // redirect: '/marketing/micro-decorate/list',
        component: pages.marketing.microdecorate.index,
        meta: {
          title: '微装',
        },
        children: [
          {
            path: '/marketing/micro-decorate/list',
            component: pages.marketing.microdecorate.list,
            meta: {
              title: '微装方案',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/micro-decorate/list/add',
            component: pages.marketing.microdecorate.add,
            meta: {
              title: '新增方案',
            },
          },
          {
            path: '/marketing/micro-decorate/delete',
            component: pages.marketing.microdecorate.delete,
            meta: {
              title: '已删除方案',
            },
          },
        ],
      },

      {
        path: '/marketing/score-set-off',
        component: pages.marketing.scoreSetOff.index,
        meta: {
          title: '积分抵现',
        },
      },
      // 直播
      {
        path: '/marketing/live',
        redirect: '/marketing/live/list',
        component: pages.marketing.live.index,
        meta: {
          title: '直播',
        },
        children: [
          {
            path: '/marketing/live/list',
            component: pages.marketing.live.list,
            meta: {
              title: '直播方案',
              keepAlive: true,
            },
          },
          {
            path: '/marketing/live/detail',
            component: pages.marketing.live.detail,
            meta: {
              title: '直播详情',
            },
          },
        ],
      },
      // 积分兑钱
      {
        path: '/marketing/exchange-money',
        redirect: '/marketing/exchange-money/list',
        component: pages.marketing.exchangeMoney.index,
        meta: {
          title: '积分兑钱',
        },
        children: [
          {
            path: '/marketing/exchange-money/list',
            component: pages.marketing.exchangeMoney.list,
            meta: {
              title: '积分兑钱',
            },
          },
          {
            path: '/marketing/exchange-money/record',
            component: pages.marketing.exchangeMoney.record,
            meta: {
              title: '积分兑钱记录',
            },
          },
          {
            path: '/marketing/exchange-money/detail',
            component: pages.marketing.exchangeMoney.detail,
            meta: {
              title: '编辑积分积分兑钱规则',
            },
          },
        ],
      },
    ],
  },
};
