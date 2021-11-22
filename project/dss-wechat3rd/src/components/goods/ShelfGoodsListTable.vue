<template>
  <div class="goods-list-container shelf-container">
    <div class="Add-Manage-Button">
      <el-button type="primary" v-if="goodsType.type === goodsTypeTab.card.type" @click="onAddCard(goodsType.type)"
        >添加{{ goodsType.label }}</el-button
      >

      <el-button type="primary" v-if="showBatch && goodsPrice" @click="handleBatchPrice">批量改价</el-button>
    </div>

    <goods-list-filter
      :show-label="false"
      show-status
      :goods-type="filterGoodsType"
      class="wkt-opt-label-container"
      @filter="onFilter"
    />

    <div style="background: #fff; margin-top: 15px; padding: 16px 16px 0">
      <el-popover
        placement="top-start"
        width="200"
        trigger="hover"
        v-if="!goodsShelf"
        :content="scopeMenuEnum.disabledBtnTip"
      >
        <el-button slot="reference">批量上架</el-button>
      </el-popover>
      <el-button v-else :disabled="computeDisableShelfButton" @click="onToggleShelf(multipleSelection, false, true)"
        >批量上架</el-button
      >
      <el-popover
        placement="top-start"
        width="200"
        trigger="hover"
        v-if="!goodsShelf"
        :content="scopeMenuEnum.disabledBtnTip"
      >
        <el-button slot="reference">批量下架</el-button>
      </el-popover>
      <el-button v-else :disabled="computeDisableShelfButton" @click="onToggleShelf(multipleSelection, true, true)"
        >批量下架</el-button
      >
    </div>

    <div class="goods-list wkb-table-border">
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
              <div class="goods-img" v-if="scope.row.style == null">
                <img :src="scope.row.thumbnail || scope.row.styleUrl" />
              </div>
              <div class="goods-img" v-else>
                <img
                  v-if="scope.row.style === cardEnum.cardStyle.custom"
                  :src="scope.row.thumbnail || scope.row.styleUrl"
                />
                <img v-else :src="scope.row.type === cardEnum.cardType.timesCard ? timeCardBg : chargeCardBg" />
              </div>
              <div class="goods-desc">
                <div>{{ scope.row.name }}</div>
                <div class="price" v-if="goodsType.type === goodsTypeTab.estate.type">
                  均价：￥{{ scope.row.averagePrice | price }}/m<sup>2</sup>
                </div>
                <div class="price" v-if="goodsType.type === goodsTypeTab.estate.type">
                  认筹金：￥{{ scope.row.recognitionOfGold | price }}
                </div>

                <div class="price" v-if="goodsType.type !== goodsTypeTab.estate.type">
                  <!-- SKU 商品 -->

                  <template v-if="scope.row.salesType">
                    {{ scope.row.displayPrice || '到店咨询' }}
                  </template>

                  <template v-else-if="showPriceRange(scope.row)">
                    ￥{{ scope.row.storeMinSalePrice | price }} - {{ scope.row.storeMaxSalePrice | price }}
                    <!-- 显示积分 -->
                    <span v-if="scope.row.mode && (scope.row.storeMinIntegralPrice || scope.row.integralPrice)">
                      {{
                        scope.row.storeMinIntegralPrice
                          ? `+ ${scope.row.storeMinIntegralPrice}${
                              scope.row.storeMaxIntegralPrice &&
                              scope.row.storeMaxIntegralPrice > scope.row.storeMinIntegralPrice
                                ? `&nbsp;-&nbsp;${scope.row.storeMaxIntegralPrice}`
                                : ''
                            }`
                          : `+ ${scope.row.integralPrice}`
                      }}积分
                    </span>
                    <div class="app-price">
                      企业标价：￥{{ scope.row.appMinSalePrice | price }} - {{ scope.row.appMaxSalePrice | price }}
                    </div>
                  </template>

                  <template v-else-if="typeof scope.row.storeMinSalePrice === 'number'">
                    ￥{{ scope.row.storeMinSalePrice | price }}
                    <!-- 显示积分 -->
                    <span v-if="scope.row.mode && (scope.row.storeMinIntegralPrice || scope.row.integralPrice)">
                      {{
                        scope.row.storeMinIntegralPrice
                          ? `+ ${scope.row.storeMinIntegralPrice}${
                              scope.row.storeMaxIntegralPrice &&
                              scope.row.storeMaxIntegralPrice > scope.row.storeMinIntegralPrice
                                ? `&nbsp;-&nbsp;${scope.row.storeMaxIntegralPrice}`
                                : ''
                            }`
                          : `+ ${scope.row.integralPrice}`
                      }}积分
                    </span>
                    <div class="app-price">企业标价：￥{{ scope.row.appMinSalePrice | price }}</div>
                  </template>

                  <template v-else> ￥{{ scope.row.salePrice | price }} </template>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="goodsType.label + '分类'" v-if="showCategory" min-width="120">
          <span slot-scope="scope">{{ computeCategory(scope.row) }}</span>
        </el-table-column>
        <el-table-column :label="goodsType.label + '类型'" v-if="showIntegral && goodsType.value === 1" min-width="120">
          <span slot-scope="scope">{{ scope.row.mode === 1 ? '积分商品' : '普通商品' }}</span>
        </el-table-column>
        <el-table-column label="有效期" v-if="goodsType.type === goodsTypeTab.card.type">
          <span slot-scope="scope">{{ computeValidity(scope.row) }}</span>
        </el-table-column>

        <el-table-column min-width="140" label="上下架">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isShelf"
              :active-value="1"
              :inactive-value="0"
              active-text="上架"
              inactive-text="下架"
              active-color="#52C41A"
              inactive-color="#B1B5BD"
              @change="onToggleSwitch($event, [scope.row])"
            />
          </template>
        </el-table-column>

        <el-table-column prop="unit" label="单位" v-if="goodsType.type !== goodsTypeTab.rooms.type && !goodsTypeTab">
        </el-table-column>

        <el-table-column label="排序" min-width="160" prop="sort">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              v-if="!goodEdit"
              :content="scopeMenuEnum.disabledBtnTip"
            >
              <el-input-number
                disabled
                slot="reference"
                class="goods-order"
                v-model="scope.row.itemOrder"
                size="small"
                :controls="false"
              ></el-input-number>
            </el-popover>
            <el-input-number
              v-else
              class="goods-order"
              v-model="scope.row.itemOrder"
              size="small"
              :controls="false"
              @change="updateSort(scope.row.itemNo, scope.row.itemOrder)"
            ></el-input-number>
          </template>
        </el-table-column>

        <el-table-column
          prop="itemStock"
          width="120"
          v-if="goodsType.type === goodsTypeTab.product.type"
          label="可用库存"
        >
        </el-table-column>
        <el-table-column
          prop="hotelAmount"
          width="100"
          v-if="goodsType.type === goodsTypeTab.rooms.type"
          label="客房数量"
        >
        </el-table-column>
        <el-table-column label="总销量" width="120" v-if="showSaleCount">
          <span slot-scope="scope">{{ computeSalesVolume(scope.row) }}</span>
        </el-table-column>

        <el-table-column label="操作" v-if="showDetail" width="162">
          <template slot-scope="scope">
            <div style="display: inline-block">
              <el-popover
                v-if="!scope.row.inActivity && !goodsPrice"
                placement="top-start"
                width="200"
                trigger="hover"
                :content="scopeMenuEnum.disabledBtnTip"
              >
                <a href="javascript:;" slot="reference">价格设置</a>
              </el-popover>
              <a
                href="javascript:;"
                v-if="!scope.row.inActivity && goodsPrice && !scope.row.salesType"
                @click="onOpenItemPriceUpdateDialog(scope.row)"
                >价格设置</a
              >
              <el-popover
                v-if="goodsType.type !== goodsTypeTab.card.type && !goodsShow"
                placement="top-start"
                width="200"
                trigger="hover"
                :content="scopeMenuEnum.disabledBtnTip"
              >
                <a style="color: #2e8dff" href="javascript:;" slot="reference">详情</a>
              </el-popover>
              <a
                style="color: #2e8dff"
                href="javascript:;"
                v-if="goodsType.type !== goodsTypeTab.card.type && goodsShow"
                @click="gotoGoodsDetail(scope.row.itemNo)"
                >详情</a
              >
              <a
                href="javascript:;"
                v-if="goodsType.type === goodsTypeTab.card.type"
                @click="$router.push({ path: '/beauty/goods-mgr/goods/card/add', query: { itemNo: scope.row.itemNo } })"
                >编辑</a
              >
            </div>
            <Qrcode
              v-if="goodsType.type === goodsTypeTab.card.type"
              :goods-type="goodsType.type"
              :item-no="scope.row.itemNo"
            ></Qrcode>
          </template>
        </el-table-column>
        <!--修改无数据时的展示-->
        <template slot="empty">
          <place-holder></place-holder>
        </template>
      </el-table>

      <el-pagination
        v-if="totalGoodsCount"
        :hide-on-single-page="true"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        :page-size="pageParams.pageSize"
        layout="sizes, prev, pager, next"
        :total="totalGoodsCount"
      >
      </el-pagination>
    </div>

    <!-- 修改商品价格对话弹框组件 -->
    <itemPriceUpdateDialog
      v-if="updateItemNo"
      :item-no="updateItemNo"
      update-type="oneStore"
      :sale-price-check="goodsType.type === goodsTypeTab.product.type"
      :is-forbid-modify-label-price="!!isForbidModifyLabelPrice"
      :is-forbid-modify-sales-price="!!isForbidModifySalesPrice"
      @unLoading="unLoading"
      @onCloseDialog="onCloseItemPriceUpdateDialog"
      @onRefresh="onRefresh"
    ></itemPriceUpdateDialog>

    <!-- 批量修改商品价格对话弹框组件 -->
    <batch-item-price-update-dialog
      v-if="showBatchDialog"
      update-type="oneStore"
      :sale-price-check="goodsType.type === goodsTypeTab.product.type"
      :is-forbid-modify-label-price="!!isForbidModifyLabelPrice"
      :is-forbid-modify-sales-price="!!isForbidModifySalesPrice"
      :item-no-str-list="itemNoStrList"
      :store-id="curStoreId"
      @unLoading="unLoading"
      @onCloseDialog="onCloseBatchPriceUpdateDialog"
      @onRefresh="onRefresh"
    ></batch-item-price-update-dialog>

    <!-- 详情抽屉 -->

    <el-drawer title="商品详情" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
      <goods-detail-form
        :drawer-item-no="drawerItemNo"
        :goods-type="goodsTypeDrawer"
        @CloseDrawer="handleClose"
        page-type="detail"
      />
    </el-drawer>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import './css/CommonGoodsListTable.less';
  import moneyUtil from '@/dss-common/utils/money';
  import services from '@/dss-common/utils/services';
  import constants from '@/dss-wechat3rd/src/constants/index';
  import cardEnum from '@/dss-wechat3rd/src/constants/cardEnum';
  import PlaceHolder from '@/dss-common/components/placeholder/index';
  import GoodsListFilter from './GoodsListFilter';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import mgrTypeEnum from '@/dss-wechat3rd/src/constants/mgrTypeEnum';

  import timeCardBg from '@/dss-wechat3rd/src/images/goods/time-card-bg.png';
  import chargeCardBg from '@/dss-wechat3rd/src/images/goods/charge-card-bg.png';
  import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper';
  import itemPriceUpdateDialog from '@/dss-wechat3rd/src/bz_components/item-price-update-dialog/index';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  import BatchItemPriceUpdateDialog from './batch-price-dialog';

  // 抽屉详情
  import GoodsDetailForm from '@/dss-wechat3rd/src/components/goods/GoodsDetailForm';
  import Qrcode from '@/dss-wechat3rd/src/components/qrcode';

  const unionKeys = ['itemNo'];
  /**
   * 管理商品的商品列表
   */
  export default {
    name: 'GoodsList',
    mixins: [tableCheckedHelperMixin],
    components: {
      PlaceHolder,
      GoodsListFilter,
      itemPriceUpdateDialog,
      BatchItemPriceUpdateDialog,
      GoodsDetailForm,
      Qrcode,
    },

    //  model: {
    //    prop: 'goodsList'
    //  },
    props: {
      goodsType: {
        type: Object,
        default: function () {
          return null;
        },
      },
      // 产品详情前缀
      productDetailPrefix: {
        type: String,
        default: '',
      },
      // 是否显示分类
      showCategory: {
        type: Boolean,
        default: true,
      },
      // 是否显示类型
      showIntegral: {
        type: Boolean,
        default: true,
      },
      // 是否显示销量
      showSaleCount: {
        type: Boolean,
        default: true,
      },
      // 是否显示详情按钮
      showDetail: {
        type: Boolean,
        default: true,
      },
      // 是否显示批量设置价格
      showBatch: {
        type: Boolean,
        default: false,
      },
      goodsShow: {
        type: Boolean,
        default: true,
      },
      goodsShelf: {
        type: Boolean,
        default: true,
      },
      goodsPrice: {
        type: Boolean,
        default: true,
      },
      goodEdit: {
        type: Boolean,
        default: true,
      },
    },

    filters: {
      toPageUnit(val) {
        return moneyUtil.convertHundredMoneyUnit(val, true);
      },
    },

    data() {
      return {
        scopeMenuEnum,
        goodsList: [],
        cardEnum,
        loading: false,
        checked: false,
        goodsTypeTab: goodsTypeEnum,
        totalGoodsCount: 0,
        pageParams: {
          pageSize: 10, // 每页条数
          pageNo: 1, // 页数
        },
        queryParams: {
          type: this.goodsType.type === goodsTypeEnum.card.type ? null : this.goodsType.value,
          status: 1,
        },
        multipleSelection: [],
        timeCardBg: timeCardBg,
        chargeCardBg: chargeCardBg,

        // 修改商品价格对话弹框组件参数
        updateItemNo: null,

        showBatchDialog: false,
        itemNoStrList: null,

        // 抽屉详情展示
        goodsTypeDrawer: goodsTypeEnum.product,
        drawer: false,
        direction: 'rtl',
        drawerItemNo: '',
      };
    },

    computed: {
      ...mapState({
        curApp: 'curApp',
        roleList: 'roleList',
        curStore: 'curStore',
      }),

      // 查询条件过滤器的商品类型，因为组合商品获取分类的时候用的产品类型也是普通产品的类型
      filterGoodsType() {
        if (this.goodsType === goodsTypeEnum.combinationItem) {
          return goodsTypeEnum.product;
        }
        return this.goodsType;
      },

      isCanModifyStore() {
        return item => {
          if (this.curApp) {
            return (!!this.curApp.canModifyStore || 0) && (!item.inActivity || 0);
          }
          return false;
        };
      },

      // 通用配置-是否禁止门店编辑标价
      isForbidModifyLabelPrice() {
        if (this.curApp) {
          return (!!this.curApp.canModifyStore || 0) && (!!this.curApp.forbidModifyLabelPrice || 0);
        }
        return false;
      },

      // 通用配置-是否禁止门店编辑标价
      isForbidModifySalesPrice() {
        if (this.curApp) {
          return (!!this.curApp.canModifyStore || 0) && (!!this.curApp.forbidModifySalesPrice || 0);
        }
        return false;
      },

      isManager() {
        return !!~this.roleList.split(',').indexOf('common_role_enterprise');
      },

      curStoreId() {
        return (this.curStore && this.curStore.id) || null;
      },

      // 判断是否禁止底部批量操作按钮
      computeDisableShelfButton() {
        if (
          this.multipleSelection.length > 0 || // 当前页选中操作的数据数组长度大于0
          this.mTotalCheckedList.length > 0 // 所有被选中的列表list长度大于0
        ) {
          return false;
        }
        return true;
      },

      computeCategory() {
        return function (item) {
          if (item.categoryDTO) {
            return item.categoryDTO ? item.categoryDTO.category : null;
          } else if (item.type === mgrTypeEnum.hotel.value) {
            return !item.hotelType ? mgrTypeEnum.hotel.oddDay.label : mgrTypeEnum.hotel.combo.label;
          } else if (item.type === mgrTypeEnum.ticket.value) {
            return !item.ticketType ? mgrTypeEnum.ticket.oddDay.label : mgrTypeEnum.ticket.combo.label;
          } else if (item.typeDesc) {
            return item.typeDesc;
          } else {
            return null;
          }
        };
      },

      computeValidity() {
        return function (item) {
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
        return function (item) {
          if (
            item.type === goodsTypeEnum.product.value ||
            item.type === goodsTypeEnum.server.value ||
            item.type === goodsTypeEnum.rooms.value ||
            item.type === goodsTypeEnum.ticket.value
          ) {
            return item.itemSalesVolume;
          } else {
            return item.cardSalesVolume;
          }
        };
      },
    },

    mounted() {
      if (this.goodsType.type === goodsTypeEnum.rooms.value) {
        this.listStoreItemsByType();
      }
    },

    methods: {
      handleClose(done) {
        this.drawer = false;
      },
      /**
       * 根据商品类型获取门店下的商品列表,分页
       * @param goodsType 商品类型
       */
      listStoreItemsByType(emitInput) {
        this.mUpdateTotalListBySelection(this.goodsList, this.multipleSelection, unionKeys);
        this.loading = true;
        const params = { ...this.pageParams, ...this.queryParams };
        params.type = this.goodsType.value;

        const url =
          this.goodsType.type === goodsTypeEnum.card.type
            ? constants.Api.card.list
            : constants.Api.store.queryStoreItems;
        services
          .get(url, {
            params,
            action: '商品列表',
          })
          .done(res => {
            this.totalGoodsCount = res.totalCount;
            this.goodsList = res.data || [];
            if (emitInput) {
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
          // 当前页操作选中状态时，需要重新计算一次选中的item。
          this.mUpdateTotalListBySelection(this.goodsList, this.multipleSelection, unionKeys);
          itemList = this.mTotalCheckedList;
        }
        this.loading = true;
        const itemNoList = [];
        const preSellItemNoList = [];
        itemList.forEach(item => {
          itemNoList.push(item.itemNo);
          if (item.preSell) {
            preSellItemNoList.push(item.itemNo);
          }
        });

        const shelfParams = {
          shelf: isNowShelf ? 0 : 1,
          itemNo: itemNoList.toString(),
        };
        if (preSellItemNoList.length) {
          shelfParams.preSellItemNo = preSellItemNoList.toString();
        }

        const url =
          this.goodsType.type === goodsTypeEnum.card.type ? constants.Api.card.shelf : constants.Api.store.shelf;
        services
          .post(url, shelfParams, {
            action: '上下架',
          })
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
       * @param itemNo
       * @param itemOrder
       */
      updateSort(itemNo, itemOrder) {
        const positiveInteger = /^([0-9]*)$/; // 正整数
        if (!positiveInteger.test(itemOrder) || itemOrder > 999) {
          this.$message.error('请输入0到999之间的正整数');
          return false;
        }
        const params = {
          itemNo: itemNo,
          order: itemOrder,
        };
        const url =
          this.goodsType.type === goodsTypeEnum.card.type
            ? constants.Api.card.updateSort
            : constants.Api.store.updateSort;
        services
          .post(url, params, {
            action: '更新商品上下架排序',
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
      gotoGoodsDetail(itemNo) {
        // this.drawerItemNo = itemNo;
        // this.drawer = true;
        // console.log(this.productDetailPrefix,"this.productDetailPrefix>>>>>>","========================",this.goodsType.type)
        //
        this.$router.push({
          path: this.productDetailPrefix
            ? this.productDetailPrefix
            : `/beauty/goods-mgr/shelf/${this.goodsType.type}/detail`,
          query: { itemNo: itemNo },
        });
      },

      /**
       * 打开价格设置对话弹框
       */
      onOpenItemPriceUpdateDialog(item) {
        this.updateItemNo = item.itemNo; // 赋值要改变的商品单号，则自动加载修改商品价格对话弹框
        this.loading = true;
      },

      /**
       * 隐藏loading
       */
      unLoading() {
        this.loading = false;
      },

      /**
       * 关闭修改商品价格对话弹框
       */
      onCloseItemPriceUpdateDialog() {
        this.updateItemNo = null; // 清空要改变的商品单号，则自动关闭修改商品价格对话弹框
      },

      /**
       * 刷新数据
       */
      onRefresh() {
        this.listStoreItemsByType(); // 刷新根据商品类型获取门店下的商品列表
      },

      handleBatchPrice() {
        const list = [];
        (this.multipleSelection || []).forEach(item => {
          if (!item.inActivity && !item.salesType) list.push(item.itemNo);
        });

        if (!list.length) {
          this.$message.error('请选择可设置价格的商品');
          return;
        }
        this.itemNoStrList = list;
        this.loading = true;
        this.showBatchDialog = true;
      },

      onCloseBatchPriceUpdateDialog() {
        this.showBatchDialog = false;
      },

      // 是否为多规格商品
      isSku(item) {
        return typeof item.storeMinSalePrice === 'number' && typeof item.storeMaxSalePrice === 'number';
      },

      showPriceRange(item) {
        if (this.isSku(item)) {
          return item.storeMinSalePrice !== item.storeMaxSalePrice || item.appMinSalePrice !== item.appMaxSalePrice;
        }
        return false;
      },
    },
  };
</script>

<style lang="less" scoped>
  .goods-list-container {
    .goods-desc-box {
      display: flex;

      .goods-desc {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .price {
          word-break: keep-all;
          white-space: nowrap;

          .app-price {
            color: #999;
          }
        }
      }
    }
  }
</style>

<style lang="less">
  .shelf-container {
    .wkt-opt-label-container {
      padding-left: 6px;
    }
  }
</style>
