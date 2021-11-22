<template>
  <div class="new-user-gift">

    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/marketing/new-user-gift'}">新客进店好礼</el-breadcrumb-item>
      <el-breadcrumb-item>创建新客好礼方案</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="body">
      <div class="new-tips">
        <div>首次登陆小程序即赠送优惠券，获取用户好感，刺激用户消费。</div>
        <div class="tip-2">建议：在优惠券功能中创建几张优惠券，不放入领券中心，在此处调用。</div>
      </div>

      <div class="b-coupon">
        <el-form :model="form"
                 :rules="rules"
                 ref="form"
                 label-width="125px">

          <el-form-item label="活动名称:"
                        prop="activityName">
            <el-input class="activity-name"
                      placeholder="请输入活动名称"
                      size="small"
                      v-model="form.activityName">
            </el-input>
          </el-form-item>
          <el-form-item prop="time"
                        label="有效期范围：">
            <el-form-item prop="startTime">
              <el-date-picker v-model="form.startTime"
                              type="datetime"
                              placeholder="开始时间"
                              value-format="yyyy-MM-dd HH:mm"
                              format="yyyy-MM-dd HH:mm">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="endTime">
              <el-date-picker v-model="form.endTime"
                              type="datetime"
                              placeholder="结束时间"
                              value-format="yyyy-MM-dd HH:mm"
                              format="yyyy-MM-dd HH:mm">
              </el-date-picker>
            </el-form-item>
          </el-form-item>

          <el-form-item prop="suitStoreType"
                        label="参与活动的门店:">
            <el-radio-group v-model="form.suitStoreType">
              <el-radio :label="suitStoreTypeEnum.all">全部门店</el-radio>
              <el-radio :label="suitStoreTypeEnum.part">单个门店</el-radio>
              <el-button v-if="form.suitStoreType === suitStoreTypeEnum.part"
                         @click="handleSelectStore()">选择门店
              </el-button>
            </el-radio-group>
          </el-form-item>

          <div class="store-list-box"
               v-if="form.store && form.store.id && form.suitStoreType === suitStoreTypeEnum.part">
            <div class="store-label">已选门店</div>
            <div class="store-content">
              <el-tag @close="handleDelStoreItem()"
                      closable>
                {{form.store.name}}
              </el-tag>
            </div>
          </div>

          <el-button class="choose-coupon-btn"
                     @click="onChoose">
            选择优惠券
          </el-button>

          <el-form-item v-if="form.couponTableData && form.couponTableData.length"
                        prop="couponTableData">
            <div class="table">
              <coupon-table v-model="form.couponTableData"
                            :coupons="form.couponTableData" />
            </div>
          </el-form-item>

          

          <span class="add-warn"
                v-if="saveTip">
            {{form.couponTableData.length ? '' : '* 请至少选择一张优惠券'}}
          </span>
        </el-form>

      </div>

    </div>

    <div class="bottom-button">
      <el-button @click="onGiveUp">取消</el-button>
      <el-button type="primary"
                  class="save-btn"
                  size="small"
                  @click="onSave">
        保存
      </el-button>
    </div>

    <coupon-select-dialog v-model="showSelectCouponDialog"
                          :selected-coupons="form.couponTableData"
                          @selected="onCouponItemsSelected"
                          :ext-params="extParams">
    </coupon-select-dialog>

    <store-select-dialog api-url="/wp/store/query/dept"
                         :selected-stores="form.storeList"
                         :enable-multiple="false"
                         v-model="showStoreDialog"
                         @single-choosed="onSingleStoreChoosed">

    </store-select-dialog>
  </div>
</template>

<script>
import CouponTable from './coupon-table.vue';
import CouponSelectDialog from '@/dss-wechat3rd/src/bz_components/coupon-select-dialog/index.vue';
import GoodsListFilter from '@/dss-wechat3rd/src/components/goods/GoodsListFilter';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import NewUserGiftApi from '@/dss-wechat3rd/src/api/marketingAPI.js';
import StoreSelectDialog from '@/dss-wechat3rd/src/bz_components/store-select-dialog/index.vue';
import suitStoreTypeEnum from '@/dss-wechat3rd/src/constants/suitStoreTypeEnum.js';
import regex from '@/dss-wechat3rd/src/constants/regex';

export default {
  components: {
    CouponTable,
    CouponSelectDialog,
    GoodsListFilter,
    StoreSelectDialog
  },

  data() {
    const checkNum = (rule, value, callback) => {
      value.forEach(v => {
        if (!v.quantitys) {
          return callback('请输入赠送数量');
        } else if (!regex.quantity.reg.test(v.quantitys)) {
          return callback(regex.quantity.msg);
        }
      });
      return callback();
    };
    const storeValidator = (rule, value, callback) => {
      if (value === suitStoreTypeEnum.all) {
        return callback();
      } else if (value === suitStoreTypeEnum.part) {
        if (this.form.store && this.form.store.id) {
          return callback();
        } else {
          return callback(Error('请选择门店'));
        }
      }
    };
    const timeValidator = (rule, value, callback) => {
      return callback();
    };
    return {
      suitStoreTypeEnum,
      showSelectCouponDialog: false,
      showStoreDialog: false,
      goodsTypeEnum,
      filterCouponName: null,
      extParams: null,
      showSaveTip: false,
      groupStoreList: null,
      form: {
        activityName: null,
        couponTableData: [],
        suitStoreType: suitStoreTypeEnum.all,
        store: null,
        startTime: '',
        endTime: ''
      },
      rules: {
        activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        suitStoreType: [{ required: true, validator: storeValidator, trigger: 'change' }],
        time: [{ required: true, validator: timeValidator }],
        startTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        endTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
        couponTableData: [{ validator: checkNum, trigger: 'change' }]
      },
      limitType: 0 //0为一直有效，1为时间段
    };
  },

  computed: {
    saveTip() {
      return this.form.couponTableData.length === 0 && this.showSaveTip;
    }
  },

  watch: {
    'form.store': {
      handler() {
        this.$nextTick(() => {
          this.$refs.form.validateField('suitStoreType');
        });
      }
    }
  },

  methods: {
    onChoose() {
      //如果部分门店参与
      if (this.form.suitStoreType === suitStoreTypeEnum.part && (!this.form.store || !this.form.store.id)) {
        this.$message('请选择门店');
        return;
      }
      if (this.form.suitStoreType === suitStoreTypeEnum.part) {
        this.extParams = {
          suitStoreType: 0,
          storeIds: this.form.store.id
        };
      } else {
        this.extParams = {
          suitStoreType: 0
        };
      }
      this.showSelectCouponDialog = true;
    },

    onSingleStoreChoosed(store) {
      this.form.store = store;
    },

    onFilter() {
      this.extParams = {
        name: this.filterCouponName,
        suitStoreType: 0,
        status: 1
      };
    },
    onCouponItemsSelected(coupons) {
      this.form.couponTableData = coupons;
    },

    handleSelectStore() {
      this.showStoreDialog = true;
    },

    handleDelStoreItem() {
      this.form.store = null;
    },

    onSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.couponTableData.length === 0) {
            this.showSaveTip = true;
            return;
          }
          this.createNewUserGiftActivity();
        } else {
          return false;
        }
      });
    },

    createNewUserGiftActivity() {
      let couponList = [];
      this.form.couponTableData.forEach(item => {
        couponList.push({
          couponInfoId: item.id,
          couponAmount: item.quantitys
        });
      });
      let params = {
        name: this.form.activityName,
        suitStoreType: this.form.suitStoreType,
        couponList: couponList,
        startTime: this.form.startTime,
        endTime: this.form.endTime
      };

      if (this.form.suitStoreType === suitStoreTypeEnum.part) {
        params.suitStoreType = 0;
        params.storeIds = this.form.store.id;
      }

      NewUserGiftApi.createNewUserGiftActivity(params)
        .then(res => {
          if (!!res && res.data) {
            this.$message({
              message: '创建成功',
              type: 'success'
            });
          }
          this.$router.back(-1);
        })
        .catch(err => {});
    },
    //取消时返回上一页
    onGiveUp() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less">
@import '../../../../../../dss-common/style/wkt-constants.less';
@header: 48px; //头部高度
@scroll: 17px; //滚动条高度
@footerHeight: 44px; //footer高度
@titleHeight: 58px; //标题高度
.new-user-gift {
  font-family: MicrosoftYaHei;
  background: #fff;
  min-height: calc(100vh - @header - @footerHeight - @titleHeight - 10px);
  margin-bottom: 20px;

  .store-list-box {
    margin-bottom: 20px;
    width: 800px;

    .store-label {
      height: 30px;
      line-height: 30px;
      background: @bg-color;
      padding-left: 23px;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: @black-color;
    }

    .store-content {
      max-height: 303px;
      border: 1px solid @border-color;
      padding: 14px 8px;
      overflow: auto;

      .store-item-box {
        display: inline-block;
        vertical-align: top;
        margin-right: 50px;
      }

      .el-tag + .el-tag {
        margin-top: 15px;
      }
    }
  }

  .body {
    padding: 20px;
  }

  .new-tips {
    max-width: 900px;
    background: rgba(46, 141, 255, 0.06);
    border: 1px solid @border-color;
    padding: 20px;
    font-size: @small-font;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: @black-color;
    float: none;
    .tip-2 {
      margin-top: 10px;
    }
  }

  .b-coupon {
    margin-top: 30px;

    .activity-name {
      width: 200px;
      margin-right: 10px;
    }

    .choose-coupon-btn {
      margin-top: 20px;
    }

    .add-warn {
      margin-left: 10px;
      color: @red-color;
    }

    .table {
      margin-top: 20px;
      max-width: 800px;
    }

    .save-btn {
      margin-top: 20px;
    }
  }

  .filter-title {
    font-size: 16px;
    color: black;
    font-weight: 500;
  }

  .filter-input {
    margin: 0 30px;
    display: inline-block;
    width: 300px;
  }
}
</style>

