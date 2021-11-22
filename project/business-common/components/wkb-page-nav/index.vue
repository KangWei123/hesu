<template>
  <div class="wkt-sub-nav-container" :class="{ scroll: hasScroll, 'adapter-no-overflow': adapterIfrNoGap }">
    <div
      class="sub-nav-content-container"
      :class="{
        noNav: !visibleNav || isHideNav,
        subNavContentPos: adapterIfrNoGap,
        hasSubNav: visibleNav && !isHideNav && adapterIfrNoGap,
      }"
    >
      <div class="sub-nav-content" :class="[dark ? 'dark-nav-content' : '']">
        <el-breadcrumb separator="/" class="wkt-breadcrumb-container" v-if="isBreadcrumbRoute">
          <el-breadcrumb-item
            v-for="(bread, index) in breadcrumb"
            :key="index"
            :to="bread.path ? { path: bread.path } : null"
            replace
          >
            {{ bread.name }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div
          class="third-nav-item-container"
          v-if="
            !isBreadcrumbRoute &&
            showThirdNav &&
            isThirdMenu(menuList && menuList[currentIndex] && menuList[currentIndex].childMenu)
          "
          style=""
        >
          <div class="is-top">
            <div class="nav-wrap">
              <div class="nav" style="transform: translateX(0)">
                <div
                  v-for="(item, index) in menuList[currentIndex].childMenu"
                  class="item"
                  :class="{ active: childActive(item.url) }"
                  @click="tabSwitchChildren(item.url, index)"
                  :key="index"
                >
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="content-title"
          style="border-bottom: 1px solid #eff4fa"
          :style="titleStyle"
          v-if="
            !isBreadcrumbRoute &&
            !hideTitle &&
            ((!showThirdNav && showPageName && !showBread) ||
              !isThirdMenu(menuList && menuList[currentIndex] && menuList[currentIndex].childMenu))
          "
        >
          {{ visibleNav && menuList[currentIndex] ? menuList[currentIndex].name : pageName }}
        </div>
        <div class="real-content" :class="dark ? 'dark-bg' : ''">
          <switch-store-tip :check-store="checkStore">
            <router-view v-if="!customContent" />
            <slot v-else />
          </switch-store-tip>
        </div>
      </div>
      <div class="sub-nav-footer"></div>
    </div>
  </div>
</template>

<script>
  /**
   * 无子导航时，可使用slot的方式，具体使用方式参考console页面,
   * 支持页面带有面包屑，menu List的数据结构参考order/index.vue订单列页面
   * 支持不同的路由页面设置深色背景，具体设置参考order/index.vue
   * menuList:
   * {
   *     path: 路由路径
   *     name: 页面名称
   *     children: 子路由，结构相同
   *     breadcrumbs： 面包屑，结构相同
   *     showBorder: 是否显示标题下面的分割线，如果页面头部没有操作按钮，比如列表过滤，新增等按钮时，需要设置为true，有操作按钮时，不需要
   * }
   */
  import './index.less';
  import td from 'throttle-debounce';
  import AdapterIfr from '@/business-common/adapter-iframe/index';
  import { filterRoute } from '@/business-common/permission.js';
  import SwitchStoreTip from '../switch-store-tip/index.vue';

  export default {
    mixins: [AdapterIfr.AdapterMixins],
    components: { SwitchStoreTip },
    props: {
      businessScopeChildMenu: {
        type: Array,
        default: function () {
          return [];
        },
      },
      menuList: {
        type: Array,
        default: function () {
          return [];
        },
      },
      // 如果不传 默认menuList中第一个的path
      defaultPath: {
        type: String,
        default: null,
      },
      parentsPath: {
        type: String,
        default: null,
      },
      // 是否隐藏左边的导航
      hideNav: {
        type: Boolean,
        default: false,
      },
      // 不管有没有二级菜单，直接隐藏左边的导航
      isHideNav: {
        type: Boolean,
        default: false,
      },
      // 页面顶部显示的页面名称
      pageName: {
        type: String,
        default: '',
      },
      // 是否显示页面顶部的名称
      showPageName: {
        type: Boolean,
        default: true,
      },
      // 微信设置头部展示样式
      titleStyle: {
        type: Object,
        default: () => {},
      },
      customContent: {
        type: Boolean,
        default: false,
      },
      checkStore: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        hasScroll: false,
        isBreadcrumbRoute: false,
        breadcrumb: [],
      };
    },

    computed: {
      /**
       * 是否显示标题栏，下级页面可以通过路由的 meta.hideTitle 来控制
       */
      hideTitle() {
        return this.$route.meta && this.$route.meta.hideTitle === true;
      },
      currentIndex() {
        if (!this.hideNav && this.menuList) {
          let x = -1;
          this.menuList.forEach((item, index) => {
            if (this.currentPath.indexOf(item.url) !== -1) {
              x = index;
            }
          });
          return x;
        } else {
          return -1;
        }
      },
      currentPath() {
        return this.$route.path.replace(this.parentsPath, '') || this.default;
      },
      currentChildPath() {
        return this.$route.path;
      },

      default() {
        return this.defaultPath || this.menuList[0].url;
      },

      visibleNav() {
        let exist = false;
        if (this.menuList && this.menuList.length > 0) {
          (this.menuList || []).forEach(item => {
            if (this.currentPath.indexOf(item.url) !== -1) {
              exist = true;
            } else if (item.breadcrumbs && item.breadcrumbs.length) {
              item.breadcrumbs.forEach(breadcrumb => {
                if (this.currentPath.indexOf(breadcrumb.url) !== -1) {
                  exist = true;
                }
              });
            }
          });
          return !this.hideNav && exist;
        } else {
          return exist;
        }
      },
      showThirdNav() {
        return (
          this.visibleNav &&
          this.menuList[this.currentIndex] &&
          this.menuList[this.currentIndex].childMenu &&
          this.menuList[this.currentIndex].childMenu.length
        );
      },
      showBread() {
        let isShowBread = false;
        const curMenu = this.menuList ? this.menuList[this.currentIndex] : null;
        if (curMenu) {
          const breads = curMenu.breadcrumbs;
          if (breads && breads.length) {
            breads.forEach(bread => {
              if (this.currentPath.indexOf(bread.path) !== -1) {
                isShowBread = true;
              }
            });
          }
        }
        return isShowBread;
      },
      dark() {
        let isDark = false;
        if (this.menuList && this.menuList.length) {
          this.menuList.forEach(menu => {
            if (this.currentPath.indexOf(menu.path) !== -1 && menu.dark) {
              isDark = true;
            } else if (menu.children && menu.children.length) {
              menu.children.forEach(child => {
                if (this.currentPath.indexOf(child.path) !== -1 && child.dark) {
                  isDark = true;
                }
              });
            } else if (menu.breadcrumbs && menu.breadcrumbs.length) {
              menu.breadcrumbs.forEach(breadcrumb => {
                if (this.currentPath.indexOf(breadcrumb.path) !== -1 && breadcrumb.dark) {
                  isDark = true;
                }
              });
            }
          });
        }
        return isDark;
      },
      isThirdMenu() {
        return list => {
          if (!list) {
            return true;
          }
          const isHaveBtn = list.filter(item => item.isMenu);
          if (isHaveBtn && isHaveBtn.length) {
            return true;
          }
          return false;
        };
      },
    },

    watch: {
      $route(route) {
        console.log('wkb-page-nav watch', this.$route.matched, this.businessScopeChildMenu);
        this.isBreadcrumbRoute = this.checkIsBreadcrumbRoute();
        if (this.isBreadcrumbRoute) {
          this.breadcrumb = this.assembleBreadcrumb();
        }
      },
    },

    filters: {},

    mounted() {
      console.log('wkb-page-nav mounted', this.$route.matched, this.businessScopeChildMenu);
      this.isBreadcrumbRoute = this.checkIsBreadcrumbRoute();
      if (this.isBreadcrumbRoute) {
        this.breadcrumb = this.assembleBreadcrumb();
      }
      // 这个函数不能放在methods里，同个页面有多个相同组件，debounce会有影响
      this.resize = td.debounce(300, () => {
        this.hasScroll = this.hasScrollbar();
      });

      this.hasScroll = this.hasScrollbar();

      window.addEventListener('resize', this.resize);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resize);
    },

    methods: {
      checkIsBreadcrumbRoute() {
        const routeMeta = this.$route.meta;
        const businessScopeChildMenu = this.businessScopeChildMenu;
        return businessScopeChildMenu && businessScopeChildMenu.length && routeMeta && routeMeta.bread;
      },
      assembleBreadcrumb() {
        const routeMeta = this.$route.meta;
        const routers = this.$route.matched;
        let childMenus = this.businessScopeChildMenu;
        const breadcrumb = [];
        function findRouteMenu(route, tempMenus) {
          const findMenu = tempMenus.find(item => {
            return item.url === route.path;
          });
          if (findMenu) {
            breadcrumb.push({
              path: findMenu.url,
              name: findMenu.name,
            });
          }
          return findMenu;
        }
        routers.forEach((route, index) => {
          if (childMenus && index < routers.length - 1) {
            const findMenu = findRouteMenu(route, childMenus);
            if (findMenu) {
              childMenus = findMenu.childMenu;
            }
          }
        });
        breadcrumb.push({
          path: null,
          name: routeMeta.title,
        });
        console.log('wkb-page-nav breadcrumb', breadcrumb);
        return breadcrumb;
      },
      hasScrollbar() {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      },
      active(item) {
        let navActive = false;
        // 若直接navActive = this.currentPath.indexOf(item.path) !== -1; 如果一个路由是app 另一个路由是appointment 这样路由是appointment，app路由也能响应
        if (this.currentPath.indexOf('/') !== -1) {
          navActive = this.currentPath.indexOf(item.url) !== -1;
        } else {
          navActive = this.currentPath === item.url;
        }
        if (!navActive && item.breadcrumbs && item.breadcrumbs.length) {
          item.breadcrumbs.forEach(breadcrumb => {
            if (this.currentPath.indexOf(breadcrumb.url) !== -1) {
              navActive = true;
            }
          });
        }
        return navActive;
      },

      childActive(path) {
        return this.currentChildPath.indexOf(path) !== -1;
      },
      tabSwitch(item, index) {
        if (!item.disabled) {
          const path = filterRoute(this.menuList, index);
          this.$router.push(path);
        }
      },
      tabSwitchChildren(parentsPath, index) {
        // const childPath = this.parentsPath + parentsPath + '/' + path;
        this.$router.push(parentsPath);
      },
    },
  };
</script>
