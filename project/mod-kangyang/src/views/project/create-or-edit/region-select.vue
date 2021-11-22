<template>
  <el-cascader
    ref="cascader"
    :props="cascaderProps"
    v-bind="{ ...defaultProps, ...$props }"
    v-on="$listeners"
  ></el-cascader>
</template>

<script>
  import Vue from 'vue';
  import { Cascader } from 'element-ui';
  import { regionApi } from '@/business-common/api';

  const { queryRegion } = regionApi;

  const MAX_LEVEL = 2;
  /**
   * 全局缓存
   */
  const CACHE = {};

  /**
   * 省市区三级级联选择器
   */
  export default Vue.extend({
    name: 'RegionSelect',
    props: {
      ...Cascader.props,
      value: {
        /**
         * province
         * city
         * district
         */
        type: Array,
        default: () => [],
      },

      /**
       * 是否支持选中任意一级
       */
      checkStrictly: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      defaultProps() {
        return {
          expandTrigger: 'hover',
          separator: '-',
          placeholder: '选择区域',
        };
      },
      cascaderProps() {
        return {
          checkStrictly: this.checkStrictly,
          lazy: true,
          lazyLoad: async (node, resolve) => {
            try {
              const nodeLevel = node == null ? 0 : node.level;
              if (node.data && node.data.leaf) {
                return resolve(null);
              }

              const list = await this.fetchList(nodeLevel, node);
              resolve(list);
            } catch (err) {
              console.log('获取区域列表失败', err);
            }
          },
        };
      },
    },

    methods: {
      /**
       * 获取列表
       */
      async fetchList(level, node) {
        const id = level !== 0 ? node.data.id : 0;
        const list = await this.fetchAreas(level, id);
        return list.map(i => ({ label: i.name, value: i.code, id: i.id, leaf: level === MAX_LEVEL }));
      },

      // 获取区域数据
      async fetchAreas(level, id) {
        if (id in CACHE) {
          return CACHE[id];
        }

        const { data } = await queryRegion(id);
        CACHE[id] = data;
        return data;
      },

      getCheckedNodes() {
        const [selectedNode] = this.$refs.cascader.getCheckedNodes();
        const { value, label, path, pathLabels = [] } = selectedNode || {};
        return {
          value,
          label,
          path,
          pathLabels: pathLabels.join('/'),
        };
      },
    },
  });
</script>

<style lang="less" scoped>
  .has-value /deep/ .el-input__inner::placeholder {
    color: #303133;
  }
</style>
