<template>
  <div>
    <app-select
      style="margin-right: 16px"
      placeholder="请选择应用"
      v-model="form.appId"
      clearable
      class="w220"
      @change="onchange"
    />
    <project-select
      style="margin-right: 16px"
      placeholder="请选择项目"
      v-model="form.storeId"
      clearable
      class="w220"
      @change="onchange"
    />
    <merchant-select
      placeholder="请选择商户"
      v-model="form.subStoreId"
      clearable
      class="w220"
      @change="onchange"
      @onselect="onselect"
    />
  </div>
</template>

<script>
  import AppSelect from '@/business-common/components/app-select';
  import MerchantSelect from '@/business-common/components/merchant-select';
  import ProjectSelect from '@/business-common/components/project-select';

  export default {
    components: {
      AppSelect,
      MerchantSelect,
      ProjectSelect,
    },
    data() {
      return {
        form: {
          appId: '',
          storeId: '',
          subStoreId: '',
          subStoreName: '',
        },
      };
    },
    methods: {
      onselect(val) {
        this.form.subStoreName = val;
      },
      onchange() {
        this.$emit('onselect', this.form);
      },
    },
  };
</script>
