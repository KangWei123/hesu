<template>
  <div class="goods-list-container manage-goods-list">
    <!-- 商品管理头部操作按钮 -->
    <div class="Add-Manage-Button">
      <el-button
        class="manage-btn"
        type="primary"
        plain
        v-if="allowManageLabel"
        @click="
          $router.push({
            path: manageLabelPath ? manageLabelPath : '/retail/create-goods/label-manage',
            query: { labelType: labelType, goodsType: goodsType.type },
          })
        "
        >管理标签</el-button
      >
      <el-popover placement="bottom" v-else width="200" trigger="hover" :content="scopeMenuEnum.disabledBtnTip">
        <el-button class="isdisabled" slot="reference" type="primary">管理标签</el-button>
      </el-popover>

      <el-button
        v-if="allowCreateItem"
        slot="reference"
        type="primary"
        icon="el-icon-plus"
        @click="
          $router.push({
            path: addProductPath ? addProductPath : '/goods-manage/add/' + goodsType.type,
            query: { labelType: labelType },
          })
        "
        >添加{{ goodsType.label }}</el-button
      >
      <el-popover placement="bottom" v-else width="200" trigger="hover" :content="scopeMenuEnum.disabledBtnTip">
        <el-button class="isdisabled" slot="reference" icon="el-icon-plus" type="primary"
          >添加{{ goodsType.label }}</el-button
        >
      </el-popover>
    </div>

    <!-- 商品查询过滤条件 -->
    <goods-list-filter
      class="wkt-opt-label-container"
      :show-label="false"
      show-activity
      show-barcode
      :goods-type="goodsType"
      @filter="onFilter"
    />

    <!-- 商品导出功能按钮 -->
    <div class="export-box">
      <!-- <div style="margin-top: 15px;"> -->
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
      <!-- </div> -->

      <el-popover
        placement="top-start"
        width="200"
        trigger="hover"
        v-if="!exportitem"
        :content="scopeMenuEnum.disabledBtnTip"
      >
        <el-button slot="reference">批量导出</el-button>
      </el-popover>
      <el-button v-else @click="batchExport" :disabled="disableBatchExport">批量导出</el-button>
      <el-popover
        placement="top-start"
        width="200"
        trigger="hover"
        v-if="!exportitem"
        :content="scopeMenuEnum.disabledBtnTip"
      >
        <el-button slot="reference">一键导出</el-button>
      </el-popover>
      <el-button v-else @click="oneKeyExport" :disabled="disableBatchExport">一键导出</el-button>
      <template v-if="showBatchDel">
        <el-popover
          placement="top-start"
          width="200"
          style="margin-left: 8px"
          trigger="hover"
          v-if="!batchDel"
          :content="scopeMenuEnum.disabledBtnTip"
        >
          <el-button slot="reference">批量删除</el-button>
        </el-popover>
        <el-button v-else @click="onBatchDel">批量删除</el-button>
      </template>
    </div>

    <!-- 商品列表 -->
    <div class="goods-list wkb-table-border goods-list-mgr-table" v-if="goodsType !== null" v-loading="loading">
      <el-table class="wkt-table" ref="multipleTable" :data="goodsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" v-if="goodsList && goodsList.length" width="70"></el-table-column>

        <el-table-column :label="goodsType.label + '名称'" min-width="200">
          <template slot-scope="scope">
            <div class="goods-desc-box">
              <div class="goods-img"><img :src="scope.row.thumbnail" /></div>
              <div class="goods-desc">
                <div>{{ scope.row.name }}</div>
                <span v-if="!scope.row.salesType">
                  {{ scope.row.salePrice | price | toPageUnit }}
                  <!-- 显示积分 -->
                  <span v-if="scope.row.mode && scope.row.integralPrice">
                    {{ `+ ${scope.row.integralPrice}积分` }}
                  </span>
                </span>
                <span v-else>{{ scope.row.displayPrice || '到店咨询' }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="goodsType.label + '分类'">
          <span slot-scope="scope" class="category ellipsis" :title="scope.row.categoryDTO.category">{{
            scope.row.categoryDTO.category
          }}</span>
        </el-table-column>
        <!-- 是否为商品 -->
        <el-table-column v-if="goodsType.value === 1" :label="goodsType.label + '类型'">
          <span slot-scope="scope" class="category ellipsis">{{ scope.row.mode === 1 ? '积分商品' : '普通商品' }}</span>
        </el-table-column>
        <el-table-column label="营销属性">
          <span slot-scope="scope" class="ellipsis" :title="activityList(scope.row)">{{
            activityList(scope.row)
          }}</span>
        </el-table-column>

        <el-table-column label="创建账号" min-width="110">
          <span slot-scope="scope">{{ scope.row.createUserPhone || '-' }}</span>
        </el-table-column>

        <el-table-column label="来源门店">
          <span slot-scope="scope">{{ scope.row.createStoreName || '-' }}</span>
        </el-table-column>

        <el-table-column label="操作" width="240">
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
              <a href="javascript:;" slot="reference">门店上下架</a>
            </el-popover>
            <a href="javascript:;" v-else @click="shelfGoods(scope.row)">门店上下架</a>

            <el-popover
              placement="top"
              :title="minAppInfo.name"
              width="200"
              v-if="lookitem"
              :content="minAppInfo.path"
              trigger="click"
            >
              <a href="javascript:;" slot="reference" @click="checkMinApp(scope.row)">链接</a>
            </el-popover>
            <el-popover
              placement="top-start"
              width="200"
              v-else
              trigger="hover"
              :content="scopeMenuEnum.disabledBtnTip"
            >
              <a href="javascript:void(0);" slot="reference">链接</a>
            </el-popover>

            <Qrcode :lookitem="lookitem" :goods-type="goodsType.type" :item-no="scope.row.itemNo"></Qrcode>

            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              v-if="!allowUpdateItem(scope.row.createStoreId) || isActivity(scope.row)"
              :content="
                !allowUpdateItem(scope.row.createStoreId)
                  ? '请登录该商品来源门店的管理员账号使用此功能'
                  : '该商品参加活动中，不允许删除！'
              "
            >
              <a class="table-delete" href="javascript:;" slot="reference">删除</a>
            </el-popover>
            <a class="table-delete" href="javascript:;" @click="delGoods(scope.row)" v-else>删除</a>
          </template>
        </el-table-column>

        <!--修改无数据时的展示-->
        <template slot="empty">
          <place-holder></place-holder>
        </template>
      </el-table>

      <!-- 分页 -->
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

    <!-- 一键导出温馨提示对话弹框 -->
    <el-dialog title="温馨提示" :visible.sync="showTipDialog" width="500px">
      <span style="font-size: 14px">商品正在导出，请等候...</span>
    </el-dialog>

    <!-- 删除操作提示对话框 -->
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
  import './css/CommonGoodsListTable.less';
  import { mapState } from 'vuex';
  import services from '@/dss-common/utils/services';
  import constants from '../../constants';
  import placeHolder from '@/dss-common/components/placeholder/index';
  import goodsTypeEnum from '../../constants/goodsTypeEnum.js';
  import wpBaseApi from '@/business-common/wp-base-api.js';
  import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
  import goodsListFilter from './GoodsListFilter';
  import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
  import storeSelectDialog from '@/dss-wechat3rd/src/bz_components/store-select-dialog/index.vue';
  import exportExcel from '@/dss-common/utils/exportExcel.js';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  import tag1Enum from '../../constants/Tag1Enum.js';
  import Qrcode from '@/dss-wechat3rd/src/components/qrcode';
  // import dialogTip from '@/dss-common/components/Dialog/index.vue';

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
      Qrcode,
      // dialogTip
    },
    props: {
      goodsType: {
        type: Object,
        default: null,
      },
      addProductPath: {
        type: String,
        default: '',
      },
      manageLabelPath: {
        type: String,
        default: '',
      },
      // 查看: 列表、搜索、链接、二维码、详情
      lookitem: {
        type: Boolean,
        default: true,
      },
      // 编辑商品：添加、编辑、删除、管理标签
      edititem: {
        type: Boolean,
        default: true,
      },
      // 导出、一键导出
      exportitem: {
        type: Boolean,
        default: true,
      },
      // 上下架商品、批量上下架、链接跳转
      ulshelve: {
        type: Boolean,
        default: true,
      },
      // 设置价格：售价、标价、批量设置价格
      setprice: {
        type: Boolean,
        default: true,
      },
      // 是否显示批量删除商品
      showBatchDel: {
        type: Boolean,
        default: false,
      },
      // 批量删除商品
      batchDel: {
        type: Boolean,
        default: true,
      },
    },

    data() {
      return {
        loading: false,
        scopeMenuEnum,
        goodsList: [], // 商品列表
        queryParams: {
          type: this.goodsType.value,
        },
        pageParams: {
          pageSize: 10, // 每页条数
          pageNo: 1, // 页数
        },
        totalGoodsCount: 0,

        create_item: false, // 是否有创建商品的权限
        update_item: false, // 是否有修改商品的权限
        manage_label: false, // 是否有管理标签的权限

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

        // 删除提示对话框
        // dialogVisible: false,
        // tipTitle: '删除商品',
        // tipContent: '是否确认删除商品?',
        // iconClass: 'el-icon-warning',
        // iconColor: '#F5222D',
        // keyWord: '',
        // row: '',

        // 表格隐藏操作
        visible: false,
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
        curApp: 'curApp',
        curStore: 'curStore',
        roleList: 'roleList',
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
       * 是否允许创建商品。
       * 兼容以往的判断条件
       */
      allowCreateItem() {
        const canCustomItem = this.curApp && this.curApp.canCustomItem ? this.curApp.canCustomItem : 0; // 是否支持门店自主管理商品，0：不支持，1：支持
        // 是否支持门店自主管理商品，新增的角色管理商品权限
        if (this.isEnterpriseManager || (this.edititem && canCustomItem)) {
          return true;
        } else {
          return false;
        }
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
          } else {
            return false;
          }
        };
      },

      /**
       * 是否允许管理标签。
       * 兼容以往的判断条件
       */
      allowManageLabel() {
        const canCustomItem = this.curApp && this.curApp.canCustomItem ? this.curApp.canCustomItem : 0; // 是否支持门店自主管理商品，0：不支持，1：支持
        if (this.isEnterpriseManager || (this.edititem && canCustomItem)) {
          // 是否支持门店自主管理商品，新增的角色管理商品权限
          return true;
        }
        return false;
      },

      // 根据商品类型定义标签类型
      labelType() {
        if (this.goodsType.type === 'product') {
          return 1;
        } else if (this.goodsType.type === 'server') {
          return 0;
        }
      },

      // 营销属性
      activityList() {
        return item => {
          const preSellText = item.preSell ? '预售,' : '';
          const groupText = item.pt ? '拼团,' : '';
          const cutPriceText = item.bargain ? '砍价,' : '';
          const seckillText = item.seckill ? '秒杀,' : '';
          const integralItemText = item.integralItem ? '积分商品,' : '';
          const discountText = (item.tag1 & tag1Enum.DISCOUNT) === tag1Enum.DISCOUNT ? '第x件y折,' : '';
          const reductionText = (item.tag1 & tag1Enum.FULL_REDUCTION) === tag1Enum.FULL_REDUCTION ? '满x件优惠,' : '';
          const mouthfulText = (item.tag1 & tag1Enum.MOUTHFUL) === tag1Enum.MOUTHFUL ? '一口价,' : '';

          if (
            preSellText ||
            groupText ||
            cutPriceText ||
            seckillText ||
            integralItemText ||
            discountText ||
            reductionText ||
            mouthfulText
          ) {
            const activityText =
              preSellText +
              groupText +
              cutPriceText +
              seckillText +
              integralItemText +
              discountText +
              reductionText +
              mouthfulText;
            return activityText.slice(0, activityText.length - 1);
          } else {
            return '无';
          }
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

      // 判断是否禁止底部批量操作按钮
      disableBatchButton() {
        if (
          this.ulshelve &&
          (this.multipleSelection.length > 0 || // 当前页选中操作的数据数组长度大于0
            this.mTotalCheckedList.length > 0) // 所有被选中的列表list长度大于0
        ) {
          return false;
        }
        return true;
      },
    },
    mounted() {
      this.queryUserManagement(); // 获取用户管理员权限
    },
    methods: {
      /**
       * 警告提示弹框
       */
      warnTip(msg) {
        this.$message({
          message: msg,
          type: 'warning',
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
        this.emptyMultipleSelection(); // 更换查询条件时，清空之前选中的操作数据列表
        this.listGoodsByType(); // 根据商品类型获取商品列表
      },

      /**
       * 根据商品类型获取商品列表
       * @param goodsType 商品类型
       */
      listGoodsByType() {
        // 获取数据之前，需要重新计算一次选中的item
        this.mUpdateTotalListBySelection(this.goodsList, this.multipleSelection, unionKeys);

        this.loading = true;
        const params = { ...this.pageParams, ...this.queryParams };
        if (this.goodsType.value === goodsTypeEnum.card.value) {
          params.type = null;
        }

        const url =
          this.goodsType.value === goodsTypeEnum.card.value ? constants.Api.card.list : constants.Api.goods.list;
        services
          .get(url, {
            params,
            action: '商品列表',
          })
          .done(res => {
            // console.log('商品列表: ' + JSON.stringify(res));
            this.goodsList = res.data || [];
            this.totalGoodsCount = res.totalCount;

            // 成功获取数据之后，重新构建pageList的选中状态
            this.mBuildMultipleTableSelection(this.goodsList, 'multipleTable', unionKeys);
          })
          .always(() => {
            this.loading = false;
          });
      },

      /**
       * 获取用户管理员权限
       */
      queryUserManagement() {
        wpBaseApi.queryUserManagement().then(res => {
          res.data.forEach(item => {
            // 是否有创建商品的权限
            if (item.name === 'create_item') {
              this.create_item = true;
            }
            // 是否有修改商品的权限
            if (item.name === 'update_item') {
              this.update_item = true;
            }
            // 是否有管理标签的权限
            if (item.name === 'manage_label') {
              this.manage_label = true;
            }
          });
        });
      },

      /**
       * 商品编辑
       */
      editGoods(row = {}) {
        let disabledForm = false; // 是否不允许编辑整个商品
        // 判断是否不允许修改商品
        if (!this.allowUpdateItem(row.createStoreId || null)) {
          disabledForm = true;
        }

        this.$router.push({
          path: this.addProductPath ? this.addProductPath : '/goods-manage/add/' + this.goodsType.type,
          query: {
            itemNo: row.itemNo,
            labelType: this.labelType,
            disabledForm: disabledForm, // 是否不允许编辑整个商品
            isDisabledEdit: row.preSell || (row.inActivity && row.inActivity > 0 ? 1 : 0), // 是否不允许编辑敏感信息
          },
        });
      },

      /**
       * 删除商品
       */
      // delGoods(row = {}) {
      //   this.tipTitle = '删除商品';
      //   this.tipContent = '是否确认删除商品?';
      //   this.iconClass = 'el-icon-warning';
      // this.dialogVisible = true;
      //   this.iconColor = '#F5222D';
      //   this.keyWord = 'delSingle';
      // this.row = row;
      // },

      // delSingle(row = {}) {
      //   if (row.inActivity && row.inActivity > 0) {
      //     return this.warnTip('该商品参加营销活动中，不允许删除!');
      //   }
      //   let params = { itemNo: row.itemNo, barcode: row.barcode, itemName: row.name };
      //   services
      //     .get(constants.Api.goods.del, {
      //       params,
      //       action: '删除商品'
      //     })
      //     .done(res => {
      //       this.$message({
      //         message: '删除成功',
      //         type: 'success'
      //       });
      //       this.listGoodsByType(); // 根据商品类型获取商品列表
      //     })
      //     .always(() => {
      //       this.loading = false;
      //     });
      // },

      delGoods(row = {}) {
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
                this.loading = false;
              });
          })
          .catch(() => {
            console.log('取消删除商品');
          });
      },

      /**
       * 门店上下架
       */
      shelfGoods(row) {
        const path = this.mGetPatchShelvesPath(this.goodsType.value);
        this.$router.push({
          path: path,
          query: { itemNo: row.itemNo, type: this.goodsType.value },
        });
      },

      /**
       * 获取链接
       */
      checkMinApp(row) {
        let maPath = null;
        if (this.goodsType.type === goodsTypeEnum.server.type) {
          maPath = 'pages/serve-detail/index';
        } else if (this.goodsType.type === goodsTypeEnum.card.type) {
          maPath = 'pages/card-detail/index';
        } else {
          maPath = 'wxat-common/pages/goods-detail/index';
        }
        this.minAppInfo.path = maPath + '?itemNo=' + row.itemNo;
        this.minAppInfo.name = row.name;
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
        // 判断是否有修改商品的权限
        // if (!this.update_item) {
        //   return this.warnTip('请登录管理员账号使用此功能');
        // }

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
      // oneKeyExport() {
      //   this.tipTitle = '一键导出';
      //   this.tipContent = '确定一键导出过滤后的商品吗?';
      //   this.iconClass = 'el-icon-warning';
      //   this.dialogVisible = true;
      //   this.iconColor = '#1890FF';
      //   this.keyWord = 'export';
      // },

      // 删除对话框确认操作
      // DialogSure() {
      // this.dialogVisible = false;
      // if (this.keyWord === 'export') {
      //   this.exportSure();
      // } else if (this.keyWord === 'batchDel') {
      //   this.batchDelSure();
      // } else if (this.keyWord === 'delSingle') {
      // this.delSingle(this.row);
      // }
      // },

      // 删除对话框取消操作
      // DialogCancel() {
      //   this.dialogVisible = false;
      // },

      // 一键导出确认操作
      // exportSure() {
      //   let params = {
      //     ...this.queryParams
      //   };

      //   // 删除请求参数中的空值
      //   Object.keys(params).forEach(key => {
      //     if (!params[key] || params[key] === null || params[key] === '') {
      //       delete params[key];
      //     }
      //   });

      //   //post下载
      //   this.disabledOneKeyExport = true;
      //   this.showTipDialog = true;
      //   exportExcel.getDownload(constants.Api.goods.itemExport, params).always(() => {
      //     this.disabledOneKeyExport = false;
      //     this.showTipDialog = false;
      //   });
      // },

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

      /**
       * 批量删除商品
       */
      // onBatchDel() {
      //   // 每次批量操作时，主动触发一次计算全部选择的列表
      //   this.mUpdateTotalListBySelection(this.goodsList, this.multipleSelection, unionKeys);

      //   // 所有被选中的列表list长度小于1
      //   if (this.mTotalCheckedList.length < 1) {
      //     this.$message.error('请选择要删除的商品');
      //     return;
      //   }

      //   this.tipTitle = '批量删除';
      //   this.tipContent = '确定批量删除过滤后的商品吗？';
      //   this.iconClass = 'el-icon-warning';
      //   this.dialogVisible = true;
      //   (this.iconColor = '#F5222D'), (this.keyWord = 'batchDel');
      // },

      // 批量删除对话框确认操作
      // batchDelSure() {
      //   let params = {
      //     ...this.queryParams
      //   };

      //   // 批量所有被选中的列表list的itemNo集合
      //   let itemNoList = [],
      //     barcodeList = [],
      //     nameList = [],
      //     inActivityList = [];
      //   this.mTotalCheckedList.forEach(item => {
      //     itemNoList.push(item.itemNo);
      //     barcodeList.push(item.barcode);
      //     nameList.push(item.name);
      //     if (item.inActivity && item.inActivity > 0) {
      //       inActivityList.push(item.name);
      //     }
      //   });

      //   if (inActivityList.length > 0) {
      //     const tips = inActivityList.join('、');
      //     return this.warnTip(`${tips}等商品参加营销活动中，不允许删除!`);
      //   }
      //   params.itemNoList = itemNoList.join(',');
      //   params.barcodeList = barcodeList.join(',');
      //   params.nameList = nameList.join(',');

      //   // 删除请求参数中的空值
      //   Object.keys(params).forEach(key => {
      //     if (!params[key] || params[key] === null || params[key] === '') {
      //       delete params[key];
      //     }
      //   });

      //   this.loading = true;
      //   services
      //     .post(constants.Api.goods.batchDel, params, {
      //       action: '批量删除'
      //     })
      //     .done(res => {
      //       this.$message({
      //         message: '商品删除成功',
      //         type: 'success'
      //       });
      //       this.emptyMultipleSelection(); // 批量操作成功之后，清空之前选中的操作数据列表
      //       this.listGoodsByType(); // 根据商品类型获取商品列表
      //     })
      //     .always(() => {
      //       this.loading = false;
      //     });
      // },

      onBatchDel() {
        // 每次批量操作时，主动触发一次计算全部选择的列表
        this.mUpdateTotalListBySelection(this.goodsList, this.multipleSelection, unionKeys);

        // 所有被选中的列表list长度小于1
        if (this.mTotalCheckedList.length < 1) {
          this.$message.error('请选择要删除的商品');
          return;
        }

        this.$confirm('确定批量删除过滤后的商品吗？', '批量删除', {
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
            const barcodeList = [];
            const nameList = [];
            const inActivityList = [];
            this.mTotalCheckedList.forEach(item => {
              itemNoList.push(item.itemNo);
              barcodeList.push(item.barcode);
              nameList.push(item.name);
              if (item.inActivity && item.inActivity > 0) {
                inActivityList.push(item.name);
              }
            });

            if (inActivityList.length > 0) {
              const tips = inActivityList.join('、');
              return this.warnTip(`${tips}等商品参加营销活动中，不允许删除!`);
            }
            params.itemNoList = itemNoList.join(',');
            params.barcodeList = barcodeList.join(',');
            params.nameList = nameList.join(',');

            // 删除请求参数中的空值
            Object.keys(params).forEach(key => {
              if (!params[key] || params[key] === null || params[key] === '') {
                delete params[key];
              }
            });

            this.loading = true;
            services
              .post(constants.Api.goods.batchDel, params, {
                action: '批量删除',
              })
              .done(res => {
                this.$message({
                  message: '商品删除成功',
                  type: 'success',
                });
                this.emptyMultipleSelection(); // 批量操作成功之后，清空之前选中的操作数据列表
                this.listGoodsByType(); // 根据商品类型获取商品列表
              })
              .always(() => {
                this.loading = false;
              });
          })
          .catch(() => {
            console.log('取消删除');
          });
      },
    },
  };
</script>

<style lang="less">
  .manage-goods-list {
    .wkt-opt-label-container {
      padding: 16px 20px;
    }

    .export-box {
      background: #fff;
      margin-top: 16px;
      border-radius: 4px 4px 0 0;
      padding: 16px 20px 0 20px;

      .el-button {
        border-radius: 4px;
      }
    }

    .cell {
      a {
        padding: 0 !important;
      }
      // a:not(:last-child) {
      //   padding-right: 24px !important;
      // }
    }
    // th:nth-last-child(2) .cell {
    //   text-align: right;
    // }

    .oper-pop {
      width: 40px;
      height: 40px;
      text-align: center;
      vertical-align: middle;
    }
  }
</style>
