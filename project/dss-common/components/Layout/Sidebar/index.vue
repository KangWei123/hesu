<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        class="el-menu-vertical"
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="#fff"
        text-color="#717378"
        :unique-opened="true"
        active-text-color="#FA7516"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in menu" :key="route.url" :item="route" :base-path="route.url" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import SidebarItem from './SidebarItem';

  export default {
    props: {
      menu: {
        type: Array,
        default: function () {
          return [];
        },
      },
      subActive: {
        type: String,
        default: '',
      },
    },
    components: { SidebarItem },
    watch: {
      routeLeafs(val) {
        // 异步更新
        if (val) {
          this.activeMenu = this.getPath();
        }
      },
      $route(route) {
        // 监听路由变化更新activeMenu
        this.activeMenu = this.getPath();
        console.log('$route activeMenu', this.activeMenu);
      },
    },
    computed: {
      ...mapState({ sidebar: 'sidebar', routeLeafs: 'routeLeafs' }),
      isCollapse() {
        return !this.sidebar.opened;
      },
    },
    data() {
      return {
        activeMenu: '',
      };
    },
    mounted() {
      const matched = this.$router.currentRoute.matched;

      if (this.routeLeafs && matched.length) {
        this.activeMenu = this.getPath();
      }
    },
    methods: {
      getPath() {
        // 针对微商城营销高亮菜单处理
        if (this.subActive) {
          return this.subActive;
        }

        const router = this.$router.currentRoute;

        const list = router.matched;

        for (let i = list.length - 1; i >= 0; i--) {
          if (this.routeLeafs && this.routeLeafs.has(list[i].path)) {
            // 分销市场菜单高亮
            if (list[i].path === '/distribution') {
              return list[i + 1].path;
            }
            return list[i].path;
          }
        }
        return list[0].path;
      },
    },
  };
</script>
