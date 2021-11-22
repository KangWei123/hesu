<template>
  <el-cascader v-bind="$props" v-on="$listeners" :props="cascaderProps"></el-cascader>
</template>

<script>
  import { Cascader } from 'element-ui';
  import omit from 'lodash/omit';
  import { mixin } from '../group-app-store-cascader';

  /**
   * 集团 > 应用 级联选择器
   * value 是一个数组，[epId, appId]
   */
  export default {
    name: 'GroupAppCascader',
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
    data() {
      return {
        tree: [],
      };
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
                  ? (await this.fetchApps(node.value)).map(i => ({ ...i, leaf: true }))
                  : await this.fetchGroup();
              resolve(list);
            } catch (err) {
              console.log('获取应用列表失败', err);
            }
          },
        };
      },
    },
  };
</script>

<style></style>
