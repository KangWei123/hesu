import Vue from 'vue';
import Router from 'vue-router';
import Coming from '@/business-common/components/coming-soon';
import Noop from '@/dss-common/components/noop';

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/',
    },
    {
      path: '/member-center',
      redirect: '/member-center/archives',
      component: () => import('../views/member-center/index.vue'),
      meta: {
        title: '会员中心',
      },
      children: [
        {
          path: '/member-center/archives',
          component: Noop,
          redirect: '/member-center/archives/normal',
          children: [
            {
              path: '/member-center/archives/normal',
              component: () => import('../views/member-center/user-list'),
              name: 'member.normal-user-list',
              meta: {
                title: '普通会员档案',
              },
            },
            {
              path: '/member-center/archives/company',
              component: () => import('../views/member-center/user-list'),
              name: 'member.company-user-list',
              meta: {
                title: '企业会员档案',
              },
            },
            {
              path: '/member-center/archives/normal/:id',
              name: 'member.normal-user-detail',
              component: () => import('../views/member-center/user-detail'),
              meta: {
                title: '会员详情',
                bread: true,
              },
            },
            {
              path: '/member-center/archives/company/:id',
              name: 'member.company-user-detail',
              component: () => import('../views/member-center/user-detail'),
              meta: {
                title: '会员详情',
                bread: true,
              },
            },
          ],
        },
        {
          path: '/member-center/weak-list',
          component: () => import('../views/member-center/weak-list/index.vue'),
          meta: {
            title: '潜在会员',
          },
        },
        {
          path: '/member-center/life-cycle',
          redirect: '/member-center/life-cycle/list',
          component: Noop,
          meta: {
            title: '生命周期管理',
          },
          children: [
            {
              path: '/member-center/life-cycle/list',
              component: () => import('../views/member-center/life-cycle/list.vue'),
              meta: {
                title: '生命周期管理列表',
              },
            },
            {
              path: '/member-center/life-cycle/edit',
              component: () => import('../views/member-center/life-cycle/edit.vue'),
              meta: {
                title: '编辑生命周期',
                bread: true,
              },
            },
          ],
        },
        {
          path: '/member-center/merge',
          redirect: '/member-center/merge/list',
          component: Noop,
          meta: {
            title: '会员合并',
          },
          children: [
            {
              path: '/member-center/merge/list',
              component: () => import('../views/member-center/merge/index.vue'),
              meta: {
                title: '会员合并列表',
              },
            },
            {
              path: '/member-center/merge/edit',
              component: () => import('../views/member-center/merge/edit.vue'),
              meta: {
                title: '新增会员合并',
              },
            },
          ],
        },
      ],
    },
    {
      path: '/score-center',
      redirect: '/score-center/give-rule',
      component: () => import('../views/score-center/index.vue'),
      meta: {
        title: '积分中心',
      },
      children: [
        {
          path: '/score-center/give-rule',
          component: Noop,
          redirect: '/score-center/give-rule/list',
          meta: {
            title: '积分发放规则',
          },
          children: [
            {
              path: '/score-center/give-rule/list',
              component: () => import('../views/score-center/give-rule/list.vue'),
              meta: {
                title: '积分发放规则列表',
              },
            },
            {
              path: '/score-center/give-rule/form',
              component: () => import('../views/score-center/give-rule/edit.vue'),
              meta: {
                title: '编辑发放规则',
                bread: true,
              },
            },
          ],
        },
        {
          path: '/score-center/risk-management',
          component: () => import('../views/score-center/risk-management/index.vue'),
          name: 'member.score-risk-management',
          meta: {
            title: '积分设置',
          },
        },
        {
          path: '/score-center/consume-rule',
          component: Noop,
          redirect: '/score-center/consume-rule/list',
          meta: {
            title: '积分消耗规则',
          },
          children: [
            {
              path: '/score-center/consume-rule/list',
              component: () => import('../views/score-center/consume-rule/list.vue'),
              meta: {
                title: '积分消耗规则列表',
              },
            },
            {
              path: '/score-center/consume-rule/form',
              component: () => import('../views/score-center/consume-rule/edit.vue'),
              meta: {
                title: '编辑消耗规则',
                bread: true,
              },
            },
          ],
        },
        {
          path: '/score-center/multiplier-activity',
          component: Noop,
          redirect: '/score-center/multiplier-activity/list',
          meta: {
            title: '积分倍率活动',
          },
          children: [
            {
              path: '/score-center/multiplier-activity/list',
              component: () => import('../views/score-center/multiplier-activity/list.vue'),
              meta: {
                title: '积分倍率活动列表',
              },
            },
            {
              path: '/score-center/multiplier-activity/add',
              component: () => import('../views/score-center/multiplier-activity/edit.vue'),
              meta: {
                title: '新增倍率活动',
                bread: true,
              },
            },
          ],
        },
        {
          path: '/score-center/stat',
          component: () => import('../views/score-center/statistics/index.vue'),
          name: 'member.score-stat',
          meta: {
            title: '积分结算',
          },
        },
        {
          path: '/score-center/stat-detail',
          name: 'member.score-stat-detail',
          component: () => import('../views/score-center/statistics/detail/index.vue'),
          meta: {
            title: '积分明细',
            hideTitle: true,
          },
        },
      ],
    },
    {
      path: '/level-center',
      redirect: '/level-center/level-mgr',
      component: () => import('../views/level-center/level-manager/index.vue'),
      meta: {
        title: '等级中心',
      },
      children: [
        {
          path: '/level-center/level-mgr',
          redirect: '/level-center/level-mgr/normal',
          component: Noop,
          meta: {
            title: '等级管理',
          },
          children: [
            {
              path: '/level-center/level-mgr/normal',
              component: () => import('../views/level-center/level-manager/normal-member/index.vue'),
              meta: {
                title: '普通会员',
              },
            },
            {
              path: '/level-center/level-mgr/paying',
              component: () => import('../views/level-center/level-manager/paying-member/index.vue'),
              meta: {
                title: '付费会员',
              },
            },
            {
              path: '/level-center/level-mgr/company',
              component: () => import('../views/level-center/level-manager/company-member/index.vue'),
              meta: {
                title: '企业会员',
              },
            },
            {
              path: '/level-center/level-mgr/add-level',
              component: () => import('../views/level-center/level-manager/add-level/index.vue'),
              meta: {
                title: '编辑等级',
                bread: true,
              },
            },
          ],
        },
        {
          path: '/level-center/growth-mgr',
          redirect: '/level-center/growth-mgr/list',
          component: Noop,
          meta: {
            title: '成长值管理',
          },
          children: [
            {
              path: '/level-center/growth-mgr/list',
              component: () => import('../views/level-center/growth-manager/manager/index.vue'),
              meta: {
                title: '成长值管理',
              },
            },
            {
              path: '/level-center/growth-mgr/add-growth',
              component: () => import('../views/level-center/growth-manager/add-growth/index.vue'),
              meta: {
                title: '编辑成长值',
                bread: true,
              },
            },
          ],
        },
      ],
    },
    {
      path: '/rights-center',
      redirect: '/rights-center/rights-list',
      component: () => import('../views/rights-center/index.vue'),
      meta: {
        title: '权益中心',
      },
      children: [
        {
          path: '/rights-center/rights-list',
          component: () => import('../views/rights-center/rights-list/index.vue'),
          meta: {
            title: '权益列表',
          },
        },
        {
          path: '/rights-center/add-rights',
          component: () => import('../views/rights-center/add-rights/index.vue'),
          meta: {
            title: '编辑权益',
            bread: true,
          },
        },
      ],
    },
    // 客户管理
    {
      path: '/manage',
      redirect: '/manage/rules',
      component: () => import('../views/manage-center/index.vue'),
      children: [
        {
          path: '/manage/rules',
          redirect: '/manage/rules/relation',
          name: 'rules',
          meta: {
            title: '规则设置',
          },
          component: () => import('../views/manage-center/rules/index.vue'),
          children: [
            {
              path: '/manage/rules/relation',
              name: 'relation',
              meta: {
                title: '归属关系设置',
                keepAlive: true,
              },
              component: () => import('../views/manage-center/rules/relation/index.vue'),
            },
            {
              path: '/manage/rules/level-set',
              name: 'level-set',
              meta: {
                title: '阶段等级设置',
              },
              component: () => import('../views/manage-center/rules/level-set/index.vue'),
            },
            {
              path: '/manage/rules/level-set/edit',
              name: 'level-set',
              meta: {
                title: '编辑阶段等级',
                bread: true,
              },
              props: {
                app: route => ({ id: +route.query.id }),
              },
              component: () => import('../views/manage-center/rules/level-set/edit.vue'),
            },
            {
              path: '/manage/rules/auto-bind-set',
              name: 'bind-set-list',
              meta: {
                title: '线索自动分配设置列表',
              },
              component: () => import('../views/manage-center/rules/auto-bind-set/index.vue'),
            },
            {
              path: '/manage/rules/auto-bind-set/edit',
              name: 'bind-set-add',
              meta: {
                title: '新增线索自动分配规则',
                bread: true,
              },
              props: {
                app: route => ({ id: +route.query.id }),
              },
              component: () => import('../views/manage-center/rules/auto-bind-set/edit/index.vue'),
            },
            {
              path: '/manage/rules/client-source',
              name: 'client-source',
              meta: {
                title: '客户来源管理',
              },
              component: () => import('../views/manage-center/rules/client-source/index.vue'),
            },
          ],
        },
        {
          path: '/manage/cue',
          redirect: '/manage/cue/common-cue',
          name: 'cue',
          meta: { title: '全域客户' },
          component: () => import('../views/manage-center/cue/index.vue'),
          children: [
            {
              path: '/manage/cue/common-cue',
              name: 'cueCommon',
              meta: { title: '全域客户', showPageName: true },
              component: () => import('../views/manage-center/cue/global-client.vue'),
            },
            {
              path: '/manage/cue/common-cue/detail',
              name: 'cueDetail',
              meta: { title: '客户详情', parentPageTitle: '全域客户', parentPagePath: '/manage/cue/common-cue' },
              component: () => import('../views/manage-center/userDetail/index.vue'),
            },
          ],
        },
        {
          path: '/manage/store',
          name: 'store',
          redirect: '/manage/store/store-client',
          meta: { title: '门店客户', keepAlive: true },
          component: () => import('../views/manage-center/store/index.vue'),
          children: [
            {
              path: '/manage/store/store-client',
              name: 'storeClient',
              meta: { title: '门店客户', keepAlive: true },
              component: () => import('../views/manage-center/store/client/index.vue'),
            },
            {
              path: '/manage/store/store-cue',
              name: 'storeCue',
              meta: { title: '门店线索', keepAlive: true },
              component: () => import('../views/manage-center/store/cue/index.vue'),
            },
            {
              path: '/manage/store/house-info',
              name: 'plotList',
              meta: { title: '小区列表', keepAlive: true },
              component: () => import('../views/manage-center/store/house/index.vue'),
            },
            {
              path: '/manage/store/house-detail',
              name: 'plotDetail',
              meta: { title: '小区详情', hidePageNav: true },
              component: () => import('../views/manage-center/store/house/detail.vue'),
            },
            {
              path: '/manage/store/store-client/detail',
              name: 'storeClientDetail',
              meta: {
                title: '客户详情',
                parentPageTitle: '门店客户',
                hidePageNav: true,
                parentPagePath: '/manage/store/store-client',
              },
              component: () => import('../views/manage-center/userDetail/index.vue'),
            },
            {
              path: '/manage/store/store-cue/detail',
              name: 'storeCueDetail',
              meta: {
                title: '线索详情',
                parentPageTitle: '门店线索',
                hidePageNav: true,
                parentPagePath: '/manage/store/store-cue',
              },
              component: () => import('../views/manage-center/userDetail/index.vue'),
            },
          ],
        },
        {
          path: '/manage/telemarketing',
          redirect: '/manage/telemarketing/headquarters',
          name: 'Telesales',
          meta: { title: '电销列表', keepAlive: true },
          component: () => import('../views/manage-center/telesales/index.vue'),
          children: [
            {
              path: '/manage/telemarketing/headquarters',
              name: 'telesales-headquarters',
              meta: { title: '总部电销列表', keepAlive: true },
              component: () => import('../views/manage-center/telesales/headquarters.vue'),
            },
            {
              path: '/manage/telemarketing/outsourcing',
              name: 'telesales-outsourcing',
              meta: { title: '外包电销列表', keepAlive: true },
              component: () => import('../views/manage-center/telesales/outsourcing.vue'),
            },
            {
              path: '/manage/telemarketing/guide',
              name: 'telesales-guide',
              meta: { title: '导购跟进列表', keepAlive: true },
              component: () => import('../views/manage-center/telesales/guide.vue'),
            },
            {
              path: '/manage/telemarketing/headquarters/detail',
              name: 'telesales-detail',
              meta: {
                title: '客户详情',
                parentPageTitle: '电销客户',
                hidePageNav: true,
                parentPagePath: '/manage/telemarketing/headquarters',
              },
              component: () => import('../views/manage-center/userDetail/index.vue'),
            },
            {
              path: '/manage/telemarketing/outsourcing/detail',
              name: 'telesales-detail',
              meta: {
                title: '客户详情',
                parentPageTitle: '外包电销',
                hidePageNav: true,
                parentPagePath: '/manage/telemarketing/outsourcing',
              },
              component: () => import('../views/manage-center/userDetail/index.vue'),
            },
            {
              path: '/manage/telemarketing/guide/detail',
              name: 'telesales-detail',
              meta: {
                title: '客户详情',
                parentPageTitle: '导购跟进',
                hidePageNav: true,
                parentPagePath: '/manage/telemarketing/guide',
              },
              component: () => import('../views/manage-center/userDetail/index.vue'),
            },
          ],
        },
        {
          path: '/manage/invalid-cue',
          redirect: '/manage/invalid-cue/list',
          name: 'cueInvalid',
          meta: { title: '无效客户' },
          component: () => import('../views/manage-center/invalid/index.vue'),
          children: [
            {
              path: '/manage/invalid-cue/list',
              name: 'cueInvalidList',
              meta: { title: '无效客户', showPageName: true },
              component: () => import('../views/manage-center/invalid/invalid-clues.vue'),
            },
            {
              path: '/manage/invalid-cue/detail',
              name: 'cueInvalidDetail',
              meta: { title: '客户详情', parentPageTitle: '无效客户', parentPagePath: '/manage/invalid-cue/list' },
              component: () => import('../views/manage-center/userDetail/index.vue'),
            },
          ],
        },
        {
          path: '/manage/analysis',
          name: 'analysis',
          meta: { title: '客户分析' },
          component: () => import('../views/manage-center/statistial-analysis/index.vue'),
        },
      ],
    },
    // 客户洞察
    {
      path: '/portrait',
      name: 'customerInsight',
      redirect: '/portrait/manage',
      component: () => import('../views/portrait/index.vue'),
      children: [
        {
          path: '/portrait/manage',
          name: 'portrait',
          meta: {
            title: '标签管理',
          },
          component: () => import('../views/portrait/Portrait.vue'),
          redirect: '/portrait/manage/all',
          children: [
            {
              path: '/portrait/manage/all',
              name: 'allTag',
              meta: {
                title: '全部标签',
              },
            },
            {
              path: '/portrait/manage/overview',
              name: 'portraitOverview',
              meta: {
                title: '人群画像',
              },
              component: () => import('../views/portrait/overview'),
            },
            {
              path: '/portrait/manage/group',
              name: 'portraitGroup',
              meta: {
                title: '客户洞察',
              },
              component: () => import('../views/portrait/group'),
            },
            {
              path: '/portrait/manage/save',
              name: 'portraitSave',
              meta: {
                title: '保存人群',
              },
              component: () => import('../views/portrait/save/index.vue'),
            },
            {
              path: '/portrait/manage/myTag',
              name: 'portraitMyTagIndex',
              redirect: '/portrait/manage/myTag/list',
            },
            {
              path: '/portrait/manage/myTag/list',
              name: 'portraitMyTag',
              meta: { title: '我的标签' },
              component: () => import('../views/portrait/mytag'),
            },
            {
              path: '/portrait/manage/myTag/new',
              name: 'portraitNewTag',
              meta: {
                title: '新建标签',
              },
              component: () => import('../views/portrait/newTag/index.vue'),
            },
            // 适配条件标签旧接口
            {
              path: '/portrait/manage/myTag/old',
              name: 'portraitNewTagOld',
              meta: {
                title: '新建标签',
              },
              component: () => import('../views/portrait/newTagOld/index.vue'),
            },
            // dmp标签迭代开发
            {
              path: '/portrait/manage/myLabel',
              name: 'portraitNewMyLabel',
              meta: {
                title: '新建标签',
              },
              component: () => import('../views/portrait/myLabel/index.vue'),
            },
          ],
        },
        {
          path: '/portrait/group-manage',
          name: 'groupList',
          meta: {
            title: '人群管理',
          },
          component: () => import('../views/portrait/group-manage/index.vue'),
        },
      ],
    },
    {
      path: '/shanhu',
      name: 'shanhu',
      component: () => import('../views/shanhu/index.vue'),
      children: [
        {
          path: '/shanhu/inventory',
          redirect: '/shanhu/inventory/commodity_pool',
          component: () => import('../views/shanhu/index.vue'),
          meta: {
            title: '权益库存资源',
          },
          children: [
            {
              path: '/shanhu/inventory/commodity_pool',
              component: () => import('../views/shanhu/index.vue'),
              meta: {
                title: '自有权益商品入库',
              },
            },
            {
              path: '/shanhu/inventory/stock_mall',
              component: () => import('../views/shanhu/index.vue'),
              meta: {
                title: '采购商城',
              },
            },
            {
              path: '/shanhu/inventory/inventory_allocation',
              component: () => import('../views/shanhu/index.vue'),
              meta: {
                title: '分配权益商品',
              },
            },
            {
              path: '/shanhu/inventory/inventory_record',
              component: () => import('../views/shanhu/index.vue'),
              meta: {
                title: '出库记录明细',
              },
            },
            {
              path: '/shanhu/inventory/inventory_tag',
              component: () => import('../views/shanhu/index.vue'),
              meta: {
                title: '库存标签',
              },
            },
            {
              path: '/shanhu/inventory/inventory_section',
              component: () => import('../views/shanhu/index.vue'),
              meta: {
                title: '库存分类',
              },
            },
          ],
        },
        {
          path: '/shanhu/mall',
          redirect: '/shanhu/mall/mall_conf',
          component: () => import('../views/shanhu/index.vue'),
          meta: {
            title: '权益商城配置',
          },
          children: [
            {
              path: '/shanhu/mall/mall_conf',
              component: () => import('../views/shanhu/index.vue'),
              meta: {
                title: '权益商品上下架',
              },
            },
            {
              path: '/shanhu/mall/mall_record',
              component: () => import('../views/shanhu/index.vue'),
              meta: {
                title: '兑换记录明细',
              },
            },
          ],
        },
        {
          path: '/shanhu/act',
          redirect: '/shanhu/mall/act_manager',
          component: () => import('../views/shanhu/index.vue'),
          meta: {
            title: '权益积分活动',
          },
          children: [
            {
              path: '/shanhu/mall/act_manager',
              component: () => import('../views/shanhu/index.vue'),
              meta: {
                title: '活动管理',
              },
            },
            {
              path: '/shanhu/mall/act_create',
              component: () => import('../views/shanhu/index.vue'),
              meta: {
                title: '创建活动',
              },
            },
            {
              path: '/shanhu/mall/act_lottery_record',
              component: () => import('../views/shanhu/index.vue'),
              meta: {
                title: '活动中奖记录',
              },
            },
          ],
        },
        {
          path: '/shanhu/task',
          redirect: '/shanhu/task/task_activity',
          component: () => import('../views/shanhu/index.vue'),
          meta: {
            title: '权益积分任务',
          },
          children: [
            {
              path: '/shanhu/task/task_activity',
              component: () => import('../views/shanhu/index.vue'),
              meta: {
                title: '任务配置',
              },
            },
            {
              path: '/shanhu/task/task_style',
              component: () => import('../views/shanhu/index.vue'),
              meta: {
                title: '任务样式',
              },
            },
            {
              path: '/shanhu/task/task_introduction',
              component: () => import('../views/shanhu/index.vue'),
              meta: {
                title: '操作指引',
              },
            },
          ],
        },
      ],
    },
  ],
});

export default router;
