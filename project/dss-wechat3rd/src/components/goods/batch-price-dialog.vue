<template>
  <el-dialog
    title="门店价格设置"
    :visible.sync="dialogVisible"
    class="batch-price-update-dialog"
    v-loading="loading"
    width="850px"
    @close="onCloseDialog"
  >
    <!-- 选中的商品列表tab -->
    <template v-if="goodsItemList && goodsItemList.length">
      <!-- 快速改价 -->
      <div class="toolbar">
        快速填充：
        <el-form inline>
          <el-form-item label="售价">
            <el-input-number
              v-model="salePricePercent"
              :disabled="isForbidModifySalesPrice"
              :min="0"
              :max="1000"
              controls-position="right"
              size="small"
            />
            %
          </el-form-item>
          <el-form-item label="标价">
            <el-input-number
              v-model="labelPricePercent"
              :disabled="isForbidModifyLabelPrice"
              :min="0"
              :max="1000"
              controls-position="right"
              size="small"
            />
            %
          </el-form-item>
        </el-form>
        <el-button @click="handleBatchModify" class="toolbar-btn">快速填充</el-button>
        <el-button @click="handleRound">取整</el-button>
      </div>

      <div style="text-align: left">确认后，快速填充价将覆盖以下所有商品，请确认已将例外商品价格锁定，锁定后，快速填充对该商品不生效</div>

      <el-tabs v-model="curGoodsItemIndex" @tab-click="onTabChange" class="goods-tabs">
        <el-tab-pane v-for="(item, i) in goodsItemList" :key="i">
          <span class="tab-label" slot="label" :title="item.wxItem.name">{{ item.wxItem.name }}</span>
        </el-tab-pane>
      </el-tabs>

      <div class="limit-price" v-if="salePriceCheck">
        <span>
          最低售价：{{
            itemList && itemList.length > 0 && itemList[0].minItemPrice !== null && itemList[0].minItemPrice !== 0
              ? itemList[0].minItemPrice
              : '--'
          }}
        </span>
        <span style="margin-left: 40px">
          最高售价：{{
            itemList && itemList.length > 0 && itemList[0].maxItemPrice !== null && itemList[0].maxItemPrice !== 0
              ? itemList[0].maxItemPrice
              : '--'
          }}
        </span>
        <span style="margin-left: auto">
          <i class="el-icon-question" />
          改价说明：不得突破最高/最低售价限制，售价不得高于标价</span
        >
      </div>
      <el-table v-if="skuInfoList && skuInfoList.length > 0" :data="colsValue" class="skuInfo-table">
        <el-table-column v-for="(item, index) in cols" :label="item.label" :key="item.prop" min-width="240px">
          <template slot-scope="scope">
            <div class="goods-attribute" v-if="!item.type || !item.type === 'input'" :title="scope.row[item.prop]">
              {{ scope.row[item.prop] }}
              <div v-if="index === 0" style="color: #999">
                原售价：¥{{ scope.row.appSalePrice }} / 原标价：¥{{ scope.row.appLabelPrice }}
              </div>
            </div>
            <div class="flex-col" v-else-if="item.type && item.type === 'input'" :key="scope.row.itemNo">
              <div class="tip-input">
                <el-input
                  v-model="scope.row[item.prop]"
                  size="small"
                  type="number"
                  class="input-price"
                  :disabled="!!scope.row.notOptional || (item.prop === 'labelPrice' ? isForbidModifyLabelPrice : isForbidModifySalesPrice)"
                  @change="onSkuInfoChange"
                ></el-input>
                <span class="tip" v-if="scope.row[item.prop + 'Tip']">{{ scope.row[item.prop + 'Tip'] }}</span>
              </div>
              <el-checkbox
                @change="onSkuInfoChange"
                :disabled="!!scope.row.notOptional || (item.prop === 'labelPrice' ? isForbidModifyLabelPrice : isForbidModifySalesPrice)"
                v-model="scope.row[item.prop + 'Lock']"
                >锁定</el-checkbox
              >
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-table v-else-if="itemList && itemList.length > 0" :data="itemList" class="item-table">
        <el-table-column prop="name" label="商品" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.name }}</div>
            <div style="color: #999">
              原售价：¥{{ scope.row.appSalePrice }} / 原标价：¥{{ scope.row.appLabelPrice }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="售价(元)">
          <template slot-scope="scope">
            <div class="flex-col" :key="scope.row.itemNo">
              <div class="tip-input">
                <el-input
                  v-model="scope.row.salePrice"
                  size="small"
                  type="number"
                  class="input-price"
                  :disabled="isForbidModifySalesPrice"
                  @change="onPricechange"
                ></el-input>
                <span class="tip" v-if="scope.row.salePriceTip">{{ scope.row.salePriceTip }}</span>
              </div>
              <el-checkbox
                @change="onPricechange"
                v-model="scope.row.salePriceLock"
                :disabled="isForbidModifySalesPrice"
                >锁定</el-checkbox
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column label="标价(元)">
          <template slot-scope="scope">
            <div class="flex-col" :key="scope.row.itemNo">
              <div class="tip-input">
                <el-input
                  v-model="scope.row.labelPrice"
                  size="small"
                  type="number"
                  class="input-price"
                  :disabled="isForbidModifyLabelPrice"
                  @change="onPricechange"
                ></el-input>
                <span class="tip" v-if="scope.row.labelPriceTip">{{ scope.row.labelPriceTip }}</span>
              </div>
              <el-checkbox
                @change="onPricechange"
                v-model="scope.row.labelPriceLock"
                :disabled="isForbidModifyLabelPrice"
                >锁定</el-checkbox
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <div class="nodata-tips" v-else>暂无数据</div>

    <div slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import moneyUtil from '@/dss-common/utils/money';

export default {
  name: 'batchItemPriceUpdateDialog',

  props: {
    storeId: {
      type: [String, Number],
      default: null
    },
    // 是否需最低最高售价校验
    salePriceCheck: {
      type: Boolean,
      default: false
    },

    // 是否禁止编辑原价标签
    isForbidModifyLabelPrice: {
      type: Boolean,
      default: false
    },

    // 是否禁止编辑售价
    isForbidModifySalesPrice: {
      type: Boolean,
      default: false
    },

    // 修改的商品单号集合
    itemNoStrList: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      loading: false,
      dialogVisible: false, // 是否显示对话弹框

      skuInfoList: [], // 商品sku信息
      itemList: [], // 商品信息
      cols: [], // table表头列
      colsValue: [], // table表格数据

      goodsItemList: [],
      curGoodsItemIndex: 0,
      curGoodsItem: null,
      salePricePercent: 100,
      labelPricePercent: 100
    };
  },

  watch: {
    //监听sku信息的变化，以便组装数据
    skuInfoList: {
      immediate: true,
      handler(newVal, oldVal) {
        this.cols = [];
        this.colsValue = [];
        if (newVal && newVal.length) {
          this.assembleSkuTableData();
        }
      }
    }
  },

  mounted() {
    this.batchGetGoodsDetail(); // 查询商品详情
  },

  methods: {
    /**
     * 批量查询商品详情
     */
    batchGetGoodsDetail() {
      const params = {
        itemNoStrList: this.itemNoStrList,
        storeId: this.storeId,
        pageSize: 1000, // 接口限制入参需携带分页
        pageNo: 1
      };

      services
        .post(constants.Api.store.batchItemDetail, params, {
          headers: {
            'Content-Type': 'application/json'
          },
          transformRequest: function(data, config, test) {
            return JSON.stringify(data);
          },
          action: '获取商品详情'
        })
        .done(res => {
          if (res.data) {
            this.goodsItemList = res.data || [];
            // 价格比例转换
            this.assemblePriceData(true);

            // 保留最初的价格，用于快速改价
            this.originGoodsItemList = this.$plain(this.goodsItemList);

            this.curGoodsItem = this.$plain(this.goodsItemList[+this.curGoodsItemIndex]);
            this.skuInfoList =
              this.curGoodsItem && this.curGoodsItem.skuInfoList && this.curGoodsItem.skuInfoList.length > 0
                ? this.$plain(this.curGoodsItem.skuInfoList)
                : [];
            this.itemList.push(this.$plain(this.curGoodsItem.wxItem));
          }
        })
        .always(() => {
          this.dialogVisible = true; // 打开对话弹框
          this.$emit('unLoading'); // 通知父级隐藏loading
        });
    },
    /**
     * 将商品信息相关价格按比例转换
     */
    assemblePriceData(isFromServer = true) {
      this.goodsItemList.forEach(item => {
        if (item && item.skuInfoList && item.skuInfoList.length) {
          item.skuInfoList.forEach(_skuItem => {
            _skuItem.salePrice = moneyUtil.convertHundredMoneyUnit(_skuItem.salePrice, isFromServer);
            _skuItem.labelPrice = moneyUtil.convertHundredMoneyUnit(_skuItem.labelPrice, isFromServer);

            _skuItem.appSalePrice = moneyUtil.convertHundredMoneyUnit(_skuItem.appSalePrice, isFromServer);
            _skuItem.appLabelPrice = moneyUtil.convertHundredMoneyUnit(_skuItem.appLabelPrice, isFromServer);
          });
        }

        if (item && item.wxItem) {
          item.wxItem.salePrice = moneyUtil.convertHundredMoneyUnit(item.wxItem.salePrice, isFromServer);
          item.wxItem.labelPrice = moneyUtil.convertHundredMoneyUnit(item.wxItem.labelPrice, isFromServer);

          item.wxItem.appSalePrice = moneyUtil.convertHundredMoneyUnit(item.wxItem.appSalePrice, isFromServer);
          item.wxItem.appLabelPrice = moneyUtil.convertHundredMoneyUnit(item.wxItem.appLabelPrice, isFromServer);
        }

        // 判断是否需校验价格范围
        if (this.salePriceCheck) {
          item.wxItem.minItemPrice = item.wxItem.minItemPrice
            ? moneyUtil.convertHundredMoneyUnit(item.wxItem.minItemPrice, true)
            : null;
          item.wxItem.maxItemPrice = item.wxItem.maxItemPrice
            ? moneyUtil.convertHundredMoneyUnit(item.wxItem.maxItemPrice, true)
            : null;
        }
      });
    },
    /**
     * 检验商品列表价格
     */
    validateItemPrice() {
      let errorDesc = null; // 错误提示，用于判断是否有错误，以便给予提示以及阻止保存
      let goodsItemList = this.$plain(this.goodsItemList);
      const validate = (goodsItemList || [])
        .map(item => {
          if (item.skuInfoList && item.skuInfoList.length > 0) {
            // 遍历判断sku信息里面的售价或标价输入的值是否失效
            const isInvalid = item.skuInfoList.some(sil => {
              if (sil.notOptional) return false;
              return !this.isValidate(sil.salePrice) || !this.isValidate(sil.labelPrice);
            });

            if (isInvalid) {
              return false;
            }

            // 判断是否需校验价格范围
            if (this.salePriceCheck) {
              item.wxItem.minItemPrice =
                item.wxItem.minItemPrice !== '' && item.wxItem.minItemPrice !== null
                  ? moneyUtil.convertHundredMoneyUnit(item.wxItem.minItemPrice, false)
                  : null;
              item.wxItem.maxItemPrice =
                item.wxItem.maxItemPrice !== '' && item.wxItem.maxItemPrice !== null
                  ? moneyUtil.convertHundredMoneyUnit(item.wxItem.maxItemPrice, false)
                  : null;
            }

            item.skuInfoList.forEach((sil, index) => {
              sil.salePrice = moneyUtil.convertHundredMoneyUnit(sil.salePrice, false);
              sil.labelPrice = moneyUtil.convertHundredMoneyUnit(sil.labelPrice, false);

              if (sil.notOptional) return;
              // 判断skuInfo中商品售价是否大于标价，以便给予错误提示
              if (sil.salePrice > sil.labelPrice) {
                errorDesc = '商品售价不能大于商品标价';
              }

              if (this.salePriceCheck) {
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
              }
            });
          }

          if (item.wxItem) {
            // 判断商品对象里面的售价或标价输入的值是否失效
            if (!this.isValidate(item.wxItem.salePrice)) {
              return false;
            }
            if (!this.isValidate(item.wxItem.labelPrice)) {
              return false;
            }

            item.wxItem.salePrice = moneyUtil.convertHundredMoneyUnit(item.wxItem.salePrice, false);
            item.wxItem.labelPrice = moneyUtil.convertHundredMoneyUnit(item.wxItem.labelPrice, false);

            // 判断商品售价是否大于标价，以便给予错误提示
            if (item.wxItem.salePrice > item.wxItem.labelPrice) {
              errorDesc = '商品售价不能大于商品标价';
            }

            // 判断是否需校验价格范围
            if (this.salePriceCheck && (!item.skuInfoList || !item.skuInfoList.length)) {
              item.wxItem.minItemPrice =
                item.wxItem.minItemPrice !== '' && item.wxItem.minItemPrice !== null
                  ? moneyUtil.convertHundredMoneyUnit(item.wxItem.minItemPrice, false)
                  : null;
              item.wxItem.maxItemPrice =
                item.wxItem.maxItemPrice !== '' && item.wxItem.maxItemPrice !== null
                  ? moneyUtil.convertHundredMoneyUnit(item.wxItem.maxItemPrice, false)
                  : null;
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
          }
          return true;
        })
        .every(res => res);
      // 判断是否有错误提示，阻止往下执行
      if (errorDesc) {
        this.$message.error(errorDesc);
        return false;
      }

      return validate;
    },

    /**
     * 检验商品详情当前价格(无skuInfoList)
     */
    validateWxItemPrice(wxItem) {
      if (!wxItem) return false;
      let errorDesc = null; // 错误提示，用于判断是否有错误，以便给予提示以及阻止保存
      let item = this.$plain(wxItem);
      if (item) {
        // 判断商品对象里面的售价或标价输入的值是否失效
        if (!this.isValidate(item.salePrice)) {
          return false;
        }
        if (!this.isValidate(item.labelPrice)) {
          return false;
        }

        item.salePrice = moneyUtil.convertHundredMoneyUnit(item.salePrice, false);
        item.labelPrice = moneyUtil.convertHundredMoneyUnit(item.labelPrice, false);

        // 判断商品售价是否大于标价，以便给予错误提示
        if (item.salePrice > item.labelPrice) {
          errorDesc = '商品售价不能大于商品标价';
        }

        // 判断是否需校验价格范围
        if (this.salePriceCheck && (!item.skuInfoList || !item.skuInfoList.length)) {
          item.minItemPrice =
            item.minItemPrice !== '' && item.minItemPrice !== null
              ? moneyUtil.convertHundredMoneyUnit(item.minItemPrice, false)
              : null;
          item.maxItemPrice =
            item.maxItemPrice !== '' && item.maxItemPrice !== null
              ? moneyUtil.convertHundredMoneyUnit(item.maxItemPrice, false)
              : null;

          if (item.minItemPrice && item.minItemPrice !== 0 && item.minItemPrice > item.salePrice) {
            errorDesc = '售价不能低于最低售价';
          }

          if (item.maxItemPrice && item.maxItemPrice !== 0 && item.maxItemPrice < item.salePrice) {
            errorDesc = '售价不能高于最高售价';
          }
        }
      }

      // 判断是否有错误提示，阻止往下执行
      if (errorDesc) {
        this.$message.error(errorDesc);
        return false;
      }

      return true;
    },

    /**
     * 检验商品详情当前价格(无skuInfoList)
     */
    validateSkuItemPrice(curSkuInfoList) {
      if (!curSkuInfoList || !curSkuInfoList.length) return false;
      let errorDesc = null; // 错误提示，用于判断是否有错误，以便给予提示以及阻止保存
      let item = this.$plain(this.curGoodsItem);
      let skuInfoList = this.$plain(curSkuInfoList);
      if (skuInfoList && skuInfoList.length > 0) {
        // 遍历判断sku信息里面的售价或标价输入的值是否失效
        const isInvalid = skuInfoList.some(sil => {
          if (sil.notOptional) return false;
          return !this.isValidate(sil.salePrice) || !this.isValidate(sil.labelPrice);
        });
        if (isInvalid) {
          return false;
        }

        // 判断是否需校验价格范围
        if (this.salePriceCheck) {
          item.wxItem.minItemPrice =
            item.wxItem.minItemPrice !== '' && item.wxItem.minItemPrice !== null
              ? moneyUtil.convertHundredMoneyUnit(item.wxItem.minItemPrice, false)
              : null;
          item.wxItem.maxItemPrice =
            item.wxItem.maxItemPrice !== '' && item.wxItem.maxItemPrice !== null
              ? moneyUtil.convertHundredMoneyUnit(item.wxItem.maxItemPrice, false)
              : null;
        }

        skuInfoList.forEach((sil, index) => {
          sil.salePrice = moneyUtil.convertHundredMoneyUnit(sil.salePrice, false);
          sil.labelPrice = moneyUtil.convertHundredMoneyUnit(sil.labelPrice, false);

          if (sil.notOptional) return;

          // 判断skuInfo中商品售价是否大于标价，以便给予错误提示
          if (sil.salePrice > sil.labelPrice) {
            errorDesc = '商品售价不能大于商品标价';
          }

          if (this.salePriceCheck) {
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
          }
        });
      }

      // 判断是否有错误提示，阻止往下执行
      if (errorDesc) {
        this.$message.error(errorDesc);
        return false;
      }

      return true;
    },

    onTabChange() {
      this.itemList = [];
      this.curGoodsItem = this.$plain(this.goodsItemList[+this.curGoodsItemIndex]);

      this.skuInfoList =
        this.curGoodsItem && this.curGoodsItem.skuInfoList && this.curGoodsItem.skuInfoList.length > 0
          ? this.$plain(this.curGoodsItem.skuInfoList)
          : [];
      this.itemList.push(this.$plain(this.curGoodsItem.wxItem));
    },

    onPricechange() {
      this.validateWxItemPrice(this.itemList[0]);
      this.goodsItemList[+this.curGoodsItemIndex].wxItem = this.$plain(this.itemList[0]);
      this.curGoodsItem = this.$plain(this.goodsItemList[+this.curGoodsItemIndex]);
    },

    /**
     * 通知父级关闭对话弹框
     */
    onCloseDialog() {
      this.$emit('onCloseDialog'); // 通知父级关闭对话弹框
    },

    /**
     * 将sku信息组装成表格信息，以便前端页面渲染
     */
    assembleSkuTableData() {
      const col = this.skuInfoList[0].skuInfoNames;
      col.forEach((item, index) => {
        this.cols.push({
          prop: `valName_${index}`,
          label: item.keyName
        });
      });

      this.cols.push({
        prop: 'salePrice',
        label: '售价(元)',
        type: 'input'
      });
      this.cols.push({
        prop: 'labelPrice',
        label: '标价(元)',
        type: 'input'
      });

      this.skuInfoList.forEach(item => {
        // 循环判断表头col中的keyId等于skuInfoList中skuInfoNames的keyId时，则将sku的valName赋值给表格中的数组，避免后端返回不同的顺序，引起表头信息与表格数据错乱的现象
        col.forEach((c, index) => {
          item.skuInfoNames.forEach(skuItem => {
            if (c.keyId === skuItem.keyId) {
              item[`valName_${index}`] = skuItem.valName;
            }
          });
        });

        // this.colsValue.push(item);
        this.colsValue.push(this.$plain(item));
      });
    },

    /**
     * sku信息价格输入变更
     */
    onSkuInfoChange(value) {
      // this.isValidate(value);
      this.validateSkuItemPrice(this.colsValue);
      this.colsValue.forEach((item, index) => {
        this.skuInfoList[index].salePrice = item.salePrice;
        this.skuInfoList[index].labelPrice = item.labelPrice;
        this.skuInfoList[index].salePriceLock = item.salePriceLock;
        this.skuInfoList[index].labelPriceLock = item.labelPriceLock;
      });
      this.goodsItemList[+this.curGoodsItemIndex].skuInfoList = this.$plain(this.skuInfoList);
      this.curGoodsItem = this.$plain(this.goodsItemList[+this.curGoodsItemIndex]);
    },

    /**
     * 判断输入的值是否有效
     */
    isValidate(value) {
      if (!value && value !== 0) {
        this.$message.error('请输入价格');
        return false;
      } else if (!/^\d{1,7}(\.\d{1,2})?$/.test(value)) {
        this.$message.error('价格必须是0至9999999.99之间的正整数或且小数点后保留两位的数字');
        return false;
      } else {
        return true;
      }
    },

    /**
     * 提交修改的价格
     */
    onSubmit() {
      if (!this.validateItemPrice()) return;
      const params = [];
      this.assemblePriceData(false);
      this.goodsItemList.forEach(item => {
        if (item.skuInfoList && item.skuInfoList.length) {
          item.skuInfoList.forEach(skuInfo => {
            params.push({
              itemNo: skuInfo.itemNo,
              salePrice: skuInfo.salePrice,
              labelPrice: skuInfo.labelPrice,
              skuId: skuInfo.skuId
            });
          });
        } else if (item.wxItem) {
          params.push({
            itemNo: item.wxItem.itemNo,
            salePrice: item.wxItem.salePrice,
            labelPrice: item.wxItem.labelPrice,
            skuId: item.wxItem.skuId
          });
        }
      });

      this.loading = true;

      services
        .json(constants.Api.store.batchUpdateItem, params, {
          action: '更新商品价格'
        })
        .done(res => {
          this.$message.success('商品价格修改成功！');
        })
        .always(() => {
          this.loading = false;
          this.dialogVisible = false; // 隐藏当前对话弹框
          this.$emit('onRefresh'); // 通知父级刷新数据
        });
    },

    /**
     * 快速改价
     * 计算基于 最开始的 价格 即 originGoodsItemList
     */
    handleBatchModify() {
      let goodsItemList = (this.goodsItemList || []).filter(i => i);
      let originGoodsItemList = (this.originGoodsItemList || []).filter(i => i);

      this.goodsItemList = goodsItemList.map((item, itemIndex) => {
        const originItem = originGoodsItemList[itemIndex];

        const originWxItem = originItem.wxItem;

        const wxItem = item.wxItem;

        const maxSalePrice = (wxItem && wxItem.maxItemPrice) || Infinity;
        const minSalePrice = (wxItem && wxItem.minItemPrice) || 0;

        const isSku = item.skuInfoList && item.skuInfoList.length;

        /**
         * 标价不得低于最低售价
         */
        if (typeof this.labelPricePercent === 'number' && !this.isForbidModifyLabelPrice) {
          // 修改 sku 价格
          if (isSku) {
            item.skuInfoList.forEach((info, infoIndex) => {
              const originInfo = originItem.skuInfoList[infoIndex];
              if (!info.labelPriceLock && !info.notOptional) {
                const calcPrice = (this.labelPricePercent * originInfo.appLabelPrice) / 100;

                if (minSalePrice && minSalePrice > calcPrice) {
                  info.labelPriceTip = '标价不得低于商品最低售价';
                } else {
                  info.labelPriceTip = '';
                }

                const labelPrice = Math.max(calcPrice, minSalePrice);
                info.labelPrice = +(labelPrice % 1 === 0 ? labelPrice : labelPrice.toFixed(2));
              }
            });
          } else if (!wxItem.labelPriceLock) {
            const calcPrice = (this.labelPricePercent * originWxItem.appLabelPrice) / 100;

            if (minSalePrice && minSalePrice > calcPrice) {
              wxItem.labelPriceTip = '标价不得低于商品最低售价';
            } else {
              wxItem.labelPriceTip = '';
            }

            const labelPrice = Math.max(calcPrice, minSalePrice);
            wxItem.labelPrice = +(labelPrice % 1 === 0 ? labelPrice : labelPrice.toFixed(2));
          }
        }

        /**
         * 售价：
         * - 不得高于标价（所以要先计算标价）
         * - 不得高于 最高售价
         * - 不得低于 最低售价
         */
        if (typeof this.salePricePercent === 'number' && !this.isForbidModifySalesPrice) {
          // 修改 sku 价格
          if (isSku) {
            item.skuInfoList.forEach((info, infoIndex) => {
              const originInfo = originItem.skuInfoList[infoIndex];
              const calcPrice = (this.salePricePercent * originInfo.appSalePrice) / 100;

              if (!info.salePriceLock && !info.notOptional) {
                const salePrice = Math.min(Math.max(calcPrice, minSalePrice), Math.min(maxSalePrice, info.labelPrice));

                if (calcPrice < minSalePrice && salePrice === minSalePrice) {
                  info.salePriceTip = '售价不得低于商品最低售价';
                } else if (calcPrice > info.labelPrice && salePrice === info.labelPrice) {
                  info.salePriceTip = '售价不得高于商品标价';
                } else if (calcPrice > maxSalePrice && salePrice === maxSalePrice) {
                  info.salePriceTip = '售价不得高于商品最高售价';
                } else {
                  info.salePriceTip = '';
                }

                info.salePrice = +(salePrice % 1 === 0 ? salePrice : salePrice.toFixed(2));
              }
            });
          }
          // 修改 商品 价格
          else if (!wxItem.salePriceLock) {
            const calcPrice = (this.salePricePercent * originWxItem.appSalePrice) / 100;
            const salePrice = Math.min(Math.max(calcPrice, minSalePrice), Math.min(maxSalePrice, wxItem.labelPrice));

            if (calcPrice < minSalePrice && salePrice === minSalePrice) {
              wxItem.salePriceTip = '商品售价不得低于商品最低售价';
            } else if (calcPrice > wxItem.labelPrice && salePrice === wxItem.labelPrice) {
              wxItem.salePriceTip = '商品售价不得高于商品标价';
            } else if (calcPrice > maxSalePrice && salePrice === maxSalePrice) {
              wxItem.salePriceTip = '商品售价不得高于商品最高售价';
            } else {
              wxItem.salePriceTip = '';
            }
            wxItem.salePrice = +(salePrice % 1 === 0 ? salePrice : salePrice.toFixed(2));
          }
        }

        return item;
      });
      // 更新 Tab 数据
      this.onTabChange();
    },

    handleRound() {
      let goodsItemList = (this.goodsItemList || []).filter(i => i);

      this.goodsItemList = goodsItemList.map(item => {
        const wxItem = item.wxItem;
        const maxSalePrice = (wxItem && wxItem.maxItemPrice) || Infinity;
        const minSalePrice = (wxItem && wxItem.minItemPrice) || 0;

        const isSku = item.skuInfoList && item.skuInfoList.length;

        if (!this.isForbidModifySalesPrice) {
          if (isSku) {
            item.skuInfoList.forEach(info => {
              !info.notOptional && this.roundSaleItem(info, minSalePrice, maxSalePrice);
            });
          } else {
            this.roundSaleItem(wxItem, minSalePrice, maxSalePrice);
          }
        }

        if (!this.isForbidModifyLabelPrice) {
          if (isSku) {
            item.skuInfoList.forEach(info => {
              !info.notOptional && this.roundLabelItem(info);
            });
          } else {
            this.roundLabelItem(wxItem);
          }
        }

        return item;
      });

      this.onTabChange();
    },

    roundSaleItem(item, minSalePrice, maxSalePrice) {
      if (!item.salePriceLock) {
        let calcPrice = Math.round(item.salePrice);

        if (calcPrice > Math.min(maxSalePrice, item.labelPrice)) {
          calcPrice = Math.floor(item.salePrice);
          item.salePriceTip = '商品售价不得高于最高售价及标价';
        }
        if (calcPrice < minSalePrice) {
          calcPrice = Math.ceil(item.salePrice);
          item.salePriceTip = '商品售价不得低于最低售价';
        }
        item.salePrice = calcPrice;
      }
    },

    roundLabelItem(item) {
      if (!item.labelPriceLock) {
        let calcPrice = Math.round(item.labelPrice);
        if (calcPrice < item.salePrice) {
          calcPrice = Math.ceil(item.salePrice);
          item.labelPriceTip = '商品标价不得低于售价';
        }
        item.labelPrice = calcPrice;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.limit-price {
  display: flex;
}

.tip-input {
  position: relative;

  .tip {
    position: absolute;
    left: 0;
    bottom: -1.8em;
    word-break: keep-all;
    white-space: nowrap;
    color: #ff8888;
  }
}
.goods-attribute {
  text-align: center;
}

.tab-label {
  max-width: 10em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.flex-col {
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar {
  display: flex;
  align-items: center;
  line-height: 30px;
  font-size: 14px;
  margin-bottom: 20px;

  /deep/ .el-input-number .el-input__inner {
    height: 30px;
  }
  /deep/ .el-form-item {
    margin-bottom: 0;
  }

  .toolbar-btn {
    margin-left: auto;
  }
}
</style>

<style lang="less">
.batch-price-update-dialog {
  .el-table__body-wrapper {
    max-height: 40vh;
    overflow: auto;
  }
  .el-table__header {
    .cell {
      text-align: center;
    }
  }

  .skuInfo-table {
    width: 99.9%;
  }

  .item-table {
    width: 99.9%;
    .cell {
      text-align: center;
    }
  }

  .el-table__row {
    .cell {
      overflow: visible;
    }
  }

  .input-price {
    width: unset;
    margin-right: 10px;
    .el-input__inner {
      width: 100px;
      text-align: center;
    }
  }

  .nodata-tips {
    text-align: center;
    padding: 10px 0;
  }

  /deep/ .el-input {
    height: unset !important;
    line-height: unset !important;
  }
}
</style>
