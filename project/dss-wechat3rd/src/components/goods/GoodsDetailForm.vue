<template>
  <div class="goods-detail goods-detail-hotel">
    <el-form
      class="add-goods-form"
      v-loading="loading"
      v-if="goodsType"
      :model="form"
      ref="form"
      label-width="100px"
      :rules="rules"
    >
      <el-form-item :label="goodsType.label + '分类：'" prop="itemDetailDTO.wxItem.categoryId" class="goods-label">
        <span class="goods-type">
          {{ category }}
        </span>
      </el-form-item>
      <el-form-item
        label="商品类型："
        v-if="goodsType.value === 1"
        prop="itemDetailDTO.wxItem.mode"
        class="goods-label"
      >
        <span class="goods-type">
          {{ form.itemDetailDTO.wxItem.mode ? '积分商品' : '线上普通商品' }}
        </span>
      </el-form-item>
      <el-form-item :label="goodsLabel" class="goods-label">
        <span class="goods-type" v-if="!!form.itemDetailDTO.wxItem.labelId">{{
          form.itemDetailDTO.wxItem.labelName
        }}</span>
        <span class="goods-type" v-else-if="!!form.itemDetailDTO.wxItem.hotelFacility">
          {{ form.itemDetailDTO.wxItem.hotelFacility }}
        </span>
        <span class="goods-type" v-else-if="!!form.itemDetailDTO.wxItem.ticketSpecialLabels">
          {{ form.itemDetailDTO.wxItem.ticketSpecialLabels }}
        </span>
        <span class="goods-type" v-else>暂无标签</span>
      </el-form-item>

      <el-form-item :label="goodsType.label + '标题：'" class="goods-label">
        <span>{{ form.itemDetailDTO.wxItem.name }}</span>
      </el-form-item>

      <el-form-item
        :label="goodsType.label + '副标题：'"
        class="goods-label"
        style="max-width: 600px"
        v-if="!!form.itemDetailDTO.wxItem.subName"
      >
        <span>{{ form.itemDetailDTO.wxItem.subName }}</span>
      </el-form-item>

      <el-form-item label="条形码：" class="goods-label">
        <span>{{ form.itemDetailDTO.wxItem.barcode }}</span>
      </el-form-item>

      <!--暂时隐藏-->
      <el-form-item :label="goodsType.label + '视频：'" class="goods-label" v-if="false">
        <span>v.qq.com</span>
        <el-button type="primary" class="btn-preview">预览视频 </el-button>
      </el-form-item>

      <!--预售信息-->
      <el-form-item
        label="预售商品："
        class="goods-label"
        v-if="goodsType.value !== goodsTypeEnum.rooms.value && goodsType.value !== goodsTypeEnum.ticket.value"
      >
        <span>{{ form.itemDetailDTO.wxItem.preSell ? '是' : '否' }} </span>
      </el-form-item>

      <!-- 预售时间 -->
      <el-form-item label="预售时间：" class="goods-label" v-if="form.itemDetailDTO.wxItem.preSell">
        <span>{{ preSellTime }} </span>
      </el-form-item>

      <!-- 发货时间 -->
      <el-form-item label="发货时间：" class="goods-label" v-if="form.itemDetailDTO.wxItem.deliveryTime">
        <span>{{ deliveryTime }}</span>
      </el-form-item>

      <!-- 商品限购信息 -->
      <el-form-item label="限购数量：" class="goods-label">
        <span>{{ peopleLimitAmount }}</span>
      </el-form-item>

      <!--单位-->
      <el-form-item label="单位：" class="goods-label" v-if="!!form.itemDetailDTO.wxItem.unit">
        <span>{{ form.itemDetailDTO.wxItem.unit || '-' }}</span>
      </el-form-item>

      <!--售价-->
      <el-form-item
        :label="form.itemDetailDTO.wxItem && form.itemDetailDTO.wxItem.salesType ? '价格标签：' : '现金售价：'"
        class="goods-label"
      >
        <span v-if="!form.itemDetailDTO.wxItem.salesType">{{ form.itemDetailDTO.wxItem.salePrice | price }}元</span>
        <span v-else>{{ form.itemDetailDTO.wxItem.displayPrice || '到店咨询' }}</span>
      </el-form-item>

      <!-- 积分 -->
      <el-form-item
        v-if="form.itemDetailDTO.wxItem.mode && form.itemDetailDTO.wxItem.integralPrice"
        label="积分售价："
        class="goods-label"
      >
        <span>{{ form.itemDetailDTO.wxItem.integralPrice }}</span>
      </el-form-item>

      <!--房型尺寸-->
      <el-form-item label="房型尺寸：" class="goods-label" v-if="!!form.itemDetailDTO.wxItem.hotelBedSize">
        <span>{{ form.itemDetailDTO.wxItem.hotelBedSize }}</span>
      </el-form-item>

      <!--房型数量-->
      <el-form-item label="房型数量：" class="goods-label" v-if="!!form.itemDetailDTO.wxItem.hotelAmount">
        <span>{{ form.itemDetailDTO.wxItem.hotelAmount }}</span>
      </el-form-item>

      <!--限制数量-->
      <el-form-item label="限制数量：" class="goods-label" v-if="!!form.itemDetailDTO.wxItem.ticketPurchaseLimit">
        <span>{{ form.itemDetailDTO.wxItem.ticketPurchaseLimit }}</span>
      </el-form-item>

      <!--有效期-->
      <el-form-item label="有效期：" class="goods-label" v-if="!!form.itemDetailDTO.wxItem.ticketValidityPeriod">
        <span>{{ form.itemDetailDTO.wxItem.ticketValidityPeriod }}</span>
      </el-form-item>

      <!--图片-->
      <el-form-item :label="goodsType.label + '图片：'" class="goods-label" v-if="showGoodsImage">
        <div>
          <img
            class="goods-imgs"
            v-for="(imgUrl, index) in form.itemDetailDTO.materialUrls"
            :key="index"
            :src="imgUrl"
          />
        </div>
      </el-form-item>

      <!--规格-->
      <el-form-item label="规格：" v-if="showSkuInfoTable" class="goods-label">
        <sku-info-table
          :show-price="!form.itemDetailDTO.wxItem.salesType"
          :sku-infos="form.itemDetailDTO.skuInfoList"
          :is-integral="!!form.itemDetailDTO.skuInfoList"
          :unit="form.itemDetailDTO && form.itemDetailDTO.wxItem && form.itemDetailDTO.wxItem.unit"
          :show-stock="goodsType.type === goodsTypeEnum.product.type"
          :editable="false"
        />
      </el-form-item>

      <!-- 组合商品 -->
      <el-form-item
        label="组合商品:"
        class="goods-label"
        prop="itemDetailDTO.wxItem.combinationDTOS"
        v-if="form.itemDetailDTO.wxItem.combinationDTOS && form.itemDetailDTO.wxItem.combinationDTOS.length > 0"
      >
        <el-table
          class="wkt-table"
          style="margin: 0px 0px 20px; width: 800px"
          :data="form.itemDetailDTO.wxItem.combinationDTOS"
        >
          <el-table-column label="子商品名称">
            <template slot-scope="scope">
              <div class="goods-desc-box">
                <img class="goods-img" :src="scope.row.combinationThumbnail" />
                <div class="goods-desc">
                  <div class="limit-line">
                    {{ scope.row.combinationItemName
                    }}{{ scope.row.combinationItemAttr ? ' (' + scope.row.combinationItemAttr + ')' : '' }}
                  </div>
                  <span class="price">￥{{ scope.row.combinationSalePrice | price }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品数量" width="120" align="center" prop="combinationCount"> </el-table-column>
          <el-table-column label="单位" width="120" align="center" prop="combinationUnit"> </el-table-column>
          <el-table-column label="条形码" width="200" prop="combinationBarcode"> </el-table-column>
        </el-table>
      </el-form-item>

      <!--可用库存-->
      <el-form-item
        label="可用库存："
        class="goods-label"
        v-if="goodsType.type === goodsTypeEnum.product.type && !showSkuInfoTable"
        prop="itemDetailDTO.wxItem.itemStock"
      >
        <el-input
          placeholder="请输入库存"
          v-if="!hideStock"
          class="goods-price primary-inputHeight"
          v-model="form.itemDetailDTO.wxItem.itemStock"
        ></el-input>
        <span v-else>{{ form.itemDetailDTO.wxItem.itemStock }}</span>
        <span class="goods-unit">件</span>
      </el-form-item>

      <!--时长-->
      <el-form-item label="时长：" class="goods-label" v-if="goodsType.type === goodsTypeEnum.server.type">
        <span class="goods-time">{{ form.itemDetailDTO.wxItem.duration }}</span>
        <span class="service-unit">分钟</span>
      </el-form-item>

      <!--线上预约-->
      <el-form-item label="线上预约：" class="goods-label" v-if="goodsType.type === goodsTypeEnum.server.type">
        <span v-if="!form.itemDetailDTO.wxItem.noNeedPay">需支付</span>
        <span v-else>无需支付</span>
      </el-form-item>

      <!--预约类型-->
      <el-form-item label="预约类型：" class="goods-label" v-if="goodsType.value === goodsTypeEnum.rooms.value">
        {{ hotelReservationTime }}
      </el-form-item>

      <!--描述-->
      <el-form-item :label="goodsType.label + '描述：'" class="goods-label">
        <span class="goods-desc" v-html="form.itemDetailDTO.wxItem.describe"></span>
      </el-form-item>

      <!--购票须知-->
      <el-form-item label="购票须知：" class="goods-label" v-if="goodsType.value === goodsTypeEnum.ticket.value">
        <span class="goods-desc" v-html="form.itemDetailDTO.wxItem.ticketPurchaseNotice"></span>
      </el-form-item>

      <!--运费-->
      <el-form-item
        label="运费："
        class="goods-label"
        v-if="goodsType.type === goodsTypeEnum.product.type"
        :rules="rules.itemDetailDTO.wxItem.freight"
        prop="itemDetailDTO.wxItem.freight"
      >
        <span>{{ form.itemDetailDTO.wxItem.freight | price }}</span>
        <span class="goods-unit">元</span>
      </el-form-item>

      <!--运费模板-->
      <el-form-item
        label="运费模板："
        class="goods-label"
        v-if="goodsType.type === goodsTypeEnum.product.type && freightTpl"
      >
        <span>{{ freightTpl.name }}</span>
        <tpl-area-table :tpl="freightTpl"></tpl-area-table>
      </el-form-item>

      <!--重量-->
      <el-form-item label="重量：" v-if="form.itemDetailDTO.wxItem.weight" class="goods-label">
        <span>{{ form.itemDetailDTO.wxItem.weight }}</span>
        <span class="goods-unit">克</span>
      </el-form-item>

      <!--拣货单位-->
      <el-form-item label="拣货单位：" v-if="form.itemDetailDTO.wxItem.outUnit" class="goods-label">
        <span>{{ form.itemDetailDTO.wxItem.outUnit }}</span>
      </el-form-item>

      <!--保质期-->
      <el-form-item label="保质期：" v-if="form.itemDetailDTO.wxItem.shelfLife" class="goods-label">
        <span>{{ form.itemDetailDTO.wxItem.shelfLife }}</span>
        <span class="goods-unit">{{ shelfLifeUnit }}</span>
      </el-form-item>

      <!--品牌-->
      <el-form-item label="品牌：" v-if="form.itemDetailDTO.wxItem.brand" class="goods-label">
        <span>{{ form.itemDetailDTO.wxItem.brand }}</span>
      </el-form-item>

      <!--产地-->
      <el-form-item label="产地：" v-if="form.itemDetailDTO.wxItem.placeOfOrigin" class="goods-label">
        <span>{{ form.itemDetailDTO.wxItem.placeOfOrigin }}</span>
      </el-form-item>

      <div
        class="bottom-button"
        v-if="
          goodsType.type === goodsTypeEnum.product.type ||
          goodsType.type === goodsTypeEnum.rooms.type ||
          goodsType.type === goodsTypeEnum.ticket.type
        "
      >
        <el-button type="primary" @click="onSaveAndShelf('form')">{{ btnType }} </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import './css/GoodsDetailForm.less';
  import utils from '@/dss-common/utils';
  import constants from '../../constants';
  import services from '@/dss-common/utils/services';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import mgrTypeEnum from '@/dss-wechat3rd/src/constants/mgrTypeEnum.js';
  import moneyUtil from '@/dss-common/utils/money';
  import GoodManageBread from './GoodsManageBread';
  import GoodsCategoryCascader from '@/dss-wechat3rd/src/bz_components/goods-category-cascader/index.vue';
  import SkuInfoTable from './SkuInfoTable';
  import featureIf from '@/dss-wechat3rd/src/constants/featureIf';
  import wxFreightTplApi from '@/dss-wechat3rd/src/api/wx-freight-tpl-api.js';
  import TplAreaTable from '@/dss-wechat3rd/src/views-retail/warehouse/freight-tpl/tpl-area-table.vue';

  export default {
    name: 'GoodsDetailForm',

    components: {
      GoodManageBread,
      GoodsCategoryCascader,
      SkuInfoTable,
      TplAreaTable,
    },

    props: {
      goodsType: {
        type: Object,
        default: function () {
          return null;
        },
      },
      pageType: {
        type: String,
        default: null,
      },
      drawerItemNo: {
        type: String,
        default: null,
      },
    },

    filters: {
      toPageUnit(val) {
        return moneyUtil.convertHundredMoneyUnit(val, true);
      },
    },

    data() {
      const budgetReg = /^\d{1,9}$/; // 大于0的浮点数
      const checkSalePrice = (rule, value, callback) => {
        if (value === '' || value == null) {
          return callback(new Error('请输入商品售价'));
        } else if (utils.isNumber(value)) {
          return callback();
        } else if (isNaN(value) || value.charAt(value.length - 1) === '.') {
          // 数字最后一位加'.'也认为是数字，剔除这个情况
          return callback(new Error('请输入数字值'));
        } else if (!budgetReg.test(value) || value === '0') {
          return callback(new Error('售价必须是1至999999999之间的整数'));
        } else {
          return callback();
        }
      };

      const checkFreight = (rule, value, callback) => {
        if (value === '' || value == null) {
          return callback(new Error('请输入运费'));
        } else if (utils.isNumber(value)) {
          return callback();
        } else if (isNaN(value) || value.charAt(value.length - 1) === '.') {
          // 数字最后一位加'.'也认为是数字，剔除这个情况
          return callback(new Error('请输入数字值'));
        } else if (!budgetReg.test(value) || value === '0') {
          return callback(new Error('运费必须是1至999999999之间的整数'));
        } else {
          return callback();
        }
      };

      const verifyStock = value => {
        if (value === '' || value == null) {
          return '请输入商品库存';
        } else if (utils.isNumber(value)) {
          return undefined;
        } else if (isNaN(value)) {
          return '请输入数字值';
        } else if (!budgetReg.test(value) || value === '0') {
          return '库存必须是1至999999999之间的整数';
        } else {
          return undefined;
        }
      };

      const checkItemStock = (rule, value, callback) => {
        const error = verifyStock(value);
        if (error) {
          return callback(new Error(error));
        } else {
          return callback();
        }
      };

      return {
        goodsTypeEnum,
        mgrTypeEnum,
        loading: false,
        freightTplList: [],
        freightTpl: null,
        form: {
          itemDetailDTO: {
            wxItem: {
              type: this.goodsType.value,
              categoryId: '',
              name: '',
              salePrice: '',
              itemStock: '',
              peopleLimitAmount: 0,
              freight: '',
              isPay: 0,
              isShelf: 0,
              categoryDTO: {},
              labelId: '',
              outUnit: '',
              shelfLife: '',
              shelfLifeUnit: '',
              hotelType: '',
              hotelFacility: '',
              hotelBedSize: '',
              hotelAmount: '',
              hotelReservationTimeType: '',
              hotelReservationDaysAfter: '',
              hotelReservationStatTime: '',
              hotelReservationEndTime: '',
              ticketType: '',
              ticketSpecialLabels: '',
              ticketPurchaseLimit: '',
              ticketReservationType: '',
              ticketReservationDays: '',
              ticketPurchaseNotice: '',
              ticketValidityPeriod: '',
            },
            skuTreeList: [],
            skuInfoList: [],
            materialsId: [],
            materialUrls: [],
          },
          multiAttrParentOptions: [],
          disableAddSkuTree: { disable: false },
        },

        rules: {
          itemDetailDTO: {
            wxItem: {
              categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
              name: [
                { required: true, message: '请输入商品名称', trigger: 'blur' },
                {
                  min: 1,
                  max: 30,
                  message: '长度在 1 到 30 个字符',
                  trigger: 'blur',
                },
              ],
              salePrice: [{ required: true, validator: checkSalePrice, trigger: 'blur' }],
              itemStock: [{ required: true, validator: checkItemStock, trigger: 'blur' }],
              freight: [{ required: true, validator: checkFreight, trigger: 'blur' }],
            },
          },
        },
      };
    },

    computed: {
      goodsLabel() {
        if (this.goodsType.value === goodsTypeEnum.rooms.value) {
          return '房间设施：';
        } else if (this.goodsType.value === goodsTypeEnum.ticket.value) {
          return '特色标签：';
        } else {
          return this.goodsType.label + '标签：';
        }
      },
      hotelReservationTime() {
        if (this.form.itemDetailDTO.wxItem.hotelReservationTimeType) {
          return `可在 ${this.timestampToTime(this.form.itemDetailDTO.wxItem.hotelReservationStatTime)}——
          ${this.timestampToTime(this.form.itemDetailDTO.wxItem.hotelReservationEndTime)} 预约`;
        } else {
          return `可预约未来${this.form.itemDetailDTO.wxItem.hotelReservationDaysAfter}天`;
        }
      },
      category() {
        if (this.goodsType.value === goodsTypeEnum.rooms.value) {
          return this.form.itemDetailDTO.wxItem.hotelType
            ? mgrTypeEnum.hotel.combo.label
            : mgrTypeEnum.hotel.oddDay.label;
        } else if (this.goodsType.value === goodsTypeEnum.ticket.value) {
          return this.form.itemDetailDTO.wxItem.ticketType
            ? mgrTypeEnum.ticket.combo.label
            : mgrTypeEnum.ticket.oddDay.label;
        } else {
          return this.form.itemDetailDTO.wxItem.categoryDTO.category || '';
        }
      },
      showGoodsImage() {
        const materialUrls = this.form.itemDetailDTO.materialUrls;
        return materialUrls && materialUrls.length;
      },
      hideStock() {
        console.log(featureIf.can(featureIf.keys.GOODS_DETAIL_DISABLE_EDIT_STOCK));
        return featureIf.can(featureIf.keys.GOODS_DETAIL_DISABLE_EDIT_STOCK);
      },
      showSkuInfoTable() {
        const skuInfoList = this.form.itemDetailDTO.skuInfoList;
        return skuInfoList && skuInfoList.length;
      },
      btnType() {
        return this.pageType === 'detail' ? '关闭' : '保存';
      },
      shelfLifeUnit() {
        switch (this.form.itemDetailDTO.wxItem.shelfLifeUnit) {
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

      /**
       * 发货时间
       * params：
       *  deliveryTimeType 发货时间类型 0：固定时间，1：购买后几天范围内发货
       *  deliveryTime 固定发货时间
       *  daysAfterBuyRange 购买后几天范围内发货
       */
      deliveryTime() {
        const { deliveryTimeType, deliveryTime, daysAfterBuyRange } = this.form.itemDetailDTO.wxItem;
        if (deliveryTimeType) {
          return '购买后' + daysAfterBuyRange + '天发货';
        } else {
          return utils.date.format(new Date(deliveryTime), 'YYYY-MM-DD HH:mm');
        }
      },

      peopleLimitAmount() {
        const { peopleLimitAmount } = this.form.itemDetailDTO.wxItem;
        if (!peopleLimitAmount) {
          return '不限购';
        }
        return peopleLimitAmount + '件';
      },
    },

    watch: {
      'form.itemDetailDTO.wxItem.freightTemplateId': {
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
            return tpl.id === this.form.itemDetailDTO.wxItem.freightTemplateId;
          });
        },
      },
      // drawerItemNo: {
      //   handler(newVal,oldVal) {
      //     console.log(newVal,oldVal,"newVal,oldVal????????")
      //     if(newVal) {
      //       this.getGoodsDetail();
      //     }
      //   }
      // }
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
          itemNo: this.$route.query.itemNo,
        };
        services
          .get(constants.Api.store.itemDetail, {
            params,
            action: '商品详情',
          })
          .done(res => {
            this.form.itemDetailDTO = res.data;
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
          })
          .always(() => {
            this.loading = false;
          });
      },

      onShelfDown() {
        this.loading = true;

        const shelfParams = {
          itemId: this.form.itemDetailDTO.wxItem.id,
          shelf: 0,
        };
        services
          .get(constants.Api.store.shelf, {
            params: shelfParams,
            action: '上下架',
          })
          .done(res => {
            this.goToItemListPage();
          })
          .always(() => {
            this.loading = false;
          });
      },

      onSaveAndShelf(formName) {
        if (this.pageType === 'detail') {
          this.goToItemListPage();
        } else {
          this.$refs[formName].validate(valid => {
            if (valid) {
              const params = this.$plain(this.form.itemDetailDTO);
              params.wxItem.isShelf = 1;

              // 产品计算库存
              if (
                this.goodsType.type === goodsTypeEnum.product.type &&
                !!params.skuInfoList &&
                !!params.skuInfoList.length
              ) {
                let itemStock = 0;
                params.skuInfoList.forEach(item => {
                  itemStock += parseInt(item.stock);
                });
                params.wxItem.itemStock = itemStock;
              }

              this.loading = true;
              services
                .post(constants.Api.store.updateItem, params, {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  transformRequest: function (data, config, test) {
                    return JSON.stringify(data);
                  },
                  action: '更新商品',
                })
                .done(res => {
                  this.goToItemListPage();
                })
                .always(() => {
                  this.loading = false;
                });
            } else {
              return false;
            }
          });
        }
      },

      goToItemListPage() {
        // this.$emit('CloseDrawer');
        this.$router.back();
        // this.$router.push('/goods-shelf/list/' + this.goodsType.type);
      },

      onSkuInfosAssembled(assembledSkuInfos) {
        this.form.itemDetailDTO.skuInfoList = assembledSkuInfos;
      },
    },

    mounted() {
      this.getGoodsDetail();
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
