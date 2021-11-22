<template>
  <div class="io-bound-product-table">
    <el-button v-if="!isAllotBound" plain icon="el-icon-plus" @click="handleShowProductDialog">添加商品 </el-button>
    <el-button icon="el-icon-download" class="add-member" plain v-if="!isEdit && !isAllotBound" @click="openVipUpload"
      >批量导入
    </el-button>

    <el-table
      :data="finalProductList"
      v-if="finalProductList && finalProductList.length"
      class="wkt-table iobound-table"
    >
      <el-table-column label="商品名称" min-width="300">
        <template slot-scope="scope">
          <div class="goods-info">
            <img :src="scope.row.thumbnail" />
            <div style="display: inline-block; vertical-align: middle">
              <div class="goods-desc">
                {{ scope.row.itemName || scope.row.name }}
                {{ scope.row.itemAttrAsStr ? '(' + scope.row.itemAttrAsStr + ')' : '' }}
                {{ scope.row.itemAttribute ? '(' + scope.row.itemAttribute + ')' : '' }}
              </div>
              <div class="goods-desc">{{ scope.row.barcode }}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="单位" prop="itemUnit" width="80">
        <template slot-scope="scope">
          {{ scope.row.itemUnit || scope.row.unit }}
        </template>
      </el-table-column>

      <!--inbound item start-->
      <el-table-column label="出库数量" v-if="!isOutBound && isAllotBound" prop="outCount" width="130">
      </el-table-column>

      <el-table-column label="入库数量" width="130" label-class-name="not" v-if="isAllotBound">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.count"
            size="mini"
            :class="{ 'wkt-table-input-success': !scope.row.hasError }"
          ></el-input>
        </template>
      </el-table-column>

      <el-table-column label="采购数量" label-class-name="not" width="120" v-if="!isAllotBound && !isOutBound">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.count"
            size="mini"
            :class="{ 'wkt-table-input-success': !scope.row.hasError }"
          ></el-input>
        </template>
      </el-table-column>

      <el-table-column label="批次" v-if="!isAllotBound && !isOutBound" width="160">
        <template slot-scope="scope">
          <el-input v-model="scope.row.batchNo" size="mini" class="batchNo"></el-input>
        </template>
      </el-table-column>

      <el-table-column label="质保期" v-if="!isAllotBound && !isOutBound" width="180">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.expirationDate"
            size="mini"
            placeholder="格式：2019-05-31"
            class="expirationDate"
          ></el-input>
        </template>
      </el-table-column>
      <!--inbound item end-->

      <!--outbound item start-->

      <el-table-column label="实物库存" prop="stock" v-if="isOutBound" label-class-name="not" width="130">
      </el-table-column>

      <el-table-column label="可用库存" prop="usableStock" v-if="isOutBound" width="130"> </el-table-column>

      <el-table-column label="出库数量" v-if="isOutBound" label-class-name="not" width="130">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.count"
            size="mini"
            :class="{ 'wkt-table-input-success': !scope.row.hasError }"
          ></el-input>
        </template>
      </el-table-column>

      <el-table-column label="批次" v-if="isAllotBound || isOutBound">
        <template slot-scope="scope">
          {{ !!scope.row.batchNo && scope.row.batchNo !== '-1000' ? scope.row.batchNo : 'N/A' }}
        </template>
      </el-table-column>

      <el-table-column label="质保期" v-if="isAllotBound || isOutBound" prop="expirationDate">
        <template slot-scope="scope">
          {{ scope.row.expirationDate | time('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <!--outbound item end-->

      <el-table-column label="操作" width="90" v-if="!isAllotBound">
        <template slot-scope="scope">
          <a href="javascript:;" class="table-delete" @click="handleDelete(scope.$index, scope.row)">删除 </a>
        </template>
      </el-table-column>
    </el-table>

    <!-- 商品sku查询 -->
    <goods-select-dialog
      v-model="showSkuDialog"
      choose-sku
      :active-tabs="computeActiveTabs"
      :ext-params="{ isSync: 0 }"
      enable-multiple
      :selected-list="productList"
      @selected="onChooseSkuProduct"
    >
    </goods-select-dialog>

    <!-- 对应仓库商品库存查询 -->
    <stock-dialog
      :show-dialog.sync="showStockDialog"
      :params="params"
      :selected-list="stockProductList"
      @selected="onChooseStockProduct"
    ></stock-dialog>

    <!--批量导入-->
    <upload
      :visible.sync="dialog.upload"
      :title="'批量导入'"
      :limit="1"
      @upload-success="onUploadSuccess"
      :template-down-url="templateDownUrl"
      :upload-server-url="uploadServerUrl"
      :params="uploadParams"
      class="inbound-upload"
      :template-desc="'您可以下载我们提供的模板，批量导入商品信息。'"
    >
    </upload>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import Upload from '@/dss-common/components/upload/index.vue';
  import emitter from 'element-ui/lib/mixins/emitter.js';
  import GoodsSelectDialog from '@/dss-wechat3rd/src/bz_components/goods-select-dialog/index.vue';
  import stockDialog from '@/dss-wechat3rd/src/bz_components/stock-dialog/index.vue';
  import ioboundEnum from '@/dss-wechat3rd/src/constants/ioboundEnum';

  const iobuondTypeEnum = {
    PURCHASE: 'purchase',
    OTHER: 'other',
    ALLOT: 'allot',
    OUTBOUND: 'outbound',
  };

  export default {
    name: 'OutboundProductTable',
    mixins: [emitter],
    components: {
      GoodsSelectDialog,
      stockDialog,
      Upload,
    },
    props: {
      value: {
        type: Array,
        default: function () {
          return null;
        },
      },
      ioboundType: {
        type: String,
        default: 'outbound',
      },
      queryparams: {
        type: Object,
        default: function () {
          return {};
        },
      },
      // 出库仓库ID
      outboundWarehouseId: {
        type: Number,
        default: null,
      },
    },
    data() {
      return {
        dialog: {
          upload: null,
        },
        showSkuDialog: false,
        showStockDialog: false,
        productList: [],
        stockProductList: [],
      };
    },
    computed: {
      ...mapState({
        env: 'env',
      }),
      computeActiveTabs() {
        return [goodsTypeEnum.product, goodsTypeEnum.gift];
      },
      /* 是否为调拨入库 */
      isAllotBound() {
        return this.ioboundType && this.ioboundType === iobuondTypeEnum.ALLOT;
      },

      isOutBound() {
        return this.ioboundType && this.ioboundType === iobuondTypeEnum.OUTBOUND;
      },

      uploadParams() {
        const params = {};
        Object.keys(this.queryparams).forEach(key => {
          if (this.queryparams[key] && key !== 'itemList') {
            params[key] = this.queryparams[key];
          }
        });

        return params;
      },

      // 上传url
      templateDownUrl() {
        const url = '/c/pot/template/download?fileName=';
        const isOutBound = this.isOutBound ? 'outboundTemplate' : 'inboundTemplate';
        return url + isOutBound;
      },

      // 模板下载地址
      uploadServerUrl() {
        const Bound = this.isOutBound ? 'outbound' : 'inbound';
        const url = '/wp/' + Bound + '/batch_add';
        return url;
      },

      isEdit() {
        const boundNo = this.isOutBound ? this.$route.query.outboundNo : this.$route.query.inboundNo;
        return !!boundNo;
      },

      // 出库仓库
      params() {
        return { warehouseId: this.outboundWarehouseId };
      },
      finalProductList() {
        return this.isOutBound ? this.stockProductList : this.productList;
      },
    },
    watch: {
      value: {
        deep: true,
        immediate: true,
        handler(newVal) {
          if (this.isOutBound) {
            this.stockProductList = newVal;
          } else {
            this.productList = newVal;
          }
        },
      },
      productList: {
        deep: true,
        handler(newVal) {
          this.$emit('input', newVal);
          this.dispatch('ElFormItem', 'el.form.change', [newVal]);
        },
      },
      stockProductList: {
        deep: true,
        handler(newVal) {
          this.$emit('input', newVal);
          this.dispatch('ElFormItem', 'el.form.change', [newVal]);
        },
      },
    },
    methods: {
      // 出现选择商品对话框
      handleShowProductDialog() {
        if (!this.isOutBound) {
          this.showSkuDialog = true; // 商品sku查询对话框
        } else if (!this.outboundWarehouseId) {
          this.$message.error('请先选择出库仓库');
        } else {
          this.showStockDialog = true; // 对应仓库商品库存查询对话框
        }
      },

      handleDelete(index, item) {
        if (this.isOutBound) {
          this.stockProductList.splice(index, 1);
        } else {
          this.productList.splice(index, 1);
        }
      },

      // 打开会员导入
      openVipUpload() {
        if (!this.uploadParams.type) {
          if (this.ioboundType === 'outbound') {
            this.$message.error('请先选择出库类型');
          } else {
            this.$message.error('请先选择入库类型');
          }
          return;
        }

        if (!this.uploadParams.warehouseId) {
          if (this.ioboundType === 'outbound') {
            this.$message.error('请先选择出库仓库');
          } else {
            this.$message.error('请先选择仓库');
          }
          return;
        }

        if (this.ioboundType === 'outbound' && this.uploadParams.type !== ioboundEnum.outboundType.RELOCATE_OUT.value) {
          if (!this.uploadParams.receiverName) {
            return this.$message.error('请输入收货人');
          }
          if (!this.uploadParams.receiverPhone) {
            return this.$message.error('请输入联系电话');
          }
          if (!this.uploadParams.provinceId) {
            return this.$message.error('请选择收货地址');
          }
          if (!this.uploadParams.address) {
            return this.$message.error('请输入详细地址');
          }
        }
        this.dialog.upload = true;
      },

      // 上传成功后的回调
      onUploadSuccess(message) {
        if (message) {
          this.$message.error(message);
          return;
        }
        if (this.isOutBound) {
          this.$router.push('/warehouse/inventory-mgr/outbound');
        } else {
          this.$router.push('/warehouse/inventory-mgr/inbound');
        }
      },

      // 选中商品sku信息
      onChooseSkuProduct(productList) {
        productList.forEach(item => {
          this.$set(item, 'batchNo', !!item.batchNo && item.batchNo > 0 ? item.batchNo : null);
        });
        this.productList = productList;
      },

      // 选中商品库存信息
      onChooseStockProduct(stockProductList) {
        this.stockProductList = stockProductList;
      },
    },
  };
</script>

<style lang="less">
  .io-bound-product-table {
    .batchNo,
    .expirationDate {
      .el-input__inner {
        padding: 0 5px !important;
        width: 100% !important;
      }
    }

    .cell.not::before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }

  .iobound-table {
    .el-input--mini .el-input__inner {
      width: 96px;
    }

    .goods-info {
      display: flex;
      align-items: center;

      img {
        width: 100px;
        height: 100px;
        margin-right: 20px;
      }
    }
  }
</style>
