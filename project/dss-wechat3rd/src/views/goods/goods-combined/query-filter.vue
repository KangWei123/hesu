<template>
  <!--过滤器-->
  <el-form inline class="goods-list-filter" :model="filter" label-position="right" label-width="83px" ref="filter">
    <!-- 关键字搜索 -->
    <el-form-item label="关键字：" prop="itemName">
      <el-input placeholder="关键字搜索" prefix-icon="el-icon-search" v-model.trim="filter.itemName" />
    </el-form-item>

    <!-- 商品分类 -->
    <el-form-item
      :label="goodsType.label + '分类：'"
      v-if="
        goodsType.type !== goodsTypeTab.card.type &&
        goodsType.type !== goodsTypeTab.rooms.type &&
        goodsType.type !== goodsTypeTab.ticket.type
      "
      prop="categoryId"
    >
      <goods-category-cascader
        :active-goods-type="goodsType"
        :with-all="true"
        v-model="filter.categoryId"
        :reset-selecte="resetSelecte"
        @changeRestStatus="changeRestStatus"
      />
    </el-form-item>

    <!-- 商品类型 -->
    <el-form-item :label="goodsType.label + '类型：'" prop="mode">
      <el-select v-model="filter.mode" placeholder="全部分类">
        <el-option label="全部分类" :value="null"></el-option>
        <el-option label="线上普通商品" :value="0"></el-option>
        <el-option label="积分商品" :value="1"></el-option>
      </el-select>
    </el-form-item>

    <!-- 卡项分类 -->
    <el-form-item v-if="goodsType.type === goodsTypeTab.card.type" :label="goodsType.label + '分类：'" prop="type">
      <el-select v-model="filter.type" placeholder="全部分类">
        <el-option label="全部分类" :value="null"></el-option>
        <el-option label="次数卡" :value="cardTypeEnum.cardType.timesCard"></el-option>
        <el-option label="充值卡" :value="cardTypeEnum.cardType.chargeCard"></el-option>
      </el-select>
    </el-form-item>

    <!-- 商品营销属性 -->
    <el-form-item v-if="showMarketingFilter" label="营销属性：" prop="tag1">
      <el-select v-model="filter.tag1" size="mini" clearable placeholder="商品营销属性">
        <el-option label="全部营销属性" :value="null"></el-option>
        <el-option label="拼团" :value="1 << 8"></el-option>
        <el-option label="砍价" :value="1 << 7"></el-option>
        <el-option label="秒杀" :value="1 << 11"></el-option>
        <el-option label="积分商品" :value="1 << 12"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button @click="reset" plain>重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import GoodsCategoryCascader from '@/dss-wechat3rd/src/bz_components/goods-category-cascader/index.vue';
  import goodsTypeEnum from '../../../constants/goodsTypeEnum';
  import cardTypeEnum from '../../../constants/cardEnum';

  export default {
    name: 'GoodsCombinedFilter',

    components: {
      GoodsCategoryCascader,
    },

    props: {
      // 查询分类的商品类型
      goodsType: {
        type: Object,
        default: function () {
          return null;
        },
      },
      showMarketingFilter: {
        type: Boolean,
        default: true,
      },
    },

    data() {
      return {
        goodsTypeTab: goodsTypeEnum,
        cardTypeEnum,
        /** 查询条件 */
        filter: {
          itemName: null,
          categoryId: null,
          isShelf: null,
          mode: null,
          type: this.goodsType.type === goodsTypeEnum.card.type ? null : this.goodsType.value,
          tag1: null,
        },
        // 重置商品分类级联选择
        resetSelecte: false,
      };
    },

    watch: {
      filter: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          this.$emit('filter', this.$plain(this.filter));
        },
      },
    },
    methods: {
      reset() {
        this.resetSelecte = true;
        this.$refs.filter.resetFields();
      },
      changeRestStatus() {
        this.resetSelecte = false;
      },
    },
  };
</script>

<style lang="less" scoped>
  .goods-list-filter {
    // .el-form-item:first-child {
    //   display: block;
    // }
  }
</style>
