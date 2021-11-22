<template>
  <div class="homedecorate-nav">
    <div class="home-decorate-tips">
      <span>1、首页的底部导航可以自由配置图标以及连接。</span>
      <span>2、满足不同店铺的功能配置入口。</span>
    </div>
    <div class="home-decorate-container">
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
                 v-if="!item.icon">
              <img class="icon" />
              <span class="text">{{item.text}}</span>
            </div>
            <div class="icon-area"
                 v-else>
              <img class="icon"
                   :src="OnIconImgSrc(item.icon)"
                   v-if="selectIndex==index" />
              <img class="icon"
                   :src="OffIconImgSrc(item.icon)"
                   v-else />
              <span class="text"
                    :style="{'color': selectIndex==index ? themeColor : '#000000'}">{{item.text}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="nav-edit">
        <div class="nav-edit-title">
          <span>导航设置</span>
          <a class="dss-link"
             href="javascript:;"
             @click="recovery">恢复导航</a>
        </div>
        <nav-edit-item v-for="(item,index) in Tab_Bar"
                       :ref="'net_'+index"
                       :key="index"
                       :dataSource="item"
                       :index="index"
                       :pages="tabbarLinkPages"
                       :bool-edit="itemStauts[index]"
                       @choose="setIndex"
                       @pickPageChange="itemPageChange"
                       @deleteItem="deleteItem1"></nav-edit-item>
        <div class="nav-add-title"
             v-if="Tab_Bar.length<libraryData.length">
          <a class="dss-link"
             href="javascript:;"
             @click="clickAddNavItem">+新增一个底部导航</a>
        </div>
        <el-button class="dss-btn-primary dss-btn-middle"
                   type="primary"
                   @click="save">保存
        </el-button>
      </div>
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
import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
import settingsAPI from '@/dss-wechat3rd/src/api/settings.js';
// import func from './vue-temp/vue-editor-bridge';
export default {
  mixins: [industryHelperMixin],
  components: {
    NavEditItem
  },
  data: function() {
    return {
      userConfig: {}, //商户在我们平台的配置文件
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
      themeColor: null
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
    this.libraryData = this.mGetTabbarLinkList();
    this.getUserTemplate();
    // this.fixConfig();
  },
  methods: {
    OnIconImgSrc(iconName) {
      const icon = imageLibrary.iconMap(this.mGetIndustryKey())[iconName];
      if (icon) {
        return icon.onIcon;
      }
      return null;
    },
    OffIconImgSrc(iconName) {
      const icon = imageLibrary.iconMap(this.mGetIndustryKey())[iconName];
      if (icon) {
        return icon.offIcon;
      }
      return null;
    },
    //获取用户模版
    getUserTemplate() {
      service.getUserTemplate().then(response => {
        if (response.success === true) {
          store.commit('set_sellerTemplateId', response.data.id);
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
          this.Tab_Bar = this.fixedParams(this.userConfig.list.concat());
          this.themeColor = this.userConfig.selectedColor;
          //记住，以便还原
          this.SourceTabBar = JSON.stringify(this.Tab_Bar);
          this.checkItemStatus();
          if (!(this.customPages && this.customPages.length)) {
            this.getCustomPages();
          } else {
            this.changePageLinkRange();
          }
        }
      });
    },

    fixedParams(x) {
      (x || []).forEach(item => {
        if (!item.hasOwnProperty('navBackgroundColor')) {
          this.$set(item, 'navBackgroundColor', '#ffffff');
          this.$set(item, 'navFrontColor', '#000000');
        }
      });
      return x;
    },

    // 检查item的可用状态，是否能改变linkPage
    checkItemStatus() {
      const itemStauts = [];
      this.Tab_Bar.forEach(item => {
        let isExit = false;
        this.libraryData.forEach(item1 => {
          if (item.pagePath === item1.pagePath) {
            itemStauts.push(!!item1.able);
            isExit = true;
          }
        });
        if (!isExit) {
          if (item.hasOwnProperty('able')) {
            itemStauts.push(!!item.able);
          } else {
            itemStauts.push(true);
          }
        }
      });
      this.itemStauts = itemStauts;
    },

    itemPageChange() {
      this.changePageLinkRange();
    },

    beforeSubmit(source) {
      // 1、先找出真正需要调整的page
      let realPaths = [];
      source.forEach((item, index) => {
        if (item.realPath === item.pagePath) {
          return;
        }
        realPaths.push(item);
      });

      // 2、给realPath找到一个最合适的坑位
      realPaths.forEach(item1 => {
        // 自定义页，先不做处理，(如果占领对应的业务)后续需要做调整的人会来处理他，（比如 自定义占用a的坑,而a的坑占领b的坑，此时就会让自定义占领b的坑，a回归本质，占用a的坑）
        if (item1.realPath.indexOf('custom') != -1) return;
        source.forEach(item2 => {
          // realPath === pagePath的肯定是不需要调整的
          if (item2.realPath === item2.pagePath) {
            return;
          }
          // 对于非自定义页的realpath，一定要找到对应的业务的坑
          if (item1.realPath === item2.pagePath) {
            let temp = item1.pagePath;
            item1.pagePath = item2.pagePath;
            item2.pagePath = temp;
          }
        });
      });

      // 3、可能tabbar的数量少于额定的数目，有些业务没有对应到对应的坑位
      realPaths.forEach(item1 => {
        // 自定义页，先不做处理，(如果占领对应的业务)后续需要做调整的人会来处理他，（比如 自定义占用a的坑,而a的坑占领b的坑，此时就会让自定义占领b的坑，a回归本质，占用a的坑）
        if (item1.realPath.indexOf('custom') !== -1) return;
        item1.pagePath = item1.realPath;
      });
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
      if (length > this.libraryData.length) return; //不能tabbar大于5个

      // 坑位先给出来，
      let tempPage = '';
      for (const item of this.libraryData) {
        let exist = false;
        this.Tab_Bar.forEach(item1 => {
          if (item.pagePath === item1.pagePath) {
            exist = true;
          }
        });
        if (!exist) {
          tempPage = item.pagePath;
          break;
        }
      }

      let obj = {
        pagePath: tempPage, //页面承载的容器页面，（与微信提交的一致，不变）
        text: '', //导航显示文本
        iconPath: '', // 正常图片
        selectedIconPath: '', //选中图标
        realPath: '', // 页面的index值 （改变链接时，修改的字段）
        navFrontColor: '#000000',
        navBackgroundColor: '#ffffff',
        able: true //是否能够编辑
      };

      // 在Tab_Bar倒数第二个的位置插入
      this.Tab_Bar.splice(length - 1, 0, obj);
      this.checkItemStatus();
    },

    // 获取用户所有页面
    getCustomPages() {
      service
        .getCustomPages({
          sellerTemplateId: this.curTemplateId
        })
        .then(response => {
          store.commit('set_customPages', response.data);
          this.changePageLinkRange();
        });
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
      this.tabbarLinkPages = this.customPages.concat(tabbarLinkPages);
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
      if (this.codeStatusDesc === '审核中' && this.type1 === 1) {
        this.$message.error('小程序正在审核中，待小程序审核完毕，即可修改！');
        return;
      }
      //验证
      for (let i = 0, j = this.Tab_Bar.length; i < j; i++) {
        let error = this.$refs['net_' + i][0].tryToValidate();
        if (!!error) {
          return this.$message({ message: error, type: 'error' });
        }
      }
      this.beforeSubmit(this.Tab_Bar);
      this.userConfig.list = this.Tab_Bar;
      const wxTabbarConfig = JSON.parse(JSON.stringify(this.Tab_Bar));
      // wxTabbarConfig = JSON.parse(JSON.stringify(this.Tab_Bar)); //拷贝副本，不影响Tab_Bar
      wxTabbarConfig.forEach((item, index) => {
        //删除多余字段（微信的审核并不需要下面这些字段）
        item.pagePath = item.realPath;
        delete item.realPath;
        delete item.name;
        delete item.icon;
        delete item.able;
      });
      //上传配置
      this.uploadConfig();
    },

    uploadConfig() {
      // 1、创建新的dev版本
      service.createNewDev().then(response => {
        store.commit('set_sellerTemplateId', response.data);
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
      });
    },

    deleteItem1(item, index) {
      this.Tab_Bar.splice(index, 1);
      this.checkItemStatus();
    }

    // fixConfig() {
    //   // 1、创建新的dev版本
    //   service.createNewDev().then(response => {
    //     store.commit('set_sellerTemplateId', response.data);
    //     // 2、更新模板配置
    //     const params = {
    //       tabBarConfig: JSON.stringify({
    //         selectedColor: '#df606f',
    //         list: [
    //           {
    //             pagePath: 'pages/home/index',
    //             realPath: 'pages/home/index',
    //             text: '首页',
    //             iconPath: 'images/tabbar/home-off.png',
    //             selectedIconPath: 'images/tabbar/home-on.png',
    //             name: '首页',
    //             icon: 'home',
    //             able: false
    //           },
    //           {
    //             pagePath: 'pages/card-list/index',
    //             realPath: 'pages/card-list/index',
    //             text: '卡项',
    //             iconPath: 'images/tabbar/card-off.png',
    //             selectedIconPath: 'images/tabbar/card-on.png',
    //             name: '卡项',
    //             icon: 'card',
    //             able: true
    //           },
    //           {
    //             pagePath: 'pages/serve-list/index',
    //             realPath: 'pages/serve-list/index',
    //             text: '服务',
    //             iconPath: 'images/tabbar/server-off.png',
    //             selectedIconPath: 'images/tabbar/server-on.png',
    //             name: '服务',
    //             icon: 'server',
    //             able: true
    //           },
    //           {
    //             pagePath: 'pages/goods-list/index',
    //             realPath: 'pages/goods-list/index',
    //             text: '产品',
    //             iconPath: 'images/tabbar/product-off.png',
    //             selectedIconPath: 'images/tabbar/product-on.png',
    //             name: '产品',
    //             icon: 'product',
    //             able: true
    //           },
    //           {
    //             pagePath: 'pages/mine/index',
    //             realPath: 'pages/mine/index',
    //             text: '我的',
    //             iconPath: 'images/tabbar/mine-off.png',
    //             selectedIconPath: 'images/tabbar/mine-on.png',
    //             name: '我的',
    //             icon: 'mine',
    //             able: false
    //           }
    //         ]
    //       }),
    //       id: this.curTemplateId,
    //       wxExtJson: JSON.stringify({
    //         ext: {},
    //         directCommit: false,
    //         extAppid: 'wx9ed1f0eec71e8298',
    //         tabBar: {
    //           selectedColor: '#df606f',
    //           list: [
    //             {
    //               pagePath: 'pages/home/index',
    //               text: '首页',
    //               iconPath: 'images/tabbar/home-off.png',
    //               selectedIconPath: 'images/tabbar/home-on.png'
    //             },
    //             {
    //               pagePath: 'pages/card-list/index',
    //               text: '卡项',
    //               iconPath: 'images/tabbar/card-off.png',
    //               selectedIconPath: 'images/tabbar/card-on.png'
    //             },
    //             {
    //               pagePath: 'pages/serve-list/index',
    //               text: '服务',
    //               iconPath: 'images/tabbar/server-off.png',
    //               selectedIconPath: 'images/tabbar/server-on.png'
    //             },
    //             {
    //               pagePath: 'pages/goods-list/index',
    //               text: '产品',
    //               iconPath: 'images/tabbar/product-off.png',
    //               selectedIconPath: 'images/tabbar/product-on.png'
    //             },
    //             {
    //               pagePath: 'pages/mine/index',
    //               text: '我的',
    //               iconPath: 'images/tabbar/mine-off.png',
    //               selectedIconPath: 'images/tabbar/mine-on.png'
    //             }
    //           ]
    //         },
    //         extEnable: true
    //       })
    //     };
    //     service.updateTemplate(params).then(res => {});
    //   });
    // }
  }
};
</script>
