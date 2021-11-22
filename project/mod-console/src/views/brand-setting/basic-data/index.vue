<template>
  <wkb-page-nav hide-nav custom-content class="basic-data-container" page-name="基础资料">
    <div class="basic-data">
      <app-view v-if="!isEdit" @modify="onModify()"></app-view>
      <app-edit v-else @saved="onSaved()" @cancel="onCancel()"></app-edit>
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
        isEdit: false,
      };
    },
    methods: {
      // 修改
      onModify() {
        this.isEdit = true;
      },
      // 保存
      onSaved() {
        this.isEdit = false;
      },
      // 取消
      onCancel() {
        this.isEdit = false;
      },
    },
  };
</script>
