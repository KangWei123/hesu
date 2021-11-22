<template>
  <div class="goods-detail">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/retail/goods-mgr/shelf/gift-shelf' }" replace> 门店上架 </el-breadcrumb-item>
      <el-breadcrumb-item>赠品详情</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form class="add-goods-form" v-loading="loading" :model="form" ref="form" label-width="100px" :rules="rules">
      <el-form-item label="赠品名称：" class="goods-label">
        <span>{{ form.name }}</span>
      </el-form-item>

      <el-form-item label="条形码：" class="goods-label">
        <span>{{ form.barcode }}</span>
      </el-form-item>

      <!--图片-->
      <el-form-item label="图片：" class="goods-label" v-if="showGoodsImage">
        <div>
          <img class="goods-imgs" v-for="(imgUrl, index) in form.materialUrls" :key="index" :src="imgUrl" />
        </div>
      </el-form-item>

      <!--描述-->
      <el-form-item label="赠品描述：" class="goods-label">
        <span class="goods-desc" v-html="form.describe"></span>
      </el-form-item>

      <!--运费-->
      <el-form-item label="运费：" class="goods-label" :rules="rules.freight" prop="freight">
        <span>{{ form.freight | price }}</span>
        <span class="goods-unit">元</span>
      </el-form-item>

      <!--运费模板-->
      <el-form-item label="运费模板：" class="goods-label" v-if="freightTpl">
        <span>{{ freightTpl.name }}</span>
        <tpl-area-table :tpl="freightTpl"></tpl-area-table>
      </el-form-item>

      <!--重量-->
      <el-form-item label="重量：" v-if="form.weight" class="goods-label">
        <span>{{ form.weight }}</span>
        <span class="goods-unit">克</span>
      </el-form-item>

      <!--拣货单位-->
      <el-form-item label="单位：" v-if="form.unit" class="goods-label">
        <span>{{ form.unit }}</span>
      </el-form-item>

      <!--保质期-->
      <el-form-item label="保质期：" v-if="form.shelfLife" class="goods-label">
        <span>{{ form.shelfLife }}</span>
        <span class="goods-unit">{{ shelfLifeUnit }}</span>
      </el-form-item>

      <!--品牌-->
      <el-form-item label="品牌：" v-if="form.brand" class="goods-label">
        <span>{{ form.brand }}</span>
      </el-form-item>

      <!--产地-->
      <el-form-item label="产地：" v-if="form.placeOfOrigin" class="goods-label">
        <span>{{ form.placeOfOrigin }}</span>
      </el-form-item>

      <!-- <el-form-item>
        <el-button type="primary">关闭</el-button>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
  import utils from '@/dss-common/utils';
  import services from '@/dss-common/utils/services';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import mgrTypeEnum from '@/dss-wechat3rd/src/constants/mgrTypeEnum.js';
  import moneyUtil from '@/dss-common/utils/money';
  import GoodsCategoryCascader from '@/dss-wechat3rd/src/bz_components/goods-category-cascader/index.vue';
  import featureIf from '@/dss-wechat3rd/src/constants/featureIf';
  import wxFreightTplApi from '@/dss-wechat3rd/src/api/wx-freight-tpl-api.js';
  import TplAreaTable from '@/dss-wechat3rd/src/views-retail/warehouse/freight-tpl/tpl-area-table.vue';
  import giftApi from '@/dss-wechat3rd/src/api/gift.js';

  export default {
    name: 'GoodsDetailForm',

    components: {
      GoodsCategoryCascader,
      TplAreaTable,
    },

    filters: {
      toPageUnit(val) {
        return moneyUtil.convertHundredMoneyUnit(val, true);
      },
    },

    data() {
      return {
        goodsTypeEnum,
        mgrTypeEnum,
        loading: false,
        freightTplList: [],
        freightTpl: null,
        form: {
          name: '',
          itemStock: '',
          freight: '',
          isPay: 0,
          isShelf: 0,
          labelId: '',
          unit: '',
          shelfLife: '',
          shelfLifeUnit: '',
          materialsId: [],
          materialUrls: [],
        },

        rules: {},
      };
    },

    computed: {
      showGoodsImage() {
        const materialUrls = this.form.materialUrls;
        return materialUrls && materialUrls.length;
      },
      hideStock() {
        console.log(featureIf.can(featureIf.keys.GOODS_DETAIL_DISABLE_EDIT_STOCK));
        return featureIf.can(featureIf.keys.GOODS_DETAIL_DISABLE_EDIT_STOCK);
      },
      btnType() {
        return '保存';
      },
      shelfLifeUnit() {
        switch (this.form.shelfLifeUnit) {
          case 0:
            return '小时';
          case 1:
            return '天';
          case 2:
            return '月';
          case 3:
            return '年';
        }
      },
      preSellTime() {
        const { preSellStartTime, preSellEndTime } = this.form.itemDetailDTO.wxItem;
        if (preSellStartTime && preSellEndTime) {
          return (
            utils.date.format(new Date(preSellStartTime), 'YYYY-MM-DD HH:mm') +
            ' 至 ' +
            utils.date.format(new Date(preSellEndTime), 'YYYY-MM-DD HH:mm')
          );
        } else {
          return '';
        }
      },
    },

    watch: {
      'form.freightTemplateId': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.freightTpl = this.freightTplList.find(tpl => {
              return tpl.id === newVal;
            });
          }
        },
      },
      freightTplList: {
        handler(newVal, oldVal) {
          this.freightTpl = this.freightTplList.find(tpl => {
            return tpl.id === this.form.freightTemplateId;
          });
        },
      },
    },

    methods: {
      // 时间戳转换成时间
      timestampToTime(timestamp) {
        const date = new Date(timestamp);
        const Y = date.getFullYear() + '-';
        const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        const D = date.getDate();
        return Y + M + D;
      },
      getGoodsDetail() {
        this.loading = true;
        const params = {
          giftNo: this.$route.query.giftNo,
        };
        giftApi
          .getGiftInfo(params)
          .done(res => {
            this.form = res.data;
          })
          .always(() => {
            this.loading = false;
          });
      },

      getFreightTplList() {
        this.loading = true;
        const params = {
          pageNo: 1,
          pageSize: 1000,
        };
        wxFreightTplApi
          .getTplList(params)
          .done(res => {
            this.freightTplList = res.data || [];
            this.getGoodsDetail();
          })
          .always(() => {
            this.loading = false;
          });
      },

      goToItemListPage() {
        this.$router.back();
      },
    },

    mounted() {
      this.getFreightTplList();
    },
  };
</script>

<style lang="less" scoped>
  .add-goods-form {
    .category-item {
      height: 120px;
      margin-bottom: 10px;
      border-bottom: 1px black solid;
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
