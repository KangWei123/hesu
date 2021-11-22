import pages from '../page.js';

export default {
  description: '分销市场',
  route: {
    path: '/distribution',
    component: pages.distribution.index,
    meta: {
      title: '分销市场'
    },
    redirect: '/distribution/staff-manage',
    children: [
      {
        path: '/distribution/staff-manage',
        component: pages.distribution.staffManage.index,
        meta: {
          title: '员工管理'
        },
        redirect: '/distribution/staff-manage/all',
        children: [
          {
            path: '/distribution/staff-manage/all',
            component: pages.distribution.staffManage.all,
            meta: {
              title: '全部',
              keepAlive: true
            }
          },
          {
            path: '/distribution/staff-manage/marketing',
            component: pages.distribution.staffManage.marketing,
            meta: {
              title: '全员营销',
              keepAlive: true
            }
          },
          {
            path: '/distribution/staff-manage/purchase',
            component: pages.distribution.staffManage.purchase,
            meta: {
              title: '员工内购',
              keepAlive: true
            }
          },
          {
            path: '/distribution/staff-manage/employee',
            component: pages.distribution.staffManage.employee,
            meta: {
              title: '企业员工',
              keepAlive: true
            }
          }
        ]
      },
      {
        path: '/distribution/performance-statistic',
        component: pages.distribution.performanceStatistic.index,
        meta: {
          title: '业绩统计'
        },
        redirect: '/distribution/performance-statistic/marketing',
        children: [
          {
            path: '/distribution/performance-statistic/marketing',
            component: pages.distribution.performanceStatistic.marketing,
            meta: {
              title: '全员营销',
              keepAlive: true
            }
          },
          {
            path: '/distribution/performance-statistic/marketing/order-detail',
            component: pages.distribution.performanceStatistic.orderDetail,
            meta: {
              title: '全员营销订单明细'
            }
          },
          {
            path: '/distribution/performance-statistic/purchase',
            component: pages.distribution.performanceStatistic.purchase,
            meta: {
              title: '员工内购',
              keepAlive: true
            }
          },
          {
            path: '/distribution/performance-statistic/purchase/order-detail',
            component: pages.distribution.performanceStatistic.orderDetail,
            meta: {
              title: '员工内购订单明细'
            }
          }
        ]
      },
      {
        path: '/distribution/commission-settlement',
        component: pages.distribution.commissionSettlement.index,
        meta: {
          title: '佣金结算'
        },
        redirect: '/distribution/commission-settlement/marketing',
        children: [
          {
            path: '/distribution/commission-settlement/marketing',
            component: pages.distribution.commissionSettlement.marketing,
            meta: {
              title: '全员营销'
            }
          },
          {
            path: '/distribution/commission-settlement/purchase',
            component: pages.distribution.commissionSettlement.purchase,
            meta: {
              title: '员工内购'
            }
          },
          {
            path: '/distribution/commission-settlement/setting',
            component: pages.distribution.commissionSettlement.setting,
            meta: {
              title: '结算设置'
            }
          }
        ]
      },
      {
        path: '/distribution/internal-purchase',
        component: pages.distribution.internalPurchase.index,
        meta: {
          title: '员工内购'
        },
        redirect: '/distribution/internal-purchase/goods-setting',
        children: [
          {
            path: '/distribution/internal-purchase/goods-setting',
            component: pages.distribution.internalPurchase.goodsSetting,
            meta: {
              title: '商品设置',
              keepAlive: true
            }
          },
          {
            path: '/distribution/internal-purchase/voucher-setting',
            component: pages.distribution.internalPurchase.voucherSetting,
            meta: {
              title: '内购券设置'
            }
          },
          {
            path: '/distribution/internal-purchase/rule-setting',
            component: pages.distribution.internalPurchase.ruleSetting,
            meta: {
              title: '规则设置'
            }
          }
        ]
      },
      {
        path: '/distribution/all-marketing',
        component: pages.distribution.allMarketing.index,
        meta: {
          title: '全员营销'
        },
        redirect: '/distribution/all-marketing/goods-setting',
        children: [
          {
            path: '/distribution/all-marketing/goods-setting',
            component: pages.distribution.allMarketing.goodsSetting,
            meta: {
              title: '商品设置',
              keepAlive: true
            }
          },
          {
            path: '/distribution/all-marketing/rule-setting',
            component: pages.distribution.allMarketing.ruleSetting,
            meta: {
              title: '规则设置'
            }
          }
        ]
      }
    ]
  }
};
