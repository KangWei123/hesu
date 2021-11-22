<template>
  <div class="gift-special-detail">
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/marketing/gift-special-area/delete'}"
                          replace>
        废弃赠品
      </el-breadcrumb-item>
      <el-breadcrumb-item>赠品活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form class="add-goods-form"
             v-loading="loading"
             :model="form"
             ref="form"
             label-width="110px"
             :rules="rules">

      <el-form-item label="赠品名称："
                    class="goods-label">
        <span>{{form.name}}{{form.attrValCombineName ? '（' + form.attrValCombineName + '）' : ''}}</span>
      </el-form-item>

      <!--图片-->
      <el-form-item label="赠品主图："
                    class="goods-label">
        <div>
          <img class="goods-imgs"
               :src="form.thumbnail" />
        </div>
      </el-form-item>

      <el-form-item label="活动时间："
                    prop="dateRange">
        <span>{{form.startTime | fitTime}} - {{form.endTime | fitTime}}</span>
      </el-form-item>

      <!--限领人群-->
      <el-form-item label="限领人群："
                    prop="dateRange">
        <span>{{form.levelName}}</span>
      </el-form-item>

      <!--限领总数：-->
      <el-form-item label="限领总数："
                    prop="limitTotal">
        <span>{{form.limitTotal===0?'无限制':form.limitTotal}}</span>
      </el-form-item>

      <!--每人限领数量：-->
      <el-form-item label="每人限领数量："
                    prop="everyoneLimitCount">
        <span>{{form.everyoneLimitCount===0?'无限制':form.everyoneLimitCount}}</span>
      </el-form-item>

      <!--每人限领数量：-->
      <el-form-item label="适用门店："
                    prop="everyoneLimitCount">
        <div class="store-list-box"
             v-if="form.suitStores && form.suitStores.length && form.suitStoreType === suitStoreTypeEnum.part">
          <div class="store-content">
            <el-tag v-for="(store) in form.suitStores"
                    :key="store.id"
                    closable>{{store.name}}</el-tag>

          </div>
        </div>
        <span v-else>全部门店</span>
      </el-form-item>
      <div class="bottom-button">
        <el-button @click="goToItemListPage">关闭</el-button>
      </div>
    </el-form>
  </div>

</template>

<script>
import utils from '@/dss-common/utils';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import mgrTypeEnum from '@/dss-wechat3rd/src/constants/mgrTypeEnum.js';
import moneyUtil from '@/dss-common/utils/money';
import GoodsCategoryCascader from '@/dss-wechat3rd/src/bz_components/goods-category-cascader/index.vue';
import TplAreaTable from '@/dss-wechat3rd/src/views-retail/warehouse/freight-tpl/tpl-area-table.vue';
import giftApi from '@/dss-wechat3rd/src/api/gift.js';
import suitStoreTypeEnum from '@/dss-wechat3rd/src/constants/suitStoreTypeEnum.js';

export default {
  name: 'GoodsDetailForm',

  components: {
    GoodsCategoryCascader,
    TplAreaTable
  },

  filters: {
    toPageUnit(val) {
      return moneyUtil.convertHundredMoneyUnit(val, true);
    }
  },

  data() {
    return {
      suitStoreTypeEnum,
      goodsTypeEnum,
      mgrTypeEnum,
      loading: false,
      freightTplList: [],
      freightTpl: null,
      form: {},
      groupStoreList: [],
      rules: {}
    };
  },
  filters: {
    fitTime(value) {
      return utils.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
    }
  },

  methods: {
    getGoodsDetail() {
      this.loading = true;
      const params = {
        id: this.$route.query.id
      };
      giftApi
        .getActivity(params)
        .done(res => {
          this.form = res.data;
        })
        .always(() => {
          this.loading = false;
        });
    },

    goToItemListPage() {
      this.$router.push('/marketing/gift-special-area/delete');
    }
  },

  mounted() {
    this.getGoodsDetail();
  }
};
</script>

<style lang="less" scoped>
.add-goods-form {
  padding: 0 20px;
  background: #fff;
  .category-item {
    height: 120px;
    margin-bottom: 10px;
    border-bottom: 1px black solid;
  }
  .goods-imgs {
    width: 176px;
    height: 176px;
    margin: 0px 10px 10px 0px;
  }

  .sale-price {
    position: relative;
    display: flex;
    align-items: center;

    .icon-search {
      position: absolute;
      top: 12px;
      z-index: 100;
      margin-left: 6px;
    }
  }

  .goods-desc-box {
    display: flex;
    justify-content: flex-start;

    .goods-img {
      width: 65px;
      height: 65px;
    }

    .goods-desc {
      flex: 1;
      margin-left: 20px;

      .price {
        color: #ff562d;
      }
    }
  }
}
</style>
