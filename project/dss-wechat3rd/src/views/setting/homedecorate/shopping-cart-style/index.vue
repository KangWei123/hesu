<style lang="less">
  .shopping-cart-style {
    border-radius: 4px;
    .bg-mixin;
    .center-mixin;
    flex-direction: column;
    padding: 20px 0 40px;

    .container {
      margin-left: 20px;
      padding-top: 20px;
      display: flex;

      .normal_bg {
        width: 352px;
        height: 585px;
        border-radius: 19px;
        background: transparent url(../../../../images/decoration/pageImage/normal_bg.png) center / cover;
      }

      .quik_bg {
        width: 352px;
        height: 585px;
        border-radius: 19px;
        background: transparent url(../../../../images/decoration/pageImage/quik_bg.png) center / cover;
        margin-left: 50px;
      }

      .normal,
      .quik {
        width: 352px;
        height: 40px;
        text-align: center;
      }

      .quik {
        margin-left: 50px;
      }
    }

    .el-radio__label {
      font-size: 16px;
    }

    .el-radio__input.is-checked + .el-radio__label {
      color: #303133;
    }
  }
</style>


<template>
  <div class="shopping-cart-style">
    <div class="container">
      <div class="normal_bg"></div>
      <div class="quik_bg"></div>
    </div>

    <el-radio-group v-model="shoppingStyle"
                    @change="typeChange">
      <div class="container">
        <div class="normal">
          <el-radio :label="false">普通样式</el-radio>
        </div>
        <div class="quik">
          <el-radio :label="true">快速购买</el-radio>
        </div>
      </div>
    </el-radio-group>

  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import store from '@/business-common/store.js';
  import service from '@/dss-wechat3rd/src/api/index';
  import settingsAPI from '@/dss-wechat3rd/src/api/settings.js';
  import wxLinkPages from '@/dss-wechat3rd/src/constants/wxLinkPages.js';
  import optionalTemplate from '../mini-index/template.js';

  export default {
    data() {
      return {
        optionalTemplate,
        shoppingStyle: false,
        userConfig: {}, //商户在我们平台的配置文件
        wxConfig: {}, //要去微信审核的配置文件
        // codeStatusDesc === '审核中'&& type === 1  不能修改tabbar
        codeStatusDesc: '',
        type: 0,
        currentTemplate: null
      };
    },
    computed: {
      ...mapState({
        curTemplateId: 'sellerTemplateId',
        customPages: 'customPages',
        env: 'env'
      })
    },

    mounted() {
      console.log(this.curTemplateId);
      this.getTemplateConfig();
    },

    methods: {
      getTemplateConfig() {
        service.getUserTemplate().then(response => {
          if (response.success === true) {
            store.commit('set_sellerTemplateId', response.data.id);
            this.codeStatusDesc = response.data.codeStatusDesc;
            this.type = response.data.type;
            // this.versionType = response.data.type;
            /* 新版本数据，数据拆分过 */
            if (response.data.tabBarConfig) {
              this.userConfig = JSON.parse(response.data.tabBarConfig);
              // this.wxConfig = JSON.parse(response.data.wxExtJson);
            } else {
              let config = JSON.parse(response.data.config);
              if (config.hasOwnProperty('ext')) {
                this.userConfig = JSON.parse(response.data.config).ext.tabBar;
              } else {
                this.userConfig = JSON.parse(response.data.config).tabBar;
              }
            }
            //获取模板配置信息
            this.optionalTemplate.forEach(item => {
              const config = JSON.parse(response.data.config);
              if (!!config.theme && item.id === config.theme.value) {
                this.currentTemplate = item;
              }
            });
            this.checkType();
          }
        });
      },

      checkType() {
        const tabbarList = this.userConfig.list;
        let isQuik = false;
        tabbarList.forEach(element => {
          if (element.realPath === 'pages/quick-buy/index' || element.realPath === 'wxat-common/pages/quick-buy/index') {
            isQuik = true;
          }
        });
        if (isQuik) {
          this.shoppingStyle = true;
        }
      },

      typeChange(val) {
        this.$confirm('更换购物车样式将会覆盖您之前设置的主页导航?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning'
        })
          .then(() => {
            if (val) {
              this.quick();
            } else {
              this.normal();
            }
          })
          .catch(() => {
            console.log('取消更换');
            this.shoppingStyle = !val;
          });
      },

      normal() {
        const home = {
          pagePath: wxLinkPages.page.HOME_PAGE,
          realPath: wxLinkPages.page.HOME_PAGE,
          text: '首页',
          iconPath: 'images/tabbar/home-off.png',
          selectedIconPath: 'images/tabbar/home-on.png',
          name: '首页',
          icon: 'home',
          able: false
        };

        const classify = {
          pagePath: wxLinkPages.page.CLASSIFY_PAGE,
          realPath: wxLinkPages.page.CLASSIFY_PAGE,
          text: '分类',
          iconPath: 'images/tabbar/classify-off.png',
          selectedIconPath: 'images/tabbar/classify-on.png',
          name: '分类',
          icon: 'classify',
          able: false
        };
        const shoppingCart = {
          pagePath: wxLinkPages.page.SHOPPING_CART_PAGE,
          realPath: wxLinkPages.page.SHOPPING_CART_PAGE,
          text: '购物车',
          iconPath: 'images/tabbar/shopping-cart-off.png',
          selectedIconPath: 'images/tabbar/shopping-cart-on.png',
          name: '购物车',
          icon: 'shopping-cart',
          able: false
        };

        const mine = {
          pagePath: wxLinkPages.page.MINE_PAGE,
          realPath: wxLinkPages.page.MINE_PAGE,
          text: '我的',
          iconPath: 'images/tabbar/mine-off.png',
          selectedIconPath: 'images/tabbar/mine-on.png',
          name: '我的',
          icon: 'mine',
          able: false
        };
        if (this.currentTemplate) {
          const navBackgroundColor = this.currentTemplate.navColor || '#ffffff';
          const navFrontColor = this.currentTemplate.navColor ? '#ffffff' : '#000000';
          home.navBackgroundColor = navBackgroundColor;
          home.navFrontColor = navFrontColor;
          classify.navBackgroundColor = navBackgroundColor;
          classify.navFrontColor = navFrontColor;
          shoppingCart.navBackgroundColor = navBackgroundColor;
          shoppingCart.navFrontColor = navFrontColor;
          mine.navBackgroundColor = navBackgroundColor;
          mine.navFrontColor = navFrontColor;
        }
        this.userConfig.list = [home, classify, shoppingCart, mine];
        this.save();
      },

      quick() {
        const home = {
          pagePath: wxLinkPages.page.HOME_PAGE,
          realPath: wxLinkPages.page.HOME_PAGE,
          text: '首页',
          iconPath: 'images/tabbar/home-off.png',
          selectedIconPath: 'images/tabbar/home-on.png',
          name: '首页',
          icon: 'home',
          able: false
        };
        const quickBuy = {
          pagePath: wxLinkPages.page.QUICK_BUY_PAGE,
          realPath: wxLinkPages.page.QUICK_BUY_PAGE,
          text: '快速购买',
          iconPath: 'images/tabbar/classify-off.png',
          selectedIconPath: 'images/tabbar/classify-on.png',
          name: '快速购买',
          icon: 'classify',
          able: false
        };
        const mine = {
          pagePath: wxLinkPages.page.MINE_PAGE,
          realPath: wxLinkPages.page.MINE_PAGE,
          text: '我的',
          iconPath: 'images/tabbar/mine-off.png',
          selectedIconPath: 'images/tabbar/mine-on.png',
          name: '我的',
          icon: 'mine',
          able: false
        };
        if (this.currentTemplate) {
          const navBackgroundColor = this.currentTemplate.navColor || '#ffffff';
          const navFrontColor = this.currentTemplate.navColor ? '#ffffff' : '#000000';
          home.navBackgroundColor = navBackgroundColor;
          home.navFrontColor = navFrontColor;
          quickBuy.navBackgroundColor = navBackgroundColor;
          quickBuy.navFrontColor = navFrontColor;
          mine.navBackgroundColor = navBackgroundColor;
          mine.navFrontColor = navFrontColor;
        }
        this.userConfig.list = [home, quickBuy, mine];
        this.save();
      },

      // 自定义页面可以不存在于config的pages中，自定义页面的index自带key，是可以找得到页面的配置数据的
      save() {
        //上传配置
        const params = {
          tabBarConfig: JSON.stringify(this.userConfig),
          id: this.curTemplateId
        };
        service.updateTemplate(params).then(res => {
          this.$message({ type: 'success', message: '配置已更新' });
          this.submitting = false;
        });
      }
    }
  };
</script>

