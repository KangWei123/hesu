import Vue from 'vue';
import Router from 'vue-router';
import pages from './page';
import marketing from './module/marketing';
import setting from './module/setting';
import settingWx from './module/setting-wx';
import settingDecorate from './module/setting-decorate';
import startup from './module/startup';
import order from './module/order';
import retailGoodsMgr from './module/retail/goods-mgr';
import retailGoods from './module/retail/create-goods';
import retailActivity from './module/retail/activity';
import retailWareHouse from './module/retail/warehouse';
import distribution from './module/distribution';
import coupon from './module/coupon';
import retailPage from './pages/retail';
import estate from './module/estate';
import tourism from './module/tourism';
import passenger from './module/passenger';
import activity from './module/activity';
import merchants from './module/merchants';
import park from './module/park';
import { activityRoute, projectRoute, verifyElderMembersRoute, elderSpaceRoute } from '@/register/kangyang';
import Noop from '@/dss-common/components/noop';

Vue.use(Router);

const routes = [
  {
    path: '/',
  },
  {
    path: '/403',
    component: pages.forwardEntry,
    meta: {
      title: '403',
    },
  },
  {
    path: '/cashier',
    component: pages.cashier,
    meta: {
      title: '收银台',
    },
  },
  {
    path: '/console',
    component: pages.console,
    meta: {
      title: '控制台',
    },
  },
  {
    path: '/square',
    redirect: '/square/merchant',
    component: pages.square.index,
    meta: {
      title: '商户管理',
    },
    children: [
      {
        path: '/square/merchant',
        component: Noop,
        meta: {
          title: '商户',
        },
        children: [
          {
            path: '/square/merchant',
            component: pages.square.merchant,
            meta: {
              title: '商户列表',
            },
          },
          {
            path: '/square/merchant/add',
            component: pages.square.add,
            meta: {
              title: '添加商户',
              bread: true,
              backUrl: '/square/merchant',
            },
          },
          {
            path: '/square/merchant/edit',
            component: pages.square.add,
            meta: {
              title: '编辑商户',
              bread: true,
            },
          },
          {
            path: '/square/merchant/view',
            component: pages.square.view,
            meta: {
              title: '查看商户',
              bread: true,
            },
          },
        ],
      },
      {
        path: '/square/floor',
        component: Noop,
        meta: {
          title: '楼层管理',
        },
        children: [
          {
            path: '/square/floor',
            component: pages.square.floor.list,
            meta: {
              title: '楼层列表',
            },
          },
          {
            path: '/square/floor/edit',
            component: pages.square.floor.edit,
            meta: {
              title: '编辑楼层',
              bread: true,
              backUrl: '/square/floor',
            },
          },
        ],
      },
      {
        path: '/square/category',
        component: pages.square.category.list,
        meta: {
          title: '经营类目管理',
        },
      },
    ],
  },
  {
    path: '/largeMemScore',
    redirect: '/largeMemScore/customer',
    component: pages.largeMemScore.index,
    meta: {
      title: '积分管理',
    },
    children: [
      {
        path: '/largeMemScore/customer',
        redirect: '/largeMemScore/customer/list',
        component: Noop,
        children: [
          {
            path: '/largeMemScore/customer/list',
            component: pages.largeMemScore.customer,
            meta: {
              title: '服务台积分列表',
            },
          },
          {
            path: '/largeMemScore/customer/edit',
            component: pages.largeMemScore.editCustomer,
            meta: {
              title: '录入积分',
              bread: true,
              backUrl: '/largeMemScore/customer/list',
            },
          },
        ],
      },
      {
        path: '/largeMemScore/picture',
        redirect: '/largeMemScore/picture/list',
        component: Noop,
        children: [
          {
            path: '/largeMemScore/picture/list',
            component: pages.largeMemScore.picture,
          },
          {
            path: '/largeMemScore/picture/detail',
            component: pages.largeMemScore.detail,
            meta: {
              title: '拍照积分详情',
            },
          },
          {
            path: '/largeMemScore/picture/config',
            component: pages.largeMemScore.config,
            meta: {
              title: '快速回复配置',
              bread: true,
              backUrl: '/largeMemScore/picture/list',
            },
          },
        ],
      },
      {
        path: '/largeMemScore/rule',
        redirect: '/largeMemScore/rule/list',
        component: Noop,
        children: [
          {
            path: '/largeMemScore/rule/list',
            component: pages.largeMemScore.rule,
            meta: {
              title: '积分规则列表',
            },
          },
          {
            path: '/largeMemScore/rule/edit',
            component: pages.largeMemScore.ruleEdit,
            meta: {
              title: '编辑积分规则',
              bread: true,
              backUrl: '/largeMemScore/rule/list',
            },
          },
        ],
      },
      {
        path: '/largeMemScore/no-feeling',
        redirect: '/largeMemScore/no-feeling/list',
        component: Noop,
        meta: {
          title: '无感积分',
        },
        children: [
          {
            path: '/largeMemScore/no-feeling/list',
            component: pages.largeMemScore.noFeeling,
            meta: {
              title: '无感积分列表',
            },
          },
          {
            path: '/largeMemScore/no-feeling/setting',
            component: pages.largeMemScore.noFeelingPay,
            meta: {
              title: '无感支付配置',
              bread: true,
              backUrl: '/largeMemScore/no-feeling/list',
            },
          },
        ],
      },
      {
        path: '/largeMemScore/list',
        component: pages.largeMemScore.list,
        meta: {
          title: '线下积分记录',
        },
      },
    ],
  },
  {
    path: '/feedback',
    component: pages.feedback.index,
    redirect: '/feedback/list',
    meta: {
      title: '意见反馈',
    },
    children: [
      {
        path: '/feedback/list',
        component: pages.feedback.list,
        meta: {
          title: '意见反馈列表',
        },
      },
      {
        path: '/feedback/feedbackSet',
        component: pages.feedback.set,
        meta: {
          title: '配置快捷回复',
          bread: true,
          backUrl: '/feedback/list',
        },
      },
    ],
  },
  {
    path: '/beauty/goods-mgr',
    redirect: '/beauty/goods-mgr/goods',
    component: pages.goodsMgr.index,
    meta: {
      title: '商品管理',
    },
    children: [
      {
        path: '/beauty/goods-mgr/goods',
        redirect: '/beauty/goods-mgr/goods/server',
        component: pages.goodsMgr.list,
        meta: {
          title: '商品列表',
        },
        children: [
          {
            path: '/beauty/goods-mgr/goods/server',
            component: pages.goodsMgr.server,
            meta: {
              title: '服务管理',
              keepAlive: true,
            },
          },
          {
            path: '/beauty/goods-mgr/goods/card',
            component: pages.goodsMgr.card,
            meta: {
              title: '卡项管理',
              keepAlive: true,
            },
          },
          {
            path: '/beauty/goods-mgr/goods/product',
            component: pages.goodsMgr.product,
            meta: {
              title: '产品管理',
              keepAlive: true,
            },
          },
          {
            path: '/beauty/goods-mgr/goods/server/add',
            component: pages.goodsMgr.addServer,
            meta: {
              title: '添加服务',
            },
          },
          {
            path: '/beauty/goods-mgr/goods/card/add',
            component: pages.goodsMgr.addCard,
            meta: {
              title: '添加卡项',
            },
          },
          {
            path: '/beauty/goods-mgr/goods/product/add',
            component: pages.goodsMgr.addProduct,
            meta: {
              title: '添加产品',
            },
          },
          {
            path: '/beauty/goods-mgr/goods/product/label-manage',
            component: pages.goodsMgr.labelManage,
            meta: {
              title: '管理标签',
            },
          },
          {
            path: '/beauty/goods-mgr/goods/server/label-manage',
            component: pages.goodsMgr.labelManage,
            meta: {
              title: '管理标签',
            },
          },
          {
            path: '/beauty/goods-mgr/goods/product/patch-shelves',
            component: pages.goodsMgr.patchShelves,
            meta: {
              title: '门店上下架',
            },
          },
          {
            path: '/beauty/goods-mgr/goods/server/patch-shelves',
            component: pages.goodsMgr.patchShelves,
            meta: {
              title: '门店上下架',
            },
          },
        ],
      },
      {
        path: '/beauty/goods-mgr/classfiy',
        component: retailPage.goodsMgr.classfiy.index,
        redirect: '/beauty/goods-mgr/classfiy/Pm',
        meta: {
          title: '分类管理',
        },
        children: [
          {
            path: '/beauty/goods-mgr/classfiy/Pm',
            component: retailPage.goodsMgr.classfiy.product,
            meta: {
              title: '产品列表',
            },
          },
          {
            path: '/beauty/goods-mgr/classfiy/server',
            component: retailPage.goodsMgr.classfiy.server,
            meta: {
              title: '服务列表',
            },
          },
          {
            path: '/beauty/goods-mgr/classfiy/Pm/detail',
            component: retailPage.goodsMgr.classfiy.detail,
            meta: {
              title: '分类详情',
            },
          },
          {
            path: '/beauty/goods-mgr/classfiy/server/detail',
            component: retailPage.goodsMgr.classfiy.detail,
            meta: {
              title: '分类详情',
            },
          },
          {
            path: '/beauty/goods-mgr/classfiy/custom-classfiy',
            component: retailPage.goodsMgr.classfiy.custom,
            meta: {
              title: '定制分类',
            },
          },
        ],
      },
      {
        path: '/beauty/goods-mgr/custom-classfiy',
        component: retailPage.goodsMgr.customClassfiy.index,
        meta: {
          title: '定制分类',
        },
      },
      {
        path: '/beauty/goods-mgr/shelf',
        redirect: '/beauty/goods-mgr/shelf/server',
        component: pages.goodsShelf.list.index,
        meta: {
          title: '门店上架',
        },
        children: [
          {
            path: '/beauty/goods-mgr/shelf/server',
            component: pages.goodsShelf.list.server,
            meta: {
              title: '服务管理',
              keepAlive: true,
            },
          },
          {
            path: '/beauty/goods-mgr/shelf/card',
            component: pages.goodsShelf.list.card,
            meta: {
              title: '卡项管理',
              keepAlive: true,
            },
          },
          {
            path: '/beauty/goods-mgr/shelf/product',
            component: pages.goodsShelf.list.product,
            meta: {
              title: '产品管理',
              keepAlive: true,
            },
          },
          {
            path: '/beauty/goods-mgr/shelf/server/detail',
            component: pages.goodsShelf.detail.server,
            meta: {
              title: '服务详情',
            },
          },
          {
            path: '/beauty/goods-mgr/shelf/card/detail',
            component: pages.goodsShelf.detail.card,
            meta: {
              title: '卡项详情',
            },
          },
          {
            path: '/beauty/goods-mgr/shelf/product/detail',
            component: pages.goodsShelf.detail.product,
            meta: {
              title: '产品详情',
            },
          },
        ],
      },
      {
        path: '/goods-shelf/detail',
        redirect: '/goods-shelf/detail/server',
        component: pages.goodsShelf.detail.index,
        meta: {
          title: '商品列表',
        },
        children: [],
      },
    ],
  },
  {
    path: '/appoint-mgr',
    component: pages.appointMgr.index,
    redirect: '/appoint-mgr/list',
    meta: {
      title: '预约管理',
    },
    children: [
      {
        path: '/appoint-mgr/list',
        component: pages.appointMgr.list,
        meta: {
          title: '预约列表',
        },
      },
      {
        path: '/appoint-mgr/setting',
        component: pages.setting.appointment,
        meta: {
          title: '预约设置',
        },
      },
    ],
  },
  {
    path: '/setting/homedecorate/custom-page/decorate',
    component: pages.setting.homedecorate.decorate,
    meta: {
      title: '新增自定义页',
    },
  },
  marketing.route,
  setting.route,
  settingWx.route,
  settingDecorate.route,
  startup.route,
  order.route,
  retailGoodsMgr.route,
  retailGoods.route,
  ...retailActivity.route,
  retailWareHouse.route,
  distribution.route,
  estate.goodsMgr.route,
  estate.orderMgr.route,
  tourism.hotel.route,
  tourism.ticketing.route,
  passenger.route,
  activity.route,
  merchants.route,
  park.route,
  activityRoute.route,
  projectRoute.route,
  verifyElderMembersRoute.route,
  elderSpaceRoute.route,
  coupon.route,
  {
    path: '/order-goods',
    component: pages.orderGoods.index,
    meta: {
      title: '订货管理',
    },
    redirect: '/order-goods/list',
    children: [
      {
        path: '/order-goods/list',
        component: pages.orderGoods.booking.list,
        meta: {
          title: '订货清单',
        },
      },
      {
        path: '/order-goods/list/detail',
        component: pages.orderGoods.booking.detail,
        meta: {
          title: '清单详情',
        },
      },
      {
        path: '/order-goods/dealer-list',
        component: pages.orderGoods.dealer.list,
        meta: {
          title: '经销商列表',
        },
      },
      {
        path: '/order-goods/dealer-list/detail',
        component: pages.orderGoods.dealer.detail,
        meta: {
          title: '经销商详情',
        },
      },
    ],
  },
  {
    path: '/quote',
    component: pages.quote.index,
    meta: {
      title: '工程报价',
    },
    redirect: '/quote/list',
    children: [
      {
        path: '/quote/list',
        component: pages.quote.quotation.list,
        meta: {
          title: '工程报价单',
        },
      },
      {
        path: '/quote/list/detail',
        component: pages.quote.quotation.detail,
        meta: {
          title: '报价单详情',
        },
      },
      {
        path: '/quote/employee',
        component: pages.quote.employee.list,
        meta: {
          title: '员工列表',
        },
      },
    ],
  },
];

const router = new Router({
  routes,
});

export default router;
