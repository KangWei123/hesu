<template>
  <div class="setting-app">
    <app-view v-if="!isEdit"
              @modify="clickModify()"></app-view>
    <app-edit v-else
              @saved="onSaved()"></app-edit>
  </div>
</template>

<script>
import './index.less';
import AppView from './view.vue';
import AppEdit from './edit.vue';
export default {
  components: { AppView, AppEdit },
  data() {
    return {
      isEdit: false
    };
  },
  methods: {
    clickModify() {
      this.isEdit = true;
    },
    onSaved() {
      this.isEdit = false;
    },
    onLogoUploadSuccess(url) {
      this.form.logo = url;
    }
  }
};
</script>
