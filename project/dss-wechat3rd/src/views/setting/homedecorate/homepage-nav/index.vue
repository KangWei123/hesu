<template>
  <div class="homedecorate-nav">
    <div class="nav-edit-title Add-Manage-Button">
      <a class="default-nav"
          href="javascript:;"
          @click="recovery">恢复导航</a>
    </div>
    <div class="home-decorate-tips">
      <span>1、首页的底部导航可以自由配置图标以及连接。</span>
      <span>2、满足不同店铺的功能配置入口。</span>
      
    </div>
    <div class="home-decorate-container" v-loading="loading">
      <div class="nav-bg">
        <div class="nav-screen">
          <div class="nav-screen-header"
              v-if="Tab_Bar && Tab_Bar[selectIndex]"
              :class="Tab_Bar[selectIndex].navFrontColor === '#000000' ? 'black-theme' : 'light-theme'"
              :style="{'background-color': Tab_Bar[selectIndex].navBackgroundColor}">
          </div>
          <div class="nav-tabbar">
            <div v-for="(item,index) in Tab_Bar"
                :key="index"
                class="menu"
                :style="'width:'+100/(Tab_Bar.length)+'%'">
              <div class="icon-area"
                  v-if="!(item.icon || item.selectedIconPath || item.iconPath)">
                <img class="icon" />
                <span class="text">{{item.text}}</span>
              </div>
              <div class="icon-area"
                  v-else>
                <span class="img-box"
                      :style="{background:OnIconImgSrc(item) && !OnIconImgSrc(item).startsWith('http') ? themeColor : ''}"
                      v-if="selectIndex==index">
                  <img class="icon"
                      :src="OnIconImgSrc(item)" />
                </span>
                <img class="icon"
                    :src="OffIconImgSrc(item)"
                    v-else />
                <span class="text"
                      :style="{'color': selectIndex==index ? themeColor : '#000000'}">{{item.text}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="nav-add-button"
           v-if="Tab_Bar.length<libraryData.length">
          <el-button type="primary"
                     @click="clickAddNavItem">+新增导航</el-button>
        </div>
      </div>
      <div class="nav-edit">
        <nav-edit-item v-for="(item,index) in Tab_Bar"
                       :theme-color="themeColor"
                       :ref="'net_'+index"
                       :key="index"
                       :dataSource="item"
                       :index="index"
                       :pages="tabbarLinkPages"
                       :usedPages="usedPages"
                       :bool-edit="itemStauts[index]"
                       @choose="setIndex"
                       @pickPageChange="itemPageChange"
                       @deleteItem="deleteItem1"></nav-edit-item>
      </div>
    </div>
    <div class="bottom-button">
      <el-button type="primary"
                 @click="save">保存
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import store from '@/business-common/store.js';
import service from '@/dss-wechat3rd/src/api/index';
import './index.less';
import '../custom-page-block.less';
import NavEditItem from './NavEditItem.vue';
import imageLibrary from './imageLibrary';
import template from '../mini-index/template.js';
import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
export default {
  mixins: [industryHelperMixin],
  components: {
    NavEditItem
  },
  data: function() {
    return {
      loading: false,
      industryTemplates: null,
      userConfig: {}, //商户在我们平台的配置文件
      themeTemplate: {}, //用户模板配置
      dialogVisible: false,
      selectIndex: 0,
      Tab_Bar: [],
      itemStauts: [],
      SourceTabBar: '',
      versionType: 0, //1 dev 2 release
      tabbarLinkPages: [],
      libraryData: [],
      items: [],
      // codeStatusDesc === '审核中'&& type === 1  不能修改tabbar
      codeStatusDesc: '',
      type: 0,
      themeColor: template[0].iconColor,
      usedPages: {},
      loading: false
    };
  },

  computed: {
    ...mapState({
      curTemplateId: 'sellerTemplateId',
      customPages: 'customPages',
      env: 'env'
    }),

    ALL_ICON_MAP() {
      return imageLibrary.iconMap(this.mGetIndustryKey());
    }
  },

  mounted() {
    this.industryTemplates = this.mGetThemeTemplateOptions();
    this.themeColor = this.mGetDefaultIndustryTheme().navColor;
    this.libraryData = this.mGetTabbarLinkList();
    this.getUserTemplate();
  },
  methods: {
    OnIconImgSrc(tabbarItem) {
      if (tabbarItem.selectedIconPath.startsWith('http')) {
        return tabbarItem.selectedIconPath;
      } else {
        const icon = imageLibrary.iconMap(this.mGetIndustryKey())[tabbarItem.icon];
        if (icon) {
          return icon.onIcon;
        }
      }
      return null;
    },
    OffIconImgSrc(tabbarItem) {
      if (tabbarItem.iconPath.startsWith('http')) {
        return tabbarItem.iconPath;
      } else {
        const icon = imageLibrary.iconMap(this.mGetIndustryKey())[tabbarItem.icon];
        if (icon) {
          return icon.offIcon;
        }
      }
      return null;
    },

    //获取用户模版
    getUserTemplate() {
      this.loading = true;
      service
        .getUserTemplate()
        .then(response => {
          if (response.success === true) {
            store.commit('set_sellerTemplateId', response.data.id);
            // if (!(this.customPages && this.customPages.length)) {
            //   this.getCustomPages(_ => {
            //     this.handleLogic(response);
            //   });
            // } else {
            //   this.handleLogic(response);
            // }
            // 主页导航仅开放至管理员，取企业级自定义页
            this.getCustomPages(_ => {
              this.loading = false;
              this.handleLogic(response);
            });
          }
        })
        .catch(() => {
          console.log('getUserTemplate failed');
        });
    },
    // 获取用户所有页面
    getCustomPages(callBack) {
      // 主页导航仅开放至管理员, 查询企业级自定义页
      service
        .getCustomPagesV3({
          sellerTemplateId: this.curTemplateId,
          storeId: 0
        })
        .then(response => {
          store.commit('set_customPages', response.data || []);
          callBack && callBack();
        });
    },

    handleLogic(response) {
      this.codeStatusDesc = response.data.codeStatusDesc;
      this.type1 = response.data.type;
      this.versionType = response.data.type;
      /* 新版本数据，数据拆分过 */
      if (response.data.tabBarConfig) {
        this.userConfig = JSON.parse(response.data.tabBarConfig);
      } else {
        let config = JSON.parse(response.data.config);
        if (config.hasOwnProperty('ext')) {
          this.userConfig = JSON.parse(response.data.config).ext.tabBar;
        } else {
          this.userConfig = JSON.parse(response.data.config).tabBar;
        }
      }
      if (this.userConfig && this.userConfig.list) {
        this.Tab_Bar = this.fixedParams(this.userConfig.list);
        //记住，以便还原
        this.SourceTabBar = JSON.stringify(this.Tab_Bar);
        if (response.data.config) {
          const themeConfig = JSON.parse(response.data.config);
          const themeTemplate = themeConfig.theme ? themeConfig.theme.value : null;
          if (themeTemplate) {
            const themeColor =
              this.industryTemplates.find(tmp => {
                return tmp.id === themeTemplate;
              }) ||
              themeConfig.theme.template ||
              {};

            this.themeColor = themeColor.navColor || themeColor.iconColor;
          }
        }
        this.checkItemStatus();
      }
    },

    fixedParams(x) {
      (x || []).forEach(item => {
        if (!item.hasOwnProperty('navBackgroundColor')) {
          this.$set(item, 'navBackgroundColor', '#ffffff');
          this.$set(item, 'navFrontColor', '#000000');
        }
        if (!item.realPath.includes('pages/custom/index')) {
          if (item.pagePath.startsWith('pages/')) {
            if (!(item.pagePath === 'pages/serve-list/index' || item.pagePath === 'pages/card-list/index')) {
              item.pagePath = 'wxat-common/' + item.pagePath;
              item.realPath = item.pagePath;
            }
          }
        }
      });
      return x;
    },

    // 检查item的可用状态，是否能改变linkPage
    checkItemStatus() {
      // 获取在tabbar存在的页面
      const x = {
        custom: [],
        default: []
      };
      this.Tab_Bar.forEach(item => {
        if (item.realPath) {
          if (item.realPath.includes('pages/custom')) {
            x.custom.push(item.realPath);
          } else {
            x.default.push(item.realPath);
          }
        }
      });
      this.usedPages = x;
      const itemStauts = [];
      this.Tab_Bar.forEach(item => {
        let isExit = false;
        if (!!item.pagePath) {
          this.libraryData.forEach(item1 => {
            if (item1.pagePath.includes(item.pagePath)) {
              itemStauts.push(!!item1.able);
              isExit = true;
            }
          });
        }
        if (!isExit) {
          itemStauts.push(true);
        }
      });
      this.itemStauts = itemStauts;
    },

    itemPageChange(obj) {
      const context = obj.context;
      const item = obj.params;
      if (!item) {
        this.$set(context, 'realPath', '');
        this.$set(context, 'name', '');
        this.$set(context, 'pagePath', '');
        this.checkItemStatus();
        return;
      }
      if (item.index.includes('pages/custom/index')) {
        // 对配置进行遍历，如配置中已经存在自定义，承载页就要用tabbar-custom1页面
        let existCount = 0;
        this.Tab_Bar.forEach(item1 => {
          if (item1.pagePath.includes('pages/tabbar-custom')) {
            existCount++;
          }
        });
        if (existCount === 0) {
          this.$set(context, 'pagePath', 'wxat-common/pages/tabbar-custom/index');
        } else if (existCount === 1) {
          this.$set(context, 'pagePath', 'wxat-common/pages/tabbar-custom1/index');
        } else {
          this.$set(context, 'pagePath', 'wxat-common/pages/tabbar-custom2/index');
        }
      } else {
        this.$set(context, 'pagePath', item.index);
      }
      this.$set(context, 'realPath', item.index);
      this.$set(context, 'name', item.name);
      this.checkItemStatus();
    },

    //恢复
    recovery() {
      this.Tab_Bar.length = 0;
      let ary = JSON.parse(this.SourceTabBar);
      ary.forEach(item => {
        this.Tab_Bar.push(item);
      });
    },

    //添加一个导航项目
    clickAddNavItem() {
      let length = this.Tab_Bar.length;
      //不能tabbar大于5个
      if (length >= 5) {
        this.$message.error('导航不能超过5个');
        return;
      }
      let obj = {
        pagePath: '', //页面承载的容器页面，（与微信提交的一致，不变）
        text: '', //导航显示文本
        iconPath: '', // 正常图片
        selectedIconPath: '', //选中图标
        realPath: '', // 页面的index值 （改变链接时，修改的字段）
        navFrontColor: this.themeColor === this.industryTemplates[0].iconColor ? '#000000' : '#ffffff',
        navBackgroundColor: this.themeColor === this.industryTemplates[0].iconColor ? '#ffffff' : this.themeColor,
        able: true //是否能够编辑
      };
      // 在Tab_Bar倒数第二个的位置插入
      this.Tab_Bar.splice(length - 1, 0, obj);
      this.checkItemStatus();
    },

    changePageLinkRange() {
      const tabbarLinkPages = [];
      this.libraryData.forEach(item => {
        if (item.able) {
          let isExit = false;
          this.Tab_Bar.forEach(item1 => {
            if (item.realPath === item1.realPath) {
              isExit = true;
            }
          });
          if (!isExit) {
            tabbarLinkPages.push({
              index: item.realPath,
              name: item.text
            });
          }
        }
      });
      if (this.customPages) {
        this.tabbarLinkPages = this.customPages.concat(tabbarLinkPages);
      } else {
        this.tabbarLinkPages = tabbarLinkPages;
      }
    },

    // 查看页面
    reviewPage(val) {
      this.$router.push({
        path: '/setting/homedecorate/custom-page/decorate',
        query: { pageIndex: val.index }
      });
    },

    //选中
    setIndex(index) {
      this.selectIndex = index;
    },

    // 自定义页面可以不存在于config的pages中，自定义页面的index自带key，是可以找得到页面的配置数据的
    save() {
      /*if (this.codeStatusDesc === '审核中' && this.type1 === 1) {
        this.$message.error('小程序正在审核中，待小程序审核完毕，即可修改！');
        return;
      }*/
      // 调整 tabbar_custom
      let tabberCustomInd = 0;
      this.Tab_Bar = this.Tab_Bar.map(i => {
        if (/wxat-common\/pages\/tabbar-custom/.test(i.pagePath)) {
          const _item = {
            ...i,
            pagePath: `wxat-common/pages/tabbar-custom${tabberCustomInd % 3 ? tabberCustomInd : ''}/index`
          };
          tabberCustomInd = tabberCustomInd + 1;
          return _item;
        }
        return i;
      });
      //验证
      for (let i = 0, j = this.Tab_Bar.length; i < j; i++) {
        let error = this.$refs['net_' + i][0].tryToValidate();
        if (!!error) {
          return this.$message({ message: error, type: 'error' });
        }
        if (!this.Tab_Bar[i].realPath) {
          return this.$message({ message: `请输入第${i + 1}导航链接`, type: 'error' });
        }
      }
      this.userConfig.list = this.Tab_Bar;
      //上传配置
      this.uploadConfig();
    },

    uploadConfig() {
      // 1、创建新的dev版本
      // service.createNewDev().then(response => {
      // store.commit('set_sellerTemplateId', response.data);
      // 2、更新模板配置
      const params = {
        tabBarConfig: JSON.stringify(this.userConfig),
        id: this.curTemplateId
      };
      service.updateTemplate(params).then(res => {
        //记住，以便还原
        this.SourceTabBar = JSON.stringify(this.Tab_Bar);
        this.changePageLinkRange();
        this.$message({ type: 'success', message: '配置已更新' });
      });
      // });
    },

    deleteItem1(item, index) {
      if (this.Tab_Bar.length <= 2) {
        return this.$message.error('导航不能少于2个');
      }
      this.Tab_Bar.splice(index, 1);
      this.checkItemStatus();
    }
  }
};
</script>
