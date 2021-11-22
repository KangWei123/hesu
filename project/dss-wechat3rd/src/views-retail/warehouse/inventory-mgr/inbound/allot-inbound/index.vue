<template>
  <div class="allot-inbound-container"
       v-loading="loading">
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/warehouse/inventory-mgr/inbound' }">商品入库</el-breadcrumb-item>
      <el-breadcrumb-item>新建入库</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="outboundOrder"
             class="allot-inbound-content"
             label-width="85px"
             label-position="right"
             :rules="inBoundRules"
             ref="inBoundForm">

      <el-form-item label="入库类型"
                    prop="type">
        <el-select v-model="outboundOrder.type"
                   filterable
                   :disabled="!!inboundNo"
                   @change="inBoundChange"
                   size="mini"
                   class="warehouseSelect"
                   placeholder="请选择">
          <i slot="prefix"
             class="el-input__icon el-icon-search"></i>
          <el-option v-for="item in inboundTypeList"
                     :key="item.value"
                     v-if="item.value !== 12 && item.value !== 14"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item class="info-item">
        <el-button type="primary"
                   @click="showOutboundOrderDialog = true"
                   :disabled="!!this.inboundNo">选择调拨出库单</el-button>
      </el-form-item>
      <el-form-item label="关联出库单"
                    class="info-item">
        <el-input size="mini"
                  v-model="outboundOrder.outboundNo"
                  disabled
                  class="info"></el-input>
      </el-form-item>
      <el-form-item label="出库仓库"
                    class="info-item">
        <el-input size="mini"
                  v-model="outboundOrder.warehouseName"
                  disabled
                  class="info"></el-input>
      </el-form-item>
      <el-form-item label="入库仓库"
                    class="info-item">
        <el-input size="mini"
                  v-model="outboundOrder.toWarehouseName"
                  disabled
                  class="info"></el-input>
      </el-form-item>
      <el-form-item label="出库备注"
                    class="info-item">
        <el-input size="mini"
                  type="textarea"
                  :rows="2"
                  maxlength="256"
                  disabled
                  v-model="outboundOrder.remark"
                  class="info"></el-input>
      </el-form-item>
      <el-form-item label="入库备注"
                    class="info-item">
        <el-input size="mini"
                  type="textarea"
                  maxlength="256"
                  :rows="2"
                  v-model="outboundOrder.inboundRemark"
                  class="info"></el-input>
      </el-form-item>
      <el-form-item prop="itemList">
        <io-bound-product-table v-model="outboundOrder.itemList"
                                iobound-type="allot" />
      </el-form-item>
    </el-form>

    <div class="bottom-button">
      <el-button type="primary"
                   @click="handleInbound('inBoundForm')"
                   class="info-item">{{inboundNo?'保存':'创建'}}入库单</el-button>
    </div>

    <outbound-order-dialog :show-dialog.sync="showOutboundOrderDialog"
                           @single-choosed="onOutboundOrderSelected" />
  </div>
</template>

<script>
import inventoryMgrAPI from '@/dss-wechat3rd/src/api/retail/goodsMgr/inventoryMgrAPI.js';
import ioboundEnum from '@/dss-wechat3rd/src/constants/ioboundEnum';
import outboundOrderDialog from '@/dss-wechat3rd/src/bz_components/outbound-order-dialog/index.vue';
import IoBoundProductTable from '../../IoBoundProductTable';
export default {
  name: 'AllotInbound',
  components: {
    outboundOrderDialog,
    IoBoundProductTable
  },
  data() {
    const productValidator = (rule, value, callback) => {
      let msg = null;
      value.forEach(v => {
        // 验证采购数量
        if (!v.count) {
          msg = '请输入采购数量';
          v.hasError = true;
        } else if (!/^[1-9]\d{0,4}$/.test(v.count)) {
          v.hasError = true;
          msg = '采购数量为1~99999之间的数字，并且开头不能为零';
        } else {
          v.hasError = false;
        }
      });
      if (msg) {
        return callback(new Error(msg));
      }
      return callback();
    };
    return {
      loading: false,
      showOutboundOrderDialog: false,
      outboundOrder: {
        itemList: [],
        remark: '',
        inboundRemark: '',
        type: ioboundEnum.inboundType.RELOCATE_IN.value
      },
      inboundTypeList: Object.keys(ioboundEnum.inboundType).map(key => {
        return ioboundEnum.inboundType[key];
      }),
      inboundNo: this.$route.query.inboundNo,
      boundDetail: null,
      inBoundRules: {
        itemList: [
          { type: 'array', required: true, message: '请选择调拨出库单', trigger: 'change' },
          { validator: productValidator, trigger: 'change' }
        ]
      }
    };
  },

  mounted() {
    if (!!this.inboundNo) {
      this.getBoundDetail();
    }
  },

  methods: {
    inBoundChange() {
      if (this.outboundOrder.type !== ioboundEnum.inboundType.RELOCATE_IN.value) {
        this.$router.push({
          path: '/warehouse/inventory-mgr/inbound/purchase-inbound',
          query: { type: this.outboundOrder.type }
        });
      }
    },

    onOutboundOrderSelected(outboundOrder) {
      const params = { outboundNo: outboundOrder.outboundNo };
      this.loading = true;
      inventoryMgrAPI
        .outboundDetail(params)
        .then(result => {
          let res = result.data || {};
          this.outboundOrder = { ...res, inboundRemark: outboundOrder.inboundRemark, type: this.outboundOrder.type };
          this.parseOutboundOrder();
        })
        .always(() => {
          this.loading = false;
        });
    },
    parseOutboundOrder() {
      if (this.boundDetail) {
        this.outboundOrder.itemList = this.boundDetail.itemList;
      }
      if (this.outboundOrder.itemList && this.outboundOrder.itemList.length) {
        this.outboundOrder.itemList.forEach(item => {
          item.outCount = item.actualCount || item.count;
          if (item.batchNo === '-1000') {
            item.batchNo = '';
          }
        });
      }
    },

    handleInbound(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.loading = true;
          if (!!this.inboundNo) {
            inventoryMgrAPI
              .updateInbound(this.filterRequestParams())
              .then(result => {
                this.$router.push('/warehouse/inventory-mgr/inbound');
              })
              .always(() => {
                this.loading = false;
              });
          } else {
            inventoryMgrAPI
              .inbound(this.filterRequestParams())
              .then(result => {
                this.$router.push('/warehouse/inventory-mgr/inbound');
              })
              .always(() => {
                this.loading = false;
              });
          }
        } else {
          return false;
        }
      });
    },

    getBoundDetail() {
      const params = {};
      params.inboundNo = this.inboundNo;
      const request = inventoryMgrAPI.inboundDetail(params);
      this.loading = true;
      request
        .then(result => {
          this.boundDetail = result.data;
          this.onOutboundOrderSelected({
            outboundNo: this.boundDetail.relocateNo,
            inboundRemark: this.boundDetail.remark
          });
        })
        .always(() => {
          this.loading = false;
        });
    },

    filterRequestParams() {
      const inboundParams = {};
      inboundParams.warehouseId = this.outboundOrder.toWarehouseId;
      inboundParams.warehouseName = this.outboundOrder.toWarehouseName;
      inboundParams.type = ioboundEnum.inboundType.RELOCATE_IN.value;
      inboundParams.relocateNo = this.outboundOrder.outboundNo;
      inboundParams.remark = this.outboundOrder.inboundRemark;
      inboundParams.itemList = [];
      if (this.inboundNo) {
        inboundParams.inboundNo = this.inboundNo;
      }

      this.outboundOrder.itemList.forEach(product => {
        // 质保期格式转化为YYYY-MM-DD
        const ed = new Date(product.expirationDate);
        const eYear = ed.getFullYear();
        const em = ed.getMonth() + 1;
        const eMonth = em < 10 ? '0' + em : em;
        const eDate1 = ed.getDate();
        const eDate = eDate1 < 10 ? '0' + eDate1 : eDate1;
        const expirationDate = eYear + '-' + eMonth + '-' + eDate;

        inboundParams.itemList.push({
          barcode: product.barcode,
          itemName: product.itemName || product.name,
          itemAttribute: product.itemAttrAsStr || product.itemAttribute,
          itemNo: product.itemNo,
          itemUnit: product.itemUnit,
          thumbnail: product.thumbnail,
          skuId: product.skuId,
          categoryId: product.categoryId,
          actualCount: product.actualCount || product.outCount,
          count: product.count,
          batchNo: product.batchNo,
          expirationDate: expirationDate
        });
      });

      // 删除itemList中不合法的参数
      inboundParams.itemList.forEach(item => {
        Object.keys(item).forEach(key => {
          if (item[key] === '' || item[key] === null || item[key] === 'null') {
            delete item[key];
          }
        });
      });
      return inboundParams;
    }
  }
};
</script>

<style lang="less">
.allot-inbound-container {
  background: #fff;
  margin-bottom: 40px;
  .allot-inbound-content {
    padding: 20px;
  }
  .info {
    width: 500px;
  }
}
</style>
