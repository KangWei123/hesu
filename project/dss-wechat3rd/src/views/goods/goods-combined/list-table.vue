<template>
  <div class="list-table" v-if="goodsType !== null" v-loading="loading">
    <!-- 底部操作按钮 -->
    <div style="padding-top: 16px; padding-left: 20px" v-if="!abandonGoods">
      <el-popover
        placement="top-start"
        width="200"
        trigger="hover"
        v-if="!ulshelve"
        :content="scopeMenuEnum.disabledBtnTip"
      >
        <el-button slot="reference">批量上架</el-button>
      </el-popover>
      <el-button v-else :disabled="disableBatchButton" @click="handleBatch(multipleSelection, true)"
        >批量上架</el-button
      >
      <el-popover
        placement="top-start"
        width="200"
        trigger="hover"
        v-if="!ulshelve"
        :content="scopeMenuEnum.disabledBtnTip"
      >
        <el-button slot="reference">批量下架</el-button>
      </el-popover>
      <el-button v-else :disabled="disableBatchButton" @click="handleBatch(multipleSelection, false)"
        >批量下架</el-button
      >
    </div>

    <el-table class="wkt-table" ref="multipleTable" :data="goodsList" @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        v-if="!abandonGoods && goodsList && goodsList.length"
        width="70"
      ></el-table-column>

      <el-table-column label="商品名称" min-width="200">
        <template slot-scope="scope">
          <div class="goods-desc-box">
            <img class="goods-img" :src="scope.row.thumbnail" />
            <div class="goods-desc">
              <div class="limit-line line-5">{{ scope.row.name }}</div>
              <span class="price">{{ scope.row.salePrice | price | toPageUnit }}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="组合明细" min-width="200">
        <template slot-scope="scope">
          <div v-if="scope.row.combinationDTOS">
            <div class="combination-item" v-for="item in scope.row.combinationDTOS" :key="item.id">
              <span class="item-name limit-line"
                >{{ item.combinationItemName
                }}{{ item.combinationItemAttr ? ' (' + item.combinationItemAttr + ')' : '' }}</span
              >
              <span class="count"> x{{ item.combinationCount }}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="商品分类" min-width="150">
        <template slot-scope="scope" class="category ellipsis" :title="scope.row.categoryDTO.category">
          {{ scope.row.categoryDTO.category }}
        </template>
      </el-table-column>
      <el-table-column label="商品类型" min-width="150">
        <template slot-scope="scope" class="category ellipsis" :title="scope.row.mode">
          {{ scope.row.mode === 1 ? '积分商品' : '线上普通商品' }}
        </template>
      </el-table-column>

      <el-table-column label="营销属性" min-width="150">
        <template slot-scope="scope" class="ellipsis" :title="attributeFormatter(scope.row)">
          {{ attributeFormatter(scope.row) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="250" v-if="!abandonGoods">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            v-if="!allowUpdateItem(scope.row.createStoreId) || scope.row.preSell || isActivity(scope.row)"
            :content="
              !allowUpdateItem(scope.row.createStoreId)
                ? '非该商品来源门店的管理员只允许查看商品详情！'
                : '该商品参加活动中，不允许编辑敏感信息！'
            "
          >
            <a href="javascript:;" slot="reference" @click="editGoods(scope.row)">详情</a>
          </el-popover>
          <a v-else href="javascript:;" @click="editGoods(scope.row)">编辑</a>

          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            v-if="!ulshelve"
            :content="scopeMenuEnum.disabledBtnTip"
          >
            <a href="javascript:;" slot="reference">上下架</a>
          </el-popover>
          <a href="javascript:;" v-else @click="shelfGoods(scope.row)">上下架</a>

          <Qrcode :lookitem="lookitem" :goods-type="goodsType.type" :item-no="scope.row.itemNo"></Qrcode>

          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            v-if="!allowUpdateItem(scope.row.createStoreId) || isActivity(scope.row)"
            :content="
              !allowUpdateItem(scope.row.createStoreId)
                ? '请登录该商品来源门店的管理员账号使用此功能！'
                : '该商品参加活动中，不允许删除！'
            "
          >
            <a class="table-delete" href="javascript:;" slot="reference">删除</a>
          </el-popover>
          <a class="table-delete" href="javascript:;" v-else @click="delGoods(scope.row)">删除</a>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100" v-else-if="abandonGoods">
        <template slot-scope="scope">
          <el-popover
            placement="bottom"
            width="200"
            v-if="!lookitem_abandoned"
            trigger="hover"
            :content="scopeMenuEnum.disabledBtnTip"
          >
            <a href="javascript:void(0);" slot="reference">查看</a>
          </el-popover>
          <a href="javascript:;" v-else @click="editGoods(scope.row)">查看</a>
        </template>
      </el-table-column>

      <!--修改无数据时的展示-->
      <template slot="empty">
        <place-holder></place-holder>
      </template>
    </el-table>

    <!-- 分页 -->
    <div style="text-align: center">
      <!-- <el-pagination v-if="totalGoodsCount"
                     layout="prev, pager, next, jumper, sizes, total"
                     :total="totalGoodsCount"
                     :page-size="pageParams.pageSize"
                     :current-page="pageParams.pageNo"
                     @size-change="onSizeChange"
                     @current-change="onPageChange"
                     class="wkt-pagination"></el-pagination> -->

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

    <!-- 提示对话框 -->
    <!-- <dialog-tip 
      :dialogVisible="dialogVisible" 
      :tipTitle="tipTitle" 
      :tipContent="tipContent" 
      :iconClass="iconClass" 
      :iconColor="iconColor"
      @DialogSure="DialogSure"
      @DialogCancel="DialogCancel"></dialog-tip> -->
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import services from '@/dss-common/utils/services.js';
  import constants from '@/dss-wechat3rd/src/constants/index.js';
  import placeHolder from '@/dss-common/components/placeholder/index.vue';
  import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
  import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
  import storeSelectDialog from '@/dss-wechat3rd/src/bz_components/store-select-dialog/index.vue';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  import Qrcode from '@/dss-wechat3rd/src/components/qrcode';

  // import dialogTip from '@/dss-common/components/Dialog/index.vue';

  const MoneyUnit = '￥';
  const unionKeys = ['id']; // 统一标识key集合数组，唯一id标识，可能有多个key，用于记录选中的分页数据

  export default {
    mixins: [industryHelperMixin, tableCheckedHelperMixin],
    components: {
      placeHolder,
      storeSelectDialog,
      Qrcode,
      // dialogTip
    },

    props: {
      // 商品类型
      goodsType: {
        type: Object,
        default: null,
      },
      // 列表查询条件
      filterParams: {
        type: Object,
        default: {},
      },
      // 是否允许修改
      updateItem: {
        type: Boolean,
        default: false,
      },
      // 是否废弃商品
      abandonGoods: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        scopeMenuEnum,
        goodsList: [],

        pageParams: {
          pageSize: 10, // 每页条数
          pageNo: 1, // 页数
        },
        totalGoodsCount: 0,

        // 查询参数
        queryParams: {
          type: this.goodsType.value, // 商品类型
        },

        multipleSelection: [], // 当前页面选中维护的列表list

        showStoreDialog: false, // 是否显示选择门店弹框
        selectedStoresList: [], // 选中的门店列表

        toggleShelfObj: null, // 切换上下架参数对象

        // 按钮接口返回的权限
        lookitem: false, // 查看: 列表、搜索、二维码、详情
        edititem: false, // 编辑商品：添加、编辑、删除
        ulshelve: false, // 上下架商品、批量上下架
        lookitem_abandoned: false, // 废弃商品查看

        // 对话框
        // dialogVisible: false,
        // tipTitle: '',
        // tipContent: '',
        // iconClass: '',
        // iconColor: '',
        // keyWord: '',
        // row: '',
        // 更改loading在表格中
        loading: false,
      };
    },

    computed: {
      ...mapState({
        env: 'env',
        curApp: 'curApp',
        curStore: 'curStore',
        roleList: 'roleList',
        wkbScopeMenu: 'wkbScopeMenu',
      }),

      /**
       * 是否企业管理员
       */
      isEnterpriseManager() {
        return !!this.roleList && this.roleList.indexOf('common_role_enterprise') !== -1;
      },

      /**
       * 是否区域管理员
       */
      isAreaManager() {
        return (
          !!this.roleList &&
          (this.roleList.indexOf('common_role_area_manager') !== -1 ||
            this.roleList.indexOf('common_role_dealer_manager') !== -1)
        );
      },
      /**
       * 是否允许修改商品，包括编辑、删除。
       * 兼容以往的判断条件
       */
      allowUpdateItem() {
        return createStoreId => {
          const canCustomItem = this.curApp && this.curApp.canCustomItem ? this.curApp.canCustomItem : 0; // 是否支持门店自主管理商品，0：不支持，1：支持
          if (
            this.isEnterpriseManager ||
            (this.edititem &&
              canCustomItem && // 是否支持门店自主管理商品，新增的角色管理商品权限
              createStoreId && // 商品来源门店id是否存在
              createStoreId === this.curStore.id) // 商品来源门店id是否等于当前门店id
          ) {
            return true;
          }
          return false;
        };
      },

      // 当前商品是否在活动中
      isActivity() {
        return item => {
          if (item.inActivity && item.inActivity > 0) {
            return true;
          } else {
            return false;
          }
        };
      },

      // 根据商品类型定义标签类型
      labelType() {
        if (this.goodsType.type === 'product') {
          return 1;
        } else if (this.goodsType.type === 'server') {
          return 0;
        } else if (this.goodsType.type === 'combinationItem') {
          return 2;
        }
      },

      // 格式化商品的营销属性
      attributeFormatter() {
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
    watch: {
      // 监听父组件传过来的列表查询条件，以便实时查询分销人员列表
      filterParams: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          this.pageParams.pageNo = 1;
          this.queryParams = { ...this.queryParams, ...newVal };
          this.listGoodsByType(); // 根据商品类型获取商品列表
        },
      },
      wkbScopeMenu: {
        immediate: true,
        handler() {
          if (this.wkbScopeMenu) {
            if (this.abandonGoods) {
              this.assembleOrderMgrMenuAbandoned();
            } else {
              this.assembleOrderMgrMenu();
            }
          }
        },
      },
    },

    // 过滤器
    filters: {
      toPageUnit(val) {
        const money = val;
        return money ? MoneyUnit + money : '免费';
      },
    },

    mounted() {},
    methods: {
      assembleOrderMgrMenu() {
        const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          scopeMenuEnum.dictionary.wkbChildMenu.wkbGoodsMgrMenu.combineGoodsButton.goods_manager
        );
        scopeMenu.childMenu &&
          scopeMenu.childMenu.forEach(item => {
            if (item.identifier == 'combine_goods_detail' && item.isHasPermission == 1) {
              this.lookitem = true;
            }
            if (item.identifier == 'edit_combine_goods' && item.isHasPermission == 1) {
              this.edititem = true;
            }
            if (item.identifier == 'shelf_combine_goods' && item.isHasPermission == 1) {
              this.ulshelve = true;
            }
          });
      },
      assembleOrderMgrMenuAbandoned() {
        const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          scopeMenuEnum.dictionary.wkbChildMenu.wkbGoodsMgrMenu.combineGoodsButton.combine_abandoned_goods
        );
        scopeMenu.childMenu &&
          scopeMenu.childMenu.forEach(item => {
            if (item.identifier == 'combined_goods_abandoned_goods_show' && item.isHasPermission == 1) {
              this.lookitem_abandoned = true;
            }
          });
      },
      // 警告提示弹框
      warnTip(msg) {
        this.$message({
          message: msg,
          type: 'warning',
        });
      },

      // 每页条数变化
      onSizeChange(size) {
        if (this.abandonGoods) {
          if (this.lookitem_abandoned) {
            this.pageParams.pageSize = size;
            this.pageParams.pageNo = 1;
            this.listGoodsByType(); // 根据商品类型获取商品列表
          } else {
            this.$message.error('该角色暂无权限操作');
          }
        } else {
          if (this.lookitem) {
            this.pageParams.pageSize = size;
            this.pageParams.pageNo = 1;
            this.listGoodsByType(); // 根据商品类型获取商品列表
          } else {
            this.$message.error('该角色暂无权限操作');
          }
        }
      },
      // 翻页
      onPageChange(page) {
        if (this.abandonGoods) {
          if (this.lookitem_abandoned) {
            this.pageParams.pageNo = page;
            this.listGoodsByType(); // 根据商品类型获取商品列表
          } else {
            this.$message.error('该角色暂无权限操作');
          }
        } else {
          if (this.lookitem) {
            this.pageParams.pageNo = page;
            this.listGoodsByType(); // 根据商品类型获取商品列表
          } else {
            this.$message.error('该角色暂无权限操作');
          }
        }
      },

      /**
       * 根据商品类型获取商品列表
       * @param goodsType 商品类型
       */
      listGoodsByType() {
        // this.$emit('onLoading');
        this.loading = true;
        // 获取数据之前，需要重新计算一次选中的item
        this.mUpdateTotalListBySelection(this.goodsList, this.multipleSelection, unionKeys);

        const params = { ...this.pageParams, ...this.queryParams };
        // 重新设置商品类型type为父组件传入进来的是为了避免查询被条件过滤器中传过来的type给覆盖了
        params.type = this.goodsType.value;

        // 判断是否为废弃商品，是则添加请求参数status = 0
        if (this.abandonGoods) {
          params.status = 0;
        }

        const url =
          this.goodsType.value === goodsTypeEnum.card.value ? constants.Api.card.list : constants.Api.goods.list;
        if (this.goodsType.value === goodsTypeEnum.card.value) {
          params.type = null;
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
            // this.$emit('unLoading');
            this.loading = false;
          });
      },

      /**
       * 商品添加、编辑及详情
       */
      editGoods(row) {
        let disabledForm = false; // 是否不允许编辑整个商品
        // 判断是否不允许修改商品
        if (!this.allowUpdateItem(row.createStoreId || null)) {
          disabledForm = true;
        }
        // 判断是不是废弃商品
        if (this.abandonGoods) {
          const abjumpPath = 'discard-list/detail';
          const abjumpQuery = {
            itemNo: row.itemNo,
            labelType: this.labelType,
            status: 0,
          };
          this.$router.push({
            path: '/retail/goods-mgr/goods-combined/' + abjumpPath,
            query: abjumpQuery,
          });
        } else {
          const jumpPath = 'goods-list/edit';
          const jumpQuery = {
            itemNo: row.itemNo,
            labelType: this.labelType,
            isDisabledEdit: row.preSell || (row.inActivity && row.inActivity > 0 ? 1 : 0),
            isDisabledForm: disabledForm,
          };

          this.$router.push({
            path: '/retail/goods-mgr/goods-combined/' + jumpPath,
            query: jumpQuery,
          });
        }
      },

      /**
       * 门店上下架
       */
      shelfGoods(row) {
        // 判断不是废弃商品的才需要检查是否为管理员账号
        const path = '/retail/goods-mgr/goods-combined/goods-list/patch-shelves';
        this.$router.push({
          path: path,
          query: { itemNo: row.itemNo, type: row.type },
        });
      },

      // 对话框确认操作
      // DialogSure() {
      //   this.dialogVisible = false;
      //   if (this.keyWord === 'delSingle') {
      //     this.delSingle(this.row);
      //   }
      // },

      // // 对话框取消
      // DialogCancel() {
      //   this.dialogVisible = false;
      // },

      // 删除商品弹框
      // delGoods(row) {
      //   this.tipTitle = '删除商品';
      //   this.tipContent = '是否确认删除商品?';
      //   this.iconClass = 'el-icon-warning';
      //   this.dialogVisible = true;
      //   this.iconColor = '#F5222D';
      //   this.keyWord = 'delSingle';
      //   this.row = row;
      // },

      /**
       * 删除商品
       */
      // delSingle(row) {
      // if (row.inActivity && row.inActivity > 0) {
      //   return this.warnTip('该商品参加营销活动中，不允许删除!');
      // }
      // let params = { itemNo: row.itemNo, barcode: row.barcode, itemName: row.name };

      // // this.$emit('onLoading');
      // this.loading = true;

      // services
      //   .get(constants.Api.goods.del, {
      //     params,
      //     action: '删除商品'
      //   })
      //   .done(res => {
      //     this.$message({
      //       message: '删除成功',
      //       type: 'success'
      //     });

      //     this.listGoodsByType(); // 根据商品类型获取商品列表
      //   })
      //   .always(() => {
      //     // this.$emit('unLoading');
      //     this.loading = false;
      //   });
      // },
      delGoods(row) {
        this.$confirm('是否确认删除商品? ', '删除商品', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            if (row.inActivity && row.inActivity > 0) {
              return this.warnTip('该商品参加营销活动中，不允许删除!');
            }
            const params = { itemNo: row.itemNo, barcode: row.barcode, itemName: row.name };

            // this.$emit('onLoading');
            this.loading = true;

            services
              .get(constants.Api.goods.del, {
                params,
                action: '删除商品',
              })
              .done(res => {
                this.$message({
                  message: '删除成功',
                  type: 'success',
                });

                this.listGoodsByType(); // 根据商品类型获取商品列表
              })
              .always(() => {
                // this.$emit('unLoading');
                this.loading = false;
              });
          })
          .catch(() => {
            console.log('取消删除');
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
    },
  };
</script>
