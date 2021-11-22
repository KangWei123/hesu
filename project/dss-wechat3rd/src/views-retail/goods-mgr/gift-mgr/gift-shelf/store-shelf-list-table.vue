<template>
  <div v-loading="loading">
    <div class="patch-shelves-content">
      <div class="patch-shelves-box"
           v-if="goodsDetail">
        <div class="goods-desc-box">
          <div class="goods-img">
            <img :src="goodsDetail.materialUrls[0]" />
          </div>
          <div class="goods-desc">
            <div>{{ goodsDetail.name}}</div>
          </div>
        </div>
      </div>

      <div class="query-condition">
        <div class="condition-left">
          <span>上下架状态：</span>
          <el-select v-model="isShelf"
                     size="mini"
                     placeholder="全部状态"
                     @change="filterWithShelfStatus">
            <el-option label="请选择"
                       :value="null"></el-option>
            <el-option label="上架"
                       :value="1"></el-option>
            <el-option label="下架"
                       :value="0"></el-option>
          </el-select>
          <el-button @click="showStoreCity"
                     style="margin-left: 15px;">选择门店区域</el-button>
        </div>
        <div class="condition-right"
             v-if="selectedCityStr">
          <span class="area-shlef">门店区域：</span>
          <span class="area-city">{{selectedCityStr}}</span>
        </div>
      </div>

       <div style="margin-top: 15px" class="operat-box">
          <el-button @click="handleSelectAll">{{isClickAll ? '取消全选' : '一键全选'}}</el-button>
          <el-button :disabled="computeDisableButton"
                     @click="onToggleShelf(multipleSelection, false, true)">批量上架</el-button>
          <el-button :disabled="computeDisableButton"
                     @click="onToggleShelf(multipleSelection, true, true)">批量下架</el-button>
      </div>

      <div class="store-list-box">
        <el-table ref="multipleTable"
                  :data="storeList"
                  tooltip-effect="dark"
                  :default-sort="{prop: 'isShelf', order: 'descending'}"
                  @sort-change="onShelfSortChange"
                  @selection-change="handleSelectionChange"
                  class="wkt-table">

          <el-table-column type="selection"
                           width="70">
          </el-table-column>

          <el-table-column label="门店名称">
            <span slot-scope="scope"
                  :title="scope.row.name">
              {{scope.row.storeName}}
            </span>
          </el-table-column>

          <el-table-column label="地址">
            <span slot-scope="scope"
                  :title="scope.row.address">
              {{scope.row.storeAddress}}
            </span>
          </el-table-column>

          <el-table-column min-width="175"
                           label="上下架"
                           sortable="custom"
                           prop="giftShelf">
            <template slot-scope="scope">
              <div class="goods-shlef"
                   v-if="scope.row.giftShelf">
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
              </div>
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



        <!-- <el-pagination v-if="totalStoreCount"
                       layout="prev, pager, next, jumper, sizes, total"
                       :total="totalStoreCount"
                       :page-size="pageParams.pageSize"
                       :current-page="pageParams.pageNo"
                       @size-change="onSizeChange"
                       @current-change="onPageChange"
                       class="wkt-pagination"></el-pagination> -->

        <el-pagination v-if="totalStoreCount"
                      :hide-on-single-page="true"
                      @size-change="onSizeChange"
                      @current-change="onPageChange"
                      :page-size="pageParams.pageSize"
                      layout="sizes, prev, pager, next"
                      :total="totalStoreCount">
        </el-pagination>
      </div>
    </div>

    <!-- 选择门店区域对话弹框 -->
    <city-select-dialog v-model="showCitySelectDialog"
                        :selected-areas="selectedCity"
                        @choosed="onAreasChoosed"></city-select-dialog>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import constants from '@/dss-wechat3rd/src/constants/index';
import services from '@/dss-common/utils/services';
import giftApi from '@/dss-wechat3rd/src/api/gift.js';
import PlaceHolder from '@/dss-common/components/placeholder/index';
import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
import CitySelectDialog from '@/dss-wechat3rd/src/bz_components/city-select-dialog/index.vue';
import moneyUtil from '@/dss-common/utils/money';

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
    CitySelectDialog
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
      giftNo: null,
      goodsTypeValue: null,
      goodsDetail: null,
      totalStoreCount: 0,
      isShelf: null,
      sortOrder: 'descending',
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

      isClickAll: false
    };
  },
  computed: {
    ...mapState({
      curApp: 'curApp'
    }),

    // 判断是否禁止底部批量操作按钮
    computeDisableButton() {
      if (
        this.multipleSelection.length > 0 || // 当前页选中操作的数据数组长度大于0
        this.mTotalCheckedList.length > 0 // 所有被选中的列表list长度大于0
      ) {
        return false;
      }
      return true;
    }
  },
  mounted() {
    this.giftNo = this.$route.query.giftNo;
    this.getGoodsDetail();
    this.getStoreList();
  },
  methods: {
    getGoodsDetail() {
      this.loading = true;
      const params = {
        giftNo: this.giftNo
      };
      giftApi
        .getGiftInfo(params)
        .done(res => {
          if (res.data) {
            this.goodsDetail = res.data;
          }
        })
        .always(() => {
          this.loading = false;
        });
    },
    getStoreList() {
      this.mUpdateTotalListBySelection(this.storeList, this.multipleSelection, unionKeys);
      this.loading = true;
      const params = {
        ...this.pageParams,
        giftNo: this.giftNo,
        isShelf: this.isShelf,
        sortType: this.sortOrder,
        storeIdList: this.storeIdList
      };
      giftApi
        .query_store(params)
        .then(res => {
          this.totalStoreCount = res.totalCount;
          this.storeList = res.data || [];

          this.mBuildMultipleTableSelection(this.storeList, 'multipleTable', unionKeys);
        })
        .always(() => {
          this.loading = false;
        });
    },
    getAllStoreList() {
      this.mUpdateTotalListBySelection(this.storeList, this.multipleSelection, unionKeys);

      if (this.isClickAll) {
        this.loading = true;
        const params = {
          type: this.type,
          giftNo: this.giftNo,
          isShelf: this.isShelf,
          sortType: this.sortOrder,
          sortField: 'shelf',
          storeIdList: this.storeIdList
        };
        giftApi
          .query_store(params)
          .then(res => {
            this.totalStoreCount = res.totalCount;
            // 所有数据赋值给选中的值
            this.multipleSelection = res.data || [];
            this.mBuildMultipleTableSelection(this.storeList, 'multipleTable', unionKeys);
            this.mUpdateTotalListBySelection(this.storeList, this.multipleSelection, unionKeys);
          })
          .always(() => {
            this.loading = false;
          });
      } else {
        // 清空之前所有的选中状态
        this.mResetCheckedData();
        this.multipleSelection = [];
        // 重新刷新数据
        this.mBuildMultipleTableSelection(this.storeList, 'multipleTable', this.unionKeys);
        this.mUpdateTotalListBySelection(this.storeList, this.multipleSelection, this.unionKeys);
      }
    },
    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.getStoreList();
    },
    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.getStoreList();
    },

    filterWithShelfStatus() {
      this.pageParams.pageNo = 1;
      this.getStoreList();
    },

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
      this.getStoreList();
    },

    showStoreCity() {
      this.showCitySelectDialog = true;
    },

    onShelfSortChange(sort) {
      if (sort.order === 'ascending') {
        this.sortOrder = 'desc';
      } else if (sort.order === 'descending') {
        this.sortOrder = 'asc';
      }
      this.getStoreList();
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
        giftNo: this.goodsDetail.giftNo
      };
      giftApi
        .store_gift_unify(shelfParams)
        .done(res => {
          this.mResetCheckedData();
          this.multipleSelection = [];
          this.mUpdateTotalListBySelection(this.storeList, this.multipleSelection, unionKeys);
          this.isClickAll = false;
          this.getStoreList();
        })
        .always(() => {
          this.loading = false;
        });
    },

    handleSelectAll() {
      this.isClickAll = !this.isClickAll;
      this.getAllStoreList();
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
      //全部选中时，全选按钮才选中
      this.allSelected = this.multipleSelection.length === this.storeList.length;
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
      this.mResetCheckedData();
      this.multipleSelection = [];
      this.mUpdateTotalListBySelection(this.storeList, this.multipleSelection, unionKeys);
      this.getStoreList(); // 刷新当前页面门店列表
    }
  }
};
</script>

<style lang="less" scoped>

// .patch-shelves-content {
//   // padding: 0 20px 20px;

//   .goods-shlef {
//     .btn-state {
//       background: rgba(63, 202, 163, 0.33);
//       border-radius: 14px;
//       border: 1px solid rgba(58, 181, 147, 1);
//       color: #3ab593;
//       width: 78px;
//       padding: 0 10px;
//       animation: rotate-x 0.4s;
//     }
//   }

//   .goods-lower {
//     .btn-state {
//       background: rgba(48, 52, 59, 0.15);
//       border-radius: 14px;
//       border: 1px solid rgba(153, 153, 153, 1);
//       color: rgba(129, 129, 129, 1);
//       width: 78px;
//       padding: 0 10px;
//       animation: rotate-x 0.4s;
//     }
//   }

//   .goods-lower .goods-line,
//   .goods-shlef .goods-line {
//     border-left: 1px solid rgba(186, 198, 211, 1);
//     height: 26px;
//     display: inline-block;
//     margin: -8px 10px;
//   }

//   .goods-attribute {
//     height: 30px;
//     line-height: 30px;
//     margin: 0px 0px 10px 0px;
//     padding: 0px;
//     overflow: hidden;
//     text-overflow: ellipsis;
//     white-space: nowrap;
//   }
//   .goods-attribute:last-child {
//     margin-bottom: 0px;
//   }

//   .input-price {
//     margin-bottom: 10px;
//   }
//   .input-price:last-child {
//     margin-bottom: 0px;
//   }

//   .patch-shelves-box {
//     margin-top: 20px;
//   }

//   .query-condition {
//     display: flex;
//     margin-top: 20px;

//     .condition-right {
//       flex: 1;
//       display: flex;
//       margin-left: 15px;
//       margin-top: 5px;
//     }

//     .area-city {
//       flex: 1;
//     }
//   }

//   .goods-desc-box {
//     white-space: nowrap;
//   }

//   .goods-img {
//     display: inline-block;

//     img {
//       width: 96px;
//       height: 96px;
//     }
//   }

//   .goods-desc {
//     display: inline-block;
//     vertical-align: top;
//     font-size: 12px;
//     margin-left: 20px;
//     width: 60%;
//     white-space: normal;
//     word-break: break-all;

//     .price {
//       color: rgba(255, 86, 45, 1);
//       margin-top: 40px;
//     }
//   }
// }
</style>
