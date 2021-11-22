<template>
  <switch-store-tip class="goods-setting">
    <!-- 顶部操作区域 -->
    <div class="Add-Manage-Button">
      <el-button @click="handleSyncItem" :disabled="isDisabled">同步商品库批量添加</el-button>
      <el-button type="primary" @click="onShowGoodsDialog" :disabled="isDisabled">选择添加</el-button>
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

    <!-- 分销商品列表 -->
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

        <el-table-column label="标价" min-width="100">
          <template slot-scope="scope">
            <span>￥{{ scope.row.labelPrice | price }}</span>
          </template>
        </el-table-column>

        <el-table-column label="售价" min-width="100">
          <template slot-scope="scope">
            <span>￥{{ scope.row.salePrice | price }}</span>
          </template>
        </el-table-column>

        <el-table-column label="营销属性" min-width="90">
          <span slot-scope="scope" class="ellipsis">{{ attributeFormatter(scope.row) }}</span>
        </el-table-column>

        <el-table-column label="推广佣金" min-width="90">
          <template slot-scope="scope">
            <!-- 判断推广佣金是否为首单佣金或该商品的佣金类型是否为1：自定义佣金金额  -->
            <span
              v-if="
                (allMarketingStatusObj && allMarketingStatusObj.comFrequencyMode === 1) ||
                scope.row.commissionType === 1
              "
              >￥{{ scope.row.extensionAmount | price }}</span
            >
            <span v-else>{{ scope.row.extensionPercent }}%</span>
          </template>
        </el-table-column>

        <el-table-column label="服务佣金" min-width="90" v-if="showComService">
          <template slot-scope="scope">
            <!-- 判断该商品的佣金类型是否为1：自定义佣金金额 -->
            <span v-if="scope.row.commissionType === 1">￥{{ scope.row.serviceAmount | price }}</span>
            <span v-else>{{ scope.row.servicePercent }}%</span>
          </template>
        </el-table-column>

        <el-table-column label="更新时间" prop="updateTime" min-width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime | timeFormatter }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" v-if="showOperationBar && !isDisabled">
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
      <div style="margin-top: 15px" v-if="!isDisabled">
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
    <goods-select-dialog v-model="showGoodsDialog" enable-multiple goods-belong="store" @selected="onSelectGoods" />

    <!-- 设置商品佣金dialog -->
    <el-dialog title="设置商品佣金" width="500px" v-loading="commissionLoading" :visible.sync="commissionDialogVisible">
      <el-form ref="commissionForm" :model="commissionForm" :rules="commissionRules" label-width="100px">
        <el-form-item label="佣金：">
          <el-radio-group v-model="commissionForm.commissionType">
            <el-radio :label="2" v-if="showUnifyPercent">统一佣金比例</el-radio>
            <el-radio :label="1">自定义佣金金额</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 自定义佣金金额 -->
        <div class="amount-box" v-if="commissionForm.commissionType === 1">
          <el-form-item label="推广佣金：" prop="comExtensionAmount" v-if="showComExtension">
            <el-input
              class="setting-input"
              style="width: 120px"
              v-model="commissionForm.comExtensionAmount"
              placeholder="请输入佣金金额"
            ></el-input>
            <span>元</span>
          </el-form-item>

          <el-form-item label="服务佣金：" prop="comServiceAmount" v-if="showComService">
            <el-input
              class="setting-input"
              style="width: 120px"
              v-model="commissionForm.comServiceAmount"
              placeholder="请输入佣金金额"
            ></el-input>
            <span>元</span>
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer">
        <el-button @click="commissionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCommission('commissionForm')">确 定</el-button>
      </div>
    </el-dialog>
  </switch-store-tip>
</template>

<script>
  import './index.less';
  import { mapState } from 'vuex';
  import utils from '@/dss-common/utils/index.js';
  import SwitchStoreTip from '@/business-common/components/switch-store-tip/index.vue';
  import placeHolder from '@/dss-common/components/placeholder/index.vue';
  import goodsCategoryCascader from '@/dss-wechat3rd/src/bz_components/goods-category-cascader/index.vue';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
  import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
  import goodsSelectDialog from '@/dss-wechat3rd/src/bz_components/goods-select-dialog/index.vue';
  import distributionApi from '@/dss-wechat3rd/src/api/distribution.js';
  import moneyUtil from '@/dss-common/utils/money.js';

  const regexpsAmount = /^(([1-9]\d{1,4}|[1-9])(\.\d{1,2})?|0\.[1-9]\d|0\.\d[1-9]|0\.[1-9])$/;

  const unionKeys = ['id']; // 统一标识key集合数组，唯一id标识，可能有多个key，用于记录选中的分页数据

  export default {
    mixins: [tableCheckedHelperMixin],
    components: {
      SwitchStoreTip,
      placeHolder,
      goodsCategoryCascader,
      goodsSelectDialog,
    },

    data() {
      // 验证自定义佣金输入是否正确
      const checkCommission = (rule, value, callback) => {
        // 佣金类型为1：自定义佣金金额
        if (this.commissionForm.commissionType === 1) {
          if (!regexpsAmount.test(value) && value != 100000) {
            return callback(new Error('允许输入佣金金额为0.01~100000，保留两位小数'));
          }
        }
        return callback();
      };

      return {
        loading: false,
        elementLoadingText: null, // loading 加载提示文案

        goodsType: goodsTypeEnum.product, // 商品类型
        allMarketingStatusObj: null, // 分销商品功能状态

        activityType: 0, // 分销类型，0：全员营销；1：员工内购；-1：全部

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

        // 设置商品佣金对话框参数
        commissionLoading: false,
        commissionDialogVisible: false,
        commissionForm: {
          commissionType: 1, // 佣金类型 1:自定义佣金金额 2：统一佣金比例
          comExtensionAmount: null, // 推广佣金金额
          comServiceAmount: null, // 服务佣金金额
        },
        commissionRules: {
          comExtensionAmount: [
            { required: true, message: '请输入推广佣金金额', trigger: ['blur', 'change'] },
            { validator: checkCommission, trigger: ['blur', 'change'] },
          ],
          comServiceAmount: [
            { required: true, message: '请输入服务佣金金额', trigger: ['blur', 'change'] },
            { validator: checkCommission, trigger: ['blur', 'change'] },
          ],
        },
      };
    },

    computed: {
      ...mapState({
        curApp: 'curApp',
        curStore: 'curStore',
      }),

      // 判断否禁止编辑分销商品
      isDisabled() {
        // 开启分销商品功能
        if (this.allMarketingStatusObj && this.allMarketingStatusObj.disStatus) {
          return false;
        }
        return true;
      },

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

      // 判断是否展示服务推广，用于判断自定义佣金弹框
      showComExtension() {
        // 推广佣金结算模式等于1：首单结算模式
        if (this.allMarketingStatusObj && this.allMarketingStatusObj.comFrequencyMode === 1) {
          return false;
        }
        return true;
      },
      // 判断是否展示服务佣金
      showComService() {
        // 分销模式不等于2：推广+服务模式
        if (this.allMarketingStatusObj && this.allMarketingStatusObj.disMode !== 2) {
          return false;
        }
        return true;
      },

      // 判断是否展示操作栏
      showOperationBar() {
        if (
          this.allMarketingStatusObj &&
          this.allMarketingStatusObj.disMode === 1 && // 分销模式为1：推广模式
          this.allMarketingStatusObj.comFrequencyMode === 1 // 推广佣金结算模式等于1：首单结算模式
        ) {
          return false;
        }
        return true;
      },

      // 判断设置佣金时，是否展示统一比例选项
      showUnifyPercent() {
        // 佣金计算类型设置等于1：按单商品设置
        if (this.allMarketingStatusObj && this.allMarketingStatusObj.commissionType === 1) {
          return false;
        }
        return true;
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
      // 监听分类查询条件的改变，查询分销商品列表
      'filter.categoryId': {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (!!this.curStore && !!this.curStore.id) {
            this.pageParams.pageNo = 1;
            this.getItemList(); // 查询分销商品列表
          }
        },
      },
      // 监听门店切换
      curStore: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (!!newVal && !!newVal.id) {
            this.pageParams.pageNo = 1;
            this.getItemList(); // 查询分销商品列表
            this.ruleQuery(); // 查询配置规格
          }
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
        if (!!vm.curStore && !!vm.curStore.id) {
          vm.ruleQuery(); // 分销规则查询，为了获取全局的分销商品功能状态
          vm.getItemList(); // 查询分销商品列表
        }
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
              // 分销商品功能状态
              const allMarketingStatusObj = {
                disStatus: res.data.disStatus || 0, // 分销商品功能开启状态，0：关闭，1：开启；默认为0：关闭
                disMode: res.data.disMode || 1, // 分销模式，1：推广模式，2：推广+服务模式；默认为1：推广模式
                comFrequencyMode: res.data.comFrequencyMode || 2, // 推广佣金结算模式，1：首单结算模式，2：每笔订单结算模式
                commissionType: res.data.commissionType || 1, // 佣金计算类型设置，1：按单商品设置，2：按统一比例设置
              };
              this.allMarketingStatusObj = allMarketingStatusObj;
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
        this.getItemList(); // 查询分销商品列表
      },
      // 翻页
      onPageChange(page) {
        this.pageParams.pageNo = page;
        this.getItemList(); // 查询分销商品列表
      },

      /**
       * 关键字搜索
       */
      onSearch() {
        this.pageParams.pageNo = 1;
        this.getItemList(); // 查询分销商品列表
      },

      /**
       * 查询分销商品列表
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
            distributionApi.allMarketing
              .syncItem(params)
              .done(res => {
                if (res.data) {
                  this.$message.success('商品同步成功');

                  this.pageParams.pageNo = 1;
                  this.getItemList(); // 查询分销商品列表
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
       * 完成商品选择，添加分销商品
       */
      onSelectGoods(itemList = []) {
        itemList.forEach(item => {
          item.activityType = this.activityType; // 分销类型，0：全员营销；1：员工内购；-1：全部
          item.comExtensionAmount = null; // 自定义推广佣金金额
          item.comServiceAmount = null; // 自定义服务佣金金额
          item.commissionType = null; // 自定义佣金类型
          item.epId = this.curApp.epId || null;
          item.storeId = this.curStore.id || null;
          item.storeName = this.curStore.name || null;
          item.itemCreateTime = new Date(item.createTime);
          item.createTime = null;
          item.updateTime = null;
          item.disItemSkuDTOList = null;
          item.categoryName = item.categoryDTO.category;
        });

        const params = itemList;

        this.loading = true;
        distributionApi.allMarketing
          .addItemList(params)
          .done(res => {
            if (res.data) {
              this.$message.success('添加成功');

              this.pageParams.pageNo = 1;
              this.getItemList(); // 查询分销商品列表
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
        this.$confirm('是否确认删除当前分销商品? ', '删除商品', {
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
            distributionApi.allMarketing
              .deleteItem(params)
              .done(res => {
                if (res.data) {
                  this.$message.success('删除成功');

                  this.emptyMultipleSelection(); // 批量操作成功之后，清空之前选中的操作数据列表

                  this.pageParams.pageNo = 1;
                  this.getItemList(); // 查询分销商品列表
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
          comExtensionAmount: null, // 推广佣金
          comServiceAmount: null, // 服务佣金
        };

        // 判断是否设置单个分销商品，是则将该商品的佣金类型 commissionType 赋值给佣金设置对话弹框
        if (!isBatch) {
          this.commissionForm = {
            commissionType: itemList[0].commissionType || 1, // 佣金类型 1:自定义佣金金额 2：统一佣金比例
            comExtensionAmount: moneyUtil.convertHundredMoneyUnit(itemList[0].comExtensionAmount, true) || null, // 推广佣金
            comServiceAmount: moneyUtil.convertHundredMoneyUnit(itemList[0].comServiceAmount, true) || null, // 服务佣金
          };
        }

        this.commissionDialogVisible = true; // 显示佣金设置对话弹框
        this.settingItemList = itemList; // 设置佣金的商品数组
      },

      /**
       * 验证自定义佣金是否符合及给予温馨提示
       */
      handleCommission() {
        this.$refs.commissionForm.validate(valid => {
          if (!valid) {
            return false;
          }

          // 将设置的商品佣金参数赋值到请求参数disItemDTOList中
          const disItemDTOList = this.$plain(this.settingItemList);
          const commissionForm = this.$plain(this.commissionForm);
          Object.keys(commissionForm).forEach(key => {
            // 自定义佣金参数转换为数字类型
            if (
              key === 'comExtensionAmount' || // 推广佣金金额
              key === 'comServiceAmount' // 服务佣金金额
            ) {
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

          if (
            disItemDTOList.length === 1 && // 判断是否设置单个分销商品
            disItemDTOList[0].commissionType === 1 // 判断佣金类型 1:自定义佣金金额 2：统一佣金比例
          ) {
            let totalommission = null;
            // 判断是否展示服务佣金，即分销模式为2：推广+服务模式
            if (this.showComService) {
              totalommission = disItemDTOList[0].comExtensionAmount + disItemDTOList[0].comServiceAmount;
            } else {
              totalommission = disItemDTOList[0].comExtensionAmount;
            }

            // 判断总佣金是否大于商品售价
            if (totalommission > disItemDTOList[0].salePrice) {
              this.$confirm('当前佣金总额大于售价，存在风险，是否保持设置? ', '设置商品佣金', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                customClass: 'wkt-warning',
              })
                .then(() => {
                  this.saveCommissionSetting(disItemDTOList); // 执行佣金设置保存接口
                })
                .catch(() => {
                  console.log('取消设置');
                });
              return;
            }
          }

          this.saveCommissionSetting(disItemDTOList); // 执行佣金设置保存接口
        });
      },

      /**
       * 执行佣金设置保存接口
       */
      saveCommissionSetting(disItemDTOList) {
        const params = disItemDTOList;

        this.loading = true;
        distributionApi.allMarketing
          .setItemCommission(params)
          .then(res => {
            if (res.data) {
              this.$message.success('设置成功');

              this.commissionDialogVisible = false; // 隐藏佣金设置对话弹框

              this.emptyMultipleSelection(); // 批量操作成功之后，清空之前选中的操作数据列表

              this.pageParams.pageNo = 1;
              this.getItemList(); // 查询分销商品列表
            }
          })
          .always(res => {
            this.loading = false;
          });
      },
    },
  };
</script>
