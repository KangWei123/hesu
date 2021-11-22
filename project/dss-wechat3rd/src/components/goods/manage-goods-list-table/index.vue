<template>
  <div class="goods-list-container manage-goods-list manage-goods-list-eatate">
    <!-- 商品管理头部操作按钮 -->
    <div class="Add-Manage-Button">
      <el-button class="manage-btn" v-if="true" @click="handleManageLabel">管理标签</el-button>
      <el-popover placement="bottom" v-else width="200" trigger="hover" content="请登录管理员账号使用此功能">
        <el-button class="isdisabled" slot="reference" type="primary">管理标签</el-button>
      </el-popover>
      <el-button v-if="true" slot="reference" type="primary" @click="handleAddNew" icon="el-icon-plus"
        >添加{{ goodsType.label }}</el-button
      >
      <el-popover placement="bottom" v-else width="200" trigger="hover" content="请登录管理员账号使用此功能">
        <el-button class="isdisabled" slot="reference" type="primary" icon="el-icon-plus"
          >添加{{ goodsType.label }}</el-button
        >
      </el-popover>
    </div>

    <!-- 商品查询过滤条件 -->
    <goods-list-filter
      class="wkt-opt-label-container"
      :show-label="false"
      :show-activity="showActivity"
      :show-barcode="showBarcode"
      :show-store="showStore"
      :goods-type="goodsType"
      @filter="onFilter"
    />

    <!-- 商品导出功能按钮 -->
    <div class="export-box">
      <el-button @click="batchExport" :disabled="disableBatchExport">批量导出</el-button>
      <el-button @click="oneKeyExport" :disabled="disabledOneKeyExport">一键导出</el-button>

      <div style="display: inline-block; margin-left: 10px" v-if="showPatchShelf">
        <el-button :disabled="disableBatchButton" @click="handleBatch(multipleSelection, true)">批量上架</el-button>
        <el-button :disabled="disableBatchButton" @click="handleBatch(multipleSelection, false)">批量下架</el-button>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="goods-list wkb-table-border" v-if="goodsType !== null" v-loading="loading">
      <egrid
        class="egrid wkt-table"
        stripe
        ref="multipleTable"
        column-type="selection"
        :data="goodsList"
        :columns="columns"
        :columns-handler="columnsHandler"
        @selection-change="handleSelectionChange"
      ></egrid>

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

    <!-- 一键导出温馨提示对话弹框 -->
    <el-dialog title="温馨提示" :visible.sync="showTipDialog" width="500px">
      <span style="font-size: 14px">商品正在导出，请等候...</span>
    </el-dialog>
  </div>
</template>

<script>
  import '../css/CommonGoodsListTable.less';
  import { mapState } from 'vuex';
  import services from '@/dss-common/utils/services';
  import constants from '@/dss-wechat3rd/src/constants/index.js';
  import placeHolder from '@/dss-common/components/placeholder/index';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
  import wpBaseApi from '@/business-common/wp-base-api.js';
  import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
  import goodsListFilter from '../GoodsListFilter';
  import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
  import storeSelectDialog from '@/dss-wechat3rd/src/bz_components/store-select-dialog/index.vue';
  import exportExcel from '@/dss-common/utils/exportExcel.js';
  import tableColumnsHelper from '@/dss-wechat3rd/src/components/goods/manage-goods-list-table/tableColumnsHelper';

  const MoneyUnit = '￥';
  const unionKeys = ['id']; // 统一标识key集合数组，唯一id标识，可能有多个key，用于记录选中的分页数据

  /**
   * 管理商品的商品列表
   */
  export default {
    name: 'GoodsList',
    mixins: [industryHelperMixin, tableCheckedHelperMixin],
    components: {
      placeHolder,
      goodsListFilter,
      storeSelectDialog,
    },
    props: {
      goodsType: {
        type: Object,
        default: null,
      },
      extParams: {
        type: Object,
        default: function () {
          return {};
        },
      },
      addProductPath: {
        type: String,
        default: '',
      },
      manageLabelPath: {
        type: String,
        default: '',
      },
      qrCodePath: {
        type: String,
        default: null,
      },
      columns: {
        type: Array,
        default: function () {
          return tableColumnsHelper.getColumns(this.goodsType);
        },
      },
      slotHandler: {
        type: Object,
        default: null,
      },
      handlerConfig: {
        type: Object,
        default: function () {
          return {
            edit: true,
            shelf: true,
            link: true,
            qrCode: true,
            del: true,
          };
        },
      },
      showActivity: {
        type: Boolean,
        default: true,
      },
      showBarcode: {
        type: Boolean,
        default: true,
      },
      showStore: {
        type: Boolean,
        default: false,
      },
      // 是否展示批量上下架功能
      showPatchShelf: {
        type: Boolean,
        default: true,
      },
    },

    data() {
      return {
        loading: false,
        goodsList: [],
        totalGoodsCount: 0,
        create_item: false,
        update_item: false,
        manage_label: false,
        pageParams: {
          pageSize: 10, // 每页条数
          pageNo: 1, // 页数
        },
        queryParams: {
          type: this.goodsType.value,
        },

        qrCode: null,
        qrCodeLoading: true,

        minAppInfo: {
          path: '',
          name: '',
        },

        multipleSelection: [], // 当前页面选中维护的列表list

        showStoreDialog: false, // 是否显示选择门店弹框
        selectedStoresList: [], // 选中的门店列表

        toggleShelfObj: null, // 切换上下架参数对象

        // 导出相关参数
        disableBatchExport: false, // 是否禁止批量导出操作按钮
        disabledOneKeyExport: false, // 是否禁止一件导出操作按钮
        showTipDialog: false, // 是否显示一键导出温馨提示对话弹框
        columnsHandler: null,
      };
    },

    filters: {
      toPageUnit(val) {
        const money = val;
        return money ? MoneyUnit + money : '免费';
      },
    },

    computed: {
      ...mapState({
        env: 'env',
        curStore: 'curStore',
      }),
      // 根据商品类型定义标签类型
      labelType() {
        if (this.goodsType.type === 'product') {
          return 1;
        } else if (this.goodsType.type === 'server') {
          return 0;
        }
      },
      activityList() {
        return function (item) {
          const preSellText = item.preSell ? '预售,' : '';
          const groupText = item.pt ? '拼团,' : '';
          const cutPriceText = item.bargain ? '砍价,' : '';
          const seckillText = item.seckill ? '秒杀,' : '';
          const integralItemText = item.integralItem ? '积分商品,' : '';
          if (preSellText || groupText || cutPriceText || seckillText || integralItemText) {
            const activityText = preSellText + groupText + cutPriceText + seckillText + integralItemText;
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
      this.queryUserManagement();
    },

    methods: {
      handleAddNew() {
        this.$router.push({
          path: this.addProductPath,
          query: { labelType: this.goodsType.value },
        });
      },
      handleManageLabel() {
        this.$router.push({
          path: this.manageLabelPath,
          query: { labelType: this.goodsType.value, goodsType: this.goodsType.type },
        });
      },
      // 每页条数变化
      onSizeChange(size) {
        this.pageParams.pageSize = size;
        this.pageParams.pageNo = 1;
        this.listGoodsByType(); // 根据商品类型获取商品列表
      },
      // 翻页
      onPageChange(page) {
        this.pageParams.pageNo = page;
        this.listGoodsByType(); // 根据商品类型获取商品列表
      },

      onFilter(filter) {
        this.pageParams.pageNo = 1;
        this.queryParams = { ...this.queryParams, ...filter };
        if (this.queryParams.store) {
          this.queryParams.storeId = this.queryParams.store.id;
        } else {
          delete this.queryParams.storeId;
        }
        delete this.queryParams.store;
        this.emptyMultipleSelection(); // 更换查询条件时，清空之前选中的操作数据列表
        this.listGoodsByType(); // 根据商品类型获取商品列表
      },

      /**
       * 根据商品类型获取商品列表
       */
      listGoodsByType() {
        // 获取数据之前，需要重新计算一次选中的item
        this.mUpdateTotalListBySelection(this.goodsList, this.multipleSelection, unionKeys);

        this.loading = true;
        const params = { ...this.pageParams, ...this.queryParams, ...this.extParams };
        if (this.goodsType.value === goodsTypeEnum.card.value) {
          params.type = null;
        }

        if (this.goodsType.value === goodsTypeEnum.estate.value) {
          params.storeId = this.curStore.id;
        }

        let url = constants.Api.goods.list;
        if (this.goodsType.value === goodsTypeEnum.card.value) {
          url = constants.Api.card.list;
        }
        services
          .get(url, {
            params,
            action: '商品列表',
          })
          .done(res => {
            this.goodsList = res.data || [];
            this.totalGoodsCount = res.totalCount;

            // 成功获取数据之后，重新构建pageList的选中状态
            this.mBuildMultipleTableSelection(this.goodsList, 'multipleTable', unionKeys);
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
          .always(() => {
            const _this = this;
            this.columnsHandler = tableColumnsHelper.getColumnsHandler({
              slotHandler: this.slotHandler,
              handlerConfig: this.handlerConfig,
              goodsType: this.goodsType,
              update_item: this.update_item,
              manage_item: this.manage_item,
              qrCodePath: this.qrCodePath,
              addProductPath: this.addProductPath,
              listeners: {
                del(row) {
                  _this.listGoodsByType();
                },
              },
            });
          });
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
        this.mUpdateTotalListBySelection(this.goodsList, this.multipleSelection, unionKeys);
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
        this.mUpdateTotalListBySelection(this.goodsList, this.multipleSelection, unionKeys);

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
            this.listGoodsByType(); // 根据商品类型获取商品列表
          })
          .always(() => {
            this.loading = false;
          });
      },

      /**
       * 批量导出商品
       */
      batchExport() {
        // 每次批量操作时，主动触发一次计算全部选择的列表
        this.mUpdateTotalListBySelection(this.goodsList, this.multipleSelection, unionKeys);

        // 所有被选中的列表list长度小于1
        if (this.mTotalCheckedList.length < 1) {
          this.$message.error('请选择要导出的商品');
          return;
        }

        this.$confirm('确定批量导出过滤后的商品吗？', '批量导出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            const params = {
              ...this.queryParams,
            };

            // 批量所有被选中的列表list的itemNo集合
            const itemNoList = [];
            this.mTotalCheckedList.forEach(item => {
              itemNoList.push(item.itemNo);
            });
            params.itemNoList = itemNoList;

            // 删除请求参数中的空值
            Object.keys(params).forEach(key => {
              if (!params[key] || params[key] === null || params[key] === '') {
                delete params[key];
              }
            });

            // post下载
            this.disableBatchExport = true;
            exportExcel
              .getDownload(constants.Api.goods.itemExport, params)
              .then(res => {
                this.$message({
                  message: '商品导出成功，正在下载',
                  type: 'success',
                });

                this.emptyMultipleSelection(); // 批量操作成功之后，清空之前选中的操作数据列表
                this.listGoodsByType(); // 根据商品类型获取商品列表
              })
              .always(() => {
                this.disableBatchExport = false;
              });
          })
          .catch(() => {
            console.log('取消导出');
          });
      },

      /**
       * 一键导出商品
       */
      oneKeyExport() {
        this.$confirm('确定一键导出过滤后的商品吗？', '一键导出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            const params = {
              ...this.queryParams,
            };

            // 删除请求参数中的空值
            Object.keys(params).forEach(key => {
              if (!params[key] || params[key] === null || params[key] === '') {
                delete params[key];
              }
            });

            // post下载
            this.disabledOneKeyExport = true;
            this.showTipDialog = true;
            exportExcel.getDownload(constants.Api.goods.itemExport, params).always(() => {
              this.disabledOneKeyExport = false;
              this.showTipDialog = false;
            });
          })
          .catch(() => {
            console.log('取消一键导出');
          });
      },
    },
  };
</script>

<style lang="less">
  .manage-goods-list {
    .wkt-opt-label-container {
      padding-bottom: 10px !important;
      padding-right: 220px !important;
    }

    .export-box {
      margin-top: 16px;
      padding: 16px 0px 0px 20px;
      background: #fff;

      .el-button {
        border-radius: 4px;
      }
    }
  }
  .manage-goods-list-eatate {
    .el-table {
      td > div {
        a:not(:last-child) {
          padding-right: 0px !important;
        }
        a:not(:first-child),
        span:last-child {
          padding-left: 12px;
        }
        a:last-child {
          color: @ui-function-color-fail;
        }
        span > a {
          color: #2e8dff !important;
        }
      }
    }
  }
</style>
