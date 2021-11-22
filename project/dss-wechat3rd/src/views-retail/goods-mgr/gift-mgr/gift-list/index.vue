<template>
  <div class="mgr-gift-list gift-other-list">

    <div class="Add-Manage-Button">
      <el-button v-if="scopeEditGift" type="primary" plain @click="giftBatch">同步赠品库</el-button>

      <template v-else>
        <el-popover placement="bottom" width="200" trigger="hover" :content="scopeMenuEnum.disabledBtnTip">
          <el-button slot="reference" type="primary" plain>同步赠品库</el-button>
        </el-popover>
      </template>

      <el-button v-if="scopeEditGift" type="primary" icon="el-icon-plus" @click="gotoMgrCreatePage">添加赠品</el-button>
      <template v-else>
        <el-popover placement="bottom" width="200" trigger="hover" :content="scopeMenuEnum.disabledBtnTip">
          <el-button slot="reference" type="primary" icon="el-icon-plus">添加赠品</el-button>
        </el-popover>
      </template>
    </div>

    <gift-filter class="wkt-opt-label-container" :goods-type="goodsTypeEnum.gift" @filter="onFilter" />

   

    <div class="mgr-list-content goods-list wkb-table-border">
       <!-- 底部操作按钮 -->
        <div style="padding-top: 16px;padding-left: 20px">
          <el-popover placement="top-start"
                      width="200"
                      trigger="hover"
                      v-if="!scopeShelfGift"
                      :content="scopeMenuEnum.disabledBtnTip">
            <el-button slot="reference">批量上架</el-button>
          </el-popover>
          <el-button v-else :disabled="disableBatchButton"
                    @click="handleBatch(multipleSelection, true)">批量上架</el-button>
          <el-popover placement="top-start"
                      width="200"
                      trigger="hover"
                      v-if="!scopeShelfGift"
                      :content="scopeMenuEnum.disabledBtnTip">
            <el-button slot="reference">批量下架</el-button>
          </el-popover>
          <el-button v-else :disabled="disableBatchButton"
                    @click="handleBatch(multipleSelection, false)">批量下架</el-button>
        </div>
      <el-table
        ref="multipleTable"
        :data="mgrList"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" v-if="mgrList && mgrList.length" width="70"> </el-table-column>
        <el-table-column label="赠品名称" min-width="200">
          <template slot-scope="scope">
            <div class="mgr-desc-box">
              <div class="mgr-img"><img :src="scope.row.thumbnail" /></div>
              <div class="mgr-desc">
                <div>
                  {{ scope.row.name }}
                  {{ scope.row.attrValCombineName ? '(' + scope.row.attrValCombineName + ')' : '' }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="营销属性">
          <span slot-scope="scope" class="ellipsis" :title="activityList(scope.row)">
            {{ activityList(scope.row) }}
          </span>
        </el-table-column>

        <el-table-column label="操作" width="205px">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              v-if="!scopeEditGift"
              :content="scopeMenuEnum.disabledBtnTip"
            >
              <a href="javascript:;" slot="reference" style="padding-left: 0;">编辑</a>
            </el-popover>
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              v-else-if="scope.row.inActivity && scope.row.inActivity > 0"
              content="该商品参加活动中，不允许编辑敏感信息!">
              <a href="javascript:;" slot="reference" @click="gotoMgrUpdatePage(scope.row)" style="padding-right: 12px;">编辑</a>
            </el-popover>
            <a v-else href="javascript:" @click="gotoMgrUpdatePage(scope.row)" style="padding-right: 12px;">编辑</a>
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              v-if="!scopeShelfGift"
              :content="scopeMenuEnum.disabledBtnTip">
              <a href="javascript:;" slot="reference" style="padding-left: 0px;">上下架</a>
            </el-popover>
            <a href="javascript:;" v-else @click="gotoMgrShelfPage(scope.row)" style="padding-left: 0px;">上下架</a>
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              v-if="!scopeEditGift"
              :content="scopeMenuEnum.disabledBtnTip">
              <a href="javascript:;" slot="reference" class="table-del-a"  style="padding-left: 0;">删除</a>
            </el-popover>
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              v-else-if="scope.row.inActivity && scope.row.inActivity > 0"
              content="该商品参加活动中，不允许删除!">
              <a href="javascript:;" slot="reference" class="table-del-a"  style="padding-left: 0;">删除</a>
            </el-popover>
            <a href="javascript:;" v-else @click="delGoods(scope.row)" class="table-del-a"  style="padding-left: 0;">删除</a>
          </template>
        </el-table-column>
        <!--修改无数据时的展示-->
        <template slot="empty">
          <place-holder></place-holder>
        </template>
      </el-table>

      
<!-- 
      <el-pagination
        layout="prev, pager, next, jumper, sizes, total"
        :total="totalGoodsCount"
        :page-size="pageParams.pageSize"
        :current-page="pageParams.pageNo"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      >
      </el-pagination> -->

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

    <!-- 选择门店弹框 -->
    <store-select-dialog
      :selected-stores="selectedStoresList"
      enable-multiple
      api-url="/wp/store/query/dept"
      :is-all="true"
      v-model="showStoreDialog"
      @choosed="onStoreChoosed"
    ></store-select-dialog>

    <!-- 选择商品对话弹框 -->
    <goods-select-dialog
      v-model="showDialog"
      choose-sku
      :extParams="{ syncGift: 1, notOptional: isHomeIndustryApp ? 0 : null }"
      enable-multiple
      @selected="onSelectGoods"
    />
  </div>
</template>

<script>
import '@/dss-wechat3rd/src/components/goods/css/CommonGoodsListTable.less';
import wpBaseApi from '@/business-common/wp-base-api.js';
import PlaceHolder from '@/dss-common/components/placeholder/index';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
import giftFilter from './gift-filter';
import GoodsSelectDialog from '@/dss-wechat3rd/src/bz_components/goods-select-dialog/index.vue';
import giftApi from '@/dss-wechat3rd/src/api/gift.js';
import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
import storeSelectDialog from '@/dss-wechat3rd/src/bz_components/store-select-dialog/index.vue';
import scopeMenuEnum from '@/business-common/scopeMenuEnum.js';
import { mapState } from 'vuex';

const unionKeys = ['giftNo'];
export default {
  name: 'mgr-list-table',
  mixins: [tableCheckedHelperMixin],
  components: {
    PlaceHolder,
    giftFilter,
    GoodsSelectDialog,
    storeSelectDialog
  },
  data() {
    return {
      scopeMenuEnum,
      goodsTypeEnum,
      loading: false,
      mgrList: [],
      // 商品类型
      type: null,
      totalGoodsCount: 0,
      pageParams: {
        pageSize: 10, //每页条数
        pageNo: 1 //页数
      },
      queryParams: {
        type: goodsTypeEnum.gift.value
      },
      showDialog: false,
      //管理员权限
      create_item: false,
      update_item: false,
      manage_label: false,

      scopeEditGift: true,
      scopeShelfGift: true,
      scopeListDetailGift: true,

      multipleSelection: [], // 当前页面选中维护的列表list
      showStoreDialog: false, // 是否显示选择门店弹框
      selectedStoresList: [], // 选中的门店列表
      toggleShelfObj: null // 切换上下架参数对象
    };
  },
  filters: {
    toPageUnit(val) {
      let money = val;
      return money ? '￥' + money / 100 : '免费';
    }
  },

  computed: {
    ...mapState({
      wkbScopeMenu: 'wkbScopeMenu',
      curApp: 'curApp'
    }),
    activityList() {
      return function(item) {
        const inActivity = item.inActivity ? '会员权益,' : '';
        if (inActivity) {
          const activityText = inActivity;
          return activityText.slice(0, activityText.length - 1);
        } else {
          return '无';
        }
      };
    },
    // 判断是否禁止底部批量操作按钮
    disableBatchButton() {
      if (
        this.multipleSelection.length > 0 || // 当前页选中操作的数据数组长度大于0
        this.mTotalCheckedList.length > 0 // 所有被选中的列表list长度大于0
      ) {
        return false;
      }
      return true;
    },
    isHomeIndustryApp() {
      return this.curApp && !!this.curApp.newSkuItem;
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
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getMgrList();
    });
  },
  // mounted() {
  //   this.queryUserManagement();
  // },
  methods: {
    warnAlert(msg) {
      this.$message({
        message: msg,
        type: 'warning'
      });
    },

    onSelectGoods(row) {
      let params = {};
      row.forEach((item, index) => {
        params['syncList[' + index + '].itemNo'] = item.itemNo;
        params['syncList[' + index + '].skuId'] = item.skuId;
      });
      giftApi
        .syncGift(params)
        .done(res => {
          this.getMgrList();
        })
        .always(() => {
          this.loading = false;
        });
    },

    // 获取用户是否为管理员
    queryUserManagement() {
      wpBaseApi
        .queryUserManagement()
        .then(res => {
          res.data.forEach(item => {
            if (item.name === 'create_item') {
              this.create_item = true;
            }
            if (item.name === 'update_item') {
              this.update_item = true;
            }
            if (item.name === 'manage_label') {
              this.manage_label = true;
            }
          });
        })
        .always(() => {});

      if (this.wkbScopeMenu) {
        const giftGoodsButton = scopeMenuEnum.dictionary.wkbChildMenu.wkbGoodsMgrMenu.giftGoodsButton;
        const scopeEditGoodsButton = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          giftGoodsButton.edit_gift
        );
        this.scopeEditGift = !!scopeEditGoodsButton && !!scopeEditGoodsButton.status;

        const scopeShelfGoodsButton = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          giftGoodsButton.shelf_gift
        );
        this.scopeShelfGift = !!scopeShelfGoodsButton && !!scopeShelfGoodsButton.status;

        const scopeListDetailGoodsButton = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          giftGoodsButton.gifts_list_detail
        );
        this.scopeListDetailGift = !!scopeListDetailGoodsButton && !!scopeListDetailGoodsButton.status;
      }
    },
    //获取商品列表
    getMgrList() {
      // 获取数据之前，需要重新计算一次选中的item
      this.mUpdateTotalListBySelection(this.mgrList, this.multipleSelection, unionKeys);
      this.loading = true;
      let params = { ...this.pageParams, ...this.queryParams };
      giftApi
        .getGiftList(params)
        .done(res => {
          this.mgrList = res.data || [];
          this.totalGoodsCount = res.totalCount;
          // 成功获取数据之后，重新构建pageList的选中状态
          this.mBuildMultipleTableSelection(this.mgrList, 'multipleTable', unionKeys);
        })
        .always(() => {
          this.loading = false;
        });
    },

    warnTip(msg) {
      this.$message({
        message: msg,
        type: 'warning'
      });
    },

    //删除商品
    delGoods(row) {
      this.$confirm('是否确认删除赠品? ', '删除赠品', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          if (row.inActivity) {
            return this.warnTip('该赠品参加营销活动中，不允许删除!');
          }
          let params = { giftNo: row.giftNo, barcode: row.barcode };
          giftApi
            .abandonGift(params)
            .done(res => {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getMgrList();
            })
            .always(() => {
              this.loading = false;
            });
        })
        .catch(() => {
          console.log('取消删除赠品');
        });
    },

    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.getMgrList();
    },
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.getMgrList();
    },

    giftBatch() {
      this.showDialog = true;
    },

    gotoMgrCreatePage() {
      this.$router.push({
        path: '/retail/goods-mgr/gift-mgr/list/edit',
        query: {}
      });
    },
    gotoMgrUpdatePage(item) {
      // if (!this.update_item) {
      //   this.warnAlert('请用管理员身份登录');
      // } else
      if (!item.status) {
        this.verifyConfirm('已上架商品不可编辑或删除，请下架后再操作', '不可操作');
      } else {
        let isDisabledEdit = item.inActivity;
        this.$router.push({
          path: '/retail/goods-mgr/gift-mgr/list/edit',
          query: {
            giftNo: item.giftNo,
            isDisabledEdit: item.inActivity && item.inActivity > 0 ? 1 : 0
          }
        });
      }
    },
    gotoMgrShelfPage(item) {
      // if (!this.update_item) {
      //   this.warnAlert('请用管理员身份登录');
      // } else {
      //   this.$router.push({
      //     path: '/retail/goods-mgr/gift-mgr/list/patch-shelves',
      //     query: { giftNo: item.giftNo }
      //   });
      // }
      this.$router.push({
        path: '/retail/goods-mgr/gift-mgr/list/patch-shelves',
        query: { giftNo: item.giftNo }
      });
    },
    verifyConfirm(content, title) {
      this.$confirm(content, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {})
        .catch(() => {});
    },
    onFilter(filter) {
      this.pageParams.pageNo = 1;
      this.queryParams = { ...this.queryParams, ...filter };
      this.getMgrList();
    },

    /**
     * 改变商品列表选项
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    /**
     * 批量操作成功之后，清空之前选中的操作数据列表
     */
    emptyMultipleSelection() {
      // 清除之前已选中的状态，重新计算选中的item。
      this.multipleSelection = [];
      this.mResetCheckedData();
      this.mUpdateTotalListBySelection(this.mgrList, this.multipleSelection, unionKeys);
    },

    /**
     * 批量操作
     * @param itemList 商品列表
     * @param isNowShelf 上下架 true：上架；false：下架
     */
    handleBatch(itemList, isNowShelf) {
      this.showStoreDialog = true; // 显示门店选择弹框

      // 赋值切换上下架参数
      this.toggleShelfObj = {
        itemList,
        isNowShelf
      };
    },

    /**
     * 完成门店选择
     */
    onStoreChoosed(storeList) {
      if (!storeList || storeList.length < 1) {
        this.$message.error('请选择上下架的门店');
        return;
      }

      this.selectedStoresList = storeList;
      this.batchToggleShelf(); // 批量上下架
    },

    /**
     * 批量上下架
     */
    batchToggleShelf() {
      // 每次批量操作时，主动触发一次计算全部选择的列表
      this.mUpdateTotalListBySelection(this.mgrList, this.multipleSelection, unionKeys);

      let itemList = this.toggleShelfObj.itemList || []; // 上下架的商品列表
      let isNowShelf = this.toggleShelfObj.isNowShelf; // 上下架状态

      // 批量操作时，将所有被选中的列表list数据：mTotalCheckedList作为全部选择的参数
      itemList = this.mTotalCheckedList;

      let giftNos = []; // 全部选中的商品giftNo集合
      let preSellItemNos = []; // 预售商品giftNo集合
      itemList.forEach(item => {
        giftNos.push(item.giftNo);
        if (item.preSell) {
          preSellItemNos.push(item.giftNo);
        }
      });

      let storeIds = []; // 选中的门店id集合
      this.selectedStoresList.forEach(item => {
        storeIds.push(item.id);
      });

      const shelfParams = {
        shelf: isNowShelf ? 1 : 0, // 上下架状态，上架：1，下架：0
        giftNos: giftNos.toString(), // 商品giftNo集合字符串
        storeIds: storeIds.toString() // 门店id集合字符串
      };
      if (preSellItemNos.length) {
        shelfParams.preSellItemNos = preSellItemNos.toString();
      }

      this.loading = true;
      giftApi
        .store_batch_gift_shelf(shelfParams)
        .done(res => {
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          this.emptyMultipleSelection(); // 批量操作成功之后，清空之前选中的操作数据列表
          this.getMgrList(); // 根据商品类型获取商品列表
        })
        .always(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less">
@import '~@/dss-common/style/wkt-constants.less';
@import './index.less';
</style>
