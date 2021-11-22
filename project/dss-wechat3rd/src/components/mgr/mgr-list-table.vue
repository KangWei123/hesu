<template>
  <div class="mgr-list-table">
    <div class="Add-Manage-Button">
      <el-button v-if="true" type="primary" icon="el-icon-plus" @click="gotoMgrCreatePage"
        >添加{{ mgrType.label }}
      </el-button>
      <template v-else>
        <el-popover placement="bottom" width="200" trigger="hover" content="请登录管理员账号使用此功能">
          <el-button slot="reference" icon="el-icon-plus" type="primary">添加{{ mgrType.label }}</el-button>
        </el-popover>
      </template>
    </div>
    <mgr-list-filter class="wkt-opt-label-container" :goods-type="mgrType.value" @filter="onFilter" />

    <div class="mgr-list-content wkb-table-border content-operation">
      <div class="handleBatch">
        <el-button :disabled="disableBatchButton" @click="handleBatch(multipleSelection, true)">批量上架</el-button>
        <el-button :disabled="disableBatchButton" @click="handleBatch(multipleSelection, false)">批量下架</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="mgrList"
        v-loading="loading"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" v-if="mgrList && mgrList.length" width="70"></el-table-column>

        <el-table-column :label="mgrType.label + '名称'" min-width="200">
          <template slot-scope="scope">
            <div class="mgr-desc-box">
              <div class="mgr-img"><img :src="scope.row.thumbnail" /></div>
              <div class="mgr-desc">
                <div>{{ scope.row.name }}</div>
                <div class="mgr-price">{{ scope.row.salePrice | price }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="房型数量" v-if="mgrType.value === mgrTypeEnum.hotel.value">
          <template slot-scope="scope">
            <span>{{ scope.row.hotelAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="营销属性">
          <span slot-scope="scope" class="ellipsis" :title="activityList(scope.row)">
            {{ activityList(scope.row) }}
          </span>
        </el-table-column>
        <el-table-column label="分类">
          <template slot-scope="scope">
            <span>{{ !scope.row[`${mgrType.type}Type`] ? mgrType.oddDay.label : mgrType.combo.label }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              v-if="scope.row.inActivity && scope.row.inActivity > 0"
              content="该商品参加活动中，不允许编辑敏感信息!"
            >
              <a href="javascript:;" slot="reference" style="opacity: 0.2" @click="gotoMgrUpdatePage(scope.row)"
                >修改</a
              >
            </el-popover>
            <a v-else href="javascript:" @click="gotoMgrUpdatePage(scope.row)">修改</a>
            <a href="javascript:" @click="gotoMgrShelfPage(scope.row)">门店上下架</a>
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              v-if="scope.row.inActivity && scope.row.inActivity > 0"
              content="该商品参加活动中，不允许删除!"
            >
              <a class="table-delete" href="javascript:;" style="opacity: 0.2" slot="reference">删除</a>
            </el-popover>
            <a class="table-delete" href="javascript:;" v-else @click="delGoods(scope.row)">删除</a>
          </template>
        </el-table-column>
        <!--修改无数据时的展示-->
        <template slot="empty">
          <place-holder></place-holder>
        </template>
      </el-table>

      <!-- 底部操作按钮 -->

      <!-- <el-pagination  v-if="totalGoodsCount"
                      layout="sizes, prev, pager, next"
                     :hide-on-single-page="true"
                     :total="totalGoodsCount"
                     :page-size="pageParams.pageSize"
                     :current-page="pageParams.pageNo"
                     @size-change="onSizeChange"
                     @current-change="onPageChange">
      </el-pagination> -->

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

    <!-- 选择门店弹框 -->
    <store-select-dialog
      :selected-stores="selectedStoresList"
      enable-multiple
      api-url="/wp/store/query/dept"
      :is-all="true"
      v-model="showStoreDialog"
      @choosed="onStoreChoosed"
    ></store-select-dialog>
  </div>
</template>

<script>
  import services from '@/dss-common/utils/services';
  import wpBaseApi from '@/business-common/wp-base-api.js';
  import urlList from '@/dss-wechat3rd/src/constants/index';
  import placeHolder from '@/dss-common/components/placeholder/index';
  import mgrTypeEnum from '@/dss-wechat3rd/src/constants/mgrTypeEnum.js';
  import mgrListFilter from './MgrListFilter';
  import constants from '@/dss-wechat3rd/src/constants/index.js';
  import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
  import storeSelectDialog from '@/dss-wechat3rd/src/bz_components/store-select-dialog/index.vue';

  const unionKeys = ['id']; // 统一标识key集合数组，唯一id标识，可能有多个key，用于记录选中的分页数据

  export default {
    name: 'MgrListTable',
    mixins: [tableCheckedHelperMixin],
    components: {
      placeHolder,
      mgrListFilter,
      storeSelectDialog,
    },
    props: {
      mgrType: {
        type: Object,
      },
      mgrDetailPageUrl: {
        type: String,
        default() {
          return '#';
        },
      },
      mgrCreatePageUrl: {
        type: String,
        default() {
          return '#';
        },
      },
      mgrShelfPageUrl: {
        type: String,
        default() {
          return '#';
        },
      },
    },
    data() {
      return {
        mgrTypeEnum,
        loading: false,
        mgrList: [],
        // 商品类型
        type: null,
        totalGoodsCount: 0,
        pageParams: {
          pageSize: 10, // 每页条数
          pageNo: 1, // 页数
        },
        queryParams: {
          type: this.mgrType.value,
        },
        // 管理员权限
        create_item: false,
        update_item: false,
        manage_label: false,

        multipleSelection: [], // 当前页面选中维护的列表list

        showStoreDialog: false, // 是否显示选择门店弹框
        selectedStoresList: [], // 选中的门店列表

        toggleShelfObj: null, // 切换上下架参数对象
      };
    },
    filters: {
      toPageUnit(val) {
        const money = val;
        return money ? '￥' + money / 100 : '免费';
      },
    },
    computed: {
      activityList() {
        return function (item) {
          const preSellText = item.preSell ? '预售,' : '';
          const groupText = item.pt ? '拼团,' : '';
          const cutPriceText = item.bargain ? '砍价,' : '';
          const seckillText = item.seckill ? '秒杀,' : '';
          if (preSellText || groupText || cutPriceText || seckillText) {
            const activityText = preSellText + groupText + cutPriceText + seckillText;
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
    },
    mounted() {
      this.getMgrList();
      this.queryUserManagement();
    },
    methods: {
      warnAlert(msg) {
        this.$message({
          message: msg,
          type: 'warning',
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
      },
      // 获取商品列表
      getMgrList() {
        // 获取数据之前，需要重新计算一次选中的item
        this.mUpdateTotalListBySelection(this.mgrList, this.multipleSelection, unionKeys);

        this.loading = true;
        const url = urlList.Api.goods.list;
        const params = { ...this.pageParams, ...this.queryParams };
        services
          .get(url, {
            params,
            action: `${this.mgrType.label}列表`,
          })
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
          type: 'warning',
        });
      },

      // 删除商品
      delGoods(row) {
        this.$confirm('是否确认删除商品? ', '删除商品', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            if (row.inActivity) {
              return this.warnTip('该商品参加营销活动中，不允许删除!');
            }
            const params = { itemNo: row.itemNo, barcode: row.barcode, itemName: row.name };
            services
              .get(urlList.Api.goods.del, {
                params,
                action: '删除商品',
              })
              .done(res => {
                this.$message({
                  message: '删除成功',
                  type: 'success',
                });
                this.getMgrList();
              })
              .always(() => {
                this.loading = false;
              });
          })
          .catch(() => {
            console.log('取消删除商品');
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
      gotoMgrCreatePage() {
        this.$router.push({
          path: this.mgrCreatePageUrl,
          query: { mgrLabel: this.mgrType.type },
        });
      },
      gotoMgrUpdatePage(item) {
        if (!this.update_item) {
          this.warnAlert('请用管理员身份登录');
        } else if (!item.status) {
          this.verifyConfirm('已上架商品不可编辑或删除，请下架后再操作', '不可操作');
        } else {
          this.$router.push({
            path: this.mgrDetailPageUrl,
            query: {
              itemNo: item.itemNo,
              mgrLabel: this.mgrType.type,
              isDisabledEdit: item.inActivity && item.inActivity > 0 ? 1 : 0,
            },
          });
        }
      },
      gotoMgrShelfPage(item) {
        if (!this.update_item) {
          this.warnAlert('请用管理员身份登录');
        } else {
          this.$router.push({
            path: this.mgrShelfPageUrl,
            query: { itemNo: item.itemNo },
          });
        }
      },
      verifyConfirm(content, title) {
        this.$confirm(content, title, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
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
          isNowShelf,
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
        const isNowShelf = this.toggleShelfObj.isNowShelf; // 上下架状态

        // 批量操作时，将所有被选中的列表list数据：mTotalCheckedList作为全部选择的参数
        itemList = this.mTotalCheckedList;

        const itemNos = []; // 全部选中的商品itemNo集合
        const preSellItemNos = []; // 预售商品itemNo集合
        itemList.forEach(item => {
          itemNos.push(item.itemNo);
          if (item.preSell) {
            preSellItemNos.push(item.itemNo);
          }
        });

        const storeIds = []; // 选中的门店id集合
        this.selectedStoresList.forEach(item => {
          storeIds.push(item.id);
        });

        const shelfParams = {
          shelf: isNowShelf ? 1 : 0, // 上下架状态，上架：1，下架：0
          itemNos: itemNos.toString(), // 商品itemNo集合字符串
          storeIds: storeIds.toString(), // 门店id集合字符串
        };
        if (preSellItemNos.length) {
          shelfParams.preSellItemNos = preSellItemNos.toString();
        }

        const url = constants.Api.store.batchShelf;

        this.loading = true;
        services
          .post(url, shelfParams, {
            action: '上下架',
          })
          .done(res => {
            this.emptyMultipleSelection(); // 批量操作成功之后，清空之前选中的操作数据列表
            this.getMgrList(); // 获取商品列表
          })
          .always(() => {
            this.loading = false;
          });
      },
    },
  };
</script>

<style lang="less">
  @import '~@/dss-common/style/wkt-constants.less';

  .mgr-list-table {
    // position: relative;

    // .goods-btn-box {
    //   position: absolute;
    //   right: 20px;
    //   top: 30px;
    //   z-index: 9999;
    // }
    .wkt-opt-label-container {
      .serach-mixin;
      padding-top: 0px;
      padding-bottom: 1px;
    }
    .content-operation {
      .el-popover__reference-wrapper {
        margin-right: 12px;
      }
    }
    .mgr-list-content {
      // padding: 0 20px 20px;
      background: #fff;
      margin-top: 16px;
      .handleBatch {
        padding-top: 10px;
        padding-left: 20px;
      }
      .mgr-desc-box {
        white-space: nowrap;
      }

      .mgr-img {
        display: inline-block;

        img {
          width: 65px;
          height: 65px;
        }
      }

      .mgr-desc {
        display: inline-block;
        vertical-align: top;
        font-size: @small-font;
        margin-left: 20px;
        width: 60%;
        white-space: normal;
        word-break: break-all;

        .mgr-price {
          color: @red-color;
        }
      }
    }
  }
</style>
