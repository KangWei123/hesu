<template>
  <wkb-page-nav hide-nav
                class="invoice-setting-container"
                :showPageName="!!pageName"
                :page-name="pageName">
    <div class="invoice-setting">
      <router-view></router-view>
    </div>
  </wkb-page-nav>
</template>
<script>
import WkbPageNav from '@/business-common/components/wkb-page-nav/index.vue';
import './index.less';
import AppView from './view.vue';
import AppEdit from './edit.vue';

export default {
  components: { AppView, AppEdit, WkbPageNav },
  data() {
    return {
      isEdit: false
    };
  },
  computed: {
    pageName() {
      let pageName = null;
      switch (this.$route.path) {
        case '/invoice-setting/view':
          pageName = '发票设置';
          break;
        case '/invoice-setting/edit-company':
          pageName = '';
          break;
      }
      return pageName;
    }
  },
  methods: {
    // 修改
    edit() {
      this.isEdit = true;
    },
    // 保存
    onSaved() {
      this.isEdit = false;
    },
    // 取消
    onCancel() {
      this.isEdit = false;
    }
  }
};
</script>

