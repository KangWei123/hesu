import catering from '../../views/setting/homedecorate/decorate/config/catering';
import commonComponents from '../../views/setting/homedecorate/decorate/config/common';
import mineCommonDecorateComponents from '../../views/setting/homedecorate/mine-decorate/config/common-decorate-components';
import mineCommonDecorateConfig from '../../views/setting/homedecorate/mine-decorate/config/common-decorate-config';
import mineNavLinks from '../../views/setting/homedecorate/mine-decorate/config/nav-links';
import parkCommonDecorateConfig from '../../views/setting/homedecorate/park-decorate/config/common-decorate-components';

import cateringList from '../../views/setting/homedecorate/homepage-nav/tabbarLibrary/tabbarList-catering';
import template from '../../views/setting/homedecorate/mini-index/template';
import goodsTypeEnum from '../../constants/goodsTypeEnum';
import byxTemplateOptions from '../../views/setting/homedecorate/mini-index/template-byx';
import decorateMenu from './decorate-menu';

const filterDecorateMenu = (hideMenuList, menu) => {
  // 根据行业过滤不展示的菜单
  return menu.filter(item => !hideMenuList.some(val => val === item.id));
};

// 合并组件
const mergeComponents = (...components) => {
  const result = components.reduce((pre, cur) => {
    for (const curItem of cur) {
      const preIndex = pre.findIndex(preItem => preItem.type === curItem.type);
      // 直接合并数组
      if (preIndex === -1) {
        pre = [...pre, curItem];
      }
      // components 合并
      else {
        const preItem = pre[preIndex];
        // 去重
        const filterPushComponents = curItem.components.filter(c => {
          const index = preItem.components.findIndex(p => p.id === c.id);
          return index === -1;
        });
        pre[preIndex] = { ...preItem, components: [...preItem.components, ...filterPushComponents] };
      }
    }
    return pre;
  }, []);

  return result;
};

export default {
  /**
   * 获取各个行业下的装修组件
   */

  getIndustryDecorateComponents() {
    // 合并公共组件
    return mergeComponents(catering.components.bind(this)({ ableLivePlay: this.ableLivePlay }), commonComponents);
  },
  /**
   * 获取个人中心组件库
   */
  getMineDecorateComponents() {
    return mineCommonDecorateComponents.components.bind(this)();
  },

  /**
   * 获取个人中心组件默认配置
   * @return {*}
   */
  getMineDecorateConfig() {
    return mineCommonDecorateConfig;
  },

  /**
   * 获取停车缴费组件库
   * @return {*}
   */
  getParkDecorateComponents() {
    return parkCommonDecorateConfig.components.bind(this)();
  },

  /**
   * 获取个人中心导航栏链接
   */
  getMineDecorateNavLinks() {
    const navLinks = this.$plain(mineNavLinks);

    return navLinks;
  },
  /**
   * 获取个人中心内部导航栏链接
   */
  getMineDecorateInternalNavLinks() {
    return null;
  },

  /**
   * 获取个人中心订单配置信息
   */
  getMineOrderItems() {
    if (this.env.ESTATE) {
      return [
        {
          label: '待认筹',
          value: 'wait_pay',
        },
        {
          label: '待核销',
          value: 'wait_off',
        },
        {
          label: '已完成',
          value: 'done',
        },
        {
          label: '全部订单',
          value: 'all',
        },
      ];
    } else {
      return [
        {
          label: '待付款',
          value: 'wait_pay',
        },
        {
          label: '待发货',
          value: 'wait_shipping',
        },
        {
          label: '待收货',
          value: 'wait_receive',
        },
        {
          label: '售后',
          value: 'after_sale',
        },
        {
          label: '全部订单',
          value: 'all',
        },
      ];
    }
  },

  /**
   * 根据行业展示装修的menu
   */
  getDecorateMenu() {
    const menu = decorateMenu.decorateMenu;
    if (this.env.BEAUTIFUL) {
      // 根据路由配置id过滤不展示的菜单
      const hideMenuList = [4, 5, 6];
      return filterDecorateMenu(hideMenuList, menu);
    } else if (this.env.TOURISM) {
      const hideMenuList = [4, 5, 6];
      return filterDecorateMenu(hideMenuList, menu);
    } else if (this.env.MEDICINE) {
      return menu;
    } else if (this.env.ESTATE) {
      const hideMenuList = [4, 5];
      return filterDecorateMenu(hideMenuList, menu);
    } else if (this.isZhongJun) {
      menu.splice(4, 0, {
        path: 'floor-guide',
        name: '楼层导览',
        showBorder: true,
      });
      return menu;
    } else {
      return menu;
    }
  },
  /**
   * 获取主页导航tabbar链接list
   * @return {*[]}
   */
  getTabbarLinkList() {
    return cateringList;
  },
  /**
   * 行业默认主题模板
   * @return {*}
   */
  getDefaultIndustryTheme() {
    return template[0];
  },
  /**
   * 获取链接选择的请求，如navModule，topMenuModule等
   * @param linkSelectInstance
   * @return {Array}
   */
  getLinkSelectBatchRequest(linkSelectInstance) {
    const batchRequest = [];
    batchRequest.push(linkSelectInstance.getCustomPage(this.customPages, this.currentEditPageIndex));
    batchRequest.push(linkSelectInstance.getCategory());
    batchRequest.push(linkSelectInstance.getLuckyList());
    batchRequest.push(linkSelectInstance.getCheckinDetail());
    batchRequest.push(linkSelectInstance.getFormList());
    if (this.env.BEAUTIFUL) {
      batchRequest.push(linkSelectInstance.getCategory(goodsTypeEnum.server.value));
    } else {
      batchRequest.push(linkSelectInstance.getActivity());
    }
    if (this.env.RETAIL) {
      batchRequest.push(linkSelectInstance.getCardPack());
    }
    return batchRequest;
  },
  /**
   * 初始化导航列表，如navModule，topMenuModule等，根据行业或者是否有分类等判断条件，初始化导航展示哪些列表
   * @param linkSelectInstance
   */
  initNavList(linkSelectInstance) {
    const list = [];
    if (linkSelectInstance.customPages && linkSelectInstance.customPages.length) {
      list.push({
        name: '自定义页',
        logo: '',
        link: ['custom', ''],
      });
    }
    // if (linkSelectInstance.activity && linkSelectInstance.activity.length) {
    //   list.push({
    //     name: '专题活动',
    //     logo: '',
    //     link: ['activity', ''],
    //   });
    // }
    if (linkSelectInstance.category && linkSelectInstance.category.length) {
      list.push({
        name: '分类',
        logo: '',
        link: ['category', ''],
      });
    }
    if (linkSelectInstance.serverCategory && linkSelectInstance.serverCategory.length) {
      list.push({
        name: '分类',
        logo: '',
        link: ['server-category', ''],
      });
    }

    return list;
  },
  /**
   * 初始化linkSelect选择项，如navModule，topMenuModule等
   * @param linkSelectInstance
   */
  getLinkSelectOptions(linkSelectInstance) {
    const linkOptions = [];

    if (linkSelectInstance.customPages && linkSelectInstance.customPages.length) {
      linkOptions.push({
        value: 'custom',
        label: '自定义页',
        children: this.linkMixins.customPages,
      });
    }

    linkOptions.push({
      value: 'url',
      label: 'H5 链接',
    });

    // if (linkSelectInstance.activity && linkSelectInstance.activity.length) {
    //   linkOptions.push({
    //     value: 'activity',
    //     label: '活动专题',
    //     children: this.linkMixins.activity,
    //   });
    // }
    if (linkSelectInstance.category && linkSelectInstance.category.length) {
      linkOptions.push({
        value: 'category',
        label: '产品分类',
        children: linkSelectInstance.category,
      });
    }
    // if (linkSelectInstance.serverCategory && linkSelectInstance.serverCategory.length) {
    //   linkOptions.push({
    //     value: 'server-category',
    //     label: '服务分类',
    //     children: linkSelectInstance.serverCategory,
    //   });
    // }
    if (linkSelectInstance.luckyList && linkSelectInstance.luckyList.length) {
      linkOptions.push({
        value: 'lucky',
        label: '幸运大转盘',
        children: linkSelectInstance.luckyList,
      });
    }
    // if (linkSelectInstance.formTool && linkSelectInstance.formTool.length) {
    //   linkOptions.push({
    //     value: 'formTool',
    //     label: '表单',
    //     children: this.linkMixins.formTool,
    //   });
    // }
    linkOptions.push({
      value: '{"linkType":"voucher-center","name":"充值中心"}',
      label: '充值中心',
    });
    linkOptions.push({
      value: '{"linkType":"coupon-center","name":"领券中心"}',
      label: '领券中心',
    });
    // linkOptions.push({
    //   value: '{"linkType":"integral-mall","name":"积分商城"}',
    //   label: '积分商城',
    // });
    linkOptions.push({
      value: '{"linkType":"gift-card-list","name":"礼品卡商城"}',
      label: '礼品卡商城',
    });
    linkOptions.push({
      value: '{"linkType":"group-list","name":"拼团列表"}',
      label: '拼团列表',
    });
    linkOptions.push({
      value: '{"linkType":"cut-price-list","name":"砍价列表"}',
      label: '砍价列表',
    });
    linkOptions.push({
      value: '{"linkType":"sec-kill-list","name":"秒杀列表"}',
      label: '秒杀列表',
    });
    linkOptions.push({
      value: '{"linkType":"graph-list","name":"图文列表"}',
      label: '图文列表',
    });
    linkOptions.push({
      value: '{"linkType":"free-center","name":"赠品中心"}',
      label: '赠品中心',
    });
    // linkOptions.push({
    //   value: `{"linkType":"checkin","id":"${+linkSelectInstance.checkinId}","name":"签到有礼"}`,
    //   label: '签到有礼',
    //   disabled: !linkSelectInstance.checkinId,
    // });
    linkOptions.push({
      value: '{"linkType":"products","name":"产品列表"}',
      label: '商品列表',
    });
    // linkOptions.push({
    //   value: '{"linkType":"internal-purchase","name":"内购专区"}',
    //   label: '内购专区',
    // });

    // linkOptions.push({
    //   value: '{"linkType":"near-store","name":"附近门店"}',
    //   label: '附近门店',
    // });
    // linkOptions.push({
    //   value: '{"linkType":"task-center","name":"任务中心"}',
    //   label: '品牌代言人',
    // });
    linkOptions.push({
      value: 'miniProgram',
      label: '小程序链接',
    });

    return linkOptions;
  },
  getThemeTemplateOptions() {
    if (this.isByx) {
      return byxTemplateOptions;
    }
    return template;
  },
};
