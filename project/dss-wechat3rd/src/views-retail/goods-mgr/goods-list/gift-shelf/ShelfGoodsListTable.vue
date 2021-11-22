<template>
  <div class="goods-list-container shelf-container">
    <el-button
      style="float:right; margin-top: 30px; margin-right: 20px"
      type="primary"
      v-if="goodsType.type === goodsTypeTab.card.type"
      @click="onAddCard(goodsType.type)"
      >添加{{ goodsType.label }}</el-button
    >

    <goods-list-filter
      :show-label="false"
      showStatus
      :goods-type="filterGoodsType"
      class="wkt-opt-label-container"
      @filter="onFilter"
    />


    <div class="goods-list" style="margin-top: 16px;">
      <div style="padding-top: 16px; padding-left: 20px">
        <el-popover placement="top-start"
                    width="200"
                    trigger="hover"
                    v-if="!goodsShelf"
                    :content="scopeMenuEnum.disabledBtnTip">
          <el-button plain slot="reference">批量上架</el-button>
        </el-popover>
        <el-button v-else plain :disabled="computeDisableShelfButton"
          @click="onToggleShelf(multipleSelection, false, true)">批量上架</el-button>
        <el-popover placement="top-start"
                    width="200"
                    trigger="hover"
                    v-if="!goodsShelf"
                    :content="scopeMenuEnum.disabledBtnTip">
          <el-button plain slot="reference">批量下架</el-button>
        </el-popover>
        <el-button plain v-else :disabled="computeDisableShelfButton"
                    @click="onToggleShelf(multipleSelection, true, true)">批量下架</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="goodsList"
        tooltip-effect="dark"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        class="wkt-table"
      >
        <el-table-column type="selection" width="70"></el-table-column>
        <el-table-column :label="goodsType.label + '名称'" min-width="300">
          <template slot-scope="scope">
            <div class="goods-desc-box">
              <div class="goods-img">
                <img :src="scope.row.thumbnail" />
              </div>
              <div class="goods-desc">
                <div>
                  {{ scope.row.name }}
                  {{ scope.row.attrValCombineName ? '(' + scope.row.attrValCombineName + ')' : '' }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="有效期" v-if="goodsType.type === goodsTypeTab.card.type">
          <span slot-scope="scope">{{ computeValidity(scope.row) }}</span>
        </el-table-column>

        <el-table-column min-width="140" label="上下架">
          <template slot-scope="scope">
            <el-switch  v-model="scope.row.giftShelf"
                          :active-value="1"
                          :inactive-value="0"
                          active-text="上架"
                          inactive-text="下架"
                          active-color="#52C41A"
                          inactive-color="#B1B5BD"
                          @change="onToggleSwitch($event, [scope.row])" />
          </template>
        </el-table-column>

        <el-table-column label="排序" min-width="140" prop="sort">
          <template slot-scope="scope">
            <el-popover placement="top-start"
                        width="200"
                        trigger="hover"
                        v-if="!goodEdit"
                        :content="scopeMenuEnum.disabledBtnTip">
              <el-input-number
                disabled
                slot="reference"
                class="goods-order"
                v-model="scope.row.giftOrder"
                size="small"
                :controls="false"
              ></el-input-number>
            </el-popover>
            <el-input-number
              v-else
              class="goods-order"
              v-model="scope.row.giftOrder"
              size="small"
              :controls="false"
              @change="updateSort(scope.row.giftNo, scope.row.giftOrder)"
            ></el-input-number>
          </template>
        </el-table-column>

        <el-table-column prop="itemStock" width="130" label="可用库存"> </el-table-column>

        <el-table-column label="总销量">
          <span slot-scope="scope">{{ computeSalesVolume(scope.row) }}</span>
        </el-table-column>

        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <div style="display: inline-block;">
              <el-popover
                v-if="goodsType.type !== goodsTypeTab.card.type&&!goodsShow"
                placement="top-start"
                width="200"
                trigger="hover"
                :content="scopeMenuEnum.disabledBtnTip">
                <a style="color: #2E8DFF;" href="javascript:;" slot="reference">详情</a>
              </el-popover>
              <a href="javascript:;" style="color: #2E8DFF;"
                 v-if="goodsType.type !== goodsTypeTab.card.type&&goodsShow"
                 @click="gotoGoodsDetail(scope.row.giftNo)">详情</a>
            </div>
          </template>
        </el-table-column>
        <!--修改无数据时的展示-->
        <template slot="empty">
          <place-holder></place-holder>
        </template>
      </el-table>



      <!-- <el-pagination
        v-if="totalGoodsCount"
        layout="prev, pager, next, jumper, sizes, total"
        :total="totalGoodsCount"
        :page-size="pageParams.pageSize"
        :current-page="pageParams.pageNo"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        class="wkt-pagination"
      ></el-pagination> -->

      <el-pagination
          v-if="totalGoodsCount"
          :hide-on-single-page="true"
          @size-change="onSizeChange"
          @current-change="onPageChange"
          :page-size="pageParams.pageSize"
          layout="sizes, prev, pager, next"
          :total="totalGoodsCount">
        </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import moneyUtil from '@/dss-common/utils/money';
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import cardEnum from '@/dss-wechat3rd/src/constants/cardEnum';
import PlaceHolder from '@/dss-common/components/placeholder/index';
import GoodsListFilter from '@/dss-wechat3rd/src/components/goods/GoodsListFilter.vue';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import mgrTypeEnum from '@/dss-wechat3rd/src/constants/mgrTypeEnum.js';
import giftApi from '@/dss-wechat3rd/src/api/gift.js';
import timeCardBg from '@/dss-wechat3rd/src/images/goods/time-card-bg.png';
import chargeCardBg from '@/dss-wechat3rd/src/images/goods/charge-card-bg.png';
import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
import itemPriceUpdateDialog from '@/dss-wechat3rd/src/bz_components/item-price-update-dialog/index.vue';
import scopeMenuEnum from '@/business-common/scopeMenuEnum.js';

const unionKeys = ['giftNo'];
/**
 * 管理商品的商品列表
 */
export default {
  name: 'GoodsList',
  mixins: [tableCheckedHelperMixin],
  components: {
    PlaceHolder,
    GoodsListFilter,
    itemPriceUpdateDialog
  },

  //  model: {
  //    prop: 'goodsList'
  //  },
  props: {
    goodsType: {
      type: Object,
      default: function() {
        return null;
      }
    },
    //产品详情前缀
    productDetailPrefix: {
      type: String,
      default: ''
    },
    goodsShow: {
      type: Boolean,
      default: true
    },
    goodsShelf: {
      type: Boolean,
      default: true
    },
    goodEdit: {
      type: Boolean,
      default: true
    }
    //    ,
    //    goodsList: {
    //      type: Array,
    //      default: function() {
    //        return null;
    //      }
    //    }
  },

  filters: {
    toPageUnit(val) {
      return moneyUtil.convertHundredMoneyUnit(val, true);
    }
  },

  data() {
    return {
      storeShelfGift: true,
      storePriceGift: true,
      scopeMenuEnum,
      goodsList: [],
      cardEnum,
      loading: false,
      checked: false,
      goodsTypeTab: goodsTypeEnum,
      totalGoodsCount: 0,
      pageParams: {
        pageSize: 10, //每页条数
        pageNo: 1 //页数
      },
      queryParams: {
        status: 1
      },
      multipleSelection: [],
      timeCardBg: timeCardBg,
      chargeCardBg: chargeCardBg,

      qrCode: null,
      qrCodeLoading: true,

      // 修改商品价格对话弹框组件参数
      updateItemNo: null
    };
  },

  computed: {
    ...mapState({
      curApp: 'curApp',
      wkbScopeMenu: 'wkbScopeMenu'
    }),

    // 查询条件过滤器的商品类型，因为组合商品获取分类的时候用的产品类型也是普通产品的类型
    filterGoodsType() {
      if (this.goodsType === goodsTypeEnum.combinationItem) {
        return goodsTypeEnum.product;
      }
      return this.goodsType;
    },

    computeDisableShelfButton() {
      return this.multipleSelection === null || this.multipleSelection.length === 0;
    },

    computeValidity() {
      return function(item) {
        if (item.validityType === cardEnum.validityType.permanent) {
          return '永久有效';
        } else if (item.validityType === cardEnum.validityType.custom) {
          return item.validity + '天';
        } else {
          return null;
        }
      };
    },

    computeSalesVolume() {
      return function(item) {
        return item.itemSalesVolume;
      };
    }
  },
  watch: {
    wkbScopeMenu: {
      immediate: true,
      handler() {
        this.queryUserManagement();
      }
    }
  },
  mounted() {},

  methods: {
    // 获取用户是否为管理员
    queryUserManagement() {
      if (this.wkbScopeMenu) {
        const giftButton = scopeMenuEnum.dictionary.wkbChildMenu.wkbGoodsMgrMenu.storeShelfMenu.giftButton;
        const scopeEditGoodsButton = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          giftButton.store_shelf_gift
        );
        this.storeShelfGift = !!scopeEditGoodsButton && !!scopeEditGoodsButton.status;
        const scopeShelfGoodsButton = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          giftButton.store_price_gift
        );
        this.storePriceGift = !!scopeShelfGoodsButton && !!scopeShelfGoodsButton.status;
      }
    },
    /**
     * 根据商品类型获取门店下的商品列表,分页
     * @param goodsType 商品类型
     */
    listStoreItemsByType(emitInput) {
      this.mUpdateTotalListBySelection(this.goodsList, this.multipleSelection, unionKeys);
      this.loading = true;
      const params = { ...this.pageParams, ...this.queryParams };
      params.name = this.queryParams.itemName;
      giftApi
        .query_gift_list(params)
        .done(res => {
          this.totalGoodsCount = res.totalCount;
          this.goodsList = res.data || [];
          if (!!emitInput) {
            this.$emit('input', res.data || []);
          }
          this.mBuildMultipleTableSelection(this.goodsList, 'multipleTable', unionKeys);
        })
        .always(() => {
          this.loading = false;
        });
    },

    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.listStoreItemsByType();
    },
    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.listStoreItemsByType();
    },

    onToggleSwitch(isNowShelf, item) {
      this.onToggleShelf(item, !isNowShelf);
    },

    /**
     * 批量上下架
     * @param itemList 商品列表
     * @param isNowShelf 上下架 true：上架；false：下架
     * @param isPatch 是否为批量操作
     */
    onToggleShelf(itemList, isNowShelf, isPatch = false) {
      if (isPatch) {
        //当前页操作选中状态时，需要重新计算一次选中的item。
        this.mUpdateTotalListBySelection(this.goodsList, this.multipleSelection, unionKeys);
        itemList = this.mTotalCheckedList;
      }
      this.loading = true;
      const giftNoList = [];
      const preSellItemNoList = [];
      itemList.forEach(item => {
        giftNoList.push(item.giftNo);
        if (item.preSell) {
          preSellItemNoList.push(item.giftNo);
        }
      });

      const shelfParams = {
        shelf: isNowShelf ? 0 : 1,
        giftNo: giftNoList.toString()
      };
      if (preSellItemNoList.length) {
        shelfParams.preSellItemNo = preSellItemNoList.toString();
      }
      giftApi
        .store_gift_shelf(shelfParams)
        .then(res => {
          this.mResetCheckedData();
          this.multipleSelection = [];
          this.mUpdateTotalListBySelection(this.goodsList, this.multipleSelection, unionKeys);
          this.listStoreItemsByType();
        })
        .done(res => {
          this.goodsList = res.data || [];
        })
        .always(() => {
          this.loading = false;
        });
    },

    onFilter(filter) {
      this.pageParams.pageNo = 1;
      this.queryParams = { ...this.queryParams, ...filter };
      this.listStoreItemsByType();
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    /**
     * 修改排序
     * @param giftNo
     * @param itemOrder
     */
    updateSort(giftNo, itemOrder) {
      const positiveInteger = /^([0-9]*)$/; //正整数
      if (!positiveInteger.test(itemOrder) || itemOrder > 999) {
        this.$message.error('请输入0到999之间的正整数');
        return false;
      }
      const params = {
        giftNo: giftNo,
        order: itemOrder
      };
      const url = '/wp/store_gift/order/gift';
      services
        .post(url, params, {
          action: '更新赠品上下架排序'
        })
        .done(res => {
          this.listStoreItemsByType(true);
        });
    },
    onAddCard(type) {
      this.$router.push(`/beauty/goods-mgr/goods/${type}/add`);
    },

    /**
     * 跳转商品详情页面
     */
    gotoGoodsDetail(giftNo) {
      this.$router.push({
        path: '/retail/goods-mgr/shelf/gift-shelf/detail',
        query: { giftNo: giftNo }
      });
    },

    /**
     * 隐藏loading
     */
    unLoading() {
      this.loading = false;
    },

    /**
     * 刷新数据
     */
    onRefresh() {
      this.listStoreItemsByType(); // 刷新根据商品类型获取门店下的商品列表
    }
  }
};
</script>
