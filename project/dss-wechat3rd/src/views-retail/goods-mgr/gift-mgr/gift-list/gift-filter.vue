<template>
  <!--过滤器-->
  <el-form inline
           class="goods-list-filter"
           :model="filter"
           ref="filter">

    <!-- 商品营销属性 -->
    <!-- <el-form-item>
      <el-select v-model="filter.tag1"
                 size="mini"
                 clearable
                 placeholder="商品营销属性">
        <el-option label="全部营销属性"
                   :value="null"></el-option>
      </el-select>
    </el-form-item> -->

    <!-- 关键字搜索 -->
    <el-form-item label="关键字：" prop="name">
      <el-input placeholder="关键字搜索"
                prefix-icon="el-icon-search"
                size="mini"
                v-model.trim="filter.name" />
    </el-form-item>

    <el-button plain @click="handleReset">重置</el-button>

  </el-form>
</template>

<script>
import GoodsCategoryCascader from '@/dss-wechat3rd/src/bz_components/goods-category-cascader/index.vue';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';

export default {
  name: 'goodsCombinedFilter',

  components: {
    GoodsCategoryCascader
  },

  props: {
    // 查询分类的商品类型
    goodsType: {
      type: Object,
      default: function() {
        return null;
      }
    }
  },

  data() {
    return {
      goodsTypeTab: goodsTypeEnum,
      /** 查询条件 */
      filter: {
        itemName: null,
        categoryId: null,
        isShelf: null,
        type: this.goodsType.type === goodsTypeEnum.card.type ? null : this.goodsType.value,
        tag1: null,
        name: ''
      }
    };
  },

  watch: {
    filter: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.$emit('filter', this.$plain(this.filter));
      }
    }
  },
  methods: {
    // 重置
    handleReset() {
      this.$refs.filter.resetFields();
      this.filter.name = '';
    }
  }
};
</script>

<style lang="less" scoped>
.goods-list-filter {
  padding: 20px 30px 0px 20px;
}
</style>
