<template>
  <div>
    <div v-if="!$route.path.includes('detail')">
      <!-- <page-header-tab
        v-if="!$route.path.includes('establish')"
        :menu-list="menuList"
        :defaultActiveKey="ActiveKey"
        @click="onClickThirdNav"
      /> -->
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import PageHeaderTab from './components/page-header-tab/index';
import './style.less';
export default {
  components: { PageHeaderTab },
  watch: {
    $route(to, from) {
      let index = to.path.lastIndexOf('/');
      this.ActiveKey = to.path.substring(index + 1, to.path.length);
    }
  },
  data() {
    return {
      ActiveKey: 'list',
      menuList: [
        // {
        //   label: '代言任务',
        //   key: 'list'
        // },
        // {
        //   label: '任务记录',
        //   key: 'operation'
        // },
        // {
        //   label: '已删除任务',
        //   key: 'delete'
        // }
      ]
    };
  },
  methods: {
    getActiveKey() {
      let path = this.$route.path;
      let index = path.lastIndexOf('/');
      this.ActiveKey = path.substring(index + 1, path.length);
    },
    onClickThirdNav(menu) {
      this.$router.push({ path: `/marketing/task-center/${menu.key}` });
    }
  },
  mounted() {
    this.getActiveKey();
  }
};
</script>
<style scoped lang="less">
</style>
