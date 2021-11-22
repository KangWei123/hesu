<template>
  <form-page-layout
    class="wx-setting-pay"
    :title-visible="false"
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    @submit="clickSave"
  >
    <form-group>
      <template #title>基础设置</template>
      <business-area-form ref="businessForm" @load="load" @finished="finished" />
    </form-group>
    <template #footer>
      <form-button>保存</form-button>
    </template>
  </form-page-layout>
</template>

<script>
  import { mapState } from 'vuex';
  import { FormPageLayout, FormButton, FormGroup } from '@/dss-common/components/form-page';
  import BusinessAreaForm from './business-area.vue';

  export default {
    data() {
      return {
        loading: true,
      };
    },
    components: {
      FormPageLayout,
      FormButton,
      BusinessAreaForm,
      FormGroup,
    },
    computed: {
      ...mapState({
        wkbScopeMenu: 'wkbScopeMenu',
        env: 'env',
      }),
    },

    methods: {
      clickSave() {
        if (!this.loading) {
          this.$refs.businessForm.clickSave();
        }
      },
      load() {
        this.loading = true;
      },
      finished() {
        this.loading = false;
      },
    },
  };
</script>
