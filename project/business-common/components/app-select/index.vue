<template>
  <el-select v-bind="$props" v-on="$listeners">
    <el-option v-for="item of list" :key="item.id" :label="item.appName" :value="item.id"></el-option>
  </el-select>
</template>

<script>
  import { sharedAppApi } from '@/business-common/api';
  import { Select } from 'element-ui';

  /**
   * 简单的应用下拉选择器
   */
  export default {
    name: 'AppSelect',
    props: {
      ...Select.props,
      /**
       * 是否支持选择集团，
       * 注意：在业态下面是强制不能选择集团的
       */
      groupSelectable: {
        type: Boolean,
        default: false,
      },
      groupId: {
        type: Number,
        default: 0,
      },
      autoSelectFirst: {
        type: Boolean,
        default: false,
      },
      needAllApp: {
        type: Boolean,
        default: false,
      },
      /**
       * 业态下获取所有应用列表标识
       */
      allApp: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        list: [],
      };
    },
    mounted() {
      this.fetchApps();
    },
    methods: {
      getSelected() {
        const list = this.value == null ? [] : Array.isArray(this.value) ? this.value : [this.value];
        return list.map(i => {
          return this.list.find(j => j.id === i);
        });
      },
      async fetchApps() {
        const params = {};
        const methods = this.allApp ? 'allApp' : 'listAllApp';
        const { data } = await sharedAppApi[methods](params);

        // 只有在集团下才允许
        // if (this.groupSelectable && this.globalIsUmpPlatformApp) {
        //   this.list = [{ id: this.groupId, appName: '集团' }].concat(data);
        // } else {
        this.list = data;
        // }
        if (this.needAllApp) {
          this.$emit('allAppData', this.list);
        }
        if (this.autoSelectFirst || this.list.length === 1) {
          this.$emit('input', this.list[0].id);
          this.$emit('change', this.list[0].id);
        }
      },
    },
  };
</script>

<style></style>
