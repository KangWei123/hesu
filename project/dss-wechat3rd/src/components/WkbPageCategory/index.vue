<template>
  <div class="wkb-page-category">
    <div class="home-nav" v-if="!visibleNav">
      <div v-for="(item,index) in dataSource"
           @click.self="tabSwitch(item.path)"
           :key="index"
           :class="{
           active: currentPath===item.path ||
           (!!item.regex && item.regex.test(currentPath))
           }">
        {{item.name}}
      </div>
    </div>
    <div class="aside-decorate">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import './index.less';

  export default {
    props: {
      dataSource: {
        type: Array,
        default: null
      },
      // 如果不传 默认dataSource中第一个的path
      defaultPath: {
        type: String,
        default: null
      },
      parentsPath: {
        type: String,
        default: null
      },
      // 对于不在datasource的路由push时是否隐藏左边的导航
      hidenNav: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      currentPath() {
        return this.$route.path.replace(this.parentsPath, '') || this.default;
      },

      default() {
        return this.defaultPath || this.dataSource[0].path;
      },

      visibleNav() {
        let exist = false;
        (this.dataSource || []).forEach(item => {
          if (item.path === this.currentPath) {
            exist = true;
          }
        });
        if (!exist && this.hidenNav) {
          return true;
        } else {
          return false;
        }
      }
    },
    methods: {
      tabSwitch(path) {
        this.$router.push(this.parentsPath + path);
      }
    }
  };
</script>
