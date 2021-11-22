<template>
  <el-select ref="select" v-bind="$props" v-on="$listeners">
    <el-option v-for="item in industryOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
  </el-select>
</template>

<script>
  import { Select } from 'element-ui';
  import { sharedAppApi } from '@/business-common/api/index';

  /**
   * 业态选择器
   * value:v-model同步业态的key
   * clearable:是否可以清除
   * 业态枚举在industryEnum
   */
  export default {
    name: 'IndustrySelect',
    props: {
      ...Select.props,
      placeholder: { type: String, default: '请选择业态' },
      showUmp: { type: Boolean, default: true },
    },
    data() {
      return {
        industryOptions: [],
      };
    },
    watch: {
      showUmp() {
        this.fetchIndustries();
      },
    },
    mounted() {
      this.fetchIndustries();
    },
    methods: {
      fetchIndustries() {
        sharedAppApi.listIndustries(0).then(res => {
          this.industryOptions = res.data || [];
          // 是否显示集团
          if (!this.showUmp) {
            const index = this.industryOptions.findIndex(item => {
              return item.key === 'ump';
            });
            this.industryOptions.splice(index, 1);
          }
        });
      },
    },
  };
</script>

<style scoped></style>
