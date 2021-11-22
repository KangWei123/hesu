<template>
  <div class="sku-goods-info-table">
    <el-table v-if="skuInfos"
              :data="colsValue"
              style="width: 100%;">
      <el-table-column v-for="(item, index) in cols"
                       :key="index"
                       :fixed="item.prop=== 'operation' ? 'right' : false"
                       align="center"
                       :label="item.label"
                       :width="item.width"
                       :min-width="item.minWidth">
        <template slot="header" v-if="item.prop === 'skuImg'">
          <div class="header-tips">建议尺寸640x640像素</div>
          <div>主图</div>
        </template>
        <template slot-scope="scope">
          <el-input-number v-if="(item.forceInput || editable) && item.type && item.type === 'input-number'"
                           :min="0"
                           :max="999999999"
                           :precision="0"
                           :style="{width: '80%'}"
                           :controls="false"
                           :disabled="isDisabledEdit || !!scope.row.notOptional"
                           @change="onSkuInfoChange"
                           v-model="scope.row[item.prop]">
          </el-input-number>
          <el-input v-else-if="(item.forceInput || editable) && item.type && item.type === 'input'"
                    :style="{width: '80%'}"
                    :controls="false"
                    :disabled="isDisabledEdit || !!scope.row.notOptional"
                    @change="onSkuInfoChange"
                    v-model="scope.row[item.prop]">
          </el-input>
          <span v-else-if="item.prop=== 'salePrice' || item.prop=== 'labelPrice'"
                class="ellipsis"
                :title="scope.row[item.prop] | price">
            {{ scope.row[item.prop] | price}}
          </span>
          <span v-else-if="item.prop === 'skuImg'"
                :title="scope.row[item.prop]">
            <choose-images style="margin-top: 10px"
                class="sku-choose-images"
                :class="{'is-disable': isDisabledEdit || !!scope.row.notOptional}"
                :is-disabled-edit="isDisabledEdit || !!scope.row.notOptional"
                @delete="onDeleteImg(scope.$index)"
                :value="{imgUrl:scope.row.skuImg}"
                :unique="scope.$index"
                @input="onAttrImgChange"
                :width="60"
                :height="60" />
          </span>
          <span v-else-if="item.prop=== 'operation'"
                :title="scope.row[item.prop]"
                style="display: flex;">
            <el-button type="text" :disabled="isDisabledEdit" @click="toggleDisable(scope.row)">{{scope.row.notOptional ? '启用' : '禁用'}}</el-button>
            <el-button type="text" :disabled="!!scope.row.notOptional || isDisabledEdit" @click="batchEdit(scope.row)">批量填充</el-button>
          </span>
          <span v-else
                class="ellipsis"
                :title="scope.row[item.prop]">
            {{ scope.row[item.prop] }}
          </span>
        </template>

      </el-table-column>
    </el-table>

    <batch-operation
      v-if="showBatchDialog"
      :show.sync="showBatchDialog"
      :cur-batch-edit-item="curBatchEditItem"
      :sku-att-list="skuAttList"
      :is-front-money-item="isFrontMoneyItem"
      @save="batchChangeSkuInfo"></batch-operation>
  </div>
</template>

<script>
// import './css/SkuInfoTable.less';
import featureIf from '@/dss-wechat3rd/src/constants/featureIf';
import BatchOperation from './batch-operation.vue';
import ChooseImages from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';

export default {
  name: 'SkuInfoTable',
  components: { BatchOperation, ChooseImages },
  model: {
    prop: 'skuInfos'
  },
  props: {
    skuInfos: {
      type: Array,
      default: function() {
        return null;
      }
    },
    // 是否禁止编辑
    isDisabledEdit: {
      type: Boolean,
      default: false
    },

    editable: {
      type: Boolean,
      default: true
    },
    /*是否能编辑条形码*/
    disabledBarcode: {
      type: Boolean,
      default: false
    },

    showStock: {
      type: Boolean,
      default: false
    },
    defaultPrice: {
      type: Number,
      default: 0
    },
    labelPrice: {
      type: Number,
      default: 0
    },
    defaultFrontMoney: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      default: '件'
    },
    /*是否为定金模式*/
    isFrontMoneyItem: {
      type: Boolean,
      default: false
    },
    showPrice: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      cols: [],
      colsValue: [],
      skuAttList: [],
      curBatchEditItem: {},
      showBatchDialog: false
    };
  },

  watch: {
    skuInfos: {
      // deep: true, fixme 不用deep属性，不然会多次更新
      immediate: true,
      handler(newVal, oldVal) {
        this.cols = [];
        this.skuAttList = [];
        this.colsValue = [];
        if (newVal && newVal.length) {
          this.assembleSkuTableData();
          this.filterSkuAttList();
        }
      }
    },
    unit() {
      this.cols = [];
      this.skuAttList = [];
      this.colsValue = [];
      if (this.skuInfos && this.skuInfos.length) {
        this.assembleSkuTableData();
        this.filterSkuAttList();
      }
    },
    isFrontMoneyItem() {
      this.cols = [];
      this.skuAttList = [];
      this.colsValue = [];
      if (this.skuInfos && this.skuInfos.length) {
        this.assembleSkuTableData();
        this.filterSkuAttList();
      }
    },
    showPrice() {
      this.cols = [];
      this.skuAttList = [];
      this.colsValue = [];
      if (this.skuInfos && this.skuInfos.length) {
        this.assembleSkuTableData();
        this.filterSkuAttList();
      }
    }
  },

  methods: {
    assembleSkuTableData() {
      const col = this.skuInfos[0].skuInfoNames;
      col.forEach((item, index) => {
        this.cols.push({
          prop: `valName_${index}`,
          label: item.keyName,
          width: 120
        });
      });

      if (this.showStock) {
        this.cols.push({
          prop: 'stock',
          label: `可用库存(${this.unit})`,
          type: !this.hideStock ? 'input-number' : null,
          width: 120,
          forceInput: this.showStock
        });
      }
      if (this.showPrice) {
        this.cols.push({
          prop: 'salePrice',
          label: '售价(元)',
          type: 'input',
          width: 150
        });
        this.cols.push({
          prop: 'labelPrice',
          label: '标价(元)',
          type: 'input',
          width: 150
        });
        if (this.isFrontMoneyItem) {
          this.cols.push({
            prop: 'frontMoney',
            label: '定金',
            type: 'input',
            minWidth: 150
          });
        }
      }

      this.cols.push({
        prop: 'skuBarcode',
        label: '条形码',
        type: 'input',
        minWidth: 300
      });

      this.cols.push({
        prop: 'skuImg',
        label: 'SKU图片',
        width: 200
      });

      this.cols.push({
        prop: 'operation',
        label: '操作',
        minWidth: 150
      });

      this.skuInfos.forEach(item => {
        //填充默认价格
        if (!item.salePrice && item.salePrice !== 0) {
          item.salePrice = this.defaultPrice;
        }
        if (!item.labelPrice && item.labelPrice !== 0) {
          item.labelPrice = this.labelPrice;
        }
        if (!item.frontMoney && item.frontMoney !== 0) {
          item.frontMoney = this.defaultFrontMoney;
        }
        const tableRow = {
          salePrice: item.salePrice,
          labelPrice: item.labelPrice || item.salePrice,
          frontMoney: item.frontMoney,
          skuBarcode: item.skuBarcode,
          stock: item.stock,
          notOptional: item.notOptional || 0, // 0 启用 1 禁用
          skuImg: item.skuImg
        };

        item.skuInfoNames.forEach((skuItem, index) => {
          tableRow[`valName_${index}`] = skuItem.valName;
          tableRow[`keyId_${index}`] = skuItem.keyId;
          tableRow[`valId_${index}`] = skuItem.valId;
        });

        this.colsValue.push(tableRow);
      });
    },

    // 过滤筛选所有带规格项的分类，用于批量操作展示
    filterSkuAttList() {
      let skuAttList = [];
      this.skuInfos.forEach(item => {
        let skuInfoNames = item.skuInfoNames;
        if (skuInfoNames && skuInfoNames.length) {
          // 去重
          skuInfoNames.forEach(infoItem => {
            if (skuAttList.findIndex(attItem => attItem.keyId === infoItem.keyId) < 0) {
              skuAttList.push({
                keyId: infoItem.keyId,
                keyName: infoItem.keyName
              });
            }
          });
        }
      });
      this.skuAttList = skuAttList;
    },

    onSkuInfoChange(val) {
      this.colsValue.forEach((item, index) => {
        this.skuInfos[index].stock = item.stock;
        this.skuInfos[index].salePrice = item.salePrice;
        this.skuInfos[index].labelPrice = item.labelPrice;
        this.skuInfos[index].frontMoney = item.frontMoney;
        this.skuInfos[index].skuBarcode = item.skuBarcode;
        this.skuInfos[index].notOptional = item.notOptional;
        this.skuInfos[index].skuImg = item.skuImg;
      });
    },

    toggleDisable(row) {
      row.notOptional = row.notOptional ? 0 : 1;
      this.onSkuInfoChange();
    },

    batchEdit(row) {
      this.curBatchEditItem = row;
      this.showBatchDialog = true;
    },

    // 批量操作(批量设置售价、标价、定金)
    batchChangeSkuInfo(list = [], attrValList = []) {
      if (!list.length || !attrValList.length) return;
      const { labelPrice, salePrice, frontMoney } = this.curBatchEditItem;
      list.forEach(item => {
        this.colsValue.forEach((colsItem, closIndex) => {
          // 当前选中项的规格
          for (let colsItemKey in colsItem) {
            if (!!~colsItemKey.indexOf('keyId_') && item === colsItem[colsItemKey]) {
              // 当前选中项的规格值
              attrValList.forEach((attrValItem, attrValIndex) => {
                for (let _colsItemKey in colsItem) {
                  if (!!~_colsItemKey.indexOf('valId_') && attrValItem === colsItem[_colsItemKey]) {
                    colsItem.salePrice = salePrice;
                    colsItem.labelPrice = labelPrice;
                    colsItem.frontMoney = frontMoney;
                  }
                }
              });
            }
          }
        });
      });
      this.onSkuInfoChange();
    },

    //更新图片信息
    onAttrImgChange(e, unique) {
      let item = this.colsValue[unique];
      if (!!item) {
        item.skuImg = e.imgUrl;
        this.onSkuInfoChange();
      }
    },

    onDeleteImg(index) {
      this.colsValue[index].skuImg = null;
      this.onSkuInfoChange();
    }
  },
  computed: {
    hideStock() {
      return featureIf.can(featureIf.keys.GOODS_DETAIL_DISABLE_EDIT_STOCK);
    }
  },
  mounted() {}
};
</script>

<style lang="less">
.sku-goods-info-table {
  display: inline-block;
  font-family:MicrosoftYaHei;
  color:rgba(86,105,128,1);
  min-width: 632px;
  max-width: 100%;

  .el-table {
    margin-top: 0;
    .el-input__inner {
      width: 100% !important;
    }

    .header-tips {
      font-size: 12px;
      color: #717378;
    }
  }

  .sku-choose-images.img-uploader {
    .avatar {
      .upload-desc {
        top: initial;
        bottom: 0;
      }

      .el-button.btn-img-del {
        width: 18px;
        height: 18px;
        align-items: center;
        display: flex;
        justify-content: center;
        top: 0;
        right: 14px;
      }
    }

    &.is-disable {
      .avatar .el-button.btn-img-del {
        visibility: hidden;
      }
    }
  }
}
</style>
