<template>
  <!--过滤器-->
  <el-form inline class="goods-list-filter" :model="filter" ref="filter" label-position="right" label-width="83px">
    <!-- 可切换的商品类型tab -->
    <!-- <div class="row-item"> -->
    <span v-if="showLabel" class="block-title">
      <el-form-item v-if="showLabel && showGoodsTypeTab" class="title-box tab-type">
        <span
          class="list-title"
          v-for="(item, index) in goodsTypeTabList"
          :key="index"
          :class="activityTab === index ? 'activity-tab' : ''"
          @click="handleChangeTab(item, index)"
          >选择{{ item.label }}</span
        >
      </el-form-item>

      <!-- 不可切换的商品类型标题 -->
      <el-form-item v-else-if="showLabel" class="title-box">
        <span class="list-title">选择{{ goodsType.label }}</span>
      </el-form-item>
    </span>

    <!-- 关键字搜索 -->
    <el-form-item label="关键字：" prop="itemName">
      <el-input
        placeholder="关键字搜索"
        prefix-icon="el-icon-search"
        size="mini"
        v-model.trim="filter.itemName"
        @input="checkFilterParam('itemName', 80)"
      />
    </el-form-item>

    <!-- barcode条形码搜索 -->
    <el-form-item v-if="showBarcode" label="条形码：" prop="barcode">
      <el-input
        placeholder="条形码搜索"
        prefix-icon="el-icon-search"
        size="mini"
        v-model.trim="filter.barcode"
        @input="checkFilterParam('barcode', 20)"
      />
    </el-form-item>

    <el-form-item
      :label="goodsType.label + '分类：'"
      v-if="
        goodsType.type !== goodsTypeTab.promotion.type &&
        goodsType.type !== goodsTypeTab.card.type &&
        goodsType.type !== goodsTypeTab.estate.type &&
        goodsType.type !== goodsTypeTab.rooms.type &&
        goodsType.type !== goodsTypeTab.ticket.type &&
        goodsType.type !== goodsTypeTab.gift.type
      "
      prop="categoryId"
    >
      <goods-category-cascader
        :active-goods-type="goodsType"
        :with-all="true"
        size="mini"
        v-model="filter.categoryId"
        :reset-selecte="resetSelecte"
        @changeRestStatus="changeRestStatus"
      />
    </el-form-item>

    <!-- <el-form-item
      :label="storeLabel + '：'"
      v-if="showStore && goodsType.type === goodsTypeTab.estate.type"
      prop="store"
    >
    </el-form-item> -->

    <el-form-item v-if="goodsType.type === goodsTypeTab.card.type" :label="goodsType.label + '分类'" prop="type">
      <el-select v-model="filter.type" size="mini" placeholder="全部分类">
        <el-option label="全部分类" :value="null"></el-option>
        <el-option label="次数卡" :value="cardTypeEnum.cardType.timesCard"></el-option>
        <el-option label="充值卡" :value="cardTypeEnum.cardType.chargeCard"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item
      :label="storeLabel + '：'"
      v-if="showStore && goodsType.type === goodsTypeTab.estate.type"
      prop="store"
    >
      <load-more-select
        :url="storeApiUrl"
        v-model="filter.store"
        value-key="id"
        clearable
        class="goods-w366 primary-inputHeight"
        label-key="name"
        filterable
      >
      </load-more-select>
    </el-form-item>

    <!-- 上下架状态 -->
    <el-form-item v-if="showStatus" prop="isShelf" label="上下架：">
      <el-select v-model="filter.isShelf" size="mini" placeholder="上下架状态">
        <el-option label="全部状态" :value="null"></el-option>
        <el-option label="上架" :value="1"></el-option>
        <el-option label="下架" :value="0"></el-option>
      </el-select>
    </el-form-item>

    <!-- 商品营销属性 -->
    <el-form-item v-if="showActivity && goodsType.type !== goodsTypeTab.promotion.type" label="营销属性：" prop="tag1">
      <el-select v-model="filter.tag1" size="mini" clearable placeholder="商品营销属性">
        <el-option label="全部营销属性" :value="null"></el-option>
        <el-option label="预售" :value="1 << 6"></el-option>
        <el-option label="拼团" :value="1 << 8"></el-option>
        <el-option label="砍价" :value="1 << 7"></el-option>
        <el-option label="秒杀" :value="1 << 11"></el-option>
        <el-option label="积分商品" :value="1 << 12"></el-option>
        <el-option label="第x件y折" :value="1 << 20"></el-option>
        <el-option label="满x件优惠" :value="1 << 21"></el-option>
        <el-option label="一口价" :value="1 << 22"></el-option>
      </el-select>
    </el-form-item>
    <!-- </div> -->

    <el-button v-if="!showLabel" plain @click="handleReset" style="margin-top: 2px">重置</el-button>
  </el-form>
</template>

<script>
  import './GoodsListFilter.less';
  import GoodsCategoryCascader from '@/mod-member/src/components/goods-select-dialog/goods-category-cascader/index';
  import LoadMoreSelect from '@/mod-member/src/components/goods-select-dialog/load-more-select/index.vue';
  // import goodsTypeEnum from '../../constants/goodsTypeEnum';
  import goodsTypeEnum from '@/mod-member/src/enum/goodsTypeEnum';
  // import cardTypeEnum from '../../constants/cardEnum';
  import constants from '@/mod-member/src/components/goods-select-dialog/index';
  // import constants from '@/dss-wechat3rd/src/constants/index.js';
  export default {
    name: 'GoodsListFilter',

    components: {
      GoodsCategoryCascader,
      LoadMoreSelect,
    },

    props: {
      // 商品类型
      goodsType: {
        type: Object,
        default: function () {
          return null;
        },
      },
      // 可选择的商品类型tab数据集合
      goodsTypeTabList: {
        type: Array,
        default: function () {
          return [];
        },
      },
      // 是否显示过滤器label
      showLabel: {
        type: Boolean,
        default: true,
      },
      // 是否显示上下架过滤条件
      showStatus: {
        type: Boolean,
        default: false,
      },
      // 是否显示营销属性过滤条件
      showActivity: {
        type: Boolean,
        default: false,
      },
      // 是否显示barcode条形码过滤条件
      showBarcode: {
        type: Boolean,
        default: false,
      },
      // 是否显示门店过滤条件
      showStore: {
        type: Boolean,
        default: false,
      },
      storeLabel: {
        type: String,
        default: '区域',
      },
    },

    data() {
      return {
        storeApiUrl: constants.Api.store.storeList,
        goodsTypeTab: goodsTypeEnum,
        // cardTypeEnum,
        /** 查询条件 */
        filter: {
          categoryId: null,
          type: this.goodsType.type === goodsTypeEnum.card.type ? null : this.goodsType.value,
          // isShelf: null,
          tag1: null,
          itemName: null,
          barcode: null,
          store: null,
        },
        activityTab: 0, // 默认选中第一个商品类型tab
        // 商品分类级联选择  重置
        resetSelecte: false,
      };
    },

    computed: {
      // 是否显示商品类型tab切换
      showGoodsTypeTab() {
        if (this.goodsTypeTabList && this.goodsTypeTabList.length > 0) {
          return true;
        }
        return false;
      },
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
      // 校验输入字段搜索进行实时模糊查询(不包括字段校验)
      checkFilterParam(param, maxlength, isQuery = false) {
        // 参数存在，且最大长度为maxlength，所以截取maxlength个字符
        if (this.filter[param] && this.filter[param].length > maxlength) {
          this.filter[param] = this.filter[param].substr(0, maxlength);
        }
      },

      /**
       * 切换选择的商品类型tab
       */
      handleChangeTab(row, index) {
        this.activityTab = index;
        // 将选择的商品类型赋值给查询条件过滤器，以便实时获取数据列表
        this.filter.type = row.value;
      },

      // 重置
      handleReset() {
        this.resetSelecte = true;
        this.$refs.filter.resetFields();
        this.filter.isShelf = null;
      },
      changeRestStatus() {
        this.resetSelecte = false;
      },
    },
  };
</script>

<style lang="less"></style>
