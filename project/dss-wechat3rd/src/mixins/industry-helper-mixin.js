import { mapState } from 'vuex';
import appFeaturesEnum from '../constants/appFeaturesEnum.js';
import beauty_gift_template from '../images/marketing/new-user-gift/beauty-gift-template.png';
import retail_gift_template from '../images/marketing/new-user-gift/retail-gift-template.png';
import decorateHelper from './industry/decorate-helper.js';
import menuHelper from './industry/menu-helper.js';
import goodsManagerHelper from './industry/goods-manage-helper.js';
import appFeaturesMixin from '@/dss-common/mixins/app-features-mixin';
import { scrmPlatform, KANG_YANG } from '@/business-common/constants/industryEnum';

export default {
  mixins: [appFeaturesMixin],
  computed: {
    ...mapState({
      env: 'env',
      wxAuthInfo: 'wxAuthInfo',
      appFeatures: 'appFeatures',
      customPages: 'customPages',
      currentEditPageIndex: 'currentEditPageIndex',
      curStore: 'curStore',
      curApp: 'curApp',
      roleList: 'roleList',
    }),
    isXiCha() {
      return appFeaturesEnum.isXiCha(this.appFeatures);
    },
    isByx() {
      return appFeaturesEnum.isByx(this.appFeatures);
    },
    isScrmIndustry() {
      return this.curApp && this.curApp.industryKey === scrmPlatform.key;
    },
    isBusinessCenter() {
      return this.mGetIndustryKey() === 'business_center';
    },
    isKangYangIndustry() {
      return this.curApp && this.curApp.industryKey === KANG_YANG.key;
    },
    ableLivePlay() {
      return true;
      // return (
      //   !!this.wxAuthInfo &&
      //   this.wxAuthInfo.wxMaAppId in
      //     {
      //       //箭牌
      //       wx88083f0defcd08c1: 1,
      //       //30+
      //       wxbc32349c80ee5409: 1,
      //       //惟客地产+
      //       wx49ce9c618720c04e: 1
      //     }
      // );
    },
  },
  methods: {
    /**
     * 获取行业key
     */
    mGetIndustryKey() {
      return 'catering';
    },

    /**
     * 获取wkb菜单
     * @return {*|module.exports.normal|{name, icon, url}}
     */
    mGetWkbMenu() {
      return menuHelper.getWkbMenu.call(this);
    },
    /**
     * 获取订单子菜单栏tab
     * @return {*}
     */
    mGetOrderMenu() {
      return menuHelper.getOrderMenu.call(this);
    },

    /**
     * 获取系统设置菜单栏
     * @return {*}
     */
    mGetSettingMenu() {
      return menuHelper.getSettingMenu.call(this);
    },

    /**
     * 获取营销工具菜单
     */
    mGetMarketingMenu() {
      return menuHelper.mGetMarketingMenu.call(this);
    },

    /**
     * 获取商品选择弹框默认展示的商品tab
     * @return {*}
     */
    mGetGoodsSelectDialogActiveTabs() {
      return goodsManagerHelper.getGoodsSelectDialogActiveTabs.call(this);
    },

    mGetLabelBreadPath(goodsType) {
      return goodsManagerHelper.getLabelBreadPath.call(this, goodsType);
    },

    mGetPatchShelvesPath(goodsTypeValue) {
      return goodsManagerHelper.getPatchShelvesPath.call(this, goodsTypeValue);
    },

    /**
     * 获取新客进店好礼
     */
    mGetNewUserGiftImage() {
      if (this.env.BEAUTIFUL) {
        return beauty_gift_template;
      } else if (this.env.RETAIL) {
        return retail_gift_template;
      } else {
        return retail_gift_template;
      }
    },

    mGetIndustryDecorateComponents() {
      return decorateHelper.getIndustryDecorateComponents.call(this);
    },
    /**
     * 获取个人中心组件库
     * @return {*|Array}
     */
    mGetMineDecorateComponents() {
      return decorateHelper.getMineDecorateComponents.call(this);
    },
    /**
     * 获取个人中心组件默认配置
     * @return {*|Array}
     */
    mGetMineDecorateConfig() {
      return decorateHelper.getMineDecorateConfig.call(this);
    },

    /**
     * 获取停车缴费组件库
     * @return {*|Array}
     */
    mGetParkDecorateComponents() {
      return decorateHelper.getParkDecorateComponents.call(this);
    },

    /**
     * 获取个人中心导航栏链接
     * @return {*|Array}
     */
    mGetMineDecorateNavLinks() {
      return decorateHelper.getMineDecorateNavLinks.call(this);
    },
    /**
     * 获取个人中心内部导航栏链接
     * @return {*|Array}
     */
    mGetMineDecorateInternalNavLinks() {
      return decorateHelper.getMineDecorateInternalNavLinks.call(this);
    },

    /**
     * 获取个人中心订单配置
     */
    mGetMineOrderItems() {
      return decorateHelper.getMineOrderItems.call(this);
    },

    mGetDecorateMenu() {
      return decorateHelper.getDecorateMenu.call(this);
    },

    mGetTabbarLinkList() {
      return decorateHelper.getTabbarLinkList.call(this);
    },
    mGetDefaultIndustryTheme() {
      return decorateHelper.getDefaultIndustryTheme.call(this);
    },
    mGetLinkSelectBatchRequest(linkSelectInstance) {
      return decorateHelper.getLinkSelectBatchRequest.call(this, linkSelectInstance);
    },
    mInitNavList(linkSelectInstance) {
      return decorateHelper.initNavList.call(this, linkSelectInstance);
    },
    mGetLinkSelectOptions(linkSelectInstance) {
      return decorateHelper.getLinkSelectOptions.call(this, linkSelectInstance);
    },
    mGetThemeTemplateOptions() {
      return decorateHelper.getThemeTemplateOptions.call(this);
    },
  },
};
