<template>
  <el-cascader
    v-bind="passthroughtProps"
    :options="tree"
    popper-class="dpt-select"
    :show-all-levels="false"
    :value="normalizedValue"
    :props="{
      checkStrictly: true,
      value: 'id',
      label: 'name',
      children: 'child',
      disabled: disableNotProject ? 'isNotStore' : 'disabled',
    }"
    @input="handleInput"
    @change="handleChange"
  />
</template>

<script>
  import omit from 'lodash/omit';
  import emitter from 'element-ui/lib/mixins/emitter';
  import { orgApi } from '../../api';
  import { Cascader } from 'element-ui';

  /**
   * 部门选择器
   */
  export default {
    name: 'DepartmentSelect',
    mixins: [emitter],
    props: {
      ...omit(Cascader.props, ['value']),
      value: Number,
      getAll: Boolean,
      // 禁用非绑定项目部门
      disableNotProject: Boolean,
    },
    computed: {
      passthroughtProps() {
        return omit(this.$props, ['value', 'getAll', 'disableNotProject']);
      },
      normalizedValue() {
        if (!this.tree.length || this.value == null) {
          return [];
        }

        if (this.cache && this.cache.has(this.value)) {
          return this.cache.get(this.value);
        }

        return [];
      },
    },
    mounted() {
      this.cache = new Map();
      this.getTree();
    },
    data() {
      return {
        tree: [],
      };
    },
    methods: {
      async getTree() {
        const { data } = await (this.getAll ? orgApi.getOrgTree() : orgApi.getRoleOrgTree());
        // 缓存

        const walk = (tree, path) => {
          for (const item of tree) {
            const newPath = path.concat([item.id]);
            this.cache.set(item.id, newPath);
            item.isNotStore = !item.isStore;
            if (item.child) {
              walk(item.child, newPath);
            }
          }
        };

        walk(data, []);
        this.tree = data;
      },
      handleInput(evt) {
        const value = evt.length ? evt[evt.length - 1] : undefined;
        this.$emit('input', value);
        this.dispatch('ElFormItem', 'el.form.change', [value]);
      },
      handleChange(evt) {
        const value = evt.length ? evt[evt.length - 1] : undefined;
        this.$emit('change', value);
        this.dispatch('ElFormItem', 'el.form.change', [value]);
      },
    },
  };
</script>

<style>
  .dpt-select {
    border: 1px solid #efefef;
  }

  .dpt-select .el-scrollbar::-webkit-scrollbar {
    display: none !important;
  }

  .dpt-select .el-cascader-node {
    outline: none;
    line-height: 1.8;
    padding: 0 11px;
    display: flex;
    align-items: center;
  }

  .dpt-select .el-cascader-node .el-radio {
    margin-right: 0;
  }

  .dpt-select .el-cascader-node__label {
    flex: 1;
  }
</style>
