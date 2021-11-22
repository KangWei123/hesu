<template>
  <el-cascader
    expand-trigger="click"
    clearable
    class="cascader-input"
    v-if="activeGoodsType"
    :placeholder="withAll ? '全部分类' : '请选择'"
    :options="categoryOptions"
    :size="size"
    change-on-select
    v-model="selectedOptions"
    @change="handleCategoryChange"
  >
  </el-cascader>
</template>

<script>
  // import constants from '@/dss-wechat3rd/src/constants/index';
  import constants from '@/mod-member/src/components/goods-select-dialog/index';
  import services from '@/dss-common/utils/services';
  import { type } from 'os';

  /* 商品分类级联选择 */
  export default {
    name: 'GoodsCategoryCascader',

    model: {
      prop: 'categoryId',
    },

    props: {
      size: {
        type: String,
        default: '',
      },
      activeGoodsType: {
        type: Object,
        default: function () {
          return null;
        },
      },
      selectedCategory: {
        type: Object,
        default: function () {
          return null;
        },
      },
      withAll: {
        type: Boolean,
        default: false,
      },
      resetSelecte: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        categoryId: null,
        categoryOptions: [],
        selectedOptions: [],
      };
    },

    watch: {
      // 监听解析被选中的商品分类
      selectedCategory(newVal, oldVal) {
        if (newVal) {
          this.parseSelectedCategory(this.selectedCategory);
        }
      },

      // 重置
      resetSelecte(newVal, oldVal) {
        if (newVal) {
          this.selectedOptions = [];
          this.$emit('changeRestStatus');
        }
      },
    },

    methods: {
      /**
       * 查询分类列表
       */
      listCategories(callback) {
        const params = {
          type: this.activeGoodsType.value,
        };
        services
          .get(constants.Api.category.list, {
            action: '类目',
            params,
          })
          .done(res => {
            this.categoryOptions = this.parseCategoriesResponse(res.data || []);
            this.parseSelectedCategory(this.selectedCategory);
            if (this.withAll) {
              this.categoryOptions.unshift({
                label: '全部分类',
                value: null,
              });
            }
            // 回调函数执行被选中的分类
            callback && typeof callback === 'function' && callback(res.data || []);
          });
      },

      parseCategoriesResponse(categories) {
        /**
         * 递归解析分类中的各个子分类
         * @param categoryItem
         * @returns {*}
         */
        function parseChildCategory(categoryItem) {
          if (categoryItem.childrenCategory && categoryItem.childrenCategory.length) {
            return categoryItem.childrenCategory.map(childItem => {
              return {
                label: childItem.category,
                value: childItem.id,
                children: parseChildCategory(childItem),
              };
            });
          } else {
            return null;
          }
        }

        return categories.map(item => {
          return {
            label: item.category,
            value: item.id,
            children: parseChildCategory(item),
          };
        });
      },

      /**
       * 解析被选中的商品分类，子->父逆向排列
       * @param categoryItem
       */
      parseSelectedCategory(categoryItem) {
        if (categoryItem) {
          this.selectedOptions.unshift(categoryItem.id);
          if (categoryItem.parentCategory) {
            this.parseSelectedCategory(categoryItem.parentCategory);
          }
        }
      },

      handleCategoryChange(value) {
        const lastChildCategoryId = value[value.length - 1];
        console.log(lastChildCategoryId);
        this.$emit('input', lastChildCategoryId);
        this.$emit('change', this.selectedOptions);
      },
    },

    mounted() {
      this.listCategories();
    },
  };
</script>

<style lang="less" scoped>
  .cascader-input {
    width: 200px;
  }
</style>
