<template>
  <el-cascader ref="cascader" v-bind="$props" v-on="$listeners" :props="cascaderProps"></el-cascader>
</template>

<script>
  import { mapState } from 'vuex';
  import { Cascader } from 'element-ui';
  import omit from 'lodash/omit';
  import { sharedAppApi, sharedStoreApi } from '@/business-common/api';

  export const mixin = {
    computed: {
      ...mapState({
        app: 'curApp',
      }),
    },
    methods: {
      /**
       * 获取选中的标题
       */
      getCheckedLabels() {
        if (this.$refs.cascader == null) {
          return [];
        }
        const list = [];
        let node = this.$refs.cascader.getCheckedNodes();

        node = node[0];

        while (node) {
          list.unshift(node.label);

          node = node.parent;
        }

        return list;
      },
      async fetchGroup() {
        if (this.app) {
          return [
            {
              value: this.app.epId,
              label: this.app.epName || '集团',
            },
          ];
        }

        return [
          {
            value: '',
            label: '集团',
          },
        ];
      },
      /**
       * 获取应用列表
       */
      async fetchApps(epId) {
        const { data } = await sharedAppApi.listAllApp();
        return data.map(i => ({
          label: i.appName,
          value: i.id,
        }));
      },
      /**
       * 获取项目列表
       */
      async fetchStores(appId) {
        const { data } = await sharedStoreApi.listAllStoreByAppId({ appId, pageNo: 1, pageSize: 1000 });
        return (data || []).map(i => ({
          label: i.name,
          value: i.id,
        }));
      },
    },
  };

  /**
   * 集团 > 业态应用 > 项目 级联选择器
   * value 是一个数组，[epId, appId, storeId]
   */
  export default {
    name: 'GroupAppStoreCascader',
    mixins: [mixin],
    props: {
      ...omit(Cascader.props, ['props', 'options']),
      /**
       * 是否支持选中任意一级
       */
      checkStrictly: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      cascaderProps() {
        return {
          checkStrictly: this.checkStrictly,
          lazy: true,
          lazyLoad: async (node, resolve) => {
            try {
              const list =
                node == null || node.level === 0
                  ? await this.fetchGroup()
                  : node.level === 2
                  ? (await this.fetchStores(node.value)).map(i => ({ ...i, leaf: true }))
                  : await this.fetchApps(node.value);
              resolve(list);
            } catch (err) {
              console.log('获取项目列表失败', err);
            }
          },
        };
      },
    },
  };
</script>

<style></style>
