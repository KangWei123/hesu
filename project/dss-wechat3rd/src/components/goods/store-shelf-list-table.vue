<template>
  <div v-loading="loading">
    <div class="patch-shelves-content">
      <div class="patch-shelves-box"
           v-if="goodsDetail">
        <div class="goods-desc-box">
          <div class="goods-img">
            <img :src="goodsDetail.wxItem.thumbnail" />
          </div>
          <div class="goods-desc">
            <div>{{ goodsDetail.wxItem.name}}</div>
            <div class="price" v-if="!goodsDetail.wxItem.salesType">{{ goodsDetail.wxItem.salePrice | price | toPageUnit}}</div>
            <div class="price" v-else>{{ goodsDetail.wxItem.displayPrice || '到店咨询' }}</div>
          </div>
        </div>
      </div>

      <div class="query-condition">
        <div class="condition-left">
          <span>状态：</span>
          <el-select v-model="isShelf"
                     placeholder="全部状态"
                     @change="filterWithShelfStatus">
            <el-option label="请选择"
                       :value="null"></el-option>
            <el-option label="上架"
                       :value="1"></el-option>
            <el-option label="下架"
                       :value="0"></el-option>
          </el-select>

          <!-- <el-form-item label="门店名称："> -->
            <span style="margin-left:24px">门店名称：</span>
            <el-input
                class="search-ipt"
                placeholder="根据门店名称搜索"
                v-model.trim="storeKey"
                @input="searchStoreName('itemName', 15)"
              />
      <!-- </el-form-item> -->


         
          <el-button @click="showStoreCity" type="primary" plain
                     style="margin-left: 50px;">选择门店区域</el-button>
        </div>
        <div class="condition-right"
             v-if="selectedCityStr">
          <span class="area-shlef">门店区域：</span>
          <span class="area-city">{{selectedCityStr}}</span>
        </div>
      </div>

      <div style="padding-top: 15px" class="operat-box">
          <el-button 
                     @click="handleSelectAll">{{isClickAll ? '取消全选' : '全选'}}</el-button>
          <el-button :disabled="computeDisableButton"
                     @click="onToggleShelf(multipleSelection, false, true)">批量上架</el-button>
          <el-button :disabled="computeDisableButton"
                     @click="onToggleShelf(multipleSelection, true, true)">批量下架</el-button>
          <el-button :disabled="computeDisableButton || isBatchDisable"
                     v-if="isCanModifyStore"
                     @click="onBatchUpdatePrice(multipleSelection)">批量设置价格</el-button>
      </div>

      <div class="store-list-box wkb-table-border">
        <el-table ref="multipleTable"
                  :data="storeList"
                  tooltip-effect="dark"
                  :header-cell-style="{'text-align':'left'}"
                  :default-sort="{prop: 'isShelf', order: 'descending'}"
                  @sort-change="onShelfSortChange"
                  @selection-change="handleSelectionChange"
                  class="wkt-table">

          <el-table-column type="selection"
                           :selectable='isDisable'
                           width="70">
          </el-table-column>

          <el-table-column label="门店名称">
            <span slot-scope="scope"
                  :title="scope.row.name">
              {{scope.row.storeName}}
            </span>
          </el-table-column>

          <el-table-column min-width="175" label="地址">
            <span slot-scope="scope"
                  :title="scope.row.address">
              {{scope.row.storeAddress}}
            </span>
          </el-table-column>

          <el-table-column min-width="105"
                           label="上下架"
                           sortable="custom"
                           prop="isShelf">
            <template slot-scope="scope">
              <!-- <div class="goods-shlef"
                   v-if="scope.row.wxItem.isShelf">
                <el-button class="btn-state">已上架</el-button>
                <span class="goods-line"></span>
                <a href="javascript:;"
                   @click="onToggleShelf([scope.row], true)">下架</a>
              </div>
              <div class="goods-lower"
                   v-else>
                <el-button class="btn-state">已下架</el-button>
                <span class="goods-line"></span>
                <a href="javascript:;"
                   @click="onToggleShelf([scope.row], false)">上架</a>
              </div> -->
              <el-switch  v-model="scope.row.wxItem.isShelf"
                          :active-value="1"
                          :inactive-value="0"
                          active-text="上架"
                          inactive-text="下架"
                          active-color="#52C41A"
                          inactive-color="#B1B5BD"
                          @change="onToggleSwitch($event, [scope.row])" />
            </template>
          </el-table-column>

          <el-table-column label="规格"
                           min-width="175"
                           v-if="isCanModifyStore && goodsDetail && goodsDetail.skuInfoList && goodsDetail.skuInfoList.length > 0">
            <template slot-scope="scope">
              <div class="goods-attribute"
                   v-for="(item,index) in scope.row.skuInfoList"
                   :key="index">{{item.attribute}}</div>
            </template>
          </el-table-column>

          <el-table-column label="售价(元)"
                           min-width="150"
                           v-if="isCanModifyStore && !goodsDetail.wxItem.salesType">
            <template slot="header" v-if="isCanModifyStore && goodsDetail && (goodsDetail.wxItem.minItemPrice || goodsDetail.wxItem.maxItemPrice)">
              <div style="display: block; height: 20px; line-height: 20px;">售价(元)</div>
              <template>
                <div v-if="goodsDetail.wxItem.minItemPrice" style="display: block; font-size: 12px; height: 20px; line-height: 20px;">最低售价：{{goodsDetail.wxItem.minItemPrice | price | toPageUnit}}</div>
                <div v-if="goodsDetail.wxItem.maxItemPrice" style="display: block; font-size: 12px; height: 20px; line-height: 20px;">最高售价：{{goodsDetail.wxItem.maxItemPrice | price | toPageUnit}}</div>
              </template>
            </template>
            <template slot-scope="scope">
              <template v-if="goodsDetail && goodsDetail.skuInfoList && goodsDetail.skuInfoList.length > 0">
                <el-input v-for="(item,index) in scope.row.skuInfoList"
                          :key="index"
                          v-model="item.salePrice"
                          :disabled="!!scope.row.wxItem.inActivity || !!item.notOptional"
                          size="small"
                          class="input-price"
                          @change="value => onUpdatePrice({'value':value, 'storeId':scope.row.storeId,'item':scope.row})"></el-input>
              </template>

              <template v-else>
                <el-input v-model="scope.row.wxItem.salePrice"
                          :disabled="!!scope.row.wxItem.inActivity"
                          size="small"
                          class="input-price"
                          @change="value => onUpdatePrice({'value':value, 'storeId':scope.row.storeId,'item':scope.row})"></el-input>
              </template>
            </template>
          </el-table-column>

          <el-table-column label="标价(元)"
                           min-width="100"
                           v-if="isCanModifyStore && !goodsDetail.wxItem.salesType">
            <template slot-scope="scope">
              <template v-if="goodsDetail && goodsDetail.skuInfoList && goodsDetail.skuInfoList.length > 0">
                <el-input v-for="(item,index) in scope.row.skuInfoList"
                          :key="index"
                          v-model="item.labelPrice"
                          :disabled="!!scope.row.wxItem.inActivity || !!item.notOptional"
                          size="small"
                          class="input-price"
                          @change="value => onUpdatePrice({'value':value, 'storeId':scope.row.storeId,'item':scope.row})"></el-input>
              </template>

              <template v-else>
                <el-input v-model="scope.row.wxItem.labelPrice"
                          :disabled="!!scope.row.wxItem.inActivity"
                          size="small"
                          class="input-price"
                          @change="value => onUpdatePrice({'value':value, 'storeId':scope.row.storeId,'item':scope.row})"></el-input>
              </template>
            </template>
          </el-table-column>

          <el-table-column label="店长/联系方式">
            <div slot-scope="scope">
              <div>{{scope.row.storeOwnerName || '无'}}</div>
              <div>{{scope.row.storeOwnerTel || '无'}}</div>
            </div>
          </el-table-column>

          <!--修改无数据时的展示-->
          <template slot="empty">
            <place-holder></place-holder>
          </template>
        </el-table>

        

        <el-pagination v-if="totalStoreCount"
                       layout="sizes, prev, pager, next"
                       :total="totalStoreCount"
                       :hide-on-single-page="true"
                       :page-size="pageParams.pageSize"
                       :current-page="pageParams.pageNo"
                       @size-change="onSizeChange"
                       @current-change="onPageChange"
                       class="wkt-pagination"></el-pagination>
      </div>
    </div>

    <!-- 选择门店区域对话弹框 -->
    <city-select-dialog v-model="showCitySelectDialog"
                        :selected-areas="selectedCity"
                        @choosed="onAreasChoosed"></city-select-dialog>

    <!-- 修改商品价格对话弹框组件 -->
    <itemPriceUpdateDialog v-if="updateItemNo"
                           :item-no="updateItemNo"
                           :store-id-list="updateStoreIdList"
                           update-type="moreStore"
                           :sale-price-check="true"
                           @unLoading="unLoading"
                           @onCloseDialog="onCloseItemPriceUpdateDialog"
                           @onRefresh="onRefresh"></itemPriceUpdateDialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import constants from '../../constants/index';
import services from '@/dss-common/utils/services';
import wechat3rdApi from '@/dss-wechat3rd/src/api/index.js';
import PlaceHolder from '@/dss-common/components/placeholder/index';
import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
import CitySelectDialog from '@/dss-wechat3rd/src/bz_components/city-select-dialog/index.vue';
import moneyUtil from '@/dss-common/utils/money';
import itemPriceUpdateDialog from '@/dss-wechat3rd/src/bz_components/item-price-update-dialog/index.vue';

import '@/dss-wechat3rd/src/components/goods/css/store-shelf-list.less';

const unionKeys = ['storeId'];

export default {
  props: {
    type: {
      type: [Number, String],
      default() {
        //默认为商品
        return 1;
      }
    }
  },
  mixins: [tableCheckedHelperMixin],
  components: {
    PlaceHolder,
    CitySelectDialog,
    itemPriceUpdateDialog
  },
  filters: {
    toPageUnit(val) {
      let money = val;
      return money ? '￥' + money : '免费';
    }
  },
  data() {
    return {
      loading: false,
      allSelected: false,
      itemNo: null,
      goodsTypeValue: null,
      goodsDetail: null,
      totalStoreCount: 0,
      isShelf: null,
      sortOrder: 'desc',
      storeList: null,
      pageParams: {
        pageSize: 10,
        pageNo: 1
      },
      multipleSelection: [],
      storeIdList: null,
      selectedCity: [],
      selectedCityStr: '',
      showCitySelectDialog: false,

      // 修改商品价格对话弹框组件参数
      updateItemNo: null,
      updateStoreIdList: '',

      isClickAll: false,
      storeKey: '' //门店搜索关键词
    };
  },
  computed: {
    ...mapState({
      curStore: 'curStore',
      curApp: 'curApp'
    }),

    isCanModifyStore() {
      if (!!this.curApp && this.goodsDetail) {
        return !!this.curApp.canModifyStore || 0;
      }
      return false;
    },

    // 判断是否禁止底部批量操作按钮
    computeDisableButton() {
      if (
        this.multipleSelection.length > 0 || // 当前页选中操作的数据数组长度大于0
        this.mTotalCheckedList.length > 0 // 所有被选中的列表list长度大于0
      ) {
        return false;
      }
      return true;
    },

    isDisable() {
      return row => {
        if (row.wxItem.inActivity) {
          return false;
        }
        return true;
      };
    },

    isBatchDisable() {
      if (this.storeList && this.storeList.length) {
        let storeIdList = [];
        this.storeList.forEach((item, index) => {
          if (!item.wxItem.inActivity) {
            storeIdList.push(item.storeId);
          }
        });

        if (storeIdList && storeIdList.length) {
          return false;
        }
        return true;
      }
    }
  },
  mounted() {
    this.itemNo = this.$route.query.itemNo;
    this.getGoodsDetail(); // 获取商品详情
    this.getStoreList();
  },
  methods: {
    /**
     * 获取商品详情
     */
    getGoodsDetail() {
      this.loading = true;
      const params = {
        itemNo: this.itemNo
      };
      services
        .get(constants.Api.goods.detail, {
          params,
          action: '商品详情'
        })
        .done(res => {
          if (res.data) {
            this.goodsDetail = res.data;
          }
        })
        .always(() => {
          this.loading = false;
        });
    },

    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.getStoreList(); // 获取门店列表
    },
    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.getStoreList(); // 获取门店列表
    },

    /**
     * 改变上下架状态查询条件
     */
    filterWithShelfStatus() {
      this.getStoreList(); // 获取门店列表
    },

    searchStoreName() {
      this.getStoreList();
    },

    /**
     * 按门店上下架改变排序
     */
    onShelfSortChange(sort) {
      if (sort.order === 'ascending') {
        this.sortOrder = 'desc';
      } else if (sort.order === 'descending') {
        this.sortOrder = 'asc';
      }
      this.getStoreList(); // 获取门店列表
    },

    /**
     * 获取门店列表
     */
    getStoreList() {
      this.mUpdateTotalListBySelection(this.storeList, this.multipleSelection, unionKeys);
      this.loading = true;
      const params = {
        ...this.pageParams,
        type: this.type,
        itemNo: this.itemNo,
        isShelf: this.isShelf,
        sortType: this.sortOrder,
        sortField: 'shelf',
        storeIdList: this.storeIdList,
        storeName: this.storeKey,

        storeId: this.curStore && this.curStore.id
      };
      wechat3rdApi
        .queryStoreListByItemNo(params)
        .then(res => {
          this.totalStoreCount = res.totalCount;

          if (res.data) {
            // 循环判断当前门店是否含有sku信息，是则将sku信息用逗号隔开组合起来
            res.data.forEach(item => {
              let skuInfoList = item.skuInfoList || null;

              if (skuInfoList && skuInfoList.length > 0) {
                skuInfoList.forEach((sil, index) => {
                  const skuInfoNames = sil.skuInfoNames || null;
                  let attribute = '';

                  skuInfoNames.forEach((sin, idx) => {
                    if (idx < skuInfoNames.length - 1) {
                      attribute += sin.valName + '，';
                    } else {
                      attribute += sin.valName;
                    }
                  });

                  sil.attribute = attribute;
                  sil.salePrice = moneyUtil.convertHundredMoneyUnit(sil.salePrice, true);
                  sil.labelPrice = moneyUtil.convertHundredMoneyUnit(sil.labelPrice, true);
                });
              }

              item.wxItem.salePrice = moneyUtil.convertHundredMoneyUnit(item.wxItem.salePrice, true);
              item.wxItem.labelPrice = moneyUtil.convertHundredMoneyUnit(item.wxItem.labelPrice, true);
              item.wxItem.minItemPrice =
                item.wxItem.minItemPrice !== '' && item.wxItem.minItemPrice !== null
                  ? moneyUtil.convertHundredMoneyUnit(item.wxItem.minItemPrice, true)
                  : null;
              item.wxItem.maxItemPrice =
                item.wxItem.maxItemPrice !== '' && item.wxItem.maxItemPrice !== null
                  ? moneyUtil.convertHundredMoneyUnit(item.wxItem.maxItemPrice, true)
                  : null;
            });
          }
          this.storeList = res.data || [];

          this.mBuildMultipleTableSelection(this.storeList, 'multipleTable', unionKeys);
        })
        .always(() => {
          this.loading = false;
        });
    },

    /**
     * 一键全选或取消全选
     * 注：一键全选时需要获取所有门店数据
     */
    handleSelectAll() {
      this.isClickAll = !this.isClickAll;
      this.mUpdateTotalListBySelection(this.storeList, this.multipleSelection, unionKeys);

      // 一键全选时需要获取所有门店数据
      if (this.isClickAll) {
        this.loading = true;
        const params = {
          type: this.type,
          itemNo: this.itemNo,
          isShelf: this.isShelf,
          sortType: this.sortOrder,
          sortField: 'shelf',
          storeIdList: this.storeIdList
        };
        wechat3rdApi
          .queryStoreListByItemNo(params)
          .then(res => {
            this.totalStoreCount = res.totalCount;
            // 所有数据赋值给选中的值
            this.multipleSelection = res.data || [];
            this.mUpdateTotalListBySelection(this.storeList, this.multipleSelection, unionKeys);
            this.mBuildMultipleTableSelection(this.storeList, 'multipleTable', unionKeys);
          })
          .always(() => {
            this.loading = false;
          });
      } else {
        this.emptyMultipleSelection(); // 清空之前选中的操作数据列表，重新计算选中的item
        this.mBuildMultipleTableSelection(this.storeList, 'multipleTable', unionKeys); // 重新刷新数据
      }
    },

    /**
     * 显示选择门店区域对话弹框
     */
    showStoreCity() {
      this.showCitySelectDialog = true;
    },

    /**
     * 选择门店区域操作完成
     */
    onAreasChoosed(val) {
      if (val && val.length) {
        this.selectedCity = val;
        let storeIdList = [];
        let cityStr = '';

        this.selectedCity.forEach((item, index) => {
          storeIdList = storeIdList.concat(item.storeIdList);
          if (index < val.length - 1) {
            cityStr += item.regionName + '，';
          } else {
            cityStr += item.regionName;
          }
        });

        this.storeIdList = storeIdList;
        this.selectedCityStr = cityStr;
      } else {
        this.selectedCity = null;
        this.storeIdList = null;
        this.selectedCityStr = '';
      }
      this.pageParams.pageNo = 1;
      this.getStoreList(); // 获取门店列表
    },

    /**
     * 门店列表多选操作
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
      //全部选中时，全选按钮才选中
      this.allSelected = this.multipleSelection.length === this.storeList.length;
    },

    /**
     * 批量操作成功之后，清空之前选中的操作数据列表
     */
    emptyMultipleSelection() {
      // 清除之前已选中的状态，重新计算选中的item。
      this.multipleSelection = [];
      this.mResetCheckedData();
      this.mUpdateTotalListBySelection(this.storeList, this.multipleSelection, unionKeys);

      // 判断如果是全选状态，则取消全选
      if (this.isClickAll) {
        this.isClickAll = !this.isClickAll;
      }
    },

    onToggleSwitch(isNowShelf, item) {
      this.onToggleShelf(item, !isNowShelf);
    },

    /**
     * 批量上下架
     * @param storeList 门店列表
     * @param isNowShelf 上下架 true:上架;false:下架
     * @param isPatch 是否为批量操作
     */
    onToggleShelf(storeList, isNowShelf, isPatch = false) {
      if (isPatch) {
        //当前页操作选中状态时，需要重新计算一次选中的item。
        this.mUpdateTotalListBySelection(this.storeList, this.multipleSelection, unionKeys);
        storeList = this.mTotalCheckedList;
      }

      this.loading = true;
      const storeIdList = [];
      storeList.forEach(item => {
        storeIdList.push(item.storeId);
      });

      const shelfParams = {
        shelf: isNowShelf ? 0 : 1,
        storeIds: storeIdList.toString(),
        isPreSell: this.goodsDetail.wxItem.preSell || false,
        itemNo: this.goodsDetail.wxItem.itemNo
      };
      services
        .post(constants.Api.store.unifyShelf, shelfParams, {
          action: '配置门店上下架'
        })
        .done(res => {
          this.emptyMultipleSelection(); // 清空之前选中的操作数据列表，重新计算选中的item
          this.getStoreList(); // 刷新当前页面门店列表
        })
        .always(() => {
          this.loading = false;
        });
    },

    /**
     * 修改单门店单个价格
     */
    onUpdatePrice(paramsObj) {
      if (!paramsObj.value && paramsObj.value !== 0) {
        this.$message.error('请输入价格');
        return false;
      } else if (!/^\d{1,7}(\.\d{1,2})?$/.test(paramsObj.value)) {
        this.$message.error('价格必须是0至9999999.99之间的正整数或且小数点后保留两位的数字');
        return false;
      }

      let errorDesc = null; // 错误提示，用于判断是否有错误，以便给予提示以及阻止保存

      let item = this.$plain(paramsObj.item);
      if (item) {
        item.wxItem.minItemPrice =
          item.wxItem.minItemPrice !== '' && item.wxItem.minItemPrice !== null
            ? moneyUtil.convertHundredMoneyUnit(item.wxItem.minItemPrice, false)
            : null;
        item.wxItem.maxItemPrice =
          item.wxItem.maxItemPrice !== '' && item.wxItem.maxItemPrice !== null
            ? moneyUtil.convertHundredMoneyUnit(item.wxItem.maxItemPrice, false)
            : null;
        if (item.skuInfoList && item.skuInfoList.length > 0) {
          item.skuInfoList.forEach((sil, index) => {
            sil.salePrice = moneyUtil.convertHundredMoneyUnit(sil.salePrice, false);
            sil.labelPrice = moneyUtil.convertHundredMoneyUnit(sil.labelPrice, false);

            // 判断skuInfo中商品售价是否大于标价，以便给予错误提示
            if (sil.salePrice > sil.labelPrice) {
              errorDesc = '商品售价不能大于商品标价';
            }

            if (
              item.wxItem.minItemPrice &&
              item.wxItem.minItemPrice !== 0 &&
              item.wxItem.minItemPrice > sil.salePrice
            ) {
              errorDesc = '售价不能低于最低售价';
            }

            if (
              item.wxItem.maxItemPrice &&
              item.wxItem.maxItemPrice !== 0 &&
              item.wxItem.maxItemPrice < sil.salePrice
            ) {
              errorDesc = '售价不能高于最高售价';
            }
          });
        }

        item.wxItem.salePrice = moneyUtil.convertHundredMoneyUnit(item.wxItem.salePrice, false);
        item.wxItem.labelPrice = moneyUtil.convertHundredMoneyUnit(item.wxItem.labelPrice, false);

        // 判断商品售价是否大于标价，以便给予错误提示
        if (item.wxItem.salePrice > item.wxItem.labelPrice) {
          errorDesc = '商品售价不能大于商品标价';
        }

        if (
          item.wxItem.minItemPrice &&
          item.wxItem.minItemPrice !== 0 &&
          item.wxItem.minItemPrice > item.wxItem.salePrice
        ) {
          errorDesc = '售价不能低于最低售价';
        }

        if (
          item.wxItem.maxItemPrice &&
          item.wxItem.maxItemPrice !== 0 &&
          item.wxItem.maxItemPrice < item.wxItem.salePrice
        ) {
          errorDesc = '售价不能高于最高售价';
        }
      }

      // 判断是否有错误提示，阻止往下执行
      if (errorDesc) {
        this.$message.error(errorDesc);
        return false;
      }

      let params = item || {};
      params.storeIdList = [paramsObj.storeId];

      this.loading = true;
      services
        .post(constants.Api.store.updateItem, params, {
          headers: {
            'Content-Type': 'application/json'
          },
          transformRequest: function(data, config, test) {
            return JSON.stringify(data);
          },
          action: '更新商品价格'
        })
        .done(res => {
          this.$message.success('商品价格修改成功！');
        })
        .always(() => {
          this.loading = false;
          this.getStoreList(); // 刷新当前页面门店列表
        });
    },

    /**
     * 批量修改多门店价格
     */
    onBatchUpdatePrice(storeList) {
      // 设置修改的商品itemNo，显示修改多门店价格对话弹框
      this.updateItemNo = this.goodsDetail.wxItem.itemNo || null;

      //当前页操作选中状态时，需要重新计算一次选中的item。
      this.mUpdateTotalListBySelection(this.storeList, this.multipleSelection, unionKeys);
      storeList = this.mTotalCheckedList;

      if (storeList && storeList.length > 0) {
        let storeIdList = [];
        storeList.forEach((item, index) => {
          if (!item.wxItem.inActivity) {
            storeIdList.push(item.storeId);
          }
        });

        this.updateStoreIdList = storeIdList || [];
      }

      this.loading = true;
    },
    /**
     * 关闭修改商品价格对话弹框，隐藏loading
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
     * 修改商品价格之后，刷新门店列表数据
     */
    onRefresh() {
      this.emptyMultipleSelection(); // 清空之前选中的操作数据列表，重新计算选中的item
      this.getStoreList(); // 刷新当前页面门店列表
    }
  }
};
</script>

<style lang="less"></style>
