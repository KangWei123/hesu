<template>
  <div class="goods-setting">
    <!-- 顶部操作区域 -->
    <div class="Add-Manage-Button">
      <el-button @click="handleSyncItem">同步商品库批量添加</el-button>
      <el-button type="primary" @click="onShowGoodsDialog">选择添加</el-button>
    </div>
    <!-- 顶部搜索区域 -->
    <div class="filter-box wkt-opt-label-container">
      <div class="filter-tab">
        <span class="filter-label">商品分类</span>
        <goods-category-cascader
          :active-goods-type="goodsType"
          :with-all="true"
          size="mini"
          v-model="filter.categoryId"
        />
      </div>
      <div class="filter-tab">
        <el-input
          class="filter-input"
          size="mini"
          placeholder="关键字搜索"
          v-model="filter.name"
          maxlength="80"
          @keyup.enter.native="onSearch"
          @input="onSearch"
        ></el-input>
      </div>
    </div>

    <!-- 温馨提示 -->
    <div class="reminder">温馨提示：同步的内购商品需设置内购价格才会在小程序上显示哦</div>

    <!-- 内购商品列表 -->
    <div class="goods-list" v-loading="loading" :element-loading-text="elementLoadingText">
      <el-table
        class="wkt-table"
        ref="multipleTable"
        :data="goodsList"
        stripe
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" v-if="goodsList && goodsList.length" width="70"></el-table-column>

        <el-table-column label="商品名称" min-width="200">
          <template slot-scope="scope">
            <div class="goods-desc-box">
              <div class="goods-img"><img :src="scope.row.thumbnail" /></div>
              <div class="goods-desc">
                <div>{{ scope.row.name }}</div>
                <span>￥{{ scope.row.salePrice | price }}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="商品分类" min-width="100">
          <span slot-scope="scope" class="category ellipsis" v-if="scope.row.categoryDTO">{{
            scope.row.categoryDTO.category
          }}</span>
        </el-table-column>

        <el-table-column label="售价" min-width="120">
          <template slot-scope="scope">
            <span>￥{{ scope.row.salePrice | price }}</span>
          </template>
        </el-table-column>

        <el-table-column label="内购价" min-width="180">
          <template slot-scope="scope">
            <div v-if="scope.row.innerBuyCoupon">
              <span>￥{{ scope.row.innerBuyPrice | price }}</span>
              <span> + {{ scope.row.innerBuyCoupon }}内购券</span>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>

        <el-table-column label="营销属性" min-width="90">
          <span slot-scope="scope" class="ellipsis">{{ attributeFormatter(scope.row) }}</span>
        </el-table-column>

        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <a @click="handleDelete([scope.row])">删除</a>
            <a @click="handleSetting([scope.row])">设置</a>
          </template>
        </el-table-column>

        <!--修改无数据时的展示-->
        <template slot="empty">
          <place-holder></place-holder>
        </template>
      </el-table>

      <!-- 底部操作按钮 -->
      <div style="margin-top: 15px">
        <el-button type="primary" :disabled="disableBatchButton" @click="handleBatch(multipleSelection, 'setting')"
          >批量设置</el-button
        >
        <el-button :disabled="disableBatchButton" @click="handleBatch(multipleSelection, 'delete')">批量删除</el-button>
      </div>

      <!-- 分页区域 -->
      <el-pagination
        v-if="totalCount"
        layout="prev, pager, next, jumper, sizes, total"
        :total="totalCount"
        :page-size="pageParams.pageSize"
        :current-page="pageParams.pageNo"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      ></el-pagination>
    </div>

    <!-- 选择商品弹框 -->
    <goods-select-dialog v-model="showGoodsDialog" enable-multiple @selected="onSelectGoods" />

    <!-- 单个内购商品设置dialog -->
    <el-dialog
      title="内购商品设置"
      class="good-setting-dialog"
      :class="disItemSkuCols.length > 0 ? 'sku-good-setting-dialog' : ''"
      v-loading="goodSettingLoading"
      :visible.sync="goodSettingDialogVisible"
    >
      <!-- 普通商品 -->
      <el-form
        ref="goodSettingForm"
        :model="goodSettingForm"
        :rules="goodSettingRules"
        label-width="130px"
        v-if="disItemSkuCols.length < 1"
      >
        <el-form-item label="内购价：" prop="innerBuyPrice">
          <el-input class="setting-input" v-model="goodSettingForm.innerBuyPrice" placeholder="请输入"></el-input>
          <span>元 + </span>
          <el-input class="setting-input" v-model="goodSettingForm.innerBuyCoupon" placeholder="请输入"></el-input>
          <span>内购券</span>
        </el-form-item>

        <el-form-item label="内购数量上限：" prop="innerBuyCount">
          <el-input class="setting-input" v-model="goodSettingForm.innerBuyCount" placeholder="请输入"></el-input>
          <span>个</span>
          <div class="tips">填写"0"默认不限制内购数量</div>
        </el-form-item>

        <el-form-item label="佣金：">
          <el-radio-group v-model="goodSettingForm.commissionType">
            <el-radio :label="2" v-if="showUnifyPercent">统一佣金比例</el-radio>
            <el-radio :label="1">自定义佣金金额</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 自定义佣金金额 -->
        <el-form-item label="服务佣金：" prop="comServiceAmount" v-if="goodSettingForm.commissionType === 1">
          <el-input
            class="setting-input"
            style="width: 120px"
            v-model="goodSettingForm.comServiceAmount"
            placeholder="请输入佣金金额"
          ></el-input>
          <span>元</span>
        </el-form-item>
      </el-form>

      <!-- 多规格商品 -->
      <el-form ref="goodSettingForm" :model="goodSettingForm" :rules="goodSettingRules" v-else>
        <el-form-item prop="itemSkuList">
          <div class="dis-item-sku-box">
            <el-table :data="disItemSkuDTOList" size="mini" class="sku-table">
              <el-table-column
                v-for="col in disItemSkuCols"
                :key="col.skuId"
                :prop="col.prop"
                :label="col.label"
                :width="col.width"
                :min-width="col.minWidth"
                :max-width="col.maxWidth"
              >
                <template slot-scope="scope">
                  <!-- 内购价 -->
                  <div v-if="col.type === 'innerBuyPrice'">
                    <el-input
                      class="input"
                      v-model="scope.row[col.prop1]"
                      placeholder="请输入"
                      @input="handleCheckSkuItemList"
                    ></el-input>
                    <span>元 + </span>
                    <el-input
                      class="input"
                      v-model="scope.row[col.prop2]"
                      placeholder="请输入"
                      @input="handleCheckSkuItemList"
                    ></el-input>
                    <span>内购券{{ scope.row[col.prop] }}</span>
                  </div>
                  <!-- 佣金设置 -->
                  <div v-else-if="col.type === 'commission'">
                    <div class="commission-tab-box">
                      <span
                        class="commission-tab"
                        :class="scope.row[col.prop1] === 2 ? 'commission-active' : ''"
                        @click="handleChangeCommissionType(scope.$index)"
                        v-if="showUnifyPercent"
                        >统一佣金</span
                      >
                      <span
                        class="commission-tab"
                        :class="scope.row[col.prop1] === 1 ? 'commission-active' : ''"
                        @click="handleChangeCommissionType(scope.$index)"
                        >自定义佣金</span
                      >
                    </div>
                    <el-input
                      class="input"
                      v-model="scope.row[col.prop2]"
                      placeholder="请输入"
                      v-if="scope.row[col.prop1] === 1"
                      @input="handleCheckSkuItemList"
                    ></el-input>
                    <span v-if="scope.row[col.prop1] === 1">元</span>
                  </div>
                  <el-input
                    :class="{ 'input-success': !scope.row.hasError }"
                    :style="{ width: '100%' }"
                    v-else-if="col.type === 'input'"
                    v-model="scope.row[col.prop]"
                    @input="handleCheckSkuItemList"
                  />
                  <span v-else-if="col.type === 'money'">{{ scope.row[col.prop] | price }}</span>
                  <span v-else>{{ scope.row[col.prop] }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="goodSettingDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleGoodSetting('goodSettingForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 批量设置商品佣金dialog -->
    <el-dialog title="设置商品佣金" width="500px" v-loading="commissionLoading" :visible.sync="commissionDialogVisible">
      <el-form ref="commissionForm" :model="commissionForm" :rules="commissionRules" label-width="100px">
        <el-form-item label="佣金：">
          <el-radio-group v-model="commissionForm.commissionType">
            <el-radio :label="2" v-if="showUnifyPercent">统一佣金比例</el-radio>
            <el-radio :label="1">自定义佣金金额</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 自定义佣金金额 -->
        <el-form-item label="服务佣金：" prop="comServiceAmount" v-if="commissionForm.commissionType === 1">
          <el-input class="setting-input" v-model="commissionForm.comServiceAmount" placeholder="请输入"></el-input>
          <span>元</span>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button @click="commissionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleBatchCommission('commissionForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import './index.less';
  import { mapState } from 'vuex';
  import utils from '@/dss-common/utils/index.js';
  import placeHolder from '@/dss-common/components/placeholder/index.vue';
  import goodsCategoryCascader from '@/dss-wechat3rd/src/bz_components/goods-category-cascader/index.vue';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
  import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
  import goodsSelectDialog from '@/dss-wechat3rd/src/bz_components/goods-select-dialog/index.vue';
  import distributionApi from '@/dss-wechat3rd/src/api/distribution.js';
  import moneyUtil from '@/dss-common/utils/money.js';

  const regexpsNaturalNumber = /(^[1-9]\d{0,2}$)|(^0$)/; // 0~999之间的整数
  const regexpsPositiveInteger = /^[1-9]\d{0,2}$/; // 1~999之间的正整数
  const regexpsPrice = /(^[1-9]\d{0,6}(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/; // 0至9999999.99的数字
  const regexpsAmount = /(^[1-9]\d{0,5}(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;

  const unionKeys = ['id']; // 统一标识key集合数组，唯一id标识，可能有多个key，用于记录选中的分页数据

  export default {
    mixins: [tableCheckedHelperMixin],
    components: {
      placeHolder,
      goodsCategoryCascader,
      goodsSelectDialog,
    },

    data() {
      // 验证自定义佣金输入是否正确
      const checkInternalPurchasePrice = (rule, value, callback) => {
        // 判断为普通商品，不是多规格商品时才进行以下判断
        if (!this.disItemSkuDTOList || this.disItemSkuDTOList.length < 1) {
          const innerBuyPrice = this.goodSettingForm.innerBuyPrice;
          const innerBuyCoupon = this.goodSettingForm.innerBuyCoupon;
          const currentItemSalePrice =
            this.settingItemList[0] && this.settingItemList[0].salePrice
              ? moneyUtil.convertHundredMoneyUnit(this.settingItemList[0].salePrice, true)
              : 0;
          const commissionType = this.goodSettingForm.commissionType;
          const comServiceAmount = this.goodSettingForm.comServiceAmount;

          if (!innerBuyPrice && innerBuyPrice !== 0) {
            return callback(new Error('请输入内购价'));
          } else if (!regexpsPrice.test(innerBuyPrice)) {
            return callback(new Error('内购价为0~9999999.99之间的数字,只能保留小数点两位'));
          } else if (Number(innerBuyPrice) > Number(currentItemSalePrice)) {
            return callback(new Error('内购价不能大于商品的售价'));
          } else if (commissionType === 1 && comServiceAmount && Number(comServiceAmount) > Number(innerBuyPrice)) {
            return callback(new Error('内购价不能小于商品的佣金'));
          } else if (!innerBuyCoupon && innerBuyCoupon !== 0) {
            return callback(new Error('请输入内购券数量'));
          } else if (!regexpsPositiveInteger.test(innerBuyCoupon)) {
            return callback(new Error('内购券数量为1~999之间的正整数，并且开头不能为0'));
          }
        }

        return callback();
      };

      // 验证内购数量输入是否正确
      const checkInnerBuyCount = (rule, value, callback) => {
        // 判断为普通商品，不是多规格商品时才进行以下判断
        if (!this.disItemSkuDTOList || this.disItemSkuDTOList.length < 1) {
          if (!value && value !== 0) {
            return callback(new Error('请输入内购数量上限'));
          } else if (!regexpsNaturalNumber.test(value)) {
            return callback(new Error('内购数量上限为0~999之间的整数，并且开头不能为0'));
          }
        }

        return callback();
      };

      // 验证自定义佣金输入是否正确
      const checkCommission = (rule, value, callback) => {
        if (!value && value !== 0) {
          return callback(new Error('请输入佣金金额'));
        } else if (!regexpsAmount.test(value) || value > 100000) {
          return callback(new Error('佣金金额为0~100000之间的数字,只能保留小数点两位'));
        }

        // 单商品设置，且设置的商品为普通商品
        if (this.goodSettingDialogVisible && (!this.disItemSkuDTOList || this.disItemSkuDTOList.length < 1)) {
          const innerBuyPrice = this.goodSettingForm.innerBuyPrice;
          if (Number(value) > Number(innerBuyPrice)) {
            return callback(new Error('佣金不能大于商品的内购价'));
          }
        }

        return callback();
      };

      // 验证多规格商品输入是否正确
      const checkItemSkuList = (rule, value, callback) => {
        // 判断为多规格商品时才进行以下判断
        if (this.disItemSkuDTOList && this.disItemSkuDTOList.length > 0) {
          this.disItemSkuDTOList.forEach(item => {
            const itemSalePrice = item.salePrice ? moneyUtil.convertHundredMoneyUnit(item.salePrice, true) : 0;

            if (!item.innerBuyPrice && item.innerBuyPrice !== 0) {
              return callback(new Error('请输入内购价'));
            } else if (!regexpsPrice.test(item.innerBuyPrice)) {
              return callback(new Error('内购价为0~9999999.99之间的数字,只能保留小数点两位'));
            } else if (Number(item.innerBuyPrice) > Number(itemSalePrice)) {
              return callback(new Error('内购价不能大于商品的售价'));
            } else if (!item.innerBuyCoupon && item.innerBuyCoupon !== 0) {
              return callback(new Error('请输入内购券数量'));
            } else if (!regexpsPositiveInteger.test(item.innerBuyCoupon)) {
              return callback(new Error('内购券数量为1~999之间的正整数，并且开头不能为0'));
            } else if (!item.innerBuyCount && item.innerBuyCount !== 0) {
              return callback(new Error('请输入内购数量上限'));
            } else if (!regexpsNaturalNumber.test(item.innerBuyCount)) {
              return callback(new Error('内购数量上限为0~999之间的整数，并且开头不能为0'));
            } else if (item.commissionType === 1) {
              if (!item.comServiceAmount && item.comServiceAmount !== 0) {
                return callback(new Error('请输入佣金金额'));
              } else if (!regexpsAmount.test(item.comServiceAmount) || item.comServiceAmount > 100000) {
                return callback(new Error('佣金金额为0~100000之间的数字,只能保留小数点两位'));
              } else if (item.comServiceAmount && Number(item.comServiceAmount) > Number(item.innerBuyPrice)) {
                return callback(new Error('佣金不能大于商品的内购价'));
              }
            }
          });
        }

        return callback();
      };

      return {
        loading: false,
        elementLoadingText: null, // loading 加载提示文案

        goodsType: goodsTypeEnum.product, // 商品类型
        internalPurchaseStatusObj: null, // 内购功能状态

        activityType: 1, // 分销类型，0：全员营销；1：员工内购；-1：全部

        /** 查询条件 */
        filter: {
          categoryId: null,
          name: null,
        },

        totalCount: 0, // 总条数
        pageParams: {
          pageSize: 10, // 每页条数
          pageNo: 1, // 页数
        },

        goodsList: [], // 商品列表

        multipleSelection: [], // 当前页面选中维护的分销选项

        showGoodsDialog: false, // 是否显示选择商品弹框

        settingItemList: [], // 设置佣金的商品数组

        // 内购商品设置对话框参数
        goodSettingLoading: false,
        goodSettingDialogVisible: false,
        goodSettingForm: {
          innerBuyPrice: null,
          innerBuyCoupon: null,
          innerBuyCount: null,
          commissionType: 1,
          comServiceAmount: null,
          itemSkuList: null, // 该属性用于触发商品sku信息输入的验证
        },
        disItemSkuCols: [],
        disItemSkuDTOList: [],
        goodSettingRules: {
          innerBuyPrice: [{ required: true, validator: checkInternalPurchasePrice, trigger: ['blur', 'change'] }],
          innerBuyCount: [{ required: true, validator: checkInnerBuyCount, trigger: ['blur', 'change'] }],
          comServiceAmount: [{ required: true, validator: checkCommission, trigger: ['blur', 'change'] }],
          itemSkuList: [{ validator: checkItemSkuList, trigger: ['blur', 'change'] }],
        },

        // 设置商品佣金对话框参数
        commissionLoading: false,
        commissionDialogVisible: false,
        commissionForm: {
          commissionType: 1, // 佣金类型 1:自定义佣金金额 2：统一佣金比例
          comServiceAmount: null, // 服务佣金金额
        },
        commissionRules: {
          comServiceAmount: [{ required: true, validator: checkCommission, trigger: ['blur', 'change'] }],
        },
      };
    },

    computed: {
      ...mapState({
        curApp: 'curApp',
      }),

      // 格式化商品的营销属性
      attributeFormatter() {
        return item => {
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

      // 判断设置佣金时，是否展示统一比例选项
      showUnifyPercent() {
        // 佣金计算类型设置等于1：按单商品设置
        if (this.internalPurchaseStatusObj && this.internalPurchaseStatusObj.commissionType === 1) {
          return false;
        }
        return true;
      },
    },
    watch: {
      // 监听分类查询条件的改变，查询内购商品列表
      'filter.categoryId': {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          this.pageParams.pageNo = 1;
          this.getItemList(); // 查询内购商品列表
        },
      },
    },
    filters: {
      /**
       * 格式化时间
       */
      timeFormatter(time) {
        return utils.timeFormat(time);
      },
    },
    // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.ruleQuery(); // 分销规则查询，为了获取全局的内购功能状态
        vm.getItemList(); // 查询内购商品列表
      });
    },

    methods: {
      /**
       * 分销规则查询
       */
      ruleQuery() {
        const params = {
          activityType: this.activityType, // 分销类型，0：全员营销；1：员工内购；-1：全部
        };

        this.loading = true;
        distributionApi
          .ruleQuery(params)
          .done(res => {
            if (res.data) {
              // 内购功能状态
              const internalPurchaseStatusObj = {
                commissionType: res.data.commissionType || 1, // 佣金计算类型设置，1：按单商品设置，2：按统一比例设置
              };
              this.internalPurchaseStatusObj = internalPurchaseStatusObj;
            }
          })
          .always(res => {
            this.loading = false;
          });
      },

      // 每页条数变化
      onSizeChange(size) {
        this.pageParams.pageNo = 1;
        this.pageParams.pageSize = size;
        this.getItemList(); // 查询内购商品列表
      },
      // 翻页
      onPageChange(page) {
        this.pageParams.pageNo = page;
        this.getItemList(); // 查询内购商品列表
      },

      /**
       * 关键字搜索
       */
      onSearch() {
        this.pageParams.pageNo = 1;
        this.getItemList(); // 查询内购商品列表
      },

      /**
       * 查询内购商品列表
       */
      getItemList() {
        // 获取数据之前，需要重新计算一次选中的item
        this.mUpdateTotalListBySelection(this.goodsList, this.multipleSelection, unionKeys);

        const params = {
          activityType: this.activityType, // 分销类型，0：全员营销；1：员工内购；-1：全部
          ...this.filter,
          ...this.pageParams,
        };
        // 删除请求参数中的空值
        Object.keys(params).forEach(key => {
          if (params[key] === null || params[key] === '') {
            delete params[key];
          }
        });

        this.goodsList = [];

        this.loading = true;
        distributionApi
          .queryItemList(params)
          .done(res => {
            this.goodsList = res.data || [];
            this.totalCount = res.totalCount || 0;

            // 成功获取数据之后，重新构建pageList的选中状态
            this.mBuildMultipleTableSelection(this.goodsList, 'multipleTable', unionKeys);
          })
          .always(res => {
            this.loading = false;
          });
      },

      /**
       * 同步门店商品
       */
      handleSyncItem() {
        this.$confirm('是否确认同步商品库所有商品? ', '同步商品', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            const params = {
              activityType: this.activityType, // 分销类型，0：全员营销；1：员工内购；-1：全部
            };

            this.loading = true;
            this.elementLoadingText = '拼命同步中';
            distributionApi.internalPurchase
              .syncItem(params)
              .done(res => {
                if (res.data) {
                  this.$message.success('商品同步成功');

                  this.pageParams.pageNo = 1;
                  this.getItemList(); // 查询内购商品列表
                }
              })
              .always(res => {
                this.loading = false;
                this.elementLoadingText = null;
              });
          })
          .catch(() => {
            console.log('取消同步');
          });
      },

      /**
       * 显示商品选择弹框
       */
      onShowGoodsDialog() {
        this.showGoodsDialog = true;
      },

      /**
       * 完成商品选择，添加内购商品
       */
      onSelectGoods(itemList = []) {
        itemList.forEach(item => {
          item.activityType = this.activityType; // 分销类型，0：全员营销；1：员工内购；-1：全部
          item.comServiceAmount = null; // 自定义服务佣金金额
          item.commissionType = null; // 自定义佣金类型
          item.epId = this.curApp.epId || null;
          item.storeId = null;
          item.storeName = null;
          item.itemCreateTime = new Date(item.createTime);
          item.createTime = null;
          item.updateTime = null;
          item.categoryName = item.categoryDTO.category;
        });

        const params = itemList;

        this.loading = true;
        distributionApi.internalPurchase
          .addItemList(params)
          .done(res => {
            if (res.data) {
              this.$message.success('添加成功');

              this.pageParams.pageNo = 1;
              this.getItemList(); // 查询内购商品列表
            }
          })
          .always(res => {
            this.loading = false;
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
       */
      handleBatch(itemList, type) {
        // 每次批量操作时，主动触发一次计算全部选择的列表
        this.mUpdateTotalListBySelection(this.goodsList, this.multipleSelection, unionKeys);

        // 批量操作时，将所有被选中的列表list数据：mTotalCheckedList作为全部选择的参数
        itemList = this.mTotalCheckedList;
        if (type === 'delete') {
          this.handleDelete(itemList); // 删除商品
        } else {
          this.handleSetting(itemList, true); // 设置商品佣金
        }
      },

      /**
       * 删除商品
       */
      handleDelete(itemList = []) {
        this.$confirm('是否确认删除当前内购商品? ', '删除商品', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            const disItemIdList = [];
            itemList.forEach(item => {
              disItemIdList.push(item.id);
            });

            const params = disItemIdList;

            this.loading = true;
            distributionApi.internalPurchase
              .deleteItem(params)
              .done(res => {
                if (res.data) {
                  this.$message.success('删除成功');

                  this.emptyMultipleSelection(); // 批量操作成功之后，清空之前选中的操作数据列表

                  this.pageParams.pageNo = 1;
                  this.getItemList(); // 查询内购商品列表
                }
              })
              .always(res => {
                this.loading = false;
              });
          })
          .catch(() => {
            console.log('取消删除');
          });
      },

      /**
       * 设置商品佣金：显示佣金设置对话弹框
       * itemList 设置佣金的商品数组
       * isBatch 是否批量操作
       */
      handleSetting(itemList, isBatch = false) {
        this.commissionForm = {
          commissionType: 1, // 佣金类型 1:自定义佣金金额 2：统一佣金比例
          comServiceAmount: null, // 服务佣金
        };

        // 判断是否设置单个内购商品，是则将该商品的佣金类型 commissionType 赋值给佣金设置对话弹框
        if (!isBatch) {
          // 清除旧的商品sku信息
          this.disItemSkuCols = [];
          this.disItemSkuDTOList = [];
          const disItemSkuDTOList = itemList[0] ? itemList[0].disItemSkuDTOList : [];
          if (disItemSkuDTOList && disItemSkuDTOList.length > 0) {
            // 重新封装调配商品sku表格数据
            this.assembleSkuTableData(disItemSkuDTOList);
          } else {
            const innerBuyPrice =
              itemList[0].innerBuyPrice || itemList[0].innerBuyPrice === 0
                ? moneyUtil.convertHundredMoneyUnit(itemList[0].innerBuyPrice, true)
                : null;
            const innerBuyCoupon = itemList[0].innerBuyCoupon ? itemList[0].innerBuyCoupon : null;
            const innerBuyCount =
              itemList[0].innerBuyCount || itemList[0].innerBuyCount === 0 ? itemList[0].innerBuyCount : null;
            const comServiceAmount =
              itemList[0].comServiceAmount || itemList[0].comServiceAmount === 0
                ? moneyUtil.convertHundredMoneyUnit(itemList[0].comServiceAmount, true)
                : null;

            this.goodSettingForm = {
              innerBuyPrice: innerBuyPrice,
              innerBuyCoupon: innerBuyCoupon,
              innerBuyCount: innerBuyCount,
              commissionType: itemList[0].commissionType || 1,
              comServiceAmount: comServiceAmount,
              itemSkuList: null,
            };
          }
        }

        this.settingItemList = itemList; // 设置佣金的商品数组

        // 判断是否批量设置
        if (!isBatch) {
          this.goodSettingDialogVisible = true; // 显示内购商品设置对话弹框
        } else {
          this.commissionDialogVisible = true; // 显示佣金设置对话弹框
        }
      },

      /**
       * 重新封装调配商品sku表格数据
       */
      assembleSkuTableData(itemSkuInfoList = []) {
        const col = itemSkuInfoList[0].skuInfoNames;
        if (col && col.length > 0) {
          col.forEach((item, index) => {
            this.disItemSkuCols.push({
              prop: `valName_${index}`,
              label: item.keyName,
              width: 100,
            });
          });

          this.disItemSkuCols.push({
            prop: 'salePrice',
            label: '售价(元)',
            type: 'money',
            width: 100,
          });
          this.disItemSkuCols.push({
            prop1: 'innerBuyPrice',
            prop2: 'innerBuyCoupon',
            label: '内购价',
            type: 'innerBuyPrice',
            width: 280,
          });
          this.disItemSkuCols.push({
            prop: 'innerBuyCount',
            label: '内购数量上限',
            type: 'input',
            width: 120,
          });
          this.disItemSkuCols.push({
            prop1: 'commissionType',
            prop2: 'comServiceAmount',
            label: '佣金设置',
            type: 'commission',
            width: 300,
          });
        }

        // 填充默认价格
        itemSkuInfoList.forEach(item => {
          if (!item.salePrice) {
            item.salePrice = this.defaultPrice;
          }
          if (!item.labelPrice) {
            item.labelPrice = this.labelPrice;
          }
        });

        itemSkuInfoList.forEach(item => {
          const innerBuyPrice =
            item.innerBuyPrice || item.innerBuyPrice === 0
              ? moneyUtil.convertHundredMoneyUnit(item.innerBuyPrice, true)
              : null;
          const innerBuyCoupon = item.innerBuyCoupon ? item.innerBuyCoupon : null;
          const innerBuyCount = item.innerBuyCount || item.innerBuyCount === 0 ? item.innerBuyCount : null;
          const comServiceAmount =
            item.comServiceAmount || item.comServiceAmount === 0
              ? moneyUtil.convertHundredMoneyUnit(item.comServiceAmount, true)
              : null;

          const tableRow = {
            appId: item.appId,
            disItemId: item.disItemId,
            itemNo: item.itemNo,
            skuId: item.skuId,
            salePrice: item.salePrice,
            innerBuyPrice: innerBuyPrice,
            innerBuyCoupon: innerBuyCoupon,
            innerBuyCount: innerBuyCount,
            commissionType: item.commissionType || 1,
            comServiceAmount: comServiceAmount,
          };

          if (item.skuInfoNames && item.skuInfoNames.length > 0) {
            item.skuInfoNames.forEach((skuItem, index) => {
              tableRow[`valName_${index}`] = skuItem.valName;
            });
          }

          this.disItemSkuDTOList.push(tableRow);
        });
      },

      /**
       * 多规格商品切换佣金类型
       */
      handleChangeCommissionType(index) {
        // 判断有统一比例时，才允许切换佣金类型
        if (this.showUnifyPercent) {
          if (this.disItemSkuDTOList && this.disItemSkuDTOList.length > 0) {
            this.disItemSkuDTOList[index].commissionType = this.disItemSkuDTOList[index].commissionType === 1 ? 2 : 1;
          }
          // 手动触发多规格商品输入验证
          this.$refs.goodSettingForm.validateField('itemSkuList');
        }
      },

      /**
       * 手动触发多规格商品输入验证
       */
      handleCheckSkuItemList() {
        this.$refs.goodSettingForm.validateField('itemSkuList');
      },

      /**
       * 单个内购商品设置
       */
      handleGoodSetting(formName) {
        this.$refs[formName].validate(valid => {
          if (!valid) {
            return false;
          }

          const disItemDTOList = this.$plain(this.settingItemList);
          // 判断是普通商品还是有sku信息的商品
          if (!this.disItemSkuDTOList || this.disItemSkuDTOList < 1) {
            const goodSettingForm = this.$plain(this.goodSettingForm);
            delete goodSettingForm.itemSkuList;
            Object.keys(goodSettingForm).forEach(key => {
              // 内购价及自定义佣金参数转换单位为分的数额
              if (key === 'innerBuyPrice' || key === 'comServiceAmount') {
                goodSettingForm[key] = moneyUtil.convertHundredMoneyUnit(Number(goodSettingForm[key]), false);
              } else {
                goodSettingForm[key] = Number(goodSettingForm[key]);
              }
              disItemDTOList[0][key] = goodSettingForm[key];
            });
            if (disItemDTOList[0].commissionType === 2) {
              delete disItemDTOList[0].comServiceAmount;
            }
          } else {
            const disItemSkuDTOList = this.$plain(this.disItemSkuDTOList);
            disItemSkuDTOList.forEach(item => {
              Object.keys(item).forEach(key => {
                // 内购价及自定义佣金参数转换单位为分的数额
                if (key === 'innerBuyPrice' || key === 'comServiceAmount') {
                  item[key] = moneyUtil.convertHundredMoneyUnit(Number(item[key]), false);
                }
                // 内购券数量及内购数量上限参数转换为数字类型
                if (key === 'innerBuyCoupon' || key === 'innerBuyCount') {
                  item[key] = Number(item[key]);
                }
              });
              if (item.commissionType === 2) {
                delete item.comServiceAmount;
              }
            });
            disItemDTOList[0].disItemSkuDTOList = disItemSkuDTOList;
          }

          this.goodSettingDialogVisible = false; // 隐藏内购商品设置对话弹框

          this.saveCommissionSetting(disItemDTOList, 'goodSettingDialogVisible'); // 执行商品设置接口
        });
      },

      /**
       * 批量设置佣金
       */
      handleBatchCommission(formName) {
        this.$refs[formName].validate(valid => {
          if (!valid) {
            return false;
          }

          // 将设置的商品佣金参数赋值到请求参数disItemDTOList中
          const disItemDTOList = this.$plain(this.settingItemList);
          const commissionForm = this.$plain(this.commissionForm);
          Object.keys(commissionForm).forEach(key => {
            // 自定义佣金参数转换单位为分的数额
            if (key === 'comServiceAmount') {
              commissionForm[key] = moneyUtil.convertHundredMoneyUnit(Number(commissionForm[key]), false);
            }

            if (disItemDTOList.length === 1) {
              disItemDTOList[0][key] = commissionForm[key];
              disItemDTOList[0].activityType = this.activityType; // 分销类型，0：全员营销；1：员工内购；-1：全部
            } else {
              disItemDTOList.forEach(item => {
                item[key] = commissionForm[key];
                item.activityType = this.activityType; // 分销类型，0：全员营销；1：员工内购；-1：全部
              });
            }
          });

          this.commissionDialogVisible = false; // 隐藏佣金设置对话弹框

          this.saveCommissionSetting(disItemDTOList, 'commissionDialogVisible'); // 执行商品设置接口
        });
      },

      /**
       * 执行商品设置接口
       * disItemDTOList 执行操作的商品列表
       * dialogName 用于显示隐藏的对话弹框名称
       */
      saveCommissionSetting(disItemDTOList, dialogName) {
        const params = disItemDTOList;

        this.loading = true;
        distributionApi.internalPurchase
          .setItemCommission(params)
          .then(res => {
            if (res.data) {
              this.$message.success('设置成功');

              this.emptyMultipleSelection(); // 批量操作成功之后，清空之前选中的操作数据列表

              this.pageParams.pageNo = 1;
              this.getItemList(); // 查询内购商品列表
            }
          })
          .catch(err => {
            // 接口执行失败
            if (dialogName) {
              this[dialogName] = true; // 重新显示具体的对话弹框
            }
          })
          .always(res => {
            this.loading = false;
          });
      },
    },
  };
</script>
