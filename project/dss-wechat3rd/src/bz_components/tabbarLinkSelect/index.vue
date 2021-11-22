<template>
  <div v-if="status">
    <el-cascader
      :options="options"
      :size="size"
      v-model="model"
      @change="change"
      expand-trigger="hover"
      style="width:155px"
      :show-all-levels="showAllLevels"
    ></el-cascader>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import mixins from './index.js';
import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
export default {
  name: 'tabbarLinkSelect',
  mixins: [industryHelperMixin],
  props: {
    size: {
      type: String,
      default: 'medium'
    },
    selectedOptions: {
      type: Array,
      default: function() {
        return [];
      }
    },
    usedPages: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },

  computed: {
    ...mapState({
      customPages: 'customPages',
      env: 'env'
    }),

    model: {
      get() {
        return this.selectedOptions;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },

  watch: {
    usedPages(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.assemblyData();
      }
    }
  },

  data() {
    return {
      showAllLevels: false,
      status: false,
      options: []
    };
  },

  mounted() {
    this.assemblyData();
  },

  methods: {
    // 组装数据
    assemblyData() {
      const librayList = this.mGetTabbarLinkList();
      const diableCustomPage = this.usedPages.custom;
      const diableDefaultPage = this.usedPages.default;
      mixins.getCustomPage(this.customPages, diableCustomPage || [], () => {
        mixins.getDefaultPage(librayList, diableDefaultPage, () => {
          this.status2 = true;
          this.options = [
            {
              value: 'custom',
              label: '自定义页',
              children: mixins.customPages
            },
            {
              value: 'default',
              label: '系统默认页',
              children: mixins.defaultPages
            }
          ];

          this.status = true;
        });
      });
    },

    change(val) {
      this.$emit('change', val);
    }
  }
};
</script>
