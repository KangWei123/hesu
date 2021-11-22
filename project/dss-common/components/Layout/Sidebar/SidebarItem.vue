<template>
  <div class="sidebar-item-container">
    <template v-if="hasOneShowingChild(item.childMenu, item) && onlyOneChild.noShowingChildren">
      <app-link
        v-if="onlyOneChild.url"
        :to="resolvePath(redirectPath(onlyOneChild))"
        :is-disabled="isDisabled(onlyOneChild)"
      >
        <el-menu-item
          :disabled="isDisabled(onlyOneChild)"
          :index="resolvePath(onlyOneChild.url)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item :child-item="onlyOneChild" :opts="onlyOneChild.opts" :is-disabled="isDisabled(onlyOneChild)" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.url)" popper-append-to-body>
      <template slot="title">
        <item :child-item="item" :opts="item.opts" />
      </template>
      <sidebar-item
        v-for="child in item.childMenu"
        :key="child.url"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.url)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
  import path from 'path';
  import { isExternal } from './validate.js';
  import Item from './Item';
  import AppLink from './Link';
  import { SHOW_CHILD_MAX } from '@/dss-common/utils/routeHandle.js';

  export default {
    name: 'SidebarItem',
    components: { Item, AppLink },
    props: {
      // route object
      item: {
        type: Object,
        required: true,
      },
      isNest: {
        type: Boolean,
        default: false,
      },
      basePath: {
        type: String,
        default: '',
      },
      // 展示层级数
      showLevel: {
        type: Number,
        default: 2,
      },
      // 最大子路由展示个数
      // 超出个数则显示子路由，只显示父路由
      showChildMaxNum: {
        type: Number,
        default: SHOW_CHILD_MAX,
      },
    },
    computed: {
      redirectPath() {
        return item => {
          if (
            item &&
            item.identifier !== 'ma_marketing' &&
            item.childMenu &&
            item.childMenu.length &&
            item.childMenu[0].url
          ) {
            return item.childMenu[0].url;
          }
          return item.url;
        };
      },
      isDisabled() {
        return item => {
          if (item && item.disabled) {
            return true;
          }
          return false;
        };
      },
    },
    data() {
      // TODO: refactor with render function
      this.onlyOneChild = null;
      return {};
    },
    methods: {
      hasOneShowingChild(children = [], parent) {
        // 异常情况处理
        if (children === null) {
          children = [];
        }

        const showingChildren =
          children &&
          children.filter(item => {
            return item.isMenu && item.level <= this.showLevel;
          });

        const len = showingChildren && showingChildren.length;

        // 只有一个路由时，默认展示其子级路由
        if (len === 1) {
          this.onlyOneChild = { ...showingChildren[0], icon: parent.icon };
          return true;
        }

        // 没有子路由时或者超出路由个数范围时，只显示父级路由
        if (len === 0 || len > SHOW_CHILD_MAX) {
          this.onlyOneChild = { ...parent, path: '', noShowingChildren: true };
          return true;
        }

        return false;
      },
      resolvePath(routePath) {
        if (isExternal(routePath)) {
          return routePath;
        }
        if (isExternal(this.basePath)) {
          return this.basePath;
        }

        return path.resolve(this.basePath, routePath);
      },
    },
  };
</script>

<style>
  .sidebar-item-container .el-submenu__icon-arrow {
    right: 6px;
  }
  .sidebar-item-container .el-icon-arrow-down:before {
    color: #b1b5bd;
    font-size: 14px;
    content: '\e790' !important;
  }
  .sidebar-item-container .el-icon-arrow-right {
    display: none;
  }
</style>
