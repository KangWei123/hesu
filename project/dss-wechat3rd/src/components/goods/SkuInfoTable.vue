<template>
  <div class="sku-info-table">
    <el-table v-if="skuInfos" :data="colsValue" style="width: 100%">
      <el-table-column
        v-for="(item, index) in cols"
        :key="index"
        :label="item.label"
        :width="item.width"
        :min-width="item.minWidth"
      >
        <template slot-scope="scope">
          <el-input-number
            v-if="(item.forceInput || editable) && item.type && item.type === 'input-number'"
            :min="0"
            :max="999999999"
            :precision="0"
            :style="{ width: '80%' }"
            :controls="false"
            :disabled="isDisabledEdit"
            @change="onSkuInfoChange"
            v-model="scope.row[item.prop]"
          >
          </el-input-number>
          <el-input
            v-else-if="(item.forceInput || editable) && item.type && item.type === 'input'"
            :style="{ width: '80%' }"
            :controls="false"
            :disabled="isDisabledEdit"
            @change="onSkuInfoChange"
            v-model="scope.row[item.prop]"
          >
          </el-input>
          <template v-else-if="(item.forceInput || editable) && item.type && item.type === 'multiInput'">
            <el-input
              :style="{ width: '45%' }"
              :controls="false"
              :disabled="isDisabledEdit"
              @change="onSkuInfoChange"
              v-model="scope.row[item.prop]"
            >
            </el-input>
            +
            <el-input
              :style="{ width: '45%' }"
              :controls="false"
              :disabled="isDisabledEdit"
              @change="onSkuInfoChange"
              v-model="scope.row.integralPrice"
            >
            </el-input>
          </template>
          <span
            v-else-if="item.prop === 'salePrice' || item.prop === 'labelPrice'"
            class="ellipsis"
            :title="scope.row[item.prop] | price"
          >
            {{ scope.row[item.prop] | price }}
            <span v-if="scope.row.integralPrice && item.prop === 'salePrice'">+{{ scope.row.integralPrice }}积分</span>
          </span>
          <span v-else class="ellipsis" :title="scope.row[item.prop]">
            {{ scope.row[item.prop] }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import './css/SkuInfoTable.less';
  import featureIf from '@/dss-wechat3rd/src/constants/featureIf';

  export default {
    name: 'SkuInfoTable',
    model: {
      prop: 'skuInfos',
    },
    props: {
      skuInfos: {
        type: Array,
        default: function () {
          return null;
        },
      },
      // 是否禁止编辑
      isDisabledEdit: {
        type: Boolean,
        default: false,
      },

      editable: {
        type: Boolean,
        default: true,
      },
      /* 是否能编辑条形码 */
      disabledBarcode: {
        type: Boolean,
        default: false,
      },

      showStock: {
        type: Boolean,
        default: false,
      },
      defaultPrice: {
        type: Number,
        default: 0,
      },
      labelPrice: {
        type: Number,
        default: 0,
      },
      defaultFrontMoney: {
        type: Number,
        default: 0,
      },
      unit: {
        type: String,
        default: '件',
      },
      /* 是否为定金模式 */
      isFrontMoneyItem: {
        type: Boolean,
        default: false,
      },
      showPrice: {
        type: Boolean,
        default: true,
      },
      // 是否为积分商品
      isIntegral: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        cols: [],
        colsValue: [],
      };
    },

    watch: {
      skuInfos: {
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
      unit() {
        this.cols = [];
        this.colsValue = [];
        if (this.skuInfos && this.skuInfos.length) {
          this.assembleSkuTableData();
        }
      },
      isFrontMoneyItem() {
        this.cols = [];
        this.colsValue = [];
        if (this.skuInfos && this.skuInfos.length) {
          this.assembleSkuTableData();
        }
      },
      showPrice() {
        this.cols = [];
        this.colsValue = [];
        this.assembleSkuTableData();
      },
      isIntegral() {
        this.cols = [];
        this.colsValue = [];
        this.assembleSkuTableData();
      },
    },

    methods: {
      assembleSkuTableData() {
        const col = this.skuInfos[0].skuInfoNames;
        col.forEach((item, index) => {
          this.cols.push({
            prop: `valName_${index}`,
            label: item.keyName,
            width: 120,
          });
        });

        if (this.showStock) {
          this.cols.push({
            prop: 'stock',
            label: `可用库存(${this.unit})`,
            type: !this.hideStock ? 'input-number' : null,
            width: 120,
            forceInput: this.showStock,
          });
        }
        if (this.showPrice) {
          // 是否为积分商品
          this.cols.push({
            prop: 'salePrice',
            label: this.isIntegral ? '售价(现金+积分)' : '售价(元)',
            type: this.isIntegral ? 'multiInput' : 'input',
            width: this.isIntegral ? 240 : 120,
          });

          this.cols.push({
            prop: 'labelPrice',
            label: '标价(元)',
            type: 'input',
            width: 120,
          });

          if (this.isFrontMoneyItem && !this.isIntegral) {
            this.cols.push({
              prop: 'frontMoney',
              label: '定金',
              type: 'input',
              minWidth: 300,
            });
          }
        }

        this.cols.push({
          prop: 'skuBarcode',
          label: '条形码',
          type: 'input',
          minWidth: 300,
        });

        this.skuInfos.forEach(item => {
          // 填充默认价格
          if (!item.salePrice) {
            item.salePrice = this.defaultPrice;
          }
          if (!item.labelPrice) {
            item.labelPrice = this.labelPrice;
          }
          if (!item.frontMoney) {
            item.frontMoney = this.defaultFrontMoney;
          }
          const tableRow = {
            salePrice: item.salePrice,
            labelPrice: item.labelPrice || item.salePrice,
            integralPrice: item.integralPrice,
            frontMoney: item.frontMoney,
            skuBarcode: item.skuBarcode,
            stock: item.stock,
          };

          item.skuInfoNames.forEach((skuItem, index) => {
            tableRow[`valName_${index}`] = skuItem.valName;
          });

          this.colsValue.push(tableRow);
        });
      },

      onSkuInfoChange(val) {
        this.colsValue.forEach((item, index) => {
          this.skuInfos[index].stock = item.stock;
          this.skuInfos[index].salePrice = item.salePrice;
          this.skuInfos[index].labelPrice = item.labelPrice;
          this.skuInfos[index].frontMoney = item.frontMoney;
          this.skuInfos[index].skuBarcode = item.skuBarcode;
          this.skuInfos[index].integralPrice = +item.integralPrice;
        });
      },
    },
    computed: {
      hideStock() {
        return featureIf.can(featureIf.keys.GOODS_DETAIL_DISABLE_EDIT_STOCK);
      },
    },
  };
</script>

<style lang="less"></style>
