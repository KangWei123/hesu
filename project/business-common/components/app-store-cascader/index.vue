<template>
  <el-cascader v-bind="$props" v-on="$listeners" :props="cascaderProps"></el-cascader>
</template>

<script>
  import { Cascader } from 'element-ui';
  import omit from 'lodash/omit';
  import { mixin } from '../group-app-store-cascader';

  /**
   * 业态应用 > 项目 级联选择器
   * value 是一个数组，[appId, storeId]
   */
  export default {
    name: 'AppStoreCascader',
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
                node.level === 1
                  ? (await this.fetchStores(node.value)).map(i => ({ ...i, leaf: true }))
                  : await this.fetchApps();
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
