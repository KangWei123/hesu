<template>
  <div class="new-outbound-container"
       v-loading="loading">
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/warehouse/inventory-mgr/outbound' }">商品出库</el-breadcrumb-item>
      <el-breadcrumb-item>{{outboundNo?'编辑':'新建'}}出库</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form :model="outBoundForm"
             ref="outBoundForm"
             :rules="outBoundRules"
             class="new-outbound-content"
             label-width="80px">
      <el-form-item label="出库类型"
                    prop="outboundType">
        <el-select v-model="outboundType"
                   size="mini"
                   :disabled="!!outboundNo"
                   class="warehouseSelect"
                   placeholder="请选择出库类型">
          <el-option class="dss-query-select-dropdown__item"
                     v-for="(item, index) in outboundTypeList"
                     :key="index"
                     v-if="item.value !== 20 && item.value !== 24"
                     :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <!--出库仓库-->
      <el-form-item label="出库仓库"
                    prop="outboundWarehouseId">
        <el-select v-model="outBoundForm.outboundWarehouseId"
                   filterable
                   size="mini"
                   :disabled="!!outboundNo"
                   class="warehouseSelect"
                   placeholder="请选择出库仓库">
          <i slot="prefix"
             class="el-input__icon el-icon-search"></i>
          <el-option v-for="item in warehouseList"
                     v-if="item.id !== outBoundForm.inboundWarehouseId"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!--入库仓库-->
      <el-form-item label="入库仓库"
                    prop="inboundWarehouseId"
                    v-if="isAllotOutbound">
        <el-select v-model="outBoundForm.inboundWarehouseId"
                   size="mini"
                   :disabled="!!outboundNo"
                   class="warehouseSelect"
                   placeholder="请选择入库仓库">
          <i slot="prefix"
             class="el-input__icon el-icon-search"></i>
          <el-option v-for="item in warehouseList"
                     v-if="item.id !== outBoundForm.outboundWarehouseId"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="收货人"
                    prop="receiverName"
                    v-if="!isAllotOutbound">
        <el-input placeholder="请输入收货人"
                  v-model.trim="outBoundForm.receiverName"
                  style="width: 350px;"
                  size="mini"></el-input>
      </el-form-item>

      <el-form-item label="联系电话"
                    prop="receiverPhone"
                    v-if="!isAllotOutbound">
        <el-input placeholder="请输入联系电话"
                  v-model.trim="outBoundForm.receiverPhone"
                  style="width: 350px;"
                  size="mini"></el-input>
      </el-form-item>

      <el-form-item prop="area"
                    class="required"
                    label="收货地址"
                    v-if="!isAllotOutbound">
        <area-picker :area='outBoundForm.area'
                     style="width: 220px;"
                     @choose="handleChange"></area-picker>
      </el-form-item>

      <el-form-item label="详细地址"
                    prop="address"
                    v-if="!isAllotOutbound">
        <el-input placeholder="请输入详细地址"
                  style="width: 350px;"
                  v-model.trim="outBoundForm.address"
                  size="mini"></el-input>
        <div class="warehouse-tips">注：出库地址，请准确填写</div>
      </el-form-item>

      <el-form-item label="备注">
        <el-input type="textarea"
                  :rows="3"
                  size="mini"
                  maxlength="256"
                  style="width: 350px;"
                  v-model="outBoundForm.remark"></el-input>
      </el-form-item>
      <el-form-item label="选择商品"
                    prop="productList">
        <iobound-product-table v-model="outBoundForm.productList"
                               iobound-type="outbound"
                               :queryparams='queryParams'
                               :outboundWarehouseId="Number(outBoundForm.outboundWarehouseId)" />
      </el-form-item>

      <!--公用操作-->
      <!-- <el-form-item>
        <el-button type="primary"
                   @click="onSubmit('outBoundForm')">{{outboundNo?'保存':'创建'}}出库单
        </el-button>
      </el-form-item> -->
    </el-form>

    <div class="bottom-button">
        <el-button type="primary"
                   @click="onSubmit('outBoundForm')">{{outboundNo?'保存':'创建'}}出库单
        </el-button>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import regexps from '@/dss-common/utils/regexps.js';
import inventoryMgrApi from '@/dss-wechat3rd/src/api/retail/goodsMgr/inventoryMgrAPI.js';
import goodsType from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
import ioboundEnum from '@/dss-wechat3rd/src/constants/ioboundEnum';
import IoboundProductTable from '../../IoBoundProductTable';
import AreaPicker from '@/dss-wechat3rd/src/components/area-picker/index.vue';

export default {
  name: 'PurchaseInbound',

  components: {
    IoboundProductTable,
    AreaPicker
  },

  data() {
    const productValidator = (rule, value, callback) => {
      let msg = null;
      value.forEach(v => {
        // 出库数量
        if (!v.count) {
          msg = '请输入出库数量';
          v.hasError = true;
        } else if (!regexps.positiveInteger.reg.test(v.count)) {
          v.hasError = true;
          msg = regexps.positiveInteger.msg;
        } else if (parseInt(v.count) > v.itemCount) {
          v.hasError = true;
          msg = '出库数量不能大于可用库存';
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
      goodsType: goodsType.product,
      outBoundForm: {
        productList: [],
        outboundType: null,
        outboundWarehouseId: null,
        inboundWarehouseId: null,
        remark: null,
        receiverName: null,
        receiverPhone: null,
        address: null,
        area: []
      },
      areas: [],
      outboundNo: this.$route.query.outboundNo,
      outBoundRules: {
        outboundType: [{ required: true, message: '请选择出库类型', trigger: 'change' }],
        outboundWarehouseId: [{ required: true, message: '请选择出库仓库', trigger: 'blur' }],
        inboundWarehouseId: [{ required: true, message: '请选择入库仓库', trigger: 'change' }],
        receiverName: [
          { required: true, message: '请输入收货人', trigger: 'blur' },
          { max: 10, message: '最大长度10个字符', trigger: 'blur' }
        ],
        receiverPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: regexps.phone.reg, message: regexps.phone.msg, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { max: 60, message: '最大长度60个字符', trigger: 'blur' }
        ],
        area: [{ required: true, message: '请选择收货地址', trigger: 'change' }],
        productList: [
          { type: 'array', required: true, message: '请选择商品', trigger: 'change' },
          { validator: productValidator, trigger: 'change' }
        ]
      },
      outboundTypeList: Object.keys(ioboundEnum.outboundType).map(key => {
        return ioboundEnum.outboundType[key];
      })
    };
  },

  computed: {
    ...mapState({
      warehouseList: 'warehouseList',
      stores: state => {
        return state.storeList;
      },
      curStore: state => {
        return state.curStore;
      }
    }),

    queryParams() {
      return this.filterRequestParams();
    },

    outboundType: {
      get() {
        return this.outBoundForm.outboundType && this.outBoundForm.outboundType.value;
      },
      set(val) {
        this.outBoundForm.outboundType = this.outboundTypeList.find(item => {
          return item.value === val;
        });
      }
    },
    /*是否为调拨出库*/
    isAllotOutbound() {
      return (
        this.outBoundForm.outboundType &&
        this.outBoundForm.outboundType.value === ioboundEnum.outboundType.RELOCATE_OUT.value
      );
    }
  },

  mounted() {
    if (!!this.outboundNo) {
      this.getBoundDetail();
    }
  },

  methods: {
    onSubmit(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.loading = true;
          const request = this.outboundNo
            ? inventoryMgrApi.updateOutbound(this.filterRequestParams())
            : inventoryMgrApi.outbound(this.filterRequestParams());
          request
            .then(result => {
              this.$router.push('/warehouse/inventory-mgr/outbound');
            })
            .always(() => {
              this.loading = false;
            });
        } else {
          this.$message.error('请将信息填写完整');
          return false;
        }
      });
    },

    //收货地址改变事件
    handleChange(areas, area) {
      this.areas = areas;
      this.outBoundForm.area = area;
    },

    getBoundDetail() {
      const params = {};
      params.outboundNo = this.outboundNo;
      params.needUsableStock = true;
      const request = inventoryMgrApi.outboundDetail(params);
      this.loading = true;
      request
        .then(result => {
          this.boundDetail = result.data;
          this.outboundType = this.boundDetail.type;
          this.boundDetail.itemList.forEach(item => {
            item.stock = item.stock || item.usableStock;
          });
          this.outBoundForm.productList = this.boundDetail.itemList;
          this.outBoundForm.outboundWarehouseId = this.boundDetail.warehouseId;
          this.outBoundForm.inboundWarehouseId = this.boundDetail.toWarehouseId;
          this.outBoundForm.remark = this.boundDetail.remark;
          //出库地址信息
          this.outBoundForm.address = this.boundDetail.address;
          this.outBoundForm.receiverPhone = this.boundDetail.receiverPhone;
          this.outBoundForm.receiverName = this.boundDetail.receiverName;
          let areas = [];
          if (this.boundDetail.provinceId) {
            areas.push(this.boundDetail.provinceId);
            if (this.boundDetail.cityId) {
              areas.push(this.boundDetail.cityId);
              if (this.boundDetail.districtId) {
                areas.push(this.boundDetail.districtId);
              }
            }
          }
          this.outBoundForm.area = areas;
        })
        .always(() => {
          this.loading = false;
        });
    },

    filterRequestParams() {
      const outboundParams = {};
      let outboundWarehouseName = null;
      let inboundWarehouseName = null;
      this.warehouseList.forEach(item => {
        if (this.outBoundForm.outboundWarehouseId === item.id) {
          outboundWarehouseName = item.name;
        }
        if (this.outBoundForm.inboundWarehouseId === item.id) {
          inboundWarehouseName = item.name;
        }
      });
      //如果出库类型不等于调拨出库
      if (!this.isAllotOutbound) {
        outboundParams.address = this.outBoundForm.address;
        outboundParams.receiverPhone = this.outBoundForm.receiverPhone;
        outboundParams.receiverName = this.outBoundForm.receiverName;
        const areas = this.areas;
        const province = areas[0];
        const city = areas[1];
        const district = areas[2];

        if (province) {
          outboundParams.provinceId = province.id;
          outboundParams.province = province.name;
        }
        if (city) {
          outboundParams.cityId = city.id;
          outboundParams.city = city.name;
        }
        if (district) {
          outboundParams.districtId = district.id;
          outboundParams.district = district.name;
        } else {
          //特别行政区和直辖市
          outboundParams.districtId = -1;
          outboundParams.district = '';
        }
      }
      outboundParams.warehouseId = this.outBoundForm.outboundWarehouseId;
      outboundParams.warehouseName = outboundWarehouseName;
      outboundParams.toWarehouseId = this.outBoundForm.inboundWarehouseId;
      outboundParams.toWarehouseName = inboundWarehouseName;
      if (this.outBoundForm.outboundType) {
        outboundParams.type = this.outBoundForm.outboundType.value;
      }

      if (this.outBoundForm.inboundStore) {
        outboundParams.toStoreId = this.outBoundForm.inboundStore.id;
        outboundParams.toStoreName = this.outBoundForm.inboundStore.name;
      }
      if (this.outboundNo) {
        outboundParams.outboundNo = this.outboundNo;
      }
      outboundParams.remark = this.outBoundForm.remark;
      outboundParams.itemList = [];
      this.outBoundForm.productList.forEach(product => {
        // 质保期格式转化为YYYY-MM-DD
        const ed = new Date(product.expirationDate);
        const eYear = ed.getFullYear();
        const em = ed.getMonth() + 1;
        const eMonth = em < 10 ? '0' + em : em;
        const eDate1 = ed.getDate();
        const eDate = eDate1 < 10 ? '0' + eDate1 : eDate1;
        const expirationDate = eYear + '-' + eMonth + '-' + eDate;

        outboundParams.itemList.push({
          barcode: product.barcode,
          categoryId: product.categoryId,
          itemAttribute: product.itemAttribute,
          itemName: product.itemName,
          itemNo: product.itemNo,
          itemUnit: product.itemUnit,
          thumbnail: product.thumbnail,
          skuId: product.skuId,
          count: product.count,
          batchNo: product.batchNo,
          expirationDate: expirationDate
        });
      });

      // 删除itemList中不合法的参数
      outboundParams.itemList.forEach(item => {
        Object.keys(item).forEach(key => {
          if (item[key] === '' || item[key] === null || item[key] === 'null') {
            delete item[key];
          }
        });
      });
      return outboundParams;
    }
  }
};
</script>

<style lang="less">
.new-outbound-container:after {
  content: '';
  height: 60px;
  display: block;
}
.new-outbound-container {
  background: #fff;
  .new-outbound-content {
    padding: 20px;
  }
}
.warehouseSelect {
  width: 215px;
  .el-input__inner {
    padding-left: 30px !important;
  }
}
.warehouse-tips {
  color: #A1A4AB;
}
.el-form-item__label {
  color: @ui-font-color-darkGrey;
}
</style>
