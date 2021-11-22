<template>
  <div class="purchase-inbound-container" v-loading="loading">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/warehouse/inventory-mgr/inbound' }">商品入库</el-breadcrumb-item>
      <el-breadcrumb-item>新建入库</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form
      :model="inBoundForm"
      class="purchase-inbound-content"
      ref="inBoundForm"
      :rules="inBoundRules"
      label-width="96px"
    >
      <el-form-item label="入库类型：" prop="type">
        <el-select
          v-model="inBoundForm.type"
          filterable
          :disabled="!!inboundNo"
          size="mini"
          @change="inBoundChange"
          class="warehouseSelect"
          placeholder="请选择"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
          <el-option v-for="item in inboundTypeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <!--仓库-->
      <el-form-item label="入库仓库：" prop="currentWarehouseId">
        <el-select
          v-model="inBoundForm.currentWarehouseId"
          filterable
          :disabled="!!inboundNo"
          size="mini"
          class="warehouseSelect"
          placeholder="请选择"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
          <el-option v-for="item in warehouseList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="供应商名称："
        prop="region"
        v-if="inBoundForm.type === ioboundEnum.inboundType.PURCHASE.value"
      >
        <el-select v-model="computeSupplier" size="mini" style="width: 215px" placeholder="请选择供应商">
          <el-option
            class="dss-query-select-dropdown__item"
            v-for="(item, index) in supplierList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="备注：" prop="remark">
        <el-input
          type="textarea"
          placeholder="请输入备注，不超过128个字符"
          :rows="3"
          maxlength="128"
          style="width: 460px"
          v-model="inBoundForm.remark"
        ></el-input>
        <span class="form-item-tip">{{ inBoundForm.remark.length }}/128</span>
      </el-form-item>

      <el-form-item label="选择商品：" prop="productList">
        <io-bound-product-table v-model="inBoundForm.productList" :queryparams="queryParams" iobound-type="purchase" />
      </el-form-item>

      <!--公用操作-->
      <!-- <el-form-item>
        <el-button type="primary"
                   @click="onSubmit('inBoundForm')">{{inboundNo?'保存':'创建'}}入库单
        </el-button>
      </el-form-item> -->
    </el-form>

    <div class="bottom-button">
      <el-button type="primary" @click="onSubmit('inBoundForm')">{{ inboundNo ? '保存' : '创建' }}入库单 </el-button>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import inventoryMgrApi from '@/dss-wechat3rd/src/api/retail/goodsMgr/inventoryMgrAPI.js';
  import supplierApi from '@/dss-wechat3rd/src/api/supplier.js';
  import goodsType from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
  import ioboundEnum from '@/dss-wechat3rd/src/constants/ioboundEnum';
  import IoBoundProductTable from '../../IoBoundProductTable';
  import datetime from '@/dss-common/utils/date.js';

  export default {
    name: 'PurchaseInbound',

    components: {
      IoBoundProductTable,
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

          // 验证批次
          if (!!v.batchNo && (v.batchNo.length > 32 || !/^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(v.batchNo))) {
            v.hasError = true;
            msg = '批次由字母、数字或汉字 组成，并且长度不可以超过32位';
          }

          // 验证质保期
          if (v.expirationDate) {
            if (!/^(\d{4})(-)(\d{2})(-)(\d{2})$/.test(v.expirationDate)) {
              v.hasError = true;
              msg = '请输入正确的日期格式，如：2019-05-31';
            } else {
              const arrDate = v.expirationDate.split('-');
              const year = parseInt(arrDate[0]);
              const month = parseInt(arrDate[1]);
              const date = parseInt(arrDate[2]);

              const expirationDate = new Date(v.expirationDate.replace(/-/g, '/')).getTime(); // 质保期时间戳
              const cd = new Date();
              const myYear = cd.getFullYear(); // 获取完整的年份(4位,1970-????)
              const myMonth = cd.getMonth() + 1; // 获取当前月份(0-11,0代表1月)
              const myDate = cd.getDate(); // 获取当前日(1-31)
              const currentDate = new Date(myYear + '-' + myMonth + '-' + myDate).getTime(); // 当前日期时间戳

              if (!/^([1-9]\d{3})$/.test(year)) {
                v.hasError = true;
                msg = '请输入正确的4位数年份，且首位不能为0';
              } else if (month < 1 || month > 12) {
                v.hasError = true;
                msg = '请输入正确的月份';
              } else if (date < 1 || date > 31) {
                v.hasError = true;
                msg = '请输入正确的日期';
              } else {
                const lastDateOfMonth = new Date(myYear, myMonth, 0).getDate();
                if (date > lastDateOfMonth) {
                  v.hasError = true;
                  msg = `日期输入有误，该月没有${date}天`;
                } else if (expirationDate < currentDate) {
                  v.hasError = true;
                  msg = '请输入正确的质保期，质保期不能小于当前日期';
                }
                /*
              if (date === 31 && month % 2 === 0) {
                v.hasError = true;
                msg = '日期输入有误，该月没有31天';
              } else if (date === 30 && month === 2) {
                v.hasError = true;
                msg = '日期输入有误，2月份没有30天';
              } else if (date === 29 && month === 2 && year % 400 !== 0) {
                v.hasError = true;
                msg = '日期输入有误，不是闰年的2月份没有29天';
              } else if (expirationDate < currentDate) {
                v.hasError = true;
                msg = '请输入正确的质保期，质保期不能小于当前日期';
              }
              */
              }
            }
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
        ioboundEnum,
        inBoundForm: {
          currentWarehouseId: null,
          productList: [],
          supplier: null,
          type: this.$route.query.type,
          remark: '',
        },
        inboundTypeList: Object.keys(ioboundEnum.inboundType)
          .map(key => {
            return ioboundEnum.inboundType[key];
          })
          .filter(item => item.value !== 12 && item.value !== 14),
        boundDetail: {},
        inboundNo: this.$route.query.inboundNo,
        supplierList: [],
        inBoundRules: {
          type: [{ required: true, message: '请选择入库类型', trigger: 'blur' }],
          currentWarehouseId: [{ required: true, message: '请选择仓库', trigger: 'blur' }],
          productList: [
            { type: 'array', required: true, message: '请选择商品', trigger: 'change' },
            { validator: productValidator, trigger: 'change' },
          ],
          remark: {
            max: 256,
            message: '最大长度256个字符',
          },
        },
      };
    },

    computed: {
      ...mapState({
        warehouseList: 'warehouseList',
      }),

      queryParams() {
        return this.filterRequestParams();
      },

      computeSupplier: {
        get() {
          return this.inBoundForm.supplier && this.inBoundForm.supplier.id;
        },
        set(val) {
          this.inBoundForm.supplier = this.supplierList.find(item => {
            return item.id === val;
          });
        },
      },
    },

    mounted() {
      const params = {
        status: 1,
        pageSize: 1000000,
        pageNo: 1,
      };
      supplierApi.supplier.query(params).then(result => {
        this.supplierList = result.data || [];
      });

      if (this.inboundNo) {
        this.getBoundDetail();
      }
    },

    methods: {
      inBoundChange() {
        if (this.inBoundForm.type === ioboundEnum.inboundType.RELOCATE_IN.value) {
          this.$router.push('/warehouse/inventory-mgr/inbound/allot-inbound');
        }
      },

      onSubmit(refName) {
        this.$refs[refName].validate(valid => {
          if (valid) {
            this.loading = true;
            if (this.inboundNo) {
              inventoryMgrApi
                .updateInbound(this.filterRequestParams())
                .then(result => {
                  this.$router.push('/warehouse/inventory-mgr/inbound');
                })
                .always(() => {
                  this.loading = false;
                });
            } else {
              inventoryMgrApi
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

      formatDate(time) {
        const date = new Date(time);
        return datetime.format(date, 'YYYY-MM-DD');
      },

      // 获取入库详情
      getBoundDetail() {
        const params = {};
        params.inboundNo = this.inboundNo;
        const request = inventoryMgrApi.inboundDetail(params);
        this.loading = true;
        request
          .then(result => {
            this.boundDetail = result.data;
            this.inBoundForm.currentWarehouseId = this.boundDetail.warehouseId;
            this.inBoundForm.productList = this.boundDetail.itemList;
            this.inBoundForm.remark = this.boundDetail.remark;
            this.inBoundForm.type = this.boundDetail.type;
            this.computeSupplier = this.boundDetail.supplierId;

            this.inBoundForm.productList.forEach(item => {
              item.batchNo = !!item.batchNo && item.batchNo !== '-1000' ? item.batchNo : null;
              item.expirationDate = item.expirationDate ? this.formatDate(item.expirationDate) : null;
            });
          })
          .always(() => {
            this.loading = false;
          });
      },

      // 序列化参数
      filterRequestParams() {
        const inboundParams = {};
        let warehouseName = null;
        this.warehouseList.forEach(item => {
          if (this.inBoundForm.currentWarehouseId === item.id) {
            warehouseName = item.name;
          }
        });
        inboundParams.warehouseId = this.inBoundForm.currentWarehouseId;
        inboundParams.warehouseName = warehouseName;
        inboundParams.type = this.inBoundForm.type;
        if (this.inBoundForm.supplier) {
          inboundParams.supplierId = this.inBoundForm.supplier.id;
        }
        if (this.inBoundForm.supplier) {
          inboundParams.supplierName = this.inBoundForm.supplier.supplierName;
        }
        inboundParams.remark = this.inBoundForm.remark;
        inboundParams.itemList = [];
        if (this.inboundNo) {
          inboundParams.inboundNo = this.inboundNo;
        }
        this.inBoundForm.productList.forEach(product => {
          inboundParams.itemList.push({
            barcode: product.barcode,
            itemName: product.itemName || product.name,
            itemNo: product.itemNo,
            giftNo: product.giftNo,
            itemAttribute: product.itemAttrAsStr,
            itemUnit: product.unit || product.itemUnit,
            thumbnail: product.thumbnail,
            categoryId: product.categoryId,
            skuId: product.skuId,
            count: product.count,
            batchNo: product.batchNo,
            expirationDate: product.expirationDate,
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
      },
    },
  };
</script>

<style lang="less">
  .purchase-inbound-container {
    background: #fff;
    min-height: calc(100vh - 205px);
    margin-bottom: 40px;

    .purchase-inbound-content {
      padding: 20px;
    }

    .el-textarea__inner {
      min-width: 460px;
      min-height: 180px !important;
    }

    .form-item-tip {
      color: #a8a6a6;
      font-size: 14px;

      &.error {
        color: red;
      }
    }
  }

  .warehouseSelect {
    .el-input__inner {
      padding-left: 30px !important;
    }
  }

  .goods-info {
    display: flex;
    align-items: center;

    img {
      margin-right: 20px;
      width: 100px;
      height: 100px;
    }
  }
</style>
