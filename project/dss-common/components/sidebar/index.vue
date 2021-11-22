<template>
  <el-aside class="common-side-menu"
            width="140px">
    <slot></slot>
    <el-menu :default-active="path"
             @select="onMenuSelect"
             :unique-opened="false"
             :default-openeds="openeds"
             ref="menu">
      <template v-for="(menuGroup, groupIndex) in menuList.groupMenus">
        <div v-if="menuList.dividers"
             class="menu-divider"
             :class="groupIndex !== 0 ? 'divider-line' : ''">
          <i :class="menuList.dividers[groupIndex].icon"></i>
          <span>{{menuList.dividers[groupIndex].name}}</span>
        </div>
        <slot :name="'menu-action-' + groupIndex"></slot>
        <template v-for="(item, index) in menuGroup">

          <el-submenu v-if="item.childMenu&&item.childMenu.length"
                      :index="item.url"
                      :key="item.url"
                      :disabled="item.disabled">

            <template v-if="item.disabled"
                      slot="title">
              <el-popover placement="left"
                          width="200"
                          trigger="hover"
                          :content="item.popTitle ? item.popTitle : '需打通相关数据' ">
                <div slot="reference">
                  <i :class="item.icon"></i>
                  <span>{{item.name}}</span>
                </div>
              </el-popover>
            </template>
            <template slot="title"
                      v-else>
              <i :class="item.icon"></i>
              <span>{{item.name}}</span>
            </template>

            <el-menu-item v-for="(child,index) in item.childMenu"
                          :disabled="child.disabled ||item.disabled"
                          :index="child.url"
                          :key="child.url">
              <template v-if="child.disabled||item.disabled">
                <el-popover placement="left"
                            width="200"
                            trigger="hover"
                            :content="child.popTitle ? child.popTitle  : item.popTitle ">
                  <span slot="reference">{{child.name}}</span>
                </el-popover>
              </template>
              <a slot="title"
                 class="redirect"
                 v-else-if="child.redirect"
                 :href="child.redirect  + '?wkbStatus=' + wkbStatus"
                 target="_blank"
                 @click.stop="stopClick">
                <i :class="child.icon"></i>
                <span slot="title">{{child.name}}</span>
              </a>
              <span v-else>{{child.name}}</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-else
                        :disabled="item.disabled"
                        :index="item.url"
                        :key="item.url">
            <template v-if="item.disabled">
              <el-popover placement="left"
                          width="200"
                          trigger="hover"
                          :content="item.popTitle ? item.popTitle : '需打通相关数据' ">
                <div slot="reference">
                  <i :class="item.icon"></i>
                  <span>{{item.name}}</span>
                </div>
              </el-popover>
            </template>
            <template v-else>
              <a slot="title"
                 class="redirect"
                 v-if="item.redirect"
                 :href="item.redirect"
                 target="_blank"
                 @click.stop="stopClick">
                <i :class="item.icon"></i>
                <span slot="title">{{item.name}}</span>
              </a>
              <div slot="title"
                   v-else>
                <i :class="item.icon"></i>
                <span>{{item.name}}</span>
              </div>
            </template>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </el-aside>
</template>

<script>
import './style.less';
import { mapState } from 'vuex';
export default {
  props: {
    menuList: {
      type: Object,
      default: function() {
        return {};
      }
    },
    refuch: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      openeds: [] //默认展开的数组
    };
  },

  computed: {
    ...mapState({
      wkbStatus: 'wkbStatus'
    }),
    path() {
      let router = this.$router.currentRoute;
      let path = this.$route.path;
      if (router.matched && router.matched.length) {
        if (!!router.matched[0] && !!router.matched[0].path) {
          path = router.matched[0].path;
        } else if (!!router.matched[1] && !!router.matched[1].path) {
          path = router.matched[1].path;
        }
      }
      return path;
    }
  },

  mounted() {},

  //监听菜单改变，默认展开所有节点
  watch: {
    menuList: {
      handler(newVal, oldVal) {
        this.OpeneMenu();
      },
      deep: true
    },
    refuch() {
      this.$refs.menu.activeIndex = null;
    }
  },

  methods: {
    //选择菜单时
    onMenuSelect(index, indexPath) {
      let menu = null;
      for (let menuGroup of this.menuList.groupMenus) {
        const findMenu = menuGroup.find(item => {
          return item.url === indexPath[0];
        });
        if (findMenu) {
          menu = findMenu;
          break;
        }
      }
      if (menu && !menu.redirect) {
        if (window.location.href.indexOf(menu.business) !== -1) {
          this.$router.push(index);
        } else {
          window.top.location.href = menu.business + index;
        }
      } else {
      }
    },

    OpeneMenu() {
      if (this.menuList.groupMenus && this.menuList.openeds) {
        let openeds = [];
        let menus = this.menuList.groupMenus[0];
        menus.forEach(item => {
          if (!item.disabled && item.childMenu) {
            openeds.push(item.url);
          }
        });
        this.openeds = openeds;
      }
    }
  }
};
</script>
