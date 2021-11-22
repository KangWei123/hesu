<template>
  <el-dialog
    title="门店价格设置"
    :visible.sync="dialogVisible"
    class="item-price-update-dialog"
    v-loading="loading"
    @close="onCloseDialog"
  >
    <div class="limit-price" v-if="salePriceCheck">
      <span
        v-if="itemList && itemList.length > 0 && itemList[0].minItemPrice !== null && itemList[0].minItemPrice !== 0"
      >
        最低售价：{{ itemList[0].minItemPrice }}
      </span>
      <span
        v-if="itemList && itemList.length > 0 && itemList[0].maxItemPrice !== null && itemList[0].maxItemPrice !== 0"
        style="margin-left: 20px"
      >
        最高售价：{{ itemList[0].maxItemPrice }}
      </span>
    </div>
    <el-table v-if="skuInfoList && skuInfoList.length > 0" :data="colsValue" class="skuInfo-table">
      <el-table-column v-for="(item, i) in cols" :label="item.label" :key="i">
        <template slot-scope="scope">
          <div class="goods-attribute" v-if="!item.type || !item.type === 'input'" :title="scope.row[item.prop]">
            {{ scope.row[item.prop] }}
          </div>

          <el-input
            v-else-if="item.type && item.type === 'input'"
            v-model="scope.row[item.prop]"
            size="small"
            class="input-price"
            :disabled="
              !!scope.row.notOptional ||
              (item.prop === 'labelPrice' && isForbidModifyLabelPrice) ||
              (item.prop === 'salePrice' && isForbidModifySalesPrice) ||
              (item.prop === 'integralPrice' && isForbidModifySalesPrice)
            "
            @change="onSkuInfoChange(scope.row[item.prop], item.prop)"
          ></el-input>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-else-if="itemList && itemList.length > 0" :data="itemList" class="item-table">
      <el-table-column label="现金售价(元)">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.salePrice"
            size="small"
            class="input-price"
            :disabled="isForbidModifySalesPrice"
            @change="isValidate"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="积分售价" v-if="isIntegralGood">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.integralPrice"
            size="small"
            class="input-price"
            :disabled="isForbidModifySalesPrice"
            @change="isValidate"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="标价(元)">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.labelPrice"
            size="small"
            class="input-price"
            :disabled="isForbidModifyLabelPrice"
            @change="isValidate"
          ></el-input>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import services from '@/dss-common/utils/services';
  import constants from '../../constants';
  import moneyUtil from '@/dss-common/utils/money';

  export default {
    name: 'ItemPriceUpdateDialog',

    props: {
      // 修改的门店id集合
      storeIdList: {
        type: Array,
        default: function () {
          return [];
        },
      },

      // 修改的商品单号
      itemNo: {
        type: String,
        default: '',
      },

      // 修改的类型，单门店或多门店
      updateType: {
        type: String,
        default: 'moreStore',
      },

      // 是否需最低最高售价校验
      salePriceCheck: {
        type: Boolean,
        default: false,
      },

      // 是否禁止编辑原价标签
      isForbidModifyLabelPrice: {
        type: Boolean,
        default: false,
      },
      // 是否禁止编辑售价
      isForbidModifySalesPrice: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        loading: false,
        dialogVisible: false, // 是否显示对话弹框

        goodsDetailObj: null, // 商品详情
        skuInfoList: [], // 商品sku信息
        itemList: [], // 商品信息
        cols: [], // table表头列
        colsValue: [], // table表格数据
        isIntegralGood: false, // 是否积分商品
      };
    },

    watch: {
      // 监听sku信息的变化，以便组装数据
      skuInfoList: {
        // deep: true, fixme 不用deep属性，不然会多次更新
        immediate: true,
        handler(newVal, oldVal) {
          this.cols = [];
          this.colsValue = [];
          if (newVal && newVal.length) {
            this.assembleSkuTableData();
          }
        },
      },
    },

    mounted() {
      this.getGoodsDetail(); // 查询商品详情
    },

    methods: {
      /**
       * 查询商品详情
       */
      getGoodsDetail() {
        const params = {
          itemNo: this.itemNo,
        };
        const url = this.updateType === 'oneStore' ? constants.Api.store.itemDetail : constants.Api.goods.detail;
        services
          .get(url, {
            params,
            action: '商品详情',
          })
          .done(res => {
            if (res.data) {
              this.goodsDetailObj = res.data;
              this.skuInfoList =
                res.data.skuInfoList && res.data.skuInfoList.length > 0 ? this.$plain(res.data.skuInfoList) : [];

              const wxItem = this.$plain(res.data.wxItem);
              wxItem.salePrice = moneyUtil.convertHundredMoneyUnit(wxItem.salePrice, true);
              wxItem.labelPrice = moneyUtil.convertHundredMoneyUnit(wxItem.labelPrice, true);

              // 判断是否需校验价格范围
              if (this.salePriceCheck) {
                wxItem.minItemPrice =
                  wxItem.minItemPrice || wxItem.minItemPrice === 0
                    ? moneyUtil.convertHundredMoneyUnit(wxItem.minItemPrice, true)
                    : null;
                wxItem.maxItemPrice =
                  wxItem.maxItemPrice || wxItem.maxItemPrice === 0
                    ? moneyUtil.convertHundredMoneyUnit(wxItem.maxItemPrice, true)
                    : null;
              }
              // 判断修改类型如果是批量设置价格且无sku信息时，则将商品wxItem中的售价与标价清空，让用户自己输入
              if (this.updateType === 'moreStore' && this.skuInfoList.length < 1) {
                wxItem.salePrice = null;
                wxItem.labelPrice = null;
              }
              this.itemList.push(wxItem);
              this.isIntegralGood = wxItem.mode;
            }
          })
          .always(() => {
            this.dialogVisible = true; // 打开对话弹框
            this.$emit('unLoading'); // 通知父级隐藏loading
          });
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
            label: item.keyName,
          });
        });

        this.cols.push({
          prop: 'salePrice',
          label: '现金售价(元)',
          type: 'input',
        });

        if (this.isIntegralGood) {
          this.cols.push({
            prop: 'integralPrice',
            label: '积分售价',
            type: 'input',
          });
        }

        this.cols.push({
          prop: 'labelPrice',
          label: '标价(元)',
          type: 'input',
        });

        this.skuInfoList.forEach(item => {
          item.salePrice = moneyUtil.convertHundredMoneyUnit(item.salePrice, true);
          item.labelPrice = moneyUtil.convertHundredMoneyUnit(item.labelPrice, true);
          // 判断修改类型如果是批量设置价格时，则将商品skuInfoList中的售价与标价清空，让用户自己输入
          if (this.updateType === 'moreStore') {
            item.salePrice = null;
            item.labelPrice = null;
            item.integralPrice = null;
          }

          // 循环判断表头col中的keyId等于skuInfoList中skuInfoNames的keyId时，则将sku的valName赋值给表格中的数组，避免后端返回不同的顺序，引起表头信息与表格数据错乱的现象
          col.forEach((c, index) => {
            item.skuInfoNames.forEach(skuItem => {
              if (c.keyId === skuItem.keyId) {
                item[`valName_${index}`] = skuItem.valName;
              }
            });
          });

          this.colsValue.push(item);
        });
      },

      /**
       * sku信息价格输入变更
       */
      onSkuInfoChange(value, name) {
        if (name === 'integralPrice') this.isValidateIntegral(value);
        else this.isValidate(value);

        this.colsValue.forEach((item, index) => {
          this.skuInfoList[index].salePrice = item.salePrice;
          this.skuInfoList[index].labelPrice = item.labelPrice;
          this.skuInfoList[index].integralPrice = item.integralPrice;
        });
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
       * 判断输入积分是否有效
       */
      isValidateIntegral(value) {
        if (!value && value !== 0) {
          this.$message.error('请输入积分');
          return false;
        } else if (!/^([1-9]\d*)$/.test(value)) {
          this.$message.error('积分必须是1至9999999之间的正整数');
          return false;
        } else {
          return true;
        }
      },

      /**
       * 提交修改的价格
       */
      onSubmit() {
        let errorDesc = null; // 错误提示，用于判断是否有错误，以便给予提示以及阻止保存

        this.goodsDetailObj.wxItem = this.$plain(this.itemList[0]);
        this.goodsDetailObj.skuInfoList = this.$plain(this.skuInfoList);
        const item = this.goodsDetailObj;

        if (item) {
          if (item.skuInfoList && item.skuInfoList.length > 0) {
            // 遍历判断sku信息里面的售价或标价输入的值是否失效
            const isInvalid = item.skuInfoList.some(sil => {
              // 如果是积分商品还需判断积分是否失效
              if (this.isIntegralGood)
                return (
                  !this.isValidate(sil.salePrice) ||
                  !this.isValidate(sil.labelPrice) ||
                  !this.isValidateIntegral(sil.integralPrice)
                );
              else return !this.isValidate(sil.salePrice) || !this.isValidate(sil.labelPrice);
            });

            if (isInvalid) {
              return;
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

            if (this.isIntegralGood && !this.isValidate(item.wxItem.labelPrice)) {
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
        }

        // 判断是否有错误提示，阻止往下执行
        if (errorDesc) {
          this.$message.error(errorDesc);
          return false;
        }

        const params = this.goodsDetailObj || {};
        if (this.storeIdList && this.storeIdList.length > 0) {
          params.storeIdList = this.storeIdList;
        }

        this.loading = true;
        services
          .post(constants.Api.store.updateItem, params, {
            headers: {
              'Content-Type': 'application/json',
            },
            transformRequest: function (data, config, test) {
              return JSON.stringify(data);
            },
            action: '更新商品价格',
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
    },
  };
</script>

<style lang="less">
  .item-price-update-dialog {
    .limit-price {
    }
    .el-table__body-wrapper {
      max-height: 50vh;
      overflow-y: auto;
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
  }
</style>
